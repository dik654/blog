# Knowledge Systems 학습 축 재구성 보고서

## 1. 문제와 판단

기존 `Knowledge Compiler`는 PDF·영상·웹·GitHub 수집, normalized document, Knowledge IR, 다국어 출력과 신뢰성을 한 글에서 다뤘다. `RAG Pipeline`은 fixed-size chunk와 vector DB 중심 설명이 많았다. 둘 다 입문 지도는 되었지만 다음 실패의 소유자가 보이지 않았다.

1. PDF 표가 다음 페이지에서 이어질 때 누가 같은 표로 복구하는가?
2. 수식은 찾았지만 `T ≤ 80°C` 조건이 빠졌을 때 어느 단계가 실패했는가?
3. 원문 rev 1.3이 수치를 정정하면 어느 claim·index·article만 다시 만드는가?
4. 검색 점수는 높지만 필수 근거 하나가 token budget 밖이면 답해야 하는가?

따라서 기존 두 글을 늘리는 대신 Source, Structure, Meaning, Retrieval, Maintenance의 다섯 계약으로 경계를 정하고 독립적인 판단 단위로 분리했다.

## 2. 원문에서 고정한 사실

### CoDaR · ACL Findings 2026

- 문서 분해는 항상 유리하지 않으며 referential, logical, information dependency가 강한 문서에서는 full context가 더 나을 수 있다.
- DCDS와 routing threshold는 해당 논문의 실험 장치이지 모든 문서에 적용할 보편 상수가 아니다.
- 그래서 문서 길이만으로 chunking하지 않고 document type과 golden query에서 dependency-aware route를 평가한다.

### Docling · AAAI 2025

- parser backend와 layout·table 같은 specialist model을 조합하고, reading order와 bounding box provenance를 가진 통합 `DoclingDocument`를 만든다.
- JSON은 구조를 보존하는 표현이고 Markdown·HTML은 손실 가능한 렌더링이다. 본문도 normalized text를 IR로 오해하지 않도록 분리했다.

### Retrieval과 serving 근거

- Late Chunking은 전체 token sequence를 먼저 encode한 뒤 기존 chunk span을 pooling한다. 경계가 없어지는 기술이 아니다.
- ColBERT 계열은 query token마다 document token의 최고 대응 MaxSim을 구해 더한다.
- Lost in the Middle은 위치 민감성을 보인 평가 근거이지 “중요한 문장을 양 끝에 두라”는 고정 recipe가 아니다.
- METIS는 query마다 chunk 수, synthesis 방식, intermediate length와 scheduling을 조절한다. Source truth나 claim support를 보장하지 않는다.
- RAG 2020을 retrieved non-parametric memory와 generation을 묶는 최소 역사 절단점으로 삼았다.

## 3. 비공개 전이 문제

본문 작성 전에 다음 문제를 정했다.

> 86페이지의 한·영 안전 매뉴얼은 2단 편집이고, 표 하나가 두 페이지에 걸치며, torque 식의 적용 온도는 다음 문단에 있다. Figure 참조, 교육 영상, Git repository와 이후 정정본도 있다. “TS-999 controller는 80°C에서 어떤 torque limit을 어느 release부터 구현했는가?”에 답하고, 원문 정정 시 필요한 결과만 갱신하라.

완성된 글만 읽고 다음에 도달해야 했다.

- Work, DocumentVersion, Block, Artifact, source locator를 분리한다.
- 표 continuation, formula qualifier, figure caption을 ingestion 관계로 복구한다.
- Claim, Scope, Evidence, Transformation을 typed relation으로 만든다.
- 번역·영상·코드 artifact를 source literal과 분리해 정렬한다.
- sparse, dense, late interaction을 서로 다른 recall 실패에 배치하고 fusion·rerank한다.
- 질문의 value, qualifier, implementation subclaim을 모두 덮는 evidence set만 pack한다.
- 하나가 빠지면 retrieval score가 높아도 abstain한다.
- 수정 span에서 도달 가능한 claim·chunk·article만 rebuild하고 무관한 claim은 유지한다.

## 4. 최종 학습 경로

1. `knowledge-compiler`: 다섯 계약과 현재 경로를 고르는 짧은 hub.
2. `knowledge-source-ingestion`: source identity, parser routing, structure recovery, stable coordinate와 fixture gate.
3. `knowledge-ir-evidence-lineage`: Claim·Scope·Evidence schema, build-time lineage, artifact alignment와 revision impact.
4. `rag-pipeline`: full-context/decomposition routing, contextual·late chunking, sparse·dense·late interaction, fusion·rerank, context packing, runtime trace와 release gate.
5. `knowledge-research-watcher`: source discovery, identity, curriculum promotion과 targeted invalidation.

학습 순서와 운영 순서는 구분했다. 학습자는 한 source를 정확히 처리한 뒤 Watcher로 올라가지만, 운영에서는 Watcher가 source event를 먼저 발견해 ingestion queue에 넣을 수 있다.

## 5. 수식과 Viz 설계

새 display 수식 13개에는 각 연산의 역할을 한글 `underbrace`와 `FormulaNote`로 적었다. BM25, cosine과 MaxSim은 “검색 점수” 하나로 묶지 않고 어떤 정보를 압축하고 어떤 recall 실패를 담당하는지 설명했다. Context packing 식은 Top-k 정렬이 아니라 필수 subclaim coverage에서 중복·stale·권한 위험을 빼고 token budget을 제한하는 문제로 썼다.

Viz는 장식이나 모델 표가 아니라 실제 상태 전이를 소유한다.

- structure recovery를 끄면 stable address가 사라지고 검증 불가로 바뀐다.
- 표·수식 조건·caption 관계 중 하나를 끊으면 IR handoff가 review queue로 바뀐다.
- rev 1.3 정정은 네 downstream 객체만 rebuild하고 unrelated claim은 유지한다.
- retrieval mode를 바꾸면 exact, semantic, token-level 신호와 남는 실패가 함께 바뀐다.
- token budget을 늘리면 3/3 evidence가 들어가지만 중복 summary를 추가하면 다시 2/3과 abstain으로 내려간다.
- release gate는 recall, claim support, current source와 latency를 독립적으로 막는다.

## 6. Claude 협업과 교정

bounded Claude Sonnet review는 USD 0.280413를 사용했다. 원문과 대조한 뒤 다음을 반영했다.

- cross-page table stitching을 ingestion의 독립 능력으로 둔다.
- figure anchor resolution은 ingestion, claim-evidence relation은 IR에 둔다.
- formula qualifier를 first-class Scope로 만든다.
- manual, video와 code version의 artifact alignment를 명시한다.
- build-time lineage와 query-time runtime trace를 분리한다.
- Watcher의 source promotion과 IR의 claim impact closure를 분리한다.

다음은 그대로 쓰지 않았다.

- heterogeneous artifact는 항상 decomposition해야 한다: CoDaR의 근거는 dependency와 task에 따라 측정해 route하라는 쪽이다.
- METIS를 source correctness 해결책으로 확대하는 설명: 논문이 소유하는 범위는 per-query quality-delay configuration이다.
- Watcher가 immutable version과 downstream rebuild까지 모두 소유한다는 설명: Watcher는 발견, ingestion은 version 생성, IR은 영향 계산을 맡는다.

## 7. 검증

- focused ESLint 통과.
- production build 통과. 기존 large chunk warning만 남는다.
- 새 세 글의 360·390·768·1440px 12개 렌더 조합 통과.
- authored path, interaction과 current-first route 6개 테스트 통과.
- KaTeX parse error, raw command, document·figure·formula overflow 0.
- mobile rendered formula font는 모두 9.5px 이상.
- hub, ingestion, IR, RAG와 category의 mobile·desktop screenshot 9장을 검토했다.
- learning-flow audit: registered 581, global continuity coverage 581, learningPath assignments 250.

## 8. 4B·9B handoff

4B worker는 원문 하나 또는 block 묶음 하나만 받고 아래 schema를 채운다.

```json
{
  "source_version_id": "",
  "source_locator": "",
  "block_type": "text | table | formula | figure | code",
  "claim_literal": "",
  "scope_qualifiers": [],
  "evidence_relations": [],
  "unresolved_anchors": [],
  "confidence": 0
}
```

9B reviewer는 한 query와 제한된 candidate packet만 받고 다음을 판단한다.

1. Full context와 decomposition 중 어떤 route가 golden slice에서 낫나?
2. Value, qualifier와 implementation version의 evidence가 모두 있는가?
3. Source version이 current이며 서로 충돌하지 않는가?
4. 중복 evidence가 token budget을 밀어내는가?
5. Claim마다 exact source locator가 있는가, 아니면 abstain해야 하는가?

상위 orchestrator만 source registry, graph version, index build, prompt assembly, release와 responsive QA를 바꾼다. 작은 모델의 생성 text를 원문으로 저장하지 않고 schema, ID allowlist, locator와 relation validator를 통과한 객체만 다음 단계로 넘긴다.
