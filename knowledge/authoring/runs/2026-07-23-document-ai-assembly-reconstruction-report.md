# Document AI 학습 경로 재구성 보고서

이 문서는 OCR 글 몇 편의 요약이 아니라, `페이지를 읽는 모델`과 `근거 있는 문서를 만드는 시스템` 사이의 학습 단절을 어떻게 발견하고 닫았는지 기록한다. 같은 이름의 JSON은 4B·9B 모델이 후속 개선을 좁은 packet으로 재현할 수 있도록 claim, evidence, boundary, transfer fixture와 test oracle을 보존한다.

## 1. 관찰한 문제와 재구성 판단

기존 경로는 OCR 모델 소개, 표 복원, 운영 평가가 각각 존재했지만 한 글의 출력이 다음 글의 입력으로 보이지 않았다. 독자는 PaddleOCR-VL이 page를 잘 읽는다는 사실은 알 수 있어도 다음 질문에 답하기 어려웠다.

- Page 47의 table header와 page 48의 숫자 행은 어떻게 같은 표가 되는가?
- 제목, 문단, 그림과 caption의 관계를 누가 어떤 evidence로 연결하는가?
- RAG chunk에서 원본 page·bbox와 parser revision으로 어떻게 돌아가는가?
- 그럴듯한 OCR 결과를 언제 자동 승인하고 언제 보류·거절하는가?

따라서 모델 목록을 더 늘리지 않고 다섯 개의 실행 계약으로 경로를 다시 고정했다.

1. `문서 계약`: 최종 질문과 실패 비용에서 필요한 구조·provenance를 먼저 정한다.
2. `Page Parser`: 한 page의 text, formula, table, reading order와 좌표를 typed packet으로 만든다.
3. `Document Assembly`: page 경계를 넘어 paragraph, table, heading, figure relation을 evidence와 함께 복원한다.
4. `Table Structure`: rowspan·colspan을 2차원 점유 격자로 펼쳐 누락, slot 충돌과 열 초과를 검산한다.
5. `Release · RAG`: source trace, relation, table rule과 citation path가 모두 통과할 때만 색인에 공개한다.

이 경로의 최소 바닥은 고전 OCR 전체 역사가 아니다. 현재 제품에서 page packet의 글자, 좌표, 구조가 불안정할 때만 더 낮은 image preprocessing·detection·recognition 기반으로 내려간다.

## 2. 정보 구조와 글 책임

`OCR · 문서 AI` 부모는 네 child를 가진다.

- `00 · 문서 계약`: `ocr-document-ai-map`
- `01 · Page Parser`: `paddleocr-vl`, `olmocr-2`
- `02 · Document Assembly`: `document-structure-assembly`, `html-table-structure-reconstruction`
- `03 · Release · RAG`: `ocr-runtime-evaluation`

작성된 current-first 경로 `ai-document-runtime-current-first`는 독자가 실제로 읽을 5개 글만 노출한다. 독립 질문이 있는 olmOCR 2 글은 유지하지만 기본 경로를 무한히 늘리지 않는다. 과거 source-video 합성 URL처럼 독립 학습 질문이 없는 글은 원문 요약 아티클로 남기지 않고 관련 재구성 경로로 redirect한다.

## 3. 원문 근거와 주장 경계

- PaddleOCR-VL-1.6 공식 문서: 0.9B 구조, page-level text·formula·table·reading-order 범위, Real5 조건과 공식 benchmark 주장에 사용했다. 180-page document hierarchy를 보장한다고 확대하지 않았다.
- MinerU-Popo `arXiv:2605.24973`: text/table truncation, title hierarchy, image-text association과 dynamic chunk overlap의 document-level 문제 정의에 사용했다. 모든 언어·도메인의 production 성능으로 일반화하지 않았다.
- DoclingDocument 공식 문서: typed item, group, serialization과 provenance를 함께 두는 IR 구현 사례로 사용했다. 유일한 표준 schema라고 쓰지 않았다.
- Ai2 olmOCR 2 공식 글과 `arXiv:2510.19817`: synthetic HTML에서 생성한 binary unit test, GRPO reward와 benchmark 방향에 사용했다. 업무 문서의 subtotal·tax 규칙은 제품별 verifier 책임으로 남겼다.
- PubTabNet/TEDS `arXiv:1911.10683`: HTML table structure와 tree-edit-distance 평가에 사용했다. 숫자 의미, 업무 합계와 source provenance까지 대신한다고 쓰지 않았다.
- PP-StructureV3 공식 문서: layout, table, formula, chart, reading order와 Markdown 변환 모듈의 범위에 사용했다. cross-page assembler의 대체물로 취급하지 않았다.

## 4. 본문만으로 풀어야 하는 비공개 전이 문제

### 입력 fixture

180쪽 한·영 연차보고서를 두 parser로 처리한다.

- Page 47: `표 8. 지역별 매출`, 4-column header, unit `억원`.
- Page 48: header 없이 숫자 행이 계속되며 첫 행 bbox는 page top에 붙어 있다.
- Page 90: `3.2 공급망 위험` heading.
- Page 91: 문법상 이어지는 paragraph지만 parser는 새 section으로 예측했다.
- Page 132: figure 12와 page 133의 `그림 12` caption 후보가 있다.
- Parser A와 B는 page 48의 한 cell 위치와 page 91의 heading level에서 충돌한다.

### 독자가 도달해야 하는 판단

1. 원문 block은 합쳐 덮어쓰지 않고 page·bbox·parser revision을 가진 typed IR로 보존한다.
2. Table relation은 page adjacency만이 아니라 column signature, unit, header lineage와 border evidence를 합쳐 계산한다.
3. 높은 최상 점수만 보지 않고 차순위와 margin이 작으면 `review`로 보류한다.
4. Cross-page overlap chunk가 일치할 때만 relation을 확정하고, 충돌하거나 overlap이 없으면 review·retry로 보낸다.
5. Table value를 추측해 채우지 않는다. 점유 격자에서 `missing`, 두 origin의 `slot collision`, schema 밖 `overflow`를 구분한다.
6. Release는 평균 confidence가 아니라 source, relation, table, citation gate의 논리곱이다.
7. RAG에는 source layer, structure layer와 retrieval view를 분리해 저장하고 답변에서 원본 crop까지 역추적한다.

## 5. 수식과 Viz 계약

새 Document Assembly 글의 네 수식은 relation evidence score, threshold·margin 보류, overlap 구간, fail-closed release를 맡는다. Runtime 글에는 source·relation·table·citation gate의 논리곱을 추가했다. 모든 표시 수식은 수식 내부 한글 역할 주석과 바로 뒤 `FormulaNote`를 가진다.

- `PageToDocumentAssemblyLab`: page-only block과 assembled document tree를 전환해 relation이 별도 layer임을 보여 준다.
- `CrossPageRelationLab`: paragraph, table, heading, caption마다 geometry·schema·style·semantics evidence와 accept/review/reject가 달라진다.
- `OverlapSynchronizationLab`: chunk overlap의 agreement, conflict, missing-overlap을 merge/review/retry로 구분한다.
- `TableGridReconstructionLab`: valid, missing, slot collision, schema overflow를 서로 다른 구조 오류로 검산한다.
- `DocumentReleaseLab`: page packet → document tree → verified grid → RAG node → release gate를 잇고 table mismatch는 review, missing provenance는 blocked로 판정한다.

색은 파랑=구조·흐름, 초록=검증 통과, 주황=보류, 빨강=거절이라는 의미에만 사용했다. 고정 폭 SVG와 장식용 직선을 제거하고 CSS grid, min-width 0, 안정된 카드 크기와 실제 조작 상태를 사용했다. 자동 animation은 전체 본문 재구성이 끝날 때까지 보류한다.

## 6. Context-manager 협업 기록

사용자 지시대로 direct Claude CLI를 사용하지 않고 context-manager만 호출했다.

1. `cm_list_agents`로 `ai-researcher`, `curator`를 확인했다.
2. 초기 `cm_delegate(ai-researcher)`와 `cm_delegate(curator)`는 모두 Claude provider의 `All providers failed` HTTP 500으로 종료됐다.
3. 구현 뒤 `cm_route_delegate` 독립 리뷰는 성공했고 `codex:gpt-5.5` worker가 조건부 PASS를 반환했다.
4. 리뷰는 마지막 runtime 글이 typed block → relation → grid → RAG → release artifact를 시각적으로 이어받지 못하고 SourceNotes가 약하며, table lab이 실제 slot collision과 overflow를 구분하지 않는다고 지적했다.
5. 세 지적을 모두 구현하고 전용 회귀 테스트를 추가했다.
6. 보강 후 `cm_delegate(ai-researcher)`로 Claude 재검토를 요청했지만 같은 provider 500이 반복됐다.

따라서 Claude 응답을 받은 것으로 기록하지 않는다. 정상 동작한 context-manager 독립 리뷰와 primary-source 대조, 수치·브라우저 oracle을 사용했고 provider 장애는 그대로 남긴다.

## 7. 4B·9B 모델로 좁혀 재현하는 packet

4B 모델에는 관계 하나만 준다.

```text
source excerpt 1개
-> 허용 claim / 금지 extrapolation
-> typed block 2~4개
-> evidence channel 2개
-> accept / review / reject oracle
-> formula 또는 Viz state 1개
-> 390px overflow·font·console acceptance
```

9B 모델에는 document transition 하나를 준다.

```text
제품 질문과 실패 비용
-> page parser output schema
-> document relation candidate
-> competing evidence와 abstention
-> table occupancy 또는 tree update
-> provenance-preserving retrieval view
-> release gate
-> source boundary·stop rule·Playwright test
```

오케스트레이터는 전체 5단계 순서, 공통 fixture id, 원문 URL, claim boundary와 최종 public deployment를 유지한다. 작은 모델 출력은 prose보다 먼저 `claim/evidence/boundary/input/output/invariant/failure/viz-state/test` JSON으로 받는다.

## 8. 추론을 구현으로 바꾼 과정

숨은 사고 과정을 복제하려 하지 않고 재현 가능한 의사결정 기록만 남긴다.

1. **관찰**: 기존 글은 개별 설명은 있으나 artifact handoff가 없다.
2. **가설**: OCR 모델 중심 분류를 document lifecycle 중심으로 바꾸면 연결점이 보인다.
3. **근거 수집**: PaddleOCR page parser, MinerU-Popo document repair, Docling IR, PubTabNet/TEDS, olmOCR verifier의 책임 경계를 원문에서 분리했다.
4. **설계 경계**: parser, assembler, table verifier, release/RAG를 독립 실패 단위로 나눴다.
5. **전이 문제**: 180-page 보고서에서 page split, table continuation, title hierarchy, caption과 parser disagreement를 동시에 검산하게 했다.
6. **구현**: metadata·sidebar·learning path, 새 본문, interactive Viz, 한글 KaTeX annotation과 primary SourceNotes를 같은 계약으로 수정했다.
7. **검증**: 조작 상태, formula size, horizontal overflow, console error, raw table, route order와 legacy redirect를 Playwright로 고정했다.
8. **독립 리뷰**: context-manager 지적을 받아 final runtime handoff와 slot collision을 보강했다.

## 9. 검증과 배포 결과

- Production build: 통과.
- Document AI 전용 contract: `6/6` 통과.
- 정보 구조·current-first 관련 회귀: `27/27` 통과.
- 갱신된 전역 경로 계약: `8/8` 통과.
- Document AI visual audit: 5 routes × 3 viewports, error 0, warning 0.
- Document AI narrative audit: 5 routes × 3 viewports, error 0, warning 0.
- 수동 시각 검토: 390, 768, 1440px. 잘림과 document horizontal overflow 0.
- `git diff --check`: 통과.
- `build:tsc`: 기존 corpus의 unrelated type error 때문에 실패. 이번 OCR 파일의 Vite production build와 browser contract는 통과했다.
- 전역 learning-flow audit: 등록 글 585, global continuity 585, release blocker 29, review-needed 1, enrichment backlog 525.
- 최종 관련 회귀: `109/109` 통과.
- 로컬 production contract: `6/6` 통과.
- 공개 URL contract: `6/6` 통과.
- 공개 HTTP: category, Document Assembly, Runtime Evaluation 모두 200.
- `cm-blog.service` 재시작: 2026-07-23 01:23:07 KST.
- 배포 chunk: `document-structure-assembly-BCZBzvbZ.js` 20,966 bytes, `ocr-runtime-evaluation-6FXtqb2N.js` 20,993 bytes, `html-table-structure-reconstruction-ytb1qpM4.js` 14,880 bytes.
- SHA-256: Document Assembly `14a20dabba1f6869fdf2039a8e8fa54f71a748a7f59394041bf2f5cdc78efdd3`, Runtime `de1983da71003d0bfc012530d3e7b1d823e54ec40b2869c301939adc4be8f312`, Table `6ffa47542d1ae2b40fdec282f4d2c9794d401609224f4aa2cebf7b55e14f806e`.

전체 corpus에는 기존 release blocker와 prerequisite·local connection backlog가 남아 있으므로 formal goal은 완료 처리하지 않는다. 이번 Document AI 경로를 닫은 뒤 다음 우선순위 경로로 이어간다.
