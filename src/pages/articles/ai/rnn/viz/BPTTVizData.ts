import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Unroll — 시간축 펼침',
    body: '순환 구조를 T개 층으로 펼쳐 동일 가중치 공유.',
  },
  {
    label: '② 역전파 — 시간축 역방향 기울기 전파',
    body: '∂L/∂W를 시간 역방향으로 h_t→h_{t-1} 추적.',
  },
  {
    label: '③ 기울기 문제 — 소실 vs 폭발',
    body: '고유값 < 1이면 소실, > 1이면 폭발.',
  },
  {
    label: '④ 해결 — Truncated BPTT + Clipping',
    body: 'k단계 절단 역전파 + 기울기 크기 클리핑.',
  },
];

export const FWD_C = '#6366f1';
export const BWD_C = '#ef4444';
export const CLIP_C = '#10b981';
