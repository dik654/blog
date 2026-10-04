import type { Article } from "../types";

export const ethereumArticles: Article[] = [
  /* ── Core Protocol: 이더리움 자체 ── */
  {
    slug: "node-architecture",
    title: "이더리움 실행 노드: EL·CL과 Engine API 경계",
    subcategory: "eth-core",
    sections: [
  {
    "id": "overview",
    "title": "1. 계산이 맞는 기록과 모두가 따를 기록을 구분합니다"
  },
  {
    "id": "black-box",
    "title": "2. 하나는 계산하고 다른 하나는 선택합니다"
  },
  {
    "id": "case",
    "title": "3. 100에서 10과 처리 비용을 빼는 후보를 받습니다"
  },
  {
    "id": "parts",
    "title": "4. 양쪽은 서로 다른 장부 상태를 기억합니다"
  },
  {
    "id": "why-parts",
    "title": "5. 자료가 없는 후보를 잘못된 후보로 저장하면 안 됩니다"
  },
  {
    "id": "names",
    "title": "6. 실행 클라이언트와 합의 클라이언트가 Engine API로 연결됩니다"
  },
  {
    "id": "el-cl-boundary",
    "title": "7. 새 후보를 검증하고 선택 상태를 따로 전달합니다"
  },
  {
    "id": "wire-source",
    "title": "8. 명세의 필드는 서로 다른 확인 결과를 담습니다"
  },
  {
    "id": "implementation",
    "title": "9. Reth는 연결되지 않은 후보를 SYNCING으로 구분합니다"
  },
  {
    "id": "payload-state",
    "title": "10. VALID·현재 head·최종 확정은 서로 다른 상태입니다"
  },
  {
    "id": "release",
    "title": "11. 재시작 뒤에도 같은 후보를 두 번 적용하지 않습니다"
  }
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
