import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 스킬 디렉토리 스캔',
    body: '에이전트 시작 시 .skills/ 디렉토리를 재귀 탐색\n각 SKILL.md 파일의 YAML 프론트매터만 파싱\n전체 바디는 아직 로드하지 않음 — 메모리 절약',
  },
  {
    label: '② 스킬 요약 → 시스템 프롬프트 주입',
    body: '각 스킬을 ~24토큰으로 요약 (이름 + 한 줄 설명)\n100개 스킬이어도 시스템 프롬프트에 ~2,400 토큰만 차지\n"사용 가능한 스킬 목록" 형태로 LLM에게 전달',
  },
  {
    label: '③ 사용자 메시지 ↔ 스킬 매칭',
    body: '사용자: "이 코드 리뷰해줘"\nLLM이 스킬 목록에서 description과 비교\n→ code-review 스킬 선택',
  },
  {
    label: '④ Lazy Loading: 선택된 스킬만 전체 로드',
    body: '매칭된 스킬의 마크다운 바디를 전체 로드\n나머지 스킬은 요약 상태 유지\n→ 토큰 효율: 필요할 때만 상세 프롬프트 로드',
  },
];

export const SKILL_LIST = [
  { name: 'code-review', desc: '코드 리뷰 수행', color: '#6366f1' },
  { name: 'commit-msg', desc: '커밋 메시지 생성', color: '#10b981' },
  { name: 'translate', desc: '다국어 번역', color: '#f59e0b' },
  { name: 'test-gen', desc: '테스트 코드 생성', color: '#6366f1' },
  { name: 'refactor', desc: '코드 리팩토링', color: '#10b981' },
];
