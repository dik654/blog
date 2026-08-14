import type { Article } from "../types";
import { nodeSections } from "@/pages/articles/ethereum/node-architecture/meta";

export const ethereumArticles: Article[] = [
  /* ── Core Protocol: 이더리움 자체 ── */
  {
    slug: "node-architecture",
    title: "이더리움 노드 아키텍처 (EL + CL)",
    subcategory: "eth-core",
    sections: nodeSections,
    component: () => import("@/pages/articles/ethereum/node-architecture"),
  },
  {
    slug: "fork-id",
    title: "Fork ID (EIP-2124) 분석",
    subcategory: "eth-core",
    sections: [
      { id: "overview", title: "개요" },
      { id: "crc32-enr", title: "CRC32 & ENR" },
      { id: "pow-to-pos", title: "PoW→PoS 전환" },
      { id: "test-design", title: "테스트 케이스 설계" },
    ],
    component: () => import("@/pages/articles/ethereum/fork-id"),
  },
  {
    slug: "evm-fundamentals",
    title: "EVM 완전 분석: 스택 머신에서 인터프리터까지",
    subcategory: "eth-core",
    sections: [
      { id: "overview", title: "스택 머신 & 가스 모델" },
      { id: "execution-flow", title: "트랜잭션 → EVM 실행 흐름" },
      { id: "call-flow", title: "EVM 구조 & Call() 흐름" },
      { id: "call-branches", title: "Call() 내부 분기" },
      { id: "interpreter-loop", title: "인터프리터 루프 (Run)" },
      { id: "opcodes", title: "EVM 구성요소 & 오피코드" },
      { id: "state-model", title: "상태 모델: 어카운트 & 트라이" },
    ],
    component: () => import("@/pages/articles/blockchain/evm-fundamentals"),
  },
  {
    slug: "evm-advanced",
    title: "EVM 심화: Create · DelegateCall · StaticCall",
    subcategory: "eth-core",
    sections: [
      { id: "overview", title: "실행 컨텍스트를 읽는 법" },
      { id: "create-flow", title: "CREATE & CREATE2" },
      {
        id: "delegate-static",
        title: "DelegateCall · StaticCall · Selfdestruct",
      },
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
