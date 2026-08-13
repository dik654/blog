export interface NetLayer {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
}

export const NET_LAYERS: readonly NetLayer[] = [
  {
    id: "discovery",
    label: "Discovery",
    role: "dial 후보 찾기",
    details:
      "discv4·discv5와 DNS discovery가 node identity와 reachable endpoint 후보를 공급한다.",
    why: "발견은 신뢰나 활성 연결을 뜻하지 않는다. 후보는 이후 정책과 handshake를 통과해야 한다.",
    color: "#6366f1",
  },
  {
    id: "connection",
    label: "Connection manager",
    role: "연결 정책 적용",
    details:
      "inbound·outbound 예산, 중복 연결, backoff와 peer reputation을 확인해 dial과 accept를 조정한다.",
    why: "연결 수와 timeout은 운영 설정이므로 프로토콜 상수로 문서화하지 않는다.",
    color: "#0ea5e9",
  },
  {
    id: "session",
    label: "RLPx session",
    role: "인증·암호화·multiplexing",
    details:
      "auth/ack와 Hello를 거쳐 frame secret과 상대 node identity, 공통 capabilities를 확정한다.",
    why: "transport lifecycle과 상위 eth message 처리를 분리하면 실패와 재연결의 책임이 명확해진다.",
    color: "#10b981",
  },
  {
    id: "eth-wire",
    label: "ETH wire",
    role: "chain data 교환",
    details:
      "협상된 eth version으로 Status, block·receipt 요청, transaction announcement와 응답을 처리한다.",
    why: "버전별 field와 message 차이는 negotiation 결과에 맞춰 decode해야 한다.",
    color: "#f59e0b",
  },
] as const;
