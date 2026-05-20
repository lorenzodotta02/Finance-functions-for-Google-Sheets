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