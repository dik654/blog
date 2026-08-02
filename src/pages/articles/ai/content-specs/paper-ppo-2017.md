# PPO 2017 · source reconstruction contract

## Reader decision

The reader must be able to follow one old-policy rollout through advantage estimation, signed ratio
clipping, repeated minibatch updates, diagnostics and the next policy snapshot. The article must distinguish
the 2017 paper from later PPO2 implementation conventions and from PPO-based LLM post-training.

## Primary source boundary

- Primary paper: Schulman et al., *Proximal Policy Optimization Algorithms*, arXiv:1707.06347.
- Reconstruct both proposed variants: the clipped surrogate and the adaptive KL penalty. The clipped
  variant is the main path because the paper reports it as stronger in its comparison.
- Equation 9 uses a plain squared value error. Value-function clipping is a later implementation choice,
  not a contribution of this paper.
- The continuous-control policy is a diagonal Gaussian whose sampled action is bounded by the environment;
  do not silently substitute a tanh-squashed Gaussian and Jacobian correction from later algorithms.
- Clipping is a pessimistic sample surrogate. It is not a hard KL trust region or monotonic-improvement proof.
- Atari evidence is mixed: PPO wins more games on average reward across training, while ACER wins more
  on the last-100-episodes final metric.

## Private transfer problem

The finished article alone must let a reader solve this without printing it as a quiz:

1. Given `epsilon=0.2`, compute the selected objective term for positive and negative advantages at
   ratios `0.7`, `1.0` and `1.3`.
2. Explain why positive advantage clips the upper side while negative advantage clips the lower side.
3. Show why moving farther in a harmful direction is never forgiven by the `min`.
4. Reconstruct Equation 9 and identify actor, critic and entropy signs when the implementation minimizes loss.
5. Follow Algorithm 1 and explain why `old_log_prob` must remain immutable for all K epochs.
6. Distinguish ratio clipping, adaptive KL penalty, diagnostic approximate KL and later value clipping.
7. Read Table 1 and Table 2 without claiming PPO uniformly wins.

## Narrative

1. Start from the failure of repeated vanilla-policy-gradient updates.
2. Compare TRPO's constrained update with PPO's first-order surrogate.
3. Manipulate one sample's ratio and advantage sign before showing the batch expectation.
4. Reconstruct the full actor-critic objective.
5. Follow Algorithm 1 in execution order.
6. Separate the adaptive-KL alternative and later implementation additions.
7. Read continuous-control and Atari evidence with the negative result preserved.
8. Hand off separately to continuous-control implementation and LLM RLHF/RLVR.

## Formula contract

Every display equation has Korean underbrace annotations and an adjacent `FormulaNote`.

1. Old/new action-probability ratio using log-probability difference.
2. Signed clipped surrogate.
3. Full clipped-policy + value + entropy objective.
4. Adaptive KL penalty update rule.

No raw LaTeX or formula overflow at 390 px.

## Viz contract

### `PpoClipLab`

- Controls advantage sign and ratio.
- Shows raw term, clipped term and selected minimum numerically.
- Visual clip band and current ratio marker stay stable across viewports.

### `PpoIterationLab`

- Five explicit stages: rollout, advantage/target, K minibatch epochs, diagnostics, old-policy snapshot.
- Each stage names immutable input, updated state, invariant and failure.

### `PpoEvidenceLab`

- Table 1 exact normalized scores.
- Figure 3 comparison scope without invented numeric values.
- Table 2 exact Atari game-win counts for both scoring metrics.
- Every tab states what the receipt supports and what it does not prove.

## Small-model author packet

### 4B

One equation branch, one numeric ratio oracle, one source anchor, one modern-conflation guard and one viewport.

### 9B

One complete causal section: failure, mechanism, algorithm state, source receipt, limit, implementation
diagnostic and route handoff.

The orchestrator owns notation, source conflicts, private transfer checks, browser QA and deployment.
