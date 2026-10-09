# r-ae 수식 주석 재작성 원장 (2026-10-09)

대상: `r-ae.txt` 39개 파일. 기계 생성 `annotatedFormula`·`operations`를 글의 running example 수치로 다시 썼다. `formula`·`question`·`idea`·`terms`·`interpretation`·본문은 바꾸지 않았다.

## 파일별 재작성 수

| 파일 | 식 수 |
|---|---|
| blockchain/uniswap-v4/ModernArticle.tsx | 1 |
| blockchain/usdc-circle/ModernArticle.tsx | 1 |
| blockchain/vdf/ModernArticle.tsx | 1 |
| crypto/diffie-hellman/Protocol.tsx | 1 |
| crypto/diffie-hellman/Security.tsx | 1 |
| ethereum/fork-id/ModernArticle.tsx | 1 |
| ethereum/helios-update/Overview.tsx | 1 |
| ethereum/prysm-beacon-db/KvSchema.tsx | 1 |
| ethereum/prysm-beacon-db/PruningArchival.tsx | 1 |
| ethereum/reth-net/Session.tsx | 1 |
| ethereum/reth-precompiles/Overview.tsx | 1 |
| ethereum/reth-provider/StateProvider.tsx | 1 |
| gpu/cuda-matrix-multiply/ModernArticle.tsx | 3 |
| gpu/cuda-thread-hierarchy/Indexing1D.tsx | 1 |
| gpu/ec-gpu-gen/ModernArticle.tsx | 3 |
| gpu/ec-gpu-ops/ModernArticle.tsx | 5 |
| gpu/gpu-proof-pipeline/ModernArticle.tsx | 3 |
| gpu/gpu-witness-gen/ModernArticle.tsx | 4 |
| gpu/icicle-framework/ModernArticle.tsx | 3 |
| gpu/kzg-gpu/ModernArticle.tsx | 4 |
| gpu/msm-gpu-impl/ModernArticle.tsx | 4 |
| gpu/ntt-gpu-impl/ModernArticle.tsx | 4 |
| gpu/poly-ops-gpu/ModernArticle.tsx | 5 |
| gpu/poseidon-gpu/ModernArticle.tsx | 4 |
| gpu/rapidsnark-gpu/ModernArticle.tsx | 3 |
| hw/b300-switchless-network/Nccl.tsx | 1 |
| hw/gpu-comparison/ModernArticle.tsx | 2 |
| hw/memory/ECC.tsx | 1 |
| hw/nvme-storage/ModernArticle.tsx | 1 |
| hw/power-cooling/ModernArticle.tsx | 4 |
| hw/server-vs-desktop/ModernArticle.tsx | 3 |
| isms-aml/aml-controls-article.tsx | 2 |
| isms-aml/compliance-evidence-article.tsx | 3 |
| isms-aml/isms-access-control.tsx | 1 |
| isms-aml/isms-operations-article.tsx | 1 |
| isms-aml/isms-overview.tsx | 1 |
| market-failure/externalities-and-social-cost/viz/CoaseViz.tsx | 0 (오탐, 아래 참조) |
| tee/platform-tee-article.tsx | 3 |
| tee/security-release-article.tsx | 3 |
| **합계** | **84식 / 38파일** |

재작성 범위: 브리프의 기계 문구가 든 식 전부와, 같은 파일에서 `분자에 둔 관심량을…`·`계산한 양을 허용 경계와…`·`기준량당 비율`·`<용어> 계산` 라벨만 있던 식.

## 대표 before/after

`hw/power-cooling` 냉각 유량 식 `\dot Q=\dot m\,c_p\,\Delta T`

- before: `\underbrace{\dot m\,c_p\,\Delta T}_{\text{변화량 계산}}`, annotation `["인접한 level의 차이를 남겨 변화량을 계산합니다.", …]`
- after: `\underbrace{\dot Q}_{\text{운반할 열}}=\underbrace{\dot m}_{\text{질량 유량}}\,\underbrace{c_p}_{\text{유체 비열}}\,\underbrace{\Delta T}_{\text{inlet→outlet 상승}}`, annotation `["초당 흐르는 질량이 1K당 담는 열에","허용 온도 상승을 곱해 heat rate와 맞춤","2kW / (1005·10) ≈ 0.199 kg/s 공기"]`

## 검증

- 브리프 grep: 0건. 남은 1건은 `CoaseViz.tsx:44`의 `right: "둘 다"`인데, 이것은 Coase 사례 viz의 권리 배정 라벨("가해 쪽/피해 쪽/둘 다")이며 수식 annotation이 아니다. 본문 데이터라 바꾸지 않았다.
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit`: 통과.
- `npx eslint <39 files>`: 0 error.
- KaTeX: 39개 파일의 `annotatedFormula`·`operations.expression` 305개를 `katex.renderToString(throwOnError)`로 렌더링해 0 실패. `\text{}` 안의 `^`·τ·²·원문자는 모두 뺐다.
- annotation 한 줄 34자 초과: 0.
- `npx tsc -b --noEmit`: exit 0, 오류 없음. 기본 heap에서는 OOM이 나서 `NODE_OPTIONS=--max-old-space-size=12288`로 실행했다.

## 검토 필요

1. 브리프 marker 목록에는 없지만 범용 템플릿 첫 줄이 남은 식 12개. 둘째 줄부터는 도메인 문장이 있어 "도메인 뜻이 이미 있으면 유지" 규칙에 따라 그대로 두었다. 다만 라벨은 뜻이 없다. 후속 정리 후보:
   - `판정 조건 결합` + "필요한 gate가 모두 참일 때만…" (9개): aml-controls `A=C∧M∧D∧G`·`S=D∧N∧E∧C`, compliance-evidence `P=I∧N∧C∧E`, isms-operations `A=E∧I∧V∧M`·`A=T∧S∧P∧C`·`A_net=Z∧F∧I∧P`, platform-tee OP-TEE `A=S∧C∧M∧K`, security-release `R=Q∧N∧L∧P∧C`, rapidsnark `admit` 조건.
   - `경계 후보 선택` + "허용 후보 중 목적에 맞는 경계값을…" (3개): gpu-proof-pipeline critical path `E(v)`/`T_critical`, icicle `t_reuse(b)`, nvme-storage `min(B_device,…)`.
2. 원문에 수치 예가 없어 글의 사례 이름만 재사용한 식: platform-tee Oasis·Phala·dstack, security-release sealing·Welch t·envelope. 수치를 새로 만들지 않고 payroll 사례와 interpretation 문장만 썼다.
3. `kzg-gpu` commitment 식의 `[f(\tau)]G` 라벨은 KaTeX `\text{}` 안에서 τ가 렌더링되지 않아 "숨은 점에서 평가한 commit"으로 풀었다. 표현이 적절한지 확인이 필요하다.
