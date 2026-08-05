# 2D Animation production reconstruction report

## Observed

기존 2D Animation 분기는 다섯 글이 각각 3~5KB 정도로 짧았고, 첫 단계가 특정 LTX project 글이었다. Dataset, caption, LoRA, VFI, evaluation이라는 이름은 있었지만 어떤 실패를 누가 소유하는지, 왜 다음 단계로 넘어가는지, 최종 release를 무엇으로 막는지가 연결되지 않았다. `3~5초`, 고정 rank 같은 예시값은 보편 기본값처럼 읽힐 수 있었고, LoRA와 IC-LoRA, display FPS와 authored drawing cadence도 경계가 흐렸다.

## Inferred

이 분야의 최소 바닥은 특정 video model이 아니라 shot의 성공 계약이다. 독자는 model을 먼저 고르는 대신 acceptance condition을 고정하고, base failure를 재현한 뒤, dataset·condition·adaptation·temporal finishing 중 가장 이른 실패 소유자만 바꿔야 한다. 학습 순서는 공통 어휘를 만드는 순서일 뿐 실제 제작의 강제 waterfall은 아니다.

## Decided

1. 모델 독립 허브 `animation-production-workflow`를 새 출발점으로 둔다.
2. 경로는 `Production Contract → Dataset Unit → Condition Signal → Adaptation·Control → Temporal Finishing → Evaluation·Release`의 여섯 독립 판단 글로 제한한다.
3. LTX project는 LTX 분기의 구현 사례로 유지하고 2D Animation의 보편 첫 단계에서 제외한다.
4. 모든 display 수식은 한국어 underbrace와 인접 `FormulaNote`를 함께 가진다.
5. Viz는 장식용 직선 flowchart가 아니라 계약, clip schema, caption boundary, intervention ladder, cadence ownership, release gate의 서로 다른 오해를 제거한다.
6. 실제 제작은 failure owner에 따라 단계를 건너뛰거나 되돌아갈 수 있음을 허브와 각 handoff에서 명시한다.

## Hidden transfer problem

24GB GPU 두 장으로 8초 shot을 만들고, delivery는 24fps지만 주요 pose는 on twos이며 impact smear 두 frame과 빠른 pan이 있다. Source/group leakage, VLM·ASR label 오류, LoRA identity collapse, VFI의 timing 파괴가 동시에 가능하다. 새 본문만 읽고 다음을 결정할 수 있어야 한다.

- shot contract와 hard release gate를 결과를 보기 전에 고정한다.
- frame split이 아니라 source/group-disjoint split을 선택한다.
- observable fact, directorial intent, audio evidence와 review state를 분리한다.
- prompt/reference/preprocess로 닫히지 않는 failure만 LoRA·IC-LoRA·full tuning에 보낸다.
- drawing cadence를 먼저 고정하고 VFI·blur·encode를 별도 비교한다.
- 같은 case·seed pair, open set, earliest failure stage로 release 여부를 결정한다.

## Sources and boundaries

- [LoRA](https://arxiv.org/abs/2106.09685)는 frozen weight와 low-rank update의 수학적 경계에만 사용했다. Rank·alpha 예시를 보편 최적값으로 승격하지 않았다.
- [LTX-2 dataset preparation](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-trainer/docs/dataset-preparation.md)과 [trainer](https://github.com/Lightricks/LTX-2/tree/main/packages/ltx-trainer)는 scene split, structured caption, resolution bucket, reference path, decode verification과 공개 trainer contract에만 사용했다.
- [LTX IC-LoRA adapters](https://docs.ltx.video/open-source-model/integration-tools/ic-lo-ra-adapters)는 reference-conditioned adapter의 구현 경계로만 사용했다. 일반 LoRA의 동의어로 쓰지 않았다.
- [AnimeInterp](https://arxiv.org/abs/2104.02495), [RIFE](https://arxiv.org/abs/2011.06294)와 [RIFE official repository](https://github.com/hzwer/ECCV2022-RIFE)는 animation interpolation과 intermediate-flow execution 근거로 사용했다. VFI가 authored timing을 보존한다고 일반화하지 않았다.
- [AniMatrix](https://arxiv.org/abs/2605.03652)는 animation condition taxonomy와 평가 축의 최신 연구 근거다. Resource는 preparing release 상태이므로 재현 가능하다고 주장하지 않았다.
- [AnimationBench](https://arxiv.org/abs/2604.15299)는 Twelve Principles·IP preservation을 포함한 animation-specific evaluation 범위를 확인하는 데만 사용했다.

## Claude collaboration

사용자 지시대로 context-manager의 `/api/chat`에 `model=claude-sonnet-4-6`, `fresh=true`인 bounded read-only 반례 감사를 요청했다. 요청은 context-manager 인증과 routing까지 도달했으나 Claude provider가 HTTP 500 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았고 Claude review가 반영되었다고 기록하지 않는다.

## Changed

- 신규 허브 1글과 기존 다섯 글을 각각 약 11~14KB의 독립 판단 글로 재작성했다.
- 여섯 종류의 responsive HTML/CSS Viz를 공통 파일에 구현하고 허브에는 intervention ladder를 하나 더 배치했다.
- Category metadata, sidebar leaf, authored learning path, top-down implementation link와 테스트 기대값을 함께 갱신했다.
- 긴 품질 vector와 conditional loss를 의미 단위로 나눠 모바일 수식 scale을 0.92 이상으로 올렸다.

## Verified

- 전용 Playwright: 9/9 통과.
- authored path·top-down 포함 관련 회귀: 56/56 통과.
- 9 routes × 390·768·1440px 표본: document overflow 0, console/page error 0.
- 여섯 모바일 글의 최소 display formula scale: 0.92.
- Production build: 9,390 modules, 성공.
- Public deployment: category와 여섯 article 모두 HTTP 200, 공개 도메인 전용 Playwright 9/9 통과.
- `audit:learning-flow`: 589개 등록 글 전체를 다시 감사했다. 이번 animation path에는 미할당 글이 없지만, 전체 corpus에는 29 release blockers와 529 enrichment backlog가 남아 있어 다음 배치에서 계속 처리한다.

## 4B · 9B handoff

4B worker는 글 하나만 받고 `reader_decision`, `entry_failure`, `artifact`, `invariant`, `measurement`, `source_claim`, `source_boundary`, `next_handoff`를 JSON으로 낸다. 수식은 `equation`, `korean_underbrace`, `symbol_note`를 분리하고 Viz는 제거할 오해 하나만 적는다.

9B reviewer는 여섯 packet과 hidden transfer problem을 받아 `failure_owner`, `stage_can_skip`, `stage_must_repeat`, `hard_gate`, `promotion_risk`를 검사한다. LoRA와 IC-LoRA, FPS와 cadence, soft score와 hard gate를 서로 바꿔 쓴 packet은 반려한다. Orchestrator만 metadata, responsive browser QA, source freshness와 deployment를 닫는다.
