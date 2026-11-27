# Findings

## Source examined

OBSERVATION: The complete module source was provided in the paid brief as a single JavaScript snippet containing two exported functions, parseLinks and uniqueTargets, with line 1 being the comment line (source: paid brief).

OBSERVATION: Line 1 is `// Parses [[Target]] and [[Target|label]] links in community wiki text.` (source: paid brief).

OBSERVATION: Line 2 is blank (source: paid brief).

OBSERVATION: Line 3 is `export function parseLinks(text) {` (source: paid brief).

OBSERVATION: Line 4 is `  const out = [];` (source: paid brief).

OBSERVATION: Line 5 is `  const re = /\\[\\[([^\\[\\|]*)(?:\\|([^\\[\\]]*))?\\]\\]/g;` (source: paid brief).

OBSERVATION: Line 6 is `  let m;` (source: paid brief).

OBSERVATION: Line 7 is `  while ((m = re.exec(text)) !== null) {` (source: paid brief).

OBSERVATION: Line 8 is `    const raw = m[1].trim();` (source: paid brief).

OBSERVATION: Line 9 is `    if (raw === '') continue;` (source: paid brief).

OBSERVATION: Line 10 is `    const [page, anchor] = raw.split('#', 2);` (source: paid brief).

OBSERVATION: Line 11 is `    const target = page.charAt(0).toUpperCase() + page.slice(1).replace(/ +/g, '_');` (source: paid brief).

OBSERVATION: Line 12 is `    const label = m[2] === undefined ? raw : (m[2] === '' ? page.replace(/\s*\(.*\)$/, '') : m[2]);` (source: paid brief).

OBSERVATION: Line 13 is `    out.push({ target, anchor: anchor ?? null, label, index: m.index });` (source: paid brief).

OBSERVATION: Line 14 is `  }` (source: paid brief).

OBSERVATION: Line 15 is `  return out;` (source: paid brief).

OBSERVATION: Line 16 is `}` (source: paid brief).

OBSERVATION: Line 17 is blank (source: paid brief).

OBSERVATION: Line 18 is `export function uniqueTargets(text) {` (source: paid brief).

OBSERVATION: Line 19 is `  const seen = new Set();` (source: paid brief).

OBSERVATION: Line 20 is `  for (const l of parseLinks(text)) seen.add(l.target.toLowerCase());` (source: paid brief).

OBSERVATION: Line 21 is `  return [...seen].sort();` (source: paid brief).

OBSERVATION: Line 22 is `}` (source: paid brief).

## Regular expression

OBSERVATION: The regular expression is `/\\[\\[([^\\[\\|]*)(?:\\|([^\\[\\]]*))?\\]\\]/g` (source: paid brief line 5).

OBSERVATION: The pattern requires a literal opening `[[` (source: paid brief line 5).

OBSERVATION: The first capture group `([^\\[\\|]*)` accepts any sequence of characters that are not `[`, `]`, or `|` (source: paid brief line 5).

OBSERVATION: The pipe and label part `(?:\\|([^\\[\\]]*))?` is optional, so a link with no pipe matches (source: paid brief line 5).

OBSERVATION: When a pipe is present, the second capture group `([^\\[\\]]*)` accepts any sequence of characters that are not `[` or `]`, including an empty sequence (source: paid brief line 5).

OBSERVATION: The pattern requires a literal closing `]]` (source: paid brief line 5).

OBSERVATION: Because `[` and `]` are excluded from both capture groups, nested brackets inside a link are not accepted as part of the target or label (source: paid brief line 5).

OBSERVATION: Because `[` and `]` are excluded from both capture groups, unbalanced brackets inside a link are not accepted as part of the target or label (source: paid brief line 5).

OBSERVATION: A second `|` inside the label is accepted because the label character class excludes only `[` and `]`, not `|` (source: paid brief line 5).

OBSERVATION: The global flag `g` is present, so `re.exec` advances through the string across repeated calls (source: paid brief line 5).

OBSERVATION: `index` is set to `m.index`, which is the zero-based position in the input string where the current match begins (source: paid brief line 13).

## Trimming

OBSERVATION: `raw` is assigned `m[1].trim()`, so leading and trailing whitespace is removed from the raw target before further processing (source: paid brief line 8).

OBSERVATION: If `raw` is an empty string after trimming, the match is skipped with `continue` (source: paid brief line 9).

OBSERVATION: Trimming applies only to the target portion `m[1]`; the label portion `m[2]` is not trimmed (source: paid brief lines 8 and 12).

## Anchors after #

OBSERVATION: `raw.split('#', 2)` splits the trimmed target at the first `#` into at most two parts (source: paid brief line 10).

OBSERVATION: `page` is the part before the first `#`, and `anchor` is the part after it if present (source: paid brief line 10).

OBSERVATION: If there is no `#`, `anchor` is `undefined` (source: paid brief line 10).

OBSERVATION: If there are multiple `#` characters, only the first split occurs because the limit is 2, so `anchor` contains everything after the first `#`, including any further `#` characters (source: paid brief line 10).

OBSERVATION: `anchor` is stored as `anchor ?? null`, so a missing anchor becomes `null` in the output object (source: paid brief line 13).

## Capitalisation and space replacement

OBSERVATION: `target` is built by uppercasing `page.charAt(0)` and concatenating `page.slice(1)` with every run of one or more spaces replaced by a single `_` (source: paid brief line 11).

OBSERVATION: Only the first character of `page` is uppercased; remaining characters keep their original case (source: paid brief line 11).

OBSERVATION: Only space characters (` `) are replaced by `_`; tabs and other whitespace are not replaced by this regular expression (source: paid brief line 11).

OBSERVATION: Because `raw` was trimmed before splitting, leading and trailing spaces are already removed from `page`, but internal spaces remain subject to the underscore replacement (source: paid brief lines 8 and 11).

## Label rules

OBSERVATION: When no pipe is present, `m[2]` is `undefined`, so `label` is set to `raw`, the trimmed full target including any anchor portion (source: paid brief line 12).

OBSERVATION: When a pipe is present and `m[2]` is an empty string, `label` is set to `page.replace(/\s*\(.*\)$/, '')`, which removes optional whitespace followed by a parenthesised suffix from the end of `page` (source: paid brief line 12).

OBSERVATION: When a pipe is present and `m[2]` is non-empty, `label` is set to `m[2]` exactly, with no trimming or modification (source: paid brief line 12).

## uniqueTargets de-duplication and sorting

OBSERVATION: `uniqueTargets` iterates over the results of `parseLinks(text)` and adds `l.target.toLowerCase()` to a Set (source: paid brief line 20).

OBSERVATION: Because the Set stores lowercased targets, targets that differ only in case are treated as duplicates (source: paid brief line 20).

OBSERVATION: The Set is spread into an array and sorted with the default `sort()`, producing lexicographic order by UTF-16 code units (source: paid brief line 21).

OBSERVATION: `uniqueTargets` returns only the target strings, not anchors, labels, or indexes (source: paid brief line 21).

## Surprising behaviours

OBSERVATION: `[[#Top]]` yields `raw` equal to `#Top`, which is non-empty, so it is not skipped; `page` becomes `#Top`, `anchor` becomes `undefined`, and `target` becomes `#Top` because the first character `#` is uppercased to itself (source: paid brief lines 8, 10, and 11).

INFERENCE: A link whose target begins with `#` is treated as having no anchor, because the split happens after the target is taken and the leading `#` remains part of `page` (source: paid brief lines 10 and 11).

OBSERVATION: `[[ swarm  robotics#History|robots]]` produces `target` `Swarm_robotics`, `anchor` `History`, and `label` `robots` (source: paid brief lines 8, 10, 11, and 12).

OBSERVATION: `[[a|b|c]]` produces `target` `A`, `anchor` `null`, `label` `b|c`, and `index` equal to the match start position (source: paid brief lines 8, 10, 11, 12, and 13).

OBSERVATION: `[[Ant (insect)|]]` produces `target` `Ant_(insect)`, `anchor` `null`, `label` `Ant`, and `index` equal to the match start position (source: paid brief lines 8, 10, 11, and 12).

OBSERVATION: `[[bee colony]]` produces `target` `Bee_colony`, `anchor` `null`, `label` `bee colony`, and `index` equal to the match start position (source: paid brief lines 8, 10, 11, and 12).

OBSERVATION: `[[Hive]] [[hive]]` produces two parse results whose targets are both `Hive`, so `uniqueTargets` returns `['hive']` (source: paid brief lines 20 and 21).

OBSERVATION: `[[x]]]` matches `[[x]]` and leaves the trailing `]` unmatched (source: paid brief line 5).

OBSERVATION: `[[]]` produces `raw` equal to `''`, so it is skipped and yields no output entry (source: paid brief lines 8 and 9).

INFERENCE: The label rule for an empty label after a pipe strips a parenthesised suffix from `page`, which can produce a label different from both the raw target and the explicit label (source: paid brief line 12).

INFERENCE: Because `page.charAt(0)` is used on a possibly empty string only after the empty check, an empty target cannot reach line 11, but a target consisting of a single character still has that character uppercased (source: paid brief lines 9 and 11).

## Unknowns

UNKNOWN: Whether the runtime environment supports ES modules and the `export` keyword, because the brief supplies only the source text and no execution context (source: paid brief; no execution environment was provided).

UNKNOWN: The exact numeric `index` values for any given input, because they depend on the full surrounding text and cannot be determined from the link text alone (source: paid brief line 13; no complete input string was supplied).

UNKNOWN: How the function behaves when `text` is not a string, because the source performs no type validation (source: paid brief lines 3 to 16; no input contract is stated).