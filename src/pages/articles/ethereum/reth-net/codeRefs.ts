import type { CodeRef } from "@/components/code/types";

import sessionRs from "./codebase/reth/session.rs?raw";
import ethWireRs from "./codebase/reth/eth_wire.rs?raw";
import discoveryRs from "./codebase/reth/discovery.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "net-session": {
    path: "reth/crates/net/network/src/session/mod.rs",
    code: sessionRs,
    lang: "rust",
    highlight: [8, 17],
    desc: "SessionManager 책임을 설명하기 위한 축약 snapshot. pending·active session과 event channel의 경계를 보여준다.",
    annotations: [
      { lines: [10, 13], color: "sky", note: "active + pending 세션 맵" },
      {
        lines: [14, 17],
        color: "emerald",
        note: "mpsc 채널 + max_sessions 제한",
      },
      {
        lines: [20, 26],
        color: "amber",
        note: "SessionEvent — 연결/해제/메시지 이벤트",
      },
    ],
  },
  "net-eth-wire": {
    path: "reth/crates/net/eth-wire-types/src/message.rs",
    code: ethWireRs,
    lang: "rust",
    highlight: [8, 34],
    desc: "ETH wire message enum의 축약 snapshot. 실제 지원 version과 variant는 현재 Reth source에서 확인해야 한다.",
    annotations: [
      {
        lines: [11, 12],
        color: "sky",
        note: "Status — 피어 상태 교환 (체인 ID, 제네시스)",
      },
      {
        lines: [14, 17],
        color: "emerald",
        note: "TX 전파 — 전체 데이터 또는 해시만 전송",
      },
      { lines: [19, 28], color: "amber", note: "블록/TX/영수증 요청-응답 쌍" },
    ],
  },
  "net-discovery": {
    path: "reth/crates/net/discv4/src/lib.rs",
    code: discoveryRs,
    lang: "rust",
    highlight: [8, 15],
    desc: "Discv4 discovery의 책임을 보여주는 축약 snapshot. 현재 Reth는 discv5와 DNS discovery도 함께 구성할 수 있다.",
    annotations: [
      {
        lines: [10, 15],
        color: "sky",
        note: "UdpSocket + KBucketsTable + bootnodes",
      },
      {
        lines: [18, 25],
        color: "emerald",
        note: "lookup — target에 가까운 노드 반복 탐색",
      },
      {
        lines: [28, 31],
        color: "amber",
        note: "refresh_buckets — 주기적 랜덤 lookup",
      },
    ],
  },
};
