import type { Subcategory } from '../types';

export const subcategories: Subcategory[] = [
  { slug: 'fundamentals', name: 'Fundamentals', description: '합의, 블록 구조, 분산 시스템 기초', icon: '📦' },
  {
    slug: 'ethereum',
    name: 'Ethereum',
    description: '이더리움 프로토콜, 스케일링, 프라이버시',
    icon: '💎',
    children: [
      { slug: 'eth-core', name: 'Core Protocol', description: '노드, EVM, Fork ID 등 핵심 프로토콜', icon: '⚙️' },
      { slug: 'eth-reth', name: 'Reth (EL)', description: 'Reth (Rust Ethereum) 내부 코드 심층 분석', icon: '🦀' },
      { slug: 'eth-prysm', name: 'Prysm (CL)', description: 'Prysm 비콘 클라이언트 내부 분석', icon: '🔮' },
      { slug: 'eth-helios', name: 'Helios (Light Client)', description: 'Rust 경량 클라이언트 내부 분석', icon: '💡' },
      { slug: 'eth-scaling', name: 'Scaling & L2', description: 'Rollup, zkEVM, L2 확장 솔루션', icon: '📐' },
      { slug: 'eth-privacy', name: 'Privacy', description: '프라이버시 트랜잭션, 믹서, ZK 프라이버시', icon: '🕶️' },
    ],
  },
  {
    slug: 'cosmos',
    name: 'Cosmos Ecosystem',
    description: 'Cosmos SDK, CometBFT, IBC 생태계',
    icon: '🌌',
    children: [
      { slug: 'cosmos-core', name: 'Core', description: 'CometBFT, Cosmos SDK, 모듈 아키텍처', icon: '🪐' },
      { slug: 'cosmos-evm', name: 'EVM Integration', description: 'Cosmos 위 EVM 통합 (Initia 등)', icon: '🔗' },
    ],
  },
  { slug: 'bft-consensus', name: 'BFT Consensus', description: 'PBFT, HotStuff, DAG 기반 합의 비교', icon: '🗳️' },
  {
    slug: 'filecoin',
    name: 'Filecoin',
    description: '분산 저장소 블록체인',
    icon: '📁',
    children: [
      { slug: 'fil-overview', name: '개요 & 합의', description: 'Lotus 아키텍처, EC, F3 합의', icon: '🏗️' },
      { slug: 'fil-proofs', name: '저장 증명', description: 'PoRep, PoSt, SNARK 증명 파이프라인', icon: '🔒' },
      { slug: 'fil-hot', name: '핫스토리지', description: 'PDP, Storacha, Onchain Cloud', icon: '🔥' },
      { slug: 'fil-lotus', name: 'Lotus 내부', description: '체인/마이닝/마켓/상태 심층 분석', icon: '🪷' },
      { slug: 'fil-infra', name: '네트워크 인프라', description: 'IPFS, IPC, FVM', icon: '🌐' },
      { slug: 'fil-theory', name: '이론', description: '저장 증명 이론, VDF, DRAND', icon: '📐' },
    ],
  },
  // { slug: 'l1-chains', name: 'L1 Blockchains', description: 'Berachain 등 신규 L1 체인 분석', icon: '⛓️' },
  { slug: 'commonware', name: 'Commonware', description: 'Anti-Framework 블록체인 프리미티브 라이브러리', icon: '🧩' },
  { slug: 'zk-from-scratch', name: 'ZK 구현 (Rust)', description: 'blockchain-project-from-scratch — ZK 증명 시스템을 Rust로 직접 구현', icon: '🦀' },
];
