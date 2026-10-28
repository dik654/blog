import type { CodeRef } from "@/components/code/types";
import capabilitySource from "./codebase/reth-v2.8.1/capability.rs?raw";
import sessionAuthSource from "./codebase/reth-v2.8.1/session-auth.rs?raw";
import statusHandshakeSource from "./codebase/reth-v2.8.1/status-handshake.rs?raw";
import sessionTestSource from "./codebase/reth-v2.8.1/session-test.rs?raw";

export const RETH_NETWORK_PROJECT_META = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · d763342f",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
} as const;

export const rethNetworkCodeRefs: Record<string, CodeRef> = {
  "session-auth": {
    path: "reth-v2.8.1/crates/net/network/src/session/mod.rs",
    lang: "rust",
    highlight: [3, 54],
    desc: "ECIES identity를 Hello ID에 결속하고 ETH capability·Status 뒤에만 Established를 만드는 경계",
    annotations: [
      { lines: [3, 3], color: "sky", note: "ECIES가 증명한 remote public key를 세션 identity로 고정" },
      { lines: [17, 28], color: "rose", note: "Hello가 다른 ID를 말하면 즉시 종료" },
      { lines: [30, 42], color: "amber", note: "공유 ETH version이 없으면 Status 전에 종료" },
      { lines: [46, 54], color: "emerald", note: "Status까지 통과한 연결만 Established event 생성" },
    ],
    code: sessionAuthSource,
  },
  capability: {
    path: "reth-v2.8.1/crates/net/eth-wire/src/capability.rs",
    lang: "rust",
    highlight: [4, 49],
    desc: "이름과 version이 정확히 같은 capability의 교집합에서 이름별 최고 version을 선택",
    annotations: [
      { lines: [12, 27], color: "sky", note: "정확히 공유한 capability만 모아 이름별 최고 version 선택" },
      { lines: [29, 31], color: "rose", note: "교집합이 없으면 NoSharedCapabilities" },
      { lines: [34, 46], color: "emerald", note: "선택한 protocol별 message ID 영역 계산" },
    ],
    code: capabilitySource,
  },
  status: {
    path: "reth-v2.8.1/crates/net/eth-wire/src/handshake.rs",
    lang: "rust",
    highlight: [3, 55],
    desc: "ETH Status의 응답·크기·decode·genesis·version·chain·Fork ID를 검사",
    annotations: [
      { lines: [3, 11], color: "amber", note: "Status 응답이 없으면 세션을 열지 않음" },
      { lines: [13, 20], color: "rose", note: "크기와 선택한 version으로 decode" },
      { lines: [22, 48], color: "sky", note: "Genesis·protocol version·chain을 각각 대조" },
      { lines: [50, 52], color: "emerald", note: "Fork ID filter까지 통과해야 성공" },
    ],
    code: statusHandshakeSource,
  },
  "session-test": {
    path: "reth-v2.8.1/crates/net/network/tests/it/session.rs",
    lang: "rust",
    highlight: [4, 21],
    desc: "겹치는 version 집합에서 eth/67을 고르는 Reth 통합 테스트",
    annotations: [
      { lines: [6, 17], color: "sky", note: "양쪽이 광고하는 version 집합" },
      { lines: [20, 21], color: "emerald", note: "가장 높은 정확한 교집합은 eth/67" },
    ],
    code: sessionTestSource,
  },
};
