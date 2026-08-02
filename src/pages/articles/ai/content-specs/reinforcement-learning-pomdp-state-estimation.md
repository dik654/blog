# POMDP & State Estimation Curriculum Spec

## Reader contract

This unit closes the gap between the MDP assumption and a physical agent that only receives noisy, delayed, or aliased sensor observations. The reader should leave able to decide whether a failure belongs to the policy, the state estimator, the observation model, or the dynamics model.

## Hardest diagnostic problem

An orchard robot receives a monocular camera frame at 10 Hz and wheel odometry at 50 Hz. Two visually identical junctions require opposite turns. Leaves occlude the camera for 0.8 seconds, wheel slip doubles during rain, and the collision shield consumes the policy's estimated time-to-contact. A frame-only PPO agent achieves high training return but oscillates after occlusion. A team proposes four fixes: stack four frames, add an LSTM, insert a Kalman filter, or increase the collision penalty.

Using only the published article, the reader must be able to:

1. Prove why the current camera frame is not a Markov state.
2. Write the action-observation history and exact Bayesian belief update.
3. Explain why a maximum-a-posteriori state is not generally sufficient for action selection.
4. Decide which hidden quantities fit a linear-Gaussian Kalman state and which require a nonlinear, particle, or learned estimator.
5. Calculate how measurement noise changes the Kalman gain and corrected state.
6. Explain why an LSTM hidden state is a learned statistic but not automatically a calibrated posterior.
7. Design recurrent replay with sequence sampling, burn-in, masks, and hidden-state handling.
8. Separate estimator uncertainty from task return and safety-critic calibration.
9. Choose an information-gathering action when its immediate reward is lower but its future belief is better.
10. Define deployment tests that distinguish perception aliasing, estimator drift, policy failure, and insufficient braking authority.

If any answer requires a concept absent from the prose, formula notes, or visual sequence, the article is incomplete.

## Source and intent ledger

| Source | Author intent reconstructed | What the article may claim | Boundary that must remain visible |
|---|---|---|---|
| Kaelbling, Littman, Cassandra (1998) | Organize POMDP control as state estimation plus a belief-state policy; explain exact offline solution geometry and approximation difficulty | A normalized belief is sufficient for the action-observation history when the POMDP model is known; finite-horizon value is piecewise-linear and convex | Exact enumerative solution grows exponentially and does not directly scale to raw-image robotics |
| Kalman (1960) | Replace impulse-response Wiener filtering with a state-transition and covariance recursion suited to computation | A recursive state/covariance estimator follows from a linear stochastic model; under the stated loss/distribution conditions the conditional mean is optimal | The modern discrete Kalman recipe assumes a correct linear model and noise covariance; it is not a universal nonlinear filter |
| Welch & Bishop tutorial | Express the discrete KF/EKF predict-correct equations in implementation notation | Prediction and measurement correction have distinct covariance responsibilities | EKF linearization and Gaussian summaries can fail under multimodal or strongly nonlinear uncertainty |
| Hausknecht & Stone (2015) | Test whether recurrence can replace fixed frame stacking under partial observations | DRQN can integrate single frames over time and was more robust when observation quality changed in the reported Atari setup | The paper reports empirical workshop results; recurrence had no systematic full-observation advantage and hidden-state replay remains a design issue |

## Narrative order

1. **Observation is evidence, not state.** Start with perceptual aliasing and velocity hidden from a single image.
2. **POMDP contract.** Separate latent state, transition, observation emission, reward, and history.
3. **Belief update.** Show prediction, likelihood weighting, and normalization as three inspectable operations.
4. **Belief-space control.** Explain active sensing and why the best action can reduce uncertainty rather than move toward the goal.
5. **Kalman as a tractable special case.** Derive predict-correct and show the gain as a model-versus-sensor trust ratio.
6. **Approximate and learned state.** Contrast frame stacks, filters, particles, RNNs, and world-model posteriors by assumptions and failure modes.
7. **Recurrent implementation.** Reconstruct DRQN and the sequence replay/burn-in contract.
8. **Robot evidence chain.** Log observation quality, innovations, covariance/calibration, hidden-state reset, task return, intervention, and physical margin separately.

## Prose-to-viz specification

### Belief update lab

- Controls: prior probability, sensor reliability, transition action, and a two-option observation control.
- Stable output: old posterior, action-conditioned predicted prior, likelihood-weighted mass, observation evidence, normalized posterior.
- Numeric oracle: with prior 0.50, hold transition `P(B'|B)=0.90`, `P(B'|C)=0.10`, accuracy 0.85 and blocked signal, predicted `P(B')=0.50`, evidence `0.50`, posterior `0.85`. Move/slip changes the transition matrix even when the current observation is unchanged.
- Learning target: prediction and correction are separate. The same observation produces a different posterior under a different prior or action, and reliability changes update strength.
- Mobile rule: bars use a single vertical column below 640 px; no label is placed inside a narrow bar.

### Active sensing lab

- Controls: danger-left belief at 0.50, 0.80 and 0.90; reward and sensor contracts remain fixed so the decision boundary is inspectable.
- Stable output: act-now value, each observation branch probability and posterior, probe-then-act value, and selected mode.
- Numeric oracle: safe door `+4`, dangerous door `-8`, probe accuracy `0.85`, cost `0.50`. At belief 0.50, act-now is `-2.00` and probe is `1.70`, so probe first. At belief 0.90, act-now is `2.80` and probe is `2.30`, so act now.
- Learning target: entropy reduction is not itself value. Sensing is useful only when the branch-weighted improvement in downstream action value exceeds its cost.

### Kalman trust lab

- Controls: process variance Q and measurement variance R, with previous posterior variance fixed at 1.0.
- Stable output: predicted covariance P-, Kalman gain, corrected estimate, posterior variance.
- Numeric oracle: with Q=1 and R=1, P-=2, K=2/3, corrected state 5.33 and posterior variance 0.67. Raising R to 4 lowers K to 1/3 and moves the estimate to 4.67.
- Learning target: process uncertainty is added during prediction; a noisy sensor produces a small gain, while an uncertain prediction produces a large gain.
- Boundary note: the scalar lab is a readable slice of the matrix algorithm, not proof that a real robot is linear-Gaussian.

### Animated sequence

1. Latent world emits an ambiguous observation.
2. Action pushes prior belief through transition dynamics.
3. Observation likelihood corrects and normalizes the belief.
4. Policy selects an action from belief, including sensing actions.
5. Runtime estimator and policy are audited with separate diagnostics.

Every scene needs a compact input-operation-output flow, two metrics, and a sentence stating the invariant. Animation communicates execution order; it must not be decorative.

## Formula contract

Every display equation must have:

- a Korean `underbrace` or short aligned row inside KaTeX,
- a prose meaning that distinguishes assumptions from consequences,
- symbol definitions,
- `data-math-annotation-missing=false`,
- minimum mobile scale of 0.78 where possible and never below the global 0.52 floor,
- no horizontal scrolling.

Long Bayesian and Kalman equations must be rewritten as named intermediate rows rather than shrunk into a single line.

The article owns twelve display equations and twelve FormulaNotes after the deep pass: observation/history, POMDP tuple, full Bayes filter, belief control, four Kalman equations plus NIS, recurrent state/action, and masked burn-in loss. NIS is a consistency diagnostic rather than proof of sensor failure. Burn-in reconstructs hidden state but is not itself a calibrated belief update.

## Paper reconstruction contract

Each paper page records:

- the problem before the paper,
- author intent rather than retrospective hype,
- calculation order,
- two central equations,
- at least three evidence slices with what they do and do not support,
- implementation sequence,
- assumptions and failure conditions,
- the next paper or system component that repairs the gap.

## Publication QA

- 360, 768, and 1440 px: document overflow is zero.
- All display formulas are annotated and contain no KaTeX errors.
- Sliders change the posterior/gain and never resize the outer layout.
- The default and non-default Bayes-filter, active-sensing, and Kalman numeric oracles execute in Playwright.
- StepViz advances and scene content changes.
- The RL category count, paper track count, and learning-path links match actual routes.
- The concept article links back to probability/information theory and signals/systems, then forward to world models, safe RL, and Robot AI.
