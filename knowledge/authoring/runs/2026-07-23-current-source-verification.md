# Current source verification

## 판정 경계

True-Claude worker가 live search 부재 때문에 보류한 최신 출처만 별도로 확인했다. 논문은 arXiv 원문, 제품은 공식 문서, 구현은 소유 조직의 저장소를 기준으로 삼았다. 이 결과는 Claude identity coverage와 별개다.

## 확인 결과

| 묶음 | 판정 | 직접 확인한 경계 |
| --- | --- | --- |
| Comfy Cloud | verified | 로컬은 `POST /prompt`, Cloud는 `POST /api/prompt`; Cloud API는 experimental이다. |
| PP-DocLayoutV2 | verified | RT-DETR-L 기반 검출 뒤 6 Transformer layer의 pointer network가 reading order를 복원한다. |
| MinerU-Popo | verified | 네 subtask, 30K data, Qwen3-VL-4B, dynamic chunking·overlap synchronization이 원문과 일치한다. |
| AniMatrix·LTX-2 | verified | AniMatrix의 production taxonomy와 공개 준비 경계, LTX-2 trainer의 LoRA·full·IC-LoRA 및 dataset preprocessing 계약이 일치한다. |
| FLUX.2 | verified | 통합 생성·편집, variant별 reference 제한, [klein] 4B·9B의 license와 약 13GB 경계가 공식 문서와 일치한다. |

## Primary sources

- [ComfyUI local routes](https://docs.comfy.org/development/comfyui-server/comms_routes)
- [Comfy Cloud API reference](https://docs.comfy.org/development/cloud/api-reference)
- [PaddleOCR layout analysis](https://www.paddleocr.ai/v3.3.1/en/version3.x/module_usage/layout_analysis.html)
- [MinerU-Popo](https://arxiv.org/abs/2605.24973)
- [MinerU-Popo repository](https://github.com/opendatalab/MinerU-Popo)
- [AniMatrix](https://arxiv.org/abs/2605.03652)
- [LTX-2 trainer](https://github.com/Lightricks/LTX-2/tree/main/packages/ltx-trainer)
- [LTX-2 dataset preparation](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-trainer/docs/dataset-preparation.md)
- [BFL FLUX.2 release](https://bfl.ai/blog/flux-2)
- [BFL FLUX.2 overview](https://docs.bfl.ai/flux_2/flux2_overview)

현재 출처 묶음은 5/5 해결됐고 open cluster는 0이다. 이후 제품 문서가 바뀌면 version-sensitive claim만 다시 확인한다.
