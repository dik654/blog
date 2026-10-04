"""Article arithmetic, not a reproduction of the PyTorch kernel."""
import math
import struct
import json

def f32(x):
    return struct.unpack("f", struct.pack("f", x))[0]

p = [.5, .25, .25]
q = [.25, .25, .5]
entropy = -sum(x * math.log(x) for x in p)
ce = -sum(x * math.log(y) for x, y in zip(p, q))
assert math.isclose(ce / math.log(2), 1.75)
assert math.isclose((ce - entropy) / math.log(2), .25)
large = f32(100_000_000)
log_sum = f32(math.log(3))
assembled = f32(f32(large + log_sum) - large)
subtract_first = f32(log_sum - f32(large - large))
assert assembled == 0
assert subtract_first > 1
print(json.dumps({"entropy_nat": entropy, "ce_nat": ce,
    "kl_nat": ce - entropy, "assembled_fp32": assembled,
    "subtract_first_fp32": subtract_first}, indent=2))
