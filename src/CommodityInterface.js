/**
 * Returns the current spot price of a commodity.
 *
 * Currently supports:
 *   - Gold → price in EUR per gram
 *
 * @param {string} date The reference date cell (Utils!$A$1). 
 *                      This can be used to trigger updates in the sheet.
 * @param {string} name The name of the commodity. Supported values: "Gold".
 * @returns {number} The current spot price of the specified commodity in EUR.
 * @customfunction
 */

function COMMODITYPRICE(date, name) {
  if (name === "Gold") {
    return goldPrice();
  } else {
    throw new Error("Commodity not supported: " + name);
  }
}