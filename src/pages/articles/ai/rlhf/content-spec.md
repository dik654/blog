# RLHF execution contract content spec

## Independent reader decision

This article owns one canonical question: how does one human ranking task become a scalar reward and then a bounded language-model policy update in the InstructGPT pipeline?

It does not own:

- method selection among CPT, SFT, DPO, RLHF and RLVR (`post-training-rlvr`)
- general PPO derivation and continuous-control foundations (`rl-ppo-continuous-control`)
- GRPO/Open-R1 implementation (`open-r1`)
- the current reasoning-RL failure frontier (`reasoning-post-training-frontier`)
- broad method selection or a product-style DPO·ORPO·KTO·Constitutional AI catalog; the current evidence-first selection boundary belongs to `post-training-rlvr`, and the old unregistered `alignment-methods` draft is not a reader handoff

## Primary evidence boundary

- Ouyang et al. 2022, InstructGPT: the three datasets, K-way ranking batch, reward normalization, bandit environment, per-token KL penalty, PPO-ptx and evaluation scope.
- Schulman et al. 2017, PPO: the clipped surrogate objective and old-policy sampling/update contract.
- Christiano et al. 2017: preference comparisons as learned reward rather than an environment-provided objective.

Recipe numbers must be labeled as InstructGPT-specific, not universal RLHF constants.

## Private transfer problem

The article is complete only if a reader can solve this without outside material:

1. One prompt produces four completions ranked A > B > C > D. Enumerate the six pairwise rows without calling them six independent prompts.
2. Given reward scores `[1.2, 0.4, -0.2, -1.0]`, compute which score differences control Bradley-Terry probabilities.
3. Add `+100` to every score. Explain why every pair probability and RM loss stays fixed but raw reward/value targets would shift unless the RM offset is normalized before RL.
4. For `epsilon=0.2`, old probability `0.20`, new probability `0.27`, advantage `+2`, compute ratio `1.35`, unclipped term `2.70`, clipped term `2.40`, and the conservative PPO objective `2.40`.
5. Repeat conceptually for negative advantage and explain why the pessimistic branch changes direction.
6. Distinguish the current actor from the rollout old policy and the frozen SFT reference. State which distance clipping and KL control.
7. Explain why increasing KL alone is not equivalent to mixing pretraining gradients, using the InstructGPT alignment-tax ablation boundary.
8. Identify whose preference the reward model represents and what held-out evaluation does not prove.

## 4B/9B author contract

1. Begin with one prompt and trace concrete row schemas through SFT, RM and PPO.
2. Separate paper recipe, general mechanism and author inference.
3. Keep ranking groups intact; do not count correlated pairs as unrelated prompts.
4. Show reward shift invariance and the reason for offset normalization.
5. Use numeric positive- and negative-advantage clipping cases.
6. Name the old policy and SFT reference separately.
7. Treat the reward model as a proxy for a bounded evaluator population, not human values.
8. Exercise every non-default Viz control and browser error channel at mobile, tablet and desktop widths.

## Narrative and Viz order

1. Prose: one prompt creates three different datasets.
2. `RLHFDataContractViz`: demonstration, ranking and unlabeled PPO prompt lifecycle.
3. Prose and math: K-way ranking, Bradley-Terry loss and group correlation.
4. `RankingBatchLab`: K=4/5 and score-offset interaction.
5. Prose and math: reward offset, bandit episode and sampled reference penalty.
6. `PPOUpdateLab`: positive, negative and in-range token update cases.
7. `TwoDistanceViz`: old-policy clip, frozen-reference KL and pretraining gradient.
8. Failure boundaries, capability check and ownership-aware handoffs.

Every Viz must have explanatory prose before it, no inner horizontal scrolling, no hidden initial animation state and no table-based substitute for causal flow.
