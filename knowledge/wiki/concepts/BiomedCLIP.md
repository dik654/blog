# BiomedCLIP

## 정의

BiomedCLIP은 biomedical 이미지와 텍스트 쌍에 맞춰 사전학습된 CLIP 계열 vision-language foundation model이다.

## 상세

BiomedCLIP은 일반 웹 이미지보다 biomedical 이미지-텍스트 도메인에 맞춘 image-text embedding을 제공한다. 현미경 이미지, 병리 이미지, 생물학적 시각 자료처럼 일반 CLIP의 학습 분포와 다른 이미지에서는 도메인 특화 embedding이 더 나은 검색 근거를 만들 수 있다.

Defect Image RAG에서 BiomedCLIP은 모든 제조 불량에 기본 후보는 아니다. 다만 오염 이미지가 미생물, 세포, 조직, 의료기기 표면, 바이오 공정 검사처럼 biomedical 시각 분포에 가깝다면 검토 가치가 있다. 일반 제조 표면 결함이라면 CLIP/SigLIP/DINOv2를 먼저 비교하고, biomedical 성격이 확인될 때 BiomedCLIP을 추가한다.

장점은 domain vocabulary와 biomedical visual pattern에 더 맞을 가능성이다. 단점은 범용 제조 결함에서는 오히려 편향된 표현을 만들 수 있다는 점이다. 따라서 모델 선택은 이름이 아니라 validation set의 Top-K 사례 품질로 결정해야 한다.

## 관련 개념

- [[ImageRAG]] - biomedical 이미지 기반 RAG에서 사용할 수 있는 모델 후보
- [[ComputerVision]] - biomedical vision-language retrieval의 상위 분야
- [[DefectImageRAG]] - 오염 이미지가 biomedical 도메인일 때 검토
- [[VisualEmbedding]] - BiomedCLIP이 만드는 biomedical image-text embedding
- [[TopKSimilaritySearch]] - BiomedCLIP embedding 기반 유사 사례 검색
- [[CLIP]] - BiomedCLIP의 기반이 되는 범용 image-text 모델 계열
- [[SigLIP]] - 다른 image-text embedding 후보
- [[DINOv2]] - 텍스트 정렬 없는 visual feature 후보

## 소스

- [[raw/articles/image-rag-defect-retrieval.md]] - 사용자 요구와 BiomedCLIP 1차 논문 출처
