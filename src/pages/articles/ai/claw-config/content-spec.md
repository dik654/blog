# Claw Config content spec

## Learning contract

- Target question: five files disagree on `model` and permission. Compute the final typed values, retain the origin of MCP entries, and identify which other keys lose per-key provenance.
- Source revision: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`.
- Required sources:
  - `rust/crates/runtime/src/config.rs`
  - `rust/crates/runtime/src/bootstrap.rs`
  - `rust/crates/runtime/src/oauth.rs`
  - `rust/crates/runtime/src/remote.rs`
  - `rust/crates/rusty-claude-cli/src/main.rs`

## Causal order

1. Discover the five concrete file paths.
2. Distinguish missing, invalid legacy, and invalid current files.
3. Validate each current file before merging.
4. Merge scoped MCP entries and generic JSON.
5. Project merged JSON into runtime feature types.
6. Compare direct loader, helper lookup, and full runtime failure behavior.
7. Trace the CLI's actual config/plugin/MCP/policy/provider runtime build.
8. Separate the bootstrap phase inventory from an executor.
9. Bound OAuth and remote claims to helpers present in source.

## Source-backed claims

- `ConfigSource` has `User`, `Project`, and `Local`, but discovery produces five files.
- Object/object recursively merges. All other value pairs replace with the later value.
- General keys retain only the merged value and loaded-file list, not per-key
  provenance. MCP is the scope-aware exception.
- The later MCP server of the same name replaces the prior scoped entry.
- A raw JSON `env` object participates in deep merge but is not a typed process
  environment or provider credential channel.
- Permission aliases normalize to three `ResolvedPermissionMode` values.
- Malformed-current behavior is caller-dependent: a direct/full runtime load
  fails, some lookup helpers discard the error with `.ok()?`, and permission
  resolution can reach `DangerFullAccess`.
- The CLI builds config, plugin registry/hooks, MCP/tools, permission policy,
  provider client, and executor before a turn; the runtime is rebuilt per turn.
- `BootstrapPlan` stores an ordered, deduplicated phase list. It does not execute phases.
- OAuth code builds and parses protocol values and persists an `oauth` JSON key. It does not prove a browser launcher or callback server.
- Upstream proxy activation requires remote, proxy flag, session ID, and token. Missing inputs disable the proxy.

## Explicit non-claims

- No `/etc/claw/config.json` layer.
- No generic `CLAW_MODEL` or provider environment override in `config.rs`.
- A key placed only under raw JSON `env` is not proven to become an OS
  environment variable or provider credential.
- No general per-key provenance map.
- No universal fail-closed behavior for every config helper.
- No measured bootstrap timing or MCP bottleneck.
- No complete OAuth UI, automatic refresh loop, keychain, or file-mode guarantee.
- No remote terminal-control protocol in `remote.rs`.

## Viz contract

- One responsive DOM lab, no fixed-width SVG.
- Four scenarios: all files, no local, invalid current, invalid legacy.
- Controls must visibly change file state and final output.
- The lab must label `env` as raw merged JSON and must not imply that it mutates
  process environment.
- At 390 px, the document and the lab must have zero horizontal overflow.

## Verification questions

1. Why does raw JSON `env` retain four keys while `model` becomes only `opus`?
2. Which source information remains for `model`, and why is MCP different?
3. Why can a malformed current file fail a full runtime build yet disappear in
   a helper lookup?
4. Under which path can permission resolution fall back to
   `DangerFullAccess`?
5. What is rebuilt before each CLI turn?
6. What can and cannot be inferred from the 12 bootstrap phases?
7. What four conditions enable upstream proxy state?
