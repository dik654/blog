# Source provenance

- Repository snapshot: `/home/heru/code/claw-code`
- Snapshot date: 2026-07-26
- Byte-identical commit: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`
- `bash.rs`: `rust/crates/runtime/src/bash.rs`
- `bash_validation.rs`: `rust/crates/runtime/src/bash_validation.rs`
- `sandbox.rs`: `rust/crates/runtime/src/sandbox.rs`
- `tools_bash_wiring.rs`: exact excerpts from `rust/crates/tools/src/lib.rs`
  - source lines 1181-1232
  - source lines 1311-1331
  - source lines 1848-1921
  - source lines 1923-1969

These are verbatim snapshots used to separate code that exists from code that is
actually wired into the production execution path.

| Vendored file | SHA-256 |
| --- | --- |
| `bash.rs` | `1d24ba4d7523cf486c245ac14414971ab416882b41147e3b9320c52be6332b65` |
| `bash_validation.rs` | `5d7022adc8b4401dc6d807570849750ee653da3372881a507e27edfdf797f603` |
| `sandbox.rs` | `02afd49a0b3b0389c44b84abe0f7242e2bb9f38464960638a3a58af4eaba0d1a` |
| `tools_bash_wiring.rs` | `1a6ec1aa62818a144cae7cd29bdebabeaeea1edaae9a0705c2481cb3a9b25dd7` |

`tools_bash_wiring.rs` is the byte-for-byte concatenation of the four pinned
upstream ranges above. It keeps the first screen's classify, optional-enforcer,
preflight call, and preflight decision claims inspectable without bundling the
unrelated 9,000-line tool registry.
