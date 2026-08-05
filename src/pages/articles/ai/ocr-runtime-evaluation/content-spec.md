# OCR runtime release-gate content spec

## Goal

- 독자는 OCR 결과를 Markdown 생성으로 끝내지 않고 source trace, document relation, table rule과 citation path를 검증한다.
- 독자는 높은 confidence를 실패한 gate와 평균내지 않고 `공개`, `검토`, `차단` 중 하나로 fail-closed routing한다.
- 독자는 검색 답변에서 원본 page·bbox·crop까지 돌아가는 증거 chain을 설계한다.

## Article role and stopping boundary

| Item | Contract |
|---|---|
| Current top | Page parser output을 production RAG에 공개하기 위한 실행 계약 |
| Inputs | Verified page packets, document tree, table grid |
| Core invariant | 네 gate가 모두 참일 때만 자동 공개 |
| Upstream | `paddleocr-vl`, `document-structure-assembly`, `html-table-structure-reconstruction` |
| Stop rule | 실패 이유와 source identity가 있는 release receipt를 만들면 멈춤 |
| Deferred | Parser architecture, table reconstruction algorithm과 retrieval ranking 상세 |

## Source anchors

| Area | Primary source | Claim ceiling |
|---|---|---|
| Verifiable OCR reward | Ai2 olmOCR 2 official research and paper | 학습 unit test가 모든 production business rule을 대신한다고 쓰지 않는다. |
| Parser scope | PP-StructureV3 official documentation | Page parsing 성능을 cross-page document correctness로 확대하지 않는다. |
| Table structure | PubTabNet and TEDS paper | HTML tree similarity가 금액 합계와 provenance를 보장한다고 쓰지 않는다. |
| Document assembly | MinerU-Popo paper | 공개 benchmark가 사내 corpus의 release readiness를 보장한다고 쓰지 않는다. |

## Hidden transfer check

두 문서가 있다. A는 모든 글자와 표 합계가 맞지만 `page·bbox`가 없다. B는 원문
좌표가 있으나 subtotal 42, tax 5와 total 48이 있어 합계가 다르다. 본문만으로 다음을 판정할 수 있어야 한다.

1. A는 citation path까지 끊기므로 검색 색인에서 차단한다.
2. B는 원문 검토가 가능하므로 review queue로 보낸다.
3. 두 결과 모두 평균 confidence가 높아도 자동 공개하지 않는다.
4. Receipt에는 실패 gate, block id, page, bbox와 crop reference를 남긴다.

문제 문장은 본문에 직접 싣지 않고 scenario control과 release decision에 흡수한다.

## Formula contract

- `release(d) = G_source(d) ∧ G_relation(d) ∧ G_table(d) ∧ G_citation(d)`.
- 각 gate 아래에 한글 역할을 underbrace로 표시한다.
- FormulaNote는 네 기호와 AND를 쓰는 이유를 설명한다.

## Prose-to-viz contract

- Scene 1: typed page blocks와 provenance의 존재·누락.
- Scene 2: contains·continues·describes document relations.
- Scene 3: 점유 격자와 subtotal/total 업무 규칙.
- Scene 4: RAG node에서 source crop까지의 citation path.
- Scene 5: 네 gate와 `공개/검토/차단` release receipt.
- 세 scenario는 색만 바뀌지 않고 artifact 값, 실패 이유와 최종 판정이 바뀐다.
- Scene보다 앞에 추출과 검증의 차이를 설명하는 prose를 둔다.
- Mobile은 세로로 재배치하고 내부 가로 스크롤을 만들지 않는다.

## Coverage recheck

| Scope | Covered by |
|---|---|
| Pipeline and orchestration | Pipeline, structured output, orchestration |
| Verifiable business rules | Verification, quality gates |
| Korean annotated formula | Quality-gate formula and FormulaNote |
| Controlled causal Viz | Release StepViz and three scenarios |
| RAG provenance | RAG, Viz citation scene |
| Evaluation and review loop | Observability, benchmark, CapabilityCheck |
