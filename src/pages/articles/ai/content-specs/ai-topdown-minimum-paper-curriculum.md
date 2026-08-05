# AI Current-First Minimum Paper Curriculum

작성일: 2026-07-20

## 1. 제품 목표

이 블로그의 AI 경로는 오래된 논문부터 현재까지의 연표가 아니다. 학습자가 먼저 현재 논문·회사 연구·산업 구현의 질문을 보고, 그것을 해석하는 데 필요한 최소 뼈대만 아래로 내려가야 한다.

고정 구조는 다음 다섯 단계다.

1. **CURRENT TARGET**: 지금 무엇을 구현·평가해야 하는지 정하는 최신 논문·회사 연구·공식 근거 하나
2. **KEY CONCEPTS**: 현재 질문과 최소 원문을 실행 순서·상태 변화·실패 조건으로 이해하게 만드는 내부 글
3. **JUST-IN-TIME FOUNDATION**: 그 계산에서 실제로 쓰는 수학·과학만 연결
4. **PRIMARY SOURCE CHECKPOINTS**: 현재 변화를 확인할 근거와, 역사 하향을 멈출 최소 기준 논문·공식 기술 자료
5. **IMPLEMENT & VERIFY**: source claim을 code path, tensor·state trace, 평가와 release evidence로 닫는 구현 글

최신 연구가 나오면 1단계를 교체한다. 기존 최상단은 필수 경로에서 내려 숨겨진 근거 기록으로 보존한다. 2~5단계는 새 메커니즘이 기존 기반으로 설명되지 않거나 구현 검증 계약이 달라질 때만 수정한다.

## 2. 기반 델타 판정

다음 네 질문을 모두 통과한 경우에만 새 개념 또는 수학 글을 추가한다.

| 판정 | 질문 | 탈락 예시 |
|---|---|---|
| 메커니즘 | 이전과 계산·데이터·실행 계약이 다른가? | 파라미터 수와 benchmark만 증가 |
| 설명 불가능성 | 기존 개념 글만으로 핵심 claim을 설명할 수 없는가? | 같은 Transformer block의 scale-up |
| 학습 가치 | 학습자가 직접 계산·구현·진단해야 하는가? | 제품 이름과 API flag만 변경 |
| 재사용성 | 다음 연구에서도 다시 쓰일 기반인가? | 한 checkpoint 전용 prompt trick |

통과 예시는 sparse attention의 indexing·memory contract, VLA의 heterogeneous demonstration 학습, OCR의 unit-test reward, video model의 temporal latent다. 탈락 항목은 현재 최상단의 비교표와 실험 로그에만 남긴다.

## 3. 분야별 최소 뼈대

분야별 현재 source, 대표 원문, 개념·기반·구현 edge와 중단점은 `src/content/ai/topdownResearchTracks.ts`만 source of truth로 사용한다. 날짜가 박힌 문서 표를 복제하면 새 current가 승격된 뒤 서로 다른 두 지도가 생기기 때문이다.

내부 원문 재구성 글의 구현 현황과 다음 작성 순서는 `knowledge/research-pipeline/topdown-source-gap-ledger.md`에 기록한다. 작은 모델은 이 ledger에서 트랙 하나만 고르고, 해당 track object와 source packet만 입력으로 받는다.

## 4. 본문 작성 계약

각 현재·논문 글은 요약이 아니라 재구성 문서다.

1. 글을 쓰기 전에 원문 전체를 읽고 section, appendix, figure, table, equation, algorithm을 추출한다.
2. 각 major claim에 `왜 존재하는가`, `무엇을 해결하는가`, `어떻게 동작하는가`, `어떻게 구현하는가`, `무슨 가정을 하는가`, `어디서 실패하는가`를 붙인다.
3. Figure는 장식으로 복제하지 않고 입력부터 출력까지 바뀌는 data flow를 단계형 Viz로 재구성한다.
4. Equation은 직관 → 수학 → 작은 수치 예제 → 구현 shape 순서로 쓴다. 모든 KaTeX 바로 아래에 한국어 `FormulaNote`를 둔다.
5. 표와 ablation은 저자 주장을 반복하지 않고 무엇을 고정했고 무엇을 바꿨는지, 어떤 결론까지 허용하는지를 분리한다.
6. 마지막에는 최소 재현, 관측할 metric, 실패 진단과 현재 시스템으로의 handoff를 둔다.

## 5. 자체 문제 기반 깊이 검사

문제를 본문에 그대로 싣는 것이 목적이 아니다. 작성자는 먼저 해당 글만 읽은 학습자가 풀어야 할 가장 어려운 transfer 문제를 만든다. 공개 강의·교재·논문 appendix의 문제 유형도 조사한다. 이후 다음 증거를 본문에서 찾는다.

- 어떤 state와 tensor shape가 단계마다 바뀌는가?
- 핵심 식을 숫자 예제로 다시 계산할 수 있는가?
- 두 방법의 trade-off를 새로운 상황에 적용할 수 있는가?
- 성능이 나빠졌을 때 원인을 data, objective, optimization, runtime 중 어디로 좁힐 수 있는가?
- 논문 claim보다 강한 결론을 말하지 않을 수 있는가?
- 최소 구현의 module, input/output, invariant와 test를 적을 수 있는가?

하나라도 본문 근거가 없으면 해당 section을 보강한다. 정답 자체를 본문에 삽입하는 것이 아니라, 문제를 해결하는 데 필요한 개념 연결과 판단 근거를 삽입한다.

## 6. 4B·9B 모델용 재현 가능한 작성 IR

작은 모델은 전체 사이트와 긴 원문을 한 번에 처리하지 않는다. 아래 중간 산출물을 순서대로 저장한다.

```yaml
track:
  id: llm-architecture
  current_question: long context의 계산과 memory를 어떻게 줄였는가
  canonical_contract: QKV -> attention -> residual -> FFN
source_packet:
  claims: []
  figures: []
  equations: []
  tables: []
  appendix_findings: []
knowledge_ir:
  concepts: []
  dependencies: []
  assumptions: []
  failure_modes: []
  evidence_limits: []
foundation_delta:
  candidates: []
  accepted: []
  rejected_with_reason: []
article_spec:
  sections: []
  formula_notes: []
  viz_proofs: []
  transfer_problem_coverage: []
```

4B 모델은 한 번에 `source_packet`의 한 section만 추출한다. 9B 모델은 section packets를 합쳐 `knowledge_ir`과 dependency graph를 만든다. 최종 renderer는 고정 schema만 받아 문체와 UI를 생성한다. 이 분리는 원문 누락, 역사 무한 회귀, 근거 없는 새 기반 추가를 줄인다.

## 7. 자동 갱신 파이프라인

```text
공식 연구 feed / arXiv / 회사 research blog / release note
        ↓
후보 수집과 중복 제거
        ↓
현재 track 질문과 관련성 판정
        ↓
기존 최상단 대비 mechanism diff
        ↓
근거 수준 확인: paper · code · model · benchmark · production
        ↓
promotion 판정
   ├─ 탈락: watchlist
   ├─ 성능 갱신: 비교 기록만 추가
   └─ 계약 변경: current 교체 + foundation delta 심사
        ↓
article reconstruction → QA → 배포
```

자동화가 publish까지 무조건 진행하면 안 된다. 공식 원문이 없거나 benchmark 조건을 재구성할 수 없는 후보는 초안에서 멈춘다. 현재 최상단은 “가장 최신 이름”이 아니라 “현재 질문을 가장 잘 설명하며 공개 근거를 검증할 수 있는 자료”다.

## 8. UI 계약

- 현재 최상단은 먼저 “무엇을 이해하려는가”만 고정하고, 대표 원문과 동급 카드로 나란히 두지 않는다.
- 최소 개념과 최소 수학은 서로 다른 순차 단계로 보여 준다. 데스크톱에서도 좌우 동급 컬럼으로 놓지 않아 개념을 읽은 뒤 필요한 기반만 열게 한다.
- 최소 원문은 개념·기반 뒤에 배치해, 처음 보는 전문 용어만 연속해서 읽게 하지 않는다.
- 구현은 마지막에 두어 원문의 claim을 실제 code와 측정으로 검증한다.
- 최신 때문에 추가된 항목만 `새 델타`로 표시한다.
- 논문과 source article 목록은 기본 닫힘 상태로 유지한다.
- “여기서 멈춘다”를 항상 표시해 학습자가 과거로 무한히 내려가지 않게 한다.
- 내부 글은 같은 탭, 공식 원문은 새 탭으로 연다.
- 360·390·768·1440px에서 horizontal overflow, 내부 scroll, 잘린 수식과 제목이 없어야 한다.

## 9. 출처와 작성 의도 기록

현재 source of truth는 `src/content/ai/topdownResearchTracks.ts`다. 각 track은 현재 근거 URL, 발표 시점, 대표 논문, 최소 dependency, 중단 이유와 promotion rule을 가진다. 이후 자동화와 작은 모델은 이 데이터를 읽고 기존 글 전체를 재분류하지 않은 채 current pointer와 foundation delta만 갱신한다.
