"""Article-authored checks; CPython struct storage conversions, not GPU kernels."""
import json
import math
import platform
import struct
from fractions import Fraction


def q16(x):
    return struct.unpack('>e', struct.pack('>e', x))[0]


def q32(x):
    return struct.unpack('>f', struct.pack('>f', x))[0]


delta = 2.0 ** -11
serial = q16(q16(1.0 + delta) + delta)
grouped = q16(1.0 + q16(delta + delta))
tie_up = q16(1.0 + 3.0 * delta)
wide = q16(q32(q32(1.0 + delta) + delta))
assert (serial, grouped, tie_up, wide) == (1.0, 1.0 + 2*delta, 1.0 + 4*delta, grouped)
assert [struct.pack('>e', x).hex() for x in (serial, grouped, tie_up)] == ['3c00', '3c01', '3c02']
assert q16(2.0 + delta) == 2.0
assert q16(2.0 ** -24) == 2.0 ** -24
assert q16(2.0 ** -25) == 0.0
assert q16((1.0 + 2*delta) - 1.0) == 2*delta
four_serial = 1.0
for _ in range(4):
    four_serial = q16(four_serial + delta)
assert four_serial == 1.0
assert q16(1.0 + 4*delta) == tie_up

x = [10000.0, 10002.0]
mean = q32(q32(x[0] + x[1]) / 2)
squares = [q32(t*t) for t in x]
second_moment = q32(q32(squares[0] + squares[1]) / 2)
mean_square = q32(mean*mean)
naive_variance = q32(second_moment - mean_square)
centered = [q32(t-mean) for t in x]
centered_variance = q32(q32(q32(centered[0]**2) + q32(centered[1]**2)) / 2)
assert (mean, squares, second_moment, mean_square, naive_variance, centered_variance) == (
    10001.0, [100000000.0, 100040000.0], 100020000.0, 100020000.0, 0.0, 1.0)


def shifted_softmax(values):
    m = max(values)
    exps = [math.exp(t-m) for t in values]
    denominator = sum(exps)
    return [e/denominator for e in exps], denominator


positive, denominator = shifted_softmax([1000.0,1001.0,1002.0])
negative, _ = shifted_softmax([-1002.0,-1001.0,-1000.0])
assert positive == negative
assert math.exp(-1000.0) == 0.0
log_second = -1000.0 - math.log(1.0 + math.exp(-1000.0))
assert log_second == -1000.0
try:
    math.exp(1000.0)
except OverflowError:
    overflow = 'OverflowError'
else:
    raise AssertionError('Expected Python math API overflow exception')
grid = [[a+b for b in [10,20,30]] for a in [1,2,3]]
assert grid == [[11,21,31],[12,22,32],[13,23,33]]

report = {
    'runtime': platform.python_version(),
    'float_format': float.__getformat__('double'),
    'scope': 'stdlib pack/unpack explicit storage rounding; no NumPy, PyTorch or GPU execution',
    'delta': delta,
    'serial': serial, 'grouped': grouped, 'tie_up': tie_up, 'wide_accumulator': wide,
    'exact_sum': str(Fraction(1)+2*Fraction(1,2048)),
    'bytes': [struct.pack('>e', v).hex() for v in (serial, grouped, tie_up)],
    'variance': {'squares':squares,'mean':mean,'second_moment':second_moment,
                 'mean_square':mean_square,'naive':naive_variance,'centered':centered_variance},
    'softmax': positive, 'denominator':denominator, 'negative_same':negative,
    'exp_1000':overflow,'exp_minus1000':math.exp(-1000.0),'log_second':log_second,
    'shape_grid':grid,
    'format_derived': {
        'fp16_max': (2-2**-10)*2**15,
        'bf16_max': (2-2**-7)*2**127,
        'fp32_max': (2-2**-23)*2**127,
        'approx_decimal_capacity': [p*math.log10(2) for p in [24,11,8]]
    }
}
print(json.dumps(report, indent=2))
