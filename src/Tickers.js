function getTickersFromJustETF(isin) {
  const url = URL_JUSTETF_PROFILE + encodeURIComponent(isin) + JUSTETF_STOCK_EXCHANGE_HASH;
  const response = UrlFetchApp.fetch(url, {
    headers: {
      "User-Agent": USER_AGENT_JUSTETF,
      "Accept": HEADER_ACCEPT_HTML
    }
  });
  const html = response.getContentText();
  const tables = html.match(REGEX_TABLE) || [];
  let tickers = [];

  for (let table of tables) {
    if (!REGEX_EXCHANGE_TABLE.test(table)) continue;
    const rows = table.match(REGEX_TABLE_ROW) || [];
    const parsedRows = rows
      .map(row => {
        const cells = row.match(REGEX_TABLE_CELL) || [];
        return cells.map(cell =>
          cell
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim()
        );
      })
      .filter(r => r.length > 0);

    tickers = parsedRows.map(r => ({
      Exchange: r[0] || "",
      Currency: r[1] || "",
      Ticker: r[2] || "",
      Bloomberg: r[3] || "",
      Reuters: r[4] || "",
      Misc: r[5] || ""
    }));

    break;
  }

  return tickers;
}
