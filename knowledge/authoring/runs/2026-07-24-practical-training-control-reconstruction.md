# Practical training control reconstruction

Date: 2026-07-24 KST

## Scope

기존 `Training Loop → Transfer → LR Schedule → Regularization` 선형 경로를 다음 구조로 바꿨다.

```text
재현 가능한 training run
├─ pretrained representation 적응
├─ optimizer update 시간축 제어
└─ 관측된 일반화 실패에 개입
```

기존 네 article slug는 유지했다.

- `training-pipeline`
- `transfer-learning-practice`
- `lr-scheduling`
- `regularization-practice`

설계 원장은
`src/pages/articles/ai/content-specs/practical-training-control.md`다.

## Why this structure

Transfer learning, learning-rate schedule과 regularization은 앞 단계가 끝나야 다음 단계로 가는
순서가 아니다. 세 가지 모두 sample·split·optimizer update·checkpoint·validation 소유권을 가진
공통 run에서 갈라지는 독립 결정이다.

따라서 sidebar authored path도 다음 네 목표로 분리했다.

1. 중단되어도 같은 실험으로 돌아오기
2. Pretrained model에 가장 작은 충분한 적응 적용
3. Optimizer update의 시간축과 크기 제어
4. 관측된 일반화 실패에서 개입 선택

각 branch article의 학습 rail에는 공통 `training-pipeline` root가 먼저 나타난다. Category page는
이 subcategory에서 full path를 펼쳐 연결점을 직접 보여 준다.

## Hard transfer questions

본문을 쓰기 전에 다음 비공개 문제를 만들었다. 문제를 article quiz로 싣는 대신 본문이 해법에
필요한 판단 축을 제공하는지 역으로 검사했다.

1. AMP와 4-step accumulation run이 microstep 3에서 죽었을 때 double update 없이 어디서
   재개해야 하는가?
2. 같은 seed인데 resume 뒤 sample order와 dropout mask가 바뀌었다면 어떤 state가 빠졌는가?
3. Linear probe는 좋지만 full tune이 나쁠 때 representation 부족과 optimization damage를
   어떻게 구분하는가?
4. Accumulation을 8배로 바꾸면 cosine total steps가 왜 같은 microbatch 수에서도 달라지는가?
5. Average metric은 유지되지만 rare slice와 calibration만 나빠질 때 어떤 개입을 먼저 비교하는가?
6. Validation으로 checkpoint와 intervention을 고른 뒤 같은 validation을 최종 성능으로 보고하면
   왜 낙관적인가?

## Content decisions

### Common training run

- Sample·batch·mask와 loss 분모를 먼저 고정했다.
- Microbatch backward와 optimizer update를 분리했다.
- Accumulation과 AMP를 같은 effective-batch boundary에서 설명했다.
- Resume state에 model, optimizer, scheduler, scaler, progress, RNG·sampler,
  early-stopping state와 manifest를 포함했다.
- One-batch overfit, tiny end-to-end run, resume equivalence와 untouched test를 release gate로 뒀다.

### Transfer adaptation

- Checkpoint weight보다 먼저 tokenizer·preprocess·label·license contract를 확인한다.
- Scratch, linear probe, partial unfreeze와 full tune을 고정 sample-count 표가 아니라 matched
  evidence로 비교한다.
- `requires_grad`와 BatchNorm·Dropout module mode를 구분했다.
- Layer-wise LR와 gradual unfreezing을 보편 recipe가 아닌 후보로 제한했다.
- Input, label과 task shift를 나눠 continued pretraining의 책임을 좁혔다.

### Update clock

- Scheduler clock을 microbatch가 아니라 optimizer update로 정의했다.
- Fixed, metric-driven, branchable horizon에서 cosine, plateau와 WSD 후보를 나눴다.
- PyTorch 일반 scheduler는 optimizer update 뒤, plateau는 validation 뒤 metric과 함께 호출한다.
- OneCycle의 2-phase default와 `three_phase=True` 경계를 명시했다.
- 긴 piecewise cosine 수식은 진행률과 shape 중간 변수로 나눠 390px scale 1.00을 확보했다.

### Generalization intervention

- `parameter > sample이면 거의 확실히 overfit`과 `learning curve 하나면 충분` 주장을 제거했다.
- Data, optimization, slice와 calibration evidence를 개입 전에 분리했다.
- Dropout, AdamW, label smoothing·mixup과 early stopping의 서로 다른 책임을 연결했다.
- Label smoothing의 uniform boundary가 `alpha=1`임을 수식과 본문에 명시했다.
- Validation selection과 untouched final evaluation을 분리했다.

## Formula and Viz contract

모든 display 수식은 `String.raw`와 `practical-training/FormulaPair`를 사용한다. 수식 안의
underbrace는 한국어 의미를 붙이고, 바로 아래에 한국어 설명과 symbol ledger를 둔다.

390px 최소 auto-fit scale:

- Training run: `0.92`
- Transfer adaptation: `0.88`
- Update clock: `1.00`
- Generalization intervention: `0.81`

모두 기준 `>= 0.80`을 통과했다.

새 Viz:

- `TrainingStepLab`: accumulation과 microstep을 바꾸면 effective batch와 update 가능 상태가 바뀐다.
- `ResumeContractLab`: 저장 깊이와 boundary에 따라 누락 state와 resume 판정이 바뀐다.
- `TransferGateLab`: probe, domain 거리와 label evidence로 첫 adaptation 후보를 좁힌다.
- `UpdateClockLab`: horizon과 accumulation에 따라 update 수, schedule 후보와 call point가 바뀐다.
- `GeneralizationGateLab`: failure mode에 따라 evidence와 첫 intervention이 바뀐다.

390px 실제 screenshot을 눈으로 검토했다. `backward 완료`가 4-column cell에서 부자연스럽게
끊기는 문제를 발견해 짧은 `backward` 상태와 별도 update label로 고쳤다.

## Primary-source boundary

2026-07-24에 article에 인용한 20개 URL을 확인했고 모두 HTTP 200이었다.

- PyTorch 공식 문서: AMP accumulation, scaler checkpoint, general checkpoint,
  reproducibility, scheduler call order, plateau와 transfer implementation
- Yosinski, ULMFiT, Don't Stop Pretraining: feature transfer와 adaptation 전략
- SGDR, Super-Convergence, WSD, warmup mechanism: schedule family와 주장 경계
- Dropout, AdamW, label smoothing, mixup, calibration과 Deep Learning Book:
  generalization intervention의 mechanism

Branch gate와 release manifest는 원문이 제공하는 보편 정답이 아니라, 원문 mechanism을 현재
블로그의 evidence contract로 조합한 engineering synthesis다.

## Context Manager and Claude evidence

첫 header가 `[claude-code:sonnet`으로 시작하는 결과만 true-Claude 검토로 채택한다.

초기 4개 broad prose audit는 완료 header 없이 장시간 정체되어 종료하고 폐기했다. 2개로 줄인
감사에서 다음 유효 결과를 얻었다.

- Run·transfer blockers: `[claude-code:sonnet · L1 · $0.0000 · 88451ms]`
- Schedule·regularization blockers: `[claude-code:sonnet · L1 · $0.0000 · 171060ms]`

주요 finding:

- AMP scaler, RNG·sampler와 patience state가 checkpoint에서 빠져 있었다.
- Accumulation과 AMP의 실제 결합 순서가 없었다.
- Transfer sample-count threshold와 특정 model score가 고정 recipe처럼 쓰였다.
- GPT-4 schedule 비공개 claim, GPT-3 token/step 혼동과 근거 없는 benchmark 수치가 있었다.
- OneCycle 2/3-phase 설명이 PyTorch API와 충돌했다.
- Overparameterization, label smoothing boundary와 validation leakage 설명이 부정확했다.

재작성 뒤 file별 유효 감사:

- Training run: `[claude-code:sonnet · L1 · $0.0000 · 149151ms]`
- Transfer: `[claude-code:sonnet · L1 · $0.0000 · 105047ms]`, PASS
- LR control: `[claude-code:sonnet · L1 · $0.0000 · 41941ms]`, PASS
- Generalization: `[claude-code:sonnet · L1 · $0.0000 · 56332ms]`, PASS

Training run 감사가 `Loss scale = 1/K`와 AMP dynamic scale의 용어 충돌을 찾았다. 이를
`누적 손실 가중치`, `AMP scale과 다른 값`으로 고쳤고 다음 유효 재검토로 닫았다.

- Terminology fix: `[claude-code:sonnet · L1 · $0.0000 · 8852ms]`, PASS
- Five Viz audit: `[claude-code:sonnet · L1 · $0.0000 · 62112ms]`, PASS

## Verification before deployment

- `npx tsc --noEmit`: pass
- Targeted ESLint: pass
- Targeted `git diff --check`: pass
- `tests/practical-training-control.spec.ts`: 11/11 pass
- Authored path/sidebar regression: 1/1 pass
- 390, 768, 1440px: document overflow 0, raw LaTeX 0, formula pairing pass
- Five interactive labs: state transition assertions pass
- All cited source URLs: HTTP 200

## Production evidence

- `npm run build`: pass, Vite production build completed in 19.41s
- `systemctl --user restart cm-blog.service`: pass
- Service state: active/running from 2026-07-24 15:54:00 KST
- Four article routes and `?sub=ai-practical-pipeline`: HTTP 200
- Production `tests/practical-training-control.spec.ts`: 11/11 pass
- Production authored-path/sidebar regression: 1/1 pass

이 배치는 source research, reconstruction rationale, true-Claude audit, responsive visual review,
interaction assertions와 production deployment까지 닫혔다.
