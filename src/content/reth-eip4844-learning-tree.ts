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
  returnSummary: string;
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
    returnSummary:
      "Transaction은 Blob 원문 대신 commitment에서 만든 32-byte versioned hash를 기록합니다. Sidecar는 Blob·commitment·proof를 운반하며, 개수와 순서, commitment에서 다시 계산한 hash, KZG proof가 모두 맞아야 같은 제출로 받아들일 수 있습니다.",
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
    returnSummary:
      "Reth v2.8.1은 transaction 자체로 끝낼 수 있는 검사를 먼저 실행하고, 통과한 경우에만 account state와 Blob sidecar를 검증합니다. 결과는 Valid·Invalid·Error로 구분하며, Valid는 실제 Pool insertion을 시도할 자격이지 최종 삽입 보장은 아닙니다.",
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
    returnSummary:
      "검증된 sidecar는 transaction hash로 찾는 local artifact입니다. 저장·조회·정리는 transaction pool의 생명주기와 연결되지만, 이 local 보관을 consensus data availability나 영구 archive로 확대하면 안 됩니다.",
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
    returnSummary:
      "지난 블록의 excess와 사용량은 다음 excess를 만들고, 이 값이 다음 Blob base fee 계산의 입력이 됩니다. Blob gas와 execution gas는 단위와 가격 함수가 다른 두 시장이므로 하나의 gas budget처럼 더하지 않습니다.",
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
    returnSummary:
      "Reorg로 transaction body가 Pool에 돌아올 때 sidecar가 빠져 있더라도 local BlobStore에 이미 검증한 artifact가 남아 있으면 재사용할 수 있습니다. 재삽입과 cleanup은 같은 canonical 경계를 보되 서로 다른 상태 전이로 기록해야 합니다.",
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
