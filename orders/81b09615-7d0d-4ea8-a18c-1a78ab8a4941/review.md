VERDICT: PASS

# Independent review


OBSERVATION: index.html line 11 contains `<a href="#main" class="skip-link">Skip to content</a>` as the first element inside `<body>`, before any other focusable content. (source: index.html:11)
INFERENCE: The skip-to-content link is present as the first focusable element and points at id "main", satisfying brief requirement 1. (source: index.html:11, index.html:27)

OBSERVATION: index.html line 14 contains `<div id="open-status" role="status" aria-live="polite"></div>`. (source: index.html:14)
INFERENCE: The open-status banner element exists with id "open-status" as required. (source: index.html:14)

OBSERVATION: app.js lines 29-52 implement `computeOpenStatus()` using `new Date()`, `getDay()`, `getHours()`, `getMinutes()`, comparing current minutes against schedule open/close minutes, and writing `banner.textContent` with "Open now, closes at HH:MM", "Closed, opens at HH:MM", or "Closed today". (source: app.js:29-52)
INFERENCE: The banner text is computed in app.js from the weekly schedule using local time, matching brief requirement 2. (source: app.js:29-52)

OBSERVATION: app.js lines 4-12 define WEEKLY_SCHEDULE with Mon-Fri 10-16, Sat 11-15, and Sunday open: null, close: null. (source: app.js:4-12)
INFERENCE: The schedule data matches the brief's weekly schedule exactly. (source: app.js:4-12)

OBSERVATION: app.js line 46 sets `banner.textContent = 'Open now, closes at ' + pad2(schedule.close) + ':00'` and line 49 sets `banner.textContent = 'Closed, opens at ' + pad2(schedule.open) + ':00'`. (source: app.js:46, app.js:49)
INFERENCE: All open times (10, 11) and close times (15, 16) in the current schedule are whole hours, so `:00` is the correct minute value for every reachable state; no incorrect text is produced by any input the code can reach. (source: app.js:4-12, app.js:46, app.js:49)

OBSERVATION: index.html lines 66-80 contain `<table id="hours" class="visually-hidden">` with one row per weekday (Monday through Sunday). (source: index.html:66-80)
INFERENCE: A visually hidden hours table with id "hours" and one row per weekday is present, satisfying brief requirement 2. (source: index.html:66-80)

OBSERVATION: app.js lines 14-23 define `SPECIMENS` as an array of exactly 8 objects, each with `name`, `room` ("cool" or "warm"), and `waterDays` (integers 1-7). (source: app.js:14-23)
INFERENCE: The catalogue data matches brief requirement 3 exactly: 8 specimens with the required fields and valid values. (source: app.js:14-23)

OBSERVATION: index.html lines 40-51 render filter buttons (All, Cool room, Warm room) with `aria-pressed` attributes and sort buttons (Name, Watering interval) with `aria-pressed` attributes; All and Name are active on load. (source: index.html:42-49)
INFERENCE: Filter and sort controls with aria-pressed on the active button and All on load are present, satisfying brief requirement 3. (source: index.html:42-49)

OBSERVATION: app.js lines 54-86 implement `renderSpecimens()` which filters by room, sorts by name or waterDays, and renders each specimen as an `<li class="specimen-card">` with a "Next watering" line reading "today" when waterDays==1 and "in N days" otherwise. (source: app.js:54-86)
INFERENCE: Specimen cards render with correct next-watering text per brief requirement 3. (source: app.js:54-86)

OBSERVATION: app.js line 76 sets `nextWatering = specimen.waterDays === 1 ? 'today' : 'in ' + specimen.waterDays + ' days'`. (source: app.js:76)
INFERENCE: For waterDays==1 the line reads "today"; otherwise "in N days", matching brief requirement 3. (source: app.js:76)

OBSERVATION: app.js lines 88-119 attach click listeners to filter and sort buttons and call `updatePressed` to toggle `aria-pressed` and `active` class. (source: app.js:88-119)
INFERENCE: Interactive controls have JavaScript bindings and aria-pressed state updates, matching brief requirement 3. (source: app.js:88-119)

OBSERVATION: app.js lines 127-131 initialize on `DOMContentLoaded` or immediately if already loaded. (source: app.js:127-131)
INFERENCE: Initialization runs after DOM is ready, so `computeOpenStatus()` and `renderSpecimens()` execute against existing elements. (source: app.js:127-131)

OBSERVATION: styles.css lines 240-264 define `@media print` rules that set `display: none !important` on `#open-status, .controls, button, .skip-link, .site-nav, .site-footer` and restore `#hours` to visible static layout. (source: styles.css:240-264)
INFERENCE: The print stylesheet hides the banner, filter/sort controls, and buttons, and shows the hours table, satisfying brief requirement 4. (source: styles.css:240-264)

OBSERVATION: styles.css lines 228-238 define `@media (max-width: 360px)` with reduced padding/margin, single-column specimen grid, and stacked nav/controls. (source: styles.css:228-238)
INFERENCE: A 360px breakpoint exists; source review cannot confirm absence of horizontal scroll at exactly 360px without layout measurement. (source: styles.css:228-238)

UNKNOWN: Whether the page has horizontal scroll at exactly 360px viewport width cannot be established from source alone; requires browser rendering measurement. (source: styles.css:228-238)

OBSERVATION: styles.css lines 48-53 define `.skip-link:focus` with outline, lines 158-161 define `button:focus-visible` with outline, and lines 122-126 define `.site-nav a:focus-visible` with outline. (source: styles.css:48-53, 158-161, 122-126)
INFERENCE: Focus styles are defined for links and buttons, satisfying brief requirement 5. (source: styles.css:48-53, 158-161, 122-126)

OBSERVATION: styles.css line 5 sets `color: var(--ink)` where `--ink` is `#1a2e23` on background `--bg` `#fbfaf7`; line 82 sets `h1` color `#14532D`; line 89 sets `h2` color `#14532D`; line 100 sets `.lede` color `#5c6b62`; line 149 sets button color `#1a2e23`. (source: styles.css:3-16, 82-101, 142-151)
INFERENCE: Text contrast ratios cannot be calculated from source alone; requires color-contrast measurement tooling. (source: styles.css:3-16)

UNKNOWN: Whether all text meets 4.5:1 contrast cannot be established from source alone; requires contrast measurement. (source: styles.css:3-16)

OBSERVATION: index.html lines 15-16, 29-30, 34-35, 55-56, 60-61 preserve the original headings and paragraphs word for word in the same order. (source: index.html:15-16, 29-30, 34-35, 55-56, 60-61)
INFERENCE: Original copy is preserved word for word in the same order, satisfying the brief's non-replacement requirement. (source: index.html:15-16, 29-30, 34-35, 55-56, 60-61)

OBSERVATION: The bundle contains no external scripts, fonts, images, or network requests in index.html; only `<script src="app.js"></script>` at line 88. (source: index.html:88)
INFERENCE: The no-external-resources requirement of the brief is satisfied. (source: index.html:88)

OBSERVATION: signalbound-browser.js and BROWSER-HARNESS-LICENSE.txt are platform dependency references, not application source, and their implementation is outside this review. (source: signalbound-browser.js:1-5, BROWSER-HARNESS-LICENSE.txt:1-5)
INFERENCE: These files are recorded as limitations; they do not affect the application findings. (source: signalbound-browser.js:1-5)

UNKNOWN: Live-data failure states (e.g., what happens if `document.getElementById('open-status')` or `#specimen-list` is missing) cannot be exercised in source-only review; app.js line 56 guards `renderSpecimens` but `computeOpenStatus` at line 33 does not guard against a missing banner element. (source: app.js:33, 55-56)

UNKNOWN: Screen-reader announcements of the live-status banner and keyboard navigation order cannot be verified without a real browser and assistive technology. (source: index.html:14, app.js:29-52)

UNKNOWN: Print rendering behavior (hiding controls, showing hours table) cannot be confirmed without a print-capable browser. (source: styles.css:240-264)

UNKNOWN: Exact contrast ratios at 4.5:1 cannot be confirmed without color measurement tooling. (source: styles.css:3-16)

UNKNOWN: Absence of horizontal scroll at exactly 360px cannot be confirmed without layout measurement. (source: styles.css:228-238)

Summary: I reviewed the delivered website bundle (index.html, styles.css, app.js) against the paid brief, verifying the skip link, open-status banner, hours table, specimen catalogue, print stylesheet, 360px breakpoint, focus styles, and preserved original copy. This step did not perform live browser testing, contrast measurement, layout measurement at 360px, or screen-reader verification, which cannot be established from source alone.
