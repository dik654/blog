# Practical training control reconstruction

## Reader goal

독자는 모델 코드를 한 번 실행하는 법이 아니라 다음 네 질문에 답할 수 있어야 한다.

1. 중단 전후가 같은 실험이 되려면 어떤 상태를 저장해야 하는가?
2. Pretrained representation을 어디까지 고정하고 어디부터 바꿔야 하는가?
3. Learning-rate schedule의 clock은 microbatch, optimizer update, epoch와 validation 중 무엇인가?
4. 일반화가 나빠졌을 때 data, optimization, parameter, prediction 중 어디를 먼저 개입해야 하는가?

## Path shape

네 글을 선형 recipe로 읽지 않는다.

```text
재현 가능한 training run
├─ pretrained representation 적응
├─ update 크기와 시간축 제어
└─ 관측된 일반화 실패에 개입
```

`training-pipeline`은 모든 분기의 공통 root다. 나머지 세 글은 서로의 선행 단계가 아니다.

## Minimum floor

과거 논문을 무한히 내려가지 않는다. 이 경로의 최소 바닥은 다음이다.

- 한 batch가 tensor로 model에 들어가 scalar loss가 되는 과정
- backward가 parameter gradient를 누적한다는 사실
- optimizer update와 validation model selection의 구분
- train, validation, untouched test의 소유권

Autograd와 optimizer의 수학적 내부가 더 필요하면 `backprop-optimization`, `optimizers`,
`foundation-training-step`으로 내려간다.

## Hard transfer questions

아래 문제를 본문에 시험으로 싣지 않는다. 완성된 본문이 해법의 판단 축을 제공하는지 검증한다.

1. AMP와 4-step accumulation을 쓰던 run이 microstep 3에서 죽었다. 어떤 boundary에서 무엇을
   저장해야 double update 없이 재개할 수 있는가?
2. 같은 seed인데 resume 후 sample order와 dropout mask가 달라졌다. 어떤 state가 빠졌는가?
3. Linear probe는 좋지만 full fine-tuning이 나쁘다. 표현 부족, optimization damage와 data
   부족을 어떤 비교 실험으로 구분하는가?
4. Cosine schedule의 total step을 epoch 수로 잡았는데 gradient accumulation을 8배로 바꿨다.
   schedule이 왜 8배 다른 update budget을 보게 되는가?
5. Train loss는 계속 낮아지지만 rare slice와 calibration만 나빠진다. Dropout, weight decay,
   label smoothing와 early stopping 중 무엇을 어떤 증거로 고르는가?
6. Validation으로 checkpoint, patience와 intervention을 모두 골랐다. 최종 성능을 같은
   validation으로 보고하면 왜 낙관적인가?

## Article ownership

### Reproducible training run

- Manifest: data/split/code/environment identity
- Batch contract and sample-weighted aggregation
- Microstep, effective batch and optimizer-update boundary
- AMP scale/unscale/clip/step ordering
- Full resume state: model, optimizer, scheduler, scaler, progress, sampler/RNG and selection state
- Tiny-batch, tiny-subset, resume-equivalence and untouched-test gates

### Transfer adaptation

- Pretrained artifact and preprocessing/tokenizer contract
- Scratch, linear probe, partial unfreeze and full tune as matched-budget candidates
- Frozen parameter, module mode and normalization-state distinction
- Layer-wise LR as an experiment, not a universal recipe
- Input/domain, label and task shift separation
- Continued pretraining only when unlabeled-domain evidence justifies it

### Update clock

- LR is update size; schedule is an optimizer-update clock
- Known horizon: warmup + cosine
- Unknown/metric-driven horizon: plateau
- Branchable pretraining budget: WSD
- OneCycle as a bounded candidate, not a universal short-run default
- `optimizer.step()` before ordinary `scheduler.step()`; plateau after validation
- Scheduler state and update counter in checkpoints

### Generalization intervention

- Diagnosis is not one learning curve: average, slice, calibration and shift evidence
- Data interventions, parameter constraints, stopping/model selection and prediction calibration are distinct
- Dropout, decoupled weight decay, label smoothing/mixup and early stopping are not automatically additive
- Hyperparameters are selected inside validation evidence; untouched test is used once after decisions close

## Formula contract

- Every display formula uses KaTeX through `FormulaPair`.
- Every formula includes Korean annotations inside the expression and a Korean meaning/symbol ledger below it.
- Long formulas are split into aligned rows and must auto-fit at 390px without horizontal document scroll.
- Raw `\theta`, `\eta`, `\lambda` strings must never appear as prose substitutes for rendered math.

## Viz contract

- Fixed SVG coordinates are forbidden for the new labs.
- Every control changes numbers, retained state, a decision or a displayed sequence, not only color.
- Stable min-height prevents controls from moving the page.
- 390, 768 and 1440px must have zero document overflow.
- Shared `SegmentedControl` exposes group labels, native button keyboard behavior and `aria-pressed`.

## Source boundary

Primary sources establish mechanisms and documented API order. The branch gates and release manifests are
engineering synthesis and must be labeled as such.

- PyTorch AMP, optimizer/scheduler, reproducibility, checkpoint and transfer-learning documentation
- Yosinski et al. on feature transfer
- ULMFiT and Don't Stop Pretraining for adaptation strategies
- SGDR, OneCycle and WSD for schedule families
- AdamW, Dropout, Label Smoothing, Mixup and early-stopping literature
