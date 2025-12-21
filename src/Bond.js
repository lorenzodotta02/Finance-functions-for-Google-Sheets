function bondPrice(isin, stockExchange) {
  Logger.log(isin);
  var urlIntraday = URL_EURONEXT_INTRADAY + isin + "-" + stockExchange + "/full";
  try {
    var r1 = UrlFetchApp.fetch(urlIntraday, { muteHttpExceptions: true });
    var code1 = r1.getResponseCode();
    Logger.log("Intraday HTTP Status: " + code1);

    if (code1 === 200) {
      var html1 = r1.getContentText();

      var m1 = html1.match(REGEX_EURONEXT_LAST_TRADED);
      if (m1) {
        var priceStr = m1[1].trim();
        var price = parseFloat(priceStr.replace(",", "."));

        if (!isNaN(price) && price > 0) {
          savePrice(isin, price);
          return price;
        }
      }
    }

    Logger.log("Last Traded not found");

    var urlFallback = URL_EURONEXT_FALLBACK + isin + "-" + stockExchange;
    var r2 = UrlFetchApp.fetch(urlFallback, { muteHttpExceptions: true });
    var code2 = r2.getResponseCode();
    Logger.log("Fallback HTTP Status: " + code2);

    if (code2 !== 200) throw new Error("Fallback HTTP error: " + code2);

    var html2 = r2.getContentText();
    var m2 = html2.match(REGEX_EURONEXT_VALUATION_CLOSE);

    if (!m2) throw new Error("Valuation Close price not found");

    var closeStr = m2[1].trim();
    var closePrice = parseFloat(closeStr.replace(",", "."));

    if (isNaN(closePrice)) throw new Error("Invalid close price: " + closeStr);

    savePrice(isin, closePrice);
    return closePrice;

  } catch (err) {
    Logger.log("ERROR bondPrice(): " + err.message);
    return loadPrice(isin);
  }
}
