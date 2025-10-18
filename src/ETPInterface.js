/**
 * Returns the current market price of an ETP using the JustETF API.
 *
 * Currently supports:
 *   - Any ETP (ETF/ETC/ETN) available on JustETF, priced in EUR.
 *   - The exchange may vary (commonly XETRA, but also LSE or others).
 *
 * @param {string} date The reference date cell (Utils!$A$1).
 *                      This can be used to trigger updates in the sheet.
 * @param {string} isin The ISIN code of the ETP to fetch the price for.
 *                      Must be a valid ISIN recognized by JustETF.
 * @returns {number} The current market price of the specified ETP in EUR.
 * @customfunction
 */
function ETPPRICE(date, isin) {
    return etpPrice(isin);
}