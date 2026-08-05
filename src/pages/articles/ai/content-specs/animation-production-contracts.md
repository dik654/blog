# 2D Animation production contracts

## Reader outcome

독자는 최신 모델 이름을 고르는 데서 시작하지 않는다. 먼저 한 개의 짧은 animation shot에 대해 성공 조건과 보존해야 할 의도를 적고, base runtime을 측정한 뒤, 가장 작은 intervention을 선택하고, release evidence까지 남길 수 있어야 한다.

## Hidden transfer problem

8초짜리 2D action shot을 공개 가능한 base video model과 24GB GPU 두 대로 제작한다. 원본 reference는 24fps이지만 주요 drawing은 on twos이고, 13번째 frame은 smear, 25번째 frame은 impact pose다. 동일 캐릭터가 train 후보와 평가 후보 여러 source episode에 반복 등장한다. VLM caption은 camera pan을 object motion으로 잘못 적고 대사의 고유명사 하나를 틀렸다. Base는 style은 맞지만 손과 얼굴 identity가 3초 뒤 무너지고, 2배 VFI를 적용하면 smear와 impact가 약해진다. 사용자는 다음을 결정해야 한다.

1. 어떤 acceptance contract와 baseline trace를 먼저 고정하는가.
2. clip을 어떤 group으로 나누어 train/validation leakage를 막는가.
3. caption의 관측 사실·연출 의도·audio transcript를 어떻게 분리하고 고치는가.
4. Prompt, structural control, LoRA, full fine-tuning 중 무엇을 선택하고 무엇을 보존하는가.
5. Native cadence, VFI, motion blur 중 어느 단계가 각 artifact를 소유하는가.
6. 평균 점수가 높아도 release를 막아야 하는 hard gate는 무엇인가.

본문만 읽고 위 결정을 설명하고, 필요한 manifest와 failure report를 작성할 수 있어야 한다.

## Information architecture

1. **Animation production contract**: 목표, invariants, controllable variables, budget, rights, baseline과 intervention ladder.
2. **Dataset unit**: shot boundary, frame/time contract, group split, provenance, decode verification.
3. **Caption signal**: observable fact, directorial intent, audio/text, structured field, human review와 ablation.
4. **Adaptation and control**: prompt/condition/LoRA/full의 경계, LoRA math, IC-LoRA pair, retention validation과 rollback.
5. **Temporal finishing**: drawing cadence와 display FPS, hold/smear/impact, native generation과 interpolation, shutter integration, artifact ownership.
6. **Evaluation and release**: closed/open set, vector metric, hard gate, paired seed, earliest-failure trace, license/runtime manifest.

`ltx-animation-project`는 LTX runtime에 이 계약을 적용하는 구현 사례로만 남기며, animation 공통 경로의 선행 글로 승격하지 않는다.

## Source boundaries

- **AniMatrix**: Style·Motion·Camera·VFX taxonomy, dual-channel conditioning, animation-specific training/evaluation이라는 공개 claim에만 사용한다. 준비 중인 release를 이미 공개된 reproducible artifact로 서술하지 않는다.
- **AnimationBench**: animation-specific dimensions, closed-set/open-set 평가와 human alignment라는 논문 범위에만 사용한다. 모든 production studio의 release score로 일반화하지 않는다.
- **LTX-2 official trainer**: 실제 dataset columns, resolution bucket, preprocessing, LoRA/full/IC-LoRA 실행 계약, validation·checkpoint artifact와 자동 caption 검수 경고에만 사용한다. 예시 config 값을 보편 최적값으로 쓰지 않는다.
- **LoRA paper**: frozen base와 low-rank update의 수학적 원리에만 사용한다. 언어 모델 실험 결과를 video 품질 보장으로 옮기지 않는다.
- **AnimeInterp / RIFE**: 중간 frame을 추정하는 VFI mechanism과 animation-specific large/nonlinear motion failure에만 사용한다. 더 높은 FPS가 더 나은 animation이라는 근거로 쓰지 않는다.

## Formula contract

모든 display equation은 수식 안의 `underbrace`를 한국어로 쓰고 바로 다음에 `FormulaNote`를 둔다.

- Dataset: clip duration과 unique drawing ratio, group-disjoint split.
- Caption: structured condition과 conditional training objective.
- Adaptation: `W' = W + (alpha / r) BA`, trainable parameter count.
- Temporal: display time, interpolated frame, shutter interval integration.
- Evaluation: vector score와 hard-gate release decision.

## Visual contract

SVG box graph를 반복하지 않는다. 각 글은 같은 8초 shot을 다른 책임 관점으로 보여 주는 responsive HTML visual을 사용한다.

- 390px에서도 가로 내부 scroll 없이 읽힌다.
- Filmstrip은 frame 수를 고정하고 mobile에서 grid로 재배치한다.
- 색은 source, condition, intervention, risk를 구분할 때만 쓴다.
- 선보다 정렬, 간격, 단계 번호와 상태 변화로 흐름을 보인다.
- 여섯 visual은 단계 선택·이전/다음·자동 재생을 지원하고, 현재 판단 대상과 이미 확인한 단계를 상태 변화로 구분한다.

## Completion gate

- 여섯 글이 서로 다른 판단을 소유한다.
- 공통 경로 첫 글이 특정 모델 brand에 종속되지 않는다.
- 근거 없는 3~5초, rank 32 같은 universal default가 없다.
- hidden transfer problem의 모든 판단 근거가 본문에 있다.
- formula note, capability check, source note와 failure boundary가 보인다.
- 390/768/1440px에서 document, formula, visual overflow가 0이다.
