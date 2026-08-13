export interface SessionState {
  id: string;
  label: string;
  desc: string;
  color: string;
}

export const SESSION_STATES: readonly SessionState[] = [
  {
    id: "pending",
    label: "Pending transport",
    desc: "dial 또는 accept 뒤 RLPx auth/ack와 Hello를 진행한다. 이 단계의 socket은 아직 ETH request를 받을 수 없다.",
    color: "#f59e0b",
  },
  {
    id: "negotiated",
    label: "Protocol ready",
    desc: "공통 capability와 version을 고르고 Status compatibility를 확인한다. 실패 원인은 disconnect reason으로 보존한다.",
    color: "#0ea5e9",
  },
  {
    id: "active",
    label: "Active / closing",
    desc: "request·response와 gossip을 처리한다. 종료 시 active map, pending work와 peer policy를 일관되게 정리한다.",
    color: "#10b981",
  },
] as const;
