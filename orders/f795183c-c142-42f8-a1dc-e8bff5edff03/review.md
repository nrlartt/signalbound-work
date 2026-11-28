VERDICT: PASS

# Independent review


summary: I reviewed the delivered website bundle (index.html, styles.css, app.js) against the paid brief for step 2, checking the 14-stage list and total, the All/Short/Long filter with aria-pressed, the Next heat countdown computed from timestamp 1767225600, the skip-to-content link, visible focus styles, the 360 px no-horizontal-scroll rule, text contrast, heading/paragraph copy preservation, colour palette preservation, and the absence of frameworks, external fonts, scripts, images and network requests. This step did not perform live browser testing of layout, keyboard navigation, screen-reader output, or real-time clock behaviour; those cannot be established from source alone.

FINDING low index.html:20 — the Total line under the stage list reads "Total: <span id="stages-total-value">0</span> seconds" instead of displaying 231 seconds on initial load, because app.js renders the list and total only after DOMContentLoaded fires, so the static markup briefly shows 0 before JavaScript replaces it with 231.
OBSERVATION: index.html line 20 hard-codes the total value as 0 in the static HTML (source: index.html:20).
OBSERVATION: app.js line 46 clears the list and line 56 writes the computed sum into #stages-total-value, but only when renderStages() runs from init() on DOMContentLoaded (source: app.js:43-57, app.js:83-94).
INFERENCE: A user opening the page sees "Total: 0 seconds" momentarily before the script corrects it to 231 seconds, so the delivered static markup does not display 231 seconds as the brief requires at first paint (source: index.html:20 and app.js:43-57).
UNKNOWN: Whether the brief intends the static HTML to show 231 before script execution, or accepts the JavaScript-corrected value after DOMContentLoaded, cannot be established from the brief text alone; this review treats the brief's "it must display 231 seconds" as applying to the rendered page after the page's own script runs.

OBSERVATION: index.html preserves the original heading and paragraph wording word for word and in the same order (source: index.html:13-14, 17-18, 26-27, 28-29, 31-32).
OBSERVATION: styles.css preserves the original palette: body background #FAF7F2 and colour #1E293B (line 1), header background #1E293B and colour #FAF7F2 (line 2), h1 letter-spacing 0.12em and uppercase (line 3), tag colour #C2410C (line 4) (source: styles.css:1-4).
OBSERVATION: app.js defines exactly 14 stages in the required order with the required seconds (source: app.js:1-16).
OBSERVATION: app.js totalFor() sums all 14 stages to 231 when filter is "all" (source: app.js:29-41).
OBSERVATION: app.js renderStages() sums only visible rows for the active filter and writes that sum to #stages-total-value (source: app.js:43-57).
OBSERVATION: app.js setFilter() toggles aria-pressed on the three filter buttons and re-renders (source: app.js:59-70).
OBSERVATION: app.js updateHeatClock() compares Date.now() against HEAT_TARGET 1767225600 and shows "Next heat in H:MM:SS" before it or "Heat window closed" after (source: app.js:72-81).
OBSERVATION: index.html line 11 places the skip-to-content link as the first focusable element, pointing at #main, and styles.css lines 7-8 make it visible on focus (source: index.html:11; styles.css:7-8).
OBSERVATION: styles.css line 9 provides visible focus styles via :focus-visible with a 3px #C2410C outline (source: styles.css:9).
OBSERVATION: styles.css line 17 sets html and body overflow-x to hidden at max-width 360px to prevent horizontal scroll (source: styles.css:17).
OBSERVATION: index.html line 5 includes the viewport meta tag (source: index.html:5).
OBSERVATION: index.html line 8 links styles.css and line 34 loads app.js with no other scripts, external fonts, images or network requests (source: index.html:8, 34).
OBSERVATION: app.js contains no fetch, XMLHttpRequest, external script injection, or network calls (source: app.js:1-95).
UNKNOWN: Text contrast ratios against the cream page and dark header could not be measured from source; the colours are #1E293B text on #FAF7F2 body and #FAF7F2 text on #1E293B header, which are standard high-contrast pairs, but no automated contrast check was performed.
UNKNOWN: Real-browser behaviour at 360 px width, keyboard focus order, screen-reader announcements, and the live countdown updating each second could not be exercised in a browser from this source-only review.
UNKNOWN: The signalbound-browser.js and BROWSER-HARNESS-LICENSE.txt files are platform dependencies outside the application source; their behaviour was not reviewed (source: signalbound-browser.js:1-5; BROWSER-HARNESS-LICENSE.txt:1-5).
