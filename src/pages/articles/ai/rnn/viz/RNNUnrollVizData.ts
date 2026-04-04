import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '순환 구조: h가 자기 자신에게 되돌아감', body: '은닉 상태 h가 다음 시간 단계로 전달 — 루프 표현' },
  { label: '시간축으로 펼치기 (Unroll)', body: '루프를 시간 단계별로 복사 — 깊은 네트워크로 변환' },
  { label: '가중치 공유 확인', body: 'W_h, W_x가 모든 시간 단계에서 동일 — 파라미터 수 일정' },
  { label: '실제 h 값 전파 추적', body: 'h₀ = [0, 0] 초기 상태에서 시작.\ntanh(W_h·h + W_x·x) 계산으로 각 시간 단계마다 벡터가 갱신된다.' },
];

export const TOKENS = ['나는', '학교에', '간다'];
export const RNN_C = '#6366f1';
export const HIDDEN_C = '#10b981';
export const INPUT_C = '#f59e0b';
