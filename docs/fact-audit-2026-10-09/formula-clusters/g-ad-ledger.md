# g-ad 수식 주석 재작성 원장 (2026-10-09, 2차: 범용 템플릿 문구)

대상: `g-ad.txt` 27개 파일. 범용 라벨(`기준량당 비율`·`경계 후보 선택`·`허용 경계 판정`·`판정 조건 결합`)과 범용 annotation 첫 줄이 붙은 식을 글의 running example 수치로 다시 썼다. 대부분 식은 오른쪽 전체를 하나의 underbrace로 감싸고 있었으므로 의미 단위(분자·분모·각 쉼표 조각·각 논리항)로 쪼개 라벨을 따로 달았다. 바꾼 prop은 `annotatedFormula`·`operations`뿐이다. `formula`·`question`·`idea`·`terms`·`interpretation`·본문은 바꾸지 않았다.

## 파일별 재작성 수

| 파일 | 식 수 |
|---|---|
| blockchain/uniswap-v3/PositionNft.tsx | 1 |
| blockchain/uniswap-v3/TickMath.tsx | 2 |
| ethereum/bplus-tree/ModernArticle.tsx | 1 |
| ethereum/helios-bootstrap/WeakSubjectivity.tsx | 1 |
| ethereum/helios-config/NetworkConfig.tsx | 1 |
| ethereum/helios-config/Persistence.tsx | 1 |
| ethereum/helios-consensus/CommitteeLifecycle.tsx | 1 |
| ethereum/helios-update/UpdateTrace.tsx | 1 |
| ethereum/helios/Overview.tsx | 1 |
| ethereum/lsm-tree/ModernArticle.tsx | 2 |
| ethereum/mdbx-internals/ModernArticle.tsx | 1 |
| ethereum/prysm-block-proposal/ProposerSelection.tsx | 1 |
| ethereum/prysm-epoch-processing/RewardsPenalties.tsx | 1 |
| ethereum/prysm-finality/FinalizationPruning.tsx | 1 |
| ethereum/prysm-gossipsub/SnappyEncoding.tsx | 1 |
| ethereum/prysm-slot-processing/StateRootCaching.tsx | 1 |
| ethereum/prysm-ssz/Merkleize.tsx | 1 (두 번째 연산의 범용 `로그 비용 변환`도 함께 수정) |
| ethereum/prysm-sync-committee/Contribution.tsx | 1 (aligned 안 3개 라벨) |
| ethereum/prysm-sync/InitialSync.tsx | 1 |
| ethereum/prysm-validator-client/SlashingProtection.tsx | 1 (`대안 gate 중 하나라도…` 범용 줄 포함) |
| ethereum/reth-alloy-primitives/U256Arithmetic.tsx | 1 |
| ethereum/reth-db/Cursor.tsx | 1 |
| ethereum/reth-exex/Overview.tsx | 1 |
| ethereum/reth-mev/Overview.tsx | 1 |
| ethereum/reth-payload-builder/BuildJob.tsx | 1 |
| ethereum/reth-pipeline/StageTrait.tsx | 1 |
| ethereum/reth-sync/FullSync.tsx | 1 |
| **합계** | **30식 / 27파일** |

## 대표 before/after

`blockchain/uniswap-v3/TickMath.tsx` 범위 안 position의 두 token 양 `x=L\frac{\sqrt{p_b}-\sqrt P}{\sqrt P\sqrt{p_b}},\ y=L(\sqrt P-\sqrt{p_a})`

- before: 쉼표 양쪽 전체를 `\underbrace{…}_{\text{기준량당 비율}}` 하나로 감쌈. annotation `["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.", "Token0은 upper sqrt price까지 남은 역수", …]`
- after: `x=\underbrace{L\frac{…}{…}}_{\text{upper까지 남은 token0}},\ y=\underbrace{L(\sqrt P-\sqrt{p_a})}_{\text{lower부터 쌓인 token1}}`, 연산 2개
  - x: `["1/√P에서 1/√pᵦ까지 남은 역수 거리 × L", "가격이 upper에 닿으면 0이 됨", "L=60, √P=2, √pᵦ=3 → 60·1/6 = 10"]`
  - y: `["lower에서 현재까지 sqrt 거리 × L", "가격이 lower로 내려가면 0이 됨", "60·(2−1) = 60"]`

## 구조 결함을 함께 고친 식

- `reth-db/Cursor.tsx`: 기존 annotatedFormula가 `a\le\underbrace{q k_0<…}`였다. formula(`a\leq k_0<…`)에 없는 `q`가 끼어 있었고, operation expression `q k_0<k_1<\cdots<k_r<b`도 formula 조각이 아니었다. `a\leq k_0` / `k_0<k_1<\cdots<k_r` / `k_r<b` 세 조각으로 다시 나눴다.
- `prysm-validator-client/SlashingProtection.tsx`: underbrace가 `(s_1<` 뒤에서 시작해 괄호 짝이 맞지 않는 조각(`s_2<t_2<t_1)\;\lor\;(…)`)을 감싸고 있었다. 두 surround 방향 항 `(s_1<s_2<t_2<t_1)`·`(s_2<s_1<t_1<t_2)`로 나눴다.
- `prysm-block-proposal/ProposerSelection.tsx`, `prysm-finality/FinalizationPruning.tsx`: underbrace가 `\;`부터 시작하는 비대칭 조각이었다. 부등식의 양변과 하한 단위로 다시 나눴다.

## 검증

- 2차 범용 문구 grep(`판정 조건 결합|경계 후보 선택|기준량당 비율|허용 경계 판정|필요한 gate가 모두 참일 때만|목적에 맞는 경계값을 선택|분자에 둔 관심량을 분모의 기준량으로|계산한 양을 허용 경계와 비교해`) → 0건
- 1차 기계 마커 grep + `대안 gate 중|로그 비용 변환|확률이나 곱셈 규모` → 0건
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit` → 통과 (1475/1475 explicit)
- `npx eslint <27 files>` → 0 error
- `npx tsc -b --noEmit` → 27개 파일에서 난 오류 0
- KaTeX `throwOnError:true`로 27개 파일의 formula·annotatedFormula·`\underbrace{expression}` 120개 문자열 렌더 → 실패 0. 모든 operation expression이 해당 `formula`의 부분 문자열인지도 확인 → 불일치 0. annotation 한 줄 36자 초과 → 0.

## 검토 필요

- `prysm-sync-committee/Contribution.tsx` `a=\lfloor q/A\rfloor`: 글에 목표 aggregator 수 A의 값이 없어 수치 대입 없이 뜻만 적었다(spec 값 16을 넣으면 128/16=8이지만 글에 없는 사실이라 넣지 않음). `max(1,a)`의 "0으로 나눈 나머지를 피함, 그 경우 member 전원이 aggregator" 설명은 식에서 직접 따라 나오는 추론이며 글 본문에는 명시되어 있지 않다.
- `prysm-gossipsub/SnappyEncoding.tsx` `\lfloor n/6\rfloor`: "원문 6 bytes마다 1 byte씩 worst-case 추가"는 식을 그대로 읽은 것이고, 왜 6인지(Snappy literal/copy 인코딩 구조)는 글에 없어 설명하지 않았다.
- `mdbx-internals/ModernArticle.tsx`: formula는 엄격 부등호 `retiredTx(p) < min readerTx`인데 assumptions가 "정확한 equality는 source version 의미를 따름"이라고 유보한다. 주석은 formula 그대로 따랐다. libmdbx 실제 경계(`<` vs `≤`)는 원 저자 확인 대상.
- `reth-mev/Overview.tsx`: argmax 첨자 안에 underbrace를 넣으면 너무 작아져서 `\arg\max_{b\in\mathcal V(t<t_d)}` 전체와 `v(b)` 두 덩어리로만 나눴다. 유효 집합 V의 조건은 annotation에 적었다.
- `formula` prop 자체의 오류: 발견하지 못했다. interpretation 수치(10−2−3=5와 400, x=10·y=60, F=166·3 pages, WA=5, 50초, 732 bytes, 18.75 Gwei, 32 ETH 겹침, 8 blocks lag, batch 100…163/228…250 등)는 모두 다시 계산해 일치를 확인했다.
