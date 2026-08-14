import type { Article } from "../types";

export const defiArticles: Article[] = [
  /* ── DEX ── */
  {
    slug: "dydx",
    title: "dYdX v4: order gossip에서 deterministic settlement까지",
    subcategory: "defi-dex",
    sections: [
      { id: "overview", title: "Transaction과 order는 같은 것이 아니다" },
      { id: "orderbook-architecture", title: "Short-term·stateful order" },
      { id: "matching-engine", title: "Proposal operation·matching·risk" },
      { id: "cosmos-integration", title: "Consensus에서 settlement까지" },
      { id: "indexer", title: "Indexer projection·replay" },
    ],
    component: () => import("@/pages/articles/blockchain/dydx"),
  },
  {
    slug: "uniswap-v2",
    title: "Uniswap V2: invariant·LP share·flash settlement",
    subcategory: "defi-dex",
    sections: [
      { id: "overview", title: "Fee-adjusted invariant" },
      { id: "pair-contract", title: "LP share와 protocol fee" },
      { id: "router-swap", title: "Quote와 실행 경계" },
      { id: "flash-swap", title: "Flash settlement·TWAP·release" },
    ],
    component: () => import("@/pages/articles/blockchain/uniswap-v2"),
  },
  {
    slug: "uniswap-v3",
    title: "Uniswap V3: range·tick·fee-growth·swap-step",
    subcategory: "defi-dex",
    sections: [
      { id: "overview", title: "Range invariant" },
      { id: "tick-math", title: "Tick·√P·token amounts" },
      { id: "position-nft", title: "Position inside fee growth" },
      { id: "swap-algorithm", title: "Tick crossing·swap step·release" },
    ],
    component: () => import("@/pages/articles/blockchain/uniswap-v3"),
  },
  {
    slug: "uniswap-v4",
    title: "Uniswap V4 — Hooks & Singleton",
    subcategory: "defi-dex",
    sections: [
      { id: "overview", title: "Singleton settlement" },
      { id: "singleton-pool-key", title: "PoolKey·PoolId" },
      { id: "hook-permission-boundary", title: "Hook permission 경계" },
      { id: "flash-accounting-release", title: "Unlock·delta 검증" },
    ],
    component: () => import("@/pages/articles/blockchain/uniswap-v4"),
  },
  {
    slug: "curve-stable",
    title: "Curve — StableSwap AMM",
    subcategory: "defi-dex",
    sections: [
      { id: "overview", title: "개요 & StableSwap invariant" },
      { id: "invariant", title: "A·n^n·Σx + D = A·D·n^n + D^(n+1)/(n^n·Πx)" },
      { id: "amplification", title: "증폭 계수 A & 슬리피지 곡선" },
      { id: "gauge-crv", title: "Gauge · CRV · veTokenomics" },
    ],
    component: () => import("@/pages/articles/blockchain/curve-stable"),
  },

  /* ── Lending ── */
  {
    slug: "aave-v3",
    title: "Aave V3: utilization·index·health·liquidation",
    subcategory: "defi-lending",
    sections: [
      { id: "overview", title: "Reserve·account·evidence boundary" },
      { id: "atoken-debt", title: "Scaled balance·indexes" },
      { id: "interest-rate", title: "Utilization kink rate" },
      { id: "liquidation", title: "Health factor·close factor" },
      { id: "efficiency-mode", title: "E-Mode·isolation·release" },
    ],
    component: () => import("@/pages/articles/blockchain/aave-v3"),
  },
  {
    slug: "compound-v3",
    title: "Compound V3: base principal·factors·absorb",
    subcategory: "defi-lending",
    sections: [
      { id: "overview", title: "Single-base market boundary" },
      { id: "comet-architecture", title: "Signed principal·independent rates" },
      {
        id: "collateral-borrow",
        title: "Borrow·liquidation factor buffer",
      },
      { id: "liquidation", title: "Absorb·collateral sale·release" },
    ],
    component: () => import("@/pages/articles/blockchain/compound-v3"),
  },

  /* ── Stablecoin ── */
  {
    slug: "stablecoin-overview",
    title: "스테이블코인 개요 — 4가지 유형 & 안정성 메커니즘",
    subcategory: "defi-stablecoin",
    sections: [
      { id: "overview", title: "목표·상환·시장 경계" },
      { id: "stabilization-mechanisms", title: "안정화 메커니즘" },
      { id: "failure-boundaries", title: "실패 경계와 책임" },
      { id: "stablecoin-release", title: "채택·복구 검증" },
    ],
    component: () => import("@/pages/articles/blockchain/stablecoin-overview"),
  },
  {
    slug: "usdc-circle",
    title: "USDC — Circle의 법정화폐 담보 스테이블코인",
    subcategory: "defi-stablecoin",
    sections: [
      { id: "overview", title: "발행자·체인 경계" },
      { id: "issuance-redemption", title: "Mint·redeem 원장" },
      { id: "cctp-burn-mint", title: "CCTP burn·attest·mint" },
      { id: "reserve-release", title: "준비금·공급 검증" },
    ],
    component: () => import("@/pages/articles/blockchain/usdc-circle"),
  },
  {
    slug: "dai-maker",
    title: "DAI & MakerDAO — CDP 기반 암호 담보 스테이블",
    subcategory: "defi-stablecoin",
    sections: [
      { id: "overview", title: "DAI core 경계" },
      { id: "vault-debt-collateral", title: "Vault 담보·부채 장부" },
      { id: "liquidation-peg-tools", title: "청산·PSM 도구" },
      { id: "dai-release", title: "Parameter·migration 검증" },
    ],
    component: () => import("@/pages/articles/blockchain/dai-maker"),
  },
  {
    slug: "rwa-composition",
    title: "RWA (Real World Assets) — 온체인 자산 토큰화 구조",
    subcategory: "defi-stablecoin",
    sections: [
      { id: "overview", title: "RWA란 & 시장 규모" },
      { id: "asset-types", title: "자산 유형 — 국채, 부동산, 원자재" },
      {
        id: "tokenization-flow",
        title: "토큰화 프로세스 — SPV, legal wrapper",
      },
      {
        id: "defi-integration",
        title: "DeFi 통합 — MakerDAO, Ondo, Centrifuge",
      },
    ],
    component: () => import("@/pages/articles/blockchain/rwa-composition"),
  },
  {
    slug: "giwa-chain",
    title: "GIWA Chain — 한국형 스테이블코인 인프라 분석",
    subcategory: "defi-stablecoin",
    sections: [
      { id: "overview", title: "GIWA 프로젝트 개요" },
      { id: "architecture", title: "노드 아키텍처 & 합의" },
      { id: "stablecoin-design", title: "한국형 스테이블코인 설계" },
      { id: "regulatory", title: "한국 규제 환경 & 전략" },
    ],
    component: () => import("@/pages/articles/blockchain/giwa-chain"),
  },
];
