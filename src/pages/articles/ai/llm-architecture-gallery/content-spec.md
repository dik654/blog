# LLM Architecture Gallery Reconstruction Spec

## Problem

초기 페이지는 71개 모델의 추출 필드를 표로 보여 줬다. 표를 계보로 바꾼 뒤에도 현재 질문이 2025년 checkpoint에 고정돼 2026년 depth mixing과 multimodal input boundary를 설명하지 못했다. 목표는 최신 공개 변화에서 질문을 잡고, 최소 decoder 기준으로 내려간 뒤 mechanism branch와 통합 보고서로 다시 올라오는 architecture course다.

## Learning Spine

1. **직접 진입 계약**: LLM, token, hidden vector, layer, attention, FFN을 자동완성 장면과 다음-token 반복으로 먼저 정의한다.
2. **현재 질문**: DeepSeek V4, Attention Residuals, Gemma 4를 입력 경계·문맥 혼합·용량 배분·상태 저장·깊이 혼합으로 분리한다.
3. **공통 바닥**: token → embedding → causal attention → MLP → logits.
4. **GPT-2**: dense decoder-only baseline. 이후 변화의 기준점.
5. **Llama 3**: RMSNorm·RoPE·SwiGLU·GQA로 현대 dense baseline을 만든다.
6. **Gemma/long-context**: local/global attention과 KV 절감으로 context 비용을 다룬다.
7. **DeepSeek V3**: MLA와 sparse MoE로 memory와 capacity를 분리한다.
8. **Kimi Linear/Qwen hybrid**: 일부 attention을 state update로 대체해 긴 context 비용을 줄인다.
9. **통합 검산**: DeepSeek-V3.2에서 sparse attention, MoE와 RL runtime을 다시 분리해 계산한다.

## Per-model Explanation Contract

각 모델은 다음 순서로 설명한다.

- `이전 병목`: 바로 앞 구조에서 해결하지 못한 문제.
- `추가된 구조`: attention, FFN, normalization, position, routing 중 무엇이 바뀌었는지.
- `토큰 1개 실행`: 입력 token이 block 안에서 실제로 지나는 순서.
- `얻는 것`: 품질, capacity, KV, latency 중 개선 목표.
- `대가`: 압축 손실, routing 통신, local visibility, 구현 복잡도.
- `논문/설정 검산`: total/active parameter, context, layer mix, KV/token.

## Page Structure

### 1. 2026 현재 근거

- 현재 근거보다 먼저 다음-token 반복과 token·hidden·layer·attention·FFN을 정의한다. 고유명사는 이 정의를 사용한 뒤에만 등장한다.
- DeepSeek V4: compressed long-range access와 residual 경로.
- Attention Residuals: 이전 layer 표현에 적용하는 depth attention.
- Gemma 4: encoder-free multimodal input boundary와 MTP drafter.
- 다섯 축은 vendor 공통 분류가 아니라 저자 재구성임을 명시한다.
- 정적 정의 목록을 두지 않는다. 공개 변화 하나를 선택하면 `기준 계약 → 바뀐 계약 → token 실행 순서 → 달라지는 것 → 아직 검증할 것`이 같은 화면에서 바뀌어야 한다.

### 2. 공통 계산 계약

- Attention, KV cache, active parameter, depth mixing 네 식을 남긴다.
- 모든 식 아래 한국어 `FormulaNote`로 기호와 연산 선택 이유를 설명한다.
- Transformer 전체 글과 Attention Is All You Need 재구성 글을 선행 경로로 연결한다.

### 3. 다섯 변화의 계단

- GPT-2 → Llama 3 → Gemma long-context → DeepSeek V3 → Kimi Linear.
- 각 milestone은 이전 문제, 구조 변화, token path, cost를 서술한다.
- 모바일에서 다섯 모델을 모두 펼쳐 7,000px가 넘는 긴 목록을 만들지 않는다. 다섯 단계 selector와 이전·다음 이동을 제공하고 한 번에 한 구조에 집중한다.
- 원문 갤러리는 별도 링크로 보존하되, 본문에는 해당 모델의 핵심 실행 계약을 큰 글자와 반응형 native diagram으로 다시 그린다.

### 4. 세부 경로

- Dense를 먼저 읽는다.
- 그 다음 KV/long-context를 읽는다.
- 그 위에 Sparse MoE를 읽는다.
- 마지막으로 Hybrid/linear를 읽는다.
- 각 상세 글은 표를 제거하고 모델별 deep-dive sequence를 사용한다.

### 5. 새 논문 읽기 protocol

- baseline 확인 → block delta → token path → training-only/runtime 분리 → memory/communication 계산 → evidence/ablation 확인.

## Visualization Plan

- `CurrentArchitectureCompass`: DeepSeek-V4, Attention Residuals, Gemma 4 12B를 고르면 활성 구조 축과 기준·변경 계약, 네 단계 실행, 증거 한계가 함께 바뀐다.
- `ArchitectureMilestoneSequence`: GPT-2, Llama 3, Gemma 3, DeepSeek V3, Kimi Linear 가운데 한 단계를 골라 동일한 설명 계약과 native diagram을 읽는다.
- `ArchitectureFingerprintLab`: 이름을 가린 합성 모델에서 KV byte, local/global cadence, routed fraction을 직접 바꿔 독립 축임을 검산한다.
- 모든 선택기는 390px에서 가로 스크롤 없이 보이고, 상태 변화가 layout 폭을 바꾸지 않아야 한다.

## Acceptance Check

- 전체 모델 표와 `Extracted fact sheet` 문구가 기본 본문에서 사라진다.
- 현재 앵커가 2026년 세 공식 근거와 다섯 비교 축을 명시한다.
- 독자가 GPT-2를 설명하지 않고 바로 MoE로 점프하지 않는다.
- 세부 페이지의 각 모델은 최소 네 문단/필드 묶음으로 문제·동작·대가를 설명한다.
- 원본 숫자는 버리지 않고 모델별 `검산 데이터`로 접어 둔다.
- 390·768·1440px에서 내부 가로 스크롤이 없고, 768px 도식이 과도한 한 열 높이를 만들지 않는다.
- 현재 선택된 원문 구조도는 키보드와 포인터로 원본 근거를 열 수 있다.
