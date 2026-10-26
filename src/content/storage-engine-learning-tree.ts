export type StorageEngineTrack = "concept" | "practice" | "reference";

export interface StorageEngineAnchor {
  href: string;
  label: string;
}

export interface StorageEngineNode {
  id: "lsm-tree" | "lsm-engine-validation" | "bplus-tree" | "mdbx-internals" | "reth-db";
  href: string;
  shortTitle: string;
  track: StorageEngineTrack;
  mapLabel: string;
  question: string;
  parentHref: string;
  parentLabel: string;
  closure: string;
  anchors?: readonly StorageEngineAnchor[];
  paired?: StorageEngineAnchor;
}

export const STORAGE_ENGINE_NODES = [
  {
    id: "lsm-tree",
    href: "/cs/blockchain/lsm-tree#overview",
    shortTitle: "LSM",
    track: "concept",
    mapLabel: "append 뒤 합치기",
    question: "같은 키를 여러 번 바꾸고 삭제해도 어떻게 시점별 결과를 보존할까요?",
    parentHref: "/cs/blockchain/reth#overview",
    parentLabel: "Reth의 검증·실행·저장 지도",
    closure: "LSM은 쓰기를 WAL과 메모리 갱신으로 먼저 받아 정렬 파일로 내립니다. 읽기는 sequence와 tombstone으로 최신 가시 값을 고르고, compaction은 그 결과를 보존하면서 오래된 조각을 합칩니다. 이 미뤄 둔 일이 입력보다 느리면 debt가 쌓여 쓰기 지연이나 중단으로 돌아옵니다.",
    paired: {
      href: "/cs/blockchain/lsm-engine-validation#overview",
      label: "LSM 엔진 검증",
    },
  },
  {
    id: "lsm-engine-validation",
    href: "/cs/blockchain/lsm-engine-validation#overview",
    shortTitle: "LSM 검증",
    track: "practice",
    mapLabel: "crash·증폭·stall 측정",
    question: "어떤 실험과 복구 증거가 있어야 LSM 설정 변경을 운영에 적용할 수 있을까요?",
    parentHref: "/cs/blockchain/lsm-tree#return-map",
    parentLabel: "LSM의 write·read·compaction 메커니즘",
    closure: "LSM 설정은 처리량 한 숫자로 고르지 않습니다. 같은 입력과 장비에서 crash 뒤 값·snapshot·tombstone을 먼저 대조하고, 그 다음 WAL·flush·compaction 바이트와 stall·tail latency를 비교해야 합니다. 승인 기록에는 소스와 설정, 자료, 결과, 되돌릴 대상을 함께 고정합니다.",
    anchors: [
      { href: "/cs/blockchain/lsm-tree#write-path", label: "WAL과 성공 응답 경계" },
      { href: "/cs/blockchain/lsm-tree#read-path", label: "sequence와 tombstone" },
      { href: "/cs/blockchain/lsm-tree#compaction", label: "compaction과 debt" },
    ],
  },
  {
    id: "bplus-tree",
    href: "/cs/blockchain/bplus-tree#overview",
    shortTitle: "B+ tree",
    track: "concept",
    mapLabel: "page를 제자리에서 나누기",
    question: "큰 fanout의 page 구조는 어떻게 짧은 조회 경로와 순서 탐색을 만들까요?",
    parentHref: "/cs/blockchain/reth#overview",
    parentLabel: "Reth의 검증·실행·저장 지도",
    closure: "B+ tree는 page 내부의 separator와 연결된 leaf를 이용해 짧은 조회 경로를 만듭니다. 삽입과 삭제는 split·redistribution·merge를 통해 정렬과 같은 leaf 깊이를 보존합니다.",
  },
  {
    id: "mdbx-internals",
    href: "/cs/blockchain/mdbx-internals#overview",
    shortTitle: "MDBX",
    track: "concept",
    mapLabel: "mmap·CoW·MVCC",
    question: "독자가 이전 page를 보는 동안 writer는 어떻게 새 세대를 확정할까요?",
    parentHref: "/cs/blockchain/reth#overview",
    parentLabel: "Reth의 검증·실행·저장 지도",
    closure: "MDBX는 memory-mapped B+ tree의 page를 Copy-on-Write하고 새 root를 meta page에 확정해 독자별 snapshot과 단일 writer를 조정합니다.",
  },
  {
    id: "reth-db",
    href: "/cs/blockchain/reth-db#overview",
    shortTitle: "Reth 저장",
    track: "practice",
    mapLabel: "typed table·static history",
    question: "Reth는 어떤 값을 어느 저장 계층에 놓고 같은 시점으로 읽게 할까요?",
    parentHref: "/cs/blockchain/reth#overview",
    parentLabel: "Reth의 검증·실행·저장 지도",
    closure: "Reth의 저장 경로는 값의 codec, mutable table, immutable history, transaction view를 한 블록 identity에 맞춰야 합니다.",
    anchors: [
      { href: "/cs/blockchain/reth-alloy-primitives#rlp", label: "값과 바이트 표현" },
      { href: "/cs/blockchain/bplus-tree#overview", label: "page index" },
      { href: "/cs/blockchain/mdbx-internals#transaction", label: "MVCC transaction" },
    ],
  },
] as const satisfies readonly StorageEngineNode[];

export type StorageEngineNodeId = (typeof STORAGE_ENGINE_NODES)[number]["id"];

export function getStorageEngineNode(id: StorageEngineNodeId): StorageEngineNode {
  const node = STORAGE_ENGINE_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Unknown storage-engine node: ${id}`);
  return node;
}

export function getStorageEngineTrackNodes(track: StorageEngineTrack) {
  return STORAGE_ENGINE_NODES.filter((node) => node.track === track);
}
