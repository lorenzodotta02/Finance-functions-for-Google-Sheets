// =======================================================================================================
// ETP.gs
// =======================================================================================================

const URL_YF = "https://query1.finance.yahoo.com/v8/finance/chart/";
const URL_GETTEX_TOKEN = "https://lseg-widgets.financial.com/auth/api/v1/tokens";
const URL_GETTEX_QUOTE = "https://lseg-widgets.financial.com/rest/api/quote/info";
const URL_GETTEX_SID = "https://gettex-sid.onrender.com/get-sid";
const URL_TRADEGATE = "https://www.tradegate.de/refresh.php?isin=";

const URL_JUSTETF_QUOTE = "https://www.justetf.com/api/etfs/";
const HTTP_OPTIONS = { muteHttpExceptions: true };
const KEY_LATEST_QUOTE = "latestQuote";
const KEY_LATEST_QUOTE_RAW = "raw";
const KEY_LATEST_QUOTE_DATE = "latestQuoteDate";
const KEY_QUOTE_TRADING_VENUE = "quoteTradingVenue";

const ERR_HTTP = "HTTP error: ";
const ERR_INVALID_JSON = "Invalid JSON response: ";
const ERR_PRICE_NOT_FOUND = "ETP price not found in response";
const ERR_INVALID_PRICE = "Invalid ETP price: ";

const MIC_TABLE = {
  "XETR": { jetf: "XETRA", yf: ".DE" },
  "XLON": { jetf: "LONDON STOCK EXCHANGE", yf: ".L" },
  "XMIL": { jetf: "BORSA ITALIANA", yf: ".MI" },
  "XAMS": { jetf: "EURONEXT AMSTERDAM", yf: ".AS" },
  "XPAR": { jetf: "EURONEXT PARIS", yf: ".PA" },
  "XSWX": { jetf: "SIX SWISS EXCHANGE", yf: ".SW" },
  "XSTU": { jetf: "STUTTGART STOCK EXCHANGE", yf: ".SG" },
  "XMUN": { jetf: "GETTEX", yf: null },
  "TGAT": { jetf: "TRADEGATE", yf: null }
};

// =======================================================================================================
// Tickers.gs
// =======================================================================================================

const URL_JUSTETF_PROFILE = "https://www.justetf.com/en/etf-profile.html?isin=";
const JUSTETF_STOCK_EXCHANGE_HASH = "#stock-exchange";
const USER_AGENT_JUSTETF = "Mozilla/5.0";
const HEADER_ACCEPT_HTML = "text/html";
const REGEX_TABLE = /<table[^>]*>[\s\S]*?<\/table>/gi;
const REGEX_TABLE_ROW = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
const REGEX_TABLE_CELL = /<td[^>]*>([\s\S]*?)<\/td>/gi;
const REGEX_EXCHANGE_TABLE = /Exchange|Ticker/i;

// =======================================================================================================
// Bonds.gs
// =======================================================================================================

const URL_BOND = "https://www.borsaitaliana.it/borsa/obbligazioni/mot/obbligazioni-in-euro/scheda/";
const REGEX_BOND_PRICE = /(\d{2,3},\d{1,3})/;
const USER_AGENT_BOND = "Mozilla/5.0";

// =======================================================================================================
// Crypto.gs
// =======================================================================================================

const URL_CMC_QUOTES = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
const PROP_CMC_API_KEY = "CMC_API_KEY";
const HEADER_CMC_ACCEPT = "application/json";
const HEADER_CMC_APIKEY = "X-CMC_PRO_API_KEY";
const CMC_CONVERT_TO = "EUR";

// =======================================================================================================
// Commodity.gs
// =======================================================================================================

const URL_COMMODITY = {
  gold: "https://www.teleborsa.it/valute/gold-spot-xauusd-RjAuWEFVVVNE",
  silver: "https://www.teleborsa.it/valute/silver-spot-xagusd-RjAuWEFHVVNE",
  palladium: "https://www.teleborsa.it/valute/palladium-spot-xpdusd-RjAuWFBEVVNE",
  platinum: "https://www.teleborsa.it/valute/platinum-spot-xptusd-RjAuWFBUVVNE"
};
const REGEX_COMMODITY_PRICE = /(\d{1,3},\d{2,3})/;
