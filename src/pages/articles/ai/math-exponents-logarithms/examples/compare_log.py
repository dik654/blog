"""Article experiment, not CPython implementation source.

Run with Python 3.9+; the article records a local CPython 3.9.6 run.
Floating point details and final digits may differ across environments.
"""
import math
import sys

q = 0.5 ** 3
print("probability:", q)
print("base 2:", math.log(q, 2))
print("natural log:", math.log(q))
print("base one half:", math.log(q, 0.5))

for count in (2000, 2001):
    product = 0.5 ** count
    log_probability = count * math.log(0.5)
    print(count, product, log_probability, math.exp(log_probability))

print("float format:", sys.float_info.radix, sys.float_info.mant_dig)
print("smallest normal:", sys.float_info.min)
print("smallest positive:", math.ulp(0.0))

try:
    math.log(0.5 ** 2000)
except ValueError as error:
    print(type(error).__name__, str(error))

small = 1e-20
print("log after addition:", math.log(1.0 + small))
print("log1p:", math.log1p(small))
