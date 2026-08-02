# Cross-entropy article specification

## Reader contract

- Audience: readers who know logits and softmax at a surface level but cannot yet derive the classification loss.
- Entry knowledge: probability sums to one, logarithm basics, gradient descent direction.
- Exit capability: connect maximum likelihood, NLL, cross-entropy, `p-y`, log-sum-exp, entropy, and KL without memorizing isolated formulas.

## Narrative spine

1. Convert probability into additive information cost with `-log p`.
2. Hold the dataset fixed and maximize its likelihood under model parameters.
3. Turn the likelihood product into an NLL sum; show why one-hot CE selects only the correct class.
4. Let the reader move the correct-class probability and observe the nonlinear penalty.
5. Derive softmax plus CE at the logit boundary and interpret `p-y` numerically.
6. Preserve the math in code with fused log-sum-exp computation and correct target contracts.
7. Decompose cross-entropy into data entropy plus model mismatch, then test operational understanding.

## Visual rules

- No decorative scene may appear before its question and explanatory paragraph.
- Every formula is rendered through KaTeX and followed by symbol-level interpretation.
- Tables collapse into labelled rows on mobile; no essential data requires horizontal scrolling.
- The probability explorer must remain valid at both slider endpoints and keep all class probabilities summing to one.
- Use blue only for the selected/correct signal, neutral gray for alternatives, rose for incorrect update direction, and green for validated implementation.

## Scope boundary

- Include single-label multiclass CE, the binary/multi-label distinction, class weights, label smoothing, and numerical stability.
- Do not turn the article into a full information-theory course; mutual information and coding theorems belong in a later math foundation article.
- Do not re-teach the full backpropagation graph; link the output gradient back to the preceding article conceptually.
