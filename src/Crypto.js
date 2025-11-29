function cryptoPrice(symbol) {

  var url = URL_CMC_QUOTES;
  var apiKey = PropertiesService.getScriptProperties().getProperty(PROP_CMC_API_KEY);
  if (!apiKey) {
    throw new Error(
      "Missing API key for CoinMarketCap. Add it to Script Properties:\n" +
      "property = " + PROP_CMC_API_KEY + "\nvalue    = Your API Key"
    );
  }

  var headers = {
    [HEADER_CMC_APIKEY]: apiKey,
    "Accept": HEADER_CMC_ACCEPT
  };

  var parameters = {
    "symbol": symbol,
    "convert": CMC_CONVERT_TO
  };

  var queryString = Object.keys(parameters)
    .map(function (key) {
      return key + '=' + encodeURIComponent(parameters[key]);
    })
    .join('&');

  try {
    var response = UrlFetchApp.fetch(url + "?" + queryString, {
      headers: headers,
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      throw new Error("HTTP error: " + response.getResponseCode());
    }

    var json;
    try {
      json = JSON.parse(response.getContentText());
    } catch (parseErr) {
      throw new Error("Invalid JSON response: " + parseErr.message);
    }

    if (!json.data ||
      !json.data[symbol] ||
      !json.data[symbol].quote ||
      !json.data[symbol].quote[CMC_CONVERT_TO]) {
      throw new Error("Crypto not found or invalid API response: " + response.getContentText());
    }

    var price = json.data[symbol].quote[CMC_CONVERT_TO].price;

    if (typeof price !== "number" || isNaN(price) || price <= 0) {
      throw new Error("Invalid price received: " + price);
    }

    savePrice(symbol, price);

    return price;

  } catch (err) {
    Logger.log("Error in cryptoPrice(" + symbol + "): " + err.message);
    return loadPrice(symbol);
  }
}
