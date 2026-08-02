# AI Foundations foundational paper spine

## Placement rule

Papers are not a separate historical appendix. Each one appears immediately after the reader has the minimum concept and arithmetic needed to reconstruct it.

| Concept checkpoint | Paper article | Dependency inherited | Mechanism contributed | Next dependency created |
|---|---|---|---|---|
| Perceptron | Rosenblatt 1958 | Weighted score and reinforcement | Learnable connection strengths and statistical generalization | Linear separability limit |
| Backpropagation | Rumelhart, Hinton, Williams 1986 | Differentiable hidden layers and scalar error | Reverse credit assignment learns internal features | Optimization trajectory and deep trainability |
| Optimizer | Kingma & Ba 2014 | Stochastic gradient and momentum | First/second moment state with bias correction | Adaptive regularization mismatch |
| Optimizer | Loshchilov & Hutter 2017 | Adam state transition | Decoupled parameter decay | Parameter groups and schedules |
| Representation learning | Hinton & Salakhutdinov 2006 | Encoder, bottleneck, reconstruction | Deep nonlinear low-dimensional code | Probabilistic and constrained latent models |
| Signal branch | Cooley & Tukey 1965 | DFT and complex basis | Factorized exact transform computation | Sampling, STFT and spectral systems |
| NLP branch | Mikolov et al. 2013 | Context pairs and prediction objective | Scalable static word-vector training | Negative sampling and contextual representation |

## Article contract

Each public paper route contains six stable sections: context, claim reconstruction, equations, evidence, reproduction and legacy. It must expose author intent and evidence limits, not only abstract prose. The private mastery audit tests whether a reader can implement a minimal version and diagnose one failure using only the public route.

## Expansion policy

Later candidates include McCulloch–Pitts for threshold logic, Glorot initialization, ReLU, dropout, batch normalization and modern representation-learning papers. They are added only after the prerequisite graph shows a real explanatory gap; citation count or recency alone is not sufficient.

This spine follows `knowledge/authoring/foundation-floor-policy.md`. Per concept, the required route defaults to one canonical foundation and one current evidence source. A cited predecessor is kept as lineage unless it adds a unique premise required by the private hardest problem. The path never recurses below the declared mathematics/science floor merely to establish historical priority.
