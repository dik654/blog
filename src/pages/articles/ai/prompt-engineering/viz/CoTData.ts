import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '직접 답변 — 오류 발생',
    body: '질문: "Roger has 5 balls. He buys 2 more cans of 3. How many?"\nLLM 직접 답변: "9개" (오답)\n복잡한 문제에서 중간 과정 없이 바로 답하면 오류율 급증',
  },
  {
    label: 'Zero-shot CoT — "단계별로 생각해"',
    body: '프롬프트 끝에 "Let\'s think step by step" 한 줄 추가\nLLM이 자동으로 풀이 과정 생성 → 5 + (2×3) = 11 (정답)\nGSM8K 벤치마크에서 정확도 40% → 70% 향상 (Kojima et al., 2022)',
  },
  {
    label: 'Few-shot CoT — 풀이 예시 제공',
    body: '완전한 풀이 과정이 담긴 예시 2~3개를 프롬프트에 포함\n예시: "Q: ... A: 먼저 ~를 계산 → 다음 ~를 더함 → 답: 11"\nLLM이 예시 패턴을 따라 추론 — Zero-shot CoT보다 더 안정적',
  },
  {
    label: 'Self-Consistency — 다수결 투표',
    body: 'CoT를 여러 번(5~10회) 실행 → 각기 다른 풀이 경로 생성\n최종 답을 다수결로 선택 — 가장 빈번한 답 = 정답 확률 높음\n비용↑ 정확도↑ 트레이드오프 — 높은 정확도가 필수인 작업에 적합',
  },
];

export const COT_ROWS = [
  { label: 'Direct', accuracy: 35, color: '#6366f180' },
  { label: 'Zero-CoT', accuracy: 70, color: '#f59e0b' },
  { label: 'Few-CoT', accuracy: 82, color: '#10b981' },
  { label: 'Self-Con', accuracy: 90, color: '#6366f1' },
];
