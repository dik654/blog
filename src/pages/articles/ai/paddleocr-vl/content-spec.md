# PaddleOCR-VL-1.6 page parser content spec

## Goal

- 독자는 `0.9B` 모델 크기, `1.6` revision과 page parser의 실제 책임을 구분한다.
- 독자는 page 안의 layout·element recognition과 page 사이의 document assembly를 같은 정확도 주장으로 합치지 않는다.
- 실패한 출력에서 최초 정보 손실 stage를 찾아 detector, crop, recognizer, aggregation 중 한 곳만 먼저 고친다.

## Article role and stopping boundary

| Item | Contract |
|---|---|
| Current top | PaddleOCR-VL-1.6의 공개 architecture·training·benchmark claim |
| Mechanism | Input audit → layout → crop → 0.9B VLM → typed block → page packet |
| Upstream | `ocr-document-ai-map`, `olmocr-2` |
| Downstream | `document-structure-assembly`, `html-table-structure-reconstruction`, `ocr-runtime-evaluation` |
| Stop rule | 검증된 page packet을 만들고 cross-page 관계가 별도 책임임을 설명하면 멈춤 |
| Deferred | RT-DETR·NaViT 구현 수식과 document-level relation 복원은 child article이 소유 |

## Source anchors

| Area | Primary source | Claim ceiling |
|---|---|---|
| Current revision | PaddleOCR-VL-1.6 official documentation and paper | 제작 측 benchmark가 한국어 사내 corpus 성능을 보장한다고 쓰지 않는다. |
| Original architecture | PaddleOCR-VL 0.9B paper | 공개 구조를 다른 vendor parser와 동일하다고 보지 않는다. |
| Layout stage | PP-DocLayoutV2 official documentation | Page 안의 bbox·class·reading order까지만 근거로 삼는다. |
| Deployment | PaddleOCR official documentation | Backend 지원을 실제 target hardware 성능 보장으로 확대하지 않는다. |

## Hidden transfer check

47쪽 표의 마지막 열이 사라진다. VLM이 받은 crop에도 그 열이 없고, 원본 page에는
열이 보인다. 본문만으로 다음을 판정할 수 있어야 한다.

1. 첫 손실은 recognition이 아니라 layout 또는 crop boundary다.
2. VLM prompt와 language model을 먼저 바꾸지 않는다.
3. Bbox, render DPI, crop image를 같은 trace에서 비교한다.
4. Page 47의 검증 뒤에도 48쪽에서 표가 계속되는지는 document assembler가 판정한다.

문제는 시험 형태로 노출하지 않고 StepViz의 손실 경계와 capability check로 흡수한다.

## Prose-to-viz contract

- Scene 1: source hash, render DPI, page와 trace identity.
- Scene 2: text·table·formula bbox와 reading order.
- Scene 3: page identity를 보존한 element crop queue.
- Scene 4: crop → NaViT-style encoder → ERNIE side → typed output.
- Scene 5: 사람용 Markdown과 기계용 block provenance.
- Scene 6: verified page packet과 document assembler의 책임 경계.
- Scene 전에 두 문단으로 무엇을 볼지 설명한다.
- Desktop 가로, mobile 세로 흐름이며 내부 스크롤과 10px 이하 글자를 쓰지 않는다.

## Coverage recheck

| Scope | Covered by |
|---|---|
| Current model and source ceiling | Overview, versions, SourceNotes |
| Runtime responsibility | Architecture, StepViz |
| Failure localization | StepViz, failure modes |
| Typed output and provenance | Runtime trace, document elements |
| Cross-page boundary | StepViz final scene, handoff prose |
| Transfer evidence | CapabilityCheck |
