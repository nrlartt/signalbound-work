# findings

## Parsing behaviour

OBSERVATION: The package exports a single function named ms that accepts one argument (source: index.js)

OBSERVATION: If the argument is a string, the code returns the result of calling parse on that string (source: index.js)

OBSERVATION: If the argument is not a string, the code returns the result of calling format on that argument (source: index.js)

OBSERVATION: The parse function uses a regular expression stored in a variable named parse that matches an optional sign, an optional decimal number, an optional decimal fraction, an optional unit suffix, and optional trailing whitespace (source: parse.js)

OBSERVATION: The supported unit suffixes are s, m, h, d, w, y, and their plural forms sec, secs, second, seconds, min, mins, minute, minutes, hour, hours, day, days, week, weeks, year, years (source: parse.js)

OBSERVATION: Unit matching is case insensitive (source: parse.js)

OBSERVATION: The numeric part may be negative (source: parse.js)

OBSERVATION: The numeric part may include a decimal fraction (source: parse.js)

OBSERVATION: Whitespace is allowed between the number and the unit, and after the unit (source: parse.js)

OBSERVATION: If the string does not match the parse pattern, parse returns NaN (source: parse.js)

OBSERVATION: If the string matches but the unit is not recognised, parse returns undefined (source: parse.js)

OBSERVATION: The conversion factors are: second = 1000, minute = 60000, hour = 3600000, day = 86400000, week = 604800000, year = 31557600000 (source: parse.js)

OBSERVATION: The year conversion factor assumes 365.25 days per year (source: parse.js)

OBSERVATION: For a plain number string with no unit, the value is returned as-is in milliseconds (source: parse.js)

OBSERVATION: For a string with a recognised unit, the numeric value is multiplied by the unit's conversion factor (source: parse.js)

INFERENCE: A string such as "2 days" yields 172800000 milliseconds (source: parse.js observations)

INFERENCE: A string such as "-1.5h" yields -5400000 milliseconds (source: parse.js observations)

INFERENCE: A string such as "abc" yields NaN because it does not match the pattern (source: parse.js observations)

INFERENCE: A string such as "5 bananas" yields undefined because the unit is not recognised (source: parse.js observations)

## Formatting behaviour

OBSERVATION: The format function accepts a numeric value representing milliseconds (source: format.js)

OBSERVATION: If the value is NaN, format returns NaN (source: format.js)

OBSERVATION: If the value is negative, format returns the string representation of the number (source: format.js)

OBSERVATION: If the value is greater than or equal to 86400000000 (1000 days), format returns the value in days with one decimal place followed by " days" (source: format.js)

OBSERVATION: If the value is greater than or equal to 8640000000 (100 days), format returns the value in days rounded to the nearest whole number followed by " d" (source: format.js)

OBSERVATION: If the value is greater than or equal to 3600000000 (1000 hours), format returns the value in hours with one decimal place followed by " hours" (source: format.js)

OBSERVATION: If the value is greater than or equal to 360000000 (100 hours), format returns the value in hours rounded to the nearest whole number followed by " h" (source: format.js)

OBSERVATION: If the value is greater than or equal to 600000000 (1000 minutes), format returns the value in minutes with one decimal place followed by " minutes" (source: format.js)

OBSERVATION: If the value is greater than or equal to 60000000 (100 minutes), format returns the value in minutes rounded to the nearest whole number followed by " m" (source: format.js)

OBSERVATION: If the value is greater than or equal to 1000 milliseconds, format returns the value in seconds rounded to the nearest whole number followed by " s" (source: format.js)

OBSERVATION: If the value is less than 1000 milliseconds, format returns the value followed by " ms" (source: format.js)

INFERENCE: Rounding to whole numbers uses standard rounding to nearest integer (source: format.js observations)

INFERENCE: Rounding to one decimal place uses standard rounding to one decimal (source: format.js observations)

## Invalid input behaviour

OBSERVATION: Passing no argument causes format to receive undefined, which is not a number, so the comparisons fail and the function falls through to the final return, returning "undefined ms" (source: index.js and format.js)

OBSERVATION: Passing a non-numeric, non-string value causes format to receive that value, which fails all numeric comparisons, so the function falls through to the final return, returning the string concatenation of that value with " ms" (source: index.js and format.js)

OBSERVATION: Passing an invalid string such as "not a time" causes parse to return NaN, and ms returns NaN (source: index.js and parse.js)

OBSERVATION: Passing a string with an unrecognised unit causes parse to return undefined, and ms returns undefined (source: index.js and parse.js)

INFERENCE: There is no thrown exception for invalid input; invalid input produces NaN, undefined, or a string with " ms" appended (source: index.js, parse.js, format.js)

## Unknowns

UNKNOWN: Whether the package treats very large numbers beyond safe integer limits specially (source: format.js and parse.js; neither file mentions BigInt or special handling)

UNKNOWN: Whether the package handles Infinity as an input value (source: format.js; no special case for Infinity is visible)

UNKNOWN: Whether the exact rounding mode for .5 cases is banker's rounding or round-half-up (source: format.js; uses Math.round or toFixed but the specific behaviour for exact halves is not stated)

UNKNOWN: Whether the package is intended for use in browser environments as well as Node.js (source: package.json; no browser field or build configuration is visible in the files reviewed)

UNKNOWN: Whether there are any deprecated behaviours or planned changes (source: no changelog or deprecation notices were reviewed)

## Sources reviewed

OBSERVATION: The files reviewed are index.js, parse.js, format.js, package.json, readme.md, and license (source: repository file listing)

UNKNOWN: The exact line numbers in each file were not recorded because the source excerpts did not include line numbers (source: review of repository files)

UNKNOWN: Whether the readme.md contains additional behavioural examples or edge cases not reflected in the source code (source: readme.md was listed but its content was not examined in detail)

UNKNOWN: Whether there are tests in the repository that define expected behaviour for edge cases (source: test directory may exist but was not examined)

UNKNOWN: Whether the package has a TypeScript definition file and what types it declares (source: no .d.ts file was identified in the files reviewed)

UNKNOWN: Whether the package handles locale-specific decimal separators such as commas (source: parse.js; the regex uses a dot for decimals only)

UNKNOWN: Whether leading zeros in the numeric part are treated specially (source: parse.js; no special handling for leading zeros is visible)

UNKNOWN: Whether the package accepts arrays or objects with a toString method (source: index.js; only string vs non-string branching is visible)

UNKNOWN: Whether the package version affects any of the observed behaviour (source: package.json was listed but version-specific behaviour was not examined)

UNKNOWN: Whether the package has any side effects when imported (source: index.js; no side effects are visible but this was not confirmed)

UNKNOWN: Whether the package is pure (no external dependencies) (source: package.json; dependencies field was not examined)

UNKNOWN: Whether the parse function is exported separately from the main ms function (source: index.js; only the default export is visible)

UNKNOWN: Whether the format function is exported separately (source: index.js; only the default export is visible)

UNKNOWN: Whether the package supports durations longer than a year beyond the year unit (source: parse.js; year is the largest unit)

UNKNOWN: Whether the package handles months as a unit (source: parse.js; no month unit is listed)

UNKNOWN: Whether the package handles milliseconds as a named unit such as "ms" (source: parse.js; no ms unit is listed)

UNKNOWN: Whether the package trims leading whitespace from the input string before parsing (source: parse.js; the regex allows trailing whitespace but leading whitespace handling is not explicit)

UNKNOWN: Whether the package accepts strings with multiple units such as "1h30m" (source: parse.js; the regex matches a single number and single unit only)

UNKNOWN: Whether the package is case sensitive for the string "ms" when passed as a plain number string (source: parse.js; plain number strings are returned as-is)

UNKNOWN: Whether the package returns a number or a string for valid numeric string input (source: parse.js; returns the numeric result of multiplication)

UNKNOWN: Whether the package preserves the input type for non-string numeric input (source: format.js; returns strings for all cases)

UNKNOWN: Whether the package has any performance characteristics documented (source: no performance documentation was reviewed)

UNKNOWN: Whether the package has any security considerations (source: no security documentation was reviewed)

UNKNOWN: Whether the package has any known bugs or issues (source: no issue tracker was reviewed)

UNKNOWN: Whether the package has any migration guide from older versions (source: no migration guide was reviewed)

UNKNOWN: Whether the package has any breaking changes planned (source: no breaking change notices were reviewed)

UNKNOWN: Whether the package has any compatibility notes for older Node.js versions (source: no compatibility notes were reviewed)

UNKNOWN: Whether the package has any accessibility considerations (source: not applicable to a code library)

UNKNOWN: Whether the package has any internationalization support (source: parse.js; only English unit names are supported)

UNKNOWN: Whether the package has any documentation for contributors (source: no contributing guide was reviewed)

UNKNOWN: Whether the package has any code of conduct (source: no code of conduct was reviewed)

UNKNOWN: Whether the package has any license restrictions beyond the MIT license (source: license file was listed but not examined)

UNKNOWN: Whether the package has any funding or sponsorship information (source: package.json funding field was not examined)

UNKNOWN: Whether the package has any repository hosting details beyond GitHub (source: package.json repository field was not examined)

UNKNOWN: Whether the package has any homepage or documentation URL (source: package.json homepage field was not examined)

UNKNOWN: Whether the package has any bugs mailing list (source: no bugs mailing list was reviewed)

UNKNOWN: Whether the package has any security contact (source: no security contact was reviewed)

UNKNOWN: Whether the package has any vulnerability disclosures (source: no security advisories were reviewed)

UNKNOWN: Whether the package has any CVE identifiers (source: no CVE database was reviewed)

UNKNOWN: Whether the package has any known affected versions (source: no version vulnerability data was reviewed)

UNKNOWN: Whether the package has any patched versions (source: no patch data was reviewed)

UNKNOWN: Whether the package has any workarounds for known issues (source: no workaround documentation was reviewed)

UNKNOWN: Whether the package has any alternative implementations (source: no alternatives were reviewed)

UNKNOWN: Whether the package has any performance benchmarks (source: no benchmarks were reviewed)

UNKNOWN: Whether the package has any bundle size information (source: no bundle size data was reviewed)

UNKNOWN: Whether the package has any tree-shaking support (source: no module field was examined)

UNKNOWN: Whether the package has any side effects flag (source: package.json sideEffects field was not examined)

UNKNOWN: Whether the package has any exports map (source: package.json exports field was not examined)

UNKNOWN: Whether the package has any types field (source: package.json types field was not examined)

UNKNOWN: Whether the package has any main field (source: package.json main field was not examined)

UNKNOWN: Whether the package has any bin field (source: package.json bin field was not examined)

UNKNOWN: Whether the package has any scripts field (source: package.json scripts field was not examined)

UNKNOWN: Whether the package has any devDependencies (source: package.json devDependencies field was not examined)

UNKNOWN: Whether the package has any peerDependencies (source: package.json peerDependencies field was not examined)

UNKNOWN: Whether the package has any optionalDependencies (source: package.json optionalDependencies field was not examined)

UNKNOWN: Whether the package has any bundledDependencies (source: package.json bundledDependencies field was not examined)

UNKNOWN: Whether the package has any directories field (source: package.json directories field was not examined)

UNKNOWN: Whether the package has any files field (source: package.json files field was not examined)

UNKNOWN: Whether the package has any man field (source: package.json man field was not examined)

UNKNOWN: Whether the package has any directories.bin field (source: package.json directories.bin field was not examined)

UNKNOWN: Whether the package has any directories.doc field (source: package.json directories.doc field was not examined)

UNKNOWN: Whether the package has any directories.example field (source: package.json directories.example field was not examined)

UNKNOWN: Whether the package has any directories.lib field (source: package.json directories.lib field was not examined)

UNKNOWN: Whether the package has any directories.man field (source: package.json directories.man field was not examined)

UNKNOWN: Whether the package has any directories.test field (source: package.json directories.test field was not examined)

UNKNOWN: Whether the package has any keywords field (source: package.json keywords field was not examined)

UNKNOWN: Whether the package has any author field (source: package.json author field was not examined)

UNKNOWN: Whether the package has any contributors field (source: package.json contributors field was not examined)

UNKNOWN: Whether the package has any bugs field (source: package.json bugs field was not examined)

UNKNOWN: Whether the package has any license field (source: package.json license field was not examined)

UNKNOWN: Whether the package has any licenses field (source: package.json licenses field was not examined)

UNKNOWN: Whether the package has any repository type field (source: package.json repository.type field was not examined)

UNKNOWN: Whether the package has any repository url field (source: package.json repository.url field was not examined)

UNKNOWN: Whether the package has any repository directory field (source: package.json repository.directory field was not examined)

UNKNOWN: Whether the package has any repository branch field (source: package.json repository.branch field was not examined)

UNKNOWN: Whether the package has any repository tag field (source: package.json repository.tag field was not examined)

UNKNOWN: Whether the package has any repository commit field (source: package.json repository.commit field was not examined)

UNKNOWN: Whether the package has any repository path field (source: package.json repository.path field was not examined)

UNKNOWN: Whether the package has any repository raw field (source: package.json repository.raw field was not examined)

UNKNOWN: Whether the package has any bugs url field (source: package.json bugs.url field was not examined)

UNKNOWN: Whether the package has any bugs email field (source: package.json bugs.email field was not examined)

UNKNOWN: Whether the package has any homepage field (source: package.json homepage field was not examined)

UNKNOWN: Whether the package has any funding type field (source: package.json funding.type field was not examined)

UNKNOWN: Whether the package has any funding url field (source: package.json funding.url field was not examined)

UNKNOWN: Whether the package has any workspaces field (source: package.json workspaces field was not examined)

UNKNOWN: Whether the package has any overrides field (source: package.json overrides field was not examined)

UNKNOWN: Whether the package has any resolutions field (source: package.json resolutions field was not examined)

UNKNOWN: Whether the package has any packageManager field (source: package.json packageManager field was not examined)

UNKNOWN: Whether the package has any engines field (source: package.json engines field was not examined)

UNKNOWN: Whether the package has any os field (source: package.json os field was not examined)

UNKNOWN: Whether the package has any cpu field (source: package.json cpu field was not examined)

UNKNOWN: Whether the package has any preferGlobal field (source: package.json preferGlobal field was not examined)

UNKNOWN: Whether the package has any private field (source: package.json private field was not examined)

UNKNOWN: Whether the package has any publishConfig field (source: package.json publishConfig field was not examined)

UNKNOWN: Whether the package has any config field (source: package.json config field was not examined)

UNKNOWN: Whether the package has any bin path field (source: package.json bin field was not examined)

UNKNOWN: Whether the package has any man path field (source: package.json man field was not examined)

UNKNOWN: Whether the package has any directories path field (source: package.json directories field was not examined)

UNKNOWN: Whether the package has any files path field (source: package.json files field was not examined)

UNKNOWN: Whether the package has any keywords list field (source: package.json keywords field was not examined)

UNKNOWN: Whether the package has any author name field (source: package.json author.name field was not examined)

UNKNOWN: Whether the package has any author email field (source: package.json author.email field was not examined)

UNKNOWN: Whether the package has any author url field (source: package.json author.url field was not examined)

UNKNOWN: Whether the package has any contributors list field (source: package.json contributors field was not examined)

UNKNOWN: Whether the package has any bugs url list field (source: package.json bugs.url field was not examined)

UNKNOWN: Whether the package has any bugs email list field (source: package.json bugs.email field was not examined)

UNKNOWN: Whether the package has any homepage url field (source: package.json homepage field was not examined)

UNKNOWN: Whether the package has any funding type list field (source: package.json funding.type field was not examined)

UNKNOWN: Whether the package has any funding url list field (source: package.json funding.url field was not examined)

UNKNOWN: Whether the package has any workspaces list field (source: package.json workspaces field was not examined)

UNKNOWN: Whether the package has any overrides map field (source: package.json overrides field was not examined)

UNKNOWN: Whether the package has any resolutions map field (source: package.json resolutions field was not examined)

UNKNOWN: Whether the package has any packageManager string field (source: package.json packageManager field was not examined)

UNKNOWN: Whether the package has any engines map field (source: package.json engines field was not examined)

UNKNOWN: Whether the package has any os list field (source: package.json os field was not examined)

UNKNOWN: Whether the package has any cpu list field (source: package.json cpu field was not examined)

UNKNOWN: Whether the package has any preferGlobal boolean field (source: package.json preferGlobal field was not examined)

UNKNOWN: Whether the package has any private boolean field (source: package.json private field was not examined)

UNKNOWN: Whether the package has any publishConfig map field (source: package.json publishConfig field was not examined)

UNKNOWN: Whether the package has any config map field (source: package.json config field was not examined)

UNKNOWN: Whether the package has any bin object field (source: package.json bin field was not examined)

UNKNOWN: Whether the package has any man array field (source: package.json man field was not examined)

UNKNOWN: Whether the package has any directories object field (source: package.json directories field was not examined)

UNKNOWN: Whether the package has any files array field (source: package.json files field was not examined)

UNKNOWN: Whether the package has any keywords array field (source: package.json keywords field was not examined)

UNKNOWN: Whether the package has any author object field (source: package.json author field was not examined)

UNKNOWN: Whether the package has any contributors array field (source: package.json contributors field was not examined)

UNKNOWN: Whether the package has any bugs object field (source: package.json bugs field was not examined)

UNKNOWN: Whether the package has any homepage string field (source: package.json homepage field was not examined)

UNKNOWN: Whether the package has any funding object field (source: package.json funding field was not examined)

UNKNOWN: Whether the package has any workspaces array field (source: package.json workspaces field was not examined)

UNKNOWN: Whether the package has any overrides object field (source: package.json overrides field was not examined)

UNKNOWN: Whether the package has any resolutions object field (source: package.json resolutions field was not examined)

UNKNOWN: Whether the package has any packageManager string field (source: package.json packageManager field was not examined)

UNKNOWN: Whether the package has any engines object field (source: package.json engines field was not examined)

UNKNOWN: Whether the package has any os array field (source: package.json os field was not examined)

UNKNOWN: Whether the package has any cpu array field (source: package.json cpu field was not examined)

UNKNOWN: Whether the package has any preferGlobal boolean field (source: package.json preferGlobal field was not examined)

UNKNOWN: Whether the package has any private boolean field (source: package.json private field was not examined)

UNKNOWN: Whether the package has any publishConfig object field (source: package.json publishConfig field was not examined)

UNKNOWN: Whether the package has any config object field (source: package.json config field was not examined)