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
  {
    "id": "overview",
    "title": "1. 두 자산을 미리 모아 두고 교환하게 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 입력 준비·출력 전송·실제 잔액 검사로 나눕니다"
  },
  {
    "id": "case",
    "title": "3. 1000개씩 있는 풀에 A 100개를 넣습니다"
  },
  {
    "id": "parts",
    "title": "4. 거래 안내와 자산 보관 계약을 나눕니다"
  },
  {
    "id": "why-parts",
    "title": "5. 사용자가 보냈다고 말한 양을 그대로 믿지 않습니다"
  },
  {
    "id": "names",
    "title": "6. Pair는 자산을 보관하고 Router는 교환을 연결합니다"
  },
  {
    "id": "swap-trace",
    "title": "7. 같은 100개 입력을 견적과 실제 잔액에서 확인합니다"
  },
  {
    "id": "swap-formula",
    "title": "8. 출력량을 풀면 입력이 분모에도 들어갑니다"
  },
  {
    "id": "swap-source",
    "title": "9. 실제 코드에 100000000 정수 입력을 넣어 봅니다"
  },
  {
    "id": "divergence-loss",
    "title": "10. 자산을 맡기는 결과는 그대로 보유한 결과와 다릅니다"
  },
  {
    "id": "pair-contract",
    "title": "11. 새 지분은 두 입금 비율 중 작은 쪽으로 정합니다"
  },
  {
    "id": "protocol-fee",
    "title": "12. 프로토콜 수수료는 지분 발행으로 반영합니다"
  },
  {
    "id": "router-swap",
    "title": "13. 견적을 본 시점과 실행 시점의 잔액은 다를 수 있습니다"
  },
  {
    "id": "flash-swap",
    "title": "14. 먼저 받은 토큰도 같은 호출 안에서 대가를 갚아야 합니다"
  },
  {
    "id": "twap",
    "title": "15. 누적 가격의 차이를 경과 시간으로 나눕니다"
  },
  {
    "id": "uniswap-v2-release-gate",
    "title": "16. 같은 입력에서 잔액과 실패 조건을 비교합니다"
  }
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
  {
    "id": "overview",
    "title": "1. 돈을 모아 빌려주되 담보가 버틸 수 있는지 계속 계산합니다"
  },
  {
    "id": "black-box",
    "title": "2. 돈을 맡기고 빌린 뒤 갚는 과정입니다"
  },
  {
    "id": "case",
    "title": "3. 10000달러 중 8000달러를 빌려준 풀입니다"
  },
  {
    "id": "parts",
    "title": "4. 자산별 풀과 사람별 계정을 함께 관리합니다"
  },
  {
    "id": "why-parts",
    "title": "5. 부채를 갚을 담보와 오늘 인출할 돈은 다릅니다"
  },
  {
    "id": "names",
    "title": "6. Reserve·index·health factor에 이름을 붙입니다"
  },
  {
    "id": "account-trace",
    "title": "7. C의 7000달러 차입을 계속 따라갑니다"
  },
  {
    "id": "atoken-debt",
    "title": "8. 저장한 단위에 공통 계수를 곱해 현재 잔액을 얻습니다"
  },
  {
    "id": "index-source",
    "title": "9. 실제 코드는 공급을 내리고 부채를 올려 읽습니다"
  },
  {
    "id": "interest-rate",
    "title": "10. 남은 자금이 적어지면 차입 이율이 빠르게 올라갑니다"
  },
  {
    "id": "rate-source",
    "title": "11. 실제 분기는 정확히 80%일 때 아래 구간을 씁니다"
  },
  {
    "id": "liquidation",
    "title": "12. 담보가 8000이면 청산 기준 가치6400이 부채7000보다 작습니다"
  },
  {
    "id": "close-factor",
    "title": "13. 청산 가능 상태여도 실제 갚는 양은 다시 제한됩니다"
  },
  {
    "id": "efficiency-mode",
    "title": "14. 자산 조합에 따라 허용 비율과 차입 범위를 바꿉니다"
  },
  {
    "id": "aave-v3-release-gate",
    "title": "15. 같은 가격·계수·설정에서 실행 결과를 비교합니다"
  }
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
  {
    "id": "overview",
    "title": "1. 1달러에 가까운 가격을 유지하려면 돈을 돌려받는 길이 필요합니다"
  },
  {
    "id": "black-box",
    "title": "2. 돈을 받고 토큰을 만들고 다시 돈으로 돌려줍니다"
  },
  {
    "id": "case",
    "title": "3. 0.97달러에 산 토큰을 1달러에 돌려받는 경우입니다"
  },
  {
    "id": "parts",
    "title": "4. 토큰 수량·갚을 자산·상환 자격을 함께 봅니다"
  },
  {
    "id": "why-parts",
    "title": "5. 준비금이 충분해도 지금 지급할 현금은 부족할 수 있습니다"
  },
  {
    "id": "names",
    "title": "6. 목표 가격·시장 가격·상환 청구권은 다릅니다"
  },
  {
    "id": "redemption-trace",
    "title": "7. 9700달러 매수부터 실제 10000달러 수령까지 추적합니다"
  },
  {
    "id": "source-terms",
    "title": "8. 실제 약관은 상환 주체와 조건을 정합니다"
  },
  {
    "id": "stabilization-mechanisms",
    "title": "9. 같은 3% 이탈도 뒷받침하는 자산에 따라 복구가 다릅니다"
  },
  {
    "id": "failure-boundaries",
    "title": "10. 0.97달러를 보면 가격과 지급 경로를 함께 기록합니다"
  },
  {
    "id": "stablecoin-release",
    "title": "11. 발행에서 지급 완료까지 맞는지 검수합니다"
  }
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
