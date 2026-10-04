"""Own arithmetic harness against unchanged MPyC split/recombine functions."""
from pathlib import Path
import json
import platform
import sys
sys.dont_write_bytecode = True
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'codebase'))
sys.argv.extend(['--no-log', '--no-gmpy2', '--no-numpy', '--no-uvloop'])
import mpyc
from mpyc import finfields, thresha
F = finfields.GF(67)
F.is_signed = False  # match SecFld(67) default output interpretation


def split(secret, slope):
    # Deliberately replace this one draw to reproduce an explanatory polynomial.
    # This does not test real entropy or the three-process runtime's randomness.
    with patch.object(thresha.secrets, 'randbelow', return_value=slope):
        return [row[0] for row in thresha.random_split(F, [secret], 1, 3)]


def combine(values, indices=None):
    if indices is None:
        indices = list(range(1, len(values) + 1))
    return int(thresha.recombine(F, [(i, [F(v)]) for i, v in zip(indices, values)])[0])


shares = [split(4, 2), split(3, 5), split(5, 3)]
assert shares == [[6, 8, 10], [8, 13, 18], [8, 11, 14]]
add = [(a+b) % 67 for a, b in zip(shares[0], shares[1])]
products = [(a*b) % 67 for a, b in zip(add, shares[2])]
assert add == [14, 21, 28] and products == [45, 30, 57]
assert combine(products) == 35 and combine(products[:2]) == 60
weights = thresha._recombination_vector(F, (1, 2, 3), 0)
assert weights == [3, 64, 1]
rows = [split(value, slope) for value, slope in zip(products, [4, 6, 8])]
assert rows == [[49, 53, 57], [36, 42, 48], [65, 6, 14]]
new_shares = [combine(column) for column in zip(*rows)]
assert new_shares == [37, 39, 41]
for indices in [(1, 2), (1, 3), (2, 3)]:
    assert combine([new_shares[i-1] for i in indices], indices) == 35

# Independent integer expressions, not the retained recombination implementation.
assert all(q == (35+56*i+21*i*i) % 67 for i, q in enumerate(products, 1))
assert all(v == (35+2*i) % 67 for i, v in enumerate(new_shares, 1))
assert (3*products[0]-3*products[1]+products[2]) % 67 == 35
assert (3*4-3*6+8) % 67 == 2

# A consistently false resharing of party one's local product is undetected by
# this passive arithmetic rule. This is not a network-level exploit test.
wrong_rows = [split(46, 4), rows[1], rows[2]]
wrong_shares = [combine(column) for column in zip(*wrong_rows)]
assert combine(wrong_shares[:2]) == 38

# One share's marginal distribution, not a full transcript simulation proof.
for secret in range(67):
    observed = [split(secret, slope)[0] for slope in range(67)]
    assert sorted(observed) == list(range(67))
# The fixed joint example also illustrates repeated-slope leakage.
assert all((b-a) % 67 == 66 for a, b in zip(split(4, 2), split(3, 2)))
# Vary one fresh resharing coefficient: the new slope ranges over all F_67.
assert len({(3*slope-3*6+8) % 67 for slope in range(67)}) == 67

# Separate honest DKG analogy in a small multiplicative group. Not tss-lib code.
key_shares = [sum(column) % 67 for column in zip(*shares)]
assert key_shares == [22, 32, 42] and combine(key_shares[:2]) == 12
assert pow(16, 67, 269) == 1 and 16 != 1  # prime order 67
public_key, coefficient = pow(16, 12, 269), pow(16, 10, 269)
assert (public_key, coefficient) == (142, 196)
assert all(pow(16, value, 269) == public_key*pow(coefficient, i, 269) % 269
           for i, value in enumerate(key_shares, 1))
assert pow(16, 23, 269) != public_key*coefficient % 269

print(json.dumps({'python': platform.python_version(), 'mpyc': mpyc.__version__,
                  'shares': shares, 'sumShares': add, 'productShares': products,
                  'productPolynomial': [35, 56, 21], 'wrongTwoPointOutput': 60,
                  'weightsMod67': weights, 'reshareMatrix': rows,
                  'newShares': new_shares, 'output': combine(new_shares[:2]),
                  'wrongReshareOutput': combine(wrong_shares[:2]),
                  'singleShareMarginalChecks': 67*67, 'freshSlopeOutputs': 67,
                  'dkgAnalogy': {'key': 12, 'shares': key_shares, 'publicKey': public_key,
                                 'coefficientCommitment': coefficient,
                                 'publicShares': [pow(16, s, 269) for s in key_shares]},
                  'scope': 'Original split/recombine with a controlled random draw; independent integer checks.',
                  'notClaim': 'No complete view simulator, malicious protocol, DKG implementation, entropy or security audit.'}, indent=2))
