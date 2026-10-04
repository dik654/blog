# coding: utf-8
"""Own verification harness. Selected upstream definitions are unchanged.
Run with CPython >= 3.11. Does not execute a complete Binius/Flock proof system.
"""
import ast
import hashlib
import json
from pathlib import Path
import platform
import sys
import types

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'codebase' / 'models'
SCOPES = []
for name in ('binius_models', 'binius_models.finite_fields', 'binius_models.utils', 'binius_models.ips'):
    module = types.ModuleType(name)
    module.__path__ = []
    sys.modules[name] = module


def load(name, relative, excluded_classes=()):
    """Skip unused tower classes/GF import; preserve all selected AST nodes."""
    path = RAW / relative
    source = path.read_text()
    tree = ast.parse(source)
    removed = []
    retained = []
    for node in tree.body:
        if isinstance(node, ast.ImportFrom) and node.module == 'galois':
            removed.append('unused galois.GF import')
        elif isinstance(node, ast.ClassDef) and node.name in excluded_classes:
            removed.append(node.name)
        else:
            retained.append(node)
    tree.body = retained
    module = types.ModuleType(name)
    module.__file__ = str(path)
    module.__package__ = name.rsplit('.', 1)[0]
    sys.modules[name] = module
    exec(compile(tree, str(path), 'exec'), module.__dict__)
    SCOPES.append({'path': relative, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                   'removed': removed, 'selectedDefinitionsModified': False})
    return module


load('binius_models.utils.utils', 'binius_models/utils/utils.py')
load('binius_models.finite_fields.finite_field', 'binius_models/finite_fields/finite_field.py')
tower = load('binius_models.finite_fields.tower', 'binius_models/finite_fields/tower.py',
             ('AESTowerField', 'Tower192Field', 'FASTowerField'))
polynomial = load('binius_models.ips.polynomial', 'binius_models/ips/polynomial.py')
sumcheck = load('binius_models.ips.sumcheck', 'binius_models/ips/sumcheck.py')


class E(tower.BinaryTowerFieldElem):
    field = tower.FanPaarTowerField(2)


def small4(a, b):
    """Independent schoolbook binary polynomial product modulo u^2+u+1."""
    product = 0
    for i in range(2):
        for j in range(2):
            product ^= (((a >> i) & 1) & ((b >> j) & 1)) << (i + j)
    return product ^ (7 if product & 4 else 0)


def small16(a, b):
    """Independent four-term quadratic product modulo v^2+u*v+1."""
    a0, a1, b0, b1 = a & 3, a >> 2, b & 3, b >> 2
    c0 = small4(a0, b0)
    c1 = small4(a0, b1) ^ small4(a1, b0)
    c2 = small4(a1, b1)
    return (c0 ^ c2) | ((c1 ^ small4(2, c2)) << 2)


def mle(values, x, y):
    p0 = values[0] ^ small16(values[0] ^ values[1], x)
    p1 = values[2] ^ small16(values[2] ^ values[3], x)
    return p0 ^ small16(p0 ^ p1, y)


A = [1, 1, 0, 1]
B = [0, 1, 1, 0]
C = [0, 1, 0, 0]


def original_sumcheck(r1, r2):
    composition = polynomial.Polynomial(E, 2, {(1, 1): E.one()})
    prover = sumcheck.Sumcheck(E, [[E(x) for x in A], [E(x) for x in B]], composition)
    claim = prover.sum()
    rounds = []
    for r in (E(r1), E(r2)):
        sent = prover.compute_round_polynomial()
        evaluations = [sent[0] + claim] + sent
        assert evaluations[0] + evaluations[1] == claim
        updated = prover.interpolate(evaluations, r)
        prover.receive_challenge(r)
        rounds.append({'sentAt1And2': [x.value for x in sent],
                       'evaluationsAt0And1And2': [x.value for x in evaluations],
                       'claimBefore': claim.value, 'challenge': r.value,
                       'claimAfter': updated.value,
                       'tablesAfter': [[x.value for x in row] for row in prover.multilinears]})
        claim = updated
    assert prover.query() == claim
    expected = small16(mle(A, r1, r2), mle(B, r1, r2))
    assert expected == claim.value
    return {'rounds': rounds, 'finalValue': claim.value,
            'finalMultilinears': [row[0].value for row in prover.multilinears]}


# Exhaust the small field and the honest two-round example only.
for a in range(16):
    for b in range(16):
        assert E.field.multiply(a, b) == small16(a, b)
        assert E.field.add(a, b) == a ^ b
for a in range(1, 16):
    assert small16(a, E(a).inverse().value) == 1
for r1 in range(16):
    for r2 in range(16):
        original_sumcheck(r1, r2)
first_modulus_values = [small4(x, x) ^ x ^ 1 for x in (0, 1)]
second_modulus_values = [small4(x, x) ^ small4(2, x) ^ 1 for x in range(4)]
assert all(first_modulus_values) and all(second_modulus_values)
roots = [x for x in range(16) if small16(x, x) ^ x == 0]
assert roots == [0, 1]
assert mle([1, 1, 0, 0], 2, 4) == 5
assert mle(C, 2, 4) == 10
try:
    E.zero().inverse()
    raise AssertionError('zero inverse should fail')
except ValueError:
    pass

# Model constructors are not a canonical external input parser.
assert E.from_int(11).value == 1 and E(11).value == 11
assert E.from_bytes(bytes([255])).value == 255
assert not E.field._is_valid(255)

def canonical4(data):
    if len(data) != 1 or data[0] >= 16:
        raise ValueError('one byte, only low four bits allowed')
    return E(data[0])

assert canonical4(bytes([11])).value == 11
for invalid in (b'', bytes([16]), bytes([255]), bytes([11, 0])):
    try:
        canonical4(invalid)
        raise AssertionError('noncanonical input should fail')
    except ValueError:
        pass

result = {'python': platform.python_version(), 'case': {'A': A, 'B': B,
          'xorWord': 11 ^ 6, 'andWord': 11 & 6, 'integerSum': 11 + 6,
          'fieldProduct': small16(11, 6), 'uSquared': small16(2, 2), 'vSquared': small16(4, 4)},
          'trace': original_sumcheck(2, 4), 'checks': {'allFieldProducts': 256,
          'allNonzeroInverses': 15, 'allHonestChallengePairs': 256,
          'firstModulusValues': first_modulus_values, 'secondModulusValues': second_modulus_values,
          'falseMessageDifferenceRoots': roots, 'falseDifferenceAtU': small16(2, 2) ^ 2,
          'errorTableEvaluation': 5, 'andTableMleAtUAndV': 10,
          'integerEmbedding11': 1, 'rawEncoding11': 11, 'invalidRawByte255': 255,
          'canonicalRejections': 4, 'zeroInverseRejected': True},
          'scopes': SCOPES,
          'notExecuted': ['complete model package/dependency suite', 'PCS commitment/opening',
                          'Fiat–Shamir transcript', 'Binius64/Flock prover or verifier',
                          'security proof or benchmark', 'zero-knowledge proof']}
print(json.dumps(result, indent=2))
