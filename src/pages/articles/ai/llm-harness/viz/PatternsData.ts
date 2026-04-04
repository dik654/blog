import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Routing — 의도 분류 → 전문 프롬프트 분기',
    body: '저비용 분류 모델로 의도 판단 → 전문 프롬프트로 분기',
  },
  {
    label: 'Guardrails — 입력 → 실행 → 출력 검증',
    body: '입력 sanitize → LLM 실행 → 출력 검증, 모델 앞뒤에 안전 계층 적용',
  },
  {
    label: 'Fallback Chain — 단계적 대체',
    body: '1차 모델 실패 시 자동으로 차선 모델 전환 — 가용성 99.9% 달성',
  },
  {
    label: 'Human-in-the-loop — 확신 낮으면 사람에게',
    body: '신뢰도 임계값 미만이면 사람 검토 큐로 전달 — 자동화와 품질의 균형',
  },
];

export const ROUTE_TARGETS = [
  { label: 'CS', color: '#6366f1' },
  { label: '기술', color: '#10b981' },
  { label: '영업', color: '#f59e0b' },
];
