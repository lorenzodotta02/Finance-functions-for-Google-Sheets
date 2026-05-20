function etpPriceByIsinAndExchange(isin, mic, currency) {
  const key = isin + "_" + mic;

  const cfg = MIC_TABLE[mic];
  if (!cfg) throw new Error("Unsupported MIC: " + mic);

  if (currency && mic.toUpperCase() !== "XLON") {
    throw new Error(
      "'currency' parameter is only supported for XLON (London Stock Exchange). " +
      "Received exchange: " + mic
    );
  }

  try {
    const targetExchange = cfg.jetf.toUpperCase();

    if (targetExchange === EXCHANGE_TRADEGATE) {
      const price = fetchTradegatePrice(isin);
      if (!price) throw new Error("TRADEGATE: no price");

      savePrice(key, price);
      return price;
    }

    const ticker = resolveTickerByExchange(isin, targetExchange, currency);
    if (!ticker) throw new Error("Ticker not found for " + targetExchange);

    if (targetExchange === EXCHANGE_GETTEX) {
      const ric = ticker + GETTEX_RIC_SUFFIX;
      Logger.log("GETTEX RIC: " + ric);

      const price = etpPriceGettex(isin, ric);
      if (!price) throw new Error("GETTEX: no price");

      savePrice(key, price);
      return price;
    }

    if (targetExchange === EXCHANGE_LSE) {
      const price = etpPriceLSE(ticker);
      if (!price) throw new Error("LSE: no price");

      savePrice(key, price);
      return price;
    }

    if (!cfg.yf) throw new Error("Yahoo Finance suffix missing for MIC: " + mic);

    const yfTicker = ticker + cfg.yf;
    const price = fetchYahooPrice(yfTicker);
    if (!price) throw new Error("Yahoo Finance: no price for " + yfTicker);

    savePrice(key, price);
    return price;

  } catch (e) {
    Logger.log("ETP ERROR (" + key + "): " + e.message);
    return loadPrice(key);
  }
}

function etpPriceGettex(isin, ric) {
  try {
    if (!ric) throw new Error("Missing RIC");
    return getGettexMidPriceFromBidAsk(ric);
  } catch (e) {
    Logger.log("GETTEX error (" + isin + "): " + e.message);
    return null;
  }
}

function etpPriceLSE(ticker) {
  const url = URL_LSE + encodeURIComponent(ticker);

  try {
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
    Logger.log("LSE error (" + ticker + "): " + e.message);
    return null;
  }
}

function etpPriceByIsin(isin) {
  try {
    const url = URL_JUSTETF_QUOTE + isin + "/" + JUSTETF_QUOTE_PARAMS;
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

function fetchYahooPrice(ticker) {
  try {
    const url = URL_YF + encodeURIComponent(ticker);
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

    if (res.getResponseCode() !== 200)
      throw new Error("HTTP " + res.getResponseCode());

    const data = JSON.parse(res.getContentText());
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;

    if (!price || isNaN(price))
      throw new Error("Invalid Yahoo Finance price");

    return price;

  } catch (e) {
    Logger.log("Yahoo Finance error (" + ticker + "): " + e.message);
    return null;
  }
}

function resolveTickerByExchange(isin, targetExchange, currency) {
  const list = getTickersFromJustETF(isin);
  if (!list || !list.length) return null;

  const matches = list.filter(r =>
    r.Exchange?.toUpperCase().includes(targetExchange)
  );
  if (!matches.length) return null;

  if (currency) {
    const cur = currency.toUpperCase();
    const currencyRows = matches.filter(r => r.Currency?.toUpperCase() === cur);

    if (currencyRows.length) {
      const valid = currencyRows.find(r => r.Ticker && r.Ticker !== "-");
      if (!valid)
        throw new Error("ETF not traded on " + targetExchange + " in currency " + cur);
      return valid.Ticker.trim();
    }

    throw new Error("Currency " + cur + " not available on " + targetExchange);
  }

  const firstValid = matches.find(r => r.Ticker && r.Ticker !== "-");
  return firstValid ? firstValid.Ticker.trim() : null;
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
