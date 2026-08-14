import type { Article } from "../types";

export const ethereumArticles: Article[] = [
  /* ── Core Protocol: 이더리움 자체 ── */
  {
    slug: "node-architecture",
    title: "이더리움 실행 노드: EL·CL과 Engine API 경계",
    subcategory: "eth-core",
    sections: [
      { id: "overview", title: "한 transaction의 노드 경로" },
      { id: "el-cl-boundary", title: "EL·CL 책임과 Engine API" },
      { id: "payload-state", title: "Payload 상태와 canonical head" },
      { id: "release", title: "Crash·reorg·release gate" },
    ],
    component: () => import("@/pages/articles/ethereum/node-architecture"),
  },
  {
    slug: "fork-id",
    title: "Fork ID (EIP-2124) 분석",
    subcategory: "eth-core",
    sections: [
      { id: "overview", title: "Fork ID가 거르는 것" },
      { id: "forkhash", title: "CRC32 누산과 FORK_NEXT" },
      { id: "validation", title: "로컬·원격 판정 행렬" },
      { id: "release", title: "경계 테스트와 배포" },
    ],
    component: () => import("@/pages/articles/ethereum/fork-id"),
  },
  {
    slug: "evm-fundamentals",
    title: "EVM 완전 분석: 스택 머신에서 인터프리터까지",
    subcategory: "eth-core",
    sections: [
      { id: "overview", title: "Transaction에서 상태 전이까지" },
      { id: "machine-step", title: "256-bit stack machine" },
      { id: "gas-state", title: "Gas·memory·state journal" },
      { id: "release", title: "Halt·revert·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/evm-fundamentals"),
  },
  {
    slug: "evm-advanced",
    title: "EVM 심화: Create · DelegateCall · StaticCall",
    subcategory: "eth-core",
    sections: [
      { id: "overview", title: "Nested execution frame" },
      { id: "memory-create", title: "Memory cost와 CREATE2" },
      { id: "call-context", title: "CALL·DELEGATECALL·STATICCALL" },
      { id: "release", title: "Nested revert와 release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/evm-advanced"),
  },
  {
    slug: "merkle-patricia-trie",
    title: "Ethereum MPT: nibble path·RLP·root proof",
    subcategory: "eth-core",
    sections: [
      { id: "overview", title: "Authenticated state의 입구" },
      { id: "path-encoding", title: "Secure nibble·compressed node" },
      { id: "root-proof", title: "RLP reference·root·proof" },
      { id: "state-tries", title: "Account·storage root nesting" },
      { id: "release", title: "Encoding·proof release gate" },
    ],
    component: () => import("@/pages/articles/ethereum/merkle-patricia-trie"),
  },
  {
    slug: "aa-fundamentals",
    title: "Account Abstraction 기초",
    subcategory: "eth-core",
    sections: [
      { id: "overview", title: "EOA vs CA" },
      { id: "erc4337", title: "ERC-4337 아키텍처" },
      { id: "native-aa", title: "Native AA" },
      { id: "use-cases", title: "활용 사례" },
    ],
    component: () => import("@/pages/articles/blockchain/aa-fundamentals"),
  },
  /* ── Reth (EL) ── */
  {
    slug: "reth",
    title: "Reth 아키텍처 개요",
    subcategory: "eth-reth",
    sections: [{ id: "overview", title: "아키텍처 개요" }],
    component: () => import("@/pages/articles/ethereum/reth"),
  },
];
