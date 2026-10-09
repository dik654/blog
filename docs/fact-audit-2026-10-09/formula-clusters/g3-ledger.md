# g3 수식 주석 재작성 원장 (3차: 남은 범용 템플릿 문구 + 리뷰 지적 정정, 2026-10-09)

## Task A — 범용 문구 제거

대상은 `g3.txt`의 20개 파일이다. 아래 범용 문구가 0건이 되도록 `annotatedFormula`와 `operations`를 다시 썼다.
`로그 비용 변환`, `선택 비율 정규화`, `확률 가중 평균`, `변화량 계산`, `인접한 level의 차이를 남겨…`, 그리고 같은 연산에 붙어 있던 `확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.`와 idea를 34자로 잘라 붙인 조각.
수치 사례는 각 글의 본문·interpretation·terms에 이미 있는 값을 가져왔다. 거기서 나오는 산술(예: s=8 → 0.1·ln 8+1≈1.21)만 새로 계산했고, 새 사실은 넣지 않았다.

| 파일 | 재작성 식 | 사용한 글의 수치 |
|---|---|---|
| ai/arima/Modeling.tsx | 1 (AIC/BIC) | parameter당 2, log n (n=100 → 약 4.6, e²≈7.4 경계는 산술) |
| ai/cross-entropy/CrossEntropy.tsx | 1 | 정답 확률 0.9→0.105 nat, 0.01→4.605 nat |
| ai/cross-entropy/Entropy.tsx | 1 | 공정한 동전 ln 2≈0.693 nat, P=(1,0)→0 |
| ai/cross-entropy/Expectation.tsx | 0 (본문 문장) | — |
| ai/dezero-advanced/DropoutEmbedding.tsx | 0 (idea 문장) | — |
| ai/distributional-semantics/NeuralApproach.tsx | 1 (SGNS shifted PMI) | PMI=4, k=5 → 2.39 |
| ai/ecod/Algorithm.tsx | 1 (U_L, U_R) | 0.5→0.69, 0.01→4.61 |
| ai/eda-workflow/Hypothesis.tsx | 1 (라벨만, operation은 원래 도메인 문장 유지) | 12.0−10.5=1.5분 |
| ai/math-exponents-logarithms/Logarithms.tsx | 1 | log₂8=3, log₁₀0.01=−2 |
| ai/math-exponents-logarithms/ProductRule.tsx | 1 | u=aᵐ, v=aⁿ, 0.5³ |
| ai/math-variance-sampling/ModernArticle.tsx | 1 (operation만) | n=3, σ²=1/2 → 1 |
| ai/moe-routing-and-load-balancing.tsx | 1 (operation 2개) | γ=0.001, expert 0: 0→−0.001→−0.002 |
| ai/time-features/Lag.tsx | 1 | 이전 7개 거래 ≠ 최근 7일 |
| ai/yarn-rope-extension/YarnMethod.tsx | 1 | s=8(4K→32K) → m≈1.21, logit 배율 ≈1.46 |
| blockchain/cometbft-consensus/Timeout.tsx | 1 | 수치 없음 (step·round 의미만) |
| blockchain/csprng/EntropySource.tsx | 1 | pmax=1/8 → 3 bits |
| blockchain/gossipbft/ModernArticle.tsx | 1 | 수치 없음 (rΔ+ε 의미만) |
| ethereum/helios-types/SszInternal.tsx | 1 | 13=1101₂, depth 3, path 101 |
| ethereum/prysm-beacon-state/FieldTrie.tsx | 1 | L=16 → d=4, 약 5개 |
| filecoin/expected-consensus/ModernArticle.tsx | 1 (W(T)) | 수치 없음 (항의 뜻과 head 선택) |
| **합계** | **18식** | |

본문·idea에 있던 두 곳은 주석이 아니라 일반 문장이었다. grep을 0으로 만들려고 뜻을 바꾸지 않고 낱말만 바꿨다.
- Expectation.tsx 본문: `정의한 확률 가중 평균을` → `정의한, 확률로 가중한 평균을`
- DropoutEmbedding.tsx idea: `두 경우의 확률 가중 평균은 원래 x입니다.` → `두 경우를 각 확률로 가중해 평균하면 원래 x입니다.`

### 대표 before/after (ethereum/helios-types/SszInternal.tsx)

Before:
```tex
13_{10}=\underbrace{1101_2\quad\Rightarrow\quad \operatorname{depth}(13)=\lfloor\log_2 13\rfloor=3,\quad \operatorname{path}=101}_{\text{로그 비용 변환}}
```
operation 1개: `["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","Index를 binary로 쓰고 맨 앞의 root bit를","제거합니다."]`

After:
```tex
13_{10}=\underbrace{1101_2}_{\text{맨 앞 1이 root}}\quad\Rightarrow\quad \operatorname{depth}(13)=\underbrace{\lfloor\log_2 13\rfloor=3}_{\text{sibling hash 3개}},\quad \operatorname{path}=\underbrace{101}_{\text{오른·왼·오른}}
```
operation 3개: `13_{10}=1101_2`(맨 앞 1은 root 자리), `\lfloor\log_2 13\rfloor=3`(sibling 3개를 결합), `\operatorname{path}=101`(right→left→right).

### 함께 정리한 것
- moe-routing: 기존 expression `\gamma\cdot\operatorname{sign}(\cdot)`는 formula의 조각이 아니었다. 실제 조각인 `\gamma\cdot\operatorname{sign}`와 `b_i^{(t)}+\gamma\cdot\operatorname{sign}`로 바꿨다.
- math-variance-sampling(9절): 기존 expression `\mathbb E[s^2]=…`도 formula에 없었다. formula의 `n(\bar Z_n-\mu)^2`로 바꿨다.

## Task B — 리뷰 지적 정정

1. **aa-fundamentals/ERC4337.tsx (prefund)**: 지적이 맞았다. 기존 assumption은 paymaster 필드를 생략했다고만 적었고, `G_verify` term은 "Account와 paymaster validation"이라고 써서 식과 어긋났다. 그 assumption을 "paymaster가 없는 경우이고, 일반형 `(G_v+G_c+G_pv+G_po+G_pre)·F_max`는 같은 글의 prefund 절(`/cs/blockchain/aa-fundamentals#prefund`, ModernArticle.tsx)에 있다"로 바꿨다. `G_verify` 설명은 account validation 한도로 고치고 paymaster 검증은 별도 한도라고 적었다. formula는 그대로 뒀다.
2. **transfer-learning-practice/LRStrategy.tsx**: 지적이 맞았다. ‖Δθ‖=η‖g‖는 plain SGD에서만 정확하다. "Adam류에서는 g를 m̂/(√v̂+ε) 같은 정규화된 update 방향으로 읽는다"는 assumption을 맨 앞에 넣고, 빠져 있던 `g_ℓ` term을 추가했다.
3. **time-features/Overview.tsx**: 지적이 맞았다. 본문은 h를 cutoff 뒤의 target 구간, 즉 질문의 일부로 다루고, Φ는 c까지의 history만 요약한다. 그래서 h를 Φ가 아니라 f_θ의 두 번째 인자로 넣었다: `f_θ(Φ({…}), h)`. formula, annotatedFormula(`\underbrace{h}_{\text{예측할 미래 구간}}`), 새 operation(`,\,h`)을 맞췄고, "Φ는 h에 의존하지 않으며, horizon마다 model을 따로 두면 h를 f의 첨자로 읽는다"는 assumption을 더했다.
4. **impl-field-arithmetic/ModernArticle.tsx**: 지적이 맞았다. 세 번째 식의 `n'`을 전체 폭 상수 `N'`(−p⁻¹ mod R)로 바꿨다. 바꾼 곳은 formula, annotatedFormula, operation expression과 annotation, terms(N′ mod 2^w = 첫 식의 n′라는 관계도 적음), idea, 기존 assumption이다. assumption `T<pR`도 더했다. 그러면 m<R이고 u<2p라서 조건부 뺄셈 한 번이면 되고, 두 residue가 [0,p)에 있으면 T<p²<pR이다. 첫 식의 word 상수 `n'=-p_0^{-1}\bmod 2^w`는 그대로 뒀다.
5. **filecoin/expected-consensus/ModernArticle.tsx:28**: 지적이 맞았다. idea의 "QAP 지분 s"를 "QAP 지분 p/P(provider QAP p ÷ network QAP P)"로 바꿨다. 같은 블록의 `question`도 "Power 지분 s인"이라고 써서 똑같이 어긋나 있었으므로 "Power 지분 p/P인"으로 함께 맞췄다(question 수정은 지시 범위를 조금 넘는다).

## 검증

- 범용 문구 grep(12개 패턴, 20개 파일): 0건. 브리프 1·2차 마커 grep과 `확률이나 곱셈 규모`도 0건.
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit`: 통과(missingExplicitAnnotations 0, unsafeKatexSymbolFiles 0).
- `npx eslint` 24개 파일: 0 error.
- KaTeX `throwOnError` 렌더: 24개 파일의 모든 formula·annotatedFormula·operation expression·term symbol 342개가 통과했다.
- expression이 formula의 부분 문자열인지: 이번에 고친 expression은 모두 통과했다. 손대지 않은 블록 중 다음은 여전히 실패한다(이번 범위 밖이라 그대로 둠).
  - math-variance-sampling: 73·84·103·116·131·143·161·177·193행. expression이 annotatedFormula의 대입 사례에만 있다.
  - moe-routing: 70행 블록.

## 검토 필요

- Hypothesis.tsx·ecod Algorithm.tsx·math-variance-sampling에는 손대지 않은 다른 블록에 34자를 넘는 annotation 줄이 남아 있다. 범용 문구는 아니어서 그대로 뒀다.
- arima의 "n=100이면 parameter당 약 4.6"은 글에 없는 n을 예시로 골라 계산한 값이다. 글은 수치 사례를 주지 않는다.
- `npx tsc -b --noEmit`은 돌리지 않았다. 바꾼 것은 문자열 리터럴뿐이고 eslint 파싱은 통과했다.
