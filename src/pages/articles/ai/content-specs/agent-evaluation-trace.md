# Agent Evaluation & Trace content spec

## 1. Reader outcome

The reader can turn an agent demo into a repeatable evaluation system. Given a task, tool environment and candidate change, the reader must be able to:

1. write the success contract before running the agent;
2. separate final outcome, intermediate behavior, safety and operational cost;
3. choose deterministic, rubric, model and human graders by evidence type;
4. use a trace to find the first violated contract rather than the last visible symptom;
5. distinguish agent failure from task, environment, harness and grader failure;
6. compare baseline and candidate on paired cases, repeated trials and critical invariants;
7. record a change hypothesis, regression evidence and release decision.

This is an independent article rather than an expansion of `LLM Harness`. The harness article defines the product boundary. This article owns the evidence loop used to decide whether a harness or model change is actually better.

## 2. Narrative contract

The article follows one refund-agent case from beginning to end:

`task contract -> isolated run -> trace -> graders -> failure classification -> repeated reliability -> paired regression -> release gate`

Every abstraction is introduced only after the refund case creates a need for it. The article must not begin with a catalog of evaluation frameworks or a benchmark table.

## 3. Private transfer problem

Do not print this problem verbatim in the article. Use it to audit whether the prose transfers.

> A baseline refund agent has 78% one-run task success, 0% unauthorized refunds, p95 latency 7.2 s and mean cost $0.18. A candidate has 82% one-run success, 4% unauthorized refunds, p95 latency 8.1 s and mean cost $0.22. On one failed candidate run, order lookup succeeds, policy retrieval times out, the harness substitutes an empty policy, the refund tool mutates the database, and the final answer says the refund was completed. The evaluator's text judge rates the answer 5/5 because it is clear and polite. Design the evaluation and release decision.

### Expected reasoning

- Reject the candidate despite the higher aggregate task-success score because a critical state invariant regressed.
- Define the expected final database state and permission boundary before generation.
- Prefer a deterministic final-state grader for unauthorized mutation; the text judge cannot observe or overrule it.
- Identify the first causal contract violation at policy retrieval / fail-open harness behavior, not the polished final message.
- Classify the incident across environment/tool failure and harness policy failure before assigning model blame.
- Rerun baseline and candidate on the same case, environment snapshot and repeated seeds.
- Track empirical `pass^k` for repeated reliability, not only `pass@k` or one-run averages.
- Add a regression case that injects policy-tool timeout and asserts fail-closed behavior plus unchanged database state.
- Report latency and cost as constraints, but do not trade a critical authorization invariant for small success gains.

If the article does not supply each of those insights, it is incomplete.

## 4. Source and claim ledger

| Source | Use in article | Claim boundary |
|---|---|---|
| Anthropic, *Demystifying evals for AI agents* (2026-01-09) | multi-turn agent eval anatomy, grader mix, task suites, operational metrics | Product guidance, not a universal benchmark standard |
| tau-bench, arXiv:2406.12045 | final database state, policy-constrained tool use, repeated reliability and `pass^k` | Benchmark design evidence; independence formula is pedagogical unless empirically measured |
| SWE-bench, arXiv:2310.06770 | real repository state, executable tests and issue-resolution tasks | Coding agents only; transfer the environment-and-state principle, not the task distribution |
| SWE-bench Live, arXiv:2505.23419 | fresh, updateable and reproducible tasks for contamination resistance | Freshness reduces one risk but does not guarantee representativeness |
| OpenAI, *Separating signal from noise in coding evaluations* (2026-07-08) | task, prompt, test and coverage defects can dominate apparent agent failure | Coding-eval audit findings; used as a general warning to audit the benchmark itself |
| OpenAI, *PaperBench* | hierarchical rubrics and a separately evaluated judge | Research replication domain; rubric decomposition transfers, score values do not |
| OpenAI, *A playbook for trustworthy third-party evaluations* (2026-05-29) | disclose harness, tools, retry, resources and intermediate artifacts | Evaluation transparency guidance, not a claim that one harness is best |

## 5. Required sections

### 01. A demo is not an evaluation

- Start with the refund question.
- Define task, initial state, allowed actions, expected final state and forbidden side effects.
- Explain that output text is only one artifact of an agent run.

### 02. The evaluation case is an executable contract

- Show the case schema: input, environment snapshot, policy, tools, expected state, forbidden state and resource budget.
- Explain fixture isolation, reset, timestamps, model/harness versions and deterministic seeds where available.
- Distinguish task success from safety and budget constraints.

### 03. Trace the first violated contract

- Interactive workbench with summary, trace and failure inbox.
- The policy lookup times out; the harness fails open; the refund call mutates state.
- The final polite answer is a downstream symptom.
- Trace must record input/output summaries, tool calls, state changes, latency, cost and error ownership without dumping secrets.

### 04. Match grader to evidence

- Deterministic final-state and invariant checks first.
- Tool/schema/permission checks for behavior contracts.
- Rubric/model judge for semantic quality that cannot be reduced to state.
- Human review for ambiguity, high stakes and grader calibration.
- Show precedence: critical deterministic failure cannot be averaged away by a high prose score.

### 05. One success is not reliability

- Explain one-run success probability `p`.
- Render both `pass@k = 1 - (1-p)^k` and `pass^k = p^k` in KaTeX.
- Add Korean annotations below every symbol and operation.
- Interactive slider compares “at least one success” with “all k runs succeed”.
- State the independence approximation and require empirical repeated trials because agent failures can be correlated.

### 06. Classify failures before fixing the model

- Task defect, environment/tool defect, harness defect, model/policy defect, grader defect.
- Use the 2026 coding-eval audit as evidence that broken tasks and tests are material.
- A failure inbox groups cases by first causal boundary, severity and reproducibility.

### 07. Close the regression loop

- Paired baseline/candidate on the same cases and environment snapshot.
- Compare task families and critical invariants, not only global average.
- Record hypothesis, changed component, expected effect, actual effect, regressions and release decision.
- Add timeout fault injection to the permanent suite.
- Include a compact TypeScript case schema and runner pseudocode.

### 08. Capability check and sources

- Capability checklist maps directly to the private problem.
- Primary/official sources with claim-specific notes.

## 6. Visual contract

### AgentEvalWorkbench

- Desktop: summary strip, trace lane and evidence panel; mobile: one stable column.
- No horizontal scroll at 360 px.
- Five manually selectable trace stages. No autoplay.
- Lines are 1 px borders with small-radius containers; no thick arrows, glow or decorative gradients.
- Semantic colors are limited to blue for evidence, amber for caution, rose for critical and emerald for pass.
- Text remains readable at browser zoom and wraps inside every stage.
- Failure inbox must name the first causal boundary and downstream symptoms separately.

### ReliabilityExplorer

- Range controls for per-run success and repetition count.
- Stable metric blocks for one run, at least one success and all runs succeed.
- Values never resize the container.
- Explain that formulas assume independent identical trials; empirical replay is the production answer.

## 7. Small-model replay packet

For a 4B-9B writer, provide only:

- target reader outcome;
- the refund execution trace;
- the private transfer problem and expected reasoning;
- the seven-source claim ledger;
- the two formulas and Korean symbol notes;
- the two visualization contracts;
- forbidden claims below.

Then require section-by-section evidence checks before prose expansion.

### Forbidden claims

- “Higher average success means the candidate is better.”
- “LLM-as-judge is sufficient for agent evaluation.”
- “The final answer proves that the tool action was correct.”
- “A single seed measures reliability.”
- “Every failed benchmark case is a model failure.”
- “pass@k and pass^k measure the same property.”
