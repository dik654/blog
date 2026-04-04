import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'JSON 스키마 지정',
    body: '원하는 JSON 구조를 명시하면 LLM이 파싱 가능한 출력을 생성한다.',
  },
  {
    label: 'XML 태그로 섹션 분리',
    body: 'XML 태그로 추론과 결과를 분리 추출할 수 있다.',
  },
  {
    label: '마크다운 헤더 구조화',
    body: '헤더 계층으로 정보 구조를 강제해 섹션별 파싱이 용이하다.',
  },
  {
    label: '실패 패턴과 방지법',
    body: '예시 1개 + 간결한 스키마를 포함하면 구조 준수율이 95%+다.',
  },
];

export const FORMATS = [
  { label: 'JSON', icon: '{ }', color: '#6366f1' },
  { label: 'XML', icon: '< />', color: '#10b981' },
  { label: 'MD', icon: '# H', color: '#f59e0b' },
];
