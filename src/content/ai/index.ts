import type { Category } from '../types';

const ai: Category = {
  slug: 'ai',
  name: 'AI',
  description: '인공지능 관련 학습 노트',
  subcategories: [
    { slug: 'machine-learning', name: 'Machine Learning' },
    { slug: 'deep-learning', name: 'Deep Learning' },
    {
      slug: 'llm',
      name: 'LLM',
      children: [
        { slug: 'llm-serving', name: 'LLM 서빙' },
        { slug: 'llm-tools', name: 'LLM 도구' },
      ],
    },
  ],
  articles: [
    {
      slug: 'transformer-architecture',
      title: 'Transformer 아키텍처 이해하기',
      subcategory: 'deep-learning',
      sections: [
        { id: 'overview', title: '개요' },
        { id: 'self-attention', title: 'Self-Attention 메커니즘' },
        { id: 'multi-head', title: 'Multi-Head Attention' },
        { id: 'positional-encoding', title: 'Positional Encoding' },
        { id: 'summary', title: '정리' },
      ],
      component: () => import('@/pages/articles/ai/transformer-architecture'),
    },
    {
      slug: 'vllm-serving',
      title: 'vLLM: 고성능 LLM 서빙 엔진',
      subcategory: 'llm-serving',
      sections: [
        { id: 'overview', title: '개요' },
        { id: 'paged-attention', title: 'PagedAttention & KV 캐시 관리' },
        { id: 'serving-architecture', title: '서빙 아키텍처 & 최적화' },
      ],
      component: () => import('@/pages/articles/ai/vllm-serving'),
    },
    {
      slug: 'claude-code',
      title: 'Claude Code: 에이전틱 코딩 도구',
      subcategory: 'llm-tools',
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
      subcategory: 'llm-tools',
      sections: [
        { id: 'overview', title: '개요' },
        { id: 'pi-integration', title: 'Pi SDK 통합 & 에이전트 세션' },
        { id: 'channel-skills', title: '채널 시스템 & 스킬' },
      ],
      component: () => import('@/pages/articles/ai/openclaw-assistant'),
    },
  ],
};

export default ai;
