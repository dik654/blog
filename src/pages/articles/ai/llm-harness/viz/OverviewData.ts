import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '모델 단독 ≠ 제품',
    body: 'GPT-4o, Claude — 아무리 좋은 모델이라도 API 호출만으로는 제품이 아님\n환각, 형식 깨짐, 보안 구멍이 사용자에게 그대로 노출',
  },
  {
    label: '하네스(Harness) = 모델을 감싸는 시스템',
    body: '말 안장(harness) 비유 — 말의 원시 능력을 제어 가능한 형태로 변환\nLLM 하네스 = 시스템 프롬프트 + 도구 + 가드레일 + 출력 파서 + 평가를 하나로 묶은 래퍼',
  },
  {
    label: '하네스의 5대 구성 요소',
    body: '① 시스템 프롬프트 — 역할과 규칙 고정\n② 도구 연결 — function calling으로 외부 세계 접근\n③ 가드레일 — 입력 검증 + 출력 필터\n④ 출력 파서 — JSON 추출, 스키마 강제\n⑤ 평가 — 자동 테스트 + 메트릭 추적',
  },
  {
    label: '하네스 엔지니어링',
    body: '5개 요소를 설계·조합·반복 개선하는 기술\n모델을 바꾸는 것보다 하네스를 개선하는 것이 더 빠르고 효과적',
  },
];

export const HARNESS_PARTS = [
  { label: 'Prompt', short: 'SYS', color: '#6366f1' },
  { label: 'Tools', short: 'TOOL', color: '#10b981' },
  { label: 'Guard', short: 'GRD', color: '#f59e0b' },
  { label: 'Parser', short: 'PRS', color: '#6366f1' },
  { label: 'Eval', short: 'EVL', color: '#10b981' },
];
