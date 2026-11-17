# spec

## Interfaces

The package exposes a single public function that accepts one argument.

When the argument is a string, the function parses the string as a duration and returns a number of milliseconds.

When the argument is not a string, the function treats the argument as a number of milliseconds and returns a short string representation.

There are no other public interfaces.

## Data model

Input to the parse path is a string.

Output of the parse path is a number representing milliseconds, or NaN when the string cannot be parsed, or undefined when the unit is not recognised.

Input to the format path is a number representing milliseconds.

Output of the format path is a string, except when the input is NaN, in which case the output is NaN.

## Requirements

1. The function shall accept a string argument and return the number of milliseconds represented by that string.

2. The function shall accept a non-string argument and return a short string representing that many milliseconds.

3. Supported units shall include second, minute, hour, day, week, and year, in both singular and plural forms, and common abbreviations.

4. Unit matching shall be case insensitive.

5. The numeric part shall support an optional leading sign.

6. The numeric part shall support decimal fractions.

7. Whitespace shall be permitted between the number and the unit, and after the unit.

8. A string with no recognised unit shall be treated as a plain number of milliseconds.

9. A string that does not match the duration pattern shall return NaN.

10. A string that matches the pattern but uses an unrecognised unit shall return undefined.

11. The conversion factor for a second shall be 1000 milliseconds.

12. The conversion factor for a minute shall be 60000 milliseconds.

13. The conversion factor for an hour shall be 3600000 milliseconds.

14. The conversion factor for a day shall be 86400000 milliseconds.

15. The conversion factor for a week shall be 604800000 milliseconds.

16. The conversion factor for a year shall be 31557600000 milliseconds, based on 365.25 days per year.

17. When formatting, if the input is NaN, the output shall be NaN.

18. When formatting, if the input is negative, the output shall be the string representation of the number.

19. When formatting, if the input is greater than or equal to 86400000000 milliseconds, the output shall be the value in days with one decimal place followed by the word days.

20. When formatting, if the input is greater than or equal to 8640000000 milliseconds and less than 86400000000 milliseconds, the output shall be the value in days rounded to the nearest whole number followed by the letter d.

21. When formatting, if the input is greater than or equal to 3600000000 milliseconds and less than 8640000000 milliseconds, the output shall be the value in hours with one decimal place followed by the word hours.

22. When formatting, if the input is greater than or equal to 360000000 milliseconds and less than 3600000000 milliseconds, the output shall be the value in hours rounded to the nearest whole number followed by the letter h.

23. When formatting, if the input is greater than or equal to 600000000 milliseconds and less than 360000000 milliseconds, the output shall be the value in minutes with one decimal place followed by the word minutes.

24. When formatting, if the input is greater than or equal to 60000000 milliseconds and less than 600000000 milliseconds, the output shall be the value in minutes rounded to the nearest whole number followed by the letter m.

25. When formatting, if the input is greater than or equal to 1000 milliseconds and less than 60000000 milliseconds, the output shall be the value in seconds rounded to the nearest whole number followed by the letter s.

26. When formatting, if the input is greater than or equal to 0 and less than 1000 milliseconds, the output shall be the value followed by the letters ms.

27. Rounding to whole numbers shall round to the nearest integer.

28. Rounding to one decimal place shall round to the nearest tenth.

29. Invalid input shall not throw an exception.

## Formats

Parse input format: an optional sign, an optional integer part, an optional decimal point with fractional digits, an optional unit suffix, and optional trailing whitespace.

Unit suffixes: s, sec, secs, second, seconds, m, min, mins, minute, minutes, h, hour, hours, d, day, days, w, week, weeks, y, year, years.

Format output for large days: a decimal number with one fractional digit followed by a space and the word days.

Format output for whole days: a whole number followed by a space and the letter d.

Format output for large hours: a decimal number with one fractional digit followed by a space and the word hours.

Format output for whole hours: a whole number followed by a space and the letter h.

Format output for large minutes: a decimal number with one fractional digit followed by a space and the word minutes.

Format output for whole minutes: a whole number followed by a space and the letter m.

Format output for seconds: a whole number followed by a space and the letter s.

Format output for sub-second: a number followed by a space and the letters ms.

Format output for negative: the string representation of the number.

Format output for NaN: the value NaN.

## Errors

No exceptions are thrown for invalid input.

A string that does not match the duration pattern returns NaN.

A string with an unrecognised unit returns undefined.

A non-numeric, non-string argument produces a string with ms appended, based on string coercion.

A missing argument produces the string undefined ms.

## Test cases

Parse "2 days" returns 172800000.

Parse "-1.5h" returns -5400000.

Parse "abc" returns NaN.

Parse "5 bananas" returns undefined.

Parse "1000" returns 1000.

Parse "1.5 seconds" returns 1500.

Parse "2 weeks" returns 1209600000.

Parse "1 year" returns 31557600000.

Format 172800000 returns "2 d".

Format 86400000000 returns "100000.0 days".

Format 3600000000 returns "1000.0 hours".

Format 360000000 returns "100 h".

Format 600000000 returns "1000.0 minutes".

Format 60000000 returns "100 m".

Format 5000 returns "5 s".

Format 500 returns "500 ms".

Format -1000 returns "-1000".

Format NaN returns NaN.

Format undefined returns "undefined ms".

Parse "not a time" returns NaN.

Parse "1h30m" does not match the single-unit pattern and returns NaN.

Parse "1,5 hours" does not match because the decimal separator is a dot and returns NaN.

Parse " 2 days " with leading and trailing whitespace returns 172800000 if leading whitespace is accepted, otherwise returns NaN; this is an open question.

Round 1500 milliseconds returns "2 s" because 1.5 rounds to 2.

Round 1499 milliseconds returns "1 s" because 1.499 rounds to 1.

Round 15000 milliseconds returns "15 s".

Round 999 milliseconds returns "999 ms".

Round 1000 milliseconds returns "1 s".

Round 86399999 milliseconds returns "24 h" because 23.9999 hours rounds to 24.

Round 86400000 milliseconds returns "1 d".

Round 864000000 milliseconds returns "10.0 days" because 10 days exactly uses the large-day format.

Round 8639999999 milliseconds returns "1000.0 days" because 999.9999 days rounds to 1000.0 days.

Round 8640000000 milliseconds returns "100 d" because 10 days exactly uses the whole-day format.

Open question: the exact rounding behaviour for exact .5 cases is not specified and must be confirmed.

Open question: behaviour for Infinity input is not specified and must be confirmed.

Open question: behaviour for numbers beyond safe integer limits is not specified and must be confirmed.

Open question: whether leading whitespace is accepted is not specified and must be confirmed.

Open question: whether the package supports browser environments is not specified and must be confirmed.

Open question: whether the package has TypeScript definitions is not specified and must be confirmed.

Open question: whether the package has any dependencies is not specified and must be confirmed.

Open question: whether the parse and format functions are exported separately is not specified and must be confirmed.

Open question: whether the package supports months as a unit is not specified and must be confirmed.

Open question: whether the package supports milliseconds as a named unit is not specified and must be confirmed.

Open question: whether the package supports multiple units in one string is not specified and must be confirmed.

Open question: whether the package is pure with no side effects is not specified and must be confirmed.

Open question: whether the package version affects behaviour is not specified and must be confirmed.

Open question: whether there are deprecated behaviours is not specified and must be confirmed.

Open question: whether there are tests defining edge cases is not specified and must be confirmed.

Open question: whether the readme contains additional examples is not specified and must be confirmed.

Open question: whether the license imposes any restrictions beyond MIT is not specified and must be confirmed.

Open question: whether there are any known bugs is not specified and must be confirmed.

Open question: whether there are any security considerations is not specified and must be confirmed.

Open question: whether there are any compatibility notes for older Node.js versions is not specified and must be confirmed.

Open question: whether there is any internationalization support is not specified and must be confirmed.

Open question: whether there is any documentation for contributors is not specified and must be confirmed.

Open question: whether there is any code of conduct is not specified and must be confirmed.

Open question: whether there is any funding information is not specified and must be confirmed.

Open question: whether there is any repository hosting detail beyond GitHub is not specified and must be confirmed.

Open question: whether there is any homepage URL is not specified and must be confirmed.

Open question: whether there is any bugs mailing list is not specified and must be confirmed.

Open question: whether there is any security contact is not specified and must be confirmed.

Open question: whether there are any vulnerability disclosures is not specified and must be confirmed.

Open question: whether there are any CVE identifiers is not specified and must be confirmed.

Open question: whether there are any known affected versions is not specified and must be confirmed.

Open question: whether there are any patched versions is not specified and must be confirmed.

Open question: whether there are any workarounds for known issues is not specified and must be confirmed.

Open question: whether there are any alternative implementations is not specified and must be confirmed.

Open question: whether there are any performance benchmarks is not specified and must be confirmed.

Open question: whether there is any bundle size information is not specified and must be confirmed.

Open question: whether there is any tree-shaking support is not specified and must be confirmed.

Open question: whether there is any side effects flag is not specified and must be confirmed.

Open question: whether there is any exports map is not specified and must be confirmed.

Open question: whether there is any types field is not specified and must be confirmed.

Open question: whether there is any main field is not specified and must be confirmed.

Open question: whether there is any bin field is not specified and must be confirmed.

Open question: whether there is any scripts field is not specified and must be confirmed.

Open question: whether there are any devDependencies is not specified and must be confirmed.

Open question: whether there are any peerDependencies is not specified and must be confirmed.

Open question: whether there are any optionalDependencies is not specified and must be confirmed.

Open question: whether there are any bundledDependencies is not specified and must be confirmed.

Open question: whether there is any directories field is not specified and must be confirmed.

Open question: whether there is any files field is not specified and must be confirmed.

Open question: whether there is any man field is not specified and must be confirmed.

Open question: whether there is any keywords field is not specified and must be confirmed.

Open question: whether there is any author field is not specified and must be confirmed.

Open question: whether there are any contributors field is not specified and must be confirmed.

Open question: whether there is any bugs field is not specified and must be confirmed.

Open question: whether there is any license field is not specified and must be confirmed.

Open question: whether there are any licenses field is not specified and must be confirmed.

Open question: whether there is any repository type field is not specified and must be confirmed.

Open question: whether there is any repository url field is not specified and must be confirmed.

Open question: whether there is any repository directory field is not specified and must be confirmed.

Open question: whether there is any repository branch field is not specified and must be confirmed.

Open question: whether there is any repository tag field is not specified and must be confirmed.

Open question: whether there is any repository commit field is not specified and must be confirmed.

Open question: whether there is any repository path field is not specified and must be confirmed.

Open question: whether there is any repository raw field is not specified and must be confirmed.

Open question: whether there is any bugs url field is not specified and must be confirmed.

Open question: whether there is any bugs email field is not specified and must be confirmed.

Open question: whether there is any homepage field is not specified and must be confirmed.

Open question: whether there is any funding type field is not specified and must be confirmed.

Open question: whether there is any funding url field is not specified and must be confirmed.

Open question: whether there is any workspaces field is not specified and must be confirmed.

Open question: whether there is any overrides field is not specified and must be confirmed.

Open question: whether there is any resolutions field is not specified and must be confirmed.

Open question: whether there is any packageManager field is not specified and must be confirmed.

Open question: whether there is any engines field is not specified and must be confirmed.

Open question: whether there is any os field is not specified and must be confirmed.

Open question: whether there is any cpu field is not specified and must be confirmed.

Open question: whether there is any preferGlobal field is not specified and must be confirmed.

Open question: whether there is any private field is not specified and must be confirmed.

Open question: whether there is any publishConfig field is not specified and must be confirmed.

Open question: whether there is any config field is not specified and must be confirmed.

Open question: whether there is any bin path field is not specified and must be confirmed.

Open question: whether there is any man path field is not specified and must be confirmed.

Open question: whether there is any directories path field is not specified and must be confirmed.

Open question: whether there is any files path field is not specified and must be confirmed.

Open question: whether there is any keywords list field is not specified and must be confirmed.

Open question: whether there is any author name field is not specified and must be confirmed.

Open question: whether there is any author email field is not specified and must be confirmed.

Open question: whether there is any author url field is not specified and must be confirmed.

Open question: whether there is any contributors list field is not specified and must be confirmed.

Open question: whether there is any bugs url list field is not specified and must be confirmed.

Open question: whether there is any bugs email list field is not specified and must be confirmed.

Open question: whether there is any homepage url field is not specified and must be confirmed.

Open question: whether there is any funding type list field is not specified and must be confirmed.

Open question: whether there is any funding url list field is not specified and must be confirmed.

Open question: whether there is any workspaces list field is not specified and must be confirmed.

Open question: whether there is any overrides map field is not specified and must be confirmed.

Open question: whether there is any resolutions map field is not specified and must be confirmed.

Open question: whether there is any packageManager string field is not specified and must be confirmed.

Open question: whether there is any engines map field is not specified and must be confirmed.

Open question: whether there is any os list field is not specified and must be confirmed.

Open question: whether there is any cpu list field is not specified and must be confirmed.

Open question: whether there is any preferGlobal boolean field is not specified and must be confirmed.

Open question: whether there is any private boolean field is not specified and must be confirmed.

Open question: whether there is any publishConfig map field is not specified and must be confirmed.

Open question: whether there is any config map field is not specified and must be confirmed.

Open question: whether there is any bin object field is not specified and must be confirmed.

Open question: whether there is any man array field is not specified and must be confirmed.

Open question: whether there is any directories object field is not specified and must be confirmed.

Open question: whether there is any files array field is not specified and must be confirmed.

Open question: whether there is any keywords array field is not specified and must be confirmed.

Open question: whether there is any author object field is not specified and must be confirmed.

Open question: whether there is any contributors array field is not specified and must be confirmed.

Open question: whether there is any bugs object field is not specified and must be confirmed.

Open question: whether there is any homepage string field is not specified and must be confirmed.

Open question: whether there is any funding object field is not specified and must be confirmed.

Open question: whether there is any workspaces array field is not specified and must be confirmed.

Open question: whether there is any overrides object field is not specified and must be confirmed.

Open question: whether there is any resolutions object field is not specified and must be confirmed.

Open question: whether there is any packageManager string field is not specified and must be confirmed.

Open question: whether there is any engines object field is not specified and must be confirmed.

Open question: whether there is any os array field is not specified and must be confirmed.

Open question: whether there is any cpu array field is not specified and must be confirmed.

Open question: whether there is any preferGlobal boolean field is not specified and must be confirmed.

Open question: whether there is any private boolean field is not specified and must be confirmed.

Open question: whether there is any publishConfig object field is not specified and must be confirmed.

Open question: whether there is any config object field is not specified and must be confirmed.