# Poseidon case verification

Source: HorizenLabs/poseidon2 commit `055bde3f4782731ba5f5ce5888a440a94327eaf3`, original package `zkhash 0.2.0`. The unchanged files and licenses are listed with SHA-256 in `../codebase/manifest.json`.

## Reproduce

From this directory:

```sh
CARGO_TARGET_DIR=/tmp/teach-poseidon-target cargo run --locked > native.jsonl
python3 trace.py native.jsonl > trace.json
```

Observed with Rust 1.93.0 and Python 3.9.6. Cargo.lock pins actual ark-ff 0.4.2 and other dependencies. The selected original modules compile unchanged. This separate harness is not the complete upstream zkhash package or its full feature/test matrix. The upstream MontConfig derive emits a non-local-definition warning with this compiler; no original source was modified to suppress it.

`observed-rust-1.93.0.jsonl` records five native fixtures, original optimized/unoptimized equality and both variant outputs. Both native compression calls are asserted for [3,4]. The retained locked run was byte-identical to the first successful run.

`observed-python-3.9.6.json` records a separately written naive model, all three coordinates versus native outputs, both original [0,1,2] known-answer vectors, full round states, and exhaustive 289-state toy checks. The direct nonlinear R1CS count is a model calculation, not a compiled circuit measurement. Neither program generates a zero-knowledge proof or measures security, timing, memory, or constant-time behavior. No attack was run against a deployed service.

The toy F17 example and the BN254 scalar-field profile are distinct. The source uses RF=8/RP=56; the 2021 paper's table example with RP=57 is not the profile executed here.
