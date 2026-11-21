# Slugify behaviour specification

## Interfaces

The package exposes a slugify function that accepts a string input and an optional options object, and returns a string slug.

The package exposes an extend function that accepts a custom charmap object and merges it into the default character map for subsequent slugify calls.

## Data model

Input: a string to be slugified.

Options object fields:
- replacement: a string used as the separator.
- remove: a regular expression describing characters to remove.
- lower: a boolean controlling lowercase conversion.
- strict: a boolean controlling removal of unmapped special characters.
- locale: a string selecting a language-specific character map.
- trim: a boolean controlling removal of leading and trailing separators.

Output: a string slug.

## Requirements

1. The default replacement character shall be a hyphen.
2. Spaces in the input shall be replaced by the replacement character.
3. Consecutive separators in the result shall be collapsed into a single separator.
4. Leading separators in the result shall be removed when trim is enabled.
5. Trailing separators in the result shall be removed when trim is enabled.
6. The replacement option shall override the default separator character.
7. The remove option shall remove all characters matching its regular expression from the input before further processing.
8. The lower option, when true, shall convert the result to lowercase.
9. The strict option, when true, shall remove special characters not present in the character map.
10. The locale option shall select a language-specific character map for transliteration.
11. The trim option, when true, shall remove leading and trailing replacement characters from the result.
12. Characters present in the character map shall be transliterated to their mapped ASCII equivalents.
13. Characters missing from the character map shall be preserved when strict mode is disabled.
14. Characters missing from the character map shall be removed when strict mode is enabled.
15. The extend function shall merge a provided custom character map into the default character map.
16. Custom mappings added through extend shall apply to subsequent slugify calls.

## Formats

Input format: UTF-8 string.

Output format: ASCII slug string using the configured replacement character as word separator.

Character map format: mapping of source characters to replacement strings.

## Errors

No explicit error handling or thrown errors were observed in the source material for invalid option types, missing locales, non-string input, or malformed extend arguments. Behaviour in these cases is unspecified.

## Test cases

1. Input "Hello World" with default options shall produce "hello-world". Source: slugify.js default replacement, lower and space handling.
2. Input "Hello   World" with default options shall produce "hello-world". Source: slugify.js consecutive separator collapsing.
3. Input "  Hello World  " with default options shall produce "hello-world". Source: slugify.js trim of leading and trailing separators.
4. Input "Hello World" with replacement set to "_" shall produce "hello_world". Source: slugify.js replacement option.
5. Input "a*b" with default options shall produce "ab". Source: slugify.js default remove regular expression.
6. Input "Hello World" with lower set to false shall produce "Hello-World". Source: slugify.js lower option.
7. Input "Hello @ World" with strict set to true shall produce "hello-world". Source: slugify.js strict mode removing unmapped special characters.
8. Input "Hello @ World" with strict set to false shall produce "hello-@-world". Source: slugify.js non-strict preservation of unmapped characters.
9. Input "ü" with default options shall produce "u". Source: config/charmap.json mapping.
10. Input "ß" with default options shall produce "ss". Source: config/charmap.json mapping.
11. Input "ç" with default options shall produce "c". Source: config/charmap.json mapping.
12. Input "ş" with default options shall produce "s". Source: config/charmap.json mapping.
13. Input "ğ" with default options shall produce "g". Source: config/charmap.json mapping.
14. Input "😀" with default options shall produce "😀". Source: config/charmap.json absence of emoji and slugify.js non-strict preservation.
15. Input "😀" with strict set to true shall produce "". Source: config/charmap.json absence of emoji and slugify.js strict mode removal.
16. After extend with custom mapping "@" to "at", input "a@b" with default options shall produce "a-at-b". Source: slugify.js extend function and charmap merging.