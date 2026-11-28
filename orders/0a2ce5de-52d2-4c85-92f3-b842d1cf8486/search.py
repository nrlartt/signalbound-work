import json

def digit_count(n):
    count = 0
    m = n
    while m > 0:
        count = count + 1
        m = m // 10
    return count

def digit_power_sum(n):
    k = digit_count(n)
    total = 0
    m = n
    while m > 0:
        d = m % 10
        total = total + d ** k
        m = m // 10
    return total

def is_narcissistic(n):
    return n == digit_power_sum(n)

results = []
for n in range(1, 10001):
    if is_narcissistic(n):
        results.append(n)

one_is_narcissistic = is_narcissistic(1)
one_five_three_holds = (1 ** 3 + 5 ** 3 + 3 ** 3 == 153)
output = {
    "count": len(results),
    "largest": results[-1] if results else None,
    "first_fifteen": results[:15],
    "one_is_narcissistic": one_is_narcissistic,
    "one_five_three_holds": one_five_three_holds,
}
print(json.dumps(output, separators=(',', ':')))