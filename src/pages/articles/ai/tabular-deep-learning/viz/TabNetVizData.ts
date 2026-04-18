import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  attn: '#8b5cf6',
  feat: '#3b82f6',
  mask: '#f59e0b',
  output: '#10b981',
  shared: '#64748b',
  encoder: '#6366f1',
};

/* 어텐션 마스크 예시 값 */
export const MASK_STEP1 = [0.9, 0.1, 0.0, 0.8, 0.0, 0.2];
export const MASK_STEP2 = [0.1, 0.7, 0.6, 0.0, 0.5, 0.1];
export const FEATURE_NAMES = ['나이', '소득', '직업', '잔고', '지역', '거래수'];

export const STEPS: StepDef[] = [
  {
    label: 'TabNet 전체 구조 — Sequential Attention',
    body: '입력 피처를 여러 스텝에 걸쳐 순차적으로 처리. 각 스텝마다 어텐션 마스크로 피처 부분집합을 선택 → 선택된 피처만 인코더에 통과 → 결과를 누적하여 최종 예측.',
  },
  {
    label: 'Step 1: Attentive Transformer — 피처 마스크 생성',
    body: `이전 스텝의 처리 결과(a[i-1])를 FC + BN → sparsemax로 마스크 M[i] 생성.\nsparsemax: softmax와 달리 정확히 0인 값 허용 → 진정한 희소 선택.\n마스크 예시: [${MASK_STEP1.join(', ')}] — 나이(0.9), 잔고(0.8)만 강하게 선택.`,
  },
  {
    label: 'Step 2: 마스크가 바뀌며 다른 피처 주목',
    body: `이전 스텝에서 선택한 피처에 페널티(prior scales) 부여 — 동일 피처 반복 선택 방지.\n2번째 마스크: [${MASK_STEP2.join(', ')}] — 소득(0.7), 직업(0.6)으로 전환.\n인스턴스별로 다른 마스크 → 해석 가능성(interpretability) 내재.`,
  },
  {
    label: '자기지도 사전학습 (Self-Supervised Pretraining)',
    body: '입력 피처 일부를 마스킹(corruption) → TabNet 디코더로 복원하는 사전학습.\n레이블 없는 데이터로 피처 간 관계 학습. 파인튜닝 시 레이블 데이터 1/10만으로도 유사 성능 달성.',
  },
];
