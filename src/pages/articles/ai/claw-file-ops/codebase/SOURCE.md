# Source provenance

- Snapshot: `2026-07-25`
- Origin: `/home/heru/code/claw-code/rust/crates/runtime/src/file_ops.rs`
- Copy: `file_ops.rs`
- Byte-identical commit: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`
- SHA-256: `c769fd0095eb41c37043d4ae9e0155e85a5d033370b72c3992311b35f0ff9ac7`
- Production wiring copy: `tools_file_wiring.rs`
- Production wiring origin: `/home/heru/code/claw-code/rust/crates/tools/src/lib.rs`
- Production wiring ranges: lines 1213-1232 and 2069-2100
- Production wiring SHA-256: `75435da35509cee6a04f9349486a896db360858b136370b24e88d949d259b59b`
- Policy: line numbers are preserved so the article's code panel can point to the implementation exactly.

## 본문 대응

- `read-contract`: lines 175-221, size/binary/UTF-8/line-window behavior
- `write-contract`: lines 224-255, parent creation and direct write semantics
- `edit-contract`: lines 258-296, read-match-write and stale overwrite risk
- `path-boundary`: lines 536-628, canonicalization, workspace prefix checks, and symlink helper
- `glob-contract`: lines 299-348, brace expansion, dedupe, mtime sort, and result cap
- `grep-contract`: lines 351-473, regex scan plus the complete WalkDir collection helper
- `production-wiring`: exact concatenation of `tools/src/lib.rs` lines 1213-1232 and 2069-2100

The snapshot is evidence for what the current code does. The article labels stronger
designs such as descriptor-relative `openat2`, atomic replace, and `fsync` as proposed
hardening, not as behavior already implemented here.
