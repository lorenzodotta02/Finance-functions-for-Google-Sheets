/**
 * Returns the current spot price of a commodity.
 * 
 * @param {Utils!$A$1} date The reference date cell (Utils!$A$1)
 *                          This is required to ensure that price quotes stay updated
 * @param {"Gold"} name The name of the commodity.
 *                      Supported values: "Gold", "Silver", "Platinum", "Palladium".
 * @returns {number} The current spot price of the specified commodity in EUR per gram.
 * @customfunction
 */
function COMMODITYPRICE(date, name) {
  return commodityPrice(name);
}
