import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '프롬프트 엔지니어링의 한계',
    body: '프롬프트만 잘 쓰면 된다? — 단일 지시문(instruction)만으로는 복잡한 작업 해결 불가\n실제 LLM 성능의 핵심 레버는 "프롬프트 텍스트"가 아니라 "전체 컨텍스트"',
  },
  {
    label: '컨텍스트 = LLM에게 주는 모든 정보',
    body: 'LLM이 응답을 생성할 때 참조하는 모든 토큰의 합\n시스템 프롬프트 + 도구 결과 + 검색 결과 + 대화 히스토리 + 메모리',
  },
  {
    label: '5대 컨텍스트 소스',
    body: '① 시스템 프롬프트(역할·규칙)\n② RAG(검색 증강 생성)\n③ 도구 결과(함수 호출 반환값)\n④ 대화 히스토리(이전 턴)\n⑤ 장기 메모리(요약·벡터)',
  },
  {
    label: '컨텍스트 엔지니어링',
    body: '5개 소스를 최적으로 조합해서 컨텍스트 윈도우에 배치하는 기술\n모델을 바꾸는 것보다 컨텍스트를 바꾸는 것이 더 효과적',
  },
];

export const SOURCES = [
  { label: 'System', short: 'SYS', color: '#6366f1' },
  { label: 'RAG', short: 'RAG', color: '#10b981' },
  { label: 'Tools', short: 'TOOL', color: '#f59e0b' },
  { label: 'History', short: 'HIST', color: '#6366f1' },
  { label: 'Memory', short: 'MEM', color: '#10b981' },
];
