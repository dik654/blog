import type { StepDef } from '@/components/ui/step-viz';

export const LAYER_C = '#6366f1';
export const GUARD_C = '#10b981';
export const SAFE_C = '#ef4444';
export const MODEL_C = '#f59e0b';

export const LAYER_STEPS: StepDef[] = [
  { label: 'Layer 1-2: Role + Context', body: '[Layer 1] Role & Identity\n"경험 많은 Python 백엔드 엔지니어"\n"10년차 데이터 사이언티스트, ML 설계 전문"\n→ 페르소나 설정, 전문성 확립\n\n[Layer 2] Context & Background\n"사용자는 스타트업 CTO, 프로덕션 조언 원함"\n"e-commerce 도메인, Python/FastAPI 스택"\n→ 배경 정보, 사용자 프로필' },
  { label: 'Layer 3-5: Task + Rules + Format', body: '[Layer 3] Task Instructions\n"1. 문제 재정의 → 2. 2개+ 해결책 → 3. trade-off → 4. 권장"\n→ 명확한 task breakdown\n\n[Layer 4] Constraints & Rules\n"한국어 응답, 실행 가능 코드, 추측 금지"\n→ 제약 조건\n\n[Layer 5] Output Format\n"## 문제 분석 / ## 해결책 1 (Pros/Cons) / ..."\n→ 출력 구조 명시' },
  { label: '실전 예시 (Claude XML 방식)', body: '<system>\n  <background>beginner programmer, CLI tools</background>\n  <tasks>1. 개념 설명 2. 실행 예제 3. 다음 단계</tasks>\n  <rules>간단한 언어, 고급 주제 금지, 코드 검증</rules>\n  <format>## 개념 / ## 예제 / ## 다음 단계</format>\n</system>\n\nXML 태그: 섹션 경계 명확, Claude 최적화, 중첩 구조 가능' },
];

export const GUARD_STEPS: StepDef[] = [
  { label: 'Positive Framing + Refusal Triggers', body: '① Positive Framing\nBad: "개인정보 출력 금지" → 해당 개념 activation\nGood: "공개 가능한 정보만 포함"\n\n② Refusal Triggers\n"다음 경우 응답 거부: 프라이버시 침해, 불법 조언, 폭력/자해"' },
  { label: 'Scope + Citation + Jailbreak 방어', body: '③ Scope Limitation\n"이 시스템은 Python 코딩만 다룹니다. 범위 외 = 거부"\n④ Citation Requirement\n"모든 주장은 소스 인용 필수. 출처 없으면 \'확실치 않음\'"\n\nJailbreak 방어: 역할 고수(persona drift 방지), 매 턴 검증, Red-teaming\nPrompt Injection: XML 태그로 사용자 입력 구분, 출력 검증' },
  { label: '모델별 차이', body: 'GPT-4: markdown, JSON mode — Structured Output API로 강제\nClaude: XML tags, longer context — 학습 데이터에 최적화\nGemini: structured output — 기본 JSON 지원\nLLaMA/OSS: prompt engineering 더 세심 — 스키마+예시 필수\n\nFormat Enforcement:\n"응답은 반드시 JSON. 스키마: {answer: string, confidence: number}"' },
];
