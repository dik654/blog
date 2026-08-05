# Claw compaction content spec

## Owner question

When a transcript crosses a context budget, exactly which messages may be summarized, which
relationships must remain verbatim, what information survives the deterministic summary, and when
does the running `ConversationRuntime` actually adopt the result?

## Source snapshot

Commit: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`

- `rust/crates/runtime/src/compact.rs`
- `rust/crates/runtime/src/conversation.rs`
- `rust/crates/runtime/src/session.rs`

## Private transfer problem

A runtime contains an existing compact summary followed by seven new messages. The configured
preserved tail begins with a `ToolResult`, immediately preceded by its assistant `ToolUse`.
The new compactable transcript is large enough to pass the token gate.

The reader must derive:

1. the existing summary is excluded from the compactable message count and token estimate;
2. both the message-count and token gates must pass;
3. the raw boundary moves backward to preserve the tool-use/result pair;
4. only messages before the safe boundary enter the new deterministic summary;
5. the previous summary contributes highlights but its old timeline is not replayed as raw input;
6. `ConversationRuntime::compact(&self)` returns a candidate without mutating runtime state;
7. `maybe_auto_compact()` installs the candidate only when at least one message was removed.

## Required source claims

- `CompactionConfig` has only `preserve_recent_messages` and `max_estimated_tokens`.
- Defaults are 4 and 10,000.
- Token estimation uses UTF-8 byte lengths divided by four plus one per block.
- `should_compact` uses `compactable.len() > preserve` and estimated tokens `>= max`.
- A recognized first compact summary is excluded from both trigger inputs.
- The safe boundary never separates an immediately paired `ToolUse` and `ToolResult`.
- Summary extraction is deterministic and truncates each timeline block to 160 characters.
- Pending work recognizes only the current ASCII keywords in source.
- Key file candidates are restricted to the exact source extension list and capped at eight.
- Recompaction nests prior highlights and new highlights/timeline; there is no secondary summary
  budget in this revision.
- Manual compact returns a result; the auto path installs it.
- Session compaction metadata records count, summary and removed message count.

## Forbidden claims

- an LLM call or nine-section model prompt in the current Claw implementation;
- `SummaryCompressor`, fact weights, relevance scoring or `max_summary_tokens`;
- intelligent semantic deduplication;
- exact tokenizer counts;
- manual `compact(&self)` mutating the runtime;
- token reduction being guaranteed for every small transcript.

## Narrative order

1. Motivate compaction as a transcript-boundary problem.
2. Explain approximate token counting and the two trigger gates.
3. Derive raw and safe boundaries, then open the interactive lab.
4. Enumerate exactly what the deterministic summary preserves and loses.
5. Explain recompaction without claiming semantic deduplication.
6. Separate result construction from runtime state installation and persistence.

## Viz contract

Selector: `[data-compaction-contract-lab]`

Controls:

- transcript: ordinary, tool boundary, recompaction;
- path: manual result or automatic installation;
- preserved message count;
- manual estimated-token threshold.

Visible invariants:

- tool-boundary plus preserve=3 changes `raw 4` to `safe 3`;
- manual path can return a compacted candidate while runtime remains `not-installed`;
- automatic path installs only when compaction removes messages;
- a high manual threshold closes the token gate and returns the original Session clone;
- the first prior summary appears as merge input and is excluded from the trigger.

Responsive contract:

- no document or lab horizontal overflow at 360, 768 and 1440 px;
- transcript items wrap without changing control dimensions;
- no horizontal panning is required to compare removed and preserved messages.
