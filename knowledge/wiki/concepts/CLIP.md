# CLIP

## 정의

CLIP은 이미지 인코더와 텍스트 인코더를 함께 학습해 이미지와 자연어 설명을 같은 embedding 공간에 배치하는 computer vision 계열의 vision-language 모델이다.

## 상세

CLIP의 핵심은 이미지와 캡션 쌍을 맞추는 contrastive learning이다. 학습 후에는 이미지 embedding과 텍스트 embedding의 유사도를 비교할 수 있으므로, 이미지 분류, zero-shot retrieval, 텍스트 query 기반 이미지 검색에 쓸 수 있다. Image RAG에서는 신규 오염 이미지를 image encoder로 벡터화하고, 과거 이미지 벡터와 cosine similarity로 비교하는 기준 모델로 사용할 수 있다.

Defect Image RAG에서 CLIP의 장점은 라벨 텍스트와 이미지가 같은 공간에 있다는 점이다. 예를 들어 과거 사례가 충분하지 않아도 "surface contamination", "scratch", "corrosion" 같은 텍스트 prompt와 이미지의 유사도를 보조 신호로 쓸 수 있다. 또한 검색 결과를 사람이 이해하는 defect label과 연결하기 쉽다.

한계도 명확하다. CLIP은 일반 웹 이미지-텍스트 쌍에서 배운 의미 정렬이 강하므로, 제조 현장의 미세 오염, 현미경 texture, 조명 차이, 장비별 촬영 artifact에는 둔할 수 있다. 불량 유형이 육안 의미보다 국소 패턴에 가깝다면 DINOv2 같은 순수 visual feature 모델과 함께 비교해야 한다. 도메인 라벨이 충분하면 CLIP embedding 위에 metric learning이나 lightweight fine-tuning을 추가하는 것도 검토할 수 있다.

공개 아티클로 만들 때는 "CLIP이 뭐야?"라는 질문에 바로 답할 수 있게 image encoder, text encoder, contrastive learning, shared embedding space, zero-shot classification, image retrieval을 한 흐름으로 설명한다. 애니메이션 Viz는 `이미지 배치 + 캡션 배치 -> 두 인코더 -> 벡터 공간 정렬 -> 텍스트 프롬프트와 이미지의 cosine similarity 비교` 순서가 핵심이다.

블로그 공개 글은 `clip-vision-language-model`로 분리한다. 분류는 LLM 응용이 아니라 Computer Vision이다. LLM이나 RAG는 CLIP embedding으로 찾은 근거를 설명하는 후단이고, CLIP 자체의 핵심은 image-text alignment와 visual retrieval에 있기 때문이다.

CLIP 글의 KaTeX 수식 설명은 변수명 풀이에서 멈추지 않는다. image/text encoder 출력, normalization, cosine similarity, temperature scaling 같은 연산이 왜 필요한지 바로 아래 설명 블록에 붙여야 한다. 작성 교훈은 [[lessons/blog-writing/001-katex-operation-rationale.md]]에 기록한다.

## 관련 개념

- [[ImageRAG]] - CLIP image embedding을 Image RAG 검색 벡터로 사용
- [[ComputerVision]] - CLIP이 속한 상위 분야
- [[DefectImageRAG]] - 텍스트 defect label과 이미지 사례를 연결할 때 유용
- [[VisualEmbedding]] - CLIP이 생성하는 이미지/텍스트 공통 벡터 표현
- [[TopKSimilaritySearch]] - CLIP embedding 간 cosine similarity로 과거 사례 검색
- [[SigLIP]] - CLIP 계열의 sigmoid loss 기반 대안
- [[DINOv2]] - 텍스트 정렬보다 시각 feature 자체에 집중하는 비교 대상
- [[BiomedCLIP]] - biomedical 도메인에 특화된 CLIP 계열 모델

## 소스

- [[raw/articles/image-rag-defect-retrieval.md]] - 사용자 요구와 CLIP 1차 논문 출처
