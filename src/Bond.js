function bondPrice(isin) {
  var url = 'https://www.borsaitaliana.it/borsa/obbligazioni/mot/obbligazioni-in-euro/scheda/' + isin + '.html?lang=it';

  try {
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) {
      throw new Error("HTTP error: " + response.getResponseCode());
    }

    var content = response.getContentText();
    var regex = /(\d{2,3},\d{1,3})/;
    var matches = content.match(regex);

    if (!matches || matches.length === 0) {
      throw new Error("Price not found");
    }

    var priceStr = matches[0];
    var price = parseFloat(priceStr.replace(/\./g, '').replace(',', '.'));

    if (isNaN(price)) {
      throw new Error("Invalid price: " + priceStr);
    }

    if (price === 0) {
      throw new Error("Price is 0 bond not traded");
    }

    savePrice(isin, price);
    return price;

  } catch (err) {
    Logger.log("Error during fetch/price: " + err.message);
    return loadPrice(isin);
  }
}