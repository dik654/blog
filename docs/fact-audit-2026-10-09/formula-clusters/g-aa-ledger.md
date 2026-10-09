# g-aa 수식 주석 재작성 원장 (2차: 범용 템플릿 문구, 2026-10-09)

대상 27개 파일, 31개 식의 `annotatedFormula`와 `operations`를 다시 썼다. `formula`·`terms`·`question`·`idea`·`interpretation`·`assumptions`·본문은 바꾸지 않았다.
범용 라벨(`기준량당 비율`, `허용 경계 판정`, `경계 후보 선택`)과 범용 annotation(`분자에 둔 관심량…`, `계산한 양을 허용 경계와…`, `허용 후보 중 목적에 맞는…`)을 지우고, 식의 각 구간(분자·분모·항·연산)에 그 글에서의 뜻을 붙였다. 같은 식 블록에 함께 있던 다른 범용 라벨(`선택 비율 정규화`, `확률 가중 평균`)도 함께 바꿨다. 수치 사례는 글의 interpretation·idea·content 상수(sionic-glm-b300의 6.65GB, 8TB/s, 효율 0.6)에서 가져왔고 새 사실은 넣지 않았다.

## 파일별 재작성 수

| 파일 | 식 수 |
|---|---|
| arima/Modeling.tsx | 1 |
| claw-config/OAuth.tsx | 1 |
| claw-plugin/ModernArticle.tsx | 1 |
| claw-recovery/Recipes.tsx | 1 |
| cross-entropy/CEvsMSE.tsx | 1 |
| cross-entropy/KLDivergence.tsx | 1 |
| dezero-advanced/DropoutEmbedding.tsx | 1 |
| dezero-advanced/Normalization.tsx | 1 |
| fft/Overview.tsx | 1 |
| in-context-lora/Applications.tsx | 1 |
| lstm-timeseries/Applications.tsx | 1 |
| math-complex-numbers-oscillations/Radians.tsx | 1 |
| math-complex-numbers-oscillations/RootsOfUnity.tsx | 1 |
| math-exponents-logarithms/Bases.tsx | 1 |
| math-matrices-svd/LowRank.tsx | 1 |
| math-matrices-svd/Svd.tsx | 1 |
| math-vectors-inner-products/Projection.tsx | 1 |
| perceptron/Limitation.tsx | 1 |
| rag-pipeline/Chunking.tsx | 1 |
| rag-pipeline/Eval.tsx | 2 |
| sionic-eureka/Evaluation.tsx | 1 |
| sionic-glm-b300/Mtp.tsx | 2 |
| sionic-glm-b300/Roofline.tsx | 2 |
| sionic-glm-b300/Runtime.tsx | 1 |
| skills-anatomy/Execution.tsx | 1 |
| tabular-deep-learning/Overview.tsx | 1 |
| time-features/Cyclic.tsx | 2 |
| **합계** | **31** |

## 대표 before/after (sionic-glm-b300/Runtime.tsx, Amdahl)

Before: 식 전체에 `\underbrace{…}_{\text{기준량당 비율}}` 하나, annotation `"분자에 둔 관심량을 분모의 기준량으로 정규화합니다."`

After:

```tex
S_{\mathrm{total}}=\frac{1}{\underbrace{(1-f)}_{\text{가속 못 받는 비율}}+\underbrace{\frac{f}{S_{\mathrm{local}}}}_{\text{가속된 kernel 몫}}}
```

- `(1-f)` → "launch·collective·sampling 등 / 그대로 남는 시간 비율, f=0.4면 0.6"
- `\frac{f}{S_{\mathrm{local}}}` → "kernel 비율 f가 S배 줄어든 시간 / 4배 빠르면 0.4 / 4 = 0.1"
- 전체 분수 → "원래 시간 1을 새 시간으로 나눈 전체 speedup / 1 / (0.6 + 0.1) ≈ 1.43배"

## 검증

- 2차 grep(`판정 조건 결합|경계 후보 선택|기준량당 비율|허용 경계 판정|…`) 27개 파일 0건, 1차 기계 marker grep 0건
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit` 통과
- `npx eslint <27개 파일>` 0 error
- KaTeX `throwOnError: true`로 27개 파일의 모든 `formula`·`annotatedFormula`·`\underbrace{expression}` 146개 렌더 성공
- 모든 `operations[].expression`이 해당 `formula`의 실제 부분 문자열임을 스크립트로 확인, annotation은 연산당 1~3줄·한 줄 34자 이하
- `npx tsc -b --noEmit`는 저장소 전체에서 4GB heap OOM으로 끝나 결과를 얻지 못했다(내 파일과 무관한 실행 환경 문제, 재시도하지 않음). 변경은 String.raw 템플릿 내용과 문자열 배열뿐이라 타입에 영향이 없다.
- `\text{}` 안에 그리스 문자·`^`·`_` 없음(`\%`만 사용)

## 검토 필요

- **lstm-timeseries/Applications.tsx (MASE)**: `idea`가 분모를 "seasonal-naive one-step error"라고 부르는데, 식의 분모 `|y_t - y_{t-m}|`는 m step 전 값을 쓰는 seasonal-naive 오차다(m=1일 때만 one-step). 식은 맞고 `idea` 표현이 모호하다. 주석은 "m step 전 값을 그대로 쓴 seasonal-naive"로 적었다.
- **time-features/Cyclic.tsx (거리식)**: 주석에 "23시·0시: 2−2cos(2π/24) ≈ 0.068"을 계산해 넣었다. 글에 이 숫자는 없고 interpretation의 "angle 2π/24"를 식에 대입한 값이다.
- **math-matrices-svd/LowRank.tsx**: "Frobenius 오차가 가장 작은 것이 A_k"는 Eckart–Young 정리 내용이며 글의 idea·assumptions와 일치한다. 글에 수치 사례가 없어 수치 대입은 넣지 않았다(Svd.tsx, skills-anatomy/Execution.tsx, tabular-deep-learning/Overview.tsx, claw-config/OAuth.tsx도 글에 수치가 없어 대입 없이 도메인 뜻만 적었다).
- 범위 밖으로 남긴 것: arima/Modeling.tsx의 AIC/BIC 식은 2차 목록에 없는 범용 라벨 `로그 비용 변환`과 범용 annotation("확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.")만 달려 있다. 이번 grep 대상이 아니라 그대로 두었다. dezero-advanced/DropoutEmbedding.tsx 등 다른 블록의 `확률 가중 평균` 같은 라벨도 hit 블록 밖에 있는 것은 건드리지 않았다.
