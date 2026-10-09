# r-aa 수식 주석 재작성 원장 (2026-10-09)

대상 38개 파일, 54개 식의 `annotatedFormula`와 `operations`를 다시 썼다. `terms`의 `name`은 모두 뜻이 있어 바꾸지 않았다. `formula`, `question`, `idea`, `interpretation`, `assumptions`, 본문도 바꾸지 않았다.
기계 문구 marker가 없던 식 가운데 범용 문구(`기준량당 비율`, `분자에 둔 관심량…`, `허용 경계 판정`, `로그 비용 변환`, `선택 비율 정규화`, `<용어> 계산`)만 달린 식도 같은 식 블록 안에 있으면 함께 다시 썼다.
이미 도메인 뜻이 달려 있던 식(lora-finetuning/LoRA.tsx 3번째, lora-finetuning/QLoRA.tsx 2번째)은 그대로 두었다.

## 파일별 재작성 수

| 파일 | 식 수 |
|---|---|
| arima/Components.tsx | 1 |
| arima/Overview.tsx | 2 |
| attention-theory/Additive.tsx | 1 |
| attention-theory/Multiplicative.tsx | 2 |
| attention-theory/Overview.tsx | 2 |
| attention-theory/SelfAttention.tsx | 2 |
| claw-api-client/PromptCache.tsx | 1 |
| claw-cli/Rendering.tsx | 1 |
| claw-file-ops/ReadWrite.tsx | 1 |
| claw-hooks/ModernArticle.tsx | 1 |
| claw-mcp/ModernArticle.tsx | 1 |
| claw-policy-engine/ModernArticle.tsx | 1 |
| claw-telemetry/Usage.tsx | 1 |
| cross-entropy/Expectation.tsx | 1 |
| cross-entropy/Overview.tsx | 1 |
| cross-entropy/SoftmaxCEGradient.tsx | 2 |
| dezero-autodiff/Backward.tsx | 1 |
| dezero-autodiff/HigherOrder.tsx | 1 |
| fft/AIUsage.tsx | 2 |
| fft/Algorithm.tsx | 3 |
| fft/Fourier.tsx | 2 |
| in-context-lora/Training.tsx | 2 |
| llm-serving-ops/Overview.tsx | 2 |
| llm-serving-ops/ServingDeployment.tsx | 2 |
| lora-finetuning/Data.tsx | 1 |
| lora-finetuning/LoRA.tsx | 2 |
| lora-finetuning/Overview.tsx | 1 |
| lora-finetuning/Practice.tsx | 2 |
| lora-finetuning/QLoRA.tsx | 1 |
| math-complex-numbers-oscillations/EulerFormula.tsx | 3 |
| math-exponents-logarithms/Exponents.tsx | 1 |
| math-matrices-svd/MatrixMap.tsx | 1 |
| math-matrices-svd/Multiplication.tsx | 1 |
| math-matrices-svd/RankBasis.tsx | 1 |
| math-vectors-inner-products/Applications.tsx | 1 |
| math-vectors-inner-products/CauchySchwarz.tsx | 1 |
| math-vectors-inner-products/DotProduct.tsx | 1 |
| math-vectors-inner-products/Norm.tsx | 1 |
| **합계** | **54** |

## 대표 before/after (claw-hooks/ModernArticle.tsx)

Before:
- `\underbrace{\sum_{i=1}^{m}t_i}_{\text{Pre-hook 지연 계산}}`, `\underbrace{40+70+25=135\ \mathrm{ms}}_{\text{오른쪽 항으로 결과 계산}}`
- annotation `["Pre-hook 지연이(가) 식의 결과에 기여하는 방식을","계산합니다.", …]`

After:
- `\underbrace{T_{pre}}_{\text{tool 시작 전 지연}}=\underbrace{\sum_{i=1}^{m}t_i}_{\text{matching hook 시간 합}}=\underbrace{40}_{\text{hook 1}}+\underbrace{70}_{\text{hook 2}}+\underbrace{25}_{\text{hook 3}}=\underbrace{135\ \mathrm{ms}}_{\text{spawn 제외 최소}}`
- annotation `["matching hook m개가 등록 순서대로","하나씩 돌아 시간이 겹치지 않으므로","각 hook 시간을 그대로 더합니다"]`, `["세 hook이 40·70·25 ms면 hook 자체만","135 ms이고, process spawn과","scheduler 지연은 그 위에 더해집니다"]`

## 검증

- marker grep(브리프 7항 패턴): 0건
- KaTeX `renderToString(throwOnError)`로 대상 파일의 모든 `formula`·`annotatedFormula`·`expression`을 렌더링: 실패 0건. `\text{}` 안의 그리스 문자, 아래첨자 유니코드, `_`는 모두 없앴다.
- annotation은 연산당 1~3줄, 한 줄 34자 이하. `expression`이 해당 `formula`에 그대로 들어 있는지 스크립트로 확인했다.
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit`: 통과 (1475/1475)
- `npx eslint <r-aa 파일>`: 0 error
- `npx tsc -b --noEmit`: 오류 0건. 기본 heap에서는 OOM으로 중단돼 `NODE_OPTIONS=--max-old-space-size=12288`로 다시 실행했다.

## 검토 필요

1. **cross-entropy/Overview.tsx**: 본문의 0.9·0.01 사례에 −ln 0.9≈0.11 nat, −ln 0.01≈4.61 nat를 대입했다. 이 계산값 자체는 본문에 없다.
2. **fft/Algorithm.tsx**: butterfly annotation에 본문에 없는 항등식 ω_N^(k+N/2)=−ω_N^k를 적었다. 수학적으로는 맞다.
3. **fft/Fourier.tsx**: Nyquist 연산에 본문의 8kHz·1kHz/7kHz alias 사례를 썼다. bin 간격 식에는 이 섹션에 해당하는 N 사례가 없어 수치를 대입하지 않았다.
4. **llm-serving-ops/Overview.tsx**: TTFT 다섯 항을 `gateway(ingress+route)`, `runtime(queue+prefill)`, `첫 token 전송` 세 구간으로 묶었다. route를 gateway 쪽에 둔 것은 terms 설명("후보 filtering, backend 선택")에서 추론했다.
5. **math-vectors-inner-products/CauchySchwarz.tsx**: 기존 `formula` prop에 underbrace 라벨이 이미 들어 있다. 규칙대로 `formula`는 그대로 두고, 중첩됐던 `annotatedFormula`만 한 겹으로 폈다.
6. **claw-api-client/PromptCache.tsx, claw-telemetry/Usage.tsx, arima/*, attention-theory/Multiplicative.tsx**: 본문에 수치 사례가 없어 annotation을 도메인 뜻만으로 썼다. 새 수치는 지어내지 않았다.
