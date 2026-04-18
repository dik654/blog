import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  hi: '#6366f1',
  ok: '#10b981',
  warn: '#ef4444',
  gold: '#f59e0b',
  m: 'var(--muted-foreground)',
};

export const STEPS: StepDef[] = [
  {
    label: 'Truncated SVD: 상위 k개만 유지',
    body: 'SVD: M = UΣVᵀ. M ∈ R^{V×V}(PPMI 행렬), U ∈ R^{V×V}, Σ ∈ R^{V×V}(대각), Vᵀ ∈ R^{V×V}.\nTruncated SVD: M_k = U_k · Σ_k · V_kᵀ. 상위 k개 특이값만 유지. σ₁ ≥ σ₂ ≥ ... ≥ σ_k.\nU_k ∈ R^{V×k} — 각 행 u_i ∈ R^k가 단어 i의 밀집 임베딩. V=10만 → k=300으로 333배 압축.\nEckart-Young 정리: ||M - M_k||_F를 최소화하는 rank-k 행렬이 정확히 Truncated SVD.\n실무 변형: U_k · Σ_k^{0.5}를 임베딩으로 사용 (특이값의 제곱근 가중). Levy et al.(2015) 권장.\nLSA(Latent Semantic Analysis): Term-Document 행렬에 동일한 SVD 적용. 동의어/다의어 간접 처리.',
  },
  {
    label: '계산 복잡도와 대안 알고리즘',
    body: 'Naive SVD: O(V³). V=10만이면 10^{15} 연산 — 수 시간~수 일. 메모리도 O(V²) = 80GB(float64).\nSparse SVD(Lanczos/Arnoldi): O(nnz·k·iter). nnz=비영 원소 수. PPMI 행렬은 99%+ 0이라 nnz << V².\nRandomized SVD(Halko 2011): O(V·k·q). q=2~5 반복. scikit-learn의 TruncatedSVD 기본 알고리즘. 매우 빠름.\nPCA: 공분산 행렬의 고유분해. SVD와 수학적 등가. 중심화(centering) 여부 차이.\nNMF(Non-negative Matrix Factorization): M ≈ W·H, W≥0, H≥0. 비음수 제약 → 해석 가능한 "토픽" 추출.\nt-SNE/UMAP: 고차원→2D/3D 비선형 축소. 시각화 전용 — 축소된 좌표로 유사도 계산하면 안 됨(거리 왜곡).',
  },
  {
    label: 'k=300의 의미: 정보와 노이즈의 균형',
    body: '특이값 스펙트럼: σ₁ >> σ₂ > σ₃ > ... 상위 특이값은 의미 구조, 하위는 노이즈/빈도 편향.\nk 너무 작으면(k=10): 핵심 의미 차원 소실. Analogy 정확도 30%. 동의어도 구분 어려움.\nk 너무 크면(k=5000): 희소 노이즈까지 보존. 과적합 + 차원의 저주(curse of dimensionality).\n경험적 최적점: WS353 유사도, Google Analogy 기준으로 k=200~300에서 최고 성능.\nWord2Vec도 기본 D=300 — Levy & Goldberg(2014): PPMI+SVD(k=300) ≈ Word2Vec(D=300) 성능 유사.\n구조적 이유: 자연어의 의미 공간이 약 200~500차원의 본질적 차원을 가진다는 가설. 언어 보편적 현상.',
  },
  {
    label: '통계 방법 vs 신경망 방법 비교',
    body: 'SVD/LSA: 전역 통계 한 번에 캡처. 일괄 계산(배치). 결정론적(같은 입력 → 같은 결과). 수학적 해석 가능.\n단점: 새 문서 추가 시 전체 재계산. 증분 업데이트 불가. 메모리 O(V²).\nWord2Vec: 지역 맥락 윈도우(window=5). SGD로 반복 학습. 확률적(랜덤 초기화, 배치 순서).\n장점: 온라인 학습 가능. 메모리 O(V·D). 수십억 토큰 처리 가능. 벡터 산술 성질.\nGloVe(Pennington 2014): J = Σ f(X_ij)(w_i·w_j + b_i + b_j - log X_ij)². 동시발생 통계 + SGD 최적화.\nGloVe가 SVD와 Word2Vec의 장점 결합 — 전역 통계를 활용하되 SGD로 효율적 학습. 실무 성능 동등.',
  },
];
