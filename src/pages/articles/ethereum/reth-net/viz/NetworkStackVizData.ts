import { defineNarrativeFlow } from "@/components/viz/narrative-flow";

export const STEPS = defineNarrativeFlow([
  {
    label: "discovery에서 dial 후보를 찾고 품질을 갱신한다",
    body: "bootnodes와 discv4/discv5 table은 시작점이며, 발견된 모든 endpoint가 곧바로 trusted session이 되는 것은 아니다.",
  },
  {
    label: "connection manager가 outbound·inbound 한도를 적용한다",
    body: "중복 peer, ban, direction, slot 예산을 확인한 뒤 transport connection을 수립한다.",
  },
  {
    label: "RLPx handshake가 암호화 session을 만든다",
    body: "인증 handshake와 capability 교환을 거쳐 frame secret과 상대 identity를 확인한다.",
  },
  {
    label: "공통 capability 중 사용할 protocol version을 협상한다",
    body: "eth version은 양쪽이 지원하는 범위에서 정해지므로 특정 버전을 전체 network의 고정값처럼 두지 않는다.",
  },
  {
    label: "session task가 request·response와 gossip을 분리한다",
    body: "block·header 요청, transaction 전파, timeout과 peer reputation을 connection lifecycle 안에서 조정한다.",
  },
]);
