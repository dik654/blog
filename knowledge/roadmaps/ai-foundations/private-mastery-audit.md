# AI Foundations private mastery audit

This is an authoring QA artifact. The problems and answer keys must not be rendered as public article sections. A public article passes only when a reader can reconstruct the reasoning path below from the prose, equations, numeric examples and Viz.

## Global pass contract

- **Numeric**: every quantity needed for a complete calculation is introduced and at least one end-to-end example is inspectable.
- **Shape**: a reader can trace sample, batch, parameter and output dimensions at every boundary.
- **Mechanism**: a reader can explain why the operation exists, not only name it.
- **Failure**: at least one plausible counterexample separates a mechanism's guarantee from its usual behavior.
- **Evidence**: historical and empirical claims point to a primary paper or official implementation contract.
- **Visual**: changing a control changes real data, and the causal difference is readable at 360, 768 and 1440 px without horizontal scrolling.

## Private transfer problems

### Deep learning overview

Given `x=2`, `y=5`, `ŷ=wx+b`, squared loss, `w=1`, `b=0`, and learning rate `0.1`, compute forward, loss, both gradients and one update. Then explain why the lower loss on this sample does not establish generalization. Extend the trace to a mini-batch and name which operation can run in parallel on a GPU.

Required public evidence: a single-number loop, parameter/data distinction, mini-batch aggregation, training/evaluation/generalization boundary, compute/memory/communication distinction.

### Perceptron

For a two-feature classifier, derive the decision boundary from `(w,b)`, predict four Boolean inputs, apply two mistake-driven updates and redraw the boundary. Prove why no single line classifies XOR, then identify the minimum architectural change that removes this representational limit without claiming a convergence guarantee.

Required public evidence: contribution arithmetic, bias translation, shared-coordinate boundary Viz, update before/after, separability condition, XOR counterexample.

### Neural network

Trace a batch `[B,2]` through weights `[3,2]` and `[2,3]` under the repository's matrix convention. Compute one sample numerically, show where bias broadcasts, and determine the correct output head and target shape for regression, binary, multiclass and multilabel tasks. Diagnose a transposed-weight implementation whose code runs for `B=1` but fails for a batch.

Required public evidence: value flow and shape flow, sample/batch distinction, full forward arithmetic, output/loss contract, parameter-count check.

### Activation functions

Algebraically collapse three affine layers with no nonlinearity. Then compute activation and derivative values for sigmoid, tanh, ReLU and GELU at selected inputs, predict a six-layer gradient product, and choose an activation under sparse input, negative pre-activations and gated-output constraints. Diagnose dying ReLU separately from vanishing sigmoid.

Required public evidence: linear-collapse proof, paired function/derivative plot, saturation and dead-region distinction, activation-selection boundary.

### Cross-entropy

Starting from logits `[1000, 999, 997]`, compute stable log-softmax and the target-class NLL without overflow. Derive `dL/dz = p-y`, compare the loss for a correct probability of `0.9` and `0.1`, and explain the entropy-plus-KL decomposition without treating KL as a symmetric distance.

Required public evidence: likelihood-to-NLL derivation, information cost, stable log-sum-exp, exact softmax/CE gradient, entropy/KL scope.

### Backpropagation

For a DAG where one activation feeds two branches that later sum into a scalar loss, perform the forward pass, store local derivatives, reverse the graph and accumulate both gradient paths. Express one dense layer backward as vector-Jacobian products and verify one weight with central finite differences. Explain why backward does not update parameters.

Required public evidence: computation graph, upstream × local rule, fan-out accumulation, reverse-mode complexity, tensor layer backward, grad-check tolerance.

### Optimizers

Given a three-step gradient sequence, compute SGD, Momentum and Adam state/update values including Adam bias correction. Apply Adam+L2 and AdamW to the same parameter and show why the updates differ. Predict the effect of changing batch size, learning rate and decay target groups, then diagnose a trajectory that oscillates across a narrow valley.

Required public evidence: gradient/update distinction, noise scale, comparable loss landscape, moment state ledger, bias correction, decoupled decay.

### Autoencoder

Compute a `2→1→2` forward pass, reconstruction loss and gradients for encoder and decoder. Compare an undercomplete model with an overcomplete identity solution, then design evaluation slices that separate pixel reconstruction, latent usefulness and anomaly detection. Explain why a bottleneck alone does not guarantee disentanglement.

Required public evidence: encoder/latent/decoder flow, numeric reconstruction, backward through both halves, capacity/regularization failure, downstream evaluation.

### FFT

Compute a four-point DFT directly and through a radix-2 butterfly, verifying identical complex outputs. Predict aliasing for a tone above Nyquist, spectral leakage for a non-integer window, and the effect of zero-padding. Separate mathematical complexity from wall-clock behavior and identify when convolution should remain spatial rather than use an FFT.

Required public evidence: time/frequency dual view, complex projection, butterfly reuse, sampling/window/STFT, actual-use boundary.

### Word2Vec

Generate Skip-gram and CBOW pairs under two window sizes, compute one negative-sampling loss and selected-row gradients, and explain why two words with similar contexts can still be antonyms. Diagnose frequency dominance, subsampling, static polysemy and corpus bias, then state what contextual embeddings change.

Required public evidence: real pair generator, two objective directions, negative sampling arithmetic, geometry checks, static/contextual handoff.

## Math and science prerequisites

- **Linear algebra**: find a shape error across batched matmul, transpose and broadcasting; repair it and compute one output row.
- **Calculus**: move from scalar derivative to gradient, Jacobian and VJP on the same graph; explain why a full Jacobian need not be materialized.
- **Probability and information**: convert probability products to NLL sums and distinguish expectation under the data distribution from model entropy.
- **Statistics and generalization**: design a train/validation/test split under time drift and group leakage; interpret loss, accuracy and calibration separately.

## Completion ledger

An article is not complete because it is long. It is complete when every required public evidence item above has a visible location, the hardest transfer problem has no missing premise, primary-source claims have a provenance row, and the full route passes responsive and formula audits.
