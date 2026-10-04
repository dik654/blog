# Same `abc` fixture

Run from this directory:

```sh
rustc --edition=2024 compact-main.rs -o /tmp/teach-hash-compact
/tmp/teach-hash-compact > /tmp/teach-hash-native.jsonl
python3 trace.py /tmp/teach-hash-native.jsonl
```

Observed environment: rustc 1.93.0 (254b59607 2026-01-19), Python 3.9.6.
The retained observations are `observed-rust-1.93.0.jsonl` and
`observed-python-3.9.6.json`.

The `codebase` files are byte-preserved RustCrypto sources at commit
`f6c786d72ed4d37a32dcd32daa2e7277dd4683e1`; the manifest records SHA-256 and
upstream paths. Package licenses are retained separately.

- Native `compact-main.rs` includes the unchanged SHA-256 compact function
  and constants. Its padding, caller, and source-module wrapper are local.
  It compares processing all blocks together with processing them separately.
- Native SHA-3 checking includes the unchanged `pad` and `read_state` functions,
  using explicit local type adapters. It does **not** execute the upstream
  sponge cursor, `keccak` dependency, or whole `sha3` API.
- `trace.py` uses an independent 64-word schedule and a separate FIPS 202
  lane/permutation/sponge model, comparing outputs with `hashlib`.
  SHAKE's 200-byte output also crosses the first squeeze block.
- Length extension uses only a local simulated verifier and a public example
  key. Eight-bit collision fixtures compare only the first SHA-256 byte.
- These checks do not build the full Cargo dependency graph or CPU dispatch,
  audit constant-time behavior, prove security, or measure performance.
