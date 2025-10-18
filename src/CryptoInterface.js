/**
 * Returns the current market price of a cryptocurrency using the official
 * CoinMarketCap API.
 *
 * Currently supports:
 *   - Any cryptocurrency listed on CoinMarketCap by its official symbol
 *     (e.g., "BTC", "ETH", "ADA").
 *
 * @param {string} date The reference date cell (Utils!$A$1).
 *                      This can be used to trigger updates in the sheet.
 * @param {string} symbol The official symbol of the cryptocurrency.
 *                        Must be a valid symbol recognized by CoinMarketCap.
 * @returns {number} The current market price of the specified cryptocurrency in EUR.
 * @customfunction
 */
function CRYPROPRICE(date, symbol) {
  return cryptoPrice(symbol);
}