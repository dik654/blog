# Prompt contract reconstruction

## Reader outcome

The reader should be able to assign a failure to the correct owner instead of
adding more prompt text:

- goal ambiguity -> prompt contract
- missing or stale evidence -> context/retrieval
- invalid shape -> constrained output/parser
- wrong field meaning -> semantic validator
- unauthorized side effect -> policy/approval
- duplicate effect after timeout -> harness/idempotency/effect verification

## Running case

A purchase-operations agent receives an invoice document, extracts typed
fields, asks before an external write, and encounters an ambiguous timeout.
Every section adds one missing contract to the same case.

## Hidden transfer check

After reading only this article, the reader should be able to design a safe
flow for an unfamiliar document-processing agent without asking for private
chain-of-thought. The design must separate:

1. success criteria,
2. trusted instructions from untrusted content,
3. schema validity from semantic correctness,
4. proposal from authorization,
5. retry from verified effect.

## Research floor

- Brown et al. (2020), GPT-3 / in-context learning
- Wei et al. (2022), chain-of-thought prompting
- Kojima et al. (2022), zero-shot chain-of-thought
- Anthropic prompt engineering overview and current best practices
- OpenAI current model prompting guidance
- OpenAI and Anthropic structured-output documentation

The article must not keep universal numeric claims about prompt length, model
size, shot count, or output-compliance rates.

## Viz proof

`PromptContractLab` must show one task packet changing through five scenes:

raw request -> measurable success -> authority boundary -> schema and effect
gates -> held-out evaluation and release.

The diagram is not a benchmark chart. It proves ownership and execution order.
