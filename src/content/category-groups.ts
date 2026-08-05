import type { Category } from './types';

export type CategoryGroupId = NonNullable<Category['group']>;

export const categoryGroups: Record<CategoryGroupId, { name: string; description: string; eyebrow: string }> = {
  foundation: {
    name: '필요한 기반',
    description: '선택한 목표에서 막힐 때 하드웨어, 실행 계층, 암호학과 네트워크로 내려간다.',
    eyebrow: 'STEP 02',
  },
  capability: {
    name: '목표 시스템',
    description: '현재 이해하거나 만들고 싶은 지능, 합의, 신뢰 시스템에서 시작한다.',
    eyebrow: 'STEP 01',
  },
  operations: {
    name: '구현 · 운영',
    description: '선택한 시스템을 배포하고 관찰하며 위험과 규정을 관리한다.',
    eyebrow: 'STEP 03',
  },
  domain: {
    name: '도메인 지식',
    description: '프로토콜, 시스템, 수학, 운영 지식을 주제별로 정리한 글',
    eyebrow: 'DOMAIN',
  },
  practice: {
    name: '코드베이스 분석과 검증 실천',
    description: '특정 저장소, 함수 경계, 검증 산출물처럼 작업 단위가 중심인 글',
    eyebrow: 'PRACTICE',
  },
  system: {
    name: '시스템 산출물',
    description: '자동 미러, 운영 기록처럼 사람이 다듬은 본문과 구분되는 글',
    eyebrow: 'SYSTEM',
  },
};

export function groupCategories(categories: Category[]) {
  const order: CategoryGroupId[] = ['capability', 'foundation', 'operations', 'practice', 'domain', 'system'];
  return order
    .map((id) => ({
      id,
      ...categoryGroups[id],
      categories: categories.filter((category) => (category.group ?? 'domain') === id),
    }))
    .filter((group) => group.categories.length > 0);
}
