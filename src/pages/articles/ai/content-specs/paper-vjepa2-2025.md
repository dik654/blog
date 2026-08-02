# V-JEPA 2 · source reconstruction contract

## Reader decision

The reader must reconstruct the paper's complete transfer chain: action-free representation pretraining,
frozen-encoder action-conditioned post-training, latent CEM/MPC planning and zero-shot robot evidence.
Cosmos or generic action-token conventions must not be attributed to V-JEPA 2.

## Primary source boundary

- Primary paper: Assran et al., *V-JEPA 2*, arXiv:2506.09985.
- Preserve the 7D end-effector state/action, 16-frame/4fps recipe, frozen 16x16x1408 feature map,
  teacher-forcing T=15, rollout T=2 and the approximately 300M predictor.
- Preserve the image-goal L1 energy, CEM search and receding-horizon execution.
- Report Table 2 and Table 3 with sample count and latency, not success rate alone.
- Keep camera sensitivity, long-horizon search/error and image-goal limitations.

## Private transfer problem

The article alone must let a reader:

1. Explain why action-free prediction cannot rank counterfactual robot commands.
2. Draw one 16-frame training sample and derive its 15 state-action transitions.
3. Reconcile teacher-forcing T=15, rollout T=2 and Figure 6's illustrative T=4.
4. Explain which modules are frozen and where gradient flows.
5. Derive the image-goal energy and the CEM/receding-horizon execution order.
6. Read the 16-second-vs-4-minute comparison with unequal sample counts.
7. Identify camera, horizon and goal-specification limits before deployment.

## Viz contract

- `VjepaStageLab`: three-stage data/module/claim boundary.
- `VjepaTrainingLab`: exact teacher-forcing and rollout input ownership plus numeric receipts.
- `VjepaEvidenceLab`: representation, robot and planner evidence with comparison limits.

No HTML table, raw LaTeX, horizontal scroll or formula text below 12 px at 390 px.
