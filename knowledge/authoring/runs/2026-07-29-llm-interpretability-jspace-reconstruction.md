# LLM Interpretability current-first reconstruction

Date: 2026-07-29 KST

## Objective

`LLM 해석` 경로를 도구 이름 모음이 아니라 다음 질문에 답하는 학습 경로로 재구성한다.

> 중간 activation에서 어떤 개념을 읽을 수 있다는 사실은, 그 개념이 실제 출력의 원인이라는
> 뜻인가?

독자는 최신 연구에서 출발하되, 필요한 원문과 개념만 아래로 내려가고 구현 실험으로 다시
올라와야 한다. 모든 과거 논문을 시대순으로 열지 않는다.

## Why this track was selected

전체 19개 research track을 휴리스틱으로 검사했을 때 interpretability는 이름이 많은 것에 비해
도구별 주장 강도의 차이가 가장 쉽게 무너지는 경로였다. Attention map, vocabulary lens, SAE
feature와 attribution graph가 모두 "모델이 생각한 것"으로 평평하게 보이면 최신 연구를 읽어도
관찰, readout, decomposition, attribution과 intervention을 구분하지 못한다.

이 트랙은 다음 이유로 우선순위가 높았다.

1. 수식이 있어도 무엇을 보장하는지 설명하지 않으면 오해가 커진다.
2. 정적인 diagram보다 intervention과 control을 직접 바꾸는 Viz가 필요하다.
3. 2026 current source, 2021 canonical floor, 2023/2025 독립 분기를 명확히 나눌 수 있다.
4. 같은 검증 문법을 reasoning, agents, RL, multimodal 연구에도 재사용할 수 있다.

`scripts/audit-ai-mastery-coverage.mjs`는 이 선택을 돕는 triage 도구로만 사용했다. 결과 점수는
release evidence가 아니다. 최종 report는
`.codex-tmp/ai-mastery-coverage-2026-07-29-final-v3.json`이며 19개 track, 193개 고유 route
article reference, 10개 weak reference를 기록한다.

## Private transfer problem

공개 본문에 정답형 문제를 넣지 않고, 작성 품질을 검증하는 비공개 transfer problem을 먼저
만들었다.

문제의 핵심은 표면 token이 비슷하지만 관계 역할이 다른 여러 prompt에서 다음을 판별하는 것이다.

1. 중간 state에서 읽힌 concept가 단순 상관인가.
2. 같은 norm의 concept component와 remainder를 바꿨을 때 어느 쪽이 답을 더 움직이는가.
3. 효과가 final answer 준비보다 이른 layer에서 나타나는가.
4. remainder가 downstream에서 다시 concept direction으로 들어오는 우회 경로를 막아도
   효과가 남는가.
5. 관계, prompt family와 function을 holdout했을 때도 같은 주장이 유지되는가.

본문만 읽은 독자가 해결 전략을 세울 수 있으려면 `readout -> sparse decomposition ->
matched intervention -> depth control -> re-entry clamp -> held-out validation`을 연결해야 한다.
이 기준으로 누락된 설명과 Viz를 역설계했다.

## Source and claim map

### Current source

- Anthropic, *Verbalizable Representations Form a Global Workspace* (2026)
  - 평균 downstream Jacobian과 vocabulary readout
  - sparse nonnegative J-space decomposition
  - verbal report, intermediate reasoning, broadcast, selective use
  - same-norm remainder, layer control, clamping과 single-token limitation

### Minimum canonical floor

- Elhage et al., *A Mathematical Framework for Transformer Circuits* (2021)
  - residual stream
  - QK/OV factorization
  - component가 residual stream을 읽고 쓰는 계산 경로
  - 여기서 readout, SAE와 causal validation 전체를 파생시키지 않는다.

### Independent branch anchors

- Bricken et al., *Towards Monosemanticity* (2023)
  - sparse learned feature, reconstruction, sparsity와 labeling 경계
- Anthropic, *Circuit Tracing Methods* (2025)
  - replacement model, error node, attribution graph와 original-model intervention
- Anthropic, *A Toy Model of Mechanistic (Un)Faithfulness* (2025)
  - output reconstruction과 내부 algorithm의 동일성은 별도 주장
- Google DeepMind, *Gemma Scope 2*
  - 공개 SAE/transcoder 범위와 재현 가능한 artifact 경계

## Information architecture decision

최종 경로는 다음 순서다.

```text
01 CURRENT TARGET
02 PRIMARY SOURCE CHECKPOINTS
03 KEY CONCEPTS
04 JUST-IN-TIME FOUNDATION
05 IMPLEMENT & VERIFY
```

이 순서를 택한 이유는 독자가 최신 목표를 본 뒤 바로 원문에서 주장 범위를 확인하고, 실제로
막힌 개념과 수학만 선택해 내려가게 하기 위해서다. 기존의
`current -> concepts -> foundations -> evidence`는 설명을 먼저 믿고 원문을 나중에 확인하게
만들었다.

추가 계약:

- current/canonical/supporting source article은 dependency 단계에서 같은 URL로 반복하지 않는다.
- current와 canonical을 한 article에 통합할 때는 서로 다른 non-empty anchor를 사용한다.
- concepts는 최대 8개, foundations는 최대 5개로 제한한다.
- 구현 단계는 비어 있을 수 없으며 실제 article registry에서 resolve되어야 한다.
- interpretability의 역사 하향은 Transformer Circuits 2021에서 멈춘다.

이 계약은 `tests/topdown-research-schema-contract.spec.ts`에 고정했다. 최종 registry와 renderer
hash는 다음과 같다.

```text
f4051e4552aa4da89149ea76008e89c467dff34a4fe7be6e8e88b9cd1387fc16  topdownResearchTracks.ts
4086a11e46f1a540cf872096edf91bc7bc402677d149ea48d64efc5af80cc937  TopDownResearchRoute.tsx
6d0966cee9e3521bcde1a0bc3c4496aa84302f0c45e426d9dc04b63e8cbabfc5  topdown-research-schema-contract.spec.ts
```

최종 ownership audit은 21개 top-level, 103개 subcategory, 303개 article, 19개 research
track에서 119개 경로를 검사했다. 잠재 overlap 17개가 있었지만 render collision은 0개였고,
여러 경로에서 재사용되는 article 74개는 모두 primary owner가 정확히 하나다. 추가 dependency
edge 193개는 소유권이 아니라 학습 연결로만 남겼다.

## Article construction reasoning

본문의 논리 순서는 다음과 같다.

1. 관찰, readout, decomposition, attribution과 intervention의 주장 강도를 분리한다.
2. residual stream을 "다음 layer가 함께 읽고 쓰는 공용 vector 통로"로 먼저 설명한다.
3. prompt-specific Jacobian과 corpus average를 구분한다.
4. normalization과 unembedding을 붙여 token ranking으로 읽는 식을 복원한다.
5. overcomplete direction에 sparsity와 nonnegative constraint가 필요한 이유를 설명한다.
6. J-space component와 remainder를 나누고 same-norm control을 붙인다.
7. report, reasoning, broadcast, selectivity를 서로 다른 실험 주장으로 나눈다.
8. single-token naming, relation/binding, distribution shift와 faithfulness 한계를 닫는다.
9. attribution 후보를 original-model patch/ablation/control과 holdout으로 검증하는 구현으로 연결한다.

숫자 표현에서 서로 다른 모집단과 분모를 섞지 않았다.

- 일반 residual activation의 J-space 설명량은 layer에 따라 대체로 10% 미만이다.
- 별도의 concept probe vector 분해에서는 probe variance의 약 10-15%인 사례가 있다.

둘을 하나의 "J-space가 전체 activation의 몇 퍼센트"라는 숫자로 합치지 않았다.

Article/spec hashes:

```text
5296e4b708486cf9e97bfbcce38ed037948a5f34d73731af0994d3e94b87db5d  llm-interpretability-frontier.tsx
bfe955d8b29d0994a8277220e8b19ecd89a72132585f08a7c58862bb37454b50  content-spec.md
b8e2c0232e7495e9a650d80e19763fc4ddeca7867c0a3e678f938f3501be1508  llm-circuit-analysis.tsx
a92b64ec77e7549f46b516f9847f2700fe9563269be44c7cbd277801d67c9a3d  CircuitExplorers.tsx
9a0ed093f969aa8cb2df8c416a382195fd304bfeaf205e2f7e95a5d3c4ea08bb  sparse-autoencoder.tsx
b40598e4f5592856ca8b1632dff3d29234a419cb817ab7370477c463f0022dd7  paper-transformer-circuits-2021.tsx
```

## Viz decisions

Viz는 설명용 색칠이 아니라 사용자가 변수를 바꿔 주장 범위를 확인하는 작은 실험으로 만들었다.

- `EvidenceLadderExplorer`
  - method를 바꾸면 "말할 수 있음/없음"이 함께 바뀐다.
  - 선택 상태를 `data-selected-method`로 노출한다.
- `JacobianLensPipelineViz`
  - 중간 state -> 남은 계산 -> 평균 map -> token readout 순서로만 전진한다.
  - 이전 버전의 1 -> 0 -> 2 -> 3 역행 highlight를 제거했다.
- `JSpaceDecompositionLab`
  - 4D activation, 6개 overcomplete direction
  - 부분집합을 열거하고 작은 coordinate-descent NNLS로 nonnegative coefficient를 계산한다.
  - k를 바꾸면 coverage, remainder와 검토 조합 수가 실제로 달라진다.
  - "개념 계산 예시, 논문 측정값 아님"을 명시한다.
- `JSpaceEvidenceLab`
  - report/reasoning/broadcast/selectivity를 전환한다.
  - 각 경우 setup, intervention, observed change, control, allowed claim을 함께 보인다.
  - 사례 숫자는 논문 측정값이 아닌 개념 실험임을 명시한다.
- `LayerRegimeExplorer`
  - 0-33, 33-89, 89-100의 연속 구간과 marker를 같은 percent 좌표에 둔다.
  - 현재 regime을 `data-current-regime`으로 노출한다.
- `SAEExplorers`
  - reconstruction-sparsity control의 동적 오류를 실제 계산하고 screen reader에 알린다.
  - evidence 단계는 360px에서 2열, 넓은 화면에서 5열이며 관찰→가설→반례→개입→통제를
    한 번에 평평하게 나열하지 않는다.
- `VirtualWeightLab`
  - 82/61/93 같은 장식용 점수를 제거했다.
  - 표시된 `W_I`, `W_O`를 실제로 곱하고 normalized Frobenius coupling을 계산한다.
- `QkOvCircuitLab`
  - attention은 높지만 OV effect는 거의 0인 decoy를 넣었다.
  - 사용자가 source를 고르면 `attention × OV` 결합 기여를 계산해 "많이 봄=큰 영향" 오해를
    직접 반증한다.
- `InductionTraceLab`
  - previous-token head를 ablate하면 induction match가 86%→8%, B logit이 +2.1→+0.1로
    무너지는 toy causal comparison을 제공한다.
  - 수치는 논문 측정값이 아니라 dependency를 설명하는 개념 실험으로 표시한다.

최종 Viz/test hashes:

```text
48d80cef00a65afa074689423b578327aabe6f72223328be14fc729a46682b34  InterpretabilityFrontierViz.tsx
a39ca6b09d841019b4ffded12a390663b67bfb38ebce027a433bd5bd7c6369e1  llm-interpretability-jspace-contract.spec.ts
3386155836e44d4444360fc69694d4b473f8bee73a1dba6afa22c663ec235d67  SAEExplorers.tsx
a0279d6aab5ca7b66c21a17176624c53cf5cd1a57a0728de7a6fae5d1c844bac  TransformerCircuitLabs.tsx
ad39cdba30ca21b77993132fd3133bd2bfbab7d4aae50256ed685b3f0d342e39  p2-canonical-source-closure.spec.ts
```

## Context Manager and Claude validation

Strict receipt로 인정하는 조건:

```yaml
http: 200
ok: true
decision.worker: claude-code:sonnet
attempts[0].ok: true
first_line: ACCEPT or REVISE
result_length: greater than 40
source_hash_before_equals_after: true
source_hash_still_current: true
```

500, code 143, wrong first-line format, source drift와 verdict/body contradiction은 모두 폐기한다.

검증 묶음:

- Content/source drift: `.codex-tmp/claude-recheck-content-2026-07-29/`
  - accepted A2/B3/C7/D3
  - `strict-summary.json`의 `allStrictValid=true`
  - rejected attempt와 폐기 이유는 `manifest.json`에 보존
- Sidebar B4:
  - `.codex-tmp/claude-recheck-ia-sidebar-2026-07-29/b4-results/`
- Top-down route C4와 ownership A5:
  - `.codex-tmp/claude-recheck-ia-sidebar-2026-07-29/ac4-results/`
  - `C4-current-topdown-route-contract.raw.json`: ACCEPT
  - `A5-ownership-compact-proof.raw.json`: ACCEPT
- Interpretability frontier Viz:
  - `.codex-tmp/claude-recovery-all-pending-2026-07-28/results-interpretability-retry-j/interp-frontier-viz-final-j.json`
  - ACCEPT
- SAE, Transformer Circuits와 Diffusion post-fix 6개 packet:
  - `.codex-tmp/claude-strict-postfix-2026-07-29/`
  - `01`, `02`, `03-r1`, `04`, `05`, `06-r1`: 모두 ACCEPT
  - 최초 `03`은 필수 hash footer 누락, 최초 `06`은 첫 줄 형식 위반으로 폐기했다.
  - 총 8회 시도, strict-valid 6개, reject 2개다.
- 360px 회귀에서 추가 수정한 Deformable DETR 수식:
  - `.codex-tmp/claude-deformable-detr-strict-2026-07-29/`
  - `A`, `B-r1`: 모두 ACCEPT
  - 최초 `B`는 첫 줄 형식 위반으로 폐기했다.
  - 총 3회 시도, strict-valid 2개, reject 1개다.

Accepted review의 non-blocking follow-up:

- Attention all-masked softmax의 UI 직접 재현
- Janus CFG의 "번갈아/짝" 표현 통일
- Robot trajectory grid convergence 값의 실제 browser execution evidence

## Local verification

```text
eslint: PASS
tsc --noEmit: PASS
Playwright combined route/source/sidebar/J-space/SAE: 50/50 PASS
Playwright final J-space contract: 5/5 PASS
Playwright canonical source closure at 360/390/768/1440: 5/5 PASS
Playwright SAE contract: 4/4 PASS
Playwright sidebar IA: 16/16 PASS
Playwright top-down IA/schema: 22/22 PASS
Vite production build: PASS
Production Playwright combined suite: 50/50 PASS
```

Responsive screenshots:

```text
/tmp/blog-final-recheck-2026-07-29/route-mobile.png
/tmp/blog-final-recheck-2026-07-29/route-desktop.png
/tmp/blog-final-recheck-2026-07-29/article-mobile.png
/tmp/blog-final-recheck-2026-07-29/article-desktop.png
```

추가 Viz screenshots:

```text
/tmp/transformer-mobile-virtual.png
/tmp/transformer-mobile-qkov.png
/tmp/transformer-mobile-induction.png
/tmp/transformer-desktop-virtual.png
/tmp/transformer-desktop-qkov.png
/tmp/transformer-desktop-induction.png
.codex-tmp/sparse-autoencoder-reconstruction-mobile.png
.codex-tmp/sparse-autoencoder-evidence-mobile.png
```

## Deployment record

- Build: `VITE_BASE_PATH=/lab/ vite build`, 8858 modules, PASS
- Service: `cm-blog.service`, active after restart at 2026-07-29 03:16:59 KST
- Local `dist/index.html` SHA-256:
  `8d8cce732918386313e2f66eb23c39849d46569651b464a443d0a22446e98ceb`
- Production index SHA-256:
  `8d8cce732918386313e2f66eb23c39849d46569651b464a443d0a22446e98ceb`
- Public Transformer Circuits route: HTTP 200
- Production viewport/interaction regression: 50/50 PASS

## 4B/9B authoring workflow

작은 모델에는 전체 저장소와 논문을 한 번에 주지 않는다. 다음 bounded packet을 순서대로 실행한다.

1. **Normalize source**
   - section, equation, figure, table, appendix와 page anchor를 IR로 만든다.
   - claim마다 source span, scope, metric denominator와 limitation을 붙인다.
2. **Select current and floor**
   - 최신 target 한 개와 최소 canonical source 한 개만 고른다.
   - 더 오래된 논문은 현재 mechanism을 설명하지 못할 때만 연다.
3. **Create a private transfer problem**
   - 공개 퀴즈가 아니라 누락을 찾는 내부 평가 문제를 만든다.
   - 본문만으로 실험 설계와 실패 조건을 도출할 수 있는지 검사한다.
4. **Build a claim/evidence matrix**
   - observation, readout, correlation, attribution, intervention과 generalization을 분리한다.
   - 숫자는 모집단, 분모, model, prompt family와 trial count를 함께 저장한다.
5. **Write intuition before notation**
   - 왜 필요한지 -> 어떤 문제를 푸는지 -> 실행 순서 -> 수식 -> 기호별 한국어 설명 순서로 쓴다.
   - 전문 용어가 연속되면 일상적 동작과 tensor/data flow를 먼저 복원한다.
6. **Generate computed Viz**
   - 정적 그림보다 사용자가 하나의 변수를 바꾸고 결과 차이를 확인하게 한다.
   - fixture 숫자와 논문 측정값을 시각적으로 구분한다.
7. **Run structural self-audit**
   - raw LaTeX, KaTeX error, overflow, font size, touch target, duplicated route destination,
     source closure와 finite stop rule을 기계 검사한다.
8. **Request strict external review**
   - source hash를 prompt와 receipt에 고정한다.
   - broad prompt 대신 source/math/Viz/IA packet으로 나누고 최대 2개씩 병렬 실행한다.
   - timeout과 source drift는 결과가 아니라 미검증 상태로 돌린다.
   - `ACCEPT`라는 단어가 본문에 있어도 첫 줄 형식이나 hash footer가 틀리면 폐기하고 재호출한다.
9. **Render and deploy**
   - 360/390/768/1440에서 interaction 후 상태까지 검사한다.
   - local build hash와 production response를 비교한다.

작은 모델의 역할은 source span 추출, 용어 정규화, section draft와 test fixture 생성으로 좁힌다.
최종 claim boundary, source contradiction, hard transfer problem과 release 판단은 더 강한 reviewer 또는
사람이 맡는다.
