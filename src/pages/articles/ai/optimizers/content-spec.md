# Optimizers article specification

## Reader contract

- Audience: readers who can follow backpropagation but treat SGD, Momentum, Adam, and AdamW as memorized recipes.
- Entry knowledge: gradient direction, chain rule, mini-batch, train/validation split.
- Exit capability: trace `gradient -> optimizer state -> update`, diagnose common trajectory behavior, and choose a defensible baseline.

## Narrative spine

1. Separate backward's gradient from the optimizer's actual update.
2. Explain mini-batch gradient as an unbiased noisy estimator and expose the batch-size tradeoff.
3. Hold one anisotropic quadratic surface fixed and compare SGD, Momentum, and Adam trajectories interactively.
4. Open Momentum state and show cancellation versus accumulation.
5. Open Adam state: first moment, second raw moment, bias correction, epsilon, and memory cost.
6. Separate adaptive loss update from AdamW decay, then connect scheduler, warmup, parameter groups, and validation.

## Visual rules

- One central trajectory explorer replaces repeated full-scene animations.
- The explorer must support every optimizer tab and steps 0 through 24 without clipping at 360px.
- Use the same start point, loss function, and number of updates across optimizer comparisons.
- Formulas must be rendered with KaTeX, split into independent boxes on narrow screens, and followed by symbol interpretation.
- Desktop tables must collapse into readable labelled rows when four or more numeric columns would become cramped.

## Accuracy boundaries

- State explicitly that a quadratic visualization is diagnostic intuition, not a universal optimizer ranking.
- Do not claim fixed batch sizes, learning rates, or optimizer choices as universal defaults.
- Distinguish second raw moment from statistical variance.
- Note that implementation conventions for Momentum differ across libraries.
- Treat optimizer, schedule, batch size, clipping, and regularization as a coupled experimental configuration.
