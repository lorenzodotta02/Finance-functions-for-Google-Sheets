function fundPriceByIsin(isin) {
  const key = "FUND_" + isin;

  try {
    const url = URL_AMUNDI_SECONDAPENSIONE + encodeURIComponent(isin);

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ fields: AMUNDI_FIELD_SELECTION }),
      muteHttpExceptions: true
    };

    const res = UrlFetchApp.fetch(url, options);

    if (res.getResponseCode() !== 200)
      throw new Error(ERR_HTTP + res.getResponseCode());

    let data;
    try {
      data = JSON.parse(res.getContentText());
    } catch (parseErr) {
      throw new Error(ERR_INVALID_JSON + parseErr.message);
    }

    const share = Array.isArray(data) ? data[0] : data;
    const price = share?.[KEY_AMUNDI_LASTNAV]?.[KEY_AMUNDI_VALUE];

    if (typeof price !== "number" || isNaN(price) || price <= 0)
      throw new Error(ERR_INVALID_FUND_PRICE + price);

    savePrice(key, price);
    return price;

  } catch (e) {
    Logger.log("FUND ERROR (" + key + "): " + e.message);
    return loadPrice(key);
  }
}

function fundPriceByFonteSlug(code, slug) {
  const key = "FUND_" + code;

  try {
    const url = URL_FONTE_COMPARTO_BASE + slug + "/";

    const res = UrlFetchApp.fetch(url, HTTP_OPTIONS);

    if (res.getResponseCode() !== 200)
      throw new Error(ERR_HTTP + res.getResponseCode());

    const html = res.getContentText();
    const match = html.match(REGEX_FONTE_LATEST_VALUE);

    if (!match)
      throw new Error(ERR_FONTE_PRICE_NOT_FOUND + slug);

    const normalized = match[1].replace(",", ".");
    const price = parseFloat(normalized);

    if (isNaN(price) || price <= 0)
      throw new Error(ERR_INVALID_FUND_PRICE + match[1]);

    savePrice(key, price);
    return price;

  } catch (e) {
    Logger.log("FUND ERROR (" + key + "): " + e.message);
    return loadPrice(key);
  }
}

function fundPriceByAllianz(code, subtitle, comparto) {
  const key = "FUND_" + code;

  try {
    const res = UrlFetchApp.fetch(URL_ALLIANZ_QUOTAZIONI, HTTP_OPTIONS);

    if (res.getResponseCode() !== 200) {
      Logger.log("ALLIANZ DEBUG headers: " + JSON.stringify(res.getAllHeaders()));
      Logger.log("ALLIANZ DEBUG body: " + res.getContentText().slice(0, 500));
      throw new Error(ERR_HTTP + res.getResponseCode());
    }

    let data;
    try {
      data = JSON.parse(res.getContentText());
    } catch (parseErr) {
      throw new Error(ERR_INVALID_JSON + parseErr.message);
    }

    const price = extractAllianzPrice(data, subtitle, comparto);

    savePrice(key, price);
    return price;

  } catch (e) {
    Logger.log("FUND ERROR (" + key + "): " + e.message);
    return loadPrice(key);
  }
}

function extractAllianzPrice(data, subtitle, comparto) {
  const tables = data?.[KEY_ALLIANZ_TABLES];

  if (!Array.isArray(tables))
    throw new Error(ERR_ALLIANZ_SUBTITLE_NOT_FOUND + subtitle + " (response is missing field '" + KEY_ALLIANZ_TABLES + "' or it is not an array)");

  const table = tables.find(t => t?.[KEY_ALLIANZ_SUBTITLE] === subtitle);

  if (!table) {
    const seenSubtitles = tables.map(t => t?.[KEY_ALLIANZ_SUBTITLE]).join(", ");
    throw new Error(ERR_ALLIANZ_SUBTITLE_NOT_FOUND + subtitle + " (subtitles seen in response: " + seenSubtitles + ")");
  }

  const comparti = table[KEY_ALLIANZ_COMPARTI];

  if (!Array.isArray(comparti))
    throw new Error(ERR_ALLIANZ_COMPARTO_NOT_FOUND + subtitle + " (field '" + KEY_ALLIANZ_COMPARTI + "' is missing or not an array)");

  const row = comparti.find(c => c?.[KEY_ALLIANZ_NOME] === comparto);

  if (!row)
    throw new Error(ERR_ALLIANZ_COMPARTO_NOT_FOUND + subtitle + " -> " + comparto);

  const priceField = row[KEY_ALLIANZ_ULTIMA_QUOTAZIONE];

  if (typeof priceField !== "string")
    throw new Error(ERR_ALLIANZ_UNEXPECTED_ROW_SHAPE + subtitle + " -> " + comparto + " (priceField: " + JSON.stringify(priceField) + ")");

  if (!REGEX_ALLIANZ_PRICE_FORMAT.test(priceField))
    throw new Error(ERR_INVALID_FUND_PRICE + priceField);

  const price = parseFloat(priceField.replace(",", "."));

  if (isNaN(price) || price <= 0)
    throw new Error(ERR_INVALID_FUND_PRICE + priceField);

  return price;
}
