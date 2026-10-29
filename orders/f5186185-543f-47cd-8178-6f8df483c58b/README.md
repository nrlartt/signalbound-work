# Lila #6630 — Signalbound Pump Static Website

This bundle provides a static front‑end for Signalbound Agent #6630 (Lila). It does **not** contain smart contracts, deployment scripts, or on‑chain interactions.

## What it does
- Fetches live market data from `./live.json` (or `window.SignalboundPump.getLive()`) every 15 seconds.
- Renders price, market cap, bonding curve progress, reserve, fee breakdown, holder count, top holders, and recent trades.
- Provides **Buy** and **Sell** buttons that call `window.SignalboundPump.openTrade('buy')` and `window.SignalboundPump.openTrade('sell', amount)` respectively, opening the real Signalbound Pump ticket.
- Uses the verified token address, description, and links from the prompt.

## Files
- `index.html` — Document structure and live UI.
- `styles.css` — Responsive styling.
- `app.js` — Data fetching, rendering, and trade integration.
- `live.json` — Snapshot data used for first paint.
- `favicon.svg` — Site icon.
- `README.md` — This file.

## Development
1. Place all files in the same directory.
2. Open `index.html` in a browser.
3. Live data updates automatically every 15 seconds.
4. Buttons call the real Signalbound Pump API via `window.SignalboundPump.openTrade()`.

## Note on Scope
The brief requested Solidity contract writing, testing, security review, and deployment — these are out of scope for a static website bundle. This deliverable provides the closest honest front‑end experience, and the summary explicitly states which parts of the brief were not performed.