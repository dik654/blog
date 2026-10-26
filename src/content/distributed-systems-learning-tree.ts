export type DistributedSystemsLearningTrack = "concept" | "practice" | "reference";

export type DistributedSystemsLearningNodeId =
  | "system-model"
  | "smr"
  | "bft"
  | "open-membership"
  | "cometbft-consensus"
  | "consensus-comparison";

export interface DistributedSystemsLearningNode {
  id: DistributedSystemsLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  track: DistributedSystemsLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
}

export const DISTRIBUTED_SYSTEMS_LEARNING_NODES: readonly DistributedSystemsLearningNode[] = [
  {
    id: "system-model",
    href: "/cs/blockchain/distributed-systems#overview",
    shortTitle: "실행과 가정",
    mapLabel: "message order → model → guarantee",
    track: "concept",
    parentHref: "/cs/blockchain?sub=fundamentals",
    parentLabel: "블록체인 · 상태·네트워크·합의",
    question: "같은 프로그램을 실행한 노드들이 왜 다른 상태를 보고, 그 상황에서 보장이라는 말은 무엇을 전제로 할까요?",
    closure: "분산 프로토콜의 보장은 이름만으로 정해지지 않습니다. 메시지가 어떤 순서로 도착했는지, 어떤 지연과 고장을 허용했는지, 충돌 방지와 진행 중 무엇을 약속했는지를 함께 읽어야 합니다.",
  },
  {
    id: "smr",
    href: "/cs/blockchain/smr-theory#overview",
    shortTitle: "상태 머신 복제",
    mapLabel: "명령 순서 → commit → apply",
    track: "concept",
    parentHref: "/cs/blockchain/distributed-systems#overview",
    parentLabel: "분산 시스템 · 실행과 보장",
    question: "서로 다른 순서로 도착한 명령을 모든 복제본이 같은 순서로 실행하려면 어떤 상태를 합의해야 할까요?",
    closure: "상태 머신 복제는 같은 초기 상태에서 같은 명령을 같은 순서로 적용해 같은 결과를 만드는 구조입니다. 네트워크 수신과 결정된 로그, 적용된 상태를 구분해야 합니다.",
  },
  {
    id: "bft",
    href: "/cs/blockchain/bft-theory#overview",
    shortTitle: "비잔틴 합의",
    mapLabel: "모순 표 → 교집합 → lock",
    track: "concept",
    parentHref: "/cs/blockchain/distributed-systems#bft-theory",
    parentLabel: "분산 시스템 · 비잔틴 장애",
    question: "한 참여자가 서로 모순된 표를 보내도 두 개의 충돌한 결정을 막으려면 어떤 증거가 필요할까요?",
    closure: "서명은 발신자를 확인할 뿐 거짓말을 막지 않습니다. 서로 다른 결정 증거의 교집합에 정직한 표가 남고, 그 표가 다음 단계에서도 잠금 규칙을 지켜야 안전성이 이어집니다.",
  },
  {
    id: "open-membership",
    href: "/cs/blockchain/consensus-mechanisms#overview",
    shortTitle: "공개 참여 합의",
    mapLabel: "참여 비용 → 영향력 → fork choice",
    track: "concept",
    parentHref: "/cs/blockchain/distributed-systems#consensus-class",
    parentLabel: "분산 시스템 · 가정을 바꾸는 방법",
    question: "누구나 이름을 늘릴 수 있는 네트워크에서는 참여자의 영향력을 무엇에 연결하고 기록 하나를 어떻게 선택할까요?",
    closure: "PoW와 PoS는 합의 전체의 이름이 아니라 영향력의 근거를 정하는 방식입니다. 유효성 검사와 fork choice, finality는 별도 규칙으로 읽어야 합니다.",
  },
  {
    id: "cometbft-consensus",
    href: "/cs/blockchain/cometbft-consensus#overview",
    shortTitle: "CometBFT 추적",
    mapLabel: "proposal → prevote → precommit",
    track: "practice",
    parentHref: "/cs/blockchain/bft-theory#overview",
    parentLabel: "비잔틴 합의 · 표와 잠금",
    question: "이론의 제안·표·잠금이 실제 CometBFT 코드와 메시지 상태에서는 어디에서 바뀔까요?",
    closure: "CometBFT 구현에서는 높이·라운드·단계와 유효한 증거를 함께 추적해야 합니다. 함수 이름보다 상태 전이와 저장된 증거가 복구 동작을 결정합니다.",
  },
  {
    id: "consensus-comparison",
    href: "/cs/blockchain/consensus-comparison#overview",
    shortTitle: "합의 비교표",
    mapLabel: "membership → evidence → finality",
    track: "reference",
    parentHref: "/cs/blockchain/distributed-systems#return-map",
    parentLabel: "분산 시스템 · 전제와 보장",
    question: "서로 다른 합의 계열을 TPS 한 줄이 아니라 같은 전제와 결정 증거로 어떻게 비교할까요?",
    closure: "합의 비교는 참여 집합, 장애·시간 가정, 결정 증거, finality 의미를 먼저 맞춘 뒤 같은 workload에서 비용을 재야 합니다.",
  },
] as const;

export function getDistributedSystemsLearningNode(id: DistributedSystemsLearningNodeId) {
  const node = DISTRIBUTED_SYSTEMS_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`분산 시스템 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getDistributedSystemsTrackNodes(track: DistributedSystemsLearningTrack) {
  return DISTRIBUTED_SYSTEMS_LEARNING_NODES.filter((node) => node.track === track);
}
