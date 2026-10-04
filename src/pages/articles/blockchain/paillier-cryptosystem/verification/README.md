# Paillier: same 4 and 3 through retained original Python code

Run from the repository root with CPython 3.12:

```sh
python3.12 src/pages/articles/blockchain/paillier-cryptosystem/verification/trace.py
```

Observed runtime: **CPython 3.12.13**, `phe` **1.5.0**, optional GMP and Crypto
modules absent. `observed-python-3.12.13.json` preserves the actual output.

The harness imports retained, unchanged core modules from `../codebase/phe`.
Their upstream commit is
`data61/python-paillier@7d9911eb03c3c2d64399bc15405feb5e628379d1`.
`../codebase/PROVENANCE.json` records original Git blob hashes and SHA-256
values. The original GPL license is retained in `../codebase/LICENSE.txt`.
The harness and independent integer model are written for this article and
are not upstream code.

## Checks actually executed

- All 15 messages and eight unit randomizers under `n=15`, compared with an
  independent integer model, the lambda decryption formula and original CRT
  decryption: 120 pairs and 120 distinct ciphertexts.
- `4, r=2` produces 173; `3, r=4` produces 154. Their product modulo 225 is
  92; raw decryption returns 7. The signed decoder raises `OverflowError`
  because the tiny key's `max_int` is 4.
- Public scalar multiplication, randomizer reuse, public addition of 1,
  re-randomization, raw invalid-input behavior, and ten separate canonical
  input rejections. Those separate checks assume the known-valid fixed key.
- A getter returning the fixed number 7 is deliberately substituted to
  inspect the `r_value=0` fallback and lazy obfuscation paths. This is a
  dispatch test, not a production random-generator test.
- Four encrypted values of 4 have integer sum 16, but wrap to residue 1;
  the signed decoder silently returns 1.
- A separate stated tiny key `n=323` encodes 1.5 and 0.25 with public
  exponent -1, integer coefficients 24 and 4, and sum 1.75.
- The separate key `p=3,q=7,n=21` has no lambda inverse modulo 21, yet all
  252 valid message/randomizer pairs decrypt under the original CRT path.
  Its 12 unit randomizers produce only four distinct encryptions of zero.
  CRT round-trip correctness is distinct from the selected lambda/bijection
  key profile.

## Limits

The original full package test suite, CLI, large random key generation,
production RNG entropy, constant-time behavior, performance, full security,
chosen-ciphertext protocols, threshold decryption and range proofs were not
executed or audited. Tiny keys and fixed randomizers serve arithmetic
inspection only. Loading these core modules is not a claim that every
upstream dependency or feature was exercised.
