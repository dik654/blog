import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Softmax 병목 -- V=100만이면 매번 100만 번 연산',
    body: 'Skip-gram 목적함수: L = Σ log P(c|w), 여기서 P(c|w) = exp(v_c\'·v_w) / Σ_{j=1}^{V} exp(v_j\'·v_w).\n분모의 정규화 상수 Z = Σ exp(v_j\'·v_w)가 어휘 전체 V개를 순회 — 매 학습 스텝마다 O(V) 연산.\nV=100만(Google News), D=300이면 분모 계산에만 3억 번 곱셈 — GPU에서도 수 초 소요.\n한 에포크에 수십억 개 (center, context) 쌍을 처리해야 하므로 full softmax는 현실적으로 불가능.\n해결책 두 가지: Negative Sampling(이진 분류로 변환)과 Hierarchical Softmax(트리 탐색으로 축소).',
  },
  {
    label: 'Negative Sampling -- 이진 분류로 변환, O(V) → O(k+1)',
    body: '핵심 아이디어: V-class 분류 → 이진 분류로 변환. "이 쌍이 진짜 동시발생인가?"만 판별.\nL_NEG = log σ(v_c · v_w) + Σ_{i=1}^{k} E_{w_i~P_n} [log σ(-v_{w_i} · v_w)].\nσ(x) = 1/(1+e^{-x}) — sigmoid 함수. 정답 쌍의 내적은 크게, 가짜 쌍의 내적은 작게 만듦.\nk = 5~20 (소규모 데이터), k = 2~5 (대규모). Mikolov 원논문 권장값: k=5 (대규모), k=15 (소규모).\n노이즈 분포: P_n(w) = freq(w)^{3/4} / Σ freq(w)^{3/4}. 지수 3/4가 핵심 — 균등(1.0)과 빈도(1.0) 사이 절충.\n"the"(빈도 6%) → 가중치 4.3%, "python"(빈도 0.001%) → 가중치 0.006%. 고빈도 단어의 지배력을 억제.',
  },
  {
    label: 'Hierarchical Softmax -- Huffman 트리로 O(log V)',
    body: '어휘 V개를 이진 트리 리프에 배치. 각 내부 노드 n에 파라미터 벡터 θ_n ∈ R^D 부여.\nP(w|context) = Π_{j=1}^{L(w)} σ(direction_j · θ_{n_j} · h). L(w)는 루트→리프 경로 길이.\ndirection_j = +1(좌) 또는 -1(우) — 각 분기에서 이진 결정. σ는 sigmoid.\nHuffman 코딩 적용 — 고빈도 "the"는 경로 3~4, 저빈도 "serendipity"는 경로 18~20.\nV=100만 → 평균 경로 ≈ log₂(10⁶) ≈ 20. full softmax 100만 번 vs HS 20번 — 50,000배 절감.\n단점: 트리 구조가 고정되어 GPU 병렬화 어려움 → 실무에서는 NEG가 더 많이 사용.',
  },
  {
    label: 'Subsampling -- 고빈도 단어 제외로 속도+품질 향상',
    body: '단어 w의 제거 확률: P(discard) = 1 - sqrt(t / f(w)). f(w)는 단어 빈도, t는 임계값(기본 1e-5).\n예시: "the"의 빈도 f=0.06이면 P(discard) = 1 - sqrt(1e-5/0.06) = 0.987 → 98.7% 확률로 제거.\n"python"의 빈도 f=1e-5이면 P(discard) = 0 → 절대 제거되지 않음.\n효과 1: 기능어("the","of","a")가 학습 쌍에서 대량 제거 → 의미 단어 간 학습 신호 증가.\n효과 2: 학습 속도 2~10배 향상 + 희귀 단어 표현 품질 개선 (Mikolov 2013 실험).\nt값 조절: t=1e-3(약한 제거)~1e-6(강한 제거). 기본 1e-5가 속도-품질 균형점.',
  },
  {
    label: '연산 비용 전체 비교',
    body: '한 학습 스텝당 연산량 (V=100만, k=5, D=300):\nFull Softmax: V×D = 3억 곱셈. Negative Sampling: (k+1)×D = 1,800 곱셈. Hierarchical Softmax: log₂V×D ≈ 6,000 곱셈.\nNEG가 full softmax 대비 약 170,000배 빠름. HS는 50,000배 빠르지만 트리 구조가 GPU 캐시에 불리.\n품질 비교 (Google Analogy): Full Softmax ≈ NEG > HS. NEG는 정확도 거의 동등하면서 구현이 단순.\nNEG의 추가 장점: 미니배치 병렬화 용이, 학습률 스케줄링 단순, 디버깅 직관적.\n결론: Skip-gram + NEG(k=5) + Subsampling(t=1e-5)이 Word2Vec의 사실상 표준 구성.',
  },
];

export const COLORS = {
  softmax: '#ef4444',
  neg: '#6366f1',
  hs: '#f59e0b',
  sub: '#10b981',
  dim: '#94a3b8',
  accent: '#8b5cf6',
};
