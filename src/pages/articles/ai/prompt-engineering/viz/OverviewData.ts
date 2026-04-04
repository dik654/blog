import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '같은 모델, 다른 프롬프트 → 다른 결과',
    body: '"수도 알려줘" → "한국의 수도는 서울입니다"\n"대한민국의 수도를 영문 JSON으로 출력" → {"country":"South Korea","capital":"Seoul"}\n프롬프트 = LLM의 프로그래밍 인터페이스',
  },
  {
    label: '프롬프트 엔지니어링이란',
    body: 'LLM에서 원하는 출력을 이끌어내기 위해 입력(프롬프트)을 체계적으로 설계하는 기술\n모델 파라미터를 바꾸지 않고 입력만으로 성능을 끌어올리는 유일한 방법',
  },
  {
    label: '4가지 핵심 기법',
    body: '① Zero-shot — 예시 없이 지시만으로 수행\n② Few-shot — 입출력 예시 제공으로 패턴 학습\n③ Chain-of-Thought — 추론 과정을 유도해 정확도 향상\n④ Structured Output — JSON·XML 등 파싱 가능한 형식 지정',
  },
  {
    label: '프롬프트 = 코드, LLM = 인터프리터',
    body: '프롬프트를 잘 쓰는 것은 코드를 잘 쓰는 것과 같은 원리\n명확한 지시 → 명확한 결과 / 모호한 지시 → 예측 불가한 결과\n기법을 조합해 원하는 출력을 정밀 제어',
  },
];

export const TECHNIQUES = [
  { label: 'Zero-shot', short: '0', color: '#6366f1' },
  { label: 'Few-shot', short: 'F', color: '#10b981' },
  { label: 'CoT', short: 'C', color: '#f59e0b' },
  { label: 'Structured', short: 'S', color: '#6366f1' },
];
