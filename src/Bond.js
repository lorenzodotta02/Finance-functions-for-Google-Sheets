function bondPrice(isin, stockExchange) {
  if (!isin || isin.trim() === "") {
    throw new Error("bondPrice: missing ISIN.");
  }
  if (!stockExchange || stockExchange.trim() === "") {
    throw new Error("bondPrice: missing MIC (stock exchange).");
  }

  try {
    let price;

    if (stockExchange === "XMUN") {
      price = bondPriceGettexByIsin(isin);
    } else if (stockExchange === "TGAT") {
      price = fetchTradegatePrice(isin);
    } else if (stockExchange === "MOTX" || stockExchange === "XMOT") {
      price = bondPriceBorsaItaliana(isin);
    } else if (stockExchange === "XLON") {
      price = bondPriceLSE(isin);
    } else {
      price = bondPriceEuronext(isin, stockExchange);
    }

    if (!price) throw new Error("Price not available.");

    savePrice(isin + "_" + stockExchange, price);
    return price;

  } catch (err) {
    Logger.log("ERROR bondPrice(" + isin + "@" + stockExchange + "): " + err.message);
    return loadPrice(isin + "_" + stockExchange);
  }
}

function bondPriceBorsaItaliana(isin) {
  try {
    const response = UrlFetchApp.fetch(URL_BOND + isin + ".html?lang=it", { muteHttpExceptions: true });

    if (response.getResponseCode() !== 200) {
      throw new Error("HTTP error: " + response.getResponseCode());
    }

    const matches = response.getContentText().match(REGEX_BOND_PRICE);
    if (!matches || matches.length === 0) throw new Error("Price not found.");

    const price = parseFloat(matches[0].replace(/\./g, '').replace(',', '.'));
    if (isNaN(price)) throw new Error("Invalid price: " + matches[0]);
    if (price === 0) throw new Error("Price is 0: bond not traded.");

    return price;

  } catch (err) {
    Logger.log("ERROR bondPriceBorsaItaliana(" + isin + "): " + err.message);
    return null;
  }
}

function getRicFromIsinGettex(isin) {
  try {
    const url =
      "https://lseg-widgets.financial.com/rest/api/find/securities" +
      "?search=" + encodeURIComponent(isin) +
      "&searchFor=ISIN&exchanges=GTX&fids=q.RIC,x._TYPE,x._ISIN&pageSize=5&pageNo=0";

    const rows = lsegFetch(url, getGettexJwt())?.data;
    if (!rows || rows.length === 0) throw new Error("No RIC found.");

    const ric = (rows.find(r => r["x._TYPE"] === "BOND") || rows[0])["q.RIC"];
    if (!ric) throw new Error("RIC missing.");

    return ric;

  } catch (e) {
    Logger.log("ERROR getRicFromIsinGettex(" + isin + "): " + e.message);
    return null;
  }
}

function bondPriceGettexByIsin(isin) {
  try {
    const ric = getRicFromIsinGettex(isin);
    if (!ric) return null;
    return getGettexBondLastPrice(ric);
  } catch (e) {
    Logger.log("ERROR bondPriceGettexByIsin(" + isin + "): " + e.message);
    return null;
  }
}

function getTidmFromIsinLSE(isin) {
  try {
    const url =
      URL_LSE_BOND_AUTOCOMPLETE +
      "?q=" + encodeURIComponent(isin) +
      "&size=3";

    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) {
      throw new Error("HTTP error: " + response.getResponseCode());
    }

    const json = JSON.parse(response.getContentText());
    const instruments = json?.instruments;
    if (!instruments || instruments.length === 0) throw new Error("No instrument found.");

    const bond = instruments.find(i => i.category === LSE_BOND_CATEGORY) || instruments[0];
    if (bond.category !== LSE_BOND_CATEGORY) {
      throw new Error("ISIN found but not categorized as BONDS (category: " + bond.category + ").");
    }

    const tidm = bond.tidm;
    if (!tidm) throw new Error("TIDM missing in response.");

    return tidm;

  } catch (e) {
    Logger.log("ERROR getTidmFromIsinLSE(" + isin + "): " + e.message);
    return null;
  }
}

function bondPriceLSE(isin) {
  try {
    const tidm = getTidmFromIsinLSE(isin);
    if (!tidm) throw new Error("TIDM not found for ISIN.");

    const url = URL_LSE + encodeURIComponent(tidm);
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

    if (res.getResponseCode() !== 200)
      throw new Error("HTTP " + res.getResponseCode());

    const data = JSON.parse(res.getContentText());

    if (!data || !data[KEY_LSE_TIDM])
      throw new Error("Invalid LSE payload");

    const price =
      data[KEY_LSE_LASTPRICE] ??
      data[KEY_LSE_MIDPRICE]  ??
      data[KEY_LSE_LASTCLOSE] ??
      (data[KEY_LSE_BID] && data[KEY_LSE_OFFER]
        ? (data[KEY_LSE_BID] + data[KEY_LSE_OFFER]) / 2
        : null);

    if (typeof price !== "number" || isNaN(price) || price <= 0)
      throw new Error("Invalid LSE price value");

    return price;

  } catch (e) {
    Logger.log("ERROR bondPriceLSE(" + isin + "): " + e.message);
    return null;
  }
}

function bondPriceEuronext(isin, stockExchange) {
  const maxRetries = 8;
  const retryDelayMs = 5000;

  const url =
    URL_EURONEXT_API +
    "?isin=" + encodeURIComponent(isin) +
    "&mic=" + encodeURIComponent(stockExchange);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const r = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = r.getResponseCode();

    if (code !== 200) throw new Error("Euronext HTTP error: " + code);

    const json = JSON.parse(r.getContentText());
    const price = json?.price;

    if (price && !isNaN(price)) return price;

    if (json?.status === "pending") {
      Logger.log("Euronext pending, attempt " + attempt + "/" + maxRetries);
      Utilities.sleep(retryDelayMs);
      continue;
    }

    throw new Error("Euronext invalid response: " + JSON.stringify(json));
  }

  throw new Error("Euronext timeout after " + maxRetries + " attempts.");
}
