import { expect, test } from '@playwright/test';
import { getArticle, getCategoryBySlug } from '../src/content';
import type { Subcategory } from '../src/content/types';

function findSubcategory(items: Subcategory[], slug: string): Subcategory | undefined {
  for (const item of items) {
    if (item.slug === slug) return item;
    const nested = findSubcategory(item.children ?? [], slug);
    if (nested) return nested;
  }
  return undefined;
}

test('all six LLM route parents aggregate their immediate child articles', () => {
  const ai = getCategoryBySlug('ai');
  expect(ai).not.toBeNull();
  const routes = [
    'ai-llm-architectures',
    'ai-llm-post-training',
    'ai-llm-data',
    'ai-llm-interpretability',
    'ai-llm-efficiency',
    'ai-llm-serving',
  ];

  for (const slug of routes) {
    expect(findSubcategory(ai!.subcategories, slug)?.aggregateChildArticles, slug).toBe(true);
  }
});

test('olmOCR 2 participates in the canonical Document AI runtime path', () => {
  expect(getArticle('ai', 'olmocr-2')?.article.learningPath).toBe('ai-document-runtime-current-first');
});
