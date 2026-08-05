# Chinchilla 2022 · source reconstruction contract

## Reader decision

The reader must reconstruct how Hoffmann et al. estimated a compute-efficient frontier with three
independent methods, then tested that prediction with a compute-matched 70B model. The article must
not turn the observed 70B:1.4T ratio into a timeless 20-tokens-per-parameter law.

## Primary source boundary

- Primary paper: Hoffmann et al., *Training Compute-Optimal Large Language Models*, 2022.
- Preserve the three approaches: training-curve envelope, IsoFLOP valleys and parametric loss fit.
- Preserve real ranges, fitted constants, exponents and the Gopher-matched full-run receipt.
- Distinguish the 2022 training-compute question from later inference-aware and test-time-compute work.
- State the paper's own large-run, power-law, curvature and less-than-one-epoch limitations.

## Private transfer problem

The finished article alone must let a reader:

1. Explain why `C≈6ND` leaves many feasible parameter/token allocations.
2. Reconstruct what data point each of the three approaches treats as evidence.
3. Derive `a=β/(α+β)` and `b=α/(α+β)` from the fitted loss exponents.
4. Compare a 16× compute increase under Chinchilla and Kaplan allocation exponents.
5. Explain why 70B/1.4T and 280B/300B are a matched-compute causal test, not only a benchmark table.
6. Identify the downstream exceptions and contamination/evaluation caveats.
7. Decide which claims must move to the later inference-aware scaling article.

## Viz contract

- `ChinchillaApproachLab`: three source methods, observations, fit, results and failure boundary.
- `ComputeAllocationLab`: deterministic relative compute allocation for Chinchilla vs Kaplan.
- `ChinchillaEvidenceLab`: matched compute, downstream receipts and paper-stated limitations.

No HTML table, horizontal scroll, raw LaTeX or formula text below 12 px at 390 px.
