import math, json

def is_prime(n):
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True

def main():
    f = lambda n: n * n + n + 41
    smallest_n = None
    prime_100 = 0
    prime_1000 = 0
    composite_below_100 = []
    for n in range(1000):
        val = f(n)
        if is_prime(val):
            if n < 100:
                prime_100 += 1
            if n < 1000:
                prime_1000 += 1
        else:
            if n < 100:
                composite_below_100.append(n)
            if smallest_n is None:
                smallest_n = n
    result = {
        "smallest_n": smallest_n,
        "prime_100": prime_100,
        "prime_1000": prime_1000,
        "composite_below_100": sorted(composite_below_100)
    }
    print(json.dumps(result))

if __name__ == "__main__":
    main()