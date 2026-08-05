# Visual Embedding

## 정의

Visual embedding은 이미지를 고정 길이 숫자 벡터로 바꿔서 유사도 계산, 검색, clustering, 분류, RAG 근거 검색에 사용할 수 있게 만든 표현이다.

## 상세

이미지는 원래 픽셀 배열이지만, 픽셀 거리만으로는 의미적 유사도를 안정적으로 비교하기 어렵다. Visual embedding 모델은 이미지의 객체, 질감, 형태, 장면, 도메인 특징을 압축해 벡터 공간에 배치한다. 같은 종류의 결함이나 같은 시각 패턴을 가진 이미지는 가까운 방향에 놓이고, 다른 유형의 이미지는 멀어지도록 학습된다.

Image RAG에서 visual embedding은 index의 기준 좌표계다. 신규 이미지와 기존 1,000장 이미지를 다른 모델, 다른 crop, 다른 normalization으로 embedding하면 유사도 점수가 비교 불가능해진다. 그래서 모델명, checkpoint, 입력 해상도, crop 방식, normalization, embedding 차원, L2 정규화 여부를 index metadata에 기록해야 한다.

Embedding 추출 단위도 중요하다. 전체 이미지를 하나의 벡터로 만들면 제품 형태나 배경이 강하게 반영된다. 오염 영역이 작으면 defect crop, patch embedding, multi-crop 평균, region proposal 후 embedding 같은 전략이 필요하다. 반대로 불량 유형이 전체 형상과 관련되어 있으면 전체 이미지 embedding이 더 낫다.

검색용 embedding은 보통 L2 정규화 후 cosine similarity나 inner product로 비교한다. CLIP/SigLIP 같은 image-text 모델은 이미지와 텍스트를 같은 공간에 놓기 때문에 "oil stain", "scratch", "surface contamination" 같은 텍스트 query도 함께 쓸 수 있다. DINOv2 같은 self-supervised vision model은 텍스트 query는 직접 못 쓰지만 시각적 texture와 shape retrieval에는 강할 수 있다.

블로그에서 visual embedding 수식을 설명할 때는 `norm(f_theta(g_v(x_i)))` 같은 표현의 기호만 풀지 않는다. L2 정규화가 벡터 길이 편향을 제거하고 방향 기반 유사도 비교를 안정화한다는 연산 이유까지 바로 아래 설명 블록에 붙인다. 작성 교훈은 [[lessons/blog-writing/001-katex-operation-rationale.md]]에 기록한다.

## 관련 개념

- [[ImageRAG]] - visual embedding을 검색 증강 생성의 검색 단위로 사용
- [[ComputerVision]] - visual embedding이 사용되는 상위 분야
- [[DefectImageRAG]] - 오염/불량 이미지 embedding을 과거 사례 검색에 사용
- [[TopKSimilaritySearch]] - embedding 벡터 사이의 가까운 항목을 찾는 단계
- [[CLIP]] - image-text embedding 공간을 만드는 대표 모델
- [[SigLIP]] - sigmoid loss로 학습된 image-text embedding 모델
- [[DINOv2]] - self-supervised visual feature embedding 모델
- [[BiomedCLIP]] - biomedical image-text embedding 모델

## 소스

- [[raw/articles/image-rag-defect-retrieval.md]] - 사용자 요구와 관련 1차 논문 출처
