"""Independent integer arithmetic for the article, not a crypto implementation.

Usage: python3 trace.py /tmp/teach-all/hash-compact-native.jsonl
The optional argument compares an actual separately compiled Rust run.
"""
import hashlib
import hmac
import json
import math
import platform
import re
import struct
import sys
import unicodedata
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
constants = (BASE / "codebase/sha2-consts.rs").read_text()
K = [int(x, 16) for x in re.findall(r"0x[0-9a-f]+", constants.split("static K32:")[1].split("];", 1)[0])]
IV = [int(x, 16) for x in re.findall(r"0x[0-9a-f]+", constants.split("const H256_256:")[1].split("];", 1)[0])]
MASK = (1 << 32) - 1


def rotate(x, n):
    return ((x >> n) | (x << (32-n))) & MASK


def sha_padding(length):
    return b"\x80" + b"\x00" * ((55-length) % 64) + (8*length).to_bytes(8, "big")


def compress(state, block):
    words = list(struct.unpack(">16I", block))
    for i in range(16, 64):
        x, y = words[i-15], words[i-2]
        sigma0 = rotate(x, 7) ^ rotate(x, 18) ^ (x >> 3)
        sigma1 = rotate(y, 17) ^ rotate(y, 19) ^ (y >> 10)
        words.append((words[i-16]+sigma0+words[i-7]+sigma1) & MASK)
    a, b, c, d, e, f, g, h = state
    rounds = []
    for i, word in enumerate(words):
        S1 = rotate(e, 6) ^ rotate(e, 11) ^ rotate(e, 25)
        ch = (e & f) ^ ((~e) & g)
        t1 = (h+S1+ch+K[i]+word) & MASK
        S0 = rotate(a, 2) ^ rotate(a, 13) ^ rotate(a, 22)
        majority = (a & b) ^ (a & c) ^ (b & c)
        t2 = (S0+majority) & MASK
        a, b, c, d, e, f, g, h = ((t1+t2) & MASK, a, b, c, (d+t1) & MASK, e, f, g)
        rounds.append({"round": i, "W": f"{word:08x}", "T1": f"{t1:08x}", "T2": f"{t2:08x}",
                       "state": [f"{x:08x}" for x in (a,b,c,d,e,f,g,h)]})
    final = [(x+y) & MASK for x, y in zip(state, (a,b,c,d,e,f,g,h))]
    return final, rounds


def digest_from(message, state=None, prior_length=0):
    assert prior_length % 64 == 0
    state = list(IV if state is None else state)
    data = message + sha_padding(prior_length+len(message))
    trace = []
    for i in range(0, len(data), 64):
        state, rounds = compress(state, data[i:i+64])
        trace.append(rounds)
    return struct.pack(">8I", *state), trace


msg = b"abc"
digest, trace = digest_from(msg)
assert digest == hashlib.sha256(msg).digest()
assert trace[0][0]["T1"] == "54da50e8" and trace[0][0]["T2"] == "08909ae5"
assert trace[0][0]["state"][0] == "5d6aebcd"
assert trace[0][0]["state"][4] == "fa2a4622"
messages = [b"", b"abc"] + [b"a"*n for n in (55,56,63,64,65,128)]
fixture_results = []
for value in messages:
    actual, _ = digest_from(value)
    expected = hashlib.sha256(value).digest()
    assert actual == expected
    fixture_results.append({"messageBytes": len(value), "paddedBlocks": (len(value)+len(sha_padding(len(value))))//64,
                            "digest": actual.hex()})
stream = hashlib.sha256()
stream.update(b"a")
stream.update(b"bc")
assert stream.digest() == digest
assert hashlib.sha256(b"a").digest()+hashlib.sha256(b"bc").digest() != digest

# A simulated verifier with a public demonstration key; no external system.
key = b"key!"
original = hashlib.sha256(key+msg).digest()
glue = sha_padding(len(key)+len(msg))
extra = b"!"
forged_message = msg+glue+extra
continuation, _ = digest_from(extra, struct.unpack(">8I", original), len(key)+len(msg)+len(glue))
assert continuation == hashlib.sha256(key+forged_message).digest()
assert continuation != hashlib.sha256(key+msg+extra).digest()
# The padded old message can be a prefix of the padded new one. SHA padding
# is not a prefix-free encoding of arbitrary byte messages.
assert (key+forged_message+sha_padding(len(key)+len(forged_message))).startswith(key+msg+glue)
assert hmac.digest(key, msg, "sha256") != hmac.digest(key, forged_message, "sha256")
hmac_continuation, _ = digest_from(extra, struct.unpack(">8I", hmac.digest(key, msg, "sha256")), 128)
assert hmac_continuation != hmac.digest(key, forged_message, "sha256")

# Byte-aligned SHA3-256 padding, before any Keccak permutation.
sha3_block = bytearray(136)
sha3_block[:3] = msg
sha3_block[3] ^= 0x06
sha3_block[-1] ^= 0x80
first_lane = int.from_bytes(sha3_block[:8], "little")
last_lane = int.from_bytes(sha3_block[-8:], "little")
assert first_lane == 0x0000000006636261 and last_lane == 0x8000000000000000
shake_short = hashlib.shake_128(msg).digest(32)
shake_long = hashlib.shake_128(msg).digest(64)
assert shake_long[:32] == shake_short
assert hashlib.sha3_256(msg).digest() != shake_short

# Own FIPS 202 arithmetic model: not the upstream keccak implementation.
MASK64 = (1 << 64)-1

def rol64(value, count):
    count %= 64
    return ((value << count) | (value >> ((64-count) % 64))) & MASK64


def keccak_round_constants():
    lfsr, constants = 1, []
    for _ in range(24):
        rc = 0
        for j in range(7):
            if lfsr & 1:
                rc ^= 1 << ((1 << j)-1)
            lfsr = ((lfsr << 1) ^ (0x71 if lfsr & 0x80 else 0)) & 0xff
        constants.append(rc)
    assert constants[:3] == [0x1, 0x8082, 0x800000000000808a]
    return constants


def keccak_f(state, collect=False):
    state = list(state)
    offsets = [0]*25
    x, y = 1, 0
    for t in range(24):
        offsets[x+5*y] = ((t+1)*(t+2)//2) % 64
        x, y = y, (2*x+3*y) % 5
    rounds = []
    for index, rc in enumerate(keccak_round_constants()):
        columns = [state[x] ^ state[x+5] ^ state[x+10] ^ state[x+15] ^ state[x+20] for x in range(5)]
        delta = [columns[(x-1) % 5] ^ rol64(columns[(x+1) % 5], 1) for x in range(5)]
        state = [value ^ delta[i % 5] for i, value in enumerate(state)]
        theta0 = state[0]
        rotated = [rol64(value, offsets[i]) for i, value in enumerate(state)]
        rho0 = rotated[0]
        moved = [0]*25
        for y in range(5):
            for x in range(5):
                moved[y+5*((2*x+3*y) % 5)] = rotated[x+5*y]
        pi0 = moved[0]
        state = [moved[x+5*y] ^ ((~moved[(x+1) % 5+5*y]) & moved[(x+2) % 5+5*y])
                 for y in range(5) for x in range(5)]
        chi0 = state[0]
        state[0] ^= rc
        if collect:
            rounds.append({"round": index, "thetaLane0": f"{theta0:016x}",
                           "rhoLane0": f"{rho0:016x}", "piLane0": f"{pi0:016x}",
                           "chiLane0": f"{chi0:016x}", "iotaLane0": f"{state[0]:016x}"})
    return state, rounds


def sponge(message, rate, suffix, output_bytes, collect=False):
    # These suffixes use fewer than eight bits, so the byte-boundary path suffices.
    padded = bytearray(message)
    padded.append(suffix)
    padded.extend(b"\0"*((-len(padded)) % rate))
    padded[-1] ^= 0x80
    state, first_trace = [0]*25, []
    for offset in range(0, len(padded), rate):
        block = padded[offset:offset+rate]
        for i in range(rate//8):
            state[i] ^= int.from_bytes(block[8*i:8*i+8], "little")
        state, trace = keccak_f(state, collect and offset == 0)
        if trace:
            first_trace = trace
    output = bytearray()
    while len(output) < output_bytes:
        output.extend(b"".join(value.to_bytes(8, "little") for value in state[:rate//8]))
        if len(output) < output_bytes:
            state, _ = keccak_f(state)
    return bytes(output[:output_bytes]), first_trace


permutation_fixtures = []
for value in [b"", msg, b"a"*135, b"a"*136, b"a"*137]:
    own, _ = sponge(value, 136, 0x06, 32)
    assert own == hashlib.sha3_256(value).digest()
    for output_bytes in (32, 200):
        own_shake, _ = sponge(value, 168, 0x1f, output_bytes)
        assert own_shake == hashlib.shake_128(value).digest(output_bytes)
    permutation_fixtures.append({"bytes": len(value), "sha3": own.hex(), "shakeOutputs": [32, 200]})
sha3_model, keccak_trace = sponge(msg, 136, 0x06, 32, True)
keccak256_model, _ = sponge(msg, 136, 0x01, 32)
assert sha3_model == hashlib.sha3_256(msg).digest()
assert keccak256_model != sha3_model

tuple_one = b"\x01\x02ab\x02\x01c"
tuple_two = b"\x01\x01a\x02\x02bc"
assert tuple_one != tuple_two and b"ab"+b"c" == b"a"+b"bc"
composed, decomposed = "\u00e9", "e\u0301"
assert composed.encode() != decomposed.encode()
assert unicodedata.normalize("NFC", composed) == unicodedata.normalize("NFC", decomposed)

seen, collision = {}, None
for i in range(10000):
    candidate = f"trial:{i}".encode()
    first_byte = hashlib.sha256(candidate).digest()[0]
    if first_byte in seen:
        collision = [seen[first_byte], candidate.decode(), f"{first_byte:02x}", i+1]
        break
    seen[first_byte] = candidate.decode()
assert collision == ["trial:7", "trial:11", "24", 12]
for i in range(10000):
    candidate = f"target:{i}".encode()
    if hashlib.sha256(candidate).digest()[0] == digest[0]:
        target = [candidate.decode(), f"{digest[0]:02x}", i+1]
        break
assert target == ["target:265", "ba", 266]

native_matches = None
if len(sys.argv) > 1:
    native = [json.loads(line) for line in Path(sys.argv[1]).read_text().splitlines()]
    for expected, actual in zip(fixture_results, native[:8]):
        assert all(actual[k] == v for k, v in expected.items())
    assert len(native) == 9 and native[-1]["firstLane"] == f"{first_lane:016x}"
    assert native[-1]["lastRateLane"] == f"{last_lane:016x}"
    native_matches = True

result = {"runtime": platform.python_version(), "status": "PASS", "message": msg.hex(),
          "padding": (msg+sha_padding(len(msg))).hex(), "rounds": trace[0], "sha256": digest.hex(),
          "fixtures": fixture_results, "nativeMatches": native_matches,
          "lengthExtension": {"key": key.hex(), "oldTag": original.hex(), "glueBytes": len(glue),
                              "modifiedMessageBytes": len(forged_message), "continuedTag": continuation.hex(),
                              "verifierMatches": True, "naiveAppendDifferent": True, "HMACComparisonDifferent": True,
                              "scope": "Public test key and local simulated verifier; generic secret-length/state condition."},
          "sha3": {"firstLane": f"{first_lane:016x}", "lastRateLane": f"{last_lane:016x}",
                   "digest": hashlib.sha3_256(msg).hexdigest(), "shake128First32": shake_short.hex(),
                   "shakePrefixRelation": True, "permutationExecutedByThisModel": True,
                   "permutationScope": "Own FIPS 202 model; not RustCrypto keccak crate",
                   "permutationFixtures": permutation_fixtures, "keccak256Model": keccak256_model.hex(),
                   "firstAbsorbRounds": keccak_trace},
          "probability": {"collision16Outputs5Samples": 1-math.prod((16-i)/16 for i in range(5)),
                          "fixedTarget16Outputs5Samples": 1-(15/16)**5},
          "eightBitFixtures": {"collision": collision, "fixedABC": target},
          "tupleEncoding": [tuple_one.hex(), tuple_two.hex()],
          "unicode": [composed.encode().hex(), decomposed.encode().hex()]}
print(json.dumps(result, indent=2))
