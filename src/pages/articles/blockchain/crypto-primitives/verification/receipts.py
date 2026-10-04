"""Teaching fixtures, not a cryptographic library or a production protocol.

Run: python3 receipts.py
The Ed25519 seed below is public RFC 8032 test data, never a private key.
"""
import hashlib
import json
import platform
import runpy
from collections import Counter
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
RFC = BASE / "codebase/rfc8032-section6.py"
reference = runpy.run_path(str(RFC))


def hash256(value):
    return hashlib.sha256(value).digest()


def receipt(account, amount):
    return account.encode("ascii") + amount.to_bytes(4, "big")


def leaf(record):
    return hash256(b"\x00" + record)


def node(left, right):
    return hash256(b"\x01" + left + right)


def message(batch, root):
    return b"receipts-v1" + batch.to_bytes(4, "big") + root


def challenge(R, P, msg):
    transcript = b"toy-schnorr-v1" + bytes([R, P]) + msg
    return int.from_bytes(hash256(transcript), "big") % 11


def strict_length_verify(public, msg, signature):
    """Only adds the missing length rejection; not a complete hardened API."""
    if len(public) != 32 or len(signature) != 64:
        return False
    return reference["verify"](public, msg, signature)


def authorize(public, msg, signature, expected_public, expected_message):
    """An explicit example policy: the expected key and batch come from outside."""
    return (public == expected_public and msg == expected_message
            and strict_length_verify(public, msg, signature))


def teaching_round(pair, full=True):
    a, b = (pair[0] + 1) % 17, (pair[1] + 2) % 17
    a, b = pow(a, 3, 17), pow(b, 3, 17) if full else b
    return ((a + 2*b) % 17, (3*a + 4*b) % 17)


records = [receipt(a, v) for a, v in zip("ABCD", (40, 70, 20, 90))]
leaves = [leaf(record) for record in records]
left, right = node(*leaves[:2]), node(*leaves[2:])
root = node(left, right)
proof = [leaves[3], left]
reconstructed = node(proof[1], node(leaves[2], proof[0]))
msg = message(1, root)
assert reconstructed == root and len(msg) == 47
assert root.hex() == "24239f9760532472a8a9be49f76a9fe959ac9b42e17ad3bd8c9a0893f4442002"
assert node(node(leaves[2], proof[0]), proof[1]) != root
guesses = [v for v in range(100) if leaf(receipt("C", v)) == leaves[2]]
assert guesses == [20]

# Distinct empty slots and present zero-valued records in a fixed four-slot map.
empty = hash256(b"\x02")
sparse_root = node(left, node(empty, leaves[3]))
present_zero_root = node(left, node(leaf(receipt("C", 0)), leaves[3]))
assert sparse_root != present_zero_root

P, R = pow(2, 3, 23), pow(2, 7, 23)
e1, e2 = challenge(R, P, msg), challenge(R, P, message(2, root))
s1, s2 = (7 + e1*3) % 11, (7 + e2*3) % 11
assert (P, R, e1, e2, s1, s2) == (8, 13, 9, 5, 1, 0)
assert pow(2, s1, 23) == R * pow(P, e1, 23) % 23 == 2
assert pow(2, s2, 23) == R * pow(P, e2, 23) % 23 == 1
recovered = (s1-s2) * pow((e1-e2) % 11, -1, 11) % 11
assert recovered == 3
assert pow(2, s1, 23) != R * pow(P, e2, 23) % 23

# Entire tiny state space checked; bijectivity is not a security claim.
permutations = {}
for full in (True, False):
    outputs = [teaching_round((a, b), full) for a in range(17) for b in range(17)]
    fibers = Counter(a for a, _ in outputs)
    assert len(set(outputs)) == 289 and set(fibers.values()) == {17}
    permutations[str(full)] = {"uniqueOutputs": len(set(outputs)), "eachFirstCoordinatePreimages": 17}
assert teaching_round((3, 4), True) == (3, 2)
assert teaching_round((3, 4), False) == (8, 12)
assert (3 + 2*4) % 19 == (5 + 2*3) % 19 == 11
assert all(len({(v + 2*r) % 19 for r in range(19)}) == 19 for v in range(19))

seed = bytes.fromhex("9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60")
expected_public = bytes.fromhex("d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a")
expected_empty = bytes.fromhex("e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b")
public = reference["secret_to_public"](seed)
assert public == expected_public
assert reference["sign"](seed, b"") == expected_empty
assert reference["verify"](public, b"", expected_empty)
signature = reference["sign"](seed, msg)
assert strict_length_verify(public, msg, signature)
assert not strict_length_verify(public, message(2, root), signature)
S = int.from_bytes(signature[32:], "little")
assert not strict_length_verify(public, msg, signature[:32] + (S + reference["q"]).to_bytes(32, "little"))
published_accepts_65 = reference["verify"](public, msg, signature + b"\x00")
assert published_accepts_65 and not strict_length_verify(public, msg, signature + b"\x00")
identity = b"\x01" + b"\x00" * 31
identity_signature = identity + b"\x00" * 32
assert strict_length_verify(identity, msg, identity_signature)
assert strict_length_verify(identity, b"a different message", identity_signature)
assert not authorize(identity, msg, identity_signature, public, msg)
assert authorize(public, msg, signature, public, msg)
assert not authorize(public, msg, signature, public, message(2, root))
a, prefix = reference["secret_expand"](seed)
r = reference["sha512_modq"](prefix + msg)
h = reference["sha512_modq"](signature[:32] + public + msg)
assert (r + h*a) % reference["q"] == S

result = {
    "runtime": platform.python_version(), "status": "PASS",
    "sourceSHA256": hashlib.sha256(RFC.read_bytes()).hexdigest(),
    "root": root.hex(), "recordC": records[2].hex(), "leafC": leaves[2].hex(),
    "proofC": [v.hex() for v in proof], "proofBytes": sum(map(len, proof)),
    "message": msg.hex(), "messageBytes": len(msg), "dictionaryMatches": guesses,
    "sparse": {"emptyRoot": sparse_root.hex(), "zeroRoot": present_zero_root.hex()},
    "schnorr": {"P": P, "R": R, "e1": e1, "e2": e2, "s1": s1, "s2": s2, "recovered": recovered},
    "permutations": permutations,
    "ed25519": {"officialEmptyVector": True, "public": public.hex(), "signature": signature.hex(),
        "scalarA": str(a), "nonceRScalar": str(r), "challengeH": str(h), "responseS": str(S),
        "RBytes": signature[:32].hex(), "SBytes": signature[32:].hex(),
        "publishedAccepts65Bytes": published_accepts_65, "lengthWrapperRejects65": True,
        "identityEquationAccepts": True, "externalKeyPolicyRejectsIdentity": True,
        "wrongBatchRejected": True, "SplusOrderRejected": True},
    "scope": "Original RFC illustration plus explicit length/key policy wrappers; not constant-time, production validation, BIP340, or actual Poseidon."
}
print(json.dumps(result, indent=2))
