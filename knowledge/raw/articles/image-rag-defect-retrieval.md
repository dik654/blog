# image-rag-defect-retrieval

## 원문 메모

신규 오염 이미지를 CLIP, SigLIP, DINOv2, BiomedCLIP 같은 모델로 embedding한다. 기존 1,000장 이미지의 embedding index에서 유사도 Top-K를 검색한다. 검색된 과거 사례의 "비슷했던 불량 유형", "원인", "처리 결과"를 반환하는 Image RAG 개념을 RAG 쪽에서 자세하게 따로 정리해야 한다.

## 1차 출처

- CLIP: Learning Transferable Visual Models From Natural Language Supervision, arXiv:2103.00020, https://arxiv.org/abs/2103.00020
- SigLIP: Sigmoid Loss for Language Image Pre-Training, arXiv:2303.15343, https://arxiv.org/abs/2303.15343
- DINOv2: Learning Robust Visual Features without Supervision, arXiv:2304.07193, https://arxiv.org/abs/2304.07193
- BiomedCLIP: Large-Scale Domain-Specific Pretraining for Biomedical Vision-Language Processing, arXiv:2303.00915, https://arxiv.org/abs/2303.00915

## 분류 판단

- 주제: 개념/기술/패턴
- 흡수 위치: `knowledge/wiki/concepts/`
- 중심 항목: `ImageRAG`, `DefectImageRAG`, `VisualEmbedding`, `TopKSimilaritySearch`

