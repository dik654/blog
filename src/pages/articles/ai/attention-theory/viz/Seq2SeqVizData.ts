import type { StepDef } from '@/components/ui/step-viz';

export const C = { enc: '#6366f1', dec: '#10b981', bottleneck: '#ef4444', attn: '#f59e0b' };

export const H_VECS = [[0.8, 0.2], [0.3, 0.7], [0.5, 0.5], [0.6, 0.4]];
export const CTX_VEC = [0.6, 0.4];
export const ATTN_WEIGHTS = [0.35, 0.10, 0.15, 0.40];

function fmtV(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(',')}]`; }

export const STEPS: StepDef[] = [
  { label: 'Seq2Seq: 인코더-디코더 구조', body: `각 인코더 LSTM이 은닉 상태 생성. h₁=${fmtV(H_VECS[0])}, h₂=${fmtV(H_VECS[1])}, h₃=${fmtV(H_VECS[2])}, h₄=${fmtV(H_VECS[3])}.` },
  { label: '정보 병목 문제 (Bottleneck)', body: `마지막 h₄=${fmtV(CTX_VEC)}만 디코더에 전달. h₁, h₂, h₃ 정보는 이 벡터 하나에 압축되어 손실.` },
  { label: '어텐션의 등장: 동적 참조', body: `모든 h에 가중치 [${ATTN_WEIGHTS.join(', ')}]를 곱해 합산. 매 디코더 스텝마다 다른 가중치 → 정보 손실 해결.` },
];
