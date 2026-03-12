import type { Category } from '../types';

const ai: Category = {
  slug: 'ai',
  name: 'AI',
  description: '인공지능 관련 학습 노트',
  subcategories: [
    { slug: 'machine-learning', name: 'Machine Learning' },
    { slug: 'deep-learning', name: 'Deep Learning' },
    { slug: 'llm', name: 'LLM' },
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
  ],
};

export default ai;
