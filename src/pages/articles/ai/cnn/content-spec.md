# CNN article contract

## Reader contract

- Starts at one output cell, not at architecture history.
- Reconstructs `pixel -> local window -> shared kernel -> feature map -> task head`.
- Distinguishes cross-correlation from textbook convolution and equivariance from invariance.
- Stops at the minimum floor needed for ResNet and modern vision backbones.

## Private transfer problem

A 3840x2160 inspection image contains a 2 px scratch. Decide why 224x224 resize destroys the signal, then design crop scale, overlap, stride, source-coordinate inversion, slice metrics, and runtime evidence before changing the backbone.

## Formula contract

Every display formula includes Korean internal annotations and a `FormulaNote` beginning with `이 식은`:

1. Indexed Conv2d output cell.
2. Translation equivariance boundary.
3. Output geometry with dilation.
4. Jump and receptive-field recurrence.

## Viz contract

- `ConvolutionProbeLab`: change one kernel while preserving the same input and expose the resulting weighted sum.
- `ConvolutionGeometryLab`: separate standard, dilated, and depthwise connection contracts.
- No fixed-width SVG, horizontal scroll, or unexplained animation.

## Small-model packet

### 4B

Write only the execution chain, four formulas, one 4K defect transfer problem, and claim boundaries from official PyTorch docs plus primary papers. Never invent benchmark numbers.

### 9B

Add boundary conditions for stride, padding, dilation, groups, device latency, coordinate inversion, and the CNN/Transformer selection boundary. Reject any draft that calls convolution itself translation invariant.
