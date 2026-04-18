import type { StepDef } from '@/components/ui/step-viz';

export const JSON_C = '#6366f1';
export const XML_C = '#10b981';
export const FC_C = '#f59e0b';
export const TIP_C = '#ef4444';

export const STRATEGY_STEPS: StepDef[] = [
  {
    label: 'JSON Schema 지정 — 자연어 vs 스키마 vs 예시',
    body: '① 자연어: "name (string), revenue (number), founded (integer)"\n② JSON Schema: {"type":"object","properties":{...},"required":[...]}\n③ 예시 포함 (권장): 실제 출력 예시 1개 제공\n예시 있으면 준수율 50% → 95%+ — 가장 효과적인 단일 개선책',
  },
  {
    label: 'XML 태그 방식 (Claude 권장)',
    body: '<response>\n  <name>Apple</name>\n  <revenue>394328</revenue>\n  <founded>1976</founded>\n</response>\n\n장점: 파싱 견고성 (JSON 이스케이프 문제 없음)\nClaude에 최적화, 긴 텍스트 섞여도 추출 용이',
  },
  {
    label: 'Function Calling (OpenAI 2023-2024)',
    body: 'API 레벨에서 스키마 강제 — JSON mode\nStructured Output (2024): 100% 스키마 준수\nfunctions 파라미터로 도구 정의 → LLM이 자동 호출\n\n파싱 안정성 4단계:\n① try/except 감싸기 → ② Pydantic 검증\n③ Failed parse → retry with error message\n④ Guardrails/Instructor 라이브러리 활용',
  },
];

export const BEST_STEPS: StepDef[] = [
  {
    label: '실무 팁 5가지',
    body: '① 명확한 경계: "JSON만 출력, 다른 텍스트 금지"\n② 필드 타입 명시: string, number, boolean, null 허용 여부\n③ 예시 하나 이상: 준수율 50% → 95%+\n④ 에러 케이스: "정보 부족 시 {error: missing_data}"\n⑤ 필수/선택 구분: "name (required), description (optional)"',
  },
  {
    label: '복잡한 스키마 + 프롬프트 템플릿',
    body: '중첩 스키마 예시:\n{analysis: {summary, sentiment, confidence, keywords[], metadata{}}}\n\n프롬프트 템플릿:\nSystem → JSON 스키마 따라 응답, 마크다운 금지\nSchema → {schema}\nExample → {example}\nInput → {user_input}\nOutput → {JSON}',
  },
  {
    label: '모델별 특성',
    body: 'OpenAI GPT-4: JSON mode (2023+), Structured Output (2024)\n→ API 레벨 강제, 100% 준수\n\nClaude: XML 권장, JSON도 지원\n→ XML 태그가 학습 데이터에 최적화\n\nGemini: 기본 JSON 지원\nLLaMA/OSS: 세심한 프롬프트 필요 — 스키마 + 예시 필수',
  },
];
