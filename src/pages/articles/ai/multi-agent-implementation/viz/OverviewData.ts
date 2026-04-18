import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '단일 LLM의 한계 — 하나의 프롬프트로는 부족하다',
    body: '한 LLM에 품질 분석 + 매뉴얼 검색 + 의사결정을 모두 맡기면 context window 포화, 도구 혼선, hallucination이 급증한다.',
  },
  {
    label: '멀티 에이전트 — 역할 분담으로 복잡도 해결',
    body: '각 에이전트에 하나의 역할(검색, 분석, 판단)을 부여하면 프롬프트가 단순해지고, 도구 충돌이 사라진다.',
  },
  {
    label: '제조 현장 적용 — 품질·보전·공정 3대 과제',
    body: '품질 관리(불량 탐지 + 원인 분석), 예지 보전(센서 이상 + 교체 판단), 공정 최적화(파라미터 조정 + 시뮬레이션).',
  },
  {
    label: '핵심 프레임워크 — LangGraph + CrewAI',
    body: 'LangGraph: 상태 그래프 기반, 세밀한 흐름 제어. CrewAI: 역할 기반 팀 구성, 빠른 프로토타이핑. 용도에 따라 선택.',
  },
];

export const SINGLE_PROBLEMS = [
  { label: 'Context 포화', desc: '도구 10개+ 설명', color: '#ef4444' },
  { label: '도구 혼선', desc: '잘못된 도구 호출', color: '#f59e0b' },
  { label: 'Hallucination', desc: '복합 추론 실패', color: '#ef4444' },
];

export const MULTI_AGENTS = [
  { label: 'RAG Agent', role: '매뉴얼 검색', color: '#6366f1' },
  { label: 'Analysis Agent', role: '데이터 분석', color: '#10b981' },
  { label: 'Decision Agent', role: '의사결정', color: '#f59e0b' },
];

export const MFG_DOMAINS = [
  { label: '품질 관리', sub: '불량 탐지 + 원인', color: '#ef4444' },
  { label: '예지 보전', sub: '센서 이상 + 교체', color: '#f59e0b' },
  { label: '공정 최적화', sub: '파라미터 조정', color: '#10b981' },
];
