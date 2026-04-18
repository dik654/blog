import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. Lessons — 주제별 원칙이 수렴하는 곳',
    body: '시간순이 아니라 주제별. "언제"가 아니라 "무엇에 대해".\n같은 교훈이 여러 번 반복되면 한 파일로 수렴한다 — 두 번째부터는 새 파일을 만들지 않고 기존 파일을 업데이트한다.\n"3주 뒤의 내가 비슷한 상황에서 어떻게 판단해야 하지?" 에 답하는 층.\n반복 가능한 판단 기준의 저장소.',
  },
  {
    label: '2. 원칙 vs 레시피 — 들어가는 것과 빼는 것',
    body: '원칙: "이런 상황에서는 이렇게 판단한다" — Lessons에 들어간다.\n레시피: "이 버그는 이 함수의 이 줄을 고치면 된다" — Lessons에 들어가지 않는다.\n레시피는 코드와 커밋 메시지가 진실이다. Lessons는 코드를 보는 렌즈다.\n"저 코드를 왜 저렇게 짜야 하는가" 에 답할 수 있으면 원칙, 아니면 레시피.',
  },
  {
    label: '3. 디렉토리 = 주제',
    body: 'lessons/ 아래에 주제별 서브디렉토리.\nagent-routing/, llm-wrapper/, tool-design/, user-profile/, self-improve/, ...\n하나의 주제 안에서 여러 파일이 서로 다른 측면을 다룬다.\n서브디렉토리가 8개를 넘으면 주제를 재정리할 때 — 디렉토리가 많을수록 같은 교훈이 여러 곳에 흩어진다.',
  },
  {
    label: '4. 파일 구조 — Problem → Wrong → Right → Why',
    body: '하나의 Lessons 파일의 전형적 흐름.\nProblem(무엇에 대한 판단인가) → Naive approach(가장 먼저 떠오르는 접근과 그 한계) → Right approach(실제로 되는 접근) → Why(왜 이게 맞는가, 5가지 이유).\n마지막에 Cost analysis 또는 Phase breakdown으로 trade-off를 명시.\n코드 블록은 "대조"용도로만 쓴다.',
  },
  {
    label: '5. 실제 예시 — agent-memory-architecture.md',
    body: 'context-manager의 agent-routing/agent-memory-architecture.md.\n"Memory는 누적이 아니라 압축 rewrite다" — 한 문장 핵심 통찰로 시작.\n3-tier 모델: T1 compressed profile(~500토큰) / T2 vector search / T3 structured facts.\n각 tier별 비용 분석, auto-detection 규칙.\n이 파일 하나에 memory 관련 모든 원칙이 수렴돼 있다.',
  },
  {
    label: '6. 업데이트 흐름 — 새 insight는 기존 파일에 추가',
    body: '두 번째 유사 사건이 발생하면 새 파일을 만들지 않는다.\n기존 파일의 해당 섹션을 업데이트한다 — "Known risks" 목록 추가 / "Phase breakdown"에 새 단계 추가.\n이 규칙이 Lessons 층을 얇게 유지한다.\n파일이 점점 성숙해지고, 원칙이 일관성을 유지한다.',
  },
  {
    label: '7. Lessons에 들어가면 안 되는 것',
    body: '디버깅 레시피: "이 에러는 .env에 X=Y 추가". 코드/커밋이 진실.\n아키텍처 설명: "이 컴포넌트는 A → B → C로 호출한다". docs/ 또는 CLAUDE.md가 진실.\n사건 단일 기록: 한 번 일어난 일. Changelog가 진실.\n진짜 unique 결정: ADR이 진실.\nLessons는 "반복 가능한 판단"만 남긴다.',
  },
  {
    label: '8. Memory B wipeout 사건이 Lessons에 어떻게 흘러갔나',
    body: '1. 사건 발생 → Changelog 엔트리 한 줄.\n2. 원인 분석 → agent-memory-architecture.md 의 "Known risks of rewrite-based approach" 섹션 추가.\n3. 이건 기존 파일 업데이트 — 새 파일을 만들지 않았다.\n4. 관련 원칙 하나가 llm-promise-vs-actual-capability.md 에 추가 — tool hallucination 현상.\n한 사건이 두 Lessons 파일을 동시에 성숙시켰다.',
  },
];

export const PRINCIPLE_VS_RECIPE = [
  { item: '"이 에러는 .env에 X=Y 추가"', kind: 'recipe', where: '코드/커밋' },
  { item: '"LLM rewrite는 delete를 암시할 수 있다"', kind: 'principle', where: 'Lessons' },
  { item: '"Line 42에서 null check 누락"', kind: 'recipe', where: '코드/커밋' },
  { item: '"Negative few-shot이 positive보다 약하다"', kind: 'principle', where: 'Lessons' },
  { item: '"이 API는 /v2로 옮겼음"', kind: 'recipe', where: 'docs/' },
  { item: '"Provider-agnostic gateway가 유일한 외부 경로"', kind: 'principle', where: 'ADR+Lessons' },
];

export const LESSON_TOPICS = [
  { name: 'agent-routing', files: 16, color: '#3b82f6', desc: '라우팅·메모리·모델 선택' },
  { name: 'llm-wrapper', files: 15, color: '#a855f7', desc: 'LLM 호출 추상화' },
  { name: 'tool-design', files: 8, color: '#10b981', desc: 'Tool 인터페이스' },
  { name: 'self-improve', files: 5, color: '#f59e0b', desc: '자동 인사이트 로그' },
  { name: 'user-profile', files: 4, color: '#ef4444', desc: '사용자 모델' },
];

export const MEMORY_FILE_STRUCTURE = [
  { line: '# Agent Memory Architecture', kind: 'h1' },
  { line: '', kind: 'blank' },
  { line: '## Problem', kind: 'h2' },
  { line: 'Memory는 누적이 아니라 압축 rewrite다', kind: 'body' },
  { line: '', kind: 'blank' },
  { line: '## Naive approach', kind: 'h2' },
  { line: '모든 대화를 append → 토큰 폭발', kind: 'body' },
  { line: '', kind: 'blank' },
  { line: '## Right approach: 3-tier', kind: 'h2' },
  { line: 'T1 compressed profile (~500 토큰)', kind: 'body' },
  { line: 'T2 vector search (Qdrant)', kind: 'body' },
  { line: 'T3 structured facts (Postgres)', kind: 'body' },
  { line: '', kind: 'blank' },
  { line: '## Why (5 reasons)', kind: 'h2' },
  { line: '1. rewrite는 의미 drift 위험 ...', kind: 'body' },
];
