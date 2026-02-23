# **Finance Functions for Google Sheets** 
[![GitHub Downloads](https://img.shields.io/github/downloads/lorenzodotta02/Finance-functions-for-Google-Sheets/total.svg)](https://github.com/lorenzodotta02/Finance-functions-for-Google-Sheets/releases) 
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A collection of custom Google Sheets functions designed as an alternative to `GOOGLEFINANCE()`

These functions retrieve **updated prices** for:
- **Bonds**
- **ETPs (ETFs / ETCs / ETNs)**
- **Cryptocurrencies** 
- **Commodities** 

---

# 🚀 Installation

Tutorial [here](./INSTALLATION.md)

---

# ⚙️ **Available Custom Functions**

| Function | Purpose |
| --- | --- |
| `ETPPRICE(date; code; stockExchange)` | Returns the latest price for an ETP |
| `BONDPRICE(date; isin; stockExchange)` | Returns the latest price for a bond |
| `CRYPTOPRICE(date; symbol)` | Returns the latest cryptocurrency price  |
| `COMMODITYPRICE(date; name)` | Returns the latest spot price of a commodity (EUR/gram) |

> Important: date must always be Utils!$A$1, this cell auto-refreshes every 15 minutes and forces recalculation.
> 

> If you use the US locale, replace semicolons ; with commas.
> 

---

# 📥 **Function Inputs Explained in Detail**

## **1️⃣ ETPPRICE(date; code; [stockExchange])**

Fetches the price of an ETF/ETC/ETN.

### **Parameters:**

- `date` → always `Utils!$A$1`
- `code` → ISIN code/Yahoo Finance ticker
- `stockExchange` → **MIC code (ISO 10383)** of the market where the ETP is traded

### **Optional parameter: `stockExchange`**

This is only needed when you pass an **ISIN** and want to **force a specific market**.

Supported MICs:

| MIC | Exchange |
| --- | --- |
| XETR | XETRA |
| XLON | London Stock Exchange |
| XMIL | Borsa Italiana |
| XAMS | Euronext Amsterdam |
| XPAR | Euronext Paris |
| XSWX | SIX Swiss Exchange |
| XSTU | Stuttgart Stock Exchange |
| XMUN | Gettex🔥 |
| TGAT | Tradegate🔥 |

If omitted, the script selects an exchange automatically (if possible).

## **2️⃣ BONDPRICE(date, isin, stockExchange)**

Returns the latest market price for a bond traded on **Euronext markets**.

### **Parameters:**

- `date` → always `Utils!$A$1`
- `isin` → ISIN code of the bond
- `stockExchange` → **MIC code (ISO 10383)** of the Euronext market where the bond is traded

### **Supported Euronext markets (MIC codes):**

| Exchange | MIC |
| --- | --- |
| Euronext Amsterdam | XAMS |
| Euronext Brussels | XBRU |
| Euronext Lisbon | XLIS |
| Oslo Børs | XOSL |
| Euronext Paris | XPAR |
| Euronext Growth Brussels | ALXB |
| Euronext Growth Milan | EXGM |
| Euronext Growth Paris | ALXP |
| Euronext Access Lisbon | ENXL |
| Euronext Access Brussels | MLXB |
| Euronext Access Paris | XMLI |
| Euronext Expert Market | VPXB |
| EuroTLX | ETLX |
| MOT | MOTX |
| Euronext Access Milan | XMOT |
| Nordic Alternative Bond Market | XOAM |

## **3️⃣ CRYPTOPRICE(date, symbol)**

Returns the latest cryptocurrency price.

### **Parameters:**

- `date` → always `Utils!$A$1`
- `symbol` → cryptocurrency ticker (e.g. `"BTC"`, `"ETH"`)

> 🔑 Requires a CoinMarketCap API key (see installation).
> 

## **4️⃣ COMMODITYPRICE(date, name)**

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

# 🧪 **Examples**

```
=ETPPRICE(Utils!$A$1;"IE00BK5BQT80")           // Price of VWCE from a random exchange
=ETPPRICE(Utils!$A$1;"IE00BK5BQT80";"XETR")    // Price of VWCE from XETRA
=ETPPRICE(Utils!$A$1;"VWCE.DE")                // Price of VWCE via Yahoo Finance

=BONDPRICE(Utils!$A$1;"IT0005672024";"MOTX")   // Italian government bond (MOT)
=BONDPRICE(Utils!$A$1;"FR0014001NN8";"XPAR")   // French OAT on Euronext Paris
=BONDPRICE(Utils!$A$1;"NL0015000QL2";"XAMS")   // Bond on Euronext Amsterdam

=CRYPTOPRICE(Utils!$A$1;"BTC")                 // Bitcoin price

=COMMODITYPRICE(Utils!$A$1;"Gold")             // Gold price (EUR/gram)
```

---

# 📜 License

This project is licensed under the **GNU General Public License v3.0**.

See the LICENSE file for full terms.

---

# 🛣️ Roadmap

Planned features and improvements for upcoming releases:

- [x] **XMUN Bonds:** Support for bonds traded on **Gettex (XMUN)**
- [x] **TGAT Bonds:** Support for bonds traded on 
- [x] New London Stock Exchange data source
- [x] Currency selection for London Stock Exchange
- [ ] Refactoring
- [ ] Improved caching system 
