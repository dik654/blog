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
    slug: "hyperliquid",
    title: "Hyperliquid: 주문·담보·HIP-3·HIP-4·자금 이동",
    subcategory: "defi-dex",
    sections: [
      {
        "id": "overview",
        "title": "매매 버튼 뒤에서 돈과 책임이 어떻게 바뀌는가"
      },
      {
        "id": "black-box",
        "title": "승인한 내용, 거래 결과, 모두가 인정한 기록"
      },
      {
        "id": "case",
        "title": "0.1개를 주문해도 처음에는 0.04개만 체결된다"
      },
      {
        "id": "picture",
        "title": "주문 번호와 체결 기록으로 잔량을 따라간다"
      },
      {
        "id": "need",
        "title": "승인만으로 돈을 바꾸면 안 되는 이유"
      },
      {
        "id": "order-lifecycle",
        "title": "주문·담보·실행 환경의 이름을 연결한다"
      },
      {
        "id": "mechanism",
        "title": "담보가 들어오고 주문이 체결된 뒤에도 검사는 계속된다"
      },
      {
        "id": "source",
        "title": "공개 SDK는 요청을 만들고 결과를 조회한다"
      },
      {
        "id": "comparison",
        "title": "HIP-4는 같은 주문장 위에서도 지급 구조가 다르다"
      },
      {
        "id": "risk-checklist",
        "title": "체결이 맞아도 외부 가격과 자금 회수의 위험은 남는다"
      }
    ],
    component: () => import("@/pages/articles/blockchain/hyperliquid"),
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
      { id: "permissioned-pools", title: "Permissioned Pools·adapter·LP" },
      { id: "flash-accounting-release", title: "Unlock·delta 검증" },
    ],
    component: () => import("@/pages/articles/blockchain/uniswap-v4"),
  },
  {
    slug: "curve-stable",
    title: "Curve — StableSwap AMM",
    subcategory: "defi-dex",
    sections: [
      { id: "overview", title: "Pegged-asset AMM 경계" },
      { id: "invariant", title: "StableSwap invariant·정규화" },
      { id: "amplification-risk", title: "A·depeg·parameter risk" },
      { id: "curve-release", title: "Failure·release gate" },
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
    title: "기관 토큰화: BUIDL의 권리·평가·매매·현금 회수",
    subcategory: "defi-stablecoin",
    sections: [
      {
        "id": "overview",
        "title": "화면의 토큰 잔액이 실제 자산의 어떤 권리를 뜻하는가"
      },
      {
        "id": "black-box",
        "title": "자산을 운용하는 곳과 보유자를 기록하는 곳"
      },
      {
        "id": "case",
        "title": "순자산102를 100개로 나누면 개당1.02다"
      },
      {
        "id": "picture",
        "title": "105−3의 자산 장부와 100개의 권리 장부를 맞춘다"
      },
      {
        "id": "need",
        "title": "24시간 옮길 수 있어도 24시간 같은 가격으로 팔리지는 않는다"
      },
      {
        "id": "claim-asset-map",
        "title": "순자산 가치와 명의개서, 시장 매매와 상환"
      },
      {
        "id": "token-cashflow-control",
        "title": "자격 확인에서 대금 회수까지 같은10개를 따라간다"
      },
      {
        "id": "source",
        "title": "BUIDL은 국채 그 자체가 아니라 펀드 지분이다"
      },
      {
        "id": "permissioned-market-stack",
        "title": "Circle 교환과 UniswapX 거래는 회수 경로를 늘린다"
      },
      {
        "id": "rwa-release",
        "title": "빠른 결제는 잘못된 평가와 회수 제한을 없애지 않는다"
      }
    ],
    component: () => import("@/pages/articles/blockchain/rwa-composition"),
  },
  {
    slug: "giwa-chain",
    title: "GIWA Chain — OP Stack node·derivation·finality 경계",
    subcategory: "defi-stablecoin",
    sections: [
      { id: "overview", title: "GIWA의 현재 범위" },
      { id: "node-envelope", title: "Node artifact" },
      { id: "derivation-heads", title: "Derivation·세 head" },
      { id: "application-boundary", title: "앱·스테이블코인 경계" },
      { id: "release-gate", title: "Canary·rollback" },
    ],
    component: () => import("@/pages/articles/blockchain/giwa-chain"),
  },
];
