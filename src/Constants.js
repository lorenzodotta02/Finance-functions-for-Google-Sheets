// =======================================================================================================
// ETP
// =======================================================================================================

const ISIN_REGEX = /^[A-Z]{2}[A-Z0-9]{10}$/;

const URL_YF = "https://query1.finance.yahoo.com/v8/finance/chart/";
const URL_GETTEX_TOKEN = "https://lseg-widgets.financial.com/auth/api/v1/tokens";
const URL_GETTEX_QUOTE = "https://lseg-widgets.financial.com/rest/api/quote/info";
const URL_GETTEX_SID = "https://ffgs.lorenzodottagithub.workers.dev/gettex-sid";
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

const EXCHANGE_TRADEGATE = "TRADEGATE";
const EXCHANGE_GETTEX    = "GETTEX";
const EXCHANGE_LSE       = "LONDON STOCK EXCHANGE";

const GETTEX_RIC_SUFFIX = ".GTX";

const URL_LSE = "https://api.londonstockexchange.com/api/gw/lse/instruments/alldata/";
const KEY_LSE_TIDM      = "tidm";
const KEY_LSE_LASTPRICE = "lastprice";
const KEY_LSE_MIDPRICE  = "midPrice";
const KEY_LSE_LASTCLOSE = "lastclose";
const KEY_LSE_BID       = "bid";
const KEY_LSE_OFFER     = "offer";

const JUSTETF_QUOTE_PARAMS = "quote?locale=en&currency=EUR";

const MIC_TABLE = {
  "XETR": { jetf: "XETRA",                   yf: ".DE" },
  "XLON": { jetf: "LONDON STOCK EXCHANGE",    yf: null  },
  "XMIL": { jetf: "BORSA ITALIANA",           yf: ".MI" },
  "XAMS": { jetf: "EURONEXT AMSTERDAM",       yf: ".AS" },
  "XPAR": { jetf: "EURONEXT PARIS",           yf: ".PA" },
  "XSWX": { jetf: "SIX SWISS EXCHANGE",       yf: ".SW" },
  "XSTU": { jetf: "STUTTGART STOCK EXCHANGE", yf: ".SG" },
  "XMUN": { jetf: "GETTEX",                   yf: null  },
  "TGAT": { jetf: "TRADEGATE",                yf: null  }
};

// =======================================================================================================
// Tickers
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
// Bond
// =======================================================================================================

const URL_EURONEXT_API = "https://ffgs.lorenzodottagithub.workers.dev/euronext-price";
const URL_BOND = "https://www.borsaitaliana.it/borsa/obbligazioni/mot/obbligazioni-in-euro/scheda/";
const REGEX_BOND_PRICE = /(\d{2,3},\d{1,3})/;
const USER_AGENT_BOND = "Mozilla/5.0";

const URL_LSE_BOND_AUTOCOMPLETE = "https://api.londonstockexchange.com/api/gw/lse/search/autocomplete";
const LSE_BOND_CATEGORY = "BONDS";

// =======================================================================================================
// Crypto
// =======================================================================================================

const URL_CMC_QUOTES = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
const PROP_CMC_API_KEY = "CMC_API_KEY";
const HEADER_CMC_ACCEPT = "application/json";
const HEADER_CMC_APIKEY = "X-CMC_PRO_API_KEY";
const CMC_CONVERT_TO = "EUR";

// =======================================================================================================
// Commodity
// =======================================================================================================

const URL_COMMODITY = {
  gold:      "https://www.teleborsa.it/valute/gold-spot-xauusd-RjAuWEFVVVNE",
  silver:    "https://www.teleborsa.it/valute/silver-spot-xagusd-RjAuWEFHVVNE",
  palladium: "https://www.teleborsa.it/valute/palladium-spot-xpdusd-RjAuWFBEVVNE",
  platinum:  "https://www.teleborsa.it/valute/platinum-spot-xptusd-RjAuWFBUVVNE"
};
const REGEX_COMMODITY_PRICE = /(\d{1,3},\d{2,3})/;

// =======================================================================================================
// Fund
// =======================================================================================================

const FUND_TABLE = {
  FONTE: {
    "FONTE:CON":  { isin: null, fonteSlug: "comparto-garantito" },
    "FONTE:SVIL":  { isin: null, fonteSlug: "comparto-bilanciato" },
    "FONTE:CRE": { isin: null, fonteSlug: "comparto-crescita" },
    "FONTE:DIN":  { isin: null, fonteSlug: "comparto-dinamico" }
  },

  AMUNDI: {
    "SECPE:BIL":  { isin: "QS0000003562" },
    "SECPE:ESP":  { isin: "QS0000003561" },
    "SECPE:GAR":  { isin: "QS0000013033" },
    "SECPE:PRU":  { isin: "QS0000003560" },
    "SECPE:SVIL": { isin: "QS0000003564" }
  }
};

const CODE_SEPARATOR = ":";
const ISSUER_SEPARATOR = ".";

const URL_AMUNDI_SECONDAPENSIONE = "https://www.secondapensione.it/product-services/fdr/share/v3/isin/";
 
const AMUNDI_FIELD_SELECTION = ["isin", "lastNav.value"];
 
const KEY_AMUNDI_LASTNAV = "lastNav";
const KEY_AMUNDI_VALUE   = "value";

const URL_FONTE_COMPARTO_BASE = "https://www.fondofonte.it/gestione-finanziaria/i-valori-quota-dei-comparti/";

const REGEX_FONTE_LATEST_VALUE = /(?:Gennaio|Febbraio|Marzo|Aprile|Maggio|Giugno|Luglio|Agosto|Settembre|Ottobre|Novembre|Dicembre)\s*<\/span>[\s\S]*?<span>\s*(\d{1,3},\d{2,3})/;

const ERR_INVALID_FUND_PRICE = "Invalid Fund price: ";
const ERR_UNKNOWN_FUND_CODE = "Unknown fund code, not found in FUND_TABLE: ";
const ERR_FONTE_PRICE_NOT_FOUND = "FONTE quote value not found in page for slug: ";

// =======================================================================================================
// Fund - ALLIANZ
// =======================================================================================================

const URL_ALLIANZ_QUOTAZIONI = "https://ffgs.lorenzodottagithub.workers.dev/allianz-fund";

const KEY_ALLIANZ_TABLES = "tabelle";
const KEY_ALLIANZ_SUBTITLE = "sottotitolo";
const KEY_ALLIANZ_COMPARTI = "comparti";
const KEY_ALLIANZ_NOME = "nome";
const KEY_ALLIANZ_ULTIMA_QUOTAZIONE = "ultima_quotazione";

const REGEX_ALLIANZ_PRICE_FORMAT = /^\d{1,3},\d{2,3}$/;

const ALLIANZ_FUND_TABLE = {
  PREVI: {
    allianzSubtitle: "Fondo Pensione Aperto Allianz Previdenza",
    comparti: {
      "PREVI:AZ":       { allianzComparto: "LINEA AZIONARIA" },
      "PREVI:BIL":      { allianzComparto: "LINEA BILANCIATA" },
      "PREVI:GAR":      { allianzComparto: "LINEA FLESSIBILE GARANZIA REST. CAPITALE" },
      "PREVI:GAR:LA":   { allianzComparto: "LINEA FLESSIBILE GAR.RES.CAP-Ex L.Gar LA" },
      "PREVI:GAR:PREV": { allianzComparto: "LINEA FLESSIBILE GAR.RES.CAP-Ex L.1 Prev" },
      "PREVI:MULTI":    { allianzComparto: "LINEA MULTIASSET" },
      "PREVI:OBLBT":    { allianzComparto: "LINEA OBBLIGAZIONARIA BREVE TERMINE" },
      "PREVI:OBLLT":    { allianzComparto: "LINEA OBBLIGAZIONARIA LUNGO TERMINE" }
    }
  },

  INSIE: {
    allianzSubtitle: "Fondo Pensione Aperto INSIEME",
    comparti: {
      "INSIE:AZ":    { allianzComparto: "LINEA AZIONARIA" },
      "INSIE:BIL":   { allianzComparto: "LINEA BILANCIATA" },
      "INSIE:GAR":   { allianzComparto: "LINEA FLESSIBILE GARANZIA REST. CAPITALE" },
      "INSIE:MULTI": { allianzComparto: "LINEA MULTIASSET" },
      "INSIE:OBL":   { allianzComparto: "LINEA OBBLIGAZIONARIA" },
      "INSIE:OBLBT": { allianzComparto: "LINEA OBBLIGAZIONARIA BREVE TERMINE" },
      "INSIE:OBLLT": { allianzComparto: "LINEA OBBLIGAZIONARIA LUNGO TERMINE" }
    }
  },

  ORIZZ: {
    allianzSubtitle: "Orizzonte Previdenza",
    comparti: {
      "ORIZZ:AZ":          { allianzComparto: "AZIONARIO GLOBALE" },
      "ORIZZ:BIL":         { allianzComparto: "BILANCIATO" },
      "ORIZZ:OBL":         { allianzComparto: "OBBLIGAZIONARIO" },
      "ORIZZ:FORMU:A":     { allianzComparto: "FORMULA ATTIVA" },
      "ORIZZ:FORMU:E":     { allianzComparto: "FORMULA EQUILIBRATA" },
      "ORIZZ:FORMU:M":     { allianzComparto: "FORMULA MODERATA" },
      "ORIZZ:FORMU:S":     { allianzComparto: "FORMULA SERENA" },
      "ORIZZ:FORMU:A:CLA": { allianzComparto: "FORMULA ATTIVA CL. A" },
      "ORIZZ:FORMU:E:CLA": { allianzComparto: "FORMULA EQUILIB CL. A" }
    }
  }
};

const ERR_ALLIANZ_SUBTITLE_NOT_FOUND = "Allianz fund subtitle not found in endpoint response: ";
const ERR_ALLIANZ_COMPARTO_NOT_FOUND = "Allianz comparto not found in table for subtitle: ";
const ERR_ALLIANZ_UNEXPECTED_ROW_SHAPE = "Allianz quote row has unexpected shape: ";
const ERR_ALLIANZ_SUBTITLE_MISSING = "Allianz subtitle not found in ALLIANZ_FUND_TABLE for fund key: ";

FUND_TABLE.ALLIANZ = {};
for (const fondoNome in ALLIANZ_FUND_TABLE) {
  Object.assign(FUND_TABLE.ALLIANZ, ALLIANZ_FUND_TABLE[fondoNome].comparti);
}
