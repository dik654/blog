# Practical data audit branches reconstruction

## Why this path changed

기존 `ai-practical-data-core`는 다음 네 글을 하나의 필수 직선으로 표현했다.

`EDA → Feature Engineering → Data Augmentation → Imbalanced Data`

이 순서는 학습 의존 관계가 아니다. EDA는 공통 데이터 감사의 뿌리지만 feature design,
augmentation, rare-event intervention은 감사 결과에 따라 독립적으로 여는 분기다. 기존 EDA도
row/target/time/split 계약보다 histogram, correlation, missing-rate rule에서 시작했고, 세 intervention
글은 recipe가 많지만 fit boundary, clean evidence와 release 책임이 약했다.

따라서 slug는 유지하고 다음 네 authored path로 재구성했다.

1. `ai-practical-data-audit`: 공통 data audit root.
2. `ai-practical-feature-signals`: audit → point-in-time feature.
3. `ai-practical-augmentation-contract`: audit → semantic augmentation.
4. `ai-practical-rare-event-decision`: audit → metric contract → rare-event policy.

리스트 화면은 현재 subcategory 소유 article만 각 path에 한 개씩 보여 준다. 글에 들어가면 path rail이
root와 외부 prerequisite를 포함한 1/2/2/3단계 전체 경로를 보여 준다.

## Hidden transfer problem

Content spec의 비공개 문제는 중첩 설비 window, label delay, 섭씨/화씨 혼합, `-999` sentinel,
future aggregate, event-linked missingness, 좌우 결함 label을 깨는 flip, split-before-SMOTE 오류,
0.7% prevalence, 하루 120건 capacity와 40배 missed-event cost를 한 문제에 묶었다.

새 본문은 답을 직접 나열하는 대신 다음 contract를 통해 문제를 풀 수 있게 한다.

- Row unit, cutoff, target availability and action.
- Schema, unit, sentinel, duplicate/group/time and lineage.
- Missingness observation → hypothesis → additional evidence.
- Fold-train fit state and point-in-time aggregate.
- Invariance/equivariance and target synchronization.
- Natural-prevalence validation, fold-only resampling, calibration and decision policy.

## Changed

### Content and metadata

- `eda-workflow.tsx`: Data audit root로 전면 재작성.
- `feature-engineering.tsx`: fit/transform, target encoding, point-in-time aggregate와 OOF ablation으로 재작성.
- `data-augmentation.tsx`: invariance/equivariance, structured target, Mixup/CutMix와 train/eval 경계로 재작성.
- `imbalanced-data.tsx`: metric, resampling, loss, calibration, capacity threshold와 release artifact를 분리.
- `articlesPractical.ts`: 네 글의 title, summary, level, time, prerequisites, sections와 path ownership 수정.
- `learning-paths.ts`: 하나의 거짓 직선을 root + 3 branch로 교체.
- `src/content/ai/index.ts`: sidebar 이름을 `데이터 감사 · 개입`으로 바꾸고 독립 분기를 설명.

### Formula and visual system

- `practical-data/FormulaPair.tsx`: 모든 display formula 바로 뒤에 Korean `FormulaNote`를 강제.
- `practical-data/viz/DataEvidenceLabs.tsx`: fixed SVG 없이 여섯 responsive causal lab 추가.
  - `data-data-contract-lab`
  - `data-missingness-shift-lab`
  - `data-feature-cutoff-lab`
  - `data-augmentation-contract-lab`
  - `data-rare-event-decision-lab`
  - `data-resampling-boundary-lab`
- 390px에서 0.74까지 줄었던 target encoding, precision/recall과 expected-cost 식은 중간 변수를
  도입한 aligned rows로 다시 나눴다. 최종 최소 scale은 0.85다.
- Lab control은 data shape, missing pattern, cutoff, task/transform, prevalence/capacity/cost와 resampling
  boundary를 바꾸며 설명·판정·수치가 함께 변한다.

### Regression

- `tests/practical-data-audit-branches.spec.ts`: 390/768/1440 layout, formula pairing/scale,
  four path rails, six lab state transitions와 browser error를 검사.
- `tests/ai-authored-topic-paths.spec.ts`: `ai-practical-data`가 네 authored paths만 노출하는지 검사.

## Primary-source verification

2026-07-23에 다음 공식·원문을 다시 열어 claim boundary를 확인했다.

- scikit-learn Common pitfalls: preprocessing과 feature selection은 train에서만 fit.
- scikit-learn Imputation: imputer와 missing indicator의 지원 범위.
- scikit-learn Feature selection / Permutation importance: pipeline 사용, impurity/high-cardinality 및
  correlated-feature 해석 경계.
- scikit-learn Calibration: calibrator는 classifier train data와 독립된 evidence가 필요.
- imbalanced-learn Common pitfalls: 전체 data resampling이 validation prevalence와 leakage를 망침.
- Albumentations Choosing Augmentations: 모든 transform을 invariance claim으로 보고 task target을 동기화.
- Mixup, CutMix, Focal Loss 원 논문: 수식과 적용 책임.

Prediction contract, lineage ledger, intervention stop gate와 release manifest의 결합은 보편적 표준이라고
주장하지 않고 이 경로의 engineering synthesis로 표시했다.

## Context Manager and Claude evidence

Formal audit는 첫 transport header가 `[claude-code:sonnet`으로 시작한 결과만 채택했다.

### Historical 500 reconciliation

과거 보고서의 HTTP 500 문구를 현재 미검증과 동일시하지 않았다.
`2026-07-23-claude-review-final-identity-audit.md`가 article 71/71과 11 route sequencing backfill을
이미 닫았고, 그 뒤 추가된 image retrieval, agent core와 practical competition path도 각 run record에
true-Claude header를 보존한다.

### Rejected current attempts

- Legacy import closure까지 읽히는 practical-data 4-way parallel batch: 8분 무응답, root가 종료,
  accepted 0.
- Shared Viz + test whole-file audit: 180,408ms timeout, code 143, rejected.

무응답, timeout, fallback과 model identity 없는 응답은 Claude review로 세지 않았다.

### Accepted narrow audits

| Target | Accepted header | Result |
|---|---|---|
| EDA | `[claude-code:sonnet · L1 · $0.0000 · 123002ms]` | right-censoring 인과 순서 1건 확인·수정 |
| Feature | `[claude-code:sonnet · L1 · $0.0000 · 126860ms]` | 수식·cutoff·OOF PASS |
| Augmentation | `[claude-code:sonnet · L1 · $0.0000 · 91842ms]` | regression Mixup 경계 1건 확인·수정 |
| Rare event | `[claude-code:sonnet · L1 · $0.0000 · 114957ms]` | 수식·resampling·calibration PASS |
| Path IA | `[claude-code:sonnet · L1 · $0.0000 · 79753ms]` | root + 3 branches, orphan 0 PASS |
| Viz A | `[claude-code:sonnet · L1 · $0.0000 · 136056ms]` | slider accessible name 1건 확인·수정 |
| Viz B | `[claude-code:sonnet · L1 · $0.0000 · 94672ms]` | state logic·390px source PASS |

Claude finding도 자동 수정하지 않았다. Right-censoring 정의, Mixup target interpolation과 WCAG
label-in-name 논리를 현재 source와 동작으로 확인한 뒤 세 결함만 반영했다.

## Verification

- `npx tsc --noEmit`: pass.
- Targeted ESLint: pass.
- Practical data Playwright: 11/11 pass.
- Sidebar authored path Playwright: 1/1 pass.
- 390/768/1440 article routes: horizontal document overflow 0, browser error 0.
- Formula scale at 390px:
  - EDA: 1.00
  - Feature: 0.89 / 1.00 / 0.91
  - Augmentation: 1.00
  - Rare event: 1.00 / 0.85 / 1.00
- Six locator screenshots were inspected at 390px. Fixed-coordinate SVG, tiny labels and nested decorative
  cards are absent.

## Release evidence

- `npm run build`: pass, 9,130 modules, 19.18s.
- Released entry assets:
  - `assets/index-wiryxTp0.js`
  - `assets/index-CQ6aZfzr.css`
- `systemctl --user restart cm-blog.service`: active since 2026-07-23 23:50:29 KST.
- Production HTTP 200:
  - `/lab/blog/ai?sub=ai-practical-data`
  - `/lab/blog/ai/eda-workflow`
  - `/lab/blog/ai/feature-engineering`
  - `/lab/blog/ai/data-augmentation`
  - `/lab/blog/ai/imbalanced-data`
- Production `tests/practical-data-audit-branches.spec.ts`: 11/11 pass.
- Production `ai-practical-data exposes only authored goal paths`: 1/1 pass.

이 기록은 practical data audit/intervention milestone의 release evidence다. 전체 실전 ML과 전체 블로그
재구성의 완료 선언은 아니며, 다음 감사 대상은 tabular static/temporal과 training pipeline 사이의
실제 의존 관계다.
