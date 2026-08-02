# Claw CLI content specification

## Target question

With no positional arguments, why does one invocation open a REPL while another
turns piped stdin into a one-shot prompt?

## Pinned source

- revision: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`
- `rust/crates/rusty-claude-cli/src/main.rs`
- `rust/crates/rusty-claude-cli/src/input.rs`
- `rust/crates/commands/src/lib.rs`
- `rust/crates/rusty-claude-cli/src/render.rs`
- `rust/crates/rusty-claude-cli/src/init.rs`

## Required causal order

1. Process launch and manual `parse_args`.
2. TTY versus non-TTY line input.
3. Slash command enum parsing and REPL match dispatch.
4. Markdown event rendering and streaming buffer safety.
5. Repository detection, convergent init artifacts, and partial-write boundaries.
6. Per-turn config, plugin, MCP, policy, provider, and executor rebuild.

## Required exact facts

- `main` is synchronous and calls `run`.
- `parse_args` uses an index, while loop, and string match, not clap derive.
- No args plus non-empty piped stdin becomes Prompt; TTY becomes Repl.
- rustyline uses list completion and Emacs mode.
- Ctrl-J and Shift-Enter insert newlines.
- Ctrl-C with text is Cancel; empty is Exit; EOF is Exit.
- SlashCommand is an enum parsed from specs and handled by match.
- `handle_repl_command` returns whether the changed session should be persisted, not whether the REPL should exit.
- REPL exit is decided by literal `/exit` or `/quit` checks and `ReadOutcome::Exit`.
- TerminalRenderer uses pulldown-cmark, crossterm, and syntect.
- MarkdownStreamState retains an unsafe suffix and flushes it at stream end.
- init handles `.claw/`, `.claw.json`, `.gitignore`, and `CLAUDE.md`.
- Existing `.claw.json` and `CLAUDE.md` are not overwritten.
- Fresh init writes `permissions.defaultMode=dontAsk`, which typed config
  normalizes to `DangerFullAccess`.
- Artifact writes are sequential and non-transactional; an error can leave a
  partial initialized state.
- `LiveCli::run_turn` rebuilds the runtime from a cloned session and replaces
  the old runtime only after success.

## Forbidden claims

- `CliArgs` clap derive drives launch parsing.
- `main` is annotated with `tokio::main`.
- Slash commands are async trait objects in a global registry.
- `.claw/slash-commands/` is a custom command source.
- triple backticks are the LineEditor submit delimiter.
- render.rs contains a `NO_COLOR` or terminal-capability negotiation layer.
- init always rewrites CLAUDE.md from current project detection.
- init is an atomic transaction with rollback.
- `dontAsk` is a restricted non-interactive permission mode.

## Visual contract

The interactive lab must compare at least:

- no args on TTY
- piped prompt
- `-p`
- `/model opus`
- Ctrl-C with and without input
- repeated init
- fresh init permission projection

Each scenario exposes its input boundary, parser, typed result, and next stage.
The visual must not overflow at 390, 768, or 1440 CSS pixels.

## Adversarial checks

1. Ask why no args is insufficient to predict Repl.
2. Ask which parser handles `/model opus`.
3. Ask whether Ctrl-C always exits.
4. Split a fenced Markdown block across two deltas and predict pending output.
5. Add one missing gitignore entry to an initialized repo and predict statuses.
6. Fail the third artifact write and predict what remains on disk.
