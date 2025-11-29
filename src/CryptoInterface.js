/**
 * Returns the current market price of a cryptocurrency using the official
 * CoinMarketCap API.
 *
 * Currently supports:
 * Any cryptocurrency listed on CoinMarketCap by its official symbol
 *
 * @param {Utils!$A$1} date The reference date cell (Utils!$A$1)
 *                          This is required to ensure that price quotes stay updated
 * @param {"BTC"} symbol The official symbol of the cryptocurrency.
 *                        Must be a valid symbol recognized by CoinMarketCap.
 * @returns {number} The current market price of the specified cryptocurrency in EUR.
 * @customfunction
 */
function CRYPROPRICE(date, symbol) {
  return cryptoPrice(symbol);
}
