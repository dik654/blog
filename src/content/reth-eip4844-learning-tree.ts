export type RethEip4844Track = "concept" | "practice" | "reference";

export type RethEip4844NodeId =
  | "reth-eip4844"
  | "reth-blob-admission"
  | "reth-blob-storage"
  | "eip4844-blob-fee"
  | "reth-blob-reorg-release";

export interface RethEip4844Node {
  id: RethEip4844NodeId;
  shortTitle: string;
  mapLabel: string;
  question: string;
  track: RethEip4844Track;
  href: string;
  parentLabel: string;
  parentHref: string;
  region: string;
  curriculumPrevious?: { href: string; label: string };
  curriculumNext?: { href: string; label: string };
}

export const RETH_EIP4844_NODES: readonly RethEip4844Node[] = [
  {
    id: "reth-eip4844",
    shortTitle: "Blob 제출",
    mapLabel: "Transaction 참조와 sidecar 데이터를 결속",
    question:
      "큰 Blob을 transaction과 sidecar로 나누고도 어떻게 같은 제출인지 검증합니까?",
    track: "concept",
    href: "/cs/blockchain/reth-eip4844#overview",
    parentLabel: "Reth 전체 구조 · 검증과 실행",
    parentHref: "/cs/blockchain/reth#overview",
    region: "Blob transaction 경계",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-eip1559-validation#return-map",
      label: "EIP-1559 변경 검증",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-blob-admission#overview",
      label: "Blob Pool 입장 검사",
    },
  },
  {
    id: "reth-blob-admission",
    shortTitle: "입장 검사",
    mapLabel: "형식·상태·KZG를 통과한 제출만 Pool에 수용",
    question:
      "Reth는 비용이 다른 검사를 어떤 순서로 실행해 Blob transaction을 Pool에 받습니까?",
    track: "concept",
    href: "/cs/blockchain/reth-blob-admission#overview",
    parentLabel: "EIP-4844 Blob 제출",
    parentHref: "/cs/blockchain/reth-eip4844#return-map",
    region: "Transaction Pool admission",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-eip4844#return-map",
      label: "EIP-4844 Blob 제출",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-blob-storage#overview",
      label: "BlobStore",
    },
  },
  {
    id: "reth-blob-storage",
    shortTitle: "BlobStore",
    mapLabel: "검증한 sidecar를 transaction hash로 저장·조회·정리",
    question:
      "검증한 sidecar를 reorg와 cleanup 사이에서 어떻게 다시 찾고 안전하게 지웁니까?",
    track: "concept",
    href: "/cs/blockchain/reth-blob-storage#overview",
    parentLabel: "EIP-4844 Blob 제출",
    parentHref: "/cs/blockchain/reth-eip4844#return-map",
    region: "Execution client의 local BlobStore",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-blob-admission#overview",
      label: "Blob Pool 입장 검사",
    },
    curriculumNext: {
      href: "/cs/blockchain/eip4844-blob-fee#overview",
      label: "Blob 가격",
    },
  },
  {
    id: "eip4844-blob-fee",
    shortTitle: "Blob 가격",
    mapLabel: "Parent 사용량에서 다음 excess와 base fee를 계산",
    question:
      "지난 블록의 Blob 사용량은 어떻게 다음 블록의 Blob 가격으로 이어집니까?",
    track: "concept",
    href: "/cs/blockchain/eip4844-blob-fee#overview",
    parentLabel: "EIP-4844 Blob 제출",
    parentHref: "/cs/blockchain/reth-eip4844#return-map",
    region: "Blob gas feedback",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-blob-storage#overview",
      label: "BlobStore",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-blob-reorg-release#overview",
      label: "Reorg와 회수",
    },
  },
  {
    id: "reth-blob-reorg-release",
    shortTitle: "Reorg와 회수",
    mapLabel: "고아가 된 transaction과 보관 중인 sidecar를 다시 결합",
    question:
      "Reorg가 발생하면 transaction body와 local sidecar는 어떻게 다시 만나고 언제 정리됩니까?",
    track: "concept",
    href: "/cs/blockchain/reth-blob-reorg-release#overview",
    parentLabel: "EIP-4844 Blob 제출",
    parentHref: "/cs/blockchain/reth-eip4844#return-map",
    region: "Reorg reinsertion과 retention",
    curriculumPrevious: {
      href: "/cs/blockchain/eip4844-blob-fee#overview",
      label: "Blob 가격",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-payload-builder#overview",
      label: "Payload Builder",
    },
  },
] as const;

export function getRethEip4844Node(id: RethEip4844NodeId) {
  return RETH_EIP4844_NODES.find((node) => node.id === id)!;
}

export function getRethEip4844TrackNodes(track: RethEip4844Track) {
  return RETH_EIP4844_NODES.filter((node) => node.track === track);
}
