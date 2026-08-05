import { expect, test } from '@playwright/test';
import { categories } from '../src/content';
import { getSidebarLearningStages } from '../src/content/sidebar-learning-structure';
import type { Category } from '../src/content/types';

test('every registered category has an exact top-level learning-stage partition', () => {
  for (const category of categories) {
    const stages = getSidebarLearningStages(category);
    const stagedSlugs = stages.flatMap((stage) => stage.subcategories.map((subcategory) => subcategory.slug));
    expect(stagedSlugs.sort()).toEqual(category.subcategories.map((subcategory) => subcategory.slug).sort());
  }
});

test('a misspelled stage slug fails instead of disappearing from navigation', () => {
  const brokenCategory: Category = {
    slug: 'crypto',
    name: 'Crypto',
    description: 'contract fixture',
    subcategories: [
      { slug: 'zkp', name: 'ZKP' },
      { slug: 'wallet-key-management', name: 'Wallet' },
    ],
    articles: [],
  };

  expect(() => getSidebarLearningStages({
    ...brokenCategory,
    subcategories: brokenCategory.subcategories.filter((subcategory) => subcategory.slug !== 'zkp'),
  })).toThrow(/unknown stage slugs: zkp/);
});

test('an unclaimed top-level topic fails instead of becoming a vague fallback', () => {
  const category = categories.find((candidate) => candidate.slug === 'crypto');
  expect(category).toBeDefined();
  expect(() => getSidebarLearningStages({
    ...category!,
    subcategories: [...category!.subcategories, { slug: 'unmapped-topic', name: 'Unmapped' }],
  })).toThrow(/unclaimed top-level slugs: unmapped-topic/);
});

test('duplicate recursive topic destinations fail before rendering ambiguous links', () => {
  const category = categories.find((candidate) => candidate.slug === 'ai');
  expect(category).toBeDefined();

  const subcategories = structuredClone(category!.subcategories);
  const parent = subcategories.find((subcategory) => subcategory.children?.length);
  expect(parent?.children?.[0]).toBeDefined();
  parent!.children = [
    ...parent!.children!,
    {
      ...parent!.children![0],
      name: `${parent!.children![0].name} duplicate`,
    },
  ];

  expect(() => getSidebarLearningStages({
    ...category!,
    subcategories,
  })).toThrow(/duplicate recursive subcategory slugs/);
});
