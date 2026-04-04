import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '<thinking> — CoT 추론 유도',
    body: '<thinking> 태그 안에서 단계별 추론을 작성하도록 지시\nChain-of-Thought(사고 연쇄)를 명시적으로 유도 → 복잡한 문제에서 정확도 상승',
  },
  {
    label: '<rules> + <constraints> — 행동 규칙 분리',
    body: '<rules> — 반드시 해야 할 것(MUST)\n<constraints> — 절대 하면 안 되는 것(NEVER)\n규칙과 제약을 태그로 분리하면 LLM이 둘 다 놓치지 않음',
  },
  {
    label: '중첩 태그 — 작업 분해',
    body: '<task> 안에 <subtask>를 배치하여 복잡한 작업을 계층적으로 분해\nXML의 핵심 장점 — JSON/Markdown으로는 이런 중첩이 어려움',
  },
  {
    label: '<user_input> — 프롬프트 인젝션 방지',
    body: '신뢰할 수 없는 사용자 입력을 <user_input> 태그로 격리\nLLM에게 "이 태그 안은 데이터, 태그 밖은 지시문"이라고 알림\n→ 인젝션 공격의 1차 방어선',
  },
];
