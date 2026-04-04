import type { Article } from '../types';

export const agentArticles: Article[] = [
  /* ── 1. 프롬프트 기초 ── */
  {
    slug: 'prompt-engineering',
    title: '프롬프트 엔지니어링: 패턴과 안티패턴',
    subcategory: 'ai-agents',
    sections: [
      { id: 'overview', title: '프롬프트 엔지니어링이란' },
      { id: 'chain-of-thought', title: 'Chain-of-Thought & 추론 유도' },
      { id: 'structured-output', title: '구조화된 출력' },
      { id: 'few-shot', title: 'Few-shot 예시 설계' },
      { id: 'anti-patterns', title: '안티패턴 & 트러블슈팅' },
    ],
    component: () => import('@/pages/articles/ai/prompt-engineering'),
  },
  {
    slug: 'xml-prompting',
    title: 'XML 태그 프롬프팅: LLM과의 구조화된 대화',
    subcategory: 'ai-agents',
    sections: [
      { id: 'overview', title: '왜 XML 태그인가' },
      { id: 'basic-tags', title: '기본 태그 패턴' },
      { id: 'advanced-tags', title: '고급 태그 패턴' },
      { id: 'parsing', title: '출력 파싱 & 추출' },
      { id: 'best-practices', title: '실전 가이드' },
    ],
    component: () => import('@/pages/articles/ai/xml-prompting'),
  },

  /* ── 2. 컨텍스트 & 도구 연결 ── */
  {
    slug: 'context-engineering',
    title: '컨텍스트 엔지니어링: LLM 성능의 진짜 레버',
    subcategory: 'ai-agents',
    sections: [
      { id: 'overview', title: '컨텍스트 엔지니어링이란' },
      { id: 'system-prompt', title: '시스템 프롬프트 설계' },
      { id: 'rag', title: 'RAG: 검색 증강 생성' },
      { id: 'memory', title: '대화 메모리 패턴' },
      { id: 'optimization', title: '컨텍스트 윈도우 최적화' },
    ],
    component: () => import('@/pages/articles/ai/context-engineering'),
  },
  {
    slug: 'mcp-protocol',
    title: 'MCP: 모델 컨텍스트 프로토콜',
    subcategory: 'ai-agents',
    sections: [
      { id: 'overview', title: 'MCP가 왜 필요한가' },
      { id: 'architecture', title: 'Host · Client · Server 아키텍처' },
      { id: 'primitives', title: '3가지 프리미티브' },
      { id: 'transport', title: '전송 계층' },
      { id: 'implementation', title: 'MCP 서버 구현 예시' },
    ],
    component: () => import('@/pages/articles/ai/mcp-protocol'),
  },

  /* ── 3. 에이전트 패턴 & 하네스 ── */
  {
    slug: 'agentic-patterns',
    title: '에이전틱 패턴: ReAct에서 멀티에이전트까지',
    subcategory: 'ai-agents',
    sections: [
      { id: 'overview', title: '에이전트란 무엇인가' },
      { id: 'react', title: 'ReAct 패턴' },
      { id: 'plan-execute', title: 'Plan-and-Execute & Reflection' },
      { id: 'multi-agent', title: '멀티에이전트 패턴' },
      { id: 'hooks-skills', title: 'Hooks & Skills: 에이전트 확장' },
    ],
    component: () => import('@/pages/articles/ai/agentic-patterns'),
  },
  {
    slug: 'llm-harness',
    title: 'LLM 하네스 엔지니어링: 모델을 제품으로',
    subcategory: 'ai-agents',
    sections: [
      { id: 'overview', title: '하네스란 무엇인가' },
      { id: 'composition', title: '하네스 구성' },
      { id: 'evaluation', title: '평가 & 테스트' },
      { id: 'iteration', title: '반복 개선 루프' },
      { id: 'patterns', title: '실전 패턴' },
    ],
    component: () => import('@/pages/articles/ai/llm-harness'),
  },
  {
    slug: 'skills-anatomy',
    title: 'Skills 시스템 해부: 에이전트의 능력 단위',
    subcategory: 'ai-agents',
    sections: [
      { id: 'overview', title: 'Skill이란 무엇인가' },
      { id: 'format', title: 'SKILL.md 포맷' },
      { id: 'loading', title: '동적 로딩 & 발견' },
      { id: 'execution', title: '실행 파이프라인' },
      { id: 'registry', title: '스킬 레지스트리 & 생태계' },
    ],
    component: () => import('@/pages/articles/ai/skills-anatomy'),
  },

  /* ── 4. 프레임워크 & 실제 구현체 ── */
  {
    slug: 'agent-frameworks',
    title: 'AI 에이전트 프레임워크: LangChain, LlamaIndex, CrewAI',
    subcategory: 'ai-agents',
    sections: [
      { id: 'overview', title: '에이전트 프레임워크 개요' },
      { id: 'langchain', title: 'LangChain 심층 분석' },
      { id: 'comparison', title: '프레임워크 비교' },
    ],
    component: () => import('@/pages/articles/ai/agent-frameworks'),
  },
  {
    slug: 'claude-code',
    title: 'Claude Code: 에이전틱 코딩 도구',
    subcategory: 'ai-agents',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'agent-architecture', title: '에이전트 아키텍처' },
      { id: 'tools-permissions', title: '도구 시스템 & 권한 모델' },
    ],
    component: () => import('@/pages/articles/ai/claude-code'),
  },
  {
    slug: 'openclaw-assistant',
    title: 'OpenClaw: 개인용 AI 어시스턴트',
    subcategory: 'ai-agents',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'pi-integration', title: 'Pi SDK 통합 & 에이전트 세션' },
      { id: 'channel-skills', title: '채널 시스템 & 스킬' },
    ],
    component: () => import('@/pages/articles/ai/openclaw-assistant'),
  },
];
