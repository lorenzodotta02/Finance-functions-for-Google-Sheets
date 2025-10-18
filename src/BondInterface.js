/**
 * Returns the current market price of a bond.
 *
 * Currently supports:
 *   - Bonds traded on Borsa Italiana.
 *
 * @param {string} date The reference date cell (Utils!$A$1).
 *                      This can be used to trigger updates in the sheet.
 * @param {string} isin The ISIN code of the bond.
 * @returns {number} The current market price of the specified bond.
 * @customfunction
 */
function BONDPRICE(date, isin) {
  return bondPrice(isin);
}