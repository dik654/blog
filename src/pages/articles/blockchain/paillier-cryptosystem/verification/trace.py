# coding: utf-8
"""Own reproducible small example; all imported phe files remain unchanged."""
from pathlib import Path
import json
from math import gcd, lcm
import platform
import sys

RAW = Path(__file__).resolve().parents[1] / 'codebase'
sys.path.insert(0, str(RAW))
import phe
from phe import paillier

n = 15
g = 16
modulus = n * n
lam = lcm(2, 4)
mu = pow(lam, -1, n)
public = paillier.PaillierPublicKey(n)
private = paillier.PaillierPrivateKey(public, 3, 5)


def encrypt_model(m, r):
    return pow(g, m, modulus) * pow(r, n, modulus) % modulus


def decrypt_model(c):
    return ((pow(c, lam, modulus) - 1) // n) * mu % n


def canonical_encrypt(m, r):
    """Own input checks for this fixed known-valid educational key."""
    if type(m) is not int or not 0 <= m < n:
        raise ValueError('message must be a canonical residue')
    if type(r) is not int or not 0 < r < n or gcd(r, n) != 1:
        raise ValueError('randomizer must be a canonical unit')
    return public.raw_encrypt(m, r)


def canonical_decrypt(c):
    if type(c) is not int or not 0 < c < modulus or gcd(c, n) != 1:
        raise ValueError('ciphertext must be a canonical unit')
    return private.raw_decrypt(c)


def outcome(fn):
    try:
        return {'returned': fn()}
    except Exception as error:
        return {'error': type(error).__name__, 'message': str(error)}


units = [r for r in range(1, n) if gcd(r, n) == 1]
all_ciphertexts = []
for m in range(n):
    for r in units:
        c = canonical_encrypt(m, r)
        assert c == encrypt_model(m, r)
        assert canonical_decrypt(c) == decrypt_model(c) == m
        all_ciphertexts.append(c)
assert len(set(all_ciphertexts)) == 120

left = public.encrypt(4, r_value=2)
right = public.encrypt(3, r_value=4)
aggregate = left + right
c1, c2, cs = left.ciphertext(False), right.ciphertext(False), aggregate.ciphertext(False)
assert (c1, c2, cs) == (173, 154, 92)
assert private.raw_decrypt(cs) == 7
assert outcome(lambda: private.decrypt(aggregate))['error'] == 'OverflowError'
assert outcome(lambda: left * right)['error'] == 'NotImplementedError'

# Deliberately controlled getter for deterministic dispatch tests only.
# This does not test the real SystemRandom implementation or its entropy.
public.get_random_lt_n = lambda: 7
r_zero_dispatch = public.raw_encrypt(4, r_value=0)
assert r_zero_dispatch == 223
rerandomized = aggregate.ciphertext()
assert rerandomized == 56 and private.raw_decrypt(rerandomized) == 7

same_r_second = public.raw_encrypt(3, 2)
ratio = c1 * pow(same_r_second, -1, modulus) % modulus
assert (same_r_second, ratio, (ratio - 1) // n) == (53, 16, 1)
assert private.raw_decrypt(c1 * g % modulus) == 5
assert (pow(c1, 3, modulus), private.raw_decrypt(pow(c1, 3, modulus))) == (17, 12)
assert private.raw_decrypt(encrypt_model(13, 2) * encrypt_model(4, 4) % modulus) == 2

rejected = []
for kind, args in [('m', (-1, 2)), ('m', (15, 2)), ('m', (True, 2)),
                   ('r', (4, 0)), ('r', (4, 3)), ('r', (4, 15))]:
    result = outcome(lambda: canonical_encrypt(*args))
    assert result.get('error') == 'ValueError'
    rejected.append({'inputKind': kind, 'input': args, 'result': result})
for c in (0, 27, 225, 226):
    result = outcome(lambda: canonical_decrypt(c))
    assert result.get('error') == 'ValueError'
    rejected.append({'ciphertext': c, 'result': result})

# A deliberately different tiny key violates the lambda-inverse profile.
# CRT still decrypts; do not incorrectly claim all round trips must fail.
p21 = paillier.PaillierPublicKey(21)
k21 = paillier.PaillierPrivateKey(p21, 3, 7)
u21 = [r for r in range(1, 21) if gcd(r, 21) == 1]
assert all(k21.raw_decrypt(p21.raw_encrypt(m, r)) == m for m in range(21) for r in u21)
assert len({p21.raw_encrypt(0, r) for r in u21}) == 4
assert outcome(lambda: pow(lcm(2, 6), -1, 21))['error'] == 'ValueError'

# Fixed-point example uses a separate stated key with enough integer room.
p323 = paillier.PaillierPublicKey(323)
k323 = paillier.PaillierPrivateKey(p323, 17, 19)
f1 = p323.encrypt(1.5, precision=1/16, r_value=2)
f2 = p323.encrypt(0.25, precision=1/16, r_value=3)
f_sum = f1 + f2
assert (f1.exponent, f2.exponent, k323.decrypt(f_sum)) == (-1, -1, 1.75)
# Valid modular arithmetic can silently re-enter the signed encoding range.
signed_wrap = left + left + left + left
assert private.decrypt(signed_wrap) == 1  # integer 16 wraps mod 15

result = {'python': platform.python_version(), 'phe': phe.__version__,
          'optionalGmp': phe.util.HAVE_GMP, 'optionalCrypto': phe.util.HAVE_CRYPTO,
          'smallKey': {'p': 3, 'q': 5, 'n': n, 'g': g, 'lambda': lam, 'mu': mu,
                       'hp': private.hp, 'hq': private.hq, 'pInverse': private.p_inverse},
          'case': {'ciphertexts': [c1, c2], 'aggregate': cs, 'lambdaPower': pow(cs, lam, modulus),
                   'L': (pow(cs, lam, modulus)-1)//n, 'rawSum': private.raw_decrypt(cs),
                   'decodeSum': outcome(lambda: private.decrypt(aggregate)),
                   'rerandomizedWithControlled7': rerandomized,
                   'sameRandomizerSecondCiphertext': same_r_second, 'ratio': ratio, 'difference': 1,
                   'scalar3Ciphertext': 17, 'scalar3Plaintext': 12,
                   'alteredByPublicG': c1*g%modulus, 'alteredPlaintext': 5},
          'rawInputs': {'r3': public.raw_encrypt(4, 3), 'rawDecrypt27': private.raw_decrypt(27),
                        'r0ControlledGetter7': r_zero_dispatch, 'rawDecrypt0': private.raw_decrypt(0),
                        'm15': public.raw_encrypt(15, 2)},
          'checks': {'allValidMessageRandomizerPairs': 120, 'distinctCiphertexts': 120,
                     'canonicalRejections': rejected, 'signed16WrapsTo': private.decrypt(signed_wrap)},
          'counterexampleKey': {'n': 21, 'lambda': 6, 'gcdLambdaN': 3,
                               'lambdaInverse': outcome(lambda: pow(6, -1, 21)),
                               'acceptedByConstructor': True, 'allCrtRoundtrips': 252,
                               'randomizers': 12, 'distinctEncZero': 4},
          'fixedPointSeparateKey': {'n': 323, 'maxInt': p323.max_int, 'base': phe.EncodedNumber.BASE,
                                   'exponents': [f1.exponent, f2.exponent], 'integerCoefficients': [24, 4],
                                   'sumCoefficient': k323.raw_decrypt(f_sum.ciphertext(False)),
                                   'decodedSum': k323.decrypt(f_sum)},
          'scope': 'Imported retained original core modules; own deterministic call harness and independent integer model.',
          'notExecuted': ['upstream complete test suite', 'large random key generation',
                          'production RNG/constant time/entropy/security assessment',
                          'CCA/threshold/range proof protocol', 'benchmark']}
print(json.dumps(result, indent=2))
