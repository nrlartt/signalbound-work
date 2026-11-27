VERDICT: PASS

# Independent review


summary: I reviewed the delivered Paper Desk website bundle (index.html, styles.css, app.js, plus platform dependency references) against the paid brief: embedded trade data, P&L math, date-sorted table, All/Wins/Losses filters with aria-pressed state, live summary line, negative-P&L minus sign and loss class, Copy CSV button with header line and 2-second "Copied" feedback, 360 px responsive layout with scrollable table container, and the paper-trading notice. I traced user actions through the actual event handlers and verified each required behavior in the source. This step did not perform live browser testing of layout, keyboard navigation, screen-reader output, or clipboard behavior; those cannot be established from source-only review.

OBSERVATION: index.html line 1 declares `<!doctype html>` and line 2 sets `<html lang="en">` (source: index.html:1-2).
OBSERVATION: index.html line 5 sets `<meta name="viewport" content="width=device-width, initial-scale=1">` (source: index.html:5).
OBSERVATION: index.html line 6 sets a page description meta tag (source: index.html:6).
OBSERVATION: index.html line 13 contains `<p class="notice">Paper trading only - no real money</p>` inside the header (source: index.html:13).
OBSERVATION: index.html lines 17-19 render three filter buttons All, Wins, Losses with `aria-pressed="true"` on All and `"false"` on the others (source: index.html:17-19).
OBSERVATION: index.html line 20 renders a Copy CSV button with id `copy-csv` (source: index.html:20).
OBSERVATION: index.html line 22 renders a summary paragraph with id `summary` and initial text "8 trades, 5 wins, net P&L 480" (source: index.html:22).
OBSERVATION: index.html lines 24-37 render a table with columns Date, Symbol, Side, Entry, Exit, Qty, P&L and an empty tbody with id `trade-body` (source: index.html:24-37).
OBSERVATION: index.html line 40 renders an empty-state paragraph with id `empty` and attribute `hidden` (source: index.html:40).
OBSERVATION: app.js lines 1-10 embed exactly the 8 closed trades specified in the brief with date, symbol, side, entry, exit, qty (source: app.js:1-10).
OBSERVATION: app.js lines 12-16 compute P&L as `(exit - entry) * qty` for long and `(entry - exit) * qty` for short (source: app.js:12-16).
OBSERVATION: app.js lines 18-20 format negative P&L with a leading minus sign and absolute value, non-negative as plain string (source: app.js:18-20).
OBSERVATION: app.js lines 33-73 render filtered rows into tbody, count wins and net P&L, and write the summary line "N trades, W wins, net P&L X" (source: app.js:33-73).
OBSERVATION: app.js lines 34-39 filter by wins (p > 0), losses (p < 0), or all (source: app.js:34-39).
OBSERVATION: app.js lines 75-79 set `aria-pressed` to "true" for the active filter key and "false" for the others (source: app.js:75-79).
OBSERVATION: app.js lines 81-87 bind click handlers to all three filter buttons that set `active`, call `setPressed`, and re-render (source: app.js:81-87).
OBSERVATION: app.js lines 89-121 bind a click handler to Copy CSV that builds visible-row CSV with header `Date,Symbol,Side,Entry,Exit,Qty,PnL`, attempts `document.execCommand("copy")`, sets button text to "Copied" or "Copy failed", and restores it after 2000 ms (source: app.js:89-121).
OBSERVATION: app.js lines 123-124 initialize `aria-pressed` via `setPressed("all")` and call `render()` on load (source: app.js:123-124).
OBSERVATION: styles.css lines 107-114 give `.table-wrap` `overflow: auto` and `max-width: 100%`, so the table can scroll inside its container without horizontal page scroll (source: styles.css:107-114).
OBSERVATION: styles.css lines 172-179 contain a `@media (max-width: 360px)` breakpoint adjusting header, main, cell padding/font, and stacking controls (source: styles.css:172-179).
OBSERVATION: styles.css line 145 defines `.loss { color: var(--loss); }` and app.js line 67 applies class `loss` when `p < 0` (source: styles.css:145; app.js:67).
OBSERVATION: index.html line 42 loads `app.js` after the DOM elements it references (source: index.html:42).
OBSERVATION: signalbound-browser.js and BROWSER-HARNESS-LICENSE.txt are platform dependency references, not generated application source, and their implementation is outside this review (source: signalbound-browser.js:1-5; BROWSER-HARNESS-LICENSE.txt:1-5).
INFERENCE: On load, `setPressed("all")` makes All active and `render()` shows all 8 trades; P&L values are 120, 80, -60, 200, -60, -80, 120, 160, giving 5 wins and net 480, matching the required initial summary (source: app.js:1-16, 33-73, 123-124; index.html:22).
INFERENCE: Clicking Wins shows only p > 0 trades, clicking Losses shows only p < 0 trades, and `aria-pressed` updates to reflect the active button (source: app.js:34-39, 75-79, 81-87).
INFERENCE: The Copy CSV handler iterates `trades` and applies the same win/loss skip rules as the filter, so the clipboard contains the visible rows with the required header (source: app.js:89-105).
INFERENCE: The table container has `overflow: auto` and full max-width, so at 360 px the page should not scroll horizontally while the table may scroll internally (source: styles.css:107-114, 172-179).
INFERENCE: The notice text matches the brief exactly and is visible in the header (source: index.html:13).
INFERENCE: No external fonts, scripts, images, or network requests are referenced in index.html; only local styles.css and app.js are loaded (source: index.html:8, 42).
UNKNOWN: Visual layout at exactly 360 px width, horizontal page scroll, and table-internal scrolling cannot be established from source-only review; no real browser or rendering engine was exercised (source: styles.css:107-114, 172-179 — CSS only, no layout test).
UNKNOWN: Keyboard navigation, focus order, and screen-reader announcements for the filter buttons and live region cannot be established from source-only review; no assistive technology or keyboard test was performed (source: index.html:17-20; app.js:81-87 — markup and handlers only).
UNKNOWN: Clipboard behavior (`document.execCommand("copy")`) and the visible 2-second "Copied" state cannot be established from source-only review; no browser clipboard or timing test was performed (source: app.js:115-120).
UNKNOWN: The `signalbound-browser.js` DOM harness is not a full browser, so its `loadPage`/`assertHealthy` cannot certify layout, accessibility, or live-data failure behavior (source: signalbound-browser.js:5).
