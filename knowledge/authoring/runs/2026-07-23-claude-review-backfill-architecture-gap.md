# Claude review backfill: architecture gap

Date: 2026-07-23

## Identity Gate

Context Manager의 `cm_route_delegate`로 아키텍처 글 5개를 각각 좁게 검토했다. 첫 응답 header가
정확히 `[claude-code:sonnet`으로 시작한 실행만 채택했다. Codex fallback, timeout,
connector failure, header를 관찰하지 못한 병렬 batch는 모두 폐기했다.

| target slug | accepted header | high | medium | low | disposition |
|---|---|---:|---:|---:|---|
| `llm-architecture-gallery` | `[claude-code:sonnet · L3 · $0.0000 · 176042ms]` | 0 | 2 | 1 | 모두 `confirmed_then_fixed` |
| `llm-architecture-dense-transformers` | `[claude-code:sonnet · L3 · $0.0000 · 167727ms]` | 0 | 0 | 0 | 수식·전이 계약 통과 |
| `llm-architecture-kv-long-context` | `[claude-code:sonnet · L3 · $0.0000 · 87549ms]` | 0 | 0 | 2 | 모두 `confirmed_then_fixed` |
| `llm-architecture-sparse-moe` | `[claude-code:sonnet · L3 · $0.0000 · 139144ms]` | 0 | 0 | 0 | 수식·source 장부 통과 |
| `llm-architecture-hybrid-linear` | `[claude-code:sonnet · L3 · $0.0000 · 137872ms]` | 0 | 1 | 0 | `confirmed_then_fixed` |
| `llm-architecture-hybrid-linear` | `[claude-code:sonnet · L3 · $0.0000 · 58423ms]` | 0 | 1 | 0 | `confirmed_then_fixed` |

고유 target은 5개, 채택한 true-Claude 실행은 6개다. 실행 19건 중 13건은 폐기했다.

## Confirmed Findings

### Gallery

첫 Claude pass는 다음을 지적했다.

- `mHC`, `DSA`, `stable GRPO`의 첫 사용 설명이 부족했다.
- 최신 구조를 다섯 축으로 분류하면서 입력 경계와 깊이 혼합의 최소 기반 계약이 약했다.
- Viz의 `6 → 2` depth mixer가 조절 가능한 값인지 합성 모델의 고정값인지 불분명했다.

현재 코드는 모두 보완됐다.

- `Manifold-Constrained Hyper-Connections(mHC)`와 `DeepSeek Sparse Attention(DSA)`를 첫 사용에서 푼다.
- 입력 경계에 text embedding과 image/audio projector의 합류 식과 `FormulaNote`를 추가했다.
- 기준 Transformer의 직전 layer 입력, depth mixing, residual update를 한 식에서 비교한다.
- Viz는 `6 → 2`가 합성 사양의 고정값임을 metric과 verdict에서 명시한다.

따라서 세 finding은 모두 `confirmed_then_fixed`다.

### Hybrid / Linear

일반 matrix recurrence를 펼친 기존 곱 표기는 전이 행렬의 순서를 모호하게 만들었다. 현재
`llm-architecture-hybrid-linear.tsx:141-147`은 행렬이 교환되지 않음을 먼저 말하고
`A_t A_(t-1) ... A_(i+1)` 순서, 오른쪽부터의 적용, `i=t`의 빈 곱을 설명한다.

두 번째 pass는 content spec이 요구한 정확한 `S,S,S,A` cadence를 테스트가 48칸 개수로만
검사한다는 회귀 oracle 누락을 찾았다. 현재 test는 전체 48개 순서와 `S=36`, `A=12`를
각각 assert한다. 두 medium finding 모두 `confirmed_then_fixed`다.

### KV / Long Context

핵심 수식에는 high/medium 결함이 없었다. KV byte, prefill과 local-window 합,
GQA 비율, MLA cache width, local/global mixed cache, receptive-field bound를 다시 계산했고
일관됐다.

최초 보고 시점에 열려 있던 low source-boundary 두 건은 다음과 같다.

- figure `DeepSeek V4 Pro` 옆 current source는 `DeepSeek-V4-Flash` 보고서다.
- figure `Gemma 4 31B` 옆 current source는 `Gemma 4 12B` release다.

현재 figure title은 두 대상을 모두 `비교 도식`으로 표시한다. 31B와 12B, V4 Pro와
V4-Flash가 같은 checkpoint나 config 근거가 아니라고 figure note에서 직접 말한다.
SourceNotes도 `DeepSeek-V4-Flash`를 정확히 표기하고, 12B·V4-Flash 자료를 다른 변형의
세부 config 근거로 옮겨 쓰지 못하게 경계를 고정했다.

따라서 두 finding 모두 `confirmed_then_fixed`다. JSON에는 최초 보고 시점에 두 건이
open이었다는 이력을 `history`로 보존했다.

## Passed Areas

`llm-architecture-dense-transformers`는 residual, SwiGLU, attention/FFN parameter,
QK-Norm, GPT-2 worked example을 다시 계산해 일치했다. 마지막 여섯 단계 checklist는 새 dense
모델에 전이할 수 있는 읽기 절차로 작동한다.

`llm-architecture-sparse-moe`도 high/medium finding이 없었다. 특히
`V_roundtrip = 2*T*k*d*b`는 MoE를 넘어 dispatch/gather collective의 통신 하한을 세는
재사용 가능한 분석법이다.

## Rejected Ledger

| id | target | result | reason |
|---|---|---|---|
| A01-A05 | 5개 target의 초기 병렬 L4 요청 | extended wait 뒤 batch terminate | 응답/header 미관찰 |
| A06 | gallery | timeout, 277426ms | header 없음 |
| A07 | gallery | timeout, 285416ms | header 없음 |
| A08 | dense | `[codex:gpt-5.5 · L2 · $0.0000 · 100434ms]` | Codex fallback |
| A09 | KV | unable to connect, 60951ms | header 없음 |
| A10 | dense | timeout, 272557ms | header 없음 |
| A11 | KV | tool timeout, 300006ms | header 없음 |
| A12 | hybrid | timeout, 257017ms | header 없음 |
| A13 | hybrid | unable to connect | header 없음 |

JSON report에 초기 batch의 target별 폐기 항목과 각 실행의 scope를 따로 기록했다.

## Coverage Boundary

이 reviewer는 앱 코드를 수정하지 않았다. Claude는 responsive source semantics를 읽었지만,
이 보고서는 새 Playwright screenshot 실행으로 집계하지 않는다. 외부 web research도 새로
수행하지 않았다. 2026 current claim은 글에 연결된 primary/vendor source와 글 자체의
evidence boundary 안에서만 검증됐다.
