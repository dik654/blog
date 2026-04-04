import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '전체 히스토리 (Full Buffer)',
    body: '모든 대화 턴을 그대로 유지\n장점 — 정보 손실 0 / 단점 — 긴 대화 시 토큰 한도 초과\n적합: 짧은 대화 (10턴 이하)',
  },
  {
    label: '슬라이딩 윈도우 (Sliding Window)',
    body: '최근 N턴만 유지, 오래된 턴은 버림\n장점 — 토큰 예산 고정 / 단점 — 초반 맥락 소실\n적합: 일반 챗봇, 고객 지원',
  },
  {
    label: '요약 메모리 (Summary)',
    body: 'LLM이 이전 대화를 짧은 요약으로 압축\n장점 — 핵심 정보 보존 + 토큰 절약 / 단점 — 요약 시 세부사항 손실\n적합: 장기 세션, 프로젝트 대화',
  },
  {
    label: '벡터 검색 메모리 (Vector Memory)',
    body: '과거 대화를 임베딩해서 벡터 DB에 저장 → 현재 질문과 관련된 기억만 검색\n장점 — 무한 히스토리에서 관련 정보만 / 단점 — 검색 지연, 임베딩 비용\n적합: AI 에이전트, 장기 어시스턴트',
  },
  {
    label: '하이브리드 전략',
    body: '실전에서는 여러 패턴을 조합\n최근 3턴 = 전체 유지 + 이전 대화 = 요약 + 핵심 사실 = 벡터 검색\nClaude Code: 전체 히스토리 유지 + 임계값 도달 시 자동 압축',
  },
];

export const PATTERNS = [
  { label: 'Full', color: '#6366f1', tokens: 100 },
  { label: 'Window', color: '#6366f1', tokens: 40 },
  { label: 'Summary', color: '#10b981', tokens: 25 },
  { label: 'Vector', color: '#f59e0b', tokens: 15 },
];
