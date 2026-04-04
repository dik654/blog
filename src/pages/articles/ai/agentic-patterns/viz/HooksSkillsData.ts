import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Hooks: 에이전트 생명주기에 끼어드는 콜백',
    body: 'Hook = 에이전트 실행 시점에 자동 실행되는 가드레일 함수',
  },
  {
    label: 'Hooks 활용: 가드레일과 관찰 가능성',
    body: '에이전트 코드 수정 없이 차단·로깅·변환을 훅으로 제어',
  },
  {
    label: 'Skills: 재사용 가능한 프롬프트 단위',
    body: 'Skill = 프롬프트 + 도구 + 출력 형식을 묶은 재사용 가능한 능력 단위',
  },
  {
    label: 'Hooks + Skills = 안전하고 확장 가능한 에이전트',
    body: 'Hooks(안전 제어)와 Skills(기능 확장)를 독립적으로 조합하는 패턴',
  },
];

export const HOOKS = [
  { label: 'pre-tool', color: '#f59e0b', y: 30 },
  { label: 'post-tool', color: '#f59e0b', y: 65 },
  { label: 'pre-msg', color: '#10b981', y: 100 },
  { label: 'post-msg', color: '#10b981', y: 135 },
];

export const SKILLS = [
  { label: 'Code Review', color: '#6366f1' },
  { label: 'Translate', color: '#10b981' },
  { label: 'Summarize', color: '#f59e0b' },
];
