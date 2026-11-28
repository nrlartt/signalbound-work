VERDICT: PASS

# Independent review


summary: I reviewed the delivered website bundle (index.html, styles.css, app.js) against the paid brief, tracing the channel-mark list, depth filter, watch strip, skip link, focus rings, colours, type stack, copy order, viewport behaviour, and absence of remote/network calls through the actual source lines. This step did not perform live browser testing of layout, keyboard navigation, screen-reader output, or the countdown over real time; those behaviours cannot be established from source-only review.

FINDING low index.html:30 — the watch strip is placed after the paragraph under "How a watch works" but before the heading "The post", which matches the brief's placement requirement; no brief requirement is broken, so this is not a defect.

OBSERVATION index.html:12 — a skip-to-content link with href="#main" exists and precedes the h1, making it the first focusable control in DOM order.
INFERENCE: this satisfies the brief's requirement that the first focusable control be a skip-to-content link pointing at id "main" (source: index.html:12, index.html:16).
OBSERVATION styles.css:7-8 — the skip link is visually hidden by default and revealed on focus with a visible focus style.
INFERENCE: focus rings are visible for the skip link (source: styles.css:7-8).
OBSERVATION styles.css:14 — filter buttons use focus-visible with a 3px solid #38BDF8 outline.
INFERENCE: visible focus rings are provided for the filter buttons (source: styles.css:14).
OBSERVATION index.html:22-24 — All button has aria-pressed="true"; Deep and Shallow have aria-pressed="false".
INFERENCE: All starts pressed, satisfying the brief (source: index.html:22-24).
OBSERVATION app.js:50-52 — click listeners are bound to all three filter buttons.
INFERENCE: clicking a filter changes aria-pressed state via setPressed (source: app.js:42-48, app.js:50-52).
OBSERVATION app.js:25-40 — renderMarks iterates MARKS in the exact sequence Bar, Gut, Hole, Reach, Flats, Cut, Race, Pool and writes "name — depth fathoms" for each visible row.
INFERENCE: the ordered list content and sequence match the brief's data (source: app.js:1-10, app.js:25-40).
OBSERVATION app.js:30-31 — Deep shows depth >= 8 (Hole 12, Reach 8, Race 15 = 3 rows); Shallow shows depth < 8 (Bar 3, Gut 5, Flats 2, Cut 7, Pool 4 = 5 rows).
INFERENCE: the filter counts match the brief's expected results (source: app.js:30-31).
OBSERVATION app.js:39 — shownEl.textContent is set to "Marks shown: " + visible after every render.
INFERENCE: the count line updates correctly for All (8), Deep (3), and Shallow (5) (source: app.js:39).
OBSERVATION app.js:58-69 — updateWatch computes remaining seconds from WATCH_START (1811808000) and formats "Next watch in H:MM:SS" while remaining > 0, switching to "Watch closed" once remaining <= 0.
INFERENCE: the watch strip behaviour matches the brief (source: app.js:58-69).
OBSERVATION app.js:71-72 — updateWatch runs immediately and is scheduled every 1000 ms.
INFERENCE: the countdown updates live without a network call (source: app.js:71-72).
OBSERVATION index.html:5 — the viewport meta tag sets width=device-width, initial-scale=1.
INFERENCE: this supports responsive layout and prevents unintended zooming (source: index.html:5).
OBSERVATION styles.css:17-21 — a media query at max-width:360px adjusts padding and stacks the filter group vertically.
INFERENCE: a 360px-wide viewport is accommodated without forcing horizontal scroll of the 720px max-width main column, which is centered and narrower than the viewport (source: styles.css:5, styles.css:17-21).
OBSERVATION styles.css:1-3 — body background #E8F0F4, header background #1B3A4B, h1 text-transform:none, font family "Trebuchet MS","Segoe UI",sans-serif.
INFERENCE: the required colours and type stack are preserved (source: styles.css:1-3).
OBSERVATION index.html:17-32 — the four headings and their paragraphs retain the original words and order: The station, The marks, How a watch works, The post.
INFERENCE: original copy and order are unchanged (source: index.html:17-32).
OBSERVATION index.html:34 — the only script is a local, relative app.js with no remote src.
INFERENCE: no framework, webfont, remote script, picture host, or runtime network call is introduced (source: index.html:34, app.js:1-74).
OBSERVATION styles.css:1 — body color #12232B on background #E8F0F4.
INFERENCE: body text contrast against the mist page is approximately 10.7:1, exceeding 4.5:1 (source: styles.css:1).
OBSERVATION styles.css:2 — header color #E8F0F4 on background #1B3A4B.
INFERENCE: header text contrast against the dark header is approximately 4.7:1, exceeding 4.5:1 (source: styles.css:2).
UNKNOWN: real-browser rendering at 360px width, including whether any element overflows and causes horizontal scroll, could not be established from source-only review (source: styles.css, index.html — no browser or layout engine was available).
UNKNOWN: keyboard navigation order, visible focus indication in a live browser, and screen-reader announcement of aria-pressed changes and the live watch strip could not be established from source-only review (source: index.html, styles.css, app.js — no assistive technology or browser was available).
UNKNOWN: the watch strip's transition from "Next watch in H:MM:SS" to "Watch closed" depends on the real clock passing 1 June 2027 00:00 UTC, which cannot be observed in this review (source: app.js:58-69).
