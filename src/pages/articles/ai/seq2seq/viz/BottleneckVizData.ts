import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '짧은 문장: 정확한 번역', body: '10단어 이하 — 컨텍스트 벡터에 정보가 충분히 담긴다. BLEU 30+.' },
  { label: '긴 문장: 정확도 급감', body: '20단어 이상 — 고정 크기 벡터에 모든 정보를 압축할 수 없다. 앞부분 정보 손실.' },
  { label: '해결: Attention 메커니즘', body: '디코더가 매 시간 단계마다 인코더의 모든 은닉 상태를 참조 → 동적 컨텍스트.' },
];

/** BLEU-like accuracy data points */
export const POINTS = [
  { len: 5, acc: 35 }, { len: 10, acc: 33 },
  { len: 15, acc: 28 }, { len: 20, acc: 22 },
  { len: 25, acc: 15 }, { len: 30, acc: 10 },
  { len: 35, acc: 7 }, { len: 40, acc: 5 },
];

export const ATTN_POINTS = [
  { len: 5, acc: 36 }, { len: 10, acc: 35 },
  { len: 15, acc: 34 }, { len: 20, acc: 32 },
  { len: 25, acc: 30 }, { len: 30, acc: 28 },
  { len: 35, acc: 26 }, { len: 40, acc: 24 },
];

export const LINE_C = '#6366f1';
export const ATTN_C = '#10b981';
export const AXIS_C = '#94a3b8';
