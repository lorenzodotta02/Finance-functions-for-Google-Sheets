function goldPrice() {
  var url = 'https://www.teleborsa.it/valute/gold-spot-xauusd-RjAuWEFVVVNE';

  try {
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) {
      throw new Error("HTTP error: " + response.getResponseCode());
    }

    var html = response.getContentText();
    var pMatches = html.match(/<p[^>]*>(.*?)<\/p>/gi);
    var text = '';

    if (pMatches) {
      text = pMatches.map(function(p) {
        return p.replace(/<[^>]+>/g, '');
      }).join(' ');
    }

    var regex = /(\d{1,3},\d{3})/;
    var priceMatch = text.match(regex);
    var priceStr = priceMatch ? priceMatch[1] : '';

    if (!priceStr) {
      throw new Error("Gold price not found in the page, using saved price");
    }

    var price = parseFloat(priceStr.replace(/\./g, '').replace(',', '.'));

    if (isNaN(price) || price <= 0) {
      throw new Error("Invalid gold price extracted: " + priceStr);
    }

    savePrice("Last gold price", price);
    return price;

  } catch (err) {
    Logger.log("Error fetching gold price: " + err.message);
    return loadPrice("Last gold price");
  }
}