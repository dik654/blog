import type { StepDef } from '@/components/ui/step-viz';

/** hex colors only */
export const C = {
  cls: '#8b5cf6',    // CLS 토큰 — 보라
  mean: '#2563eb',   // 평균 풀링 — 파랑
  token: '#64748b',  // 일반 토큰 — 슬레이트
  bad: '#ef4444',    // 문제점 — 빨강
  good: '#10b981',   // 장점 — 초록
};

export const TOKENS = ['[CLS]', '나는', '오늘', '학교에', '갔다', '[SEP]'];
export const HIDDEN_DIM = 768;

export const STEPS: StepDef[] = [
  {
    label: 'BERT 출력: 토큰별 히든 스테이트',
    body: `입력 토큰 ${TOKENS.length}개 → BERT 12층 통과 → 각 토큰마다 ${HIDDEN_DIM}차원 벡터 출력.\n[CLS]는 문장 시작 특수 토큰, [SEP]는 문장 끝 구분 토큰.`,
  },
  {
    label: '[CLS] 토큰 풀링: 첫 토큰만 사용',
    body: `BERT 사전학습의 NSP(Next Sentence Prediction) 태스크가 [CLS] 위에 분류 헤드를 올림.\n그래서 [CLS]가 "문장 대표"로 쓰이지만, NSP는 두 문장 관계 판별용이라 의미 유사도와는 거리가 멀다.`,
  },
  {
    label: '평균 풀링: 모든 토큰 벡터의 평균',
    body: `모든 토큰 벡터를 element-wise 평균 → 문장 벡터.\n[CLS]보다 안정적이지만, 빈도 높은 불용어("은/는/이/가")가 평균을 지배하는 문제 발생.`,
  },
  {
    label: 'BERT 임베딩의 근본 한계',
    body: `Reimers & Gurevych (2019): BERT [CLS] 임베딩 간 cosine similarity로 STS 벤치마크 측정 → GloVe 평균보다도 낮은 성능.\n원인: BERT는 "두 문장을 함께 넣고 비교"하도록 학습됨 — 개별 문장을 독립적으로 인코딩하는 용도가 아님.\n10,000개 문장 쌍 비교 시 cross-encoder는 O(n²) = 약 65시간, 문장 임베딩은 O(n) = 약 5초.`,
  },
];
