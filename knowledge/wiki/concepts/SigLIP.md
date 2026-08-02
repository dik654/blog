# SigLIP

## 정의

SigLIP은 CLIP류 이미지-텍스트 사전학습에서 softmax contrastive loss 대신 pairwise sigmoid loss를 사용해 image-text embedding을 학습하는 vision-language 모델 계열이다.

## 상세

CLIP은 batch 안의 image-text 쌍 전체를 비교하는 softmax contrastive objective를 쓴다. SigLIP은 각 이미지-텍스트 쌍을 독립적인 positive/negative pair로 보는 sigmoid loss를 사용한다. 이 차이는 대규모 batch 구성과 학습 효율에 영향을 주며, 결과적으로 CLIP과 비슷한 용도의 image-text retrieval 모델로 사용할 수 있다.

Image RAG 관점에서 SigLIP은 CLIP과 같은 자리에 놓고 평가할 수 있는 후보 모델이다. 신규 오염 이미지를 SigLIP image encoder로 embedding하고, 기존 1,000장 이미지도 같은 encoder로 embedding한 뒤 Top-K 검색을 수행한다. 텍스트 label이나 defect prompt와의 유사도도 보조 신호로 활용할 수 있다.

실무적으로는 "CLIP보다 항상 낫다"가 아니라 데이터셋별 retrieval 품질로 선택해야 한다. 제조 오염 이미지에서는 조명, 배율, 촬영 장비, 결함 크기 같은 요소가 모델 성능을 크게 바꾼다. 따라서 같은 train/eval split에서 CLIP, SigLIP, DINOv2 embedding의 precision@K, mean reciprocal rank, 판정자 만족도를 비교해야 한다.

## 관련 개념

- [[ImageRAG]] - SigLIP embedding을 이미지 검색 RAG에 사용할 수 있음
- [[ComputerVision]] - SigLIP이 속한 vision-language 분야
- [[DefectImageRAG]] - CLIP 대체 후보로 과거 불량 사례 검색에 적용
- [[VisualEmbedding]] - SigLIP이 만드는 image-text embedding 표현
- [[TopKSimilaritySearch]] - SigLIP embedding 기반 Top-K 검색
- [[CLIP]] - SigLIP과 직접 비교되는 기본 image-text 모델
- [[DINOv2]] - image-text 정렬 없는 visual feature 모델 비교 대상

## 소스

- [[raw/articles/image-rag-defect-retrieval.md]] - 사용자 요구와 SigLIP 1차 논문 출처
