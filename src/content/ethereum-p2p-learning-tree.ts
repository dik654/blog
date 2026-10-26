export type EthereumP2PLearningTrack = "concept" | "practice" | "reference";

export type EthereumP2PLearningNodeId =
  | "node-map"
  | "fork-filter"
  | "reth-p2p"
  | "chain-config";

export interface EthereumP2PLearningNode {
  id: EthereumP2PLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  track: EthereumP2PLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
}

export const ETHEREUM_P2P_LEARNING_NODES: readonly EthereumP2PLearningNode[] = [
  {
    id: "node-map",
    href: "/cs/blockchain/node-architecture#deeper",
    shortTitle: "노드 전체 지도",
    mapLabel: "요청 → 실행 → 기록 선택",
    track: "concept",
    parentHref: "/cs/blockchain?sub=eth-core",
    parentLabel: "블록체인 · 이더리움 핵심 프로토콜",
    question: "실행 클라이언트의 P2P 영역은 노드 전체 흐름에서 어떤 자료를 들여올까요?",
    closure: "실행 P2P는 다른 노드에서 거래와 블록 자료를 가져오는 경계입니다. 주소 발견, 체인 호환성, 자료 유효성은 서로 다른 검사입니다.",
  },
  {
    id: "fork-filter",
    href: "/cs/blockchain/fork-id#overview",
    shortTitle: "Fork ID",
    mapLabel: "과거 fork 요약 → 양방향 판정",
    track: "concept",
    parentHref: "/cs/blockchain/node-architecture#deeper",
    parentLabel: "이더리움 노드 · 실행 클라이언트 지도",
    question: "긴 동기화를 시작하기 전에 다른 체인과 단순히 뒤처진 노드를 어떻게 구분할까요?",
    closure: "Fork ID는 genesis와 이미 지난 fork를 짧게 요약하고 다음 fork를 덧붙입니다. 양쪽은 local head와 schedule로 상대의 sync 위치를 설명할 수 있을 때만 호환 가능하다고 판단합니다.",
  },
  {
    id: "reth-p2p",
    href: "/cs/blockchain/reth-net#overview",
    shortTitle: "Reth P2P",
    mapLabel: "후보 주소 → 세션 → 자료 교환",
    track: "practice",
    parentHref: "/cs/blockchain/fork-id#validation",
    parentLabel: "Fork ID · 호환성 판정",
    question: "Fork ID를 포함한 호환성 검사는 실제 Reth 피어 생명주기의 어느 단계에서 실패를 정리할까요?",
    closure: "Reth의 실행 P2P는 발견한 주소를 곧바로 피어로 믿지 않습니다. transport·암호화 세션·capability·status를 통과한 뒤에야 거래와 블록 자료를 주고받습니다.",
  },
  {
    id: "chain-config",
    href: "/cs/blockchain/reth-chainspec#hardfork",
    shortTitle: "ChainSpec",
    mapLabel: "genesis·fork schedule의 구현 근거",
    track: "reference",
    parentHref: "/cs/blockchain/fork-id#forkhash",
    parentLabel: "Fork ID · 계산 입력",
    question: "구현은 어느 genesis와 fork schedule을 권위 있는 계산 입력으로 사용할까요?",
    closure: "Fork ID의 계산과 판정은 구현이 가진 ChainSpec에 의존합니다. 같은 알고리즘도 genesis·fork schedule·활성 조건이 다르면 다른 식별자를 만듭니다.",
  },
] as const;

export function getEthereumP2PLearningNode(id: EthereumP2PLearningNodeId) {
  const node = ETHEREUM_P2P_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`이더리움 P2P 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getEthereumP2PTrackNodes(track: EthereumP2PLearningTrack) {
  return ETHEREUM_P2P_LEARNING_NODES.filter((node) => node.track === track);
}
