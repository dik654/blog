# Imitation And Offline Learning Article Spec

## Direct Entry Contract

The first screen must not assume that the reader knows demonstration, state,
action, policy, trajectory, closed loop, or supervised learning. It begins with
a driving teacher who has only demonstrated lane-centre states. The prose then
names the current situation `state`, the selected movement `action`, the ordered
record `demonstration`, and the learned rule `policy`. Only after that scene may
the article ask why per-frame imitation does not prove end-to-end success.

The opening order is fixed:

1. a familiar driving scene;
2. situation and movement;
3. an ordered expert record;
4. imitation of recorded choices;
5. self-induced unfamiliar situations;
6. the technical question and terminology.

## Reader Contract

This article owns the decision path from a logged demonstration to a deployable offline policy. It must not read as a list of BC, DAgger, CQL, IQL and Decision Transformer. A reader who finishes it should be able to identify which distribution created every target, determine whether new expert or environment queries are possible, calculate the support risk of a proposed policy, and reject an apparent offline improvement when evaluation evidence is not identifiable.

The historical floor stops at the first source that establishes each independent mechanism:

- Ross, Gordon and Bagnell 2011 for learner-induced distribution and DAgger;
- Kumar et al. 2020 for explicit conservative value regularization;
- Kostrikov, Nair and Levine 2021 for implicit policy improvement without unseen-action Q queries;
- Hanna, Niekum and Stone 2019 for importance-sampling OPE with a behavior policy;
- Chen et al. 2021 for return-conditioned causal sequence modeling.

Older imitation, batch dynamic programming and covariate-shift history remain hidden unless a later claim directly depends on a distinct result.

## Source And Claim Boundaries

### DAgger

The source claim is about no-regret learning on the state distribution induced by the learner under stated reduction assumptions. The article must not turn the `T^2 epsilon` versus `uT epsilon_N` terms into measured success probabilities or a generic robot safety guarantee. Expert availability, query latency and unsafe states are system constraints outside the theorem.

### CQL

The exact discrete regularizer is `logsumexp(Q) - E_behavior[Q]`. Its gradient is `softmax(Q) - behavior_share`. The article must calculate both directions and then reattach the Bellman error. A count-based penalty may not be presented as CQL. The expected lower-bound result is conditional and is not pointwise neural-network pessimism or proof of safety.

### IQL

The state value is fit by asymmetric expectile regression over Q values of dataset actions. Q is backed up through that V and the actor is extracted by advantage-weighted behavior cloning. “Never evaluate unseen actions” applies to the training query path, not to a guarantee that representation generalization or deployed states stay in support.

### Off-Policy Evaluation

Trajectory importance ratios require a target-to-behavior likelihood ratio for every selected action. Ordinary IS, self-normalized IS and effective sample size answer different questions. If the target policy assigns positive probability where the behavior probability is zero, the counterfactual return is not identifiable from the fixed log. No estimator name repairs missing support.

### Decision Transformer

Return-to-go is computed from future rewards only as an offline hindsight training token. The action target remains supervised and causally masked. During evaluation, desired remaining return is reduced by observed reward. A return prompt above or between unsupported dataset modes is an OOD condition, not a planning guarantee.

## Private Transfer Problem

A warehouse robot dataset contains 612 trajectories at one decision state: 420 use lane keeping, 180 decelerate and 12 take a shortcut. A critic predicts Q values `[2.7, 3.3, 5.4]`. The behavior cloning policy has 1.5% one-step error over a 140-step task. Expert teleoperation remains available for one final one-hour window. After that window, only static logs can be used. These numbers intentionally differ from every public Lab fixture: passing this gate requires transfer, not copying an answer key.

The authoring gate is passed only if the article alone lets a reader:

1. compute the independent-error baseline `1 - .985^140 = .8795` and expected error count `2.1`, distinguish them from policy-induced covariate shift, and explain why a frame split leaks adjacent observations;
2. design the DAgger collection order, identify the state distribution that is queried, and keep the theorem's cost terms separate from empirical task success;
3. normalize the three behavior counts, calculate `logsumexp(Q)=5.5737`, the behavior-weighted Q mean `2.9294`, CQL regularizer `2.6443`, gradients `[-.6298, -.1912, +.8210]`, and the alpha 1.2, learning-rate .5 preview Q values `[3.08, 3.41, 4.91]`;
4. explain why this regularizer-only step is not a CQL policy update and name the Bellman target responsibility;
5. trace IQL expectile V, Q backup and advantage-weighted cloning without asking Q about a newly sampled action;
6. calculate trajectory weights `[1.2, .5, 2.0]`, ordinary IS `10.97`, self-normalized IS `8.89`, and ESS `2.41/3` for behavior probabilities `[.5,.4,.25]`, target probabilities `[.6,.2,.5]`, and returns `[7,5,11]`;
7. reject evaluation when the target chooses a positive-probability action with zero behavior support;
8. reconstruct Decision Transformer token order, action loss and desired-return update, then classify a prompt of 100 when training return modes end at 70 as support extrapolation;
9. choose BC, DAgger, CQL, IQL or sequence modeling only after naming query availability, reward availability, coverage, evaluation evidence and a deployment stop condition.

The problem text and its numeric fixtures are private. Published prose, formulas and interactions must teach every required operation with different examples, so the private values can only be solved by transferring the method.

## Narrative Order

1. A demonstration is a trajectory generated by a behavior policy, not an IID action answer sheet.
2. Open-loop action accuracy is converted into a deliberately optimistic long-horizon baseline, then broken by closed-loop covariate shift.
3. DAgger is introduced as a data-collection intervention possible only while the expert can label learner states.
4. Static data creates an uncorrectable OOD value feedback loop for ordinary off-policy actor-critic.
5. CQL shows explicit pessimism with its actual discrete gradient; IQL shows an implicit dataset-action-only alternative.
6. OPE checks whether a proposed policy can be evaluated before any deployment claim is made.
7. Decision Transformer recasts the same fixed trajectories as return-conditioned supervised sequence data without escaping support.
8. The article closes with a choice ledger based on evidence access, not algorithm popularity.

## Formula Contract

The article has 12 display equations and 12 adjacent FormulaNotes:

1. BC negative log-likelihood;
2. independent any-error probability;
3. DAgger aggregation;
4. BC and DAgger conditional cost terms;
5. CQL regularizer;
6. full CQL critic objective;
7. IQL expectile value loss;
8. IQL advantage-weighted actor loss;
9. trajectory IS and ESS;
10. support implication;
11. Decision Transformer return-to-go and token order;
12. causal action prediction and supervised loss.

Every rendered display equation must contain visible Korean operation annotations. Long formulas are decomposed into named intermediate rows rather than allowed to shrink below 12px at 390px.

## Visual Contract

- Preserve the existing animated offline-learning sequence because it owns the expert trajectory to query/static-data branch.
- The compounding-error Lab exposes horizon and one-step error and labels the independence assumption.
- The CQL Lab uses exact behavior shares, softmax shares, gradient directions and one regularizer-step preview. Alpha states 0, 1.2 and 2.4 must execute.
- The OPE Lab has supported and target-only-action states. Supported mode displays every likelihood ratio, ordinary IS, self-normalized IS and ESS. Missing-support mode refuses to fabricate a value.
- Tools use stable card dimensions, restrained multi-color semantic encoding and no inner horizontal scroll.
- Existing animation and new numeric Labs must have separate explanatory ownership.

## Browser Verification

At 390, 768 and 1440 pixels:

- all 12 formulas render with Korean annotations and at least 12px font size;
- all 12 FormulaNotes are present and no raw TeX or missing-annotation marker is visible;
- horizon 100/error .02 and horizon 150/error .01 numeric states are correct;
- CQL alpha 0, 1.2 and 2.4 states preserve exact gradient signs and update values;
- OPE supported and missing-support branches execute and expose the stated oracles;
- the existing animation remains present;
- document, formula and visualization overflow is at most one pixel;
- no console or page error occurs;
- the article contains no comparison table used as a substitute for explanation.
- `BeginnerOpening` precedes the first `QuestionLead`, and the first question is
  understandable without reading any prerequisite label.
