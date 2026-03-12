import type { Category } from '../types';

const ismsAml: Category = {
  slug: 'isms-aml',
  name: 'ISMS AML',
  description: '정보보호 관리체계(ISMS) 및 자금세탁방지(AML) 학습 노트',
  subcategories: [
    { slug: 'isms', name: 'ISMS' },
    { slug: 'aml', name: 'AML/CFT' },
    { slug: 'compliance', name: 'Compliance' },
  ],
  articles: [],
};

export default ismsAml;
