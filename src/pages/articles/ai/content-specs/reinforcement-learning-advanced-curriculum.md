# Reinforcement Learning Advanced Curriculum Spec

## Purpose

This spec is private editorial QA. The hardest problems below are not copied into the article as exercises. They test whether the published prose, equations, evidence boundaries, and interactions give a reader enough insight to solve a novel case without hidden prerequisites.

## Source And Intent Ledger

| Spine | Primary source | Author intent retained in the article | Boundary that must not be erased |
|---|---|---|---|
| DAgger | Ross, Gordon, Bagnell, AISTATS 2011 | Train on the state distribution induced by the learner through no-regret data aggregation | The guarantee depends on expert queries, surrogate-loss and no-regret assumptions; it is not a generic robot-safety guarantee |
| CQL | Kumar et al., NeurIPS 2020 | Learn conservative policy values so static-data policy improvement does not exploit OOD Q errors | The theoretical expected lower bound is conditional; a finite neural critic is not pointwise pessimistic everywhere |
| Decision Transformer | Chen et al., NeurIPS 2021 | Recast offline RL as return-conditioned causal sequence modeling | A desired return outside dataset support is an OOD prompt, not guaranteed planning |
| Dyna | Sutton, ICML 1990 | Integrate reacting, real learning, model learning, and incremental planning | More model updates also amplify model error; Dyna is an architecture, not a claim that every learned simulator is useful |
| World Models | Ha and Schmidhuber, 2018 | Separate a large unsupervised V/M model from a compact controller and test dream-to-real transfer | Visual plausibility and dream return do not establish correct closed-loop dynamics |
| MuZero | Schrittwieser et al., Nature 2020 | Predict only quantities needed by tree search instead of reconstructing observations | Reconstruction-free latent state can omit task or safety information absent from reward-policy-value targets |
| DreamerV3 | Hafner et al., arXiv 2023 / Nature 2025 | Use robust RSSM imagination actor-critic across diverse domains with fixed hyperparameters | Posterior reconstruction and prior imagination are different distributions; 150+ tasks do not imply universal no-tuning deployment |

## Hidden Mastery Problems

### Concept Article: Imitation And Offline Learning

A mobile manipulator has 80,000 expert frames, 98.7% action accuracy, and 43% closed-loop pick success. A one-frame random split reports 99.4%. The deployed policy drifts after a small camera calibration error. Expert teleoperation is available for two hours, after which only the frozen mixed-quality log remains. Some logged episodes have reward but no success reason. Design a staged baseline that:

1. identifies leakage and action-observation latency;
2. explains quantitatively why the horizon makes one-step accuracy insufficient;
3. decides which states to collect and label during the two-hour query window;
4. chooses BC, DAgger, CQL, or return-conditioned sequence modeling after the window;
5. defines coverage and closed-loop metrics that can falsify the chosen method.

Pass condition: every decision can be derived from the published concept article without requiring the reader to know the algorithm names beforehand.

### DAgger

Given horizon 150, expert-state imitation error 1%, recovery cost-to-go increase u=4, a beta schedule, and a limited expert-query budget, compare the supervised worst-case term with the learner-distribution term. Explain why validating on the aggregate dataset is still insufficient, how to select a deployment iterate, and when DAgger's bound loses practical value.

### CQL

A static dataset contains two common safe actions and a rarely observed shortcut. A standard critic assigns the shortcut the largest Q. Derive the direction of both CQL regularizer terms, explain how continuous action sampling approximates the log-sum-exp, select diagnostics for alpha that is too small or too large, and state why low conservative Q is not itself proof of safety.

### Decision Transformer

An offline dataset has return modes near 20 and 70 but no trajectories between 35 and 55. The model is prompted with 100 and achieves 18. Reconstruct the token order, target-return update during rollout, causal mask, and action loss. Decide whether the failure is context length, optimization, reward scaling, or support extrapolation and design a falsifying sweep.

### Concept Article: Model-Based RL And World Models

A learned robot simulator has excellent one-step pixel reconstruction but a policy optimized for 40 imagined steps collides in reality. A 5-step MPC policy is safe but slow. The team can spend more compute on model size, planning updates, uncertainty ensembles, or real data. Build an audit that separates:

1. observation reconstruction from task-relevant transition prediction;
2. random validation from policy-optimized model exploitation;
3. posterior state inference from prior imagination;
4. planning horizon from terminal and contact modeling;
5. predicted return from real return.

Then select a Dyna-like short backup, MPC, MuZero-like search target, or Dreamer-like imagination baseline and justify the source of every training target.

### Dyna

In a gridworld, compare n=0, 5, and 50 planning updates before and after a wall moves. Count real steps and total backups separately. Explain why n=50 learns fastest before the change but can adapt slowest after it, and propose a priority or model-staleness diagnostic without claiming it eliminates model bias.

### World Models

A VAE reconstructs frames well, an MDN-RNN has good one-step likelihood, and a controller obtains high dream return but low real return. Identify which component owns each loss, why z-only and z+h ablations matter, how temperature can expose or hide model exploitation, and why the controller does not consume a decoded next frame.

### MuZero

For a three-action toy domain, unroll h, g, and f for depth three and construct reward, value, and search-policy targets. Explain why no observation reconstruction target is needed, what MCTS adds beyond the raw policy, and why increasing simulations can plateau when latent dynamics error grows with depth.

### DreamerV3

Given a replay posterior sequence and a 16-step prior imagination, compute lambda-returns with termination at step 7. Trace stop-gradient ownership between dynamics and representation KL, then diagnose a case where reconstruction improves while real return falls. The answer must distinguish reward model error, continue error, critic bootstrap error, and actor exploitation.

## Integrated Hardest Problem

Build a data-and-model strategy for a real orchard robot that has:

- 30 hours of expert driving with narrow coverage;
- a simulator with small steering bias and missing mud dynamics;
- two hours of safe expert intervention time;
- a fixed offline log after deployment approval;
- a requirement that the learned policy never infer safety merely from high predicted return.

The reader must be able to propose the order of BC, DAgger collection, conservative offline learning, world-model fitting, short-horizon planning, and real evaluation. For every stage they must name the data distribution, target source, objective, failure metric, and stop condition. No single benchmark score is an acceptable answer.

## Prose-To-Viz Contract

### Offline Learning Sequence

1. Expert policy creates the dataset state distribution.
2. BC minimizes action error only on that distribution.
3. Learner action changes the next input and exposes recovery states.
4. Expert-query availability branches the system into DAgger or static offline learning.
5. Coverage and reward availability choose aggregation, pessimism, or return-conditioned sequence modeling.

The animation must never imply that DAgger and CQL are sequential steps of one mandatory algorithm.

### World Model Sequence

1. A real environment transition anchors the system.
2. Direct value learning and model fitting consume the same real evidence for different targets.
3. The model generates imagined transitions.
4. The learner reuses the same update rule on generated data.
5. A real rollout measures predicted-to-real return gap.

The animation must visually distinguish real evidence from imagined data and must not equate more planning updates with more data coverage.

## Publication QA

- Every display equation has a Korean in-equation annotation and a separate prose interpretation.
- Mobile math stays inside its container without horizontal scrolling.
- Every paper article states author intent, evidence support, and non-supported claims.
- Concept articles link algorithm choice to query access, coverage, horizon, and compute rather than popularity.
- Interactive labs label simplified calculations as intuition when they are not the paper's exact algorithm.
- Animation is added only after prose and source boundaries are stable.
