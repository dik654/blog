import type { Article } from "../types";

export const ethereumArticles: Article[] = [
  /* ── Core Protocol: 이더리움 자체 ── */
  {
    slug: "node-architecture",
    title: "이더리움 노드 한 대: 계산과 기록 선택이 만나는 과정",
    subcategory: "eth-core",
    sections: [
  {
    "id": "overview",
    "title": "1. 전체 구조"
  },
  {
    "id": "black-box",
    "title": "2. 요청 흐름"
  },
  {
    "id": "case",
    "title": "3. 잔액 계산"
  },
  {
    "id": "parts",
    "title": "4. 두 저장소"
  },
  {
    "id": "why-parts",
    "title": "5. 자료 부족"
  },
  {
    "id": "payload-state",
    "title": "6. 상태 구분"
  },
  {
    "id": "release",
    "title": "7. 다시 전체로"
  },
  {
    "id": "deeper",
    "title": "8. 다음 글"
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
  {
    "id": "overview",
    "title": "1. 잠깐 쓰는 열쇠에 지갑 전체를 맡기지 않으려면"
  },
  {
    "id": "black-box",
    "title": "2. 요청을 모으는 쪽과 돈을 움직이는 쪽이 다릅니다"
  },
  {
    "id": "case",
    "title": "3. 잔액 200에서 40을 보내고 권한 60을 남깁니다"
  },
  {
    "id": "picture",
    "title": "4. 7번 요청은 권한 검사와 비용 정산을 통과합니다"
  },
  {
    "id": "need",
    "title": "5. 서명이 맞아도 금액과 상대를 확인해야 합니다"
  },
  {
    "id": "names",
    "title": "6. 이제 UserOperation·bundler·EntryPoint에 이름을 붙입니다"
  },
  {
    "id": "erc4337",
    "title": "7. 7번 요청이 접수에서 실제 송금으로 갑니다"
  },
  {
    "id": "prefund",
    "title": "8. 예약한 0.003 ETH 중 0.002 ETH를 돌려줍니다"
  },
  {
    "id": "source",
    "title": "9. 실제 코드는 검증과 실행을 따로 호출합니다"
  },
  {
    "id": "native-aa",
    "title": "10. EIP-7702는 기존 주소에 실행할 코드를 연결합니다"
  },
  {
    "id": "use-cases",
    "title": "11. 배치와 패스키에도 각각의 권한 검사가 필요합니다"
  },
  {
    "id": "recovery",
    "title": "12. 잃어버린 열쇠를 복구하면 이전 권한도 정리합니다"
  },
  {
    "id": "limits",
    "title": "13. 접수 성공, 송금 성공, 비용 확정을 따로 확인합니다"
  }
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
