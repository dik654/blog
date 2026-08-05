# AI Foundations source-intent ledger

This private ledger records why the public curriculum, paper spine and deep sections exist. It prevents silent invention, chronology-only storytelling and source summaries that omit implementation boundaries.

## Curriculum intent

The core order follows one parameter update: data -> model -> prediction -> objective -> gradient -> optimizer -> learned representation. Math is inserted just in time at the first operation that needs it. Papers are inserted after the concept needed to read them, so a reader can reconstruct the authors' problem rather than accept a historical slogan.

## Concept articles

| Article | Primary anchors | Original evidence retained | Public transformation intent | Critical boundary |
|---|---|---|---|---|
| Deep learning overview | Goodfellow, Bengio, Courville, *Deep Learning*, chapters 5–8; PyTorch autograd contract | Model, objective, gradient method and generalization are distinct system concerns | One scalar learning loop reused as the coordinate system for every later article | A lower training loss is not proof of generalization or system efficiency |
| Perceptron | Rosenblatt 1958; perceptron convergence result | Learnable connection strengths, linear decision and separability condition | Contribution ledger, shared boundary coordinates, mistake update and XOR failure | Original paper is broader than the modern single-layer classifier |
| Neural network | Rumelhart et al. 1986; framework Linear-layer shape contract | Hidden representations arise from composition and error-driven learning | Shape-first pipeline, numeric forward and task-specific output contracts | More width/depth alone does not guarantee trainability or generalization |
| Activation functions | Glorot & Bengio 2010; Nair & Hinton 2010; GELU paper | Saturation, gradient flow and nonlinear composition are separate selection pressures | Function and derivative share one coordinate system; failure mode precedes family list | Biological neuron metaphors are not the mathematical justification |
| Cross-entropy | Shannon information; maximum likelihood; stable softmax implementations | Negative log likelihood is an objective derived from a probability model | Probability cost, likelihood product-to-sum, exact gradient and log-sum-exp implementation | KL is not symmetric; confident probability is not calibrated probability |
| Backpropagation | Rumelhart et al. 1986; reverse-mode AD literature; framework gradcheck | Local derivatives and reverse reuse efficiently compute scalar-loss gradients | Computation graph, accumulation, VJP and finite-difference check in one trace | Backward computes gradients; an optimizer performs updates |
| Optimizers | Polyak momentum; Kingma & Ba 2014; Loshchilov & Hutter 2017 | Direction memory, coordinate scale, bias correction and decay are different state transitions | Same gradient sequence and landscape across algorithms, with visible state ledgers | Adam+L2 is not AdamW; benchmark wins are not universal dominance |
| Autoencoder | Hinton & Salakhutdinov 2006; denoising and sparse AE follow-ups | Reconstruction and bottleneck can learn nonlinear codes under explicit assumptions | `8→2→8` architecture, `2→1→2` numeric trace, evaluation/failure matrix | Reconstruction quality does not guarantee semantics or disentanglement |
| FFT | Cooley & Tukey 1965; DFT definition and sampling theorem | Factorization reuses exact DFT subcomputations | Coupled time/spectrum controls, complex projection and butterfly execution | FFT is an algorithm for the DFT, not a different approximate transform |
| Word2Vec | Mikolov et al. 2013 architecture paper; negative-sampling follow-up | Simplified context prediction scales static vector learning | Window-to-pair compiler, objective direction and selected-row gradients | Negative sampling is a follow-up contribution; similar context is not complete meaning |

## Foundational paper articles

Every paper article preserves this chain: previous bottleneck -> author intent -> executable thesis -> mechanism -> equation semantics -> evidence intervention -> support and limit -> reproduction -> legacy.

| Public slug | Primary source | Why it is placed here | Author-intent boundary |
|---|---|---|---|
| `paper-perceptron-1958` | DOI `10.1037/h0042519`; PubMed `13602029` | After linear score and mistake updates are computable | Do not reduce the full probabilistic cognitive-system proposal to one modern equation |
| `paper-backprop-1986` | Nature DOI `10.1038/323533a0`; Hinton publication archive | After chain rule and hidden layers are understood | The central claim is learned internal representation, not only faster differentiation |
| `paper-adam-2014` | arXiv `1412.6980` | After optimizer state and gradient noise | Practical empirical evidence does not make Adam universally best |
| `paper-adamw-2017` | arXiv `1711.05101` | Immediately after Adam so the non-equivalence is visible | Decoupled decay must remain outside adaptive gradient normalization |
| `paper-autoencoder-2006` | Science DOI `10.1126/science.1127647`; PMID `16873662` | After deterministic reconstruction and bottleneck | Layer-wise RBM pretraining was central in the historical setting, not a modern universal requirement |
| `paper-fft-1965` | AMS DOI `10.1090/S0025-5718-1965-0178586-1`; IBM archive | After DFT output is understood | Complexity reduction preserves the transform and does not settle hardware performance |
| `paper-word2vec-2013` | arXiv `1301.3781` | After context pairs and static embedding geometry | Separate the first architecture paper from later negative sampling and subsampling work |

## Provenance maintenance

- Claim changes update this ledger and the public SourceNotes together.
- New company research is treated as primary evidence for that company's system, not universal evidence for the field.
- A new paper is inserted as a foundation node only if a dependent article cannot explain its mechanism without it.
- Experimental values are labeled reported, reproduced or illustrative. These labels must never be silently interchanged.
- Figure and table interpretation records both what the comparison supports and what it does not establish.
