# r-ab 수식 주석 재작성 원장 (2026-10-09)

범위: `r-ab.txt`의 38개 파일. 기계 생성 흔적이 남은 `ExplainedFormula` **55개**의 `annotatedFormula`·`operations`를 재작성했다. `formula`·`question`·`idea`·`terms`·`interpretation`·`assumptions`·본문은 바꾸지 않았다.

## 파일별 재작성 수

| 파일 | 식 |
|---|---|
| math-vectors-inner-products/Vectors.tsx | 1 |
| mixture-of-experts.tsx | 6 |
| multi-agent-implementation/Architecture.tsx | 1 |
| multi-agent-implementation/LangGraph.tsx | 1 |
| multi-agent-implementation/Manufacturing.tsx | 1 |
| multi-agent-implementation/Overview.tsx | 1 |
| neural-network/Activation.tsx | 1 |
| neural-network/Forward.tsx | 1 |
| neural-network/MNIST.tsx | 1 |
| neural-network/OutputLayer.tsx | 1 |
| neural-network/Overview.tsx | 1 |
| open-r1/Evaluation.tsx | 2 |
| open-r1/GRPOProcess.tsx | 2 |
| open-r1/RewardSystem.tsx | 1 |
| open-r1/SFTProcess.tsx | 1 |
| qwen-korean-reasoning-posttraining/RLApproach.tsx | 2 |
| rag-pipeline/Generation.tsx | 1 |
| rag-pipeline/Overview.tsx | 1 |
| sequence-modeling-tabular/Aggregation.tsx | 1 |
| sequence-modeling-tabular/Encoding.tsx | 1 |
| sequence-modeling-tabular/Overview.tsx | 1 |
| sequence-modeling-tabular/Transformer.tsx | 3 |
| sionic-eureka/Distillation.tsx | 1 |
| sionic-eureka/HardNegatives.tsx | 1 |
| smoothie-qwen-weight-editing/SmoothieQwen.tsx | 2 |
| sparse-autoencoder/FeatureSteering.tsx | 1 |
| sparse-autoencoder/Polysemanticity.tsx | 1 |
| sparse-autoencoder/SAEArchitecture.tsx | 3 |
| supervised-fine-tuning/Objective.tsx | 2 |
| tabular-deep-learning/FTTransformer.tsx | 2 |
| tabular-deep-learning/TabNet.tsx | 2 |
| tabular-deep-learning/WhenDLWins.tsx | 1 |
| text-unicode-encoding/BitsBytes.tsx | 1 |
| text-unicode-encoding/CodePoints.tsx | 1 |
| text-unicode-encoding/Utf8.tsx | 1 |
| transformer-architecture/DataPrep.tsx | 1 |
| transformer-architecture/FeedForward.tsx | 2 |
| transformer-architecture/LinearSoftmax.tsx | 1 |
| **합계** | **55** |

## 대표 before/after

`supervised-fine-tuning/Objective.tsx` — token mean vs example mean

- before: `\underbrace{\frac{\sum_i S_i}{\sum_i M_i}}_{\text{기준량당 비율}}` + "분자에 둔 관심량을 분모의 기준량으로 정규화합니다." (+ idea 문장을 잘라 붙인 줄)
- after: `\underbrace{\frac{\sum_i S_i}{\sum_i M_i}}_{\text{token마다 같은 weight}}`, `\underbrace{\frac1N\sum_i\frac{S_i}{M_i}}_{\text{답마다 같은 weight}}` + annotation `["batch 전체 token을 한 줄로 평균", "짧은 답(1 token, loss 2)+긴 답(9, 0)", "→ (2+0)/(1+9) = 0.2"]` / `["답 안에서 먼저 평균낸 뒤 답끼리 평균", "같은 두 답이면 (2/1 + 0/9)/2 = 1.0", ...]` — 글의 interpretation 수치를 그대로 대입.

## 검증

- 마커 grep(brief 7번 패턴): 0건. 범용 문구(`분자에 둔 관심량`, `기준량당 비율`, `허용 경계 판정`, `로그 비용 변환`, `<용어> 계산}` 등)도 0건.
- 자체 점검(KaTeX `throwOnError` 렌더, expression이 formula 조각인지, 연산당 1~3줄·줄당 34자 이내, 중복 expression): 재작성한 55개 식 전부 통과.
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit`: 통과.
- `npx eslint <38개 파일>`: 0 error.
- `npx tsc -b --noEmit`(`NODE_OPTIONS=--max-old-space-size=12288`, 기본 heap에서는 OOM): 오류 0.

## 검토 필요

1. `math-vectors-inner-products/Vectors.tsx` — `formula` prop 자체가 `x=(3,4),quad y=(-1,2)qquad\Longrightarrow…`로 `\quad`·`\qquad`의 backslash가 빠져 있다. `formula`는 규칙상 건드리지 않고, 표시용 `annotatedFormula`에서만 `\quad`/`\qquad`로 바르게 썼다. `formula` 수정 여부는 별도 판단 필요.
2. 글에 없는 대입값을 쓴 곳(산술은 글의 수치에서 유도):
   - `open-r1/Evaluation.tsx` SE 식: `p̂=0.5, N_eff=30 → ≈0.09`. N_eff=30은 interpretation의 "AIME 30문항"에서, p̂=0.5는 예시용으로 가정.
   - `mixture-of-experts.tsx` Top-k 합 식: "n=8, k=2"는 같은 글의 capacity 예시에서 가져옴.
   - `neural-network/Forward.tsx`: "784→128 layer"는 같은 글 MNIST 절의 예시; `neural-network/OutputLayer.tsx`: "MNIST라면 K=10".
3. 범위 밖(마커 없음, 손대지 않음)이지만 자체 점검에서 `operations.expression`이 `formula` 조각과 일치하지 않는 기존 식: `mixture-of-experts.tsx:458`(`\frac{1}{T}\sum_x\mathbf{1}[\cdot]`, `\alpha N\sum_i f_iP_i`), `transformer-architecture/LinearSoftmax.tsx:78`(`\epsilon/K`).
4. `text-unicode-encoding/Utf8.tsx` — `formula`의 `(1\ byte)`가 math mode라 italic으로 렌더된다. formula 원문을 따라 annotatedFormula에도 그대로 두었다.
