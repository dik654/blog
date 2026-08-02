# Post-training feedback contracts

## Reader decision

Given a capability gap and available evidence, decide whether the system needs retrieval, continued pre-training, supervised fine-tuning, offline preference learning, or online reinforcement learning. More than one method may be composed, but each must own a distinct signal.

## Source boundary

- Gururangan et al. (ACL 2020): continued pre-training adapts a model to an unlabeled domain or task corpus.
- Ouyang et al. (2022): demonstrations train SFT; rankings train a reward model; PPO optimizes that learned reward while retaining pre-training behavior.
- Rafailov et al. (2023): DPO optimizes pairwise preference data with a classification loss and does not require online sampling during fine-tuning.
- DeepSeek-R1 (2025): R1-Zero shows SFT is not a universal prerequisite for reasoning RL; the multi-stage R1 recipe adds cold-start data and later stages for readability and broader quality.
- Open-R1 implementation details belong to the `open-r1` article. Current credit, entropy, overthinking and monitorability failures belong to `reasoning-post-training-frontier`. Bradley-Terry and PPO mechanics belong to `rlhf` and `rl-ppo-continuous-control`.

## Private transfer problem

The article must let a reader solve all cases without showing this as a quiz.

1. Two billion tokens of unlabeled Korean medical documents contain facts absent from the base model. Separate a provenance-sensitive RAG path from repeated domain adaptation by continued pre-training.
2. Twenty thousand prompt-to-valid-JSON demonstrations define an exact output schema. Choose SFT and explain why preference-only data is indirect.
3. Fifty thousand chosen/rejected pairs express helpful tone but no objective answer. Choose DPO or reward-model RLHF and identify the population whose preference is represented.
4. Ten thousand coding prompts have hidden unit tests and an online rollout budget. Choose RLVR, state the exploration advantage, and keep execution inside a sandbox.
5. Explain why the four data assets cannot be concatenated into one unnamed “post-training dataset”. Their row shapes, losses, data generators and failure boundaries differ.
6. Design a composed path for a medical JSON assistant: retrieval or CPT for knowledge, SFT for schema, preference learning for bedside tone, and RLVR only for fields that have an executable verifier.

## Narrative

1. Start with four visible work requests and ask what evidence exists, not which fashionable method to use.
2. Separate changing knowledge from changing behavior. RAG changes context; CPT changes weights from unlabeled text.
3. Reconstruct one training row for CPT, SFT, DPO/RLHF and RLVR. Show input unit, target signal, data producer and whether current-policy exploration exists.
4. Give each objective one Korean-annotated equation and one numeric or concrete row.
5. Let the reader switch among the four scenarios in a decision lab. The result must explain both the recommended first signal and the next composition step.
6. End with ownership-aware handoffs to the current frontier, RLHF/PPO and Open-R1.

## Visual contract

- No wide SVG scaled to fit mobile.
- Use CSS grids and stable tracks; selected content is always visible before animation runs.
- Scenario controls are segmented buttons with a fixed result region.
- Use restrained blue, teal, violet, amber and rose only to encode signal ownership.
- No table and no nested cards.
- At 390, 768 and 1440 pixels: zero document overflow, no inner horizontal scroll, no clipped Korean or formula text.

## 4B/9B author contract

1. Ask “what is missing?” and “what labels can be produced?” before naming a method.
2. Represent every dataset by an explicit row schema.
3. Separate offline fixed data from online current-policy rollouts.
4. Separate knowledge acquisition, behavior imitation, relative preference and executable success.
5. Do not claim SFT is always required before RL.
6. Mark recipe examples as examples, not universal order or weights.
7. Give every method a misuse counterexample.
8. Keep implementation mechanics in their owning article and link rather than duplicate.
9. Validate every non-default control state and browser error channel.
