import type { Category } from '../types';

const codebaseAnalysis: Category = {
  slug: 'codebase-analysis',
  name: 'Codebase Analysis',
  description: '실제 코드베이스의 코드 위치, 경계 명세, 불변조건, 테스트 매트릭스',
  group: 'practice',
  subcategories: [
    {
      slug: 'geth',
      name: 'geth',
      description: 'go-ethereum 코드베이스 단위 분석',
      icon: '⌁',
    },
  ],
  articles: [
    {
      slug: 'geth-blob-tx-fm',
      title: 'geth Blob 트랜잭션을 정적으로 검증하는 부분',
      subcategory: 'geth',
      summary: 'go-ethereum의 validateBlobTx를 상태와 분리된 경계로 자르고, 싼 구조 검사부터 KZG 증명 검증까지 코드 순서·불변조건·반례로 읽습니다.',
      level: '심화',
      estimatedMinutes: 34,
      prerequisites: ['FM 경계 절단 방식', 'Ethereum 트랜잭션과 fork의 역할', 'hash·commitment·proof의 구분'],
      sections: [
        { id: 'scope', title: '대상 단위' },
        { id: 'boundary', title: '경계 명세' },
        { id: 'concepts', title: '핵심 개념' },
        { id: 'procedure', title: '검증 절차' },
        { id: 'properties', title: '불변조건' },
        { id: 'tests', title: '테스트 매트릭스' },
        { id: 'result', title: '결과' },
      ],
      component: () => import('@/pages/articles/blockchain/geth-blob-tx-fm'),
    },
  ],
};

export default codebaseAnalysis;
