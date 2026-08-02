# Knowledge System 네 계약 content spec

## 1. 현재 목표

2026년 7월의 출발 질문은 “문서를 몇 토큰으로 자를까?”가 아니다. 원문 내부의 의존성이 강한데도 분해할지, 원문 구조와 수정 이력을 잃지 않고 검색 가능한 단위로 만들지, 제한된 context budget에 어떤 근거 묶음을 넣을지 먼저 결정해야 한다.

필수 학습 경로는 다음 다섯 단계다.

1. Knowledge Compiler contract hub
2. Source ingestion and structure recovery
3. Knowledge IR and evidence lineage
4. Retrieval and context packing
5. Research Watcher

논리적인 운영 pipeline에서는 Research Watcher가 source candidate를 먼저 발견한다. 그러나 학습 순서는 한 번의 source를 정확히 처리하는 법을 먼저 이해한 뒤, 다수 source의 지속 갱신으로 올라간다. Article order와 runtime order가 다르다는 사실을 hub에 명시한다.

## 2. 비공개 전이 문제

86쪽짜리 한·영 혼합 안전 매뉴얼이 있다. 두 단 PDF, 41-42쪽을 가로지르는 표, 수식과 적용 조건, 본문에서 참조하는 figure-caption, appendix가 있다. 같은 장비를 설명하는 48분 강의 영상과 Git repository가 연결되어 있고, 질문에 맞는 답은 특정 표 행, 수식의 qualifier, release tag가 가리키는 commit을 함께 확인해야 한다. 일주일 뒤 manual revision 1.3이 한 수치와 표 행을 정정했다.

완성된 글들만으로 다음을 판정할 수 있어야 한다.

- source identity, version, content hash, language, access policy와 raw artifact 보존
- digital text, scanned page, HTML, video, repository의 parser routing 차이
- two-column reading order, cross-page table, figure-caption anchor, formula와 qualifier 복구
- page+bbox+charspan, timestamp+frame, commit+file+line+symbol 주소 체계
- normalized document와 semantic Knowledge IR의 차이
- DocumentVersion, Block, Artifact, Claim, Evidence, Scope, Transformation, Concept schema
- source literal과 multilingual concept label의 분리
- build-time evidence lineage와 query-time runtime trace의 분리
- revision 발견, 새 version 생성, superseded claim의 impact closure
- full-context, structure-preserving retrieval과 decomposition retrieval의 선택
- naive, contextual, late chunking의 계산 순서 차이
- sparse, dense, late interaction, hybrid fusion과 reranking의 역할 차이
- query decomposition, evidence coverage와 token-budget context packing
- table row, formula qualifier, code version이 같은 context package 안에서 서로 연결되는 법
- retrieval, ranking, packing, generation, grounding, freshness, latency failure의 분리

문제는 본문에 그대로 노출하지 않고 section coverage와 capability check로만 사용한다.

## 3. 글별 ownership

### Hub. `knowledge-compiler`

**독립 판단:** 입력 형식이나 제품 이름이 아니라 source, structure, meaning, retrieval, maintenance의 어느 계약이 깨졌는지 찾아 다음 글을 고른다.

소유 범위:

- 현재 CoDaR가 드러낸 decomposition boundary
- 다섯 단계 learning route와 runtime order의 차이
- symptom-based entry
- minimum canonical cutoff와 stop rule

소유하지 않음:

- parser와 bbox 구현
- IR schema 세부
- retrieval score와 packing objective
- watcher promotion gate

### A. `knowledge-source-ingestion`

**독립 판단:** 원본을 검색하기 전에 어떤 구조와 source address를 손실 없이 복구해야 하는지 판정한다.

소유 범위:

- source envelope, immutable raw blob과 access policy
- parser routing: native parser, OCR/layout/table specialist, VLM fallback
- reading order, hierarchy, furniture, table grid, formula, caption, code와 video alignment
- cross-page table stitching과 cross-reference anchor resolution
- page/bbox/charspan, time/frame, commit/file/line/symbol address
- extraction coverage, structural linkage와 regression fixtures

소유하지 않음:

- claim semantics와 evidence verdict
- vector retrieval와 prompt packing
- source promotion

Viz가 제거할 오해:

1. “PDF text extraction이 성공하면 ingestion이 끝났다.”
2. “VLM 하나로 모든 형식을 읽는 것이 가장 정확하다.”
3. “표와 수식은 Markdown 문자열만 남기면 된다.”

### B. `knowledge-ir-evidence-lineage`

**독립 판단:** 정규 document에서 검증 가능한 의미 객체를 만들고 수정이 발생했을 때 어떤 claim만 다시 계산할지 판정한다.

소유 범위:

- DocumentVersion, Block, Artifact, Concept, Claim, Scope, Evidence, Transformation
- stable logical id와 immutable version id
- formula qualifier와 claim scope
- artifact alignment: manual span, video timestamp, code commit
- build-time provenance DAG, support verdict와 transformation trace
- multilingual label과 source literal 분리
- revision delta와 downstream claim impact closure
- confidence, validation state와 truth의 구분

소유하지 않음:

- layout model 선택
- query-time retrieval trace
- curriculum promotion

Viz가 제거할 오해:

1. “긴 Markdown이 Knowledge IR이다.”
2. “citation URL 하나면 provenance가 있다.”
3. “수정 PDF를 다시 파싱하면 이전 claim이 자동으로 사라진다.”

### C. `rag-pipeline`

**독립 판단:** 질문마다 corpus를 어떻게 열고, 어떤 후보를 찾고, 제한된 context에 검증 가능한 evidence package를 어떻게 조립할지 판정한다.

소유 범위:

- full context, structure-preserving unit, decomposition routing
- naive/contextual/late chunking
- sparse BM25, dense cosine, ColBERT-style late interaction
- rank fusion, rerank와 query decomposition
- evidence coverage, adjacency, deduplication, trust boundary와 token budget packing
- runtime claim trace와 abstention
- layerwise quality, freshness, latency와 cost evaluation
- per-query top-k와 synthesis configuration

소유하지 않음:

- raw document structure recovery
- semantic source-version graph 생성
- source discovery와 curriculum promotion

Viz가 제거할 오해:

1. “모든 문서는 고정 512 token으로 자르면 된다.”
2. “Top-k score 순으로 붙이면 가장 좋은 context다.”
3. “검색 근거가 prompt에 있으면 최종 claim은 자동으로 supported다.”

### D. `knowledge-research-watcher`

기존 ownership을 유지한다. Source event discovery, Work/Version identity, current-source replacement, foundation delta와 correction queue를 다룬다. IR의 claim impact closure를 호출할 수 있지만 block/claim graph 자체를 재설명하지 않는다.

## 4. 수식 계약

모든 display 수식은 `underbrace`로 항 역할을 한글로 적고 바로 아래 `FormulaNote`에서 계산 의도와 기호를 다시 설명한다.

- Ingestion: required-structure coverage, source address tuple, structure-link error
- IR: claim-evidence relation, support coverage, impact closure
- RAG: document dependency score, dense cosine, BM25 intuition, ColBERT MaxSim, RRF, context packing objective, layerwise release gate

모바일에서 한 줄 수식이 0.80 아래로 축소되면 의미 단위로 여러 줄에 나눈다. 긴 영어 첨자는 기호를 짧게 바꾸고 FormulaNote에서 풀어 쓴다.

## 5. source anchors

| Source | 글 | claim boundary |
|---|---|---|
| Guo et al., Lost in Decomposition / CoDaR, ACL Findings 2026 | Hub·RAG | Strong context dependency에서 decomposition method가 악화될 수 있고 dependency-aware routing이 필요하다는 현재 근거. 모든 heterogeneous query가 반드시 decomposition을 요구한다고 확대하지 않는다. |
| IBM Research, Docling, AAAI 2025 | Ingestion | Specialized parser/model pipeline, unified DoclingDocument, reading order, table structure와 provenance를 설명하는 구현 근거. 모든 문서 형식에서 무오류를 보장하지 않는다. |
| W3C PROV-O | IR | Entity, Activity, Agent와 derivation/revision/invalidation 관계의 표준 vocabulary. 전체 OWL stack을 구현해야 한다는 뜻은 아니다. |
| Lewis et al., RAG, 2020 | RAG | Parametric memory와 retrieved non-parametric memory를 generation에서 결합하는 최소 canonical contract. 현대 packing과 provenance를 모두 해결하지 않는다. |
| Günther et al., Late Chunking, 2024 | RAG | 전체 문맥으로 token을 encode한 뒤 span pooling하는 순서. 긴 문서의 구조 복구나 generation faithfulness를 보장하지 않는다. |
| Anthropic, Contextual Retrieval, 2024 | RAG | Chunk-specific context를 embedding과 BM25 index 전에 붙이는 회사 실험. 특정 dataset 결과를 보편적 top-k 규칙으로 승격하지 않는다. |
| Santhanam et al., ColBERTv2, 2022 | RAG | Query-token별 MaxSim late interaction과 compression의 canonical mechanism. 모든 corpus에서 single-vector dense보다 낫다고 단정하지 않는다. |
| Ray et al., METIS, SOSP 2025 | RAG | Per-query num_chunks, synthesis method, intermediate length와 scheduling의 quality-delay trade-off. Source truth나 grounding을 보장하지 않는다. |
| Liu et al., Lost in the Middle, TACL 2024 | RAG | Relevant evidence position이 long-context use를 바꿀 수 있다는 evaluation boundary. 문맥 중간을 무조건 비우라는 배치 규칙이 아니다. |
| Microsoft Research, VeriTrail, 2025 / ICLR 2026 | IR·RAG | Multi-stage generative DAG의 claim provenance와 error localization. 상용 availability나 자동 truth 판정으로 확대하지 않는다. |

## 6. migration

- `knowledge-compiler` slug는 유지하고, 기존 normalized document·IR·reliability 상세는 새 두 글로 흡수한다.
- `rag-pipeline` slug는 유지하고 기존 7개 section component는 더 이상 진입 본문에서 사용하지 않는다. Product list와 고정 chunk 팁을 제거하고 현재 decision article로 교체한다.
- `knowledge-research-watcher`는 유지하며 source-level promotion과 IR claim impact를 cross-link한다.
- 기존 URL과 search link는 깨지지 않는다. 삭제 가능한 unused section 파일은 P3 cleanup 전까지 남긴다.

## 7. completion criteria

- 다섯 글이 서로 다른 reader decision을 가진다.
- Learning route는 hub → ingestion → IR → RAG → Watcher로 보이고 runtime order 차이를 설명한다.
- Current source는 ACL 2026 CoDaR이며 canonical cutoff는 RAG 2020에서 멈춘다.
- Cross-page table, formula qualifier, video timestamp, code commit, corrected revision의 ownership이 모두 명시된다.
- Build-time evidence lineage와 runtime trace를 섞지 않는다.
- 각 Viz는 interaction으로 오해 하나를 반증한다.
- 360·390·768·1440px에서 document, figure, formula overflow가 0이다.
- 비공개 전이 문제를 다섯 글만으로 풀 수 있다.

## 8. Claude collaboration

Bounded Claude Sonnet audit는 USD 0.280413에서 완료됐다.

채택:

- cross-page table stitching을 독립 ingestion capability로 명시
- figure anchor resolution은 ingestion, claim-evidence pointer는 IR로 분리
- formula qualifier를 IR의 Scope relation으로 승격
- manual revision과 code commit의 artifact alignment 추가
- build-time provenance와 query-time runtime trace 분리
- 학습 순서와 실제 pipeline order 차이 명시
- IR claim impact closure와 Watcher source promotion 용어 분리

수정 또는 기각:

- “이질적인 artifact를 함께 묻는 질문은 반드시 decomposition해야 한다”는 제안은 CoDaR 원문이 보장하지 않는다. Dependency와 task를 측정해 full-context 또는 decomposition을 선택하도록 쓴다.
- METIS의 역할이 prompt 안에 충분히 설명되지 않았다는 지적은 원문을 직접 확인해 보완했다. METIS는 source truth가 아니라 per-query `num_chunks`, synthesis, intermediate length와 scheduling의 quality-delay trade-off 근거로만 사용한다.
- Revision 발견은 Watcher/source intake가 소유하고, immutable version 생성은 Ingestion, downstream claim impact closure는 IR이 소유하도록 세 단계 handoff로 더 세분했다.
