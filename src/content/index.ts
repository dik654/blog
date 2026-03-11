export interface Section {
  id: string;
  title: string;
}

export interface Article {
  slug: string;
  title: string;
  subcategory: string;
  sections: Section[];
  component: () => Promise<{ default: React.ComponentType }>;
}

export interface Subcategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
  articles: Article[];
}

export const categories: Category[] = [
  {
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
  },
  {
    slug: 'blockchain',
    name: 'Blockchain',
    description: '블록체인 관련 학습 노트',
    subcategories: [
      { slug: 'fundamentals', name: 'Fundamentals' },
      { slug: 'smart-contracts', name: 'Smart Contracts' },
      { slug: 'defi', name: 'DeFi' },
    ],
    articles: [
      {
        slug: 'consensus-mechanisms',
        title: '합의 알고리즘 비교',
        subcategory: 'fundamentals',
        sections: [
          { id: 'overview', title: '개요' },
          { id: 'pow', title: 'Proof of Work' },
          { id: 'pos', title: 'Proof of Stake' },
          { id: 'comparison', title: '비교 분석' },
        ],
        component: () => import('@/pages/articles/blockchain/consensus-mechanisms'),
      },
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getArticle(categorySlug: string, articleSlug: string) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;
  const article = category.articles.find((a) => a.slug === articleSlug);
  if (!article) return null;
  return { category, article };
}
