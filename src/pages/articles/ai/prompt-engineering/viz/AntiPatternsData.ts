import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '❌ 과도한 지시 — 길수록 좋은 건 아님',
    body: '500+ 토큰 지시 → 핵심이 노이즈에 묻힘, 규칙 3~5개가 최적',
  },
  {
    label: '❌ 모호한 역할 정의',
    body: '"도움이 되는 어시스턴트" → 모호, 역할+행동 기준을 구체적으로 명시',
  },
  {
    label: '❌ 네거티브 프롬프트의 함정',
    body: '"~하지 마"가 해당 개념을 활성화 — "~해" 형태의 긍정 지시로 전환',
  },
  {
    label: '❌ 컨텍스트 오염',
    body: '긴 대화에서 초기 지시 희석 — 중요 지시 재주입 또는 요약 후 리셋',
  },
];

export const ANTI_ITEMS = [
  { label: '과도한 지시', icon: '📏', color: '#ef4444' },
  { label: '모호한 역할', icon: '🌫️', color: '#ef4444' },
  { label: '네거티브 PT', icon: '🚫', color: '#ef4444' },
  { label: '컨텍스트 오염', icon: '🔄', color: '#ef4444' },
];
