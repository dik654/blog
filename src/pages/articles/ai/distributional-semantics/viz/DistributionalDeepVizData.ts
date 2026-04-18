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
    label: '분포 가설: 맥락이 의미를 결정한다',
    body: '"You shall know a word by the company it keeps" — J.R. Firth (1957). 분포 의미론의 핵심 원리.\nHarris(1954) 분포 가설: 동일한 맥락에 출현하는 단어들은 유사한 의미를 가진다.\n예시: "고양이가 ___에 앉았다" / "강아지가 ___에 앉았다" → "소파", "매트" 등 동일 맥락 → 고양이 ≈ 강아지.\n반례: "은행에서 돈을 ___" / "강 은행에 ___" → "은행"의 두 의미가 다른 맥락 분포 → 다의어(polysemy) 문제.\n정적 임베딩(Word2Vec)은 다의어를 하나의 벡터로 표현 — 맥락별 의미 구분 불가.\n문맥 임베딩(BERT, GPT)이 이 한계를 해결: 동일 단어라도 주변 문맥에 따라 다른 벡터 생성.',
  },
  {
    label: 'PPMI: 우연 vs 의미적 동시발생 구분',
    body: 'PMI(w,c) = log₂(P(w,c) / (P(w)·P(c))). 독립 가정 대비 실제 동시발생 비율의 로그.\nPMI > 0: 기대 이상으로 자주 동시발생 (의미적 관련). PMI < 0: 기대 이하 (관련 없음). PMI = 0: 독립.\n예시: P("doctor")=0.001, P("hospital")=0.0005, P("doctor","hospital")=0.00005.\nPMI = log₂(0.00005 / (0.001×0.0005)) = log₂(100) ≈ 6.64. 높은 양의 연관.\nPPMI = max(PMI, 0): 음수값(비관련)을 0으로 처리. 이유 — 음수 PMI는 불안정(저빈도 단어쌍에서 노이즈).\n동시발생 행렬 M을 PPMI로 변환 → 각 행이 단어의 희소(sparse) 벡터 표현. SVD로 밀집 벡터로 축소.',
  },
  {
    label: '코사인 유사도: 벡터 사이 각도',
    body: 'cos(w₁, w₂) = (w₁ · w₂) / (||w₁|| × ||w₂||) = Σ w₁ᵢw₂ᵢ / (√Σw₁ᵢ² × √Σw₂ᵢ²).\n범위 [-1, 1]. cos=1: 동일 방향(완전 유사). cos=0: 직교(무관). cos=-1: 반대 방향(반의어 경향).\n왜 유클리드 거리 대신 코사인?: 빈도 높은 단어는 벡터 크기(norm)가 크지만 의미 유사도와 무관.\n코사인은 방향만 비교 → "the"(큰 벡터)와 "a"(큰 벡터)의 빈도 편향 제거.\n예시: cos("king","queen")≈0.73, cos("king","car")≈0.12, cos("king","king")=1.0.\n대안 유사도: 유클리드(크기 민감), Jaccard(이진 벡터), dot product(크기 포함, 추천 시스템에서 사용).',
  },
  {
    label: '분산 의미론의 진화: 통계 → 신경망',
    body: '1세대 (통계, 1990s): Term-Document Matrix → TF-IDF 가중 → LSA(Truncated SVD). 전역 통계, 일괄 계산.\n한계: V=10만이면 행렬 크기 10만×10만. 메모리 O(V²), SVD 계산 O(V²k). 증분 업데이트 불가.\n2세대 (신경망, 2013-2017): Word2Vec(2013, 예측 기반), GloVe(2014, 통계+예측 하이브리드), FastText(2016, 서브워드).\nWord2Vec의 혁신: O(V) softmax → O(k) NEG. 수십억 토큰 학습 가능. 벡터 산술 발견.\nLevy & Goldberg(2014): Skip-gram + NEG ≈ PPMI 행렬의 암묵적 인수분해. 통계 방법과 신경망 방법은 연결됨.\n3세대 (문맥, 2018+): BERT/GPT. 동일 "bank"라도 "river bank" vs "bank account"에서 다른 벡터. 다의어 해결.',
  },
];
