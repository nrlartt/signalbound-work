import json, itertools
results = []
for n in range(0, 1001):
    if (n * (n + 1)) % 2 == 1:
        results.append(n)
output = {"domain": "0..1000", "counterexamples": results, "total": len(results)}
print(json.dumps(output))
