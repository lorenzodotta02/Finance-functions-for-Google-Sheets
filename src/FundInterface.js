/**
 * Returns the current NAV of a Fund.
 *
 * @param {Utils!$A$1} date The reference date cell (Utils!$A$1)
 *                          This is required to ensure that price quotes stay updated
 * @param {"QS0000003562"} code The Fund ISIN, or an ISSUER.FUND:SUBFUND[:VARIANT[:CLASS]]
 *                               code (e.g. "AMUNDI.SECPE:BIL",
 *                               "FONTE.FONTE:CON", "ALLIANZ.INSIE:BIL")
 * @return {number} Current NAV in the fund's native currency
 * @customfunction
 */
function FUNDPRICE(date, code) {

  if (ISIN_REGEX.test(code)) {
    return fundPriceByIsin(code);
  }

  const normalizedCode = String(code).trim().toUpperCase();
  const separatorIdx = normalizedCode.indexOf(ISSUER_SEPARATOR);

  if (separatorIdx === -1) {
    throw new Error(
      "FUNDPRICE currently only supports ISIN codes or ISSUER.FUND:SUBFUND codes"
    );
  }

  const issuer = normalizedCode.slice(0, separatorIdx);
  const fundKey = normalizedCode.slice(separatorIdx + 1);

  const issuerTable = FUND_TABLE[issuer];

  if (!issuerTable) {
    throw new Error(ERR_UNKNOWN_FUND_CODE + code);
  }

  const entry = issuerTable[fundKey];

  if (!entry) {
    throw new Error(ERR_UNKNOWN_FUND_CODE + code);
  }

  if (entry.isin) {
    return fundPriceByIsin(entry.isin);
  }

  if (entry.fonteSlug) {
    return fundPriceByFonteSlug(fundKey, entry.fonteSlug);
  }

  if (entry.allianzComparto) {
    const subtitle = getAllianzSubtitle(fundKey);
    if (!subtitle) {
      throw new Error(ERR_ALLIANZ_SUBTITLE_MISSING + fundKey);
    }
    return fundPriceByAllianz(fundKey, subtitle, entry.allianzComparto);
  }

  throw new Error(ERR_UNKNOWN_FUND_CODE + code);
}

function getAllianzSubtitle(fundKey) {
  for (const fondoNome in ALLIANZ_FUND_TABLE) {
    const group = ALLIANZ_FUND_TABLE[fondoNome];
    if (group.comparti && Object.prototype.hasOwnProperty.call(group.comparti, fundKey)) {
      return group.allianzSubtitle;
    }
  }
  return null;
}
