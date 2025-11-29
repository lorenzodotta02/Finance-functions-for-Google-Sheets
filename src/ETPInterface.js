/**
 * Returns the current market price of an ETP
 *
 * @param {Utils!$A$1} date The reference date cell (Utils!$A$1)
 *                          This is required to ensure that price quotes stay updated
 * @param {"IE00BK5BQT80" or "VWCE.DE"} code The ISIN or Yahoo Finance TICKER.SUFFIX
 * @param {"XETR"} stockExchange OPTIONAL The stock exchange operating MIC (ISO 10383)
 * @return {number} Current market price in EUR
 * @customfunction
 */

function ETPPRICE(date, code, stockExchange) {
  const isinRegex = /^[A-Z]{2}[A-Z0-9]{10}$/;

  if (stockExchange) {
    return etpPriceByIsin_stockExchange(code, stockExchange);
  }

  if (isinRegex.test(code)) {
    return etpPriceByIsin(code);
  }

  return etpPriceByTicker(code);
}
