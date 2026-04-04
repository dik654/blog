import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 스킬 선택 → 파라미터 추출',
    body: '사용자 메시지에서 의도(intent) 파악 → 스킬 매칭\n메시지와 컨텍스트에서 파라미터 값 자동 추출\n예: "Python 코드 리뷰해줘" → language=Python',
  },
  {
    label: '② 프롬프트 조립',
    body: '스킬 바디의 {{param}} 플레이스홀더에 추출값 주입\n시스템 프롬프트 + 스킬 프롬프트 + 사용자 컨텍스트 결합\n→ 완성된 프롬프트가 LLM에게 전달',
  },
  {
    label: '③ 서브에이전트 패턴',
    body: '스킬이 독립 에이전트(sub-agent)로 실행\n메인 에이전트의 컨텍스트와 격리 — 토큰 오염 방지\n별도 컨텍스트 윈도우에서 작업 후 결과만 반환',
  },
  {
    label: '④ 도구 권한 제한',
    body: '스킬별로 허용되는 도구(tool) 목록 지정 가능\n코드 리뷰 스킬 — 파일 읽기만 허용, 쓰기 금지\n번역 스킬 — 외부 도구 불필요, LLM만 사용\n→ 최소 권한 원칙(Least Privilege)으로 안전성 확보',
  },
];

export const PIPELINE = [
  { label: '스킬 선택', color: '#6366f1', icon: '?' },
  { label: '파라미터 추출', color: '#6366f1', icon: '{}' },
  { label: '프롬프트 조립', color: '#10b981', icon: '⊕' },
  { label: 'LLM 호출', color: '#10b981', icon: '▶' },
  { label: '결과 처리', color: '#f59e0b', icon: '✓' },
];
