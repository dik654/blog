import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '시퀀스를 직접 처리 — Transformer가 맥락을 학습한다',
    body: '집계 피처는 순서 정보를 압축하면서 일부 손실. Transformer는 시퀀스 자체를 입력으로 받아\nSelf-Attention으로 "어떤 이벤트가 어떤 이벤트와 관련 있는지"를 직접 학습.',
  },
  {
    label: '이벤트 → 토큰 변환 — 각 이벤트가 하나의 토큰',
    body: 'NLP에서 단어가 토큰이듯, 이벤트 시퀀스에서 각 이벤트가 하나의 토큰.\n이벤트의 수치형·범주형 필드를 합쳐 d_model 차원 벡터로 인코딩한다.',
  },
  {
    label: 'Self-Attention — 이벤트 간 상호 참조',
    body: 'Q, K, V로 분해 → 각 이벤트가 다른 모든 이벤트를 참조.\n"3번째 패스"가 "1번째 패스"와 높은 어텐션 → 같은 방향 빌드업 패턴 포착.\n어텐션 가중치 자체가 해석 가능한 정보를 제공.',
  },
  {
    label: 'CLS / 평균 풀링 — 시퀀스 대표 벡터 추출',
    body: '[CLS] 토큰: 시퀀스 앞에 더미 토큰 추가 → 최종 히든 상태가 시퀀스 대표 벡터.\n평균 풀링: 모든 토큰의 히든 상태 평균. 두 방법 모두 (batch, d_model) 형상.',
  },
  {
    label: '축구 패스 예측 아키텍처 — 전체 파이프라인',
    body: '입력: 최근 K개 패스 이벤트 (x, y, 선수, 타입, Δt)\n→ 이벤트 인코딩 → Transformer 레이어 ×N → CLS 풀링\n→ MLP 헤드 → (next_x, next_y) 예측.',
  },
];

export const COLORS = {
  token: '#6366f1',
  attention: '#ef4444',
  query: '#3b82f6',
  key: '#10b981',
  value: '#f59e0b',
  cls: '#8b5cf6',
  output: '#ec4899',
};
