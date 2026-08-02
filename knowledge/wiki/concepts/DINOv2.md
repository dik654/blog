# DINOv2

## 정의

DINOv2는 라벨이나 텍스트 없이 대규모 이미지에서 self-supervised learning으로 범용 시각 feature를 학습한 vision foundation model 계열이다.

## 상세

DINOv2는 이미지 자체의 구조에서 학습한 visual feature를 제공한다. CLIP/SigLIP처럼 텍스트와 이미지를 같은 공간에 놓는 것이 아니라, 이미지의 형태, 질감, 객체, region-level 시각 특징을 잘 표현하는 데 초점이 있다. 따라서 텍스트 query 기반 검색보다는 image-to-image retrieval, clustering, segmentation, depth, dense feature 활용에 더 직접적으로 맞는다.

Defect Image RAG에서는 DINOv2가 중요한 비교 기준이다. 오염, scratch, coating defect, particle, stain처럼 미세한 시각 패턴은 텍스트 의미보다 texture와 shape가 더 중요할 수 있다. 이런 경우 DINOv2 embedding이 CLIP류 모델보다 비슷한 결함을 더 잘 모을 수 있다.

활용 방식은 두 가지다. 첫째, 전체 이미지의 CLS/global embedding으로 Top-K를 검색한다. 둘째, patch token이나 region embedding을 써서 오염 영역 중심으로 검색한다. 두 번째 방식은 구현이 더 복잡하지만 결함 영역이 작은 검사 이미지에서 유리할 수 있다.

한계는 텍스트 grounding이 약하다는 점이다. DINOv2만 쓰면 "oil stain" 같은 텍스트 label과 직접 유사도를 비교하기 어렵다. 그래서 실제 RAG 답변에는 DINOv2가 찾은 유사 이미지의 metadata를 사용하거나, CLIP/SigLIP semantic 검색과 DINOv2 visual 검색을 ensemble하는 방식이 적합하다.

## 관련 개념

- [[ImageRAG]] - 텍스트보다 시각 feature 중심의 Image RAG 검색에 사용
- [[ComputerVision]] - DINOv2가 속한 상위 분야
- [[DefectImageRAG]] - 미세 오염/결함 패턴 검색에서 중요한 후보 모델
- [[VisualEmbedding]] - DINOv2가 제공하는 self-supervised visual feature
- [[TopKSimilaritySearch]] - DINOv2 embedding 간 유사도 검색
- [[CLIP]] - image-text alignment 모델로서 DINOv2와 보완 관계
- [[SigLIP]] - CLIP 계열 대안으로 DINOv2와 함께 비교할 후보

## 소스

- [[raw/articles/image-rag-defect-retrieval.md]] - 사용자 요구와 DINOv2 1차 논문 출처
