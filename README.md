# **Finance Functions for Google Sheets** 
[![GitHub Downloads](https://img.shields.io/github/downloads/lorenzodotta02/Finance-functions-for-Google-Sheets/total.svg)](https://github.com/lorenzodotta02/Finance-functions-for-Google-Sheets/releases) [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A collection of custom Google Sheets functions designed as an alternative to `GOOGLEFINANCE()`

These functions retrieve **updated prices** for:
- **Bonds**
- **ETPs (ETFs / ETCs / ETNs)**
- **Cryptocurrencies** 
- **Commodities**

# ⚠️ IMPORTANT NOTICE
> [!WARNING]
> **`BONDPRICE()` is currently not working for most exchanges.**
>
> In addition, **all functions that retrieve data from Gettex (`XMUN`) are currently unavailable**.
>
> I am currently working on restoring the affected functionality and investigating possible solutions.
>
> **Affected functionality:**
>
> * `BONDPRICE()` for all Euronext MICs (`XPAR`, `XAMS`, `XBRU`, `XLIS`, `XDUB`, etc.)
> * `ETPPRICE()` when using Gettex (`XMUN`)
>
> **Still working:**
>
> * `BONDPRICE()` on `TGAT` and `MOTX` / `XMOT`
> * `ETPPRICE()` on `XETR`, `XLON`, `XMIL`, `XAMS`, `XPAR`, `XSWX`, `XSTU`, `TGAT`
> * `COMMODITYPRICE()` and `CRYPTOPRICE()`

---

# Installation

Tutorial [here](./INSTALLATION.md)

---

# **Available Custom Functions**

| Function | Purpose |
| --- | --- |
| `ETPPRICE(date; code; [stockExchange]; [currency])` | Returns the latest price for an ETP (ETF/ETC/ETN) |
| `BONDPRICE(date; isin; stockExchange)` | Returns the latest price for a bond |
| `CRYPTOPRICE(date; symbol)` | Returns the latest cryptocurrency price  |
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
=BONDPRICE(Utils!$A$1;"NL0015000QL2";"XAMS")       // Bond on Euronext Amsterdam

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
- [ ] Improve scalability and performance of the Euronext bond pricing API
- [ ] Add `FUNDPRICE()` for mutual funds, SICAVs, pension funds, and non-ETF investment funds
  - [X] Amundi SecondaPensione
  - [X] Fon.te 
- [ ] Flutter companion app
- [X] London Stock Exchange (XLON) bonds
- [ ] **Add a layering system for the Render-hosted API URLs, so that if a service is suspended a new backend URL can be linked to the same address without editing the script**
- [X] Restore Gettex API
- [ ] Restore Euronext API
