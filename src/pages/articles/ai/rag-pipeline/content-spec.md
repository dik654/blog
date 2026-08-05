# RAG Pipeline Deepening Spec

## Learning Contract

이 글은 `Knowledge Compiler`의 추상 구조를 실제 검색-생성 경로로 내린다. 독자는 문서를 벡터 DB에 넣는 방법만 배우는 것이 아니라, 질문 하나가 어떤 검색 결과와 중간 생성물을 거쳐 최종 claim이 되었는지 역추적할 수 있어야 한다.

## Scope Matrix

| 범위 | 깊이 | 독자가 확인할 계약 | 근거 |
|---|---|---|---|
| Parametric / non-parametric memory | 깊게 | RAG가 모델 가중치를 갱신하지 않고 외부 memory를 결합하는 이유 | Lewis et al. (2020) |
| Ingestion · chunk · embedding | 깊게 | source address를 잃지 않고 검색 단위를 만드는 과정 | 기존 본문 + Knowledge Compiler |
| Dense · sparse · hybrid · rerank | 깊게 | recall 후보와 precision 재정렬을 분리하는 이유 | 기존 본문 |
| Generation | 깊게 | context를 넣는 것과 claim이 근거로 지지되는 것은 다름 | 기존 본문 |
| Claim provenance | 깊게 추가 | claim → generation node → retrieved chunk → source span의 DAG | VeriTrail (2025) |
| Retrieval / generation evaluation | 깊게 보강 | 검색 실패와 생성 실패를 분리하는 측정 | RAGAS (2023) |
| GraphRAG | 간단히 | 전역 질문과 여러 문서 관계가 필요할 때 여는 확장 | Edge et al. (2024) |
| Corrective RAG | 간단히 | 검색 품질이 낮을 때 무조건 생성하지 않는 fallback | Yan et al. (2024) |
| 특정 vector DB 설치법 | 보류 | 제품 선택은 핵심 계약이 아님 | - |

## Added Section: Claim에서 원문까지 근거 추적

- 개념 목표: citation 문자열과 provenance graph의 차이를 이해한다.
- 핵심 객체: `source_span`, `chunk_id`, `retrieval_run`, `generation_node`, `claim_id`, `support_edge`.
- 실행 흐름: 질문 → 후보 검색 → rerank → context snapshot → 생성 → claim 분해 → evidence 판정 → 답 렌더링.
- 설계 이유: 최종 답과 원문만 비교하면 어느 중간 요약 단계에서 오류가 생겼는지 알 수 없다.
- 실패 모드: 존재하지 않는 인용, 한 문장이 여러 claim을 섞음, 부분 지지만으로 전체 claim을 supported 처리, source version drift.
- 본문 우선 구현: 같은 답이 citation 문자열에서 stable-id provenance record로 발전하는 3단계를 실제 필드와 판정 순서로 설명한다.
- 후속 Viz 전수 개편: 콘텐츠 경로가 닫힌 뒤 3 scene 인터랙션으로 전환한다.
  1. citation만 붙은 답은 출처 문자열은 있지만 derivation이 없다.
  2. 각 생성 node와 source span에 stable id를 붙여 DAG를 만든다.
  3. claim별 `supported / inconclusive / unsupported` 상태와 오류 위치를 표시한다.

## Evaluation Upgrade

- Retrieval: Recall@K, MRR 또는 nDCG처럼 후보와 순위를 측정한다.
- Generation: answer relevance와 형식 준수를 측정한다.
- Grounding: claim support rate, citation precision, citation recall을 분리한다.
- Operations: latency, token, index freshness, abstention rate를 함께 본다.
- Golden set은 질문-정답 한 줄이 아니라 관련 source span과 허용 가능한 claim 집합을 가진다.

## Sources

- Lewis et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, 2020.
- Es et al., RAGAS: Automated Evaluation of Retrieval Augmented Generation, 2023.
- Edge et al., From Local to Global: A Graph RAG Approach to Query-Focused Summarization, 2024.
- Yan et al., Corrective Retrieval Augmented Generation, 2024.
- Microsoft Research, VeriTrail: Closed-Domain Hallucination Detection with Traceability, 2025.

## Acceptance Check

- 독자가 검색 성공, 생성 성공, 근거 성공을 서로 다른 상태로 설명할 수 있다.
- 모든 최종 claim을 source span까지 역추적하는 최소 schema를 설계할 수 있다.
- citation이 존재하는 것만으로 faithful answer가 되지 않는 이유를 반례로 설명할 수 있다.
- 현재 provenance 설명은 390px에서 문구가 잘리지 않고 내부 스크롤 없이 보인다. 후속 Viz 전환 뒤 같은 조건을 다시 검증한다.
