# Claw hooks source evidence

These files were copied byte-for-byte from `/home/heru/code/claw-code`. They are a
cross-commit evidence bundle, not a checkout of one coherent repository commit.

| Vendored file | Upstream path | Byte-identical commit |
| --- | --- | --- |
| `hooks.rs` | `rust/crates/runtime/src/hooks.rs` | `e874bc6a4467158d91d644783c497c8eca472874` |
| `conversation.rs` | `rust/crates/runtime/src/conversation.rs` | `257aeb82ddbc336acc30ef649d0f15922c25c2c9` |
| `config.rs` | `rust/crates/runtime/src/config.rs` | `bc259ec6f985b12b0ef73ada44d08c0290cb9432` |
| `permissions.rs` | `rust/crates/runtime/src/permissions.rs` | `22ad54c08e54abaef2b2c50136e588e09d6c5978` |
| `plugins.rs` | `rust/crates/plugins/src/lib.rs` | `f91d156f855d760564889e9d5312490717674fc9` |
| `cli_main.rs` | `rust/crates/rusty-claude-cli/src/main.rs` | `d074d1c046ea2dda8f151a31e19ddfa0f7e96387` |

`CodeSidebar` uses this bundle for line-level evidence. Cross-file behavior claims are
checked against the current repository separately because these six files did not come
from one common commit. Article prose distinguishes implementation from recommended
hardening.
