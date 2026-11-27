# Specification

## Interfaces

The module exposes two functions.

parseLinks(text) accepts a string and returns an array of objects. Each object has the properties target, anchor, label, and index.

uniqueTargets(text) accepts a string and returns an array of strings.

## Data model

Each parse result object contains:
- target: a non-empty string derived from the link target
- anchor: either a string or null
- label: a string
- index: a non-negative integer

uniqueTargets returns an array of unique target strings in sorted order.

## Requirements

1. The parser recognises links delimited by [[ and ]].
2. Inside the delimiters, the target portion may not contain [, ], or |.
3. A pipe character may optionally separate the target from a label.
4. The label portion may not contain [ or ], but may contain |.
5. Whitespace at the start and end of the target is removed before further processing.
6. A link whose trimmed target is empty is ignored and produces no result.
7. The target is split at the first # into page and anchor.
8. If no # is present, anchor is null.
9. If # is present, anchor is the text after the first #, including any further # characters.
10. The first character of the page is uppercased and the rest of the page is unchanged except for space runs.
11. Each run of one or more space characters in the page is replaced by a single underscore.
12. When no pipe is present, the label is the full trimmed target including any anchor portion.
13. When a pipe is present and the label text is empty, the label is the page with an optional trailing parenthesised suffix removed.
14. When a pipe is present and the label text is non-empty, the label is used exactly as written.
15. The index is the position in the input string where the match begins.
16. uniqueTargets lowercases every target before adding it to a set, so targets differing only in case are treated as the same.
17. uniqueTargets returns the set members sorted in ascending lexicographic order.
18. uniqueTargets returns only target strings, not anchors, labels, or indexes.

## Formats

Input is a plain text string that may contain wiki-style links.
Output of parseLinks is an array of objects with string or null fields and a numeric index field.
Output of uniqueTargets is an array of strings.

## Errors

No error handling or validation is specified in the source. Behaviour for non-string input is not defined.

## Test cases

1. Input: [[bee colony]] -> Output: [{ target: "Bee_colony", anchor: null, label: "bee colony", index: 0 }]
2. Input: [[Ant (insect)|]] -> Output: [{ target: "Ant_(insect)", anchor: null, label: "Ant", index: 0 }]
3. Input: [[ swarm  robotics#History|robots]] -> Output: [{ target: "Swarm_robotics", anchor: "History", label: "robots", index: 0 }]
4. Input: [[]] -> Output: []
5. Input: [[a|b|c]] -> Output: [{ target: "A", anchor: null, label: "b|c", index: 0 }]
6. Input: [[#Top]] -> Output: [{ target: "#Top", anchor: null, label: "#Top", index: 0 }]
7. Input: [[Hive]] [[hive]] -> Output of uniqueTargets: ["hive"]
8. Input: [[x]]] -> Output: [{ target: "X", anchor: null, label: "x", index: 0 }]
9. Input: [[Page|label with | pipe]] -> Output: [{ target: "Page", anchor: null, label: "label with | pipe", index: 0 }]
10. Input: [[Page#Section#Sub|label]] -> Output: [{ target: "Page", anchor: "Section#Sub", label: "label", index: 0 }]
11. Input: [[  spaced  target  ]] -> Output: [{ target: "Spaced_target", anchor: null, label: "spaced  target", index: 0 }]
12. Input: [[lower]] [[LOWER]] -> Output of uniqueTargets: ["lower"]
13. Input: [[A#B]] [[C#D]] -> Output: [{ target: "A", anchor: "B", label: "A#B", index: 0 }, { target: "C", anchor: "D", label: "C#D", index: 10 }]
14. Input: [[Target (suffix)|]] -> Output: [{ target: "Target_(suffix)", anchor: null, label: "Target", index: 0 }]
15. Input: plain text with no links -> Output: []
16. Input: [[a]] [[b]] [[a]] -> Output of uniqueTargets: ["a", "b"]