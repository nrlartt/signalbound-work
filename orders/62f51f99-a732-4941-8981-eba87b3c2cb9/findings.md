# Investigation findings

## Source material
OBSERVATION: The paid brief defines a small open-source npm library named gas-diary-calc (source: Paid brief, project description).
OBSERVATION: The library exposes calculateFee(gasUsed, baseFeeGwei, priorityFeeGwei) returning {gwei: number, eth: string} (source: Paid brief, paid brief paragraph).
OBSERVATION: The library exposes formatGwei(n) (source: Paid brief, paid brief paragraph).
OBSERVATION: README.md must be 400-700 words (source: Paid brief, README.md section).
OBSERVATION: README.md must contain install instruction npm i gas-diary-calc (source: Paid brief, README.md section).
OBSERVATION: README.md must contain a 5-line quick start example with exact output for 21000 gas, 2 gwei base, 1 gwei tip: 63000 gwei, "0.000063" ETH (source: Paid brief, README.md section).
OBSERVATION: README.md must contain an API summary table (source: Paid brief, README.md section).
OBSERVATION: README.md must state license MIT (source: Paid brief, README.md section).
OBSERVATION: docs/api.md must document each function with parameters, types, return value, thrown errors, and 2 examples each (source: Paid brief, docs/api.md section).
OBSERVATION: Negative or non-finite inputs throw RangeError (source: Paid brief, docs/api.md section).
OBSERVATION: docs/concepts.md must explain gas, base fee, priority fee and EIP-1559 in 300-500 words (source: Paid brief, docs/concepts.md section).
OBSERVATION: docs/faq.md must contain at least 6 questions with answers (source: Paid brief, docs/faq.md section).
OBSERVATION: No placeholders or open question lines are allowed in the authored documentation; every section must be fully written (source: Paid brief, documentation constraint).
OBSERVATION: The delivery contract requires findings.md and spec.md only, with findings.md holding every claim on its own line tagged OBSERVATION, INFERENCE or UNKNOWN, each with a source (source: Delivery contract).
OBSERVATION: spec.md must have sections Interfaces, Data model, Requirements, Formats, Errors and Test cases (source: Delivery contract).
OBSERVATION: spec.md must carry no code, no offsets and no copied text (source: Delivery contract).
OBSERVATION: The bundle contract requires a JSON envelope with summary and files array, relative unique paths using only letters, digits, dot, dash, slash and underscore, .md and .txt files only, max 300KB per file and 2MB total (source: Bundle contract).
OBSERVATION: This is step 1 of 2: investigate; step 2 will build the Node.js project with offline tests run in isolation using Node's native test runner (source: Ordered work).

## Inferences
INFERENCE: calculateFee multiplies gasUsed by the sum of baseFeeGwei and priorityFeeGwei to produce gwei, because 21000 * (2 + 1) equals 63000 (source: Paid brief quick start example output).
INFERENCE: eth is the gwei value converted to ETH as a string with six decimal places, because 63000 gwei becomes "0.000063" (source: Paid brief quick start example output).
INFERENCE: formatGwei(n) formats a numeric gwei value as a string for display (source: Paid brief function name and context).
INFERENCE: The validation rule applies to all numeric inputs of calculateFee and formatGwei (source: Paid brief thrown errors statement).

## Unknowns
UNKNOWN: The exact rounding or formatting rule for eth when the gwei value has more than six decimal places could not be established (source: Paid brief; only one example output was given).
UNKNOWN: The exact output format of formatGwei(n) could not be established (source: Paid brief; no example or signature detail was given).
UNKNOWN: Whether gasUsed must be an integer or may accept fractional values could not be established (source: Paid brief; no input constraints beyond negativity and finiteness were stated).
UNKNOWN: The precise word count target within 400-700 for README.md could not be established (source: Paid brief; only a range was given).
UNKNOWN: The precise word count target within 300-500 for docs/concepts.md could not be established (source: Paid brief; only a range was given).
UNKNOWN: The specific six or more FAQ questions could not be established (source: Paid brief; only a minimum count was given).