import json

def digit_square_sum(n):
    total = 0
    while n > 0:
        digit = n % 10
        total = total + digit * digit
        n = n // 10
    return total

def reaches_one(n, cap):
    seen = set()
    value = n
    steps = 0
    while value != 1 and steps < cap:
        if value in seen:
            return False
        seen.add(value)
        value = digit_square_sum(value)
        steps = steps + 1
    return value == 1

def four_is_unhappy():
    seen = set()
    value = 4
    steps = 0
    while steps < 100:
        if value == 1:
            return False
        if value in seen:
            return value == 4
        seen.add(value)
        value = digit_square_sum(value)
        steps = steps + 1
    return False

happy_numbers = []
for n in range(1, 10001):
    if reaches_one(n, 100):
        happy_numbers.append(n)

result = {
    "count": len(happy_numbers),
    "largest": happy_numbers[-1],
    "first_fifteen": happy_numbers[:15],
    "four_is_unhappy": four_is_unhappy(),
    "seven_reaches_one": reaches_one(7, 100),
}
print(json.dumps(result, separators=(',', ':')))