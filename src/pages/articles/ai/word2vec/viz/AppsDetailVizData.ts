import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '검색 & 분류 -- 임베딩을 feature로 활용하는 핵심 응용',
    body: 'Semantic Search: 쿼리 q → 임베딩 v_q ∈ R^D → Vector DB(FAISS, Pinecone)에서 cosine top-k 검색.\nRAG 핵심 구조: 문서 청크 임베딩 사전 저장 → 쿼리 시 유사 청크 검색 → LLM 컨텍스트로 주입.\n분류 파이프라인: 문장 내 단어 임베딩 평균 → v_doc ∈ R^300 → SVM/로지스틱 회귀 → 라벨.\n감정 분석 예시: "영화가 지루했다" → 임베딩 평균 → 부정(0.92). BoW 대비 F1 3~8%p 향상.\n의도 분류(챗봇): 사용자 발화 임베딩 → 사전 정의 의도 벡터와 cosine 비교 → 가장 유사한 의도 반환.\nWord2Vec 임베딩이 2013~2018 NLP 파이프라인의 표준 입력 — BERT 이전 시대의 핵심 인프라.',
  },
  {
    label: '클러스터링 & 추천 -- 유사 그룹화와 개인화',
    body: '클러스터링: 단어/문서 임베딩에 K-means(k=50~500) 적용 → 의미 그룹 자동 발견.\n예시: "king","queen","prince" → 왕족 클러스터, "python","java","rust" → 프로그래밍 클러스터.\nDBSCAN(eps=0.3, min_samples=5): 밀도 기반 — 클러스터 수를 사전 지정하지 않아 탐색적 분석에 적합.\n추천 시스템: user embedding u ∈ R^D, item embedding v ∈ R^D → score = u · v (dot product).\nYouTube DNN(2016): 시청 이력의 임베딩 평균 → 사용자 벡터 → 수백만 비디오 중 top-k 후보 추출.\nMatrix Factorization과의 관계: MF의 user/item 잠재 벡터 = 사실상 임베딩. Word2Vec이 MF의 일반화.',
  },
  {
    label: '번역 & 이상 탐지 -- 크로스링구얼과 이상치 탐지',
    body: 'Cross-lingual embedding: 두 언어의 벡터 공간을 선형 변환 W로 정렬. W* = argmin ||WX - Y||_F.\nMikolov(2013): 영어-스페인어 5000 쌍으로 W 학습 → 나머지 단어 번역 정확도 33%. 후속 연구에서 60%+.\nmBERT/XLM-R: 100+ 언어를 하나의 공간에 매핑 → zero-shot 크로스링구얼 전이.\n이상 탐지: 정상 데이터 임베딩의 centroid μ와 공분산 Σ 학습. Mahalanobis 거리 d = sqrt((x-μ)ᵀΣ⁻¹(x-μ)).\n임계값 τ 초과 시 이상 판정. 금융 사기 탐지, 네트워크 침입 감지, 제조 불량 검출에 활용.\n장점: 라벨 불필요(비지도), 정상 패턴만으로 학습 → 신종 이상도 감지 가능.',
  },
  {
    label: '품질 평가 -- Intrinsic vs Extrinsic',
    body: 'Intrinsic 평가 — 임베딩 자체의 품질을 직접 측정:\nWord Similarity: WS353 데이터셋 — 인간 유사도 점수 vs cosine similarity의 Spearman 상관계수. Word2Vec ρ≈0.70.\nAnalogy: "a:b = c:?" 형식. Google Analogy(19,544쌍), BATS(99,200쌍). argmax cos(v_b-v_a+v_c, v_d).\nt-SNE/UMAP 시각화: 300차원 → 2차원 축소. 의미 클러스터가 시각적으로 확인되면 품질 양호.\nExtrinsic 평가 — downstream task에서 성능 측정:\nNER(CoNLL-2003), 감정분석(SST-2), 질의응답(SQuAD). 사전학습 임베딩 사용 시 +2~5%p 향상이 일반적.\nGLUE 벤치마크(2018): 8개 NLU task 종합. Word2Vec+BiLSTM ≈ 70, ELMo ≈ 79, BERT ≈ 87.',
  },
];

export const COLORS = {
  search: '#6366f1',
  classify: '#f59e0b',
  cluster: '#10b981',
  translate: '#8b5cf6',
  anomaly: '#ef4444',
  dim: '#94a3b8',
};
