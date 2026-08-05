# Computer Vision

## 정의

Computer Vision은 이미지나 영상에서 객체, 패턴, 구조, 움직임, 의미를 추출해 분류, 탐지, 검색, 생성, 판단에 사용하는 AI 분야다.

## 상세

CLIP, DINOv2, Image RAG는 LLM 응용으로도 연결되지만 중심 분류는 computer vision이다. 입력과 검색 대상이 이미지이고, 품질을 좌우하는 요소도 crop, normalization, visual embedding, image-to-image retrieval, defect metadata 같은 시각 데이터 처리에 있기 때문이다.

LLM은 검색 결과를 설명하거나 원인 후보를 문장으로 정리하는 마지막 계층에 가깝다. 따라서 "CLIP이 뭐야?"처럼 개념을 묻는 글은 vision-language model의 작동 원리를 먼저 설명하고, 이후 RAG나 운영 판단으로 연결하는 순서가 좋다.

애니메이션 Viz 중심 아티클에서는 픽셀 이미지가 feature map이나 embedding vector로 바뀌고, 비슷한 이미지가 벡터 공간에서 가까워지며, Top-K 검색 결과가 metadata와 결합되는 흐름을 보여주는 것이 효과적이다.

## 관련 개념

- [[CLIP]] - 이미지와 텍스트를 같은 embedding 공간에 정렬하는 vision-language 모델
- [[ImageRAG]] - 이미지 embedding 검색을 RAG 근거로 사용하는 패턴
- [[DefectImageRAG]] - 제조/검사 이미지 유사 사례 검색 패턴
- [[VisualEmbedding]] - 이미지를 검색 가능한 벡터로 바꾸는 표현
- [[SigLIP]] - CLIP 계열의 image-text embedding 대안
- [[DINOv2]] - 텍스트 없이 시각 feature를 학습하는 vision foundation model
- [[BiomedCLIP]] - biomedical 이미지-텍스트 도메인에 맞춘 CLIP 계열 모델

## 소스

- [[raw/articles/image-rag-defect-retrieval.md]] - CLIP/Image RAG/Defect Image RAG 분류 판단의 원본 요구
