# Latent Diffusion Models (2021) source closure content spec

## Goal
- `diffusion-models` 안에서 Latent Diffusion의 perceptual compression, latent objective, cross-attention condition과 compute-quality trade-off를 원문 근거로 닫는다.
- Stable Diffusion 사용법과 LDM 논문의 설계 근거를 섞지 않는다.

## Ownership
- `diffusion-models`: DDPM -> latent compression -> conditional LDM의 수학·근거.
- `stable-diffusion-open-models`: checkpoint, CFG, ControlNet, LoRA와 runtime debugging.
- `image-model-runtime`: tensor/memory/runtime release contract.

## Source anchors
| Area | Rombach et al. | Required reading |
|---|---|---|
| Perceptual compression | Figure 2, Section 3.1 | imperceptible detail을 먼저 제거하는 이유 |
| Latent objective | Eq. 2 | pixel `x_t` 대신 latent `z_t`에서 noise prediction |
| Conditioning | Eq. 3, Figure 3 | domain encoder `tau_theta`와 cross-attention |
| Compression sweep | Figures 6-7 | f가 너무 작거나 큰 두 실패 |
| Compute receipt | Table 6 | pixel 대비 처리량/FID trade-off |
| Limits | Section 5 | sequential sampling, pixel-precision bottleneck |

## Section plan
1. DDPM evidence 뒤에 LDM bridge를 둔다.
2. `f=H/h=W/w`와 latent grid 크기를 계산한다.
3. `L_LDM=E||epsilon-epsilon_theta(z_t,t)||^2`.
4. `L_LDM=E||epsilon-epsilon_theta(z_t,t,tau_theta(y))||^2`.
5. Compression explorer:
   - f=1,2: semantic compression 부담과 느린 학습.
   - f=4,8: 논문이 관측한 균형 구간.
   - f=16,32: reconstruction 정보 손실.
6. Evidence:
   - training and sampling throughput at least 2.7x between pixel and latent variants in the inpainting comparison.
   - FID improvement at least 1.6x in that comparison.
   - claim is scoped to paper setup, not universal hardware speedup.
7. Limits and handoff.

## Authoring-only transfer problem
> f=32 model trains fast but cannot reconstruct small text; f=1 reconstructs exactly but learns semantics slowly. Choose what to measure, which module owns each failure and why “larger compression is always better” is false.

## Stop rule
Explain two-stage training, the latent/conditional objective, the f trade-off and source-scoped compute evidence. Task-specific super-resolution, inpainting and layout-to-image experiments remain references, not required prerequisites.
