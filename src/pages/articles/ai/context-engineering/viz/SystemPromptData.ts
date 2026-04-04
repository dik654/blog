import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 역할 정의 (Role)',
    body: '"당신은 ~한 전문가"로 LLM의 페르소나(persona) 설정\n역할을 명확히 할수록 응답 품질 상승 — 모호한 역할은 모호한 출력을 낳음',
  },
  {
    label: '② 행동 규칙 (Rules)',
    body: '반드시 해야 할 것(MUST) + 절대 하면 안 되는 것(NEVER)\nGood: "항상 한국어 응답" / Bad: "적절히 응답"',
  },
  {
    label: '③ 출력 형식 (Format)',
    body: 'JSON, Markdown, 코드 등 구조화된 포맷 명시\n파싱 가능한 출력 = 자동화 파이프라인 연동의 핵심',
  },
  {
    label: '④ Few-shot 예시',
    body: '입력-출력 쌍 2~3개로 패턴 학습\n0-shot 대비 정확도 크게 향상 — 특히 복잡한 추론 작업에서 효과적',
  },
  {
    label: '⑤ 가드레일 (Guardrails)',
    body: '안전 제약: "개인정보 출력 금지", "확실하지 않으면 모른다고 답변"\n방어적 프롬프팅 — 탈옥(jailbreak) 시도에 대한 1차 방어선',
  },
];

export const LAYERS = [
  { label: 'Role', color: '#6366f1', y: 20 },
  { label: 'Rules', color: '#6366f1', y: 60 },
  { label: 'Format', color: '#10b981', y: 100 },
  { label: 'Few-shot', color: '#10b981', y: 140 },
  { label: 'Guardrails', color: '#f59e0b', y: 180 },
];
