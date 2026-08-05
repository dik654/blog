# Claw API Client content specification

## Target question

Why does `qwen-plus` become `ProviderClient::OpenAi` while reading
`DASHSCOPE_API_KEY`, and what must remain invariant after the request crosses a
provider-specific wire?

## Pinned source

- repository: `/home/heru/code/claw-code`
- revision: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`
- files:
  - `rust/crates/api/src/client.rs`
  - `rust/crates/api/src/providers/mod.rs`
  - `rust/crates/api/src/providers/anthropic.rs`
  - `rust/crates/api/src/providers/openai_compat.rs`
  - `rust/crates/api/src/prompt_cache.rs`
  - `rust/crates/api/src/types.rs`
  - `rust/crates/rusty-claude-cli/src/main.rs`

## Required causal order

1. Resolve model alias.
2. Detect `ProviderKind` from model metadata or environment fallback.
3. Construct one of three `ProviderClient` enum variants.
4. For `OpenAi`, select OpenAI or DashScope config from metadata auth env.
5. Translate common message and tool blocks into the provider wire.
6. Assemble provider SSE into the six common `StreamEvent` variants.
7. Adapt common events into the CLI's narrower single-pending-tool state.
8. Resolve normal finish, clean EOF synthesis, partial-stream synthesis, and
   empty-stream non-streaming fallback.
9. Distinguish local completion reuse from prompt-cache usage observation.

## Required exact facts

- `ProviderClient` is an enum, while concrete clients also implement a
  `Provider` trait. The top-level dispatch is not `Box<dyn ProviderClient>`.
- Variants are Anthropic, Xai, and OpenAi. There is no Azure variant.
- Qwen and Kimi use DashScope OpenAI-compatible mode and
  `DASHSCOPE_API_KEY`.
- An unknown/custom model uses environment sniffing in this order:
  OpenAI base URL plus OpenAI key, Anthropic auth, OpenAI key, xAI key,
  OpenAI base URL only, then Anthropic default.
- Provider kind selection does not guarantee client construction: a chosen kind
  may still lack the credential it requires.
- API keys can fall back to cwd `.env`; provider base URLs are process-env-only.
- Request body limits are xAI 50 MiB, OpenAI 100 MiB, DashScope 6 MiB.
- Anthropic can apply both `x-api-key` and bearer authorization.
- Kimi omits `is_error`; GPT-5 uses `max_completion_tokens`.
- Stream events are MessageStart, MessageDelta, ContentBlockStart,
  ContentBlockDelta, ContentBlockStop, MessageStop.
- Provider parsing preserves content block indexes, but the CLI adapter keeps
  one `pending_tool` and ignores indexes. Interleaved tool calls can therefore
  lose separation. Message-start metadata and delta stop reasons are also not
  fully retained downstream.
- OpenAI-compatible EOF can synthesize `end_turn` and `MessageStop`; the CLI
  can synthesize a stop after partial events, and an empty stream can trigger a
  second non-streaming request.
- Completion TTL defaults to 30 seconds. Prompt observation TTL defaults to
  5 minutes. Meaningful cache-read drop defaults to 2,000 tokens.
- PromptCache only attaches through the Anthropic top-level variant.

## Forbidden claims

- Azure is a supported `ProviderClient` variant.
- `ProviderClient` is the top-level trait object.
- API key wins over bearer token, or bearer token wins over API key.
- PromptCache chooses remote Anthropic cache breakpoints.
- A five-minute prompt TTL means a completion response is replayed for five
  minutes.
- Streaming responses are replayed from the local completion cache.
- Every tool message preceded by a non-assistant message is dropped.
- A block index preserved by the provider parser is always preserved by the CLI.
- `.env` can configure a provider base URL.
- An empty streaming response is known to have executed no billable request.

## Visual contract

The route lab must expose alias, kind, enum variant, config, credential, request
limit, and model-specific wire correction for:

- opus
- grok-mini
- qwen-plus
- kimi
- openai/gpt-5
- custom-model under each environment fallback profile

It must use responsive DOM layout rather than a fixed-width SVG and must not
overflow at 390, 768, or 1440 CSS pixels.

## Adversarial checks

1. Explain why Alibaba ownership does not imply an Alibaba enum variant.
2. Compare Qwen and Kimi: same endpoint config, different tool-result rule.
3. Calculate the classification for a 2,500 cache-read drop with an unchanged
   fingerprint at 120 seconds and 301 seconds.
4. Explain why a 1,999-token drop produces no break event.
5. Identify the scope of the last-resort orphan tool sanitizer.
6. Route one custom model under competing credentials and explain the priority.
7. Interleave deltas from two tool-call indexes and identify what the provider
   parser preserves versus what the CLI adapter can overwrite.
8. Distinguish clean stream completion, synthetic stop, and a second
   non-streaming request; state why idempotency cannot be inferred.
