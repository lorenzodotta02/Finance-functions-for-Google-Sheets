function etpPriceByIsin_stockExchange(isin, mic) {
  const key = isin + "_" + mic;

  try {
    const cfg = MIC_TABLE[mic];
    if (!cfg) throw new Error("Unsupported MIC " + mic);

    const targetExchange = cfg.jetf.toUpperCase();

    if (targetExchange === "TRADEGATE") {
      const price = etpPriceTradegate(isin);
      if (!price) throw new Error("TRADEGATE no price");

      savePrice(key, price);
      return price;
    }

    const tickerData = resolveTickerByExchange(isin, targetExchange);
    if (!tickerData) throw new Error("Ticker not found for " + targetExchange);

    if (targetExchange === "GETTEX") {
      const ric = tickerData + ".GTX";
      Logger.log("GETTEX RIC: " + ric);

      const price = etfPriceGettex(isin, ric);
      if (!price) throw new Error("GETTEX no price");

      savePrice(key, price);
      return price;
    }

    if (!cfg.yf) throw new Error("Yahoo suffix missing for " + mic);

    const yfTicker = tickerData + cfg.yf;
    const price = fetchYahooPrice(yfTicker);

    if (!price) throw new Error("Yahoo no price " + yfTicker);

    savePrice(key, price);
    return price;

  } catch (e) {
    Logger.log("ETP ERROR (" + key + "): " + e.message);
    return loadPrice(key);
  }
}

function resolveTickerByExchange(isin, targetExchange) {
  const list = getTickersFromJustETF(isin);
  if (!list || !list.length) return null;

  const match = list.find(r =>
    r.Exchange?.toUpperCase().includes(targetExchange)
  );

  if (!match || !match.Ticker || match.Ticker === "-") return null;

  return match.Ticker.trim();
}

function fetchYahooPrice(ticker) {
  try {
    const url = URL_YF + encodeURIComponent(ticker);
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

    if (res.getResponseCode() !== 200)
      throw new Error("HTTP " + res.getResponseCode());

    const data = JSON.parse(res.getContentText());
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;

    if (!price || isNaN(price))
      throw new Error("Invalid YF price");

    return price;

  } catch (e) {
    Logger.log("Yahoo fetch error (" + ticker + "): " + e.message);
    return null;
  }
}

function etfPriceGettex(isin, ric) {
  try {
    const sid = getGettexSid();
    if (!sid) throw new Error("Missing SID");

    const tkResp = UrlFetchApp.fetch(URL_GETTEX_TOKEN, {
      method: "post",
      headers: {
        "sid": sid,
        "accept": "application/json",
        "origin": "https://www.gettex.de",
        "referer": "https://www.gettex.de/"
      },
      muteHttpExceptions: true
    });

    const jwt = tkResp.getContentText().trim();
    if (!jwt.startsWith("eyJ")) throw new Error("Invalid JWT");

    const quoteUrl =
      URL_GETTEX_QUOTE +
      "?rics=" + encodeURIComponent(ric) +
      "&fids=q._BID,q._ASK,x.RIC";

    const qResp = UrlFetchApp.fetch(quoteUrl, {
      headers: { "accept": "application/json", "jwt": jwt },
      muteHttpExceptions: true
    });

    const data = JSON.parse(qResp.getContentText());

    const q = data?.data?.[0];
    if (!q) throw new Error("Missing RIC data");

    const bid = parseFloat(String(q["q._BID"]).replace("+", ""));
    const ask = parseFloat(String(q["q._ASK"]).replace("+", ""));

    if (isNaN(bid) || isNaN(ask))
      throw new Error("Invalid bid/ask");

    return (bid + ask) / 2;

  } catch (e) {
    Logger.log("GETTEX error (" + isin + "): " + e.message);
    return null;
  }
}

function getGettexSid() {
  var url = URL_GETTEX_SID;
  var options = {
    'method': 'get',
    'muteHttpExceptions': true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());

    if (json.status === "success" && json.sid) {
      Logger.log("SID: " + json.sid);
      return json.sid;
    } else {
      Logger.log("Error or SID not found: " + response.getContentText());
      return null;
    }
  } catch (e) {
    Logger.log("Connection error: " + e.toString());
    return null;
  }
}

function etpPriceTradegate(isin) {
  const url = URL_TRADEGATE + encodeURIComponent(isin);

  try {
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

    if (res.getResponseCode() !== 200)
      throw new Error("HTTP " + res.getResponseCode());

    const data = JSON.parse(res.getContentText());
    const lastRaw = data?.last;
    if (!lastRaw) throw new Error("Missing last");

    const last = parseFloat(String(lastRaw).replace(",", "."));

    if (isNaN(last))
      throw new Error("Invalid price after conversion");

    return last;

  } catch (e) {
    Logger.log("TRADEGATE error (" + isin + "): " + e.message);
    return null;
  }
}

function etpPriceByIsin(isin) {
  try {
    const url = URL_JUSTETF_QUOTE + isin + "/quote?locale=en&currency=EUR";

    const resp = UrlFetchApp.fetch(url, HTTP_OPTIONS);
    if (resp.getResponseCode() !== 200)
      throw new Error("HTTP " + resp.getResponseCode());

    const data = JSON.parse(resp.getContentText());
    const price = data?.[KEY_LATEST_QUOTE]?.[KEY_LATEST_QUOTE_RAW];

    if (!price || isNaN(price))
      throw new Error("Invalid JustETF price");

    savePrice(isin, price);
    return price;

  } catch (e) {
    Logger.log("JUSTETF error (" + isin + "): " + e.message);
    return loadPrice(isin);
  }
}

function etpPriceByTicker(ticker) {
  const key = "YF_" + ticker;

  try {
    const price = fetchYahooPrice(ticker);
    if (!price) throw new Error("No price");

    savePrice(key, price);
    return price;

  } catch (e) {
    Logger.log("Ticker error (" + ticker + "): " + e.message);
    return loadPrice(key);
  }
}
