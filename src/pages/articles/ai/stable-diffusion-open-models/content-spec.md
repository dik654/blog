# Stable Diffusion open models content spec

## Goal
- Stable Diffusion을 checkpoint 이름이 아니라 condition, latent, denoiser, solver, decoder가 협력하는 실행 계약으로 이해한다.
- 같은 seed의 결과가 달라졌을 때 처음 달라진 tensor 경계로 원인을 좁히고, U-Net 계열과 MMDiT 계열 사이에서 무엇을 다시 선택해야 하는지 판단한다.

## Source anchors
| Area | Source | Why it matters |
|---|---|---|
| Latent diffusion | LDM paper, arXiv:2112.10752 | VAE latent와 cross-attention 조건 주입의 최소 역사 기준선 |
| Runtime components | Diffusers Stable Diffusion pipeline docs | Text encoder, U-Net, scheduler, VAE가 분리된 현재 구현 계약 |
| SDXL | SDXL technical report, arXiv:2307.01952 | 더 큰 U-Net, 두 text encoder, refiner의 근거 |
| SD3 | SD3 paper, arXiv:2403.03206 | MMDiT와 rectified flow로 바뀐 계산 골격 |
| SD3.5 | Stability AI SD3.5 release | QK normalization과 공개 variant의 공식 경계 |

## Full-scope map
| Topic | Must cover | Depth | Source anchor | Notes |
|---|---|---|---|---|
| Runtime graph | prompt에서 RGB까지 바뀌는 tensor와 owner | deep | Diffusers docs | UI parameter를 module boundary에 연결 |
| Latent math | VAE 압축, noisy latent, denoising update | deep | LDM | DDPM 전체 유도는 막힐 때만 하위 글로 이동 |
| Shape and cost | 512/1024 latent 위치 수와 attention 비용 | deep | LDM, SDXL | 해상도 증가를 무조건 4배로 단순화하지 않음 |
| U-Net conditioning | convolution, skip, self/cross-attention | deep | LDM, SDXL | LoRA가 모든 결함을 고치지 않는 이유 |
| Family lineage | SD1.x, SD2.x, SDXL, SD3/3.5의 delta | deep | primary papers | 성능 순위표가 아니라 상속과 호환 경계 |
| Adapters and control | LoRA, ControlNet, IP-Adapter, inpaint의 개입 위치 | brief | official papers/docs | 별도 학습·운영 글로 확장 |
| Release operations | seed, sampler, VAE, adapter를 고정한 A/B와 manifest | deep | runtime contract | 결과 미감 대신 재현 증거를 남김 |
| Current leaderboard | 최신 폐쇄형 모델 순위 | defer | none | 이 글은 2026 최고 모델 표가 아니라 공개 구조 기준선 |

## Reader prerequisites
- Tensor shape: 데이터가 가진 축과 각 축의 크기다.
- VAE: 큰 RGB 이미지를 작은 latent grid로 압축하고 다시 복원하는 모델이다.
- Attention: query가 key와 맞는 정도로 value를 섞는 계산이다.
- Numerical solver: 모델의 예측을 사용해 현재 상태를 다음 상태로 이동시키는 수치 규칙이다.

## Section 1: Runtime contract -- 어느 tensor가 언제 바뀌는가
- Concept: 모델 weight와 sampler, prompt, VAE의 책임을 분리한다.
- Key variables:
  - `c`: text encoder가 만든 condition sequence.
  - `z_t`: timestep `t`의 noisy latent, SD1.x 512 기준 예시 shape `[1,4,64,64]`.
  - `epsilon_hat` 또는 `v_hat`: denoiser가 예측한 제거 방향.
  - `z_{t-1}`: solver가 계산한 다음 latent.
- Execution flow:
  1. Prompt를 token과 condition `c`로 바꾼다.
  2. Seed에서 initial noise `z_T`를 만든다.
  3. Denoiser가 `z_t,t,c`에서 제거 방향을 예측한다.
  4. Solver가 다음 latent로 이동하고 반복한다.
  5. VAE decoder가 `z_0`를 RGB로 바꾼다.
- Design insight:
  - Denoiser는 방향을 예측하고 solver는 실제 상태를 이동한다. 둘을 같은 “sampler”로 뭉개면 weight 결함과 수치 경로 결함을 구분할 수 없다.
- Failure modes:
  - Prompt token이 잘렸으면 latent·VAE를 바꿔도 누락된 개념이 돌아오지 않는다.
  - Stable latent 뒤에서만 색과 경계가 무너지면 decoder가 첫 의심 경계다.
- Viz plan:
  - Scene 1: prompt, token, text embedding receipt.
  - Scene 2: seed와 latent shape receipt.
  - Scene 3: denoiser의 세 입력과 prediction.
  - Scene 4: solver update와 반복되는 state.
  - Scene 5: final latent와 RGB decode.

## Section 2: Architecture delta -- U-Net과 MMDiT에서 무엇이 달라지는가
- Concept: 공통 외부 계약 안에서 내부 mixing 골격이 어떻게 바뀌는지 보여 준다.
- Execution flow:
  1. 두 계열 모두 condition, noisy latent, timestep을 받는다는 공통점을 고정한다.
  2. U-Net은 여러 해상도의 feature map과 skip connection을 사용한다.
  3. Cross-attention은 image query가 text key/value를 조회한다.
  4. MMDiT는 image와 text token을 joint attention에서 함께 갱신한다.
  5. Adapter target, text encoder, scheduler 의미를 다시 선택한다.
- Design insight:
  - “Diffusion model”이라는 이름은 외부 loop를 말할 뿐, 내부 denoiser topology의 호환성을 보장하지 않는다.
- Failure modes:
  - SDXL LoRA target과 strength를 SD3.5에 그대로 복사하면 module address와 학습 신호가 달라진다.
  - SDXL sampler 이름을 flow pipeline에서 같은 의미라고 가정하면 integration path가 달라진다.
- Viz plan:
  - Scene 1: shared input/output contract.
  - Scene 2: U-Net multi-resolution path.
  - Scene 3: skip과 cross-attention의 서로 다른 정보 경로.
  - Scene 4: modality-specific projection과 joint attention.
  - Scene 5: inherited versus reselected migration ledger.

## Section 3: Family milestones -- 무엇을 상속하고 무엇을 다시 골랐는가
- SD1.x: LDM 실행 계약의 공개 baseline.
- SD2.x: U-Net skeleton을 유지하지만 encoder와 data contract가 달라진 호환 경계.
- SDXL: U-Net을 키우고 text encoder를 두 개로 늘리며 1024와 optional refiner를 기준으로 만든 단계.
- SD3/3.5: MMDiT와 flow objective로 denoiser와 solver semantics가 바뀐 단계.
- Presentation plan:
  - 표를 쓰지 않는다.
  - 큰 번호와 질문, `상속 / 변경 / 복사 금지` 세 문장으로 이어지는 세로 milestone을 쓴다.

## Hidden transfer validation
- 같은 seed와 composition은 유지되지만 특정 prompt token만 무시된다. Text truncation, encoder, CFG를 먼저 열 수 있어야 한다.
- Denoising 동안 latent 통계는 안정적인데 마지막 RGB에서만 색과 얇은 선이 무너진다. VAE decoder를 첫 원인으로 선택할 수 있어야 한다.
- Weight와 prompt를 고정하고 scheduler만 바꿨을 때 결과 차이를 model weight 개선이라고 부르지 않아야 한다.
- SDXL LoRA recipe를 SD3.5에 이식하기 전에 target module, text encoder, prediction target, scheduler를 다시 확인해야 한다.

## Cross-section narrative
- 실행 계약을 먼저 고정해야 architecture 이름이 바뀌어도 공통 경계와 변경 경계를 나눌 수 있다.
- Architecture delta를 이해해야 family milestone이 버전 암기가 아니라 호환성 판단이 된다.
- 마지막 운영 절에서는 각 경계의 입력, 출력, revision을 manifest로 고정해 재현 가능한 A/B로 닫는다.

## Coverage recheck
| Scope item | Covered by section | Gap | Fix |
|---|---|---|---|
| Prompt to RGB runtime | Runtime contract | none | five-scene causal Viz |
| U-Net internal flow | Architecture delta | none | multi-resolution scene |
| MMDiT difference | Architecture delta | none | joint-attention scene |
| Version compatibility | Family milestones | none | inherited/change/do-not-copy prose |
| Latest closed model ranking | Deferred | intentional | current boundary note only |
| Deep DDPM derivation | Deferred | intentional | open lower foundation only when formula blocks |
