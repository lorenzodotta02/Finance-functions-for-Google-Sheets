/**
 * Returns the current market price of an ETP.
 *
 * @param {Utils!$A$1} date The reference date cell (Utils!$A$1)
 *                          This is required to ensure that price quotes stay updated
 * @param {"IE00BK5BQT80" or "VWCE.DE"} code The ISIN or Yahoo Finance TICKER.SUFFIX
 * @param {"XETR"} stockExchange OPTIONAL The stock exchange MIC (ISO 10383)
 * @param {"USD"} currency OPTIONAL Currency filter (only used for XLON)
 * @return {number} Current market price in EUR
 * @customfunction
 */
function ETPPRICE(date, code, stockExchange, currency) {
  const isinRegex = /^[A-Z]{2}[A-Z0-9]{10}$/;

  if (stockExchange) {
    return etpPriceByIsinAndExchange(code, stockExchange, currency);
  }

  if (isinRegex.test(code)) {
    return etpPriceByIsin(code);
  }

  return etpPriceByTicker(code);
}
