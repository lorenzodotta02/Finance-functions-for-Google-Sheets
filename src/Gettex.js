function getGettexSid() {
  try {
    const response = UrlFetchApp.fetch(URL_GETTEX_SID, {
      method: "get",
      muteHttpExceptions: true
    });
    const json = JSON.parse(response.getContentText());

    if (json.status === "success" && json.sid) {
      Logger.log("SID: " + json.sid);
      return json.sid;
    }

    Logger.log("SID not found: " + response.getContentText());
    return null;

  } catch (e) {
    Logger.log("SID connection error: " + e.toString());
    return null;
  }
}

function getGettexJwt() {
  const sid = getGettexSid();
  if (!sid) throw new Error("Missing SID");

  const resp = UrlFetchApp.fetch(URL_GETTEX_TOKEN, {
    method: "post",
    headers: {
      sid:    sid,
      accept: "application/json",
      origin:  "https://www.gettex.de",
      referer: "https://www.gettex.de/"
    },
    muteHttpExceptions: true
  });

  const jwt = resp.getContentText().trim();
  if (!jwt.startsWith("eyJ")) throw new Error("Invalid JWT");

  return jwt;
}

function lsegFetch(url, jwt) {
  const resp = UrlFetchApp.fetch(url, {
    headers: {
      accept: "application/json",
      jwt:    jwt
    },
    muteHttpExceptions: true
  });

  const text = resp.getContentText();
  Logger.log(text);
  return JSON.parse(text);
}

function getGettexQuoteData(ric, fids) {
  if (!ric) throw new Error("Missing RIC");

  const jwt = getGettexJwt();
  const url =
    URL_GETTEX_QUOTE +
    "?rics=" + encodeURIComponent(ric) +
    "&fids=" + encodeURIComponent(fids.join(","));

  Logger.log("GETTEX URL: " + url);

  const json = lsegFetch(url, jwt);
  const q = json?.data?.[0];
  if (!q) throw new Error("No quote data for " + ric);

  return q;
}

function getGettexMidPriceFromBidAsk(ric) {
  const q = getGettexQuoteData(ric, ["q._BID", "q._ASK"]);

  const bid = parseFloat(String(q["q._BID"] || "").replace("+", ""));
  const ask = parseFloat(String(q["q._ASK"] || "").replace("+", ""));

  if (isNaN(bid) || isNaN(ask))
    throw new Error("Invalid bid/ask");

  return (bid + ask) / 2;
}

function getGettexBondLastPrice(ric) {
  const q = getGettexQuoteData(
    ric,
    ["q.PX_LAST", "q.TRDPRC_1", "q.PX_DIRTY_PRICE"]
  );

  const price =
    Number(q["q.PX_LAST"]) ||
    Number(q["q.TRDPRC_1"]) ||
    Number(q["q.PX_DIRTY_PRICE"]);

  if (!price) throw new Error("Bond price unavailable");

  return price;
}
