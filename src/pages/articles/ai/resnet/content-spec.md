# ResNet article contract

## Reader contract

- Starts from the training-error degradation problem, not a generic "vanishing gradient solved" slogan.
- Separates representation capacity, optimization, forward preservation, and backward identity paths.
- Reconstructs identity and projection shortcuts with explicit tensor shapes.
- Stops at the original ResNet and identity-mapping papers; earlier classification history is optional.

## Private transfer suite

1. Separate optimization degradation (`train` error also rises) from overfitting (`train` falls, `test` rises).
2. For `56x56x64 -> 28x28x128`, compare option A subsample+zero-pad and option B `1x1,s=2` projection, including MAC and backward shortcut Jacobian.
3. Use scalar residual Jacobians `-0.5` and `-1` to show that identity terms can still cancel across blocks.
4. Compare the post-add ReLU gate in v1 with the clean addition path in full pre-activation v2.
5. Derive basic and bottleneck MAC at `H=W=56,d=64`; explain why the expensive `3x3` runs at the narrow width.
6. Carry the invariant into ViT while separating NCHW+BN+convolution from token+LN+attention operators.

## Formula contract

1. `x_{l+1}=x_l+F_l(x_l)` with Korean roles.
2. Backward identity plus residual Jacobian, with an explicit cancellation boundary.
3. Post-activation v1 ReLU gate versus full pre-activation clean path.
4. Projection shortcut, shape equality, and `J_F+W_s` backward boundary.
5. Unrolled accumulation across blocks.
6. Basic versus bottleneck MAC.

## Viz contract

- `ResidualPathLab`: compare plain, identity, and projection paths while changing a numeric local Jacobian and post-add ReLU gate.
- `ResidualStageLab`: compare identity, option A pad, and option B projection with shape, MAC, and shortcut-Jacobian consequences.
- `BottleneckCostLab`: derive the channel path and MAC rather than showing architecture names alone.
- Labels remain 12 px or larger and no content depends on hover.

## Small-model packet

### 4B

Anchor every section to degradation, residual update, identity gradient, or shape contract. Use only the original and identity-mapping papers as factual sources.

### 9B

Add pre-activation boundaries, tensor-shape transfer cases, normalization-state release checks, and explicit warnings that residual connections do not eliminate all optimization failures.
