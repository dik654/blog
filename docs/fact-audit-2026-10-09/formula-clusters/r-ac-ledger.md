# r-ac 수식 주석 재작성 원장 (2026-10-09)

범위: `r-ac.txt`의 38개 파일. ExplainedFormula 51개 중 49개를 재작성했습니다. `PrefillDecode.tsx`의 1·3번째 식은 이미 도메인 주석이 있어 그대로 두었습니다.
고친 prop은 `annotatedFormula`와 `operations`뿐입니다. `formula`·`terms`·`question`·`idea`·`interpretation`·`assumptions`·본문은 바꾸지 않았습니다.

## 파일별 재작성 수

| 파일 | 재작성 |
|---|---|
| ai/transformer-architecture/QKVComputation.tsx | 2 |
| ai/transformer-architecture/ScalingLaws.tsx | 1 |
| ai/vision-transformer/Practice.tsx | 2 |
| ai/vision-transformer/Tradeoff.tsx | 1 |
| ai/vllm-scheduler/PrefillDecode.tsx | 1 (3개 중 priority 식) |
| ai/vllm-scheduler/ScheduleMethod.tsx | 1 |
| ai/vllm-spec-decode/DraftVerify.tsx | 2 |
| ai/vllm-spec-decode/EagleMtp.tsx | 1 |
| ai/vllm-spec-decode/Overview.tsx | 2 |
| ai/yarn-rope-extension/RopeFoundation.tsx | 3 |
| blockchain/aa-fundamentals/NativeAA.tsx | 1 |
| blockchain/bft-comparison/ModernArticle.tsx | 1 |
| blockchain/bulletproofs/ModernArticle.tsx | 2 |
| blockchain/bullshark-deep/ModernArticle.tsx | 1 |
| blockchain/circom/ModernArticle.tsx | 1 |
| blockchain/cometbft-abci/FinalizeCommit.tsx | 1 |
| blockchain/cometbft-abci/PrepareProcess.tsx | 1 |
| blockchain/cometbft-crypto/ModernArticle.tsx | 1 |
| blockchain/cometbft-execution/ModernArticle.tsx | 1 |
| blockchain/cometbft-state/ModernArticle.tsx | 1 |
| blockchain/cometbft-types/ValidatorSet.tsx | 1 |
| blockchain/commonware-crypto-p2p/ModernArticle.tsx | 1 |
| blockchain/commonware-deep-dive/ModernArticle.tsx | 1 |
| blockchain/commonware-storage/ModernArticle.tsx | 1 |
| blockchain/compound-v3/CollateralBorrow.tsx | 1 |
| blockchain/compound-v3/CometArchitecture.tsx | 2 |
| blockchain/compound-v3/Liquidation.tsx | 1 |
| blockchain/crypto-primitives/Ed25519.tsx | 1 |
| blockchain/crypto-primitives/MerkleCommitment.tsx | 1 |
| blockchain/crypto-primitives/Schnorr.tsx | 2 |
| blockchain/csprng/Applications.tsx | 1 |
| blockchain/da-theory/ModernArticle.tsx | 2 |
| blockchain/dag-consensus/ModernArticle.tsx | 1 |
| blockchain/distributed-systems/Overview.tsx | 1 |
| blockchain/elliptic-curves/G1Curve.tsx | 2 |
| blockchain/elliptic-curves/G1G2BN254.tsx | 1 |
| blockchain/elliptic-curves/Overview.tsx | 1 |
| blockchain/erasure-coding/Overview.tsx | 1 |
| **합계** | **49** |

## 대표 before/after (compound-v3/CollateralBorrow.tsx)

Before

```tex
L_{borrow}=\underbrace{-D+\sum_iV_iCF_{b,i},\qquad L_{liq}=-D+\sum_iV_iCF_{l,i}}_{\text{base debt value 계산}}
```
annotation: `["base debt value이(가) 식의 결과에 기여하는","방식을 계산합니다.", ...]`

After

```tex
L_{borrow}=\underbrace{-D}_{\text{빚은 음수}}+\underbrace{\sum_iV_iCF_{b,i}}_{\text{보수적 borrow 한도}},\qquad L_{liq}=-D+\underbrace{\sum_iV_iCF_{l,i}}_{\text{청산 전 버팀 한도}}
```
annotation: `["담보 가치에 낮은 CF_b를 곱해 더하고","base debt를 뺍니다. 0 이상이어야 borrow","예: $1,000×75%−$800 = −$50"]`, `["같은 담보에 더 높은 CF_l을 곱합니다","예: $1,000×85%−$800=$50 → 아직 안전","debt $900이면 −$50 → liquidatable"]`

## 재작성하며 함께 바로잡은 깨진 annotatedFormula

- `cometbft-types/ValidatorSet.tsx`: 기존 annotatedFormula가 `\gets`를 `\ge`+`ts`로 깨뜨려 `p_i\ge ts p_i+w_i`처럼 표시되고 있었습니다. formula와 같은 `\gets`로 복구했습니다.
- `vllm-scheduler/PrefillDecode.tsx`: underbrace가 `<_{\mathrm{lex}}` 사이를 잘라 `_{\mathrm{lex}}(p_j,a_j)`만 묶고 있었습니다. 비교 전체를 묶도록 고쳤습니다.
- 여러 파일에서 underbrace 안에 `,\qquad` 뒤의 다음 식까지 한 덩어리로 들어가 있었습니다(bulletproofs, Ed25519, Schnorr, G1Curve, da-theory 등). 식마다 따로 라벨을 달았습니다.

## 검증

- 마커 grep(브리프의 패턴 + `기준량당 비율`·`경계 후보 선택`·`허용 경계 판정`·`확률 가중 평균`·` 계산}`): 38개 파일에서 0건
- KaTeX 렌더(별도 스크립트, throwOnError): 51개 식의 formula·annotatedFormula와 operation 123개(`\underbrace{expr}` 형태)가 모두 오류 없이 렌더됩니다. 모든 expression이 formula 안의 조각과 일치합니다(공백 무시).
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit`: 통과
- `npx eslint <38 files>`: 0 error
- `npx tsc -b --noEmit`: 기본 heap에서는 OOM으로 중단됐습니다. `NODE_OPTIONS=--max-old-space-size=14000`으로 다시 돌리니 exit 0, 출력 0줄이었습니다.

## 검토 필요

1. `vllm-spec-decode/EagleMtp.tsx`: `formula`에 `\mathbb{E}[Y_K],t_T(1)`라는 쉼표가 있습니다. `\,`(곱셈 간격)에서 백슬래시가 빠진 것으로 보입니다. 지금은 "E[Y_K], t_T(1)"처럼 나열로 읽힙니다. 브리프 규칙상 formula는 고치지 않았고, annotatedFormula와 expression도 같은 표기를 유지했습니다.
2. `bulletproofs/ModernArticle.tsx` b′ 접기 주석의 "⟨a′,b′⟩에 원래 ⟨a,b⟩와 L·R cross term만 남게"는 IPA의 표준 성질입니다. 다만 글 본문이 이 등식을 직접 적지는 않습니다.
3. `vllm-scheduler/PrefillDecode.tsx`의 VTC 식(3번째, 손대지 않음)에는 기존 annotation 한 줄이 38자여서 34자 폭 규칙을 넘습니다. 마커가 없는 식이라 그대로 두었습니다.
4. `ai/vision-transformer/Practice.tsx`·`Tradeoff.tsx`: 본문에 수치 사례가 없어 해상도·seed 수 같은 숫자는 넣지 않았고, 도메인 뜻만 달았습니다.
