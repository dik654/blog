import type { Article } from '../types';

export const fundamentalsArticles: Article[] = [
  {
    slug: 'distributed-systems',
    title: '분산 시스템 이론',
    subcategory: 'fundamentals',
    sections: [
      { id: 'overview', title: '분산 시스템 모델' },
      { id: 'flp', title: 'FLP 불가능성 정리' },
      { id: 'cap', title: 'CAP 정리 & PACELC' },
      { id: 'bft-theory', title: 'Byzantine 장군 문제' },
      { id: 'consensus-class', title: '합의 알고리즘 분류' },
    ],
    component: () => import('@/pages/articles/blockchain/distributed-systems'),
  },
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
  {
    slug: 'smr-theory',
    title: '상태 머신 복제 (SMR) 이론',
    subcategory: 'fundamentals',
    sections: [
      { id: 'overview', title: '상태 머신 복제' },
      { id: 'total-order', title: '전체 순서 브로드캐스트' },
      { id: 'log-replication', title: '로그 복제: Raft 기초' },
      { id: 'paxos', title: 'Paxos 프로토콜' },
    ],
    component: () => import('@/pages/articles/blockchain/smr-theory'),
  },
  {
    slug: 'crypto-theory',
    title: '암호학 프리미티브 이론',
    subcategory: 'fundamentals',
    sections: [
      { id: 'overview', title: '대칭/비대칭 암호' },
      { id: 'digital-signature', title: 'ECDSA, EdDSA, BLS' },
      { id: 'key-exchange', title: '키 교환: ECDH' },
      { id: 'threshold-crypto', title: '비밀 분산 & 임계값 서명' },
    ],
    component: () => import('@/pages/articles/blockchain/crypto-theory'),
  },
];

export const bftArticles: Article[] = [
  /* ── 1. 이론 기초 ── */
  {
    slug: 'bft-theory',
    title: '비잔틴 장애 모델 & 안전성 증명',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: '비잔틴 장군 문제' },
      { id: 'byzantine-model', title: '비잔틴 장애 모델' },
      { id: 'safety-liveness', title: '안전성 vs 활성' },
      { id: 'faulty-threshold', title: 'f < n/3 한계' },
    ],
    component: () => import('@/pages/articles/blockchain/bft-theory'),
  },
  {
    slug: 'pbft-deep',
    title: 'PBFT 3단계 심층 (Pre-prepare/Prepare/Commit)',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'PBFT 개요' },
      { id: 'three-phase', title: '3단계 프로토콜' },
      { id: 'view-change', title: 'View Change' },
      { id: 'checkpoint', title: '체크포인트 & 로그 정리' },
    ],
    component: () => import('@/pages/articles/blockchain/pbft-deep'),
  },
  {
    slug: 'tendermint-bft',
    title: 'Tendermint BFT 프로토콜',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'Tendermint BFT 개요' },
      { id: 'protocol', title: '프로토콜 흐름' },
      { id: 'locking', title: 'Polka 잠금 메커니즘' },
      { id: 'comparison', title: 'PBFT와 비교' },
    ],
    component: () => import('@/pages/articles/blockchain/tendermint-bft'),
  },
  {
    slug: 'hotstuff-deep',
    title: 'HotStuff 체인 투표 & 선형 통신',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'HotStuff 개요' },
      { id: 'chained-voting', title: '체인 투표' },
      { id: 'leader-rotation', title: '리더 교체' },
      { id: 'responsiveness', title: '응답성' },
    ],
    component: () => import('@/pages/articles/blockchain/hotstuff-deep'),
  },
  {
    slug: 'hotstuff2',
    title: 'HotStuff-2 (2단계 축소)',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'HotStuff-2 개요' },
      { id: 'two-phase', title: '2단계 프로토콜' },
      { id: 'optimistic', title: '낙관적 응답성' },
    ],
    component: () => import('@/pages/articles/blockchain/hotstuff2'),
  },
  {
    slug: 'jolteon-ditto',
    title: 'Jolteon & Ditto (Aptos DiemBFT 기반)',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: '진화 개요' },
      { id: 'jolteon', title: 'Jolteon' },
      { id: 'diembft', title: 'DiemBFT v4' },
    ],
    component: () => import('@/pages/articles/blockchain/jolteon-ditto'),
  },
  /* ── 리더 기반 BFT 비교 ── */
  {
    slug: 'bft-comparison',
    title: 'BFT 합의 비교 (PBFT → HotStuff → Autobahn)',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'BFT 프로토콜 진화' },
      { id: 'pbft', title: 'PBFT' },
      { id: 'hotstuff', title: 'HotStuff' },
      { id: 'autobahn', title: 'Autobahn' },
      { id: 'comparison', title: '종합 비교' },
    ],
    component: () => import('@/pages/articles/blockchain/bft-comparison'),
  },
  /* ── DAG 기반 합의 ── */
  {
    slug: 'dag-consensus',
    title: 'DAG 기반 합의 (Narwhal & Bullshark)',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'narwhal', title: 'Narwhal: DAG 기반 멤풀' },
      { id: 'bullshark', title: 'Bullshark: DAG 순서 결정' },
    ],
    component: () => import('@/pages/articles/blockchain/dag-consensus'),
  },
  {
    slug: 'narwhal-deep',
    title: 'Narwhal DAG 멤풀 심층',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'Narwhal 개요' },
      { id: 'round-structure', title: '라운드 구조' },
      { id: 'certificate', title: '증명서 메커니즘' },
      { id: 'availability', title: '가용성 보장' },
    ],
    component: () => import('@/pages/articles/blockchain/narwhal-deep'),
  },
  {
    slug: 'bullshark-deep',
    title: 'Bullshark 순서화 심층',
    subcategory: 'bft-consensus',
    sections: [
      { id: 'overview', title: 'Bullshark 개요' },
      { id: 'wave-commit', title: '웨이브 커밋' },
      { id: 'anchor-selection', title: '앵커 선택' },
      { id: 'async-fallback', title: '비동기 폴백' },
    ],
    component: () => import('@/pages/articles/blockchain/bullshark-deep'),
  },
];
