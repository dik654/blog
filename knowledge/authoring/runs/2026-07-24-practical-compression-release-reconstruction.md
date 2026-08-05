# Practical compression and release reconstruction

Date: 2026-07-24 KST

## Scope

기존의 `양자화 → 프루닝 → 증류` 기법 나열을 다음 네 개의 목표 경로로 재구성했다.

```text
배포 계약과 출시 루프
├─ 수치 표현을 줄인다: quantization
├─ 실제 실행할 연산을 줄인다: pruning
└─ 작은 모델이 필요한 함수를 다시 학습한다: knowledge distillation
```

기존 slug는 유지했다.

- `compression-pipeline`
- `quantization`
- `pruning`
- `knowledge-distillation`

설계 원장은
`src/pages/articles/ai/content-specs/practical-compression-release.md`다.

## Why this structure

기존 글은 INT8·INT4, GPTQ·AWQ·SmoothQuant, unstructured·structured pruning과 KD loss를
순서대로 소개했지만 다음 질문에 답하기 어려웠다.

- 목표가 weight 저장량, peak memory, TTFT, decode latency, throughput 중 무엇인가?
- 수치상의 bit 감소나 zero 증가가 현재 hardware·runtime의 실제 kernel 실행으로 이어지는가?
- 압축 전후에 tokenizer, output space, KV cache와 quality slice가 같은가?
- 여러 기법을 어떤 고정 순서로 적용해야 하는가, 아니면 병목별 독립 branch로 비교해야 하는가?

따라서 공통 뿌리를 기법이 아니라 배포 계약, profiler evidence와 release gate로 바꿨다.
양자화·프루닝·증류는 공통 root 뒤에서 갈라지는 독립 개입이며, 고정된 만능 적용 순서는 두지
않는다.

## Hard transfer questions

본문을 쓰기 전에 다음 비공개 문제를 만들었다. 문제를 article에 그대로 싣지 않고, 완성된
본문만 읽어도 해법의 판단 축에 도달하는지 역으로 검사했다.

1. Weight는 4-bit로 줄었는데 long-context serving의 peak memory가 거의 줄지 않았다면 어떤
   memory component를 다시 측정해야 하는가?
2. Quantized checkpoint가 작아졌는데 latency가 느려졌다면 method, serialization format,
   runtime support와 kernel realization을 어떻게 분리해 진단하는가?
3. Tensor의 극단값 몇 개 때문에 activation scale이 커질 때 per-tensor, per-channel,
   clipping과 SmoothQuant 후보를 어떤 evidence로 비교하는가?
4. Unstructured 70% zero model이 dense model보다 느릴 수 있는 이유를 storage, metadata,
   sparse kernel과 hardware 관점에서 설명할 수 있는가?
5. 2:4 mask를 만들었다는 사실만으로 sparse Tensor Core speedup을 주장할 수 없는 이유는
   무엇인가?
6. Teacher와 student의 tokenizer나 vocabulary가 다를 때 token-level KL을 그대로 계산하면
   어떤 output-space contract가 깨지는가?
7. Distillation에서 temperature-softened distribution과 hard-label CE가 서로 다른 student
   distribution을 써야 하는 이유는 무엇인가?
8. 세 branch를 조합할 때 품질 저하가 발생하면 원인을 식별할 수 있도록 어떤 controlled
   experiment와 release artifact를 남겨야 하는가?

## Content decisions

### Common release root

- Deployment unit, representative workload와 target hardware/runtime을 먼저 고정했다.
- Peak memory를 weight, KV cache, activation/workspace와 runtime overhead로 분리했다.
- GQA-aware KV cache 식에서 query head와 KV head를 구분했다.
- Profiler로 compute, memory capacity, memory bandwidth와 launch/runtime 병목을 나눈다.
- 각 압축 branch를 같은 quality slice, warmup, batch·sequence 분포와 latency percentile에서
  비교한다.
- Method 이름뿐 아니라 checkpoint, packing, runtime, kernel, profiler trace와 rollback
  artifact를 release bundle에 포함했다.

### Quantization

- Affine integer quantization을 scale, zero point, rounding, clipping과 dequantization부터
  재구성했다.
- Per-tensor, per-channel과 group-wise granularity를 outlier evidence와 연결했다.
- Calibration data와 observer를 별도 primer로 정의했다.
- Weight-only, W8A8, KV-cache quantization과 QLoRA storage를 서로 다른 목표로 분리했다.
- GPTQ, AWQ와 SmoothQuant를 고정 순위가 아니라 서로 다른 오류 제어 전략으로 설명했다.
- FP8은 integer affine quantization과 달리 exponent·mantissa를 가진 floating code임을
  명시했다.
- GGUF는 알고리즘이 아니라 model container이며, format 이름만으로 kernel speed를 보장하지
  않는다고 교정했다.

### Pruning

- Parameter가 zero라는 사실과 hardware가 해당 multiply를 건너뛴다는 사실을 분리했다.
- Unstructured, N:M, block와 channel/layer structural pruning을 kernel realization 관점에서
  비교했다.
- Weight magnitude, activation-aware score와 second-order approximation을 서로 다른 mask
  evidence로 설명했다.
- SparseGPT와 Wanda의 주장을 논문이 실험한 decoder-only autoregressive open model 범위
  안으로 제한했다.
- Mask 생성, recovery, export, sparse runtime과 dense fallback을 한 release 경로로 연결했다.

### Knowledge distillation

- Teacher access, target behavior, tokenizer와 output-space alignment를 먼저 고정했다.
- Temperature-softened `p_T`, `p_S`와 hard-label용 unsoftened `q_S`를 수식에서 분리했다.
- Logit, hidden feature, attention, sequence-level과 data distillation을 신호가 흐르는 위치로
  구분했다.
- Feature dimension이 다르면 learned projection이 필요함을 명시했다.
- Hinton KD, Sequence-Level KD, DistilBERT와 MiniLLM을 최소 논문 spine으로 연결했다.
- TinyLlama는 teacher-student KD가 아니라 독립 pretraining 사례라는 경계를 명시했다.
- Student checkpoint뿐 아니라 teacher/version, generation protocol, synthetic-data lineage와
  release evidence를 남긴다.

## Formula and Viz contract

모든 display 수식은 `String.raw`와 공용 `FormulaPair`를 사용한다. 긴 식은 의미 단위로 나누고,
수식 안 underbrace와 바로 아래 meaning·symbol ledger는 한국어로 쓴다.

390px 최종 auto-fit scale:

- Compression root: `1.00`
- Quantization: `0.89`
- Pruning: `1.00`, `1.00`
- Knowledge distillation: `0.92`, `0.97`

모두 기준 `>= 0.80`을 통과했다.

새 interactive Viz:

- `MemoryEnvelopeLab`: context와 concurrency를 바꾸면 weight·KV·workspace의 peak memory
  병목이 바뀐다.
- `CompressionGateLab`: 관측 병목과 quality tolerance에 따라 첫 branch 후보가 바뀐다.
- `RangeOutlierLab`: granularity와 clipping이 scale·resolution·saturation에 미치는 영향을
  비교한다.
- `KernelRealizationLab`: method에서 format, runtime, kernel과 profiler evidence까지 이어지는
  출시 사슬을 검사한다.
- `SparsityRealizationLab`: zero pattern과 runtime support에 따라 실제 skip 판정이 바뀐다.
- `DistillationSignalLab`: teacher access와 output-space alignment에 따라 사용할 수 있는
  distillation signal이 바뀐다.

390px article 전체와 각 lab·formula screenshot 열 장을 repository 내부 임시 directory에서
직접 확인했다. 겹침, 우측 잘림, 불필요한 내부 scroll과 과도한 공백은 없었다.

## Primary-source boundary

2026-07-24에 article에 인용한 22개 URL을 확인했고 모두 HTTP 200이었다.

- torchao, ONNX Runtime, vLLM, GGUF specification과 llama.cpp: 현재 format·runtime·kernel
  support 경계
- GPTQ, AWQ, SmoothQuant와 QLoRA: weight·activation quantization과 memory-efficient
  fine-tuning의 원 논문
- SparseGPT, Wanda, NVIDIA 2:4와 INT8 sparsity workflow: pruning pattern과 hardware 실행 경계
- Hinton KD, Sequence-Level KD, DistilBERT, MiniLLM, TinyLlama, Born-Again Networks와
  Deep Mutual Learning: distillation signal과 pretraining 경계

CVF URL 한 건은 첫 병렬 fetch에서 transport error가 났지만 `curl --retry 3`로 실제 문서를
재확인해 HTTP 200을 받았다. 논문 수치와 hardware speedup은 해당 dataset, model, runtime,
kernel과 publication 시점 밖의 보편 보장으로 확장하지 않는다.

## Context Manager and Claude evidence

첫 transport metadata header가 `[claude-code:sonnet`으로 시작하는 결과만 true-Claude 검토로
채택했다. 오래 걸린 broad compression 요청 한 건은 timeout되어 폐기하고, article별 bounded
감사를 병렬 재실행했다.

### Initial audit

- Common pipeline: `[claude-code:sonnet · L1 · $0.0000 · 118659ms]`
- Quantization: `[claude-code:sonnet · L1 · $0.0000 · 76930ms]`
- Pruning: `[claude-code:sonnet · L1 · $0.0000 · 80789ms]`
- Distillation: `[claude-code:sonnet · L1 · $0.0000 · 113164ms]`

주요 finding:

- KV memory 식이 GQA를 빠뜨렸고 산술도 맞지 않았다.
- 양자화 method, GGUF format과 runtime/kernel support가 같은 분류에 섞여 있었다.
- NF4, ONNX와 특정 정확도·속도 수치가 조건 없는 보편 recipe처럼 쓰였다.
- Zero count와 실제 sparse execution을 혼동하고, pruning 식과 model scope가 부정확했다.
- TinyLlama를 KD 사례로 잘못 분류했고 KD loss attribution과 output-space contract가 빠졌다.

### Post-rewrite audit

- Common pipeline: `[claude-code:sonnet · L1 · $0.0000 · 66696ms]`, PASS
- Quantization: `[claude-code:sonnet · L1 · $0.0000 · 156250ms]`, terminology·FP8 boundary
- Pruning: `[claude-code:sonnet · L1 · $0.0000 · 108733ms]`, model-scope wording
- Distillation: `[claude-code:sonnet · L1 · $0.0000 · 80536ms]`, hard-label distribution·source check

교정:

- Calibration, observer와 salient weight를 독자가 처음 만나는 자리에서 정의했다.
- FP8과 affine INT8의 수치 표현을 분리했다.
- `GPT-family` 표현을 `decoder-only autoregressive open model`로 좁혔다.
- Hard-label CE에 unsoftened `q_S`를 사용하도록 KD 식을 교정했다.

MiniLLM ICLR URL이 의심스럽다는 finding은 공식 ICLR proceedings에서 제목·논문 페이지를
직접 확인해 오탐으로 기각했다.

좁은 재검토:

- Quantization: `[claude-code:sonnet · L1 · $0.0000 · 27523ms]`, PASS
- Pruning: `[claude-code:sonnet · L1 · $0.0000 · 14057ms]`, PASS
- Distillation: `[claude-code:sonnet · L1 · $0.0000 · 9863ms]`, PASS
- 390px visual audit, screenshot 10개:
  `[claude-code:sonnet · L1 · $0.0000 · 34109ms]`, PASS

Visual audit는 hierarchy, formula readability, touch control, stable state area와 decision-oriented
Viz를 함께 검사했다. Sticky site navigation은 article Viz clipping으로 계산하지 않았다.

## Verification before deployment

- `npx tsc --noEmit`: pass
- Targeted ESLint: pass
- `git diff --check`: pass
- `tests/practical-compression-release.spec.ts`: 12/12 pass
- Practical compression authored-path/sidebar regression: 1/1 pass
- 390px formula auto-fit scale: all `>= 0.80`
- Six interactive labs: state transition assertions pass
- All 22 cited source URLs: HTTP 200
- Repository-local 390px screenshot review: pass
- Claude prose, formula and visual re-audit: pass

## Production evidence

- `npm run build`: pass, Vite production build completed in 18.38s
- `systemctl --user restart cm-blog.service`: pass
- Service state: active/running from 2026-07-24 18:49:45 KST
- Four article routes and `?sub=ai-practical-compression`: HTTP 200
- Production `tests/practical-compression-release.spec.ts`: 12/12 pass
- Production authored-path/sidebar regression: 1/1 pass

이 배치는 source research, reconstruction rationale, true-Claude prose·formula·visual audit,
responsive interaction assertions와 production deployment까지 닫혔다.
