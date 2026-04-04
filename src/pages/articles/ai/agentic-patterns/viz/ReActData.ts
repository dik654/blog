import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'ReAct = Reasoning + Acting 교차',
    body: '추론(Think)과 행동(Act)을 한 루프에 결합해 명시적으로 반복한다.',
  },
  {
    label: 'Think — 중간 추론을 텍스트로 생성',
    body: 'LLM이 추론 과정을 명시적으로 출력해 행동 근거를 추적할 수 있다.',
  },
  {
    label: 'Act — 도구 호출로 정보 수집',
    body: 'Think에서 결정한 행동을 도구 호출로 실행한다.',
  },
  {
    label: 'Observe — 결과를 보고 다시 Think',
    body: '도구 결과를 컨텍스트에 추가하고 다음 행동을 결정한다.',
  },
  {
    label: '한계: 단일 경로, 긴 태스크에서 드리프트',
    body: '단일 경로 탐색이라 긴 태스크에서 목표 이탈(drift)이 발생한다.',
  },
];

export const PHASES = [
  { label: 'Think', color: '#6366f1', x: 80 },
  { label: 'Act', color: '#f59e0b', x: 230 },
  { label: 'Observe', color: '#10b981', x: 380 },
];

export const EXAMPLES: Record<number, { think: string; act: string; observe: string }> = {
  1: { think: '"서울 날씨를 검색해야 한다"', act: '', observe: '' },
  2: { think: '', act: 'search("서울 현재 날씨")', observe: '' },
  3: { think: '', act: '', observe: '{"temp":"18°C","condition":"맑음"}' },
};
