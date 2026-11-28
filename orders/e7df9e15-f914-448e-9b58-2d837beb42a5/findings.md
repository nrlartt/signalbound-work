# Findings

## Source material

OBSERVATION: The target is a single JavaScript module defining a frozen TABLE object and five exported functions: cones, normalize, celsius, midpoint, and inBand. (source: supplied module source)

OBSERVATION: TABLE maps string cone labels to integer Celsius values, with keys "022" through "010", "09" through "01", "1" through "10". (source: supplied module source, TABLE definition)

OBSERVATION: TABLE contains 32 entries total. (source: supplied module source, TABLE definition)

OBSERVATION: TABLE["06"] equals 996 and TABLE["6"] equals 1222. (source: supplied module source, TABLE definition)

OBSERVATION: TABLE["10"] equals 1305. (source: supplied module source, TABLE definition)

OBSERVATION: cones returns Object.keys(TABLE), preserving insertion order. (source: supplied module source, cones function)

OBSERVATION: normalize throws Error("unknown cone") when cone is 0 or "0". (source: supplied module source, normalize function, first branch)

OBSERVATION: normalize accepts numbers 1 through 10 inclusive, converts them to their string form, and returns that string. (source: supplied module source, normalize function, number branch)

OBSERVATION: normalize rejects non-integer numbers, numbers below 1, and numbers above 10 with Error("unknown cone"). (source: supplied module source, normalize function, number branch)

OBSERVATION: normalize accepts empty string? No: it throws Error("unknown cone") for empty string. (source: supplied module source, normalize function, string branch)

OBSERVATION: normalize accepts a string only if TABLE[cone] is not undefined, returning the string unchanged. (source: supplied module source, normalize function, string branch)

OBSERVATION: normalize rejects any other string, including "06 " with trailing space, with Error("unknown cone"). (source: supplied module source, normalize function, string branch)

OBSERVATION: celsius returns TABLE[normalize(cone)], so it propagates normalize's acceptance and rejection behaviour. (source: supplied module source, celsius function)

OBSERVATION: midpoint computes Math.floor((celsius(a) + celsius(b)) / 2). (source: supplied module source, midpoint function)

OBSERVATION: inBand throws Error("bad band") if temp is not finite, band is not an integer, or band is negative. (source: supplied module source, inBand function)

OBSERVATION: inBand returns true when Math.abs(temp - celsius(cone)) <= band, making the band inclusive at both edges. (source: supplied module source, inBand function)

OBSERVATION: inBand with cone "6", temp 1222, band 0 returns true because abs(1222 - 1222) = 0 <= 0. (source: supplied module source, inBand function and TABLE["6"] = 1222)

OBSERVATION: inBand with cone "10", temp 1233, band 10 returns false because abs(1233 - 1305) = 72 > 10. (source: supplied module source, inBand function and TABLE["10"] = 1305)

OBSERVATION: The error string for an invalid cone is "unknown cone". (source: supplied module source, normalize function)

OBSERVATION: The error string for an invalid band is "bad band". (source: supplied module source, inBand function)

INFERENCE: Leading-zero labels "06" and "022" are accepted because they are direct keys in TABLE. (source: supplied module source, TABLE keys and normalize string branch)

INFERENCE: The number 22 is rejected because it is outside the 1..10 range accepted by the number branch of normalize. (source: supplied module source, normalize number branch)

INFERENCE: The number 0 is rejected by the explicit zero check in normalize. (source: supplied module source, normalize first branch)

INFERENCE: The padded string "06 " is rejected because it is not an exact key in TABLE. (source: supplied module source, TABLE keys and normalize string branch)

INFERENCE: The exact midpoint of "06" (996) and 6 (1222) is floor((996 + 1222) / 2) = floor(2218 / 2) = 1109. (source: supplied module source, midpoint function and TABLE values)

INFERENCE: cones() returns 32 labels because TABLE has 32 keys. (source: supplied module source, TABLE definition and cones function)

UNKNOWN: Whether the module has ever been executed in a runtime environment, because no execution output was provided. (source: supplied module source only; no runtime output available)

UNKNOWN: Whether Object.keys(TABLE) order matches the literal insertion order in all JavaScript engines, because the source does not include execution evidence. (source: supplied module source, cones function; no engine specification consulted)

UNKNOWN: Whether celsius accepts non-string, non-number inputs such as objects or symbols, because normalize's type checks only cover number and string branches and the behaviour for other types is not explicitly exercised in the source. (source: supplied module source, normalize function; no test output for other types)

UNKNOWN: Whether inBand's cone argument validation relies entirely on celsius throwing "unknown cone", because the source does not show a separate cone check in inBand. (source: supplied module source, inBand function; no separate cone validation visible)

UNKNOWN: Whether the Celsius figures correspond to any published pyrometric chart, because the brief states the file table is the only authority and no external chart was consulted. (source: supplied module source comment and brief instruction; no external reference examined)