# Image RAG

## 정의

Image RAG는 텍스트 문서 대신 이미지나 이미지에서 추출한 시각 embedding을 검색 대상으로 삼아, 새 이미지와 유사한 과거 사례를 찾아 그 사례의 라벨, 원인, 조치 이력 같은 구조화된 근거를 답변에 주입하는 검색 증강 생성 패턴이다.

## 상세

일반 RAG는 질문 텍스트를 embedding하고 문서 chunk를 검색한다. Image RAG는 입력이 이미지라는 점이 다르다. 신규 오염 이미지는 먼저 vision encoder를 통과해 고정 길이 벡터가 된다. 기존 이미지 1,000장도 같은 모델과 같은 전처리 규칙으로 미리 embedding되어 vector index에 저장된다. 질의 시에는 새 이미지 벡터와 저장 벡터 사이의 cosine similarity나 inner product를 계산해 Top-K 과거 사례를 가져온다.

핵심은 검색 결과가 단순히 "비슷한 이미지"에서 끝나면 안 된다는 점이다. 각 이미지에는 불량 유형, 발생 공정, 설비 조건, 판정자 메모, 원인 분석, 처리 결과가 metadata로 붙어 있어야 한다. 그래야 검색 결과를 LLM이나 규칙 엔진에 넘겼을 때 "과거에 비슷했던 불량 유형", "가능한 원인", "그때의 처리 결과"를 근거와 함께 반환할 수 있다.

Image RAG의 품질은 네 경계에서 결정된다. 첫째, 이미지 전처리와 crop 정책이다. 오염 영역이 작으면 전체 이미지를 embedding할 때 배경이나 제품 형상이 유사도를 지배할 수 있다. 둘째, embedding 모델 선택이다. CLIP/SigLIP은 텍스트-이미지 정렬이 강하고, DINOv2는 순수 시각 특징과 지역 패턴에 강하며, BiomedCLIP은 biomedical 이미지-텍스트 도메인에 맞춰져 있다. 셋째, index schema다. 벡터뿐 아니라 defect_type, root_cause, disposition, lot, machine_id, timestamp 같은 필드를 같이 저장해야 한다. 넷째, 반환 로직이다. Top-K를 그대로 보여주기보다 유사도, 동일 공정 여부, 최근성, 원인 확정 여부를 함께 평가해야 한다.

1,000장 규모에서는 FAISS, pgvector, Qdrant, Chroma 같은 벡터 저장소 없이도 메모리 brute-force cosine 검색이 가능하다. 다만 운영 관점에서는 metadata filter, audit trail, 재임베딩 버전 관리가 필요하므로 작은 규모에서도 vector DB 또는 최소한 명시적 index manifest를 두는 편이 좋다.

공개 아티클은 LLM 응용보다 computer vision의 image retrieval 문제로 배치하는 것이 자연스럽다. 생성 모델이나 LLM은 검색 결과를 설명하는 마지막 단계이고, 핵심 난도는 이미지 전처리, visual embedding, 유사도 검색, defect metadata schema에 있다. 애니메이션 Viz는 `신규 이미지 -> crop/normalize -> vision encoder -> query vector -> vector index Top-K -> metadata 집계 -> 답변` 파이프라인을 중심으로 둔다.

## 관련 개념

- [[DefectImageRAG]] - 오염/불량 이미지 사례 검색에 Image RAG를 적용한 구체 패턴
- [[ComputerVision]] - Image RAG의 주요 분류 축
- [[VisualEmbedding]] - 이미지를 검색 가능한 벡터 표현으로 바꾸는 단계
- [[TopKSimilaritySearch]] - 새 이미지와 과거 이미지 embedding 사이에서 유사 사례를 고르는 검색 단계
- [[CLIP]] - 텍스트-이미지 정렬이 필요한 Image RAG의 기본 후보 모델
- [[SigLIP]] - CLIP 계열의 sigmoid loss 기반 대안
- [[DINOv2]] - 텍스트 정렬보다 시각 특징 자체가 중요한 검색에서 유용한 후보
- [[BiomedCLIP]] - biomedical 이미지 도메인의 Image RAG 후보 모델

## 소스

- [[raw/articles/image-rag-defect-retrieval.md]] - 사용자 요구와 관련 1차 논문 출처
