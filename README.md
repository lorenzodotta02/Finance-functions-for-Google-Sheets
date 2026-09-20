# **Finance Functions for Google Sheets** 
[![GitHub Downloads](https://img.shields.io/github/downloads/lorenzodotta02/Finance-functions-for-Google-Sheets/total.svg)](https://github.com/lorenzodotta02/Finance-functions-for-Google-Sheets/releases) [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A collection of custom Google Sheets functions designed as an alternative to `GOOGLEFINANCE()`

These functions retrieve **updated prices** for:
- **Bonds**
- **ETPs (ETFs / ETCs / ETNs)**
- **Pension funds / mutual funds**
- **Cryptocurrencies**
- **Commodities**

---

# Installation

Tutorial [here](./INSTALLATION.md)

---

# **Available Custom Functions**

| Function | Purpose |
| --- | --- |
| `ETPPRICE(date; code; [stockExchange]; [currency])` | Returns the latest price for an ETP (ETF/ETC/ETN) |
| `BONDPRICE(date; isin; stockExchange)` | Returns the latest price for a bond |
| `FUNDPRICE(date; code)` | Returns the latest NAV of a fund |
| `CRYPTOPRICE(date; symbol)` | Returns the latest cryptocurrency price |
| `COMMODITYPRICE(date; name)` | Returns the latest spot price of a commodity (EUR/gram) |

> ⚠️ Important: date must always be Utils!$A$1, this cell auto-refreshes every 15 minutes and forces recalculation. 
> 

> ⚠️ If you use the US locale, replace semicolons ; with commas.
> 

---

# **Function Inputs Explained**

## **`ETPPRICE(date; code; [stockExchange]; [currency])`**
Returns the latest price for an ETP (ETF/ETC/ETN)

### **Parameters:**

- `date` → always `Utils!$A$1`
- `code` → ISIN code/Yahoo Finance ticker
- `stockExchange` → **OPTIONAL but recommended** MIC code (ISO 10383) of the market where the ETP is traded
- `currency` → **OPTIONAL** Currency filter (e.g. "USD"). Only used when stockExchange is XLON (London Stock Exchange)


### **Optional parameter: `stockExchange`**

This is only needed when you pass an **ISIN** and want to **force a specific market**.

Supported MICs:

| MIC | Exchange |
| --- | --- |
| XETR | XETRA |
| XLON | London Stock Exchange 🔥|
| XMIL | Borsa Italiana |
| XAMS | Euronext Amsterdam |
| XPAR | Euronext Paris |
| XSWX | SIX Swiss Exchange |
| XSTU | Stuttgart Stock Exchange |
| XMUN | Gettex |
| TGAT | Tradegate |

If omitted, the script selects an exchange automatically (if possible).

### **Optional parameter: `currency`**
Only applies when stockExchange is XLON. Use it to select the trading currency of the ETP on the London Stock Exchange.

## **`BONDPRICE(date; isin; stockExchange)`**
Returns the latest price for a bond

### **Parameters:**

- `date` → always `Utils!$A$1`
- `isin` → ISIN code of the bond
- `stockExchange` → **MANDATORY** MIC code (ISO 10383) of the market where the bond is traded

> ⚠️ **Important:** if `BONDPRICE()` returns no value or an error on the first call, try calling it again after about 1 minute.

Supported MICs:

| MIC  | Exchange                       |
| ---- | ------------------------------ |
| XAMS | Euronext Amsterdam             |
| XBRU | Euronext Brussels              |
| XLIS | Euronext Lisbon                |
| XOSL | Oslo Børs                      |
| XPAR | Euronext Paris                 |
| ALXB | Euronext Growth Brussels       |
| EXGM | Euronext Growth Milan          |
| ALXP | Euronext Growth Paris          |
| ENXL | Euronext Access Lisbon         |
| MLXB | Euronext Access Brussels       |
| XMLI | Euronext Access Paris          |
| VPXB | Euronext Expert Market         |
| ETLX | EuroTLX                        |
| MOTX | MOT                            |
| XMOT | Euronext Access Milan          |
| XOAM | Nordic Alternative Bond Market |
| XMUN | Gettex 🔥|
| TGAT | Tradegate 🔥|
| XLON | London Stock Exchange 🔥 |

## **`FUNDPRICE(date; code)`**

Returns the latest **NAV (Net Asset Value)** of a fund, expressed in the fund's native currency.

### **Parameters:**

- `date` → always `Utils!$A$1`
- `code` → fund code in the format `ISSUER.FUND:SUBFUND[:VARIANT[:CLASS]]`. For **Amundi** funds only, the **ISIN** is also accepted

### **Accepted values for `code`**

| Format | Example | Issuers |
| --- | --- | --- |
| `ISSUER.FUND:SUBFUND[:VARIANT[:CLASS]]` | `"AMUNDI.SECPE:BIL"` | All |
| ISIN | `"QS0000003562"` | Amundi only |

### **Supported issuers**

| Issuer | Fund |
| --- | --- |
| `AMUNDI` | SecondaPensione |
| `FONTE` | Fonte |
| `ALLIANZ` | Previdenza, Insieme, Orizzonte Previdenza |

## **Supported funds (full list)**

Complete list of the funds supported by `FUNDPRICE()`, with the `ISSUER.FUND:SUBFUND[:VARIANT[:CLASS]]` code to use.

> The **ISIN** is accepted as `code` **only for Amundi** funds. For **Fonte** and **Allianz** the ISIN is not supported: use the fund code.

### **Amundi SecondaPensione** (`AMUNDI`)

| Line | Code | ISIN |
| --- | --- | --- |
| Bilanciata | `AMUNDI.SECPE:BIL` | `QS0000003562` |
| Espansione | `AMUNDI.SECPE:ESP` | `QS0000003561` |
| Garanzia | `AMUNDI.SECPE:GAR` | `QS0000013033` |
| Prudente | `AMUNDI.SECPE:PRU` | `QS0000003560` |
| Sviluppo | `AMUNDI.SECPE:SVIL` | `QS0000003564` |

### **Fonte Fondo Pensione Fonte** (`FONTE`)

| Line | Code | ISIN |
| --- | --- | --- |
| Comparto Conservativo | `FONTE.FONTE:CON` | — |
| Comparto Sviluppo | `FONTE.FONTE:SVIL` | — |
| Comparto Crescita | `FONTE.FONTE:CRE` | — |
| Comparto Dinamico | `FONTE.FONTE:DIN` | — |

### **Allianz** (`ALLIANZ`)

#### Allianz Previdenza (`PREVI`)

| Line | Code | ISIN |
| --- | --- | --- |
| Linea Azionaria | `ALLIANZ.PREVI:AZ` | — |
| Linea Bilanciata | `ALLIANZ.PREVI:BIL` | — |
| Linea Flessibile Garanzia Restituzione Capitale | `ALLIANZ.PREVI:GAR` | — |
| Linea Flessibile Gar. Res. Cap. Ex L. Gar LA | `ALLIANZ.PREVI:GAR:LA` | — |
| Linea Flessibile Gar. Res. Cap. Ex L.1 Prev | `ALLIANZ.PREVI:GAR:PREV` | — |
| Linea Multiasset | `ALLIANZ.PREVI:MULTI` | — |
| Linea Obbligazionaria Breve Termine | `ALLIANZ.PREVI:OBLBT` | — |
| Linea Obbligazionaria Lungo Termine | `ALLIANZ.PREVI:OBLLT` | — |

#### Allianz Insieme (`INSIE`)

| Line | Code | ISIN |
| --- | --- | --- |
| Linea Azionaria | `ALLIANZ.INSIE:AZ` | — |
| Linea Bilanciata | `ALLIANZ.INSIE:BIL` | — |
| Linea Flessibile Garanzia Restituzione Capitale | `ALLIANZ.INSIE:GAR` | — |
| Linea Multiasset | `ALLIANZ.INSIE:MULTI` | — |
| Linea Obbligazionaria | `ALLIANZ.INSIE:OBL` | — |
| Linea Obbligazionaria Breve Termine | `ALLIANZ.INSIE:OBLBT` | — |
| Linea Obbligazionaria Lungo Termine | `ALLIANZ.INSIE:OBLLT` | — |

#### Allianz Orizzonte Previdenza (`ORIZZ`)

| Line | Code | ISIN |
| --- | --- | --- |
| Azionario Globale | `ALLIANZ.ORIZZ:AZ` | — |
| Bilanciato | `ALLIANZ.ORIZZ:BIL` | — |
| Obbligazionario | `ALLIANZ.ORIZZ:OBL` | — |
| Formula Attiva | `ALLIANZ.ORIZZ:FORMU:A` | — |
| Formula Equilibrata | `ALLIANZ.ORIZZ:FORMU:E` | — |
| Formula Moderata | `ALLIANZ.ORIZZ:FORMU:M` | — |
| Formula Serena | `ALLIANZ.ORIZZ:FORMU:S` | — |
| Formula Attiva Classe A | `ALLIANZ.ORIZZ:FORMU:A:CLA` | — |
| Formula Equilibrata Classe A | `ALLIANZ.ORIZZ:FORMU:E:CLA` | — |

## **`CRYPTOPRICE(date; symbol)`**

Returns the latest cryptocurrency price.

### **Parameters:**

- `date` → always `Utils!$A$1`
- `symbol` → cryptocurrency ticker (e.g. `"BTC"`, `"ETH"`)

> ⚠️ Requires a CoinMarketCap API key (see installation).
> 

## **`COMMODITYPRICE(date; name)`**

Returns spot prices for commodities in **EUR per gram**.

**Parameters:**

- `date` → always `Utils!$A$1`
- `name` → name of the commodity (e.g. `"Gold"`)

### Supported names:

- `"Gold"`
- `"Silver"`
- `"Platinum"`
- `"Palladium"`

---

# **Examples**

```
=ETPPRICE(Utils!$A$1;"IE00BK5BQT80")               // Price of VWCE from a random exchange
=ETPPRICE(Utils!$A$1;"IE00BK5BQT80";"XETR")        // Price of VWCE from XETRA
=ETPPRICE(Utils!$A$1;"VWCE.DE")                    // Price of VWCE via Yahoo Finance
=ETPPRICE(Utils!$A$1;"IE00B3F81R35";"XLON";"GBP")  // Price of IEBC from LSE in GBP

=BONDPRICE(Utils!$A$1;"IT0005672024";"MOTX")       // Italian government bond (MOT)
=BONDPRICE(Utils!$A$1;"FR0014001NN8";"XPAR")       // French OAT on Euronext Paris
=BONDPRICE(Utils!$A$1;"GB0030517931";"XLON")       // Bond on London Stock Exchange

=FUNDPRICE(Utils!$A$1;"QS0000003562")              // NAV of Secondapensione bilanciata via ISIN
=FUNDPRICE(Utils!$A$1;"AMUNDI.SECPE:BIL")          // NAV of Secondapensione bilanciata via fund code
=FUNDPRICE(Utils!$A$1;"FONTE.FONTE:CON")           // NAV of Fonte Comparto Conservativo
=FUNDPRICE(Utils!$A$1;"ALLIANZ.INSIE:BIL")         // NAV of Allianz INSIEME Linea Bilanciata

=CRYPTOPRICE(Utils!$A$1;"BTC")                     // Bitcoin price

=COMMODITYPRICE(Utils!$A$1;"Gold")                 // Gold price (EUR/gram)
```

---

# License

This project is licensed under the **GNU General Public License v3.0**.

See the LICENSE file for full terms.

---

# Roadmap

Planned features and improvements for upcoming releases:
...
