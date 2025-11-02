/**
 * Returns the current spot price of a commodity.
 *
 * Currently supports:
 *   - Gold → price in EUR per gram
 *   - Silver → price in EUR per gram
 *   - Platinum → price in EUR per gram
 *   - Palladium → price in EUR per gram
 *
 * @param {string} date The reference date cell (Utils!$A$1).
 *                      This can be used to trigger updates in the sheet.
 * @param {string} name The name of the commodity.
 *                      Supported values: "Gold", "Silver", "Platinum", "Palladium".
 * @returns {number} The current spot price of the specified commodity in EUR per gram.
 * @customfunction
 */
function COMMODITYPRICE(date, name) {
  return commodityPrice(name);
}
