/**
 * Returns the current market price of a bond.
 * Currently supports: Bonds traded on Borsa Italiana.
 *
 * @param {Utils!$A$1} date The reference date cell (Utils!$A$1)
 *                          This is required to ensure that price quotes stay updated
 * @param {"IT0005672024"} isin The ISIN code of the bond.
 * @returns {number} The current market price of the specified bond.
 * @customfunction
 */
function BONDPRICE(date, isin) {
  return bondPrice(isin);
}
