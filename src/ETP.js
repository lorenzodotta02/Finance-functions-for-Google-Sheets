function etpPrice(isin) {
  const url = "https://www.justetf.com/api/etfs/" + isin + "/quote?locale=en&currency=EUR";
  
  try {
    Logger.log("Fetching ETP price from: " + url);
    const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

    if (resp.getResponseCode() !== 200) {
      throw new Error("HTTP error: " + resp.getResponseCode());
    }

    let data;
    try {
      data = JSON.parse(resp.getContentText());
    } catch (parseErr) {
      throw new Error("Invalid JSON response: " + parseErr.message);
    }

    if (!data.latestQuote || typeof data.latestQuote.raw !== "number") {
      throw new Error("ETP price not found in response");
    }

    const price = data.latestQuote.raw;
    const date = data.latestQuoteDate;
    const venue = data.quoteTradingVenue;

    if (isNaN(price) || price <= 0) {
      throw new Error("Invalid ETP price: " + price);
    }

    savePrice(isin, price);
    Logger.log("ISIN: %s | Price: %s | Date: %s | Exchange: %s", isin, price, date, venue);
    return price;

  } catch (err) {
    Logger.log("Error fetching ETP price (" + isin + "): " + err.message);
    return loadPrice(isin);
  }
}