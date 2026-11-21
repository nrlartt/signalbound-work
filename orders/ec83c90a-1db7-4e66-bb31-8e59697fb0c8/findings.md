# Slugify behaviour findings

## Source material examined

OBSERVATION: The package README describes slugify as a slug generator that converts strings into URL-friendly slugs, with options replacement, remove, lower, strict, locale and trim, and an extend() API for custom charmaps (source: README.md).

OBSERVATION: The main source file is slugify.js and the character map file is config/charmap.json (source: README.md).

## Default replacement character

OBSERVATION: The default replacement character is a hyphen "-" (source: slugify.js, default options object).

OBSERVATION: The default value of the replacement option is "-" (source: slugify.js, default options object).

## Spaces, consecutive separators and leading/trailing separators

OBSERVATION: Spaces are replaced by the replacement character, defaulting to "-" (source: slugify.js, separator replacement logic).

OBSERVATION: Consecutive separators are collapsed into a single separator (source: slugify.js, separator collapsing logic).

OBSERVATION: Leading separators are removed from the result (source: slugify.js, trim logic).

OBSERVATION: Trailing separators are removed from the result (source: slugify.js, trim logic).

## Options and defaults

OBSERVATION: The replacement option sets the character used to replace spaces and separators; default is "-" (source: slugify.js, default options object).

OBSERVATION: The remove option is a regular expression whose matched characters are removed; default is /[\*+~.()"\"!:@]/g (source: slugify.js, default options object).

OBSERVATION: The lower option lowercases the result; default is true (source: slugify.js, default options object).

OBSERVATION: The strict option removes all special characters; default is false (source: slugify.js, default options object).

OBSERVATION: The locale option selects a language-specific charmap; default is undefined (source: slugify.js, default options object).

OBSERVATION: The trim option removes leading and trailing replacement characters; default is true (source: slugify.js, default options object).

## Non-Latin transliteration examples from charmap.json

OBSERVATION: "ü" maps to "u" (source: config/charmap.json).

OBSERVATION: "ß" maps to "ss" (source: config/charmap.json).

OBSERVATION: "ç" maps to "c" (source: config/charmap.json).

OBSERVATION: "ş" maps to "s" (source: config/charmap.json).

OBSERVATION: "ğ" maps to "g" (source: config/charmap.json).

## Emoji and missing characters

OBSERVATION: Emoji are not present in config/charmap.json (source: config/charmap.json).

OBSERVATION: Characters missing from the charmap are removed when strict mode is enabled (source: slugify.js, strict mode logic).

OBSERVATION: Characters missing from the charmap are preserved when strict mode is disabled (source: slugify.js, default processing logic).

INFERENCE: Emoji are preserved in non-strict mode because they are absent from the charmap and non-strict mode preserves unmapped characters (source: config/charmap.json and slugify.js default processing logic).

INFERENCE: Emoji are removed in strict mode because strict mode strips characters not found in the charmap (source: config/charmap.json and slugify.js strict mode logic).

## extend() API

OBSERVATION: The extend() API merges a provided custom charmap into the default charmap (source: slugify.js, extend function).

OBSERVATION: extend() accepts an object whose keys are characters and values are their replacements (source: slugify.js, extend function).

INFERENCE: Custom mappings added through extend() take effect for subsequent slugify() calls because the charmap is merged into the module-level map (source: slugify.js, extend function and slugify processing logic).

## Unknowns

UNKNOWN: The exact behaviour when the remove option is set to an empty regular expression or null was not established from the source examined (source: slugify.js default options and remove option handling; no explicit handling of null/empty remove was found).

UNKNOWN: The exact behaviour when locale is set to a value with no corresponding charmap file was not established from the source examined (source: slugify.js locale handling; no fallback or error behaviour for missing locales was found).

UNKNOWN: The exact behaviour when replacement is set to an empty string was not established from the source examined (source: slugify.js replacement option handling; no explicit empty-string handling was found).

UNKNOWN: The exact behaviour when input is not a string (for example a number or undefined) was not established from the source examined (source: slugify.js entry point; no input type validation was found).

UNKNOWN: The exact behaviour of extend() when called with a malformed or non-object argument was not established from the source examined (source: slugify.js extend function; no argument validation was found).