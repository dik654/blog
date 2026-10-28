export type HeliosTrack = "concept" | "practice" | "reference";

export type HeliosNodeId =
  | "helios"
  | "helios-bootstrap"
  | "helios-consensus"
  | "helios-update"
  | "helios-state"
  | "helios-execution"
  | "helios-types"
  | "helios-config";

export interface HeliosNode {
  id: HeliosNodeId;
  shortTitle: string;
  question: string;
  track: HeliosTrack;
  href: string;
  parentId: HeliosNodeId | null;
  parentLabel: string;
  parentHref: string;
  region: "whole" | "consensus" | "execution" | "evidence" | "operations";
  anchors?: readonly { href: string; label: string }[];
  curriculumPrevious?: { href: string; label: string };
  curriculumNext?: { href: string; label: string };
}

export const HELIOS_NODES: readonly HeliosNode[] = [
  {
    id: "helios",
    shortTitle: "전체 지도",
    question: "중앙 RPC가 돌려준 잔액을 어느 block의 검증된 값으로 바꿉니까?",
    track: "concept",
    href: "/cs/blockchain/helios#overview",
    parentId: null,
    parentLabel: "Ethereum · Light client",
    parentHref: "/cs/blockchain#eth-helios",
    region: "whole",
    curriculumPrevious: {
      href: "/cs/blockchain/railgun-validation#return-map",
      label: "RAILGUN 변경 검증",
    },
    curriculumNext: {
      href: "/cs/blockchain/helios-bootstrap#overview",
      label: "Checkpoint 부트스트랩",
    },
  },
  {
    id: "helios-bootstrap",
    shortTitle: "부트스트랩",
    question: "Checkpoint root 하나에서 첫 LightClientStore를 어떻게 만듭니까?",
    track: "concept",
    href: "/cs/blockchain/helios-bootstrap#overview",
    parentId: "helios",
    parentLabel: "Helios 전체 지도 · 신뢰 시작점",
    parentHref: "/cs/blockchain/helios#trust-preparation",
    region: "consensus",
    curriculumPrevious: { href: "/cs/blockchain/helios#return-map", label: "Helios 전체 지도" },
    curriculumNext: { href: "/cs/blockchain/helios-consensus#overview", label: "Sync committee 검증" },
  },
  {
    id: "helios-consensus",
    shortTitle: "Consensus",
    question: "Update의 header·committee·서명을 어떤 순서로 검증합니까?",
    track: "concept",
    href: "/cs/blockchain/helios-consensus#overview",
    parentId: "helios",
    parentLabel: "Helios 전체 지도 · Consensus 검증",
    parentHref: "/cs/blockchain/helios#trust-preparation",
    region: "consensus",
    curriculumPrevious: { href: "/cs/blockchain/helios-bootstrap#return-map", label: "Checkpoint 부트스트랩" },
    curriculumNext: { href: "/cs/blockchain/helios-update#overview", label: "Store update" },
  },
  {
    id: "helios-update",
    shortTitle: "Store update",
    question: "검증된 update가 optimistic·finalized header와 committee를 어떻게 바꿉니까?",
    track: "concept",
    href: "/cs/blockchain/helios-update#overview",
    parentId: "helios-consensus",
    parentLabel: "Consensus · Update 검증과 Store",
    parentHref: "/cs/blockchain/helios-consensus#sync-loop",
    region: "consensus",
    curriculumPrevious: { href: "/cs/blockchain/helios-consensus#return-map", label: "Sync committee 검증" },
    curriculumNext: { href: "/cs/blockchain/helios-state#overview", label: "Execution state proof" },
  },
  {
    id: "helios-state",
    shortTitle: "State proof",
    question: "Account와 storage 값이 검증된 state root에 들어 있음을 어떻게 확인합니까?",
    track: "concept",
    href: "/cs/blockchain/helios-state#overview",
    parentId: "helios",
    parentLabel: "Helios 전체 지도 · Execution 증명",
    parentHref: "/cs/blockchain/helios#request-path",
    region: "execution",
    curriculumPrevious: { href: "/cs/blockchain/helios-update#return-map", label: "Store update" },
    curriculumNext: { href: "/cs/blockchain/helios-execution#overview", label: "Execution RPC" },
  },
  {
    id: "helios-execution",
    shortTitle: "Execution RPC",
    question: "검증된 block과 proof-backed state로 JSON-RPC 요청을 어떻게 실행합니까?",
    track: "concept",
    href: "/cs/blockchain/helios-execution#overview",
    parentId: "helios-state",
    parentLabel: "State proof · 검증된 조회와 로컬 실행",
    parentHref: "/cs/blockchain/helios-state#return-map",
    region: "execution",
    curriculumPrevious: { href: "/cs/blockchain/helios-state#return-map", label: "Execution state proof" },
    curriculumNext: { href: "/cs/blockchain/helios-types#overview", label: "타입과 SSZ" },
  },
  {
    id: "helios-types",
    shortTitle: "타입·SSZ",
    question: "Fork별 wire object와 Merkle path를 어떤 타입과 byte 규칙으로 해석합니까?",
    track: "reference",
    href: "/cs/blockchain/helios-types#overview",
    parentId: "helios",
    parentLabel: "Helios 전체 지도 · 증거 형식",
    parentHref: "/cs/blockchain/helios#evidence-boundary",
    region: "evidence",
    curriculumPrevious: { href: "/cs/blockchain/helios-execution#return-map", label: "Execution RPC" },
    curriculumNext: { href: "/cs/blockchain/helios-config#overview", label: "설정과 운영 경계" },
  },
  {
    id: "helios-config",
    shortTitle: "설정·운영",
    question: "Network·checkpoint·endpoint·cache 설정을 어떤 우선순위와 실패 정책으로 운영합니까?",
    track: "practice",
    href: "/cs/blockchain/helios-config#overview",
    parentId: "helios",
    parentLabel: "Helios 전체 지도 · 외부 신뢰와 실행 환경",
    parentHref: "/cs/blockchain/helios#boundary",
    region: "operations",
    curriculumPrevious: { href: "/cs/blockchain/helios-types#overview", label: "타입과 SSZ" },
    curriculumNext: { href: "/cs/blockchain/kohaku-provider#overview", label: "Kohaku Provider" },
    anchors: [
      { href: "/cs/blockchain/helios#trust-preparation", label: "Consensus와 Execution의 결속" },
      { href: "/cs/blockchain/helios-bootstrap#overview", label: "Checkpoint 신뢰 시작점" },
      { href: "/cs/blockchain/helios-consensus#sync-loop", label: "Sync와 Store 상태" },
      { href: "/cs/blockchain/helios-state#overview", label: "Proof 검증 경계" },
    ],
  },
] as const;

export function getHeliosNode(id: HeliosNodeId) {
  const node = HELIOS_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Helios 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getHeliosTrackNodes(track: HeliosTrack) {
  return HELIOS_NODES.filter((node) => node.track === track);
}
