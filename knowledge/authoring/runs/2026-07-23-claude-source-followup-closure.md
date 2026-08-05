# Claude source follow-up closure

## 범위

`2026-07-23-claude-review-coverage-reconciliation.json`에 article review와 별도로 남아 있던
네 개의 live-source 후속 확인 묶음을 닫았다.

1. `comfyui-workflow-map`
2. `paddleocr-vl`
3. `document-structure-assembly`, `ocr-runtime-evaluation`
4. animation production 네 글과 `comfyui-edit-models-flux-qwen`

## Context Manager 실행

네 작업을 `cm_route_delegate`로 병렬 실행했고 worker를 `claude-code:sonnet`으로 고정했다.
모든 채택 응답은 첫 transport header가 `[claude-code:sonnet`으로 시작했다.

| 묶음 | Header | Claude 판정 |
|---|---|---|
| Comfy Cloud | `[claude-code:sonnet · L2 · $0.0000 · 91543ms]` | FIX, 외부 원문 미확인 |
| PaddleOCR | `[claude-code:sonnet · L2 · $0.0000 · 101466ms]` | FIX, 외부 원문 미확인 |
| MinerU-Popo | `[claude-code:sonnet · L2 · $0.0000 · 178991ms]` | FIX, 저자명 불일치 |
| Animation/products | `[claude-code:sonnet · L3 · $0.0000 · 153779ms]` | FIX, 외부 원문 미확인 |

Claude worker는 네트워크 권한이 없어 `SOURCE_UNVERIFIED`를 명시했다. 따라서 `FIX`를 그대로
받아들이지 않고 Codex가 공식 원문을 독립 대조했다.

## 독립 원문 대조

- ComfyUI Cloud 공식 API는 `POST /api/prompt`, `prompt`,
  `partial_execution_targets`, `prompt_id`, `node_errors`를 실제로 명시한다. Claude의 endpoint
  의심은 기각했다.
- PaddleOCR 공식 Layout Analysis 문서는 PP-DocLayoutV2가 RT-DETR-L 기반 detector와
  6 Transformer layer pointer network를 연결한다고 명시한다. Architecture 수치는 유지하고
  해당 문단 바로 뒤에 공식 출처를 추가했다.
- PaddleOCR-VL 논문은 NaViT-style dynamic-resolution encoder와 ERNIE-4.5-0.3B를 명시한다.
- MinerU-Popo `arXiv:2605.24973`의 제1저자는 Bangrui Xu다. 네 subtask, 30K 생성 데이터,
  Qwen3-VL-4B, dynamic chunking과 overlap synchronization은 원문에 실제로 있다.
  `Huang et al.`을 `Xu et al.`로 고쳤다.
- arXiv 논문은 `opendatalab/MinerU-Popo`를 code metadata로 연결하며 저장소도 존재한다.
- AniMatrix `arXiv:2605.03652`는 Style/Motion/Camera/VFX taxonomy, AniCaption,
  dual-channel conditioning, deformation-aware preference optimization과 공개 준비 중이라는
  경계를 명시한다.
- AnimationBench `arXiv:2604.15299`는 Twelve Principles, IP Preservation,
  close-set/open-set 평가를 명시한다.
- BFL 공식 자료는 FLUX.2 [dev] 32B, [klein] 4B/9B, 4B Apache 2.0,
  약 13GB VRAM을 뒷받침한다.
- Qwen 공식 글은 Qwen-Image-Edit가 20B Qwen-Image 기반이며 중국어·영어 text editing을
  지원한다고 명시한다.

## 결과

확정 수정은 두 가지다.

1. MinerU-Popo 저자 귀속을 `Xu et al.`로 교정했다.
2. PP-DocLayoutV2 상세 구조 문단에 공식 문서 citation과 SourceNotes 항목을 추가했다.

나머지 Claude 지적은 원문으로 반증되거나 기존 경계 문구가 충분해 코드 수정 없이 닫았다.
이 기록은 과거 identity audit를 대체하지 않으며, 그 감사가 별도로 남겨 둔 live-source 후속
큐만 닫는다.
