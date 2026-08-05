# Defect Image RAG

## 정의

Defect Image RAG는 신규 오염/불량 이미지를 과거 불량 이미지 사례 DB와 시각 유사도로 매칭하고, 검색된 사례의 불량 유형, 원인, 처리 결과를 근거로 반환하는 제조·검사 특화 Image RAG 패턴이다.

## 상세

기본 흐름은 `신규 이미지 -> 전처리 -> visual embedding -> Top-K 유사 사례 검색 -> metadata 집계 -> 답변 생성`이다. 기존 1,000장 이미지는 사전에 같은 embedding 모델로 벡터화한다. 각 벡터에는 최소한 이미지 ID, 불량 유형, 원인, 처리 결과, 공정, 장비, 날짜, 판정 신뢰도, 원본 이미지 경로가 연결되어야 한다.

검색 결과는 세 가지 질문에 답해야 한다. 첫째, "과거에 비슷했던 불량 유형"은 Top-K의 defect_type 분포와 대표 사례로 답한다. 둘째, "원인"은 root_cause가 확정된 사례만 별도로 모아 빈도와 조건을 제시한다. 셋째, "처리 결과"는 disposition, rework, scrap, cleaning, line stop 같은 조치와 그 결과를 사례별로 연결한다.

반환 형식은 이미지 검색 결과와 원인 추론을 분리해야 한다. 유사도 검색은 "비슷했던 사례"의 근거이고, 원인과 처리는 그 사례 metadata에서 온다. 따라서 답변에는 "유사도 0.87의 과거 사례 3건 중 2건은 표면 오염, 1건은 코팅 불량으로 분류됨"처럼 검색 근거와 집계 근거를 함께 남긴다. LLM이 원인을 새로 지어내지 않도록, metadata에 없는 원인은 "확정 원인 없음"으로 표시한다.

모델 선택은 데이터 성격에 맞춘다. 일반 사진 형태의 오염 이미지와 자연어 defect label을 함께 검색하려면 CLIP/SigLIP이 출발점이다. 미세 패턴, texture, edge, 국소 결함이 중요하면 DINOv2 embedding을 병렬 index로 둔다. 의료·현미경·생물학 이미지처럼 biomedical corpus와 가까운 도메인이면 BiomedCLIP을 검토한다. 실제 운영에서는 모델 하나를 고정하기보다 `CLIP/SigLIP semantic index + DINOv2 visual texture index + metadata filter` 조합이 더 견고하다.

주의할 점은 데이터 1,000장이 작다는 것이다. 작은 데이터셋에서는 유사도 점수의 절대값보다 Top-K 사례의 설명 가능성이 더 중요하다. K=5 또는 K=10부터 시작하고, 유사도 임계값 아래의 결과는 "비슷한 사례 부족"으로 처리한다. 또한 같은 lot이나 같은 장비 이미지가 과도하게 검색되면 데이터 누수처럼 보일 수 있으므로 lot/machine filter를 켜고 끄는 두 검색 결과를 비교하는 것이 좋다.

아티클화할 때는 한 글에 모든 모델을 얕게 넣기보다 개념별 상세 글로 분리한다. `CLIP`은 image-text alignment, `VisualEmbedding`은 좌표계와 전처리, `TopKSimilaritySearch`는 검색 단계, `DINOv2`는 texture/shape retrieval, `SigLIP`은 CLIP 대안 loss, `BiomedCLIP`은 도메인 특화 후보로 둔다. Defect Image RAG 글은 이 개념들을 조립해 실제 1,000장 이미지 DB에서 근거를 반환하는 운영 패턴에 집중한다.

## 관련 개념

- [[ImageRAG]] - 이미지 입력을 RAG 검색 대상으로 삼는 상위 패턴
- [[ComputerVision]] - 제조 검사 이미지 검색이 속한 상위 분야
- [[VisualEmbedding]] - 신규/기존 불량 이미지를 같은 벡터 공간에 놓는 단계
- [[TopKSimilaritySearch]] - 유사 과거 사례를 선택하는 검색 알고리즘
- [[CLIP]] - 텍스트 라벨과 이미지 의미를 함께 맞출 때의 기준 모델
- [[SigLIP]] - CLIP 대체 후보로 검토할 수 있는 이미지-텍스트 embedding 모델
- [[DINOv2]] - 오염의 시각적 texture와 shape 유사도를 볼 때 중요한 후보
- [[BiomedCLIP]] - 검사 이미지가 biomedical 성격일 때의 도메인 후보

## 소스

- [[raw/articles/image-rag-defect-retrieval.md]] - 사용자 요구와 관련 1차 논문 출처
