import type { Article } from '../types';

export const bftNewArticles: Article[] = [
  {
    slug: 'longest-chain',
    title: 'Nakamoto 최장 체인 합의',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: '최장 체인 개요' },
      { id: 'chain-selection', title: '체인 선택 규칙' },
      { id: 'finality', title: '확률적 최종성' },
      { id: 'comparison', title: 'BFT와의 비교' },
    ],
    component: () => import('@/pages/articles/blockchain/longest-chain'),
  },
  {
    slug: 'avalanche-consensus',
    title: 'Avalanche Snowball/Snowflake',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'Avalanche 합의 개요' },
      { id: 'snowflake', title: 'Snowflake: 이진 합의' },
      { id: 'snowball', title: 'Snowball: 신뢰도 카운터' },
      { id: 'comparison', title: '비교 분석' },
    ],
    component: () => import('@/pages/articles/blockchain/avalanche-consensus'),
  },
  {
    slug: 'tusk',
    title: 'Tusk (비동기 DAG 합의)',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'Tusk 개요' },
      { id: 'async-protocol', title: '비동기 프로토콜 구조' },
      { id: 'comparison', title: 'Tusk vs Bullshark' },
    ],
    component: () => import('@/pages/articles/blockchain/tusk'),
  },
  {
    slug: 'autobahn-deep',
    title: 'Autobahn 하이브리드 파이프라인 심층',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'Autobahn 개요' },
      { id: 'pipeline', title: '파이프라인 구조' },
      { id: 'hybrid-design', title: '하이브리드 설계' },
      { id: 'performance', title: '성능 분석' },
    ],
    component: () => import('@/pages/articles/blockchain/autobahn-deep'),
  },
  {
    slug: 'mysticeti',
    title: 'Mysticeti (Sui 최신 합의)',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'Mysticeti 개요' },
      { id: 'uncertified-dag', title: 'Uncertified DAG' },
      { id: 'fast-path', title: 'Fast Path' },
      { id: 'comparison', title: '비교 분석' },
    ],
    component: () => import('@/pages/articles/blockchain/mysticeti'),
  },
  {
    slug: 'gossipbft',
    title: 'GossiPBFT (Filecoin F3)',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'GossiPBFT 개요' },
      { id: 'protocol', title: '프로토콜 구조' },
      { id: 'filecoin-integration', title: 'Filecoin 통합' },
    ],
    component: () => import('@/pages/articles/blockchain/gossipbft'),
  },
  {
    slug: 'consensus-comparison',
    title: '합의 프로토콜 종합 비교',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: '종합 비교 개요' },
      { id: 'performance', title: '성능 비교' },
      { id: 'security', title: '안전성 & 활성' },
      { id: 'use-cases', title: '용도별 선택 가이드' },
    ],
    component: () => import('@/pages/articles/blockchain/consensus-comparison'),
  },
];
