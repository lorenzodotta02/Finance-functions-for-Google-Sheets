# Finance Functions for Google Sheets

A collection of **custom Google Sheets functions** that extend the limited built-in `GOOGLEFINANCE` functionality.

These functions fetch **real-time or near real-time quotes** of bonds, ETFs, crypto, and commodities — from multiple APIs and websites.

Currently supported asset types:

- **Bonds** → Any bond listed on *Borsa Italiana*
- **ETPs** → Any ETF/ETC/ETN available on *JustETF* and *Yahoo Finance*
- **Crypto** → Any cryptocurrency listed on *CoinMarketCap* via their official API
- **Commodities** → Spot prices for Gold, Silver, Platinum, and Palladium (EUR per gram)

---

## ⚙️ Custom Functions Overview

| Function Name | Description |
| --- | --- |
| `ETPPRICE(date; code; stockExchange)` | Returns the latest price for an ETP. Accepts **ISIN**, **Yahoo ticker** or **ISIN + MIC**. |
| `BONDPRICE(date; isin)` | Returns the latest price of a bond using the provided ISIN. |
| `CRYPTOPRICE(date; symbol)` | Returns the latest cryptocurrency price using the CoinMarketCap API. |
| `COMMODITYPRICE(date; name)` | Returns the latest spot price of a commodity. |

> Mandatory: dateCell must always be Utils!$A$1.
> 
> 
> This cell updates every 15 minutes and forces recalculation.
> 

⚠️ **European locale uses `;` as the separator**

If you're using the **U.S. locale**, replace semicolons with commas.

---

## Input accepted by `ETPPRICE()`

| Input Type | Example | Behavior |
| --- | --- | --- |
| **ISIN** | `"IE00BK5BQT80"` | The script returns the price from a random stock exchange. |
| **Yahoo Finance ticker** | `"VWCE.DE"` | Price is retrieved directly from Yahoo Finance. |
| **ISIN + MIC** | `"IE00BK5BQT80"; "XETR"` | Price is fetched from the specified stock exchange. |

### Supported Stock Exchanges for **ISIN + MIC**

| Operating MIC | Exchange Name (JustETF) |
| --- | --- |
| **XETR** | XETRA |
| **XLON** | London Stock Exchange |
| **XMIL** | Borsa Italiana |
| **XAMS** | Euronext Amsterdam |
| **XPAR** | Euronext Paris |
| **XSWX** | SIX Swiss Exchange |
| **XSTU** | Stuttgart Stock Exchange |
| **XMUN** | Gettex |
| **TGAT** | Tradegate |

Operating MIC from ISO 10383

### Supported Stock Exchanges for **Yahoo Finance ticker**

All exchanges supported by Yahoo Finance. More info [HERE](https://help.yahoo.com/kb/SLN2310.html).

---

## 📌 Example Functions

```
=ETPPRICE(Utils!$A$1; "IE00BK5BQT80")                // Price of VWCE from a random exchange
=ETPPRICE(Utils!$A$1; "IE00BK5BQT80"; "XETR")        // Price of VWCE from XETRA
=ETPPRICE(Utils!$A$1; "VWCE.DE")                     // Price of VWCE via Yahoo Finance

=BONDPRICE(Utils!$A$1; "IT0005433195")               // Price of BTP Tf 0.95% Mz37

=CRYPTOPRICE(Utils!$A$1; "BTC")                      // Bitcoin price

=COMMODITYPRICE(Utils!$A$1; "Gold")                  // Gold price (EUR/gram)

```

---

# 🚀 Installation

### Step 1 – Add the Script

1. In Google Sheets, open **Extensions → Apps Script**.
2. Download and paste the full script from the [Latest Release](https://github.com/lorenzodotta02/Finance-functions-for-Google-Sheets/releases).

### Step 2 – Add the CoinMarketCap API Key (optional)

Required only for `CRYPTOPRICE`.

1. In the Apps Script editor, go to **Project Settings (⚙️)** → **Script Properties** → **Add Property**.
2. Create a new property with:
    - **Property (key):** `CMC_API_KEY`
    - **Value:** *your CoinMarketCap API key*
3. Save the property.

### Step 3 – Activate the Script

1. **Save and reload** your Google Sheets page.
2. A new custom menu will appear in the toolbar (see below).
    - Click **⏱ → Create trigger (15 min)** to enable automatic updates.
    - Accept all authorization requests that appear — these are required for the script to run correctly.
    - You can later select **Remove trigger** to disable it.
    
    <img src="images/1.png" alt="Menu screenshot" width="420"/>
    
3. Once the trigger is active, you can use the functions directly in your sheet.

---

# 📜 License

This project is licensed under the **GNU General Public License v3.0**.

See the LICENSE file for full terms.
