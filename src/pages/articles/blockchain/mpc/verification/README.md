# MPC: retained original code and the same three inputs

Run from the repository root with CPython 3.12:

```sh
python3.12 src/pages/articles/blockchain/mpc/verification/trace.py
python3.12 src/pages/articles/blockchain/mpc/verification/run_parties.py
```

Observed version: **CPython 3.12.13**, **MPyC 0.11.2**, commit
`38f06a7af688231fca4defe1613d01a2aa8bcbfb`.
The original package modules are retained unchanged under `../codebase/mpyc`.
`../codebase/PROVENANCE.json` records original Git blobs and SHA-256 values;
the original MIT license is retained. No package installation is required.

## Two distinct executions

`trace.py` imports the original `random_split` and `recombine` functions. It
controls one random draw at a time to reproduce the displayed slopes. The
field's unsigned interpretation is explicitly matched to `SecFld(67)`.
It compares the source functions with separate integer expressions for:

- Input shares `[6,8,10]`, `[8,13,18]`, `[8,11,14]`.
- Sum shares `[14,21,28]` and degree-two product shares `[45,30,57]`.
- The incorrect two-point reconstruction 60 and correct constant 35.
- Re-sharing rows `[[49,53,57],[36,42,48],[65,6,14]]`, weights `[3,64,1]`
  modulo 67, and new degree-one shares `[37,39,41]`.
- All three pairs of new shares reconstruct 35.
- A deliberately false first re-sharing changes the result to 38. This is
  an arithmetic model, not an attack injected into the runtime network.
- 4,489 evaluations of the one-share marginal distribution, repeated-slope
  leakage, and 67 possible new slopes when one fresh coefficient varies.
- A separate honest DKG analogy: key 12, shares `[22,32,42]`, generator 16
  of order 67 modulo 269, public key 142, and one invalid share relation.

`run_parties.py` starts **three actual local processes** and sends each a
separate stdin value: 4, 3, or 5. Each calls the unchanged MPyC runtime with
`m=3`, `t=1`, `SecFld(67)`, computes `(x+y)*z`, and receives 35 from `output`.
The original random generator is not patched in this run and internal
shares are not printed. The displayed fixed slopes are not claimed to be
the random shares used by these processes.

Ports 24670–24672 on localhost are used. SSL, PRSS, NumPy, GMP and uvloop
are disabled for this documented execution. This local plaintext transport
is not a test of secure transport or independent administrative parties.
The harness that starts all parties necessarily knows this public test
fixture; it does not simulate a deployment with independently held secrets.

Actual observations are retained in `observed-arithmetic-python-3.12.13.json`
and `observed-parties-python-3.12.13.json`.

## Other original source and limits

The separate `../codebase/tss-lib` contains selected whole files, license and
provenance from `bnb-chain/tss-lib@3f677ff761fcf692edb0243a5d812930844d879a`.
Its VSS, keygen and transport requirements were read, **not compiled or run**.
The tiny multiplicative-group analogy is not the Go elliptic-curve protocol.

The complete upstream test suite, malicious network parties, crash/restart,
dropout, remote authenticated transport, real DKG/signing, performance and
full security proofs or audits were not executed. One-share uniformity is
not a proof of the entire joint transcript distribution. Public test inputs
and known slopes do not constitute a secrecy experiment.
