# AI Math & Science foundation specification

## Decision

AI Foundations needs four just-in-time mathematical foundations: linear algebra, calculus, probability, and statistics. They are separate from the core model path so readers can enter them when a symbol first becomes necessary. Physics is not a common prerequisite for the current deep-learning path; coordinate frames, kinematics, dynamics, state estimation, and feedback control belong in the Robot AI path where they can be tied to sensors and actions.

## Reader contract

- Audience: programmers who can follow arithmetic and code but did not complete university mathematics in sequence.
- Teaching unit: one operational question, one numeric or interactive example, rendered formulas, symbol interpretation, failure conditions, then a capability check.
- No article is a glossary. Every concept must change what the reader can calculate, inspect, or debug.
- The main AI article remains readable without finishing all four math articles first; each core phase links to the required article at first use.

## Article boundaries

### Linear algebra and tensors

- Coordinates, norm, dot product, projection, matrix multiplication, batch axes, tensor rank, and broadcasting.
- Exit task: calculate neural-layer output shapes before running code.
- Defer eigenvalues, SVD, and matrix calculus until they have a model-level use case.

### Calculus and computational graphs

- Local slope, partial derivative, gradient, chain rule, Jacobian shape, VJP, and finite-difference checking.
- Exit task: trace scalar loss sensitivity through a vector computation without materializing a full Jacobian.
- Defer measure-theoretic analysis and differential equations.

### Probability and information theory

- Random variable, distribution, expectation, variance, conditional probability, Bayes rule, likelihood, entropy, cross-entropy, and KL.
- Exit task: distinguish data uncertainty, model likelihood, and information cost.
- Use a clearly hypothetical base-rate example; do not present it as medical advice.

### Statistics and generalization

- Population and sample, empirical versus deployment risk, split roles, leakage, overfitting, bias-variance conditions, calibration, and repeated experiments.
- Exit task: design a validation scheme that matches deployment and explain what its score does not prove.
- Do not reduce generalization to model size or one universal bias-variance curve.

## UI and verification

- New articles live under `ai-math-foundations`; the four gap rows on the Foundations page link to them.
- All formulas use KaTeX and are split before 360px horizontal scrolling is needed.
- Interactive extremes are mandatory test states: vector angle 0/180, derivative x -2/2, Bernoulli p 0/1.
- SVG circles, arrows, and tangent segments stay inside their viewBox at every extreme.
- Tables collapse into labelled rows. No learning content depends on horizontal scrolling.
