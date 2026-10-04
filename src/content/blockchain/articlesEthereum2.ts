import type { Article } from "../types";

export const ethereum2Articles: Article[] = [
  {
    slug: "glamsterdam-block-execution",
    title: "Glamsterdam: ePBS와 블록 접근 목록의 실행 경로",
    subcategory: "eth-scaling",
    sections: [
      {
        "id": "overview",
        "title": "같은 블록을 더 잘 전달하고 실행하려면 무엇을 바꿔야 하는가"
      },
      {
        "id": "black-box",
        "title": "내용을 만드는 사람, 고르는 사람, 검사하는 사람"
      },
      {
        "id": "case",
        "title": "100에서10을 빼고5를 더하면 마지막 값은95다"
      },
      {
        "id": "picture",
        "title": "최종95만이 아니라 첫 거래 뒤90도 전달한다"
      },
      {
        "id": "need",
        "title": "다음 거래가 읽을 위치를 모르면 준비를 뒤늦게 시작한다"
      },
      {
        "id": "names",
        "title": "BAL은 실행 자료이고 ePBS는 제작·제안의 규칙이다"
      },
      {
        "id": "mechanism",
        "title": "서명한 약속, 실제 내용, 접근 목록을 차례로 검사한다"
      },
      {
        "id": "source",
        "title": "개발 명세는 bid와 payload를 서로 다른 구조로 둔다"
      },
      {
        "id": "comparison",
        "title": "접근 목록을 받더라도 실제 실행과 맞는지 확인한다"
      },
      {
        "id": "limits",
        "title": "병렬 실행 가능성과 실제 처리량 개선은 같지 않다"
      }
    ],
    component: () => import("@/pages/articles/blockchain/glamsterdam-block-execution"),
  },
  {
    slug: "robinhood-chain-settlement",
    title: "Robinhood Chain: 전송 확정·브리지 인출·Stock Token 권리",
    subcategory: "eth-scaling",
    sections: [
      {
        "id": "overview",
        "title": "체인에서 보낸 자산이 언제 도착했고 무엇을 소유하게 됐는가"
      },
      {
        "id": "black-box",
        "title": "전송을 승인한 뒤 누가 기록하고 지급하는가"
      },
      {
        "id": "case",
        "title": "100개에서10개를 보내고 받은 사람이5개를 인출한다"
      },
      {
        "id": "picture",
        "title": "B의10개가 한 번만 이동하도록 기록한다"
      },
      {
        "id": "need",
        "title": "빠른 영수증과 L1 인출 대기에는 서로 다른 이유가 있다"
      },
      {
        "id": "names",
        "title": "Soft confirmation·L1 finality·withdrawal을 구별한다"
      },
      {
        "id": "mechanism",
        "title": "A의 전송에서 B의 L1 수령까지 따라간다"
      },
      {
        "id": "source",
        "title": "SDK의 CONFIRMED는 이미 지급했다는 뜻이 아니다"
      },
      {
        "id": "comparison",
        "title": "Stock Token10개를 받았어도 기초 주식의 주주가 되는 것은 아니다"
      },
      {
        "id": "limits",
        "title": "빠른 bridge와 공개 체인은 서로 다른 추가 조건을 갖는다"
      }
    ],
    component: () => import("@/pages/articles/blockchain/robinhood-chain-settlement"),
  },
  /* ── Scaling & L2 ── */
  {
    slug: "rollup-fundamentals",
    title: "롤업 기초: Optimistic vs ZK Rollup",
    subcategory: "eth-scaling",
    sections: [
  {
    "id": "overview",
    "title": "1. 계산을 나누되 다른 사람도 결과를 확인하게 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 요청 수신·입력 공개·재계산·결과 채택으로 나눕니다"
  },
  {
    "id": "case",
    "title": "3. 100에서 10을 보내고 5를 돌려받으면 95입니다"
  },
  {
    "id": "parts",
    "title": "4. 빠르게 답하는 사람과 검증할 자료를 남기는 사람을 나눕니다"
  },
  {
    "id": "why-parts",
    "title": "5. 계산 증명만 있어도 숨겨진 거래를 읽을 수는 없습니다"
  },
  {
    "id": "names",
    "title": "6. L2 실행·데이터 가용성·L1 정산은 다른 책임입니다"
  },
  {
    "id": "derivation",
    "title": "7. 공개된 두 거래를 같은 순서로 복원합니다"
  },
  {
    "id": "derivation-source",
    "title": "8. 조각 번호가 이어지고 마지막 조각이 있어야 읽습니다"
  },
  {
    "id": "optimistic",
    "title": "9. 96이라는 주장을 두고 틀린 계산 지점을 좁힙니다"
  },
  {
    "id": "validity",
    "title": "10. 95로 이어지는 계산의 증명을 먼저 확인할 수도 있습니다"
  },
  {
    "id": "comparison",
    "title": "11. 누락·틀린 결과·기반 체인의 변경을 따로 검수합니다"
  }
],
    component: () => import("@/pages/articles/blockchain/rollup-fundamentals"),
  },
  {
    slug: "da-theory",
    title: "데이터 가용성 이론: DAS, DA Layer, EIP-4844",
    subcategory: "eth-scaling",
    sections: [
      { id: "glossary", title: "핵심 용어 & 배경 지식" },
      { id: "overview", title: "개요 & DA 문제" },
      { id: "das", title: "Data Availability Sampling" },
      { id: "da-layer", title: "Celestia, EigenDA, Avail" },
      { id: "eip-4844", title: "Blob 트랜잭션 & Proto-Danksharding" },
    ],
    component: () => import("@/pages/articles/blockchain/da-theory"),
  },
  {
    slug: "robinhood-chain-blob-demand",
    title: "Robinhood Chain과 블롭 수요: 평균·기여·BPO 회계",
    subcategory: "eth-scaling",
    sections: [
      {
        "id": "overview",
        "title": "블롭 수요에서 가격 압력과 특정 체인의 기여를 구분한다"
      },
      {
        "id": "black-box",
        "title": "게시하는 곳, 담는 곳, 합계를 읽는 곳"
      },
      {
        "id": "case",
        "title": "18개가 들어간 블록과 평균10개는 동시에 성립한다"
      },
      {
        "id": "picture",
        "title": "네 블록을 같은 시간 창으로 묶는다"
      },
      {
        "id": "need",
        "title": "많이 사용한 순간만으로 공급 부족을 판단할 수 없다"
      },
      {
        "id": "target-vs-average",
        "title": "목표·상한·평균·초과분에 이름을 붙인다"
      },
      {
        "id": "robinhood-chain-concentration",
        "title": "같은 블록 범위에서 사용량과 게시자를 다시 계산한다"
      },
      {
        "id": "source",
        "title": "기본값이 아니라 메인넷 일정에 연결된 값을 읽는다"
      },
      {
        "id": "bpo-sparse-blobpool",
        "title": "목표 상향과 전송 절감은 서로 다른 계산이다"
      },
      {
        "id": "reading-checklist",
        "title": "측정한 범위보다 큰 결론을 내리지 않는다"
      }
    ],
    component: () => import("@/pages/articles/blockchain/robinhood-chain-blob-demand"),
  },

  /* ── Privacy (심층 코드 추적) ── */
  {
    slug: "railgun",
    title: "RAILGUN: note·nullifier·proof/contract artifact 경계",
    subcategory: "eth-privacy",
    sections: [
      { id: "overview", title: "10→6+4 private transfer 입구" },
      { id: "note-state", title: "Note·commitment·nullifier 상태 전이" },
      { id: "proof-artifact", title: "Proof·contract·relayer artifact" },
      { id: "release", title: "Privacy·soundness release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/railgun"),
  },
  /* ── Helios (Light Client) ── */
  {
    slug: "helios",
    title: "Helios 아키텍처 개요",
    subcategory: "eth-helios",
    sections: [{ id: "overview", title: "아키텍처 개요" }],
    component: () => import("@/pages/articles/ethereum/helios"),
  },
  {
    slug: "helios-bootstrap",
    title: "Helios Checkpoint Sync & 부트스트랩",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "Trusted root에서 store까지" },
      { id: "checkpoint-sources", title: "체크포인트 source와 provenance" },
      { id: "weak-subjectivity", title: "Weak subjectivity와 freshness" },
      { id: "fetch-checkpoint", title: "요청·decode 경계" },
      { id: "bootstrap-response", title: "응답의 세 증거" },
      { id: "committee-branch", title: "Committee Merkle branch" },
      { id: "store-init", title: "Store 원자적 초기화" },
      { id: "first-update", title: "첫 update와 확정성" },
      { id: "error-cases", title: "실패 분류와 release gate" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-bootstrap"),
  },
  {
    slug: "helios-consensus",
    title: "Helios Sync Committee BLS 검증 & 교체",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "Update의 전체 검증 경로" },
      { id: "verify-trace", title: "Participation·domain·BLS·branch" },
      { id: "committee-lifecycle", title: "Committee period와 핸드오프" },
      { id: "sync-loop", title: "Sync loop와 release gate" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-consensus"),
  },
  {
    slug: "helios-update",
    title: "Helios Light Client Update",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "왜 Update가 필요한가" },
      { id: "update-types", title: "OptimisticUpdate vs FinalityUpdate" },
      {
        id: "validate-update",
        title: "validate_light_client_update() 3가지 검사",
      },
      {
        id: "slot-comparison",
        title: "헤더 슬롯 비교 (optimistic vs finalized)",
      },
      { id: "apply-update", title: "apply_store_update() 내부" },
      { id: "best-update", title: "Best Update 선택 (다수 Update 도착 시)" },
      { id: "reorg-handling", title: "경량 클라이언트의 Reorg 처리" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-update"),
  },
  {
    slug: "helios-state",
    title: "Helios State Proof & Merkle-Patricia 검증",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "왜 상태 증명인가 (로컬 상태 없이 검증)" },
      { id: "eip1186", title: "EIP-1186 eth_getProof 포맷" },
      { id: "account-proof", title: "Account Proof 검증 (keccak 경로)" },
      { id: "storage-proof", title: "Storage Proof 검증 (중첩 트라이)" },
      {
        id: "rlp-decode",
        title: "RLP 디코딩 (nonce · balance · storageRoot · codeHash)",
      },
      { id: "proof-caching", title: "증명 캐싱 전략" },
      { id: "error-cases", title: "에러 케이스 (누락 · 잘못된 증명)" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-state"),
  },
  {
    slug: "helios-execution",
    title: "Helios Execution RPC",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "왜 로컬 실행인가 (RPC 결과를 신뢰할 수 없음)" },
      { id: "proof-db", title: "ProofBeacon DB는 block·state·checkpoint를 서로 다른 조회 축으로 저장한다 (증명 기반 가상 DB)" },
      { id: "eth-call", title: "eth_call: revm 로컬 실행" },
      { id: "get-balance", title: "eth_getBalance 구현" },
      { id: "get-code", title: "eth_getCode 구현" },
      { id: "get-storage", title: "eth_getStorageAt 구현" },
      { id: "get-logs", title: "eth_getLogs: Bloom Filter 필터링" },
      { id: "send-tx", title: "eth_sendRawTransaction (유일한 신뢰 지점)" },
      { id: "gas-estimation", title: "가스 추정 (경량 클라이언트 기반)" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-execution"),
  },
  {
    slug: "helios-types",
    title: "Helios 타입 시스템",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "타입과 검증 책임의 경계" },
      { id: "core-types", title: "Header · Aggregate · Update · Store" },
      { id: "encoding", title: "SSZ · Fork · Domain" },
      { id: "ssz-internal", title: "Merkle root · generalized index" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-types"),
  },
  {
    slug: "helios-config",
    title: "Helios 설정 · 캐싱 · 네트워크",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "설정과 trust boundary" },
      { id: "network-config", title: "Network · fork · endpoint" },
      { id: "client-init", title: "Builder · startup · readiness" },
      { id: "persistence", title: "Checkpoint cache · fallback" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-config"),
  },
  {
    slug: "kohaku-provider",
    title: "Kohaku Provider: 공통 API와 method별 신뢰 경계",
    subcategory: "eth-privacy",
    sections: [
      { id: "overview", title: "Provider adapter가 통일하는 것" },
      { id: "provider-capabilities", title: "공통 method와 의미 정규화" },
      { id: "trust-signing", title: "검증 경로·bypass·signer 분리" },
      { id: "release", title: "Parity·privacy·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/kohaku-provider"),
  },
  {
    slug: "webcat-frontend-integrity",
    title: "WEBCAT: 서명 manifest와 frontend code transparency",
    subcategory: "eth-privacy",
    sections: [
      { id: "overview", title: "HTTPS 뒤의 frontend integrity gap" },
      { id: "signed-manifest", title: "서명 manifest와 재현 가능한 build" },
      { id: "local-verification", title: "Browser local verification" },
      { id: "transparency-release", title: "Transparency log·alpha 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/webcat-frontend-integrity"),
  },
  {
    slug: "pq-account",
    title: "양자내성 계정: 송금·검증·nonce·복구 이전",
    subcategory: "eth-privacy",
    sections: [
      {
            "id": "overview",
            "title": "계정의 서명을 바꿔도 돈을 보내는 모든 권한이 함께 바뀌어야 한다"
      },
      {
            "id": "black-box",
            "title": "요청 작성, 권한 검사, 실행, 비용 지급은 다른 역할이다"
      },
      {
            "id": "case",
            "title": "계정 1 ETH, 비용 예치금 0.02 ETH에서 0.1 ETH를 보낸다"
      },
      {
            "id": "picture",
            "title": "잔액·예치금·요청 순번이 바뀌는 시점을 나눈다"
      },
      {
            "id": "need",
            "title": "서명 성공만으로 재사용 방지와 송금 성공을 보장할 수 없다"
      },
      {
            "id": "names",
            "title": "요청 객체, EntryPoint, 예치금, nonce의 이름"
      },
      {
            "id": "account-abstraction-validation",
            "title": "검증을 통과한 0.1 ETH 요청을 실행하고 정산한다"
      },
      {
            "id": "source",
            "title": "실제 원본은 EIP-712 해시와 두 실행 단계를 보여 준다"
      },
      {
            "id": "ml-dsa-signature-boundary",
            "title": "서명 표준·체인 실행 능력·전환 권한을 따로 확인한다"
      },
      {
            "id": "migration-release",
            "title": "새 서명 실패와 복구 때도 허용한 권한만 돈을 움직이게 한다"
      }
],
    component: () => import("@/pages/articles/blockchain/pq-account"),
  },
  {
    slug: "ethereum-future-roadmap",
    title: "Ethereum 로드맵: 제안·시험·메인넷 적용 구분",
    subcategory: "eth-scaling",
    sections: [
      {
        "id": "overview",
        "title": "이름이 발표된 변화가 언제부터 내 거래의 규칙이 되는가"
      },
      {
        "id": "black-box",
        "title": "연구자·구현자·운영자는 서로 다른 결과물을 만든다"
      },
      {
        "id": "case",
        "title": "10월4일에 10월6일 시험 일정을 읽었다면"
      },
      {
        "id": "picture",
        "title": "문서 상태와 배포 상태를 같은 행에 적는다"
      },
      {
        "id": "need",
        "title": "시험 성공과 서비스의 지원 가능성은 다른 질문이다"
      },
      {
        "id": "names",
        "title": "문서의 Review와 업그레이드의 SFI를 분리한다"
      },
      {
        "id": "mechanism",
        "title": "제안에서 활성화 후 관측까지 한 줄로 추적한다"
      },
      {
        "id": "source",
        "title": "활성화라는 말에는 실제 네트워크 조건이 붙는다"
      },
      {
        "id": "comparison",
        "title": "Hegotá와 연구 로드맵에도 같은 질문을 던진다"
      },
      {
        "id": "formal-simplification",
        "title": "검사할 명제가 잘못되면 증명이 있어도 목표를 놓친다"
      }
    ],
    component: () => import("@/pages/articles/blockchain/ethereum-future-roadmap"),
  },
];
