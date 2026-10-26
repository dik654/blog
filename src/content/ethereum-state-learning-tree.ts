export type EthereumStateLearningTrack = "concept" | "practice" | "reference";

export type EthereumStateLearningNodeId =
  | "execution-state"
  | "mpt-proof"
  | "reth-update"
  | "reth-source";

export interface EthereumStateLearningNode {
  id: EthereumStateLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  track: EthereumStateLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
}

export const ETHEREUM_STATE_LEARNING_NODES: readonly EthereumStateLearningNode[] = [
  {
    id: "execution-state",
    href: "/cs/blockchain/evm-fundamentals#gas-state",
    shortTitle: "실행 상태",
    mapLabel: "EVM 변경 → 상태 기록",
    track: "concept",
    parentHref: "/cs/blockchain/evm-fundamentals#overview",
    parentLabel: "EVM · 한 요청의 실행",
    question: "EVM이 바꾼 계정과 저장 값은 실행 중 어디에 기록되고 언제 남을까요?",
    closure: "EVM은 실행 중 변경을 별도로 기록하고 성공한 범위만 다음 상태에 반영합니다. 이 상태를 블록 헤더의 짧은 값 하나로 검증하려면 인증 자료구조가 필요합니다.",
  },
  {
    id: "mpt-proof",
    href: "/cs/blockchain/merkle-patricia-trie#overview",
    shortTitle: "상태 증명",
    mapLabel: "주소 경로 → stateRoot",
    track: "concept",
    parentHref: "/cs/blockchain/evm-fundamentals#gas-state",
    parentLabel: "EVM 기초 · 상태 변경과 복구",
    question: "블록 헤더의 stateRoot 하나로 특정 계정 값이 그 상태에 속한다는 사실을 어떻게 확인할까요?",
    closure: "검증자는 신뢰하는 stateRoot에서 시작해 해시한 주소의 nibble 경로를 정확히 소비하고, 각 RLP 참조와 마지막 계정 값을 확인합니다. 값이나 경로가 달라지면 같은 root에 연결되지 않습니다.",
  },
  {
    id: "reth-update",
    href: "/cs/blockchain/reth-trie#overview",
    shortTitle: "Reth 갱신",
    mapLabel: "변경 계정 → 새 상태 루트",
    track: "practice",
    parentHref: "/cs/blockchain/merkle-patricia-trie#return-map",
    parentLabel: "MPT · 상태 증명",
    question: "Reth는 바뀐 계정 경로만 다시 계산해 다음 블록의 stateRoot를 어떻게 만들까요?",
    closure: "Reth는 변경된 접두 경로를 따라 필요한 노드만 다시 인코딩하고, 변하지 않은 하위 트리의 해시는 재사용해 새 상태 루트를 계산합니다.",
  },
  {
    id: "reth-source",
    href: "/cs/blockchain/reth-trie#paper-reth-trie-source",
    shortTitle: "Reth 원문",
    mapLabel: "개념 → 고정 버전 코드",
    track: "reference",
    parentHref: "/cs/blockchain/reth-trie#overview",
    parentLabel: "Reth trie · 고정 사례",
    question: "설명한 경로 갱신과 상태 루트 계산은 고정한 Reth 버전의 어느 코드에 있나요?",
    closure: "개념의 branch·extension·leaf와 RLP 참조는 클라이언트의 cursor·prefix set·node encoder 자료 구조로 구현됩니다. 구현을 읽을 때는 반드시 release를 고정합니다.",
  },
] as const;

export function getEthereumStateLearningNode(id: EthereumStateLearningNodeId) {
  const node = ETHEREUM_STATE_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Ethereum 상태 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getEthereumStateTrackNodes(track: EthereumStateLearningTrack) {
  return ETHEREUM_STATE_LEARNING_NODES.filter((node) => node.track === track);
}
