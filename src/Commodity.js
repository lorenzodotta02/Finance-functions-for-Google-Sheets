function commodityPrice(name) {
  name = name.toLowerCase().trim();

  const urls = {
    gold: "https://www.teleborsa.it/valute/gold-spot-xauusd-RjAuWEFVVVNE",
    silver: "https://www.teleborsa.it/valute/silver-spot-xagusd-RjAuWEFHVVNE",
    palladium: "https://www.teleborsa.it/valute/palladium-spot-xpdusd-RjAuWFBEVVNE",
    platinum: "https://www.teleborsa.it/valute/platinum-spot-xptusd-RjAuWFBUVVNE" 
  };

  const url = urls[name];
  if (!url) throw new Error(`Commodity not supported: ${name}`);

  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) {
      throw new Error("HTTP error: " + response.getResponseCode());
    }

    const html = response.getContentText();

    const pMatches = html.match(/<p[^>]*>(.*?)<\/p>/gi);
    let text = '';
    if (pMatches) {
      text = pMatches.map(p => p.replace(/<[^>]+>/g, '')).join(' ');
    }

    var regex = /(\d{1,3},\d{2,3})/;
    const priceMatch = text.match(regex);
    const priceStr = priceMatch ? priceMatch[1] : '';

    if (!priceStr) {
      throw new Error(`${name} price not found in the page, using saved price`);
    }

    const price = parseFloat(priceStr.replace(/\./g, '').replace(',', '.'));

    if (isNaN(price) || price <= 0) {
      throw new Error(`Invalid ${name} price extracted: ${priceStr}`);
    }

    savePrice(`Last ${name} price`, price);
    return price;

  } catch (err) {
    Logger.log(`Error fetching ${name} price: ${err.message}`);
    return loadPrice(`Last ${name} price`);
  }
}
