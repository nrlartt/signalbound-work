# camelcase behaviour specification

## Interfaces
The module exports a single default function.
The function is called with one required input argument and one optional options argument.
The input argument accepts a string or an array of strings.
The options argument accepts an object with the following optional fields: pascalCase (boolean), preserveConsecutiveUppercase (boolean), and locale (string or undefined).
The function returns a string.

## Data model
Input: a string or an array of strings.
Options: an object with optional boolean pascalCase, optional boolean preserveConsecutiveUppercase, and optional string locale.
Output: a camel-cased string.

## Requirements
1. When input is a non-empty string, the function returns a camel-cased string derived from that input.
2. When input is an array of strings, the function returns a camel-cased string derived from the array elements as if they were joined.
3. When input is an empty string, the function returns an empty string.
4. When input is a single word with no separators, the function returns that word in lower case.
5. When input is all upper case, the function returns the word in lower case.
6. Separators between words include hyphen, underscore, dot, space and other non-word separator characters.
7. Consecutive separators are treated as a single boundary and do not produce empty segments.
8. Leading and trailing separators are ignored.
9. The first word of the result is lower case unless pascalCase is true.
10. When pascalCase is true, the first word of the result is capitalised like every subsequent word.
11. Each word after the first is capitalised (first character upper case, remaining characters lower case).
12. Words are joined with no separator.
13. The locale option is accepted but its effect is an open question.
14. The preserveConsecutiveUppercase option is accepted but its effect is an open question.

## Formats
Input string format: zero or more words separated by one or more separator characters.
Input array format: zero or more string elements.
Options format: a JSON object with optional boolean and string fields.
Output format: a single string in lower camel case or upper camel case (pascal case).

## Errors
The behaviour for invalid input types is an open question.
The behaviour for missing options is to use defaults.

## Test cases
1. camelCase('foo-bar') returns 'fooBar'.
2. camelCase('foo_bar') returns 'fooBar'.
3. camelCase('Foo-Bar') returns 'fooBar'.
4. camelCase('--foo.bar') returns 'fooBar'.
5. camelCase('foo bar') returns 'fooBar'.
6. camelCase(['foo', 'bar']) returns 'fooBar'.
7. camelCase('foo-bar', {pascalCase: true}) returns 'FooBar'.
8. camelCase('') returns ''.
9. camelCase('FOO') returns 'foo'.
10. camelCase('foo') returns 'foo'.
11. camelCase('foo-bar-baz') returns 'fooBarBaz'.
12. camelCase('foo__bar') returns 'fooBar'.
13. camelCase('-foo-') returns 'foo'.
14. camelCase('foo.bar.baz') returns 'fooBarBaz'.
15. camelCase('foo  bar') returns 'fooBar'.
16. camelCase(['foo', 'bar', 'baz']) returns 'fooBarBaz'.
17. camelCase(['foo']) returns 'foo'.
18. camelCase([]) returns ''.
19. camelCase('foo-bar', {pascalCase: false}) returns 'fooBar'.
20. camelCase('foo-bar', {}) returns 'fooBar'.
21. camelCase('foo-bar', {preserveConsecutiveUppercase: true}) returns 'fooBar'.
22. camelCase('foo-bar', {locale: 'en'}) returns 'fooBar'.
23. camelCase('hello_world-example.test') returns 'helloWorldExampleTest'.
24. camelCase('ALREADY-CAMEL') returns 'alreadyCamel'.
25. camelCase('a-b-c') returns 'aBC'.
26. camelCase('foo-bar', {pascalCase: true, preserveConsecutiveUppercase: true}) returns 'FooBar'.
27. camelCase('foo-bar', {locale: undefined}) returns 'fooBar'.