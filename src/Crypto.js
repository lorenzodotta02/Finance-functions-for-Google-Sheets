function cryptoPrice(symbol) {
  var url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
  var apiKey = PropertiesService.getScriptProperties().getProperty('CMC_API_KEY'); 
  
  if (!apiKey) {
    throw new Error("Missing API key for CoinMarketCap. Add it to Script Properties:\n" +
                    "property = CMC_API_KEY\n" +
                    "value    = Your API Key");
  }

  var headers = {
    "X-CMC_PRO_API_KEY": apiKey,
    "Accept": "application/json"
  };

  var parameters = {
    "symbol": symbol,
    "convert": "EUR"
  };

  var queryString = Object.keys(parameters)
    .map(function(key) { return key + '=' + encodeURIComponent(parameters[key]); })
    .join('&');

  try {
    var response = UrlFetchApp.fetch(url + "?" + queryString, { 'headers': headers, muteHttpExceptions: true });
    
    if (response.getResponseCode() !== 200) {
      throw new Error("HTTP error: " + response.getResponseCode());
    }
    
    var json;
    try {
      json = JSON.parse(response.getContentText());
    } catch (parseErr) {
      throw new Error("Invalid JSON response: " + parseErr.message);
    }

    if (!json.data || !json.data[symbol] || !json.data[symbol].quote || !json.data[symbol].quote.EUR) {
      throw new Error("Crypto not found or invalid API response: " + response.getContentText());
    }

    var price = json.data[symbol].quote.EUR.price;
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