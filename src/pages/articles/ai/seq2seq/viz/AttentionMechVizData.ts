import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '한계: 고정 컨텍스트 벡터', body: '긴 문장도 하나의 벡터에 압축 — 앞부분 정보가 소실된다.' },
  { label: '인코더 은닉 상태 전부 보관', body: 'h₁=[0.8, 0.2], h₂=[0.1, 0.9], h₃=[0.5, 0.5]를 버리지 않고 전부 저장. 디코더가 매 스텝마다 참조.' },
  { label: '유사도 점수 계산', body: 'sₜ=[0.7, 0.3]과 각 hᵢ의 내적. s·h₁=0.62, s·h₂=0.34, s·h₃=0.50. 선 굵기 = 점수 크기.' },
  { label: '동적 컨텍스트 생성', body: 'softmax → 가중합: 0.42×[0.8,0.2] + 0.23×[0.1,0.9] + 0.34×[0.5,0.5] = [0.53, 0.46].' },
];

export const ENC_WORDS = ['Thank', 'you', '!'];
export const H_VECS = [[0.8, 0.2], [0.1, 0.9], [0.5, 0.5]];
export const S_VEC = [0.7, 0.3];
export const SCORES = [0.62, 0.34, 0.50];
export const MAX_SCORE = Math.max(...SCORES);
export const CTX_VEC = [0.53, 0.46];

export const H_C = '#6366f1';
export const S_C = '#10b981';
export const ATT_C = '#f59e0b';
export const ERR_C = '#ef4444';
