export type EvmLearningTrack = "concept" | "practice" | "reference";

export type EvmLearningNodeId =
  | "machine"
  | "nested-frames"
  | "client-execution"
  | "active-rules";

export interface EvmLearningNode {
  id: EvmLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  track: EvmLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
}

export const EVM_LEARNING_NODES: readonly EvmLearningNode[] = [
  {
    id: "machine",
    href: "/cs/blockchain/evm-fundamentals#overview",
    shortTitle: "한 프레임",
    mapLabel: "바이트코드 → 기계 상태",
    track: "concept",
    parentHref: "/cs/blockchain/node-architecture#case",
    parentLabel: "이더리움 노드 · 거래 실행",
    question: "EVM은 바이트코드 한 줄을 읽을 때 stack·memory·gas·state를 어떻게 바꿀까요?",
    closure: "EVM은 같은 실행 입력과 활성 규칙에서 opcode를 한 줄씩 적용합니다. stack·memory는 프레임 안에 머물고, 오래 남는 상태 변경은 별도 journal 경계를 거칩니다.",
  },
  {
    id: "nested-frames",
    href: "/cs/blockchain/evm-advanced#overview",
    shortTitle: "중첩 프레임",
    mapLabel: "호출 종류 → 권한·되돌림",
    track: "concept",
    parentHref: "/cs/blockchain/evm-fundamentals#release",
    parentLabel: "EVM 기초 · 종료와 되돌림",
    question: "다른 계약의 코드를 실행할 때 누구의 storage·sender·value와 쓰기 권한을 사용할까요?",
    closure: "CALL 계열 opcode는 새 프레임의 코드·현재 주소·호출자·값·쓰기 권한을 정합니다. 하위 프레임의 실패는 성공 여부와 반환 데이터로 상위 프레임에 돌아가며, 상위 프레임이 전파할지 처리할지 결정합니다.",
  },
  {
    id: "client-execution",
    href: "/cs/blockchain/reth-block-execution#overview",
    shortTitle: "클라이언트 실행",
    mapLabel: "블록 → EVM → 상태 묶음",
    track: "practice",
    parentHref: "/cs/blockchain/evm-advanced#return-map",
    parentLabel: "EVM 심화 · 프레임 결과",
    question: "실행 클라이언트는 블록의 거래를 EVM에 넣고 결과를 어떤 상태 묶음으로 모을까요?",
    closure: "Reth는 체인 규칙을 적용한 EVM으로 거래를 실행하고 receipt와 상태 변경 묶음을 다음 저장 단계에 넘깁니다. 프로토콜 의미와 클라이언트 내부 자료 구조는 구분해야 합니다.",
  },
  {
    id: "active-rules",
    href: "/cs/blockchain/reth-chainspec#hardfork",
    shortTitle: "활성 규칙",
    mapLabel: "체인 설정 → fork 선택",
    track: "reference",
    parentHref: "/cs/blockchain/evm-fundamentals#gas-state",
    parentLabel: "EVM 기초 · 규칙과 실행 예산",
    question: "클라이언트는 블록 높이와 시각에 맞는 opcode·gas 규칙을 어디에서 고를까요?",
    closure: "같은 바이트코드도 활성 fork가 다르면 유효성이나 비용이 달라질 수 있습니다. 구현을 읽을 때는 ChainSpec과 선택된 규칙 묶음을 함께 고정해야 합니다.",
  },
] as const;

export function getEvmLearningNode(id: EvmLearningNodeId) {
  const node = EVM_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`EVM 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getEvmTrackNodes(track: EvmLearningTrack) {
  return EVM_LEARNING_NODES.filter((node) => node.track === track);
}
