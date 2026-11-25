# Specification

## Interfaces

The behaviour is exposed as a single function that accepts a page and a list of proposed edits and returns an object containing the resulting lines and a list of rejected edits.

## Data model

A page consists of an ordered collection of lines. Each line has an identifier, text, a source, a kind, and a removed flag. An edit has an operation code and optional fields including identifier, text, kind, and source. The result contains a filtered list of lines and an ordered list of rejection records, each pairing the rejected edit with a reason.

## Requirements

1. The function must copy each input line into a new working line before applying edits.
2. It must build an identifier index from the copied lines.
3. It must assign new line identifiers starting at one greater than the greatest existing identifier, or at 1 when there are no lines.
4. It must never reuse an identifier after a line is removed.
5. It must process edits in the order they are supplied.
6. An add edit must be rejected with reason bad-text when its text is absent or longer than 280 characters.
7. An add edit must be rejected with reason no-source when its source is absent.
8. An accepted add must create a line whose text is the proposed text trimmed, whose source is the proposed source, and whose kind is the proposed kind or claimed when no kind is supplied.
9. A fix edit must be rejected with reason unknown-id when the target identifier does not exist or the line is already removed.
10. A fix edit must be rejected with reason upgrade-needs-source when the proposed kind ranks higher than the current kind and no source is supplied.
11. A fix edit must replace text with the trimmed proposed text when a text field is present.
12. A fix edit must replace kind when a kind field is present.
13. A fix edit must replace source when a source field is present.
14. A remove edit must be rejected with reason unknown-id when the target identifier does not exist or the line is already removed.
15. An accepted remove must mark the line removed without deleting it from the working collection.
16. Any edit with an operation other than add, fix, or remove must be rejected with reason unknown-op.
17. The returned lines must exclude removed lines and preserve the original order of surviving lines.
18. The returned rejected list must preserve the order in which rejections occurred.
19. Kind rank must assign claimed zero, inferred one, observed two, verified three, and any other value minus one.
20. A kind downgrade must be accepted without requiring a source.
21. An unknown kind must be accepted without rejection.

## Formats

Input lines use fields named id, text, source, kind, and optionally removed. Input edits use fields named op, id, text, kind, and source. Output rejected entries use fields named edit and reason. Reasons are the strings bad-text, no-source, unknown-id, upgrade-needs-source, and unknown-op.

## Errors

The specification does not define behaviour for a null or undefined page, a missing lines property, a null or undefined edits list, non-object edits, missing edit fields, non-string text, non-string kind, non-string source, negative or duplicate identifiers, or identifier overflow. These inputs are unguarded in the observed behaviour and their outcomes are open questions.

## Test cases

Test case 1: Given page P with lines id 1 text Founded 2021 kind observed, id 2 text Main contract 0xabc kind claimed, id 4 text Chain 1 kind verified, and an add edit proposing text Audited twice with source s9, the result must contain a new line id 5 text Audited twice kind claimed.

Test case 2: Given page P and a fix edit for id 2 setting kind to verified without a source, the edit must be rejected with reason upgrade-needs-source.

Test case 3: Given page P and two remove edits for id 1 in succession, the first must be accepted and the second must be rejected with reason unknown-id.

Test case 4: Given page P, an add edit proposing text A, then a remove edit for id 5, then an add edit proposing text B, the second add must receive id 6, proving identifiers are never reused.

Test case 5: Given page P and a fix edit for id 4 setting kind to claimed without a source, the edit must be accepted because downgrades need no source.

Test case 6: Given page P and a fix edit for id 2 setting kind to bogus, the edit must be accepted because unknown kinds are not rejected.

Test case 7: Given page P and an add edit with empty text and a source, the edit must be rejected with reason bad-text.

Test case 8: Given page P and an add edit with text longer than 280 characters and a source, the edit must be rejected with reason bad-text.

Test case 9: Given page P and an add edit with valid text but no source, the edit must be rejected with reason no-source.

Test case 10: Given page P and a fix edit for id 2 setting text to trimmed content, the resulting line text must have leading and trailing whitespace removed.

Test case 11: Given page P and an edit with op set to delete, the edit must be rejected with reason unknown-op.

Test case 12: Given page P and a fix edit for id 2 setting kind to inferred with a source, the edit must be accepted and the line source must be updated to the supplied source.