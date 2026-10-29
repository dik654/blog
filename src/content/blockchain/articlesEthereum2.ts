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
    title: "데이터 가용성: 조각 검증에서 복원까지",
    subcategory: "eth-scaling",
    sections: [
      { id: "overview", title: "한 자료 묶음의 전체 경로" },
      { id: "black-box", title: "늘리기부터 복원까지" },
      { id: "case", title: "4→8 조각 사례" },
      { id: "separation", title: "세 실패 경계" },
      { id: "names", title: "표준 이름" },
      { id: "erasure-code", title: "복원 규칙" },
      { id: "eip4844", title: "EIP-4844 전체 수신" },
      { id: "kzg", title: "KZG 조각 증거" },
      { id: "peerdas", title: "PeerDAS 열 표본" },
      { id: "celestia", title: "Celestia 2차원 확장" },
      { id: "sampling", title: "표본 확률" },
      { id: "comparison", title: "세 구조 비교" },
      { id: "failure-boundaries", title: "실패 경계" },
      { id: "self-check", title: "확인 문제" },
    ],
    component: () => import("@/pages/articles/blockchain/da-theory"),
  },
  {
    slug: "da-validation",
    title: "데이터 가용성 변경 검증: 장애·복구·Rollback",
    subcategory: "eth-scaling",
    sections: [
      { id: "overview", title: "개념에서 운영 변경으로" },
      { id: "environment", title: "실험 입력" },
      { id: "ownership", title: "상태 소유권" },
      { id: "baseline", title: "정상 기준선" },
      { id: "experiment", title: "장애별 실험" },
      { id: "failure", title: "실패 판정" },
      { id: "recovery", title: "격리·Rollback·재진입" },
      { id: "metrics", title: "측정 순서" },
      { id: "decision", title: "결정" },
      { id: "evidence", title: "근거와 미측정값" },
    ],
    component: () => import("@/pages/articles/blockchain/da-validation"),
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
    title: "RAILGUN 비공개 송금: note에서 contract state까지",
    subcategory: "eth-privacy",
    sections: [
      { id: "overview", title: "값 10 note의 비공개 송금" },
      { id: "black-box", title: "Wallet·회로·Broadcaster·계약" },
      { id: "state", title: "Commitment tree와 nullifier" },
      { id: "circuit", title: "JoinSplit이 확인하는 관계" },
      { id: "artifact", title: "Proof와 boundParams 결속" },
      { id: "contract", title: "계약의 원자적 상태 전이" },
      { id: "visibility", title: "숨겨지는 정보와 남는 메타데이터" },
      { id: "failure-boundaries", title: "검사별 실패 경계" },
      { id: "sources", title: "버전을 고정한 근거" },
      { id: "self-check", title: "읽고 바로 확인할 질문" },
      { id: "return-map", title: "부모 지도에 돌려줄 사실" },
    ],
    component: () => import("@/pages/articles/blockchain/railgun"),
  },
  {
    slug: "railgun-validation",
    title: "RAILGUN 변경 검증: contract·circuit·wallet state",
    subcategory: "eth-privacy",
    sections: [
      { id: "overview", title: "변경 검증의 출발점" },
      { id: "environment", title: "실험 입력" },
      { id: "ownership", title: "상태 소유권" },
      { id: "baseline", title: "가장 작은 기준선" },
      { id: "experiment", title: "부정 입력과 중단 실험" },
      { id: "failure", title: "실패 판정" },
      { id: "recovery", title: "격리·되돌리기·재진입" },
      { id: "metrics", title: "측정 순서" },
      { id: "decision", title: "결정" },
      { id: "evidence", title: "근거와 미확인값" },
      { id: "return-map", title: "부모 지도에 돌려줄 사실" },
    ],
    component: () => import("@/pages/articles/blockchain/railgun-validation"),
  },
  /* ── Helios (Light Client) ── */
  {
    slug: "helios",
    title: "Helios: 검증된 block에서 local RPC까지",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "전체 지도" },
      { id: "trust-preparation", title: "Trust path" },
      { id: "request-path", title: "Request path" },
      { id: "evidence-boundary", title: "검증 조건" },
      { id: "boundary", title: "결과 경계" },
      { id: "sources", title: "근거" },
      { id: "self-check", title: "확인 질문" },
      { id: "return-map", title: "부모 지도" },
    ],
    component: () => import("@/pages/articles/ethereum/helios"),
  },
  {
    slug: "helios-bootstrap",
    title: "Helios 부트스트랩: Checkpoint C에서 Store S1까지",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "전체 경로" },
      { id: "checkpoint-sources", title: "신뢰 시작점" },
      { id: "weak-subjectivity", title: "나이와 안전 기간" },
      { id: "fetch-checkpoint", title: "요청과 decode" },
      { id: "bootstrap-response", title: "H·K·B" },
      { id: "committee-branch", title: "두 root 대조" },
      { id: "store-init", title: "Store S1" },
      { id: "first-update", title: "첫 update" },
      { id: "error-cases", title: "실패 경계와 근거" },
      { id: "return-map", title: "부모 지도" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-bootstrap"),
  },
  {
    slug: "helios-consensus",
    title: "Helios Consensus update는 어떻게 검증할까요?",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "Update의 전체 검증 경로" },
      { id: "verify-trace", title: "Update 검증 순서" },
      { id: "committee-lifecycle", title: "Committee period와 핸드오프" },
      { id: "sync-loop", title: "Sync loop와 Store 경계" },
      { id: "self-check", title: "확인 질문" },
      { id: "return-map", title: "부모 지도" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-consensus"),
  },
  {
    slug: "helios-update",
    title: "검증된 Helios update는 Store를 어떻게 바꿀까요?",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "전체 전이" },
      { id: "store-input", title: "검증된 입력과 Store T0" },
      { id: "candidate-state", title: "후보와 참여 최댓값" },
      { id: "optimistic-transition", title: "Optimistic 전진" },
      { id: "finality-transition", title: "Finality 적용" },
      { id: "committee-handoff", title: "Committee handoff" },
      { id: "checkpoint-output", title: "Checkpoint 출력" },
      { id: "best-update", title: "Best update 순서" },
      { id: "force-update", title: "Force update 경계" },
      { id: "self-check", title: "확인 질문" },
      { id: "return-map", title: "부모 지도" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-update"),
  },
  {
    slug: "helios-state",
    title: "Helios는 원격 state 값을 어떻게 검증할까요?",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "한 요청 전체 경로" },
      { id: "anchor-chain", title: "Block과 state root" },
      { id: "eip1186", title: "EIP-1186 응답" },
      { id: "account-proof", title: "Account proof" },
      { id: "storage-proof", title: "Storage proof" },
      { id: "rlp-decode", title: "포함과 부재" },
      { id: "mpt-traversal", title: "MPT 검증식" },
      { id: "proof-caching", title: "Cache identity" },
      { id: "error-cases", title: "실패 경계" },
      { id: "self-check", title: "확인 질문" },
      { id: "return-map", title: "부모 지도" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-state"),
  },
  {
    slug: "helios-execution",
    title: "Helios는 eth_call을 어떻게 검증할까요?",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "eth_call 한 건" },
      { id: "request-contract", title: "입력 고정" },
      { id: "proof-db", title: "ProofDB miss와 보충" },
      { id: "prefetch", title: "Access-list hint" },
      { id: "eth-call", title: "같은 입력 replay" },
      { id: "failure-boundary", title: "실패 경계" },
      { id: "rpc-methods", title: "메서드별 근거" },
      { id: "get-balance", title: "State 조회" },
      { id: "gas-estimation", title: "Gas 추정" },
      { id: "get-logs", title: "Receipt·log" },
      { id: "send-tx", title: "Broadcast" },
      { id: "self-check", title: "확인 질문" },
      { id: "return-map", title: "부모 지도" },
    ],
    component: () => import("@/pages/articles/ethereum/helios-execution"),
  },
  {
    slug: "helios-types",
    title: "Helios는 JSON update를 어떻게 검증 입력으로 바꿀까요?",
    subcategory: "eth-helios",
    sections: [
      { id: "overview", title: "JSON 한 건의 전체 경로" },
      { id: "json-decode", title: "HTTP JSON과 fork 타입" },
      { id: "fork-shape", title: "Electra의 객체 모양" },
      { id: "proof-context", title: "SSZ root와 서명" },
      { id: "validation-boundary", title: "후보와 Store의 경계" },
      { id: "self-check", title: "확인 질문" },
      { id: "return-map", title: "부모 지도" },
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
    title: "Kohaku Provider는 같은 API 뒤의 신뢰 경로를 어떻게 드러낼까요?",
    subcategory: "eth-privacy",
    sections: [
      { id: "overview", title: "getLogs 한 건의 전체 경로" },
      { id: "provider-interface", title: "EthereumProvider와 TxSigner" },
      { id: "getlogs-route", title: "Helios 기본 경로와 우회" },
      { id: "normalization", title: "타입 정규화와 provenance" },
      { id: "failure-boundary", title: "설계된 실패 동작" },
      { id: "evidence", title: "고정 소스와 근거 범위" },
      { id: "self-check", title: "확인 질문" },
      { id: "return-map", title: "부모 지도" },
    ],
    component: () => import("@/pages/articles/blockchain/kohaku-provider"),
  },
  {
    slug: "kohaku-provider-validation",
    title: "Kohaku Provider 변경을 어떻게 검증하고 되돌릴까요?",
    subcategory: "eth-privacy",
    sections: [
      { id: "overview", title: "검증 경로" },
      { id: "ownership", title: "상태 소유권" },
      { id: "baseline", title: "Baseline과 candidate" },
      { id: "experiment", title: "경로별 재생" },
      { id: "receipt-wait", title: "Receipt 대기" },
      { id: "failure-recovery", title: "복구와 재진입" },
      { id: "decision", title: "Proposed ADR" },
      { id: "evidence", title: "근거와 미측정" },
      { id: "return-map", title: "부모 지도" },
    ],
    component: () => import("@/pages/articles/blockchain/kohaku-provider-validation"),
  },
  {
    slug: "webcat-frontend-integrity",
    title: "WEBCAT: 서명 manifest와 frontend code transparency",
    subcategory: "eth-privacy",
    sections: [
      { id: "overview", title: "app.js 한 건의 전체 경로" },
      { id: "enrollment", title: "Enrollment preload" },
      { id: "signed-manifest", title: "Manifest와 bundle" },
      { id: "local-verification", title: "브라우저의 실행 전 검증" },
      { id: "failure-boundary", title: "차단과 남는 실패" },
      { id: "evidence", title: "공식 근거와 alpha 범위" },
      { id: "self-check", title: "확인 질문" },
      { id: "return-map", title: "부모 지도" },
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
