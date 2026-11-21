# Investigation findings: camelcase v8

## Source material reviewed
- README.md (supplied in the paid brief)
- index.js (supplied in the paid brief)

## Claims
OBSERVATION: The package exports a single function named camelCase (source: index.js, line 1).
OBSERVATION: The function accepts a string argument named input and an optional options object (source: index.js, line 1).
OBSERVATION: The function returns a string (source: index.js, return statement, line 2).
OBSERVATION: camelCase('foo-bar') returns 'fooBar' (source: README.md, example list).
OBSERVATION: camelCase('foo_bar') returns 'fooBar' (source: README.md, example list).
OBSERVATION: camelCase('Foo-Bar') returns 'fooBar' (source: README.md, example list).
OBSERVATION: camelCase('--foo.bar') returns 'fooBar' (source: README.md, example list).
OBSERVATION: camelCase('foo bar') returns 'fooBar' (source: README.md, example list).
OBSERVATION: camelCase(['foo', 'bar']) returns 'fooBar' (source: README.md, example list).
OBSERVATION: camelCase('foo-bar', {pascalCase: true}) returns 'FooBar' (source: README.md, options section).
OBSERVATION: The options object supports pascalCase (source: index.js, destructured default {pascalCase = false}, line 1).
OBSERVATION: The options object supports preserveConsecutiveUppercase (source: index.js, destructured default {preserveConsecutiveUppercase = false}, line 1).
OBSERVATION: The options object supports locale (source: index.js, destructured default {locale = undefined}, line 1).
OBSERVATION: camelCase('') returns '' (source: index.js, early return for empty input, line 2).
OBSERVATION: camelCase('FOO') returns 'foo' (source: README.md, edge case list).
OBSERVATION: camelCase('foo') returns 'foo' (source: README.md, single word example).
OBSERVATION: The implementation lower-cases the entire input before processing (source: index.js, input.toLowerCase(), line 2).
OBSERVATION: The implementation splits on a character class containing space, hyphen, underscore, dot and other separators (source: index.js, split pattern, line 2).
OBSERVATION: The implementation filters out empty segments after splitting (source: index.js, filter(Boolean), line 2).
OBSERVATION: The implementation maps segments so the first segment stays lower-case and subsequent segments are capitalised unless pascalCase is true (source: index.js, map callback, line 2).
OBSERVATION: When pascalCase is true, every segment including the first is capitalised (source: index.js, map callback condition, line 2).
OBSERVATION: The implementation joins the processed segments with no separator (source: index.js, join(''), line 2).
INFERENCE: Array input is joined with a separator before being treated as a single string (source: index.js, typeof input === 'string' ? input : input.join('-'), line 2).
INFERENCE: The default locale is undefined, meaning no locale-specific casing is applied unless the caller supplies one (source: index.js, default {locale = undefined}, line 1).
INFERENCE: preserveConsecutiveUppercase has no visible effect after the input has been lower-cased (source: index.js, option declared but not referenced in the visible body, line 2).
UNKNOWN: The exact behaviour of preserveConsecutiveUppercase cannot be established because its use is not visible in the supplied index.js excerpt (source: index.js, option declared but no downstream usage shown).
UNKNOWN: The exact effect of the locale option cannot be established because its use is not visible in the supplied index.js excerpt (source: index.js, option declared but no downstream usage shown).
UNKNOWN: Whether non-string, non-array input (for example a number) throws or is coerced cannot be established from the supplied material (source: index.js, no type validation visible).
UNKNOWN: Whether the package exports anything besides the default camelCase function cannot be established from the supplied material (source: index.js, only the default export is shown).
UNKNOWN: The exact regular expression used for splitting cannot be fully confirmed because the supplied index.js excerpt is truncated (source: index.js, split pattern line is incomplete).
UNKNOWN: The exact capitalisation logic (slice indices, character codes) cannot be fully confirmed because the supplied index.js excerpt is truncated (source: index.js, map callback body is incomplete).
UNKNOWN: The package version, license, repository URL, and other metadata cannot be established from the supplied material (source: neither README.md nor index.js excerpt contains package.json fields).
UNKNOWN: Whether there are additional README examples beyond those listed in the paid brief cannot be established (source: README.md excerpt may be partial).