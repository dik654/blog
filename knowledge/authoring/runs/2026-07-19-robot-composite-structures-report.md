# Robot Composite Structures milestone report

## 이번 milestone의 결과

금속 구조·파괴역학 다음에 복합재 구조를 독립된 물리 기반 층으로 추가했다.

- 개념: `/lab/blog/ai/robot-composite-structures-joints-damage`
- 기반 source: `/lab/blog/ai/paper-tsai-strength-characteristics-composites-1965`
- 현재 guidance: `/lab/blog/ai/reference-nasa-composite-fracture-control-handbook-2024`

개념 글은 12개 section, 한국어로 원인을 주석한 display equation 24개, FormulaNote 24개, causal lab 12개로 구성했다. 두 source reconstruction은 각각 수식 6개, mechanism lab 1개, evidence state 7개를 갖는다.

## 왜 복합재가 다음 층이었나

이전 구조역학 글은 load path, stress, stiffness, fatigue, vibration, thermal state를 만들었다. 파괴역학 글은 metallic crack의 driving force, growth, residual strength, NDE와 inspection decision을 연결했다.

하지만 다음의 상태는 비어 있었다.

`fibre/matrix/interface -> material axes -> transformed ply -> ordered laminate -> joint/detail -> interlaminar damage -> impact/NDE -> building-block release`

금속의 nominal stress나 K 이야기를 그대로 연장하면 carbon/epoxy를 가벼운 등방성 금속처럼 오해하게 된다. 따라서 anisotropy, ABD coupling, ply-face recovery, bolted/bonded load introduction, delamination, BVID와 evidence transfer를 별도 article spine으로 만들었다.

## 본문 구조를 어떻게 추론했나

목차부터 만들지 않았다. 먼저 bonded-and-bolted titanium insert, cutout, ply drop, wet marine environment, emergency-stop load, impact, blocked ultrasound access와 prototype delamination을 가진 780 mm robot shoulder link를 private hardest problem으로 설정했다.

이 문제에서 실제로 닫아야 할 판단을 52개 premise로 분해했다. 그 결과 서사는 다음 순서가 아니면 독자가 상위 판단을 검증할 수 없다는 결론이 나왔다.

1. Fibre, matrix, interface가 왜 방향성을 만드는지 구분한다.
2. Global load를 한 ply의 material axes로 변환한다.
3. Ply를 실제 두께 순서로 적분해 A, B, D를 만든다.
4. Mid-plane 결과를 ply top/bottom state로 복원한다.
5. Cure-to-service 온도와 수분을 초기 상태에 넣는다.
6. Failure index, failure mode, first-ply failure와 component ultimate를 분리한다.
7. Uniform laminate에서 벗어나 hole, insert, bolted/bonded joint를 다룬다.
8. CLT가 보지 못하는 interlaminar damage를 VCCT/CZM와 test boundary로 넘긴다.
9. Dent appearance와 hidden delamination/CAI를 분리한다.
10. Manufacturing, NDE access, building-block evidence와 configuration identity로 release를 닫는다.

독자에게 문제를 그대로 보여 주는 대신, 이 글만 읽고 unseen composite link의 잘못된 release 논리를 반박할 수 있는지를 premise coverage gate로 사용했다.

## Source를 선택한 이유

### Tsai, NASA CR-224, 1965

105쪽 전체를 대상으로 off-axis strength, material/structure 구분, A/B/D thermoelastic laminate interaction, cross-ply/angle-ply experiment와 결론의 네 가지 제한을 재구성했다.

내구성이 있는 핵심은 높은 fibre-direction strength 하나로 구조를 설명할 수 없다는 점이다. 원문은 measured X 약 150 ksi와 netting-only 이론값 약 266 ksi의 차이를 보여 주며 transverse Y와 shear S를 구조 변수로 남긴다.

동시에 early glass/epoxy, plane-stress, quasi-homogeneous model을 현대의 보편적인 damage law나 allowable처럼 서술하지 않았다. 원문이 밝힌 tension/compression 동일화, linear elasticity, unloading/reloading, angle-ply degradation의 한계를 article에 유지했다.

### NASA-HDBK-5010, 2023/2024

Volume 1 380쪽과 Volume 2 527쪽에서 BBA, DTA/IDMP/RTD, NDE, proof boundary, impact, delamination, VCCT/CZM와 joint example을 추적했다.

핵심은 analysis 단독으로 composite release를 닫기 어렵고 시험과 반복적인 building-block correlation이 필요하다는 것이다. 다음 숫자는 일반식처럼 옮기지 않았다.

- 특정 0.5 inch debond 가정
- 한 COPV 예시의 5% 미만 추가 strength loss
- joint example의 0.25/0.45/0.9 inch flaw

작은 edge flaw가 더 큰 central flaw보다 심할 수 있다는 example도 보존했다. 크기만 보고 damage severity를 정하지 못하며 geometry와 load path가 같이 필요하기 때문이다.

### Tsai-Wu 접근성 결정

1971 Tsai-Wu 논문의 metadata와 abstract는 확인했지만 완전한 primary full text를 공개 경로에서 확보하지 못했다. Secondary summary로 저자의 수식·실험·한계를 복원하는 척하지 않고, standalone source article은 완전 접근 가능한 NASA CR-224로 구성했다. Tsai-Wu는 scalar interaction surface의 lineage와 한계만 개념 글에 제한적으로 사용했다.

## 수식 설계

모든 display equation 바로 아래에 FormulaNote를 배치했다. KaTeX 내부 `text`는 모두 한국어이며 단순한 symbol label이 아니라 왜 그 operation이 필요한지를 설명한다.

예를 들어 transform은 global quantity를 material failure data가 정의된 축으로 옮기는 이유를, z 적분은 ply의 위치가 A/B/D contribution을 바꾸는 이유를, free strain subtraction은 applied load가 0이어도 residual state가 남는 이유를 표시한다.

초기 mobile QA에서 긴 식 세 개가 기준 아래로 축소됐다. 내용을 지우지 않고 서로 다른 causal role을 aligned line으로 분리했다. 공개 host 최종 minimum scale은 다음과 같다.

- Concept: 0.85 at 360 px, 0.92 at 390 px
- Tsai: 0.99 at 360 px, 1.00 at 390 px
- NASA: 0.86 at 360 px, 0.97 at 390 px

세 page 모두 768/1440 px에서는 1.00이고 document overflow는 모든 viewport에서 0이다.

## Viz를 어떻게 개선했나

각 Viz는 하나의 물리적 state transition을 소유한다. Ply angle은 material-axis load share를 바꾸고, stack condition은 B coupling을 바꾸며, cure delta temperature는 residual curvature를 바꾼다. Damage degradation은 load redistribution을, joint geometry는 competing path를, impact variables는 dent와 hidden area/CAI를 서로 다르게 바꾼다.

색은 역할을 제한했다.

- Blue: applied/selected state
- Teal: resistance/evidence
- Amber: coupling, model boundary, feedback
- Red: damage or exceeded state

자동 QA를 통과한 뒤 screenshot review가 세 가지 추가 문제를 찾았다.

1. CSS token이 완전한 `oklch(...)`인데 SVG가 다시 `hsl(var(...))`로 감싸 일부 surface가 검정으로 렌더링됐다.
2. 620-unit desktop SVG를 phone에 축소하면서 9-16 unit label이 실제 5-8 px가 됐다.
3. Building-block overview가 좁은 네 block/여덟 circle이라 source의 iterative evidence loop보다 작은 checklist처럼 보였다.

색 token은 `var(--token)`을 직접 쓰도록 고쳤다. 일반 SVG label은 18-22 unit로 올렸다. 밀집 overview는 모바일 340-unit와 desktop 620-unit를 분리했다. Concept는 2x2 numbered evidence loop, NASA는 desktop 4x2/mobile 2x4 loop로 다시 그렸고, 시험 불일치가 하위 모델과 threat assumptions를 갱신하는 amber feedback path를 넣었다.

이 과정은 DOM overflow test만으로 visual quality를 판정할 수 없다는 근거이기도 하다.

## 실패가 바꾼 구현

- English KaTeX underbrace가 남아 Korean annotation QA가 실패했다. 모든 이유 label을 한국어로 교체했다.
- 긴 수식의 mobile scale이 0.67-0.84까지 내려갔다. 의미 단위로 식을 분리했다.
- Caption title이 fullscreen control과 가까웠다. 오른쪽 control reserve padding과 title wrapping을 추가했다.
- Invalid `hsl(var(--oklch-token))`은 console error가 없어도 검정으로 보였다. Screenshot inspection으로 발견해 직접 token 참조로 바꿨다.
- Mobile SVG text는 box 안에 있어도 읽을 수 없었다. Overflow-free와 readable을 별도 품질 조건으로 두고 mobile coordinate system을 만들었다.
- Building-block은 one-way pyramid가 아니라 model-test feedback loop여야 했다. Node role과 reverse feedback을 시각 구조에 넣었다.

이 실패 기록은 작은 모델에게 최종 예시만 주는 것보다 중요하다. 어떤 critic signal이 재작성을 유발했는지를 함께 줘야 같은 shortcut을 반복하지 않는다.

## 검증

- `npm run build`: passed. 기존 large-chunk warning만 남음.
- Composite QA local: 17/17 passed.
- Structural + fracture regression local: 34/34 passed.
- Combined local: 51/51 passed.
- Composite QA public host: 17/17 passed.
- Public routes: 세 경로 모두 HTTP 200.
- TypeScript: 새 composite scope 진단 0건. Repository 전체에는 무관한 기존 진단 19건이 남음.
- Formula/FormulaNote: concept 24/24, Tsai 6/6, NASA 6/6.
- No raw LaTeX, non-Korean KaTeX annotations, material overflow, inner Viz scroll or browser console errors at 360/390/768/1440 px.

## 4B와 9B로 재생하는 방법

4B worker에는 한 번에 다음만 준다.

`one premise + one primary page slice + one equation + Korean why annotations + one counterexample + one interactive state + one acceptance selector`

4B는 source 간 충돌, curriculum 순서, 전체 article terminology를 결정하지 않는다. Unsupported transfer, raw LaTeX, no-op interaction과 clipping을 critic prompt로 별도 검사한다.

9B worker는 causal section 하나 또는 source evidence state 하나를 맡는다. Packet에는 prerequisite bridge, coordinate/sign convention, derivation order, author intent, claim/evidence/limit split, failure diagnostics, desktop/mobile Viz contract와 QA expectation을 함께 넣는다.

Orchestrator만 private hardest problem, source 접근성 판단, source 간 non-transfer, section 간 state identity, screenshot criticism, public deployment와 cross-article regression을 소유한다.

권장 실행 순서는 다음과 같다.

`source extraction -> claim/evidence/limit -> premise coverage -> formula/note -> prose -> causal Viz -> critic/QA -> orchestrator reconciliation`

상세 machine-readable record는 `knowledge/authoring/runs/2026-07-19-robot-composite-structures.json`에 남겼다.

## 다음 작업

다음 article을 바로 정하지 않고 robotics inventory와 prerequisite graph를 다시 감사한다. 현재 선두 후보는 contact mechanics, tribology, lubrication, wear and seals다. 기존 actuator/motor/structure/fracture/composite 층에는 friction regime, surface stress, heat, lubricant film, wear, backlash growth, bearing/gear life와 contamination ingress를 묶는 기반이 아직 없다.

다만 이 후보도 완전 접근 가능한 primary source spine과 현재 article coverage를 확인한 뒤 확정한다.
