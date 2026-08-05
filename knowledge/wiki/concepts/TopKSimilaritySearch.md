# Top-K Similarity Search

## 정의

Top-K Similarity Search는 질의 벡터와 저장된 벡터들의 유사도를 계산해 가장 가까운 K개 항목을 반환하는 검색 방식이다.

## 상세

Image RAG에서 질의 벡터는 신규 오염 이미지의 visual embedding이고, 저장 벡터는 기존 1,000장 이미지의 embedding이다. 각 저장 항목과 cosine similarity 또는 inner product를 계산한 뒤 점수가 높은 순서로 K개를 고른다. 이 K개가 이후 불량 유형, 원인, 처리 결과를 반환하는 근거 집합이 된다.

K는 정답 품질과 노이즈의 균형이다. K가 너무 작으면 유사 사례 하나의 오판에 끌려간다. K가 너무 크면 다른 불량 유형이 섞여 원인 요약이 흐려진다. 불량 이미지 1,000장 규모에서는 K=5, K=10, K=20을 비교해 보고, 사람 판정 기준으로 precision@K와 recall@K를 측정하는 것이 현실적이다.

유사도 점수만으로 충분하지 않을 때는 metadata filter를 함께 쓴다. 같은 제품군, 공정, 장비, 촬영 조건, 현미경 배율, 검사 날짜 같은 필터를 먼저 적용한 뒤 Top-K를 검색하면 엉뚱한 사례가 줄어든다. 반대로 원인 탐색 단계에서는 필터를 일부 풀어 다른 lot이나 장비에서 반복된 유사 패턴을 찾을 수 있다.

1,000장에서는 모든 벡터와 직접 비교해도 빠르다. 다만 이미지 수가 늘어나면 HNSW, IVF, PQ 같은 Approximate Nearest Neighbor index를 고려한다. 운영에서는 index 알고리즘보다 embedding versioning이 먼저 중요하다. 기존 이미지를 CLIP으로 embedding한 index와 새 이미지를 DINOv2로 embedding한 질의를 섞으면 Top-K 결과가 의미 없어진다.

블로그 수식에서는 `s(q,i)=cos(z_q,z_i)=z_q^Tz_i/(||z_q||_2||z_i||_2)`를 제시한 직후, 왜 `||.||_2`로 나누는지와 왜 cosine을 쓰는지까지 설명한다. 핵심은 벡터 크기 효과를 제거하고 query와 item embedding의 방향 유사도만으로 순위를 매기기 위함이다. 작성 교훈은 [[lessons/blog-writing/001-katex-operation-rationale.md]]에 기록한다.

## 관련 개념

- [[ImageRAG]] - Top-K 결과를 RAG context로 사용
- [[DefectImageRAG]] - Top-K 과거 사례에서 불량 유형, 원인, 처리 결과를 집계
- [[VisualEmbedding]] - Top-K 검색의 입력 벡터를 만드는 단계
- [[CLIP]] - cosine similarity 기반 image-text retrieval에 자주 쓰이는 모델
- [[SigLIP]] - SigLIP embedding 기반 유사 사례 검색 후보
- [[DINOv2]] - 시각적 특징 기반 Top-K 검색의 후보 모델
- [[BiomedCLIP]] - biomedical 도메인 이미지 embedding 기반 검색 후보

## 소스

- [[raw/articles/image-rag-defect-retrieval.md]] - 사용자 요구와 관련 1차 논문 출처
