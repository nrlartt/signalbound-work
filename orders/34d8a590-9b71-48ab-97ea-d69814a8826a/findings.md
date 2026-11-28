# Findings

## Source review

OBSERVATION: The module defines two module-level constants named FATHOM_CM and FOOT_CM with values 183 and 30 respectively (source: paid brief source excerpt, lines 4-5).

OBSERVATION: The module exports a function named correct that takes two parameters named observedCm and gaugeCm (source: paid brief source excerpt, line 7).

OBSERVATION: correct throws an Error with message "bad observed" when observedCm is not an integer or is less than zero (source: paid brief source excerpt, line 8).

OBSERVATION: correct throws an Error with message "bad gauge" when gaugeCm is not an integer (source: paid brief source excerpt, line 9).

OBSERVATION: correct returns the sum of observedCm and gaugeCm when both validations pass (source: paid brief source excerpt, line 10).

OBSERVATION: The module exports a function named isDry that takes one parameter named correctedCm (source: paid brief source excerpt, line 13).

OBSERVATION: isDry throws an Error with message "bad depth" when correctedCm is not an integer (source: paid brief source excerpt, line 14).

OBSERVATION: isDry returns true when correctedCm is less than or equal to zero, and false otherwise (source: paid brief source excerpt, line 15).

OBSERVATION: The module exports a function named toFathoms that takes one parameter named correctedCm (source: paid brief source excerpt, line 18).

OBSERVATION: toFathoms throws an Error with message "bad depth" when correctedCm is not an integer or is less than zero (source: paid brief source excerpt, line 19).

OBSERVATION: toFathoms computes fathoms as the integer floor of correctedCm divided by FATHOM_CM (source: paid brief source excerpt, line 20).

OBSERVATION: toFathoms computes rem as correctedCm modulo FATHOM_CM (source: paid brief source excerpt, line 21).

OBSERVATION: toFathoms computes feet as the integer floor of rem divided by FOOT_CM (source: paid brief source excerpt, line 22).

OBSERVATION: toFathoms returns an object with properties fathoms and feet (source: paid brief source excerpt, line 23).

## Behavioural claims from the paid brief

OBSERVATION: correct(400, -50) returns 350 (source: paid brief, behavioural statement).

OBSERVATION: correct(0, 0) returns 0 (source: paid brief, behavioural statement).

OBSERVATION: A negative observed value to correct throws "bad observed" (source: paid brief, behavioural statement).

OBSERVATION: A non-integer observed value to correct throws "bad observed" (source: paid brief, behavioural statement).

OBSERVATION: A non-integer gauge to correct throws "bad gauge" (source: paid brief, behavioural statement).

OBSERVATION: A negative but integer gauge to correct is accepted (source: paid brief, behavioural statement).

OBSERVATION: isDry(0) returns true (source: paid brief, behavioural statement).

OBSERVATION: isDry(1) returns false (source: paid brief, behavioural statement).

OBSERVATION: isDry(-1) returns true (source: paid brief, behavioural statement).

OBSERVATION: A non-integer argument to isDry throws "bad depth" (source: paid brief, behavioural statement).

OBSERVATION: toFathoms(0) returns { fathoms: 0, feet: 0 } (source: paid brief, behavioural statement).

OBSERVATION: toFathoms(183) returns { fathoms: 1, feet: 0 } (source: paid brief, behavioural statement).

OBSERVATION: toFathoms(213) returns { fathoms: 1, feet: 1 } (source: paid brief, behavioural statement).

OBSERVATION: toFathoms(182) returns { fathoms: 0, feet: 6 } (source: paid brief, behavioural statement).

OBSERVATION: toFathoms(-5) throws "bad depth" (source: paid brief, behavioural statement).

OBSERVATION: The file uses 183 cm per fathom and 30 cm per foot (source: paid brief, behavioural statement; source excerpt lines 4-5).

## Inferences

INFERENCE: correct(400, -50) returns 350 because 400 plus -50 equals 350 and the function returns observedCm plus gaugeCm (source: OBSERVATION that correct returns observedCm + gaugeCm; OBSERVATION that correct(400, -50) returns 350).

INFERENCE: correct(0, 0) returns 0 because 0 plus 0 equals 0 (source: OBSERVATION that correct returns observedCm + gaugeCm; OBSERVATION that correct(0, 0) returns 0).

INFERENCE: A negative but integer gauge is accepted because correct only validates that gaugeCm is an integer and does not check its sign (source: OBSERVATION that correct throws "bad gauge" only when gaugeCm is not an integer; OBSERVATION that a negative but integer gauge is accepted).

INFERENCE: isDry(0) returns true because 0 is less than or equal to zero (source: OBSERVATION that isDry returns true when correctedCm <= 0; OBSERVATION that isDry(0) is true).

INFERENCE: isDry(1) returns false because 1 is greater than zero (source: OBSERVATION that isDry returns false when correctedCm > 0; OBSERVATION that isDry(1) is false).

INFERENCE: isDry(-1) returns true because -1 is less than or equal to zero (source: OBSERVATION that isDry returns true when correctedCm <= 0; OBSERVATION that isDry(-1) is true).

INFERENCE: toFathoms(183) returns { fathoms: 1, feet: 0 } because 183 divided by 183 is 1 with remainder 0, and 0 divided by 30 is 0 (source: OBSERVATION of toFathoms computation; OBSERVATION that FATHOM_CM is 183 and FOOT_CM is 30; OBSERVATION that toFathoms(183) returns { fathoms: 1, feet: 0 }).

INFERENCE: toFathoms(213) returns { fathoms: 1, feet: 1 } because 213 divided by 183 is 1 with remainder 30, and 30 divided by 30 is 1 (source: OBSERVATION of toFathoms computation; OBSERVATION that FATHOM_CM is 183 and FOOT_CM is 30; OBSERVATION that toFathoms(213) returns { fathoms: 1, feet: 1 }).

INFERENCE: toFathoms(182) returns { fathoms: 0, feet: 6 } because 182 divided by 183 is 0 with remainder 182, and 182 divided by 30 is 6 (source: OBSERVATION of toFathoms computation; OBSERVATION that FATHOM_CM is 183 and FOOT_CM is 30; OBSERVATION that toFathoms(182) returns { fathoms: 0, feet: 6 }).

INFERENCE: toFathoms(0) returns { fathoms: 0, feet: 0 } because 0 divided by 183 is 0 with remainder 0, and 0 divided by 30 is 0 (source: OBSERVATION of toFathoms computation; OBSERVATION that FATHOM_CM is 183 and FOOT_CM is 30; OBSERVATION that toFathoms(0) returns { fathoms: 0, feet: 0 }).

## Unknowns

UNKNOWN: Whether the module is exported as a CommonJS module, an ES module, or both, because the paid brief shows an export statement but does not state the module system or file extension (source: paid brief source excerpt; no module system declaration was present).

UNKNOWN: Whether correct accepts a gaugeCm of zero, because the paid brief only states that a negative but integer gauge is accepted and does not mention zero (source: paid brief behavioural statements; zero gauge case was not listed).

UNKNOWN: Whether isDry accepts very large integers without precision loss, because the paid brief and source excerpt do not address numeric range limits beyond integer validation (source: paid brief source excerpt; no range testing was described).