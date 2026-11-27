import json

results = []
for n in range(1, 20001):
    if pow(2, n, n) == n - 1:
        results.append(n)

def is_power_of_3(x):
    if x < 1:
        return False
    while x % 3 == 0:
        x //= 3
    return x == 1

output = {
    "count": len(results),
    "values": results,
    "all_divisible_by_3_except_1": all(v % 3 == 0 for v in results if v != 1),
    "powers_of_3": [v for v in results if is_power_of_3(v)]
}
print(json.dumps(output, separators=(',', ':')))