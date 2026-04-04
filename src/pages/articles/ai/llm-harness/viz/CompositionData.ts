import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 시스템 프롬프트 — 역할 + 규칙',
    body: '모든 턴에서 LLM이 가장 먼저 읽는 고정 지시문\n역할("너는 고객 지원 봇"), 규칙("한국어만"), 제약("개인정보 금지")을 명시\n→ 모델의 기본 행동 범위를 고정',
  },
  {
    label: '② 도구 연결 — function calling',
    body: 'LLM이 외부 API/DB를 호출할 수 있도록 함수 스키마 제공\n모델이 "검색이 필요하다"고 판단하면 도구 호출 JSON 생성\n→ 하네스가 실제 함수 실행 후 결과를 다시 모델에 전달',
  },
  {
    label: '③ 가드레일 — 입력 검증 + 출력 필터',
    body: '입력 가드레일: 프롬프트 인젝션 탐지, 민감 정보 마스킹\n출력 가드레일: 금지 표현 필터, 톤 검증, PII(개인식별정보) 제거\n→ 모델 전후에 안전 계층 배치',
  },
  {
    label: '④ 출력 파서 — JSON 추출 + 스키마 강제',
    body: '모델 출력에서 구조화된 데이터 추출\nJSON 파싱, 필수 필드 검증, 타입 체크\n실패 시 재시도(retry) 또는 수동 정규식 폴백',
  },
  {
    label: '⑤ 폴백 — 재시도 + 대체 모델',
    body: '파싱 실패/타임아웃/레이트리밋 → 자동 재시도(최대 N회)\n반복 실패 → 대체 모델로 전환 (GPT-4o → Claude → 로컬)\n→ 단일 장애점(SPOF) 제거',
  },
];

export const PIPELINE = [
  { label: 'System\nPrompt', color: '#6366f1' },
  { label: 'Tools', color: '#10b981' },
  { label: 'LLM', color: '#6366f1' },
  { label: 'Guard\nrails', color: '#f59e0b' },
  { label: 'Parser', color: '#10b981' },
];
