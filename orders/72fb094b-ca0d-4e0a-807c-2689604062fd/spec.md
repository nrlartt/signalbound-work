# Specification

## Interfaces

The module exports a single function named toInset.

toInset accepts three arguments: longitude, latitude, and region.

Longitude and latitude must be numbers. Region is expected to be a string matching one of the configured region keys exactly.

The function returns an object with three properties: x, y, and inset.

## Data model

x is a number representing the projected horizontal position within the inset.

y is a number representing the projected vertical position within the inset.

inset is a string naming the region used, or null when the region is not recognised.

## Requirements

1. If longitude is not a number, the function throws a TypeError with message "coords".
2. If latitude is not a number, the function throws a TypeError with message "coords".
3. If region is not one of the configured region keys, the function returns { x: longitude, y: latitude, inset: null } without throwing.
4. Region matching is case-sensitive.
5. For region "AK", if longitude is greater than 0, 360 is subtracted from it before projection.
6. For regions other than "AK", longitude is used as supplied with no wrapping.
7. For a recognised region, x is computed as the region's x0 plus (longitude minus the region's lon0) multiplied by the region's scale.
8. For a recognised region, y is computed as the region's y0 minus (latitude minus the region's lat0) multiplied by the region's scale.
9. The returned x and y are rounded to two decimal places.
10. For a recognised region, the returned inset property is the region string that was passed in.
11. The configured region data is: AK with lon0 -170, lat0 51, x0 0, y0 300, scale 2; HI with lon0 -160, lat0 18, x0 120, y0 330, scale 10; PR with lon0 -67.5, lat0 17.8, x0 260, y0 330, scale 20.

## Formats

Input longitude and latitude are numeric values. NaN is accepted as a number and propagates through the computation.

Input region is a string compared exactly against configured keys.

Output x and y are numbers rounded to two decimal places.

Output inset is a string or null.

## Errors

A TypeError with message "coords" is thrown when longitude or latitude is not a number.

No error is thrown for an unknown region.

## Test cases

1. toInset(-150, 61, "AK") returns { x: 40, y: 280, inset: "AK" }.
2. toInset(172.5, 52, "AK") returns { x: -35, y: 298, inset: "AK" } because positive longitudes are wrapped by subtracting 360 for AK only.
3. toInset(-157.8, 21.3, "HI") returns { x: 142, y: 297, inset: "HI" }.
4. toInset(-66.1, 18.4, "pr") returns { x: -66.1, y: 18.4, inset: null } because region names are case-sensitive and unknown regions pass through unchanged.
5. toInset("-66.1", 18.4, "PR") throws TypeError with message "coords" because the longitude argument is a string.
6. toInset(NaN, 18.4, "PR") returns an object where x is NaN, y is 318, and inset is "PR" because NaN passes the typeof number check.
7. toInset(10, 20, "HI") returns { x: 1820, y: 310, inset: "HI" } because no wrapping is applied outside AK.
8. toInset(-170, 51, "AK") returns { x: 0, y: 300, inset: "AK" } at the configured origin.
9. toInset(-160, 18, "HI") returns { x: 120, y: 330, inset: "HI" } at the configured origin.
10. toInset(-67.5, 17.8, "PR") returns { x: 260, y: 330, inset: "PR" } at the configured origin.
11. toInset(0, 0, "XX") returns { x: 0, y: 0, inset: null } for an unknown region.
12. toInset(-169, 50, "AK") returns { x: 2, y: 302, inset: "AK" } one degree east and one degree south of the AK origin.