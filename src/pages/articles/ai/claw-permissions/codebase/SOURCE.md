# Source provenance

These files were copied verbatim from `/home/heru/code/claw-code` and rechecked
against repository commit `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`.

| Vendored file | Upstream path | SHA-256 |
| --- | --- | --- |
| `permissions.rs` | `rust/crates/runtime/src/permissions.rs` | `6aa0ca2b2b95adb80d63349000b39454b09fec4478cc27ac035af193432cc14c` |
| `permission_enforcer.rs` | `rust/crates/runtime/src/permission_enforcer.rs` | `3c4ba5a153206aae2687472e844dbc74aa7cb754c087293f9a2fd0b58eb6fa52` |

Line-level annotations use these exact files. Cross-module call-graph claims are checked
against the same pinned repository revision.

`permission_wiring.rs` is the exact concatenation of:

- `rust/crates/runtime/src/conversation.rs` lines 400-453
- `rust/crates/tools/src/lib.rs` lines 342-355
- `rust/crates/tools/src/lib.rs` lines 1196-1204

It makes the direct conversation policy call, registry optional enforcer, and
enforcer-free public helper independently inspectable.

SHA-256: `f6206859be72214591ace4191f7956a3c3b040a08a09b71aafd28cce8ecafd7a`
