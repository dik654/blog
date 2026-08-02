# Autoencoder article specification

## Reader contract

- Audience: readers who completed the forward, cross-entropy, backpropagation, and optimizer foundation path.
- Entry knowledge: affine layer, activation, MSE, chain rule, train/validation distinction.
- Exit capability: treat an autoencoder as a full training system, evaluate its representation separately from reconstruction, and distinguish major variants by their learning pressure.

## Narrative spine

1. Replace external labels with input reconstruction and map `x -> z -> x-hat` onto the existing learning loop.
2. Challenge the assumption that a narrow bottleneck automatically captures semantic meaning.
3. Compute a live 2-to-1-to-2 forward pass and MSE from reader-controlled input values.
4. Trace reconstruction error through decoder, latent code, and encoder weights.
5. Separate reconstruction, representation, compression, anomaly detection, and robustness metrics.
6. Classify variants by what changes: corrupted input, latent penalty, distribution, quantization, or masking.

## Visual rules

- Replace the old 130-button scene sequence with one live reconstruction explorer.
- Both input sliders must work at 0 and 1 in all combinations without layout shift or numerical failure.
- Use vertical flow on mobile and horizontal flow only when stage labels remain readable.
- Render every formula with KaTeX and split the VAE objective from its symbol explanation.
- Do not use a generic decorative latent-space scatterplot without a defined dataset and metric.

## Accuracy boundaries

- A bottleneck creates capacity pressure; it does not guarantee semantics, denoising, or disentanglement.
- State the conditions around the linear-autoencoder/PCA relationship instead of claiming equality without qualification.
- Treat anomaly detection as an evaluated application, not an automatic consequence of normal-data training.
- Distinguish deterministic reconstruction from VAE distribution learning and latent diffusion denoising.
- Do not call BERT a standard autoencoder merely because it reconstructs masked tokens.
