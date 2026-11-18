import json, itertools
result = []
for n in range(0, 101):
    val = (2 + 2*2 - 2//2)
    result.append({"n": n, "val": val})
print(json.dumps({"domain": "0..100", "expression": "2+2x2-2/2", "count": len(result), "results": result}))