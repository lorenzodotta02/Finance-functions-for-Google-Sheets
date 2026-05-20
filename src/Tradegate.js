function fetchTradegatePrice(isin) {
  const url = URL_TRADEGATE + encodeURIComponent(isin);

  try {
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

    if (res.getResponseCode() !== 200)
      throw new Error("HTTP " + res.getResponseCode());

    const data = JSON.parse(res.getContentText());
    const lastRaw = data?.last;

    if (!lastRaw)
      throw new Error("Missing 'last' field");

    const last = parseFloat(String(lastRaw).replace(",", "."));

    if (isNaN(last))
      throw new Error("Invalid price value: " + lastRaw);

    return last;

  } catch (e) {
    Logger.log("TRADEGATE error (" + isin + "): " + e.message);
    return null;
  }
}