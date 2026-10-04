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
  {
    "id": "overview",
    "title": "1. 여러 컴퓨터가 같은 지시를 실행해 같은 결과를 얻습니다"
  },
  {
    "id": "black-box",
    "title": "2. 실행 조건을 준비하고, 한 줄씩 계산하고, 결과를 정리합니다"
  },
  {
    "id": "case",
    "title": "3. 2와 3을 올리고 더하는 데 예산 9를 씁니다"
  },
  {
    "id": "parts",
    "title": "4. 지금 위치, 임시 값, 오래 남는 값을 따로 보관합니다"
  },
  {
    "id": "why-parts",
    "title": "5. 명령 바이트와 숫자 바이트를 구분해야 합니다"
  },
  {
    "id": "names",
    "title": "6. EVM은 정해진 명령 규칙을 실행하는 가상 머신입니다"
  },
  {
    "id": "machine-step",
    "title": "7. 60 02 60 03 01 00을 한 명령씩 읽습니다"
  },
  {
    "id": "word-rule",
    "title": "8. 256비트를 넘은 덧셈 결과는 나머지만 남습니다"
  },
  {
    "id": "reference-code",
    "title": "9. add 함수가 두 값을 꺼내고 예산과 위치를 바꿉니다"
  },
  {
    "id": "gas-state",
    "title": "10. 실행 예산과 되돌릴 범위는 서로 다른 기록입니다"
  },
  {
    "id": "release",
    "title": "11. 정상 종료, REVERT, 예외 종료를 구분합니다"
  }
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
