VERDICT: PASS

# Independent review


summary: I reviewed the delivered website bundle (index.html, styles.css, app.js, plus platform dependency files) against the paid brief by reading the source and tracing each required behavior through the code: program list rendering and count, filter strip with aria-pressed state and matching counts, countdown computed from the fixed Unix timestamp, skip-to-content link targeting id "main", visible focus rings, body text contrast on both page and header colours, and the 360 px sideways-scroll rule. I found no brief-scoped defects. This step did not perform live browser testing, so layout, rendering, and real-user interaction could not be exercised.

FINDING none

OBSERVATION index.html:11 renders the skip-to-content link as the first focusable control in the body, with href="#main".
INFERENCE The skip link targets id "main", which is assigned to the main element at index.html:16, satisfying the brief's skip-to-content requirement.

OBSERVATION styles.css:7-8 hides the skip link off-screen by default and reveals it on focus with background #FBBF24 and color #2A1F1A; styles.css:9 applies a 3px gold outline to :focus-visible elements, and styles.css:13 gives filter buttons the same visible focus ring.
INFERENCE Visible focus rings are provided for keyboard focus, satisfying the brief's focus-ring requirement.

OBSERVATION styles.css:1 sets body background #EDE6DA and color #2A1F1A; styles.css:2 sets header background #3F2E27 and color #EDE6DA.
INFERENCE Body text contrast on the slip-coloured page (#2A1F1A on #EDE6DA) and header text contrast (#EDE6DA on #3F2E27) both exceed 4.5:1, satisfying the brief's contrast requirement.

OBSERVATION app.js:1-11 defines exactly nine programs in the required order: Bisque Low (cone 06), Bisque Mid (cone 04), Earthenware (cone 04), Stoneware Ox (cone 6), Stoneware Red (cone 6), Cone 8 Hold (cone 8), Crystal Soak (cone 8), Luster (cone 018), Overglaze (cone 018).
INFERENCE The program list content matches the brief's required order and labels.

OBSERVATION app.js:15-28 renders each program as an li with "name — cone" text, counts visible rows, and writes the count to #count-value; app.js:55 initializes with renderPrograms("all"), showing 9 rows.
INFERENCE The "Programs shown" line displays 9 when nothing is filtered, matching the brief.

OBSERVATION index.html:20-24 renders the filter strip with All / High fire / Low fire buttons, All having aria-pressed="true" and class active; app.js:30-37 toggles the active class and aria-pressed attribute based on the selected filter; app.js:59-62 binds click handlers that re-render and re-set pressed state.
INFERENCE The pressed button uses aria-pressed, All is pressed on first load, and filter clicks update both the list and the pressed state.

OBSERVATION app.js:20 shows high filter matches fire === "high" (Stoneware Ox, Stoneware Red, Cone 8 Hold, Crystal Soak = 4 rows) and low filter matches fire === "low" (Bisque Low, Bisque Mid, Earthenware, Luster, Overglaze = 5 rows).
INFERENCE High fire shows 4 programs and low fire shows 5, matching the brief's required counts.

OBSERVATION app.js:13 sets TARGET to 1803859200000 (1 March 2027 00:00 UTC); app.js:39-52 computes diff from Date.now(), shows "Next load in H:MM:SS" before the target and "Booking closed" at or after it; app.js:64-65 runs the update immediately and every second.
INFERENCE The countdown is computed in app.js from the fixed Unix time and shows the required text before and after the instant.

OBSERVATION styles.css:19-22 contains a @media (max-width:360px) rule setting html,body overflow-x:hidden and adjusting main padding and filter-strip layout.
INFERENCE At 360 px the page suppresses sideways scroll, satisfying the brief's responsive requirement.

OBSERVATION index.html:38 loads app.js as the only script; app.js:68 initializes on DOMContentLoaded; no fetch, XMLHttpRequest, EventSource, WebSocket, or other network APIs appear in app.js; no external stylesheets, scripts, fonts, or images are referenced.
INFERENCE The page makes no network call at runtime and uses no framework, webfont, remote script, or picture host, satisfying the brief's delivery constraints.

OBSERVATION index.html:17-18, 28-29, 30-31, 35-36 preserve the original h2 headings and paragraphs in the same order and wording; styles.css:1-6 preserve the original palette (#3F2E27 header, #EDE6DA page, #9A3412 headings, #FBBF24 tag, Georgia/serif stack) and h1 styling; index.html:13-14 keep the h1 un-uppercase.
INFERENCE The original sentences, colours, heading order, and h1 case are unchanged, satisfying the brief's preservation requirement.

OBSERVATION index.html:32-34 places the "Next load" strip directly under "How a firing works" with aria-live="polite"; index.html:19-27 places the program list and filter strip directly under "The workshop".
INFERENCE Both new sections are positioned exactly where the brief requires.

UNKNOWN: Real-browser layout, paint, keyboard traversal, screen-reader announcement, and contrast under actual rendering could not be established from source-only review; the delivered signalbound-browser.js is a DOM harness, not a full browser or layout engine (source: signalbound-browser.js:1-5).

outside the brief — non-blocking: index.html:20-24 uses role="group" and aria-label on the filter strip, which the brief did not require but supports accessibility.

outside the brief — non-blocking: app.js:32-36 sets aria-pressed as an attribute rather than a property, which works but is not required by the brief.

outside the brief — non-blocking: styles.css:17-18 style the count-line and next-load elements, which the brief did not require but does not prohibit.
