export type StorageEngineTrack = "concept" | "practice" | "reference";

export interface StorageEngineAnchor {
  href: string;
  label: string;
}

export interface StorageEngineNode {
  id: "lsm-tree" | "lsm-engine-validation" | "bplus-tree" | "bplus-index-validation" | "mdbx-internals" | "mdbx-validation" | "reth-db";
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
    closure: "B+ tree는 page 내부의 separator와 연결된 leaf를 이용해 짧은 조회 경로를 만듭니다. 삽입과 삭제는 새 page뿐 아니라 parent 경계와 sibling 연결을 함께 고쳐 정렬과 같은 leaf 깊이를 보존합니다. 실제 제품의 page 삭제 정책은 이 일반 모형과 다를 수 있습니다.",
    paired: {
      href: "/cs/blockchain/bplus-index-validation#overview",
      label: "B+ tree 구현 검증",
    },
  },
  {
    id: "bplus-index-validation",
    href: "/cs/blockchain/bplus-index-validation#overview",
    shortTitle: "B+ 검증",
    track: "practice",
    mapLabel: "경계·중단·복구 대조",
    question: "어떤 증거가 있어야 page 형식이나 split 구현 변경을 운영에 적용할 수 있을까요?",
    parentHref: "/cs/blockchain/bplus-tree#return-map",
    parentLabel: "B+ tree의 page·조회·갱신 메커니즘",
    closure: "B+ tree 구현 변경은 정상 조회 한 번으로 승인하지 않습니다. Page 형식과 comparator를 고정하고 경계 입력과 중간 종료를 재생한 뒤, 재시작한 index의 point·range 결과와 page graph를 독립 oracle에 대조합니다. 정확성과 복구를 통과한 run에서만 page 비용과 tail latency를 비교합니다.",
    anchors: [
      { href: "/cs/blockchain/bplus-tree#page-layout", label: "Page 예산과 fanout" },
      { href: "/cs/blockchain/bplus-tree#search-range", label: "Point·range 조회" },
      { href: "/cs/blockchain/bplus-tree#updates", label: "Split·삭제 불변식" },
    ],
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
    closure: "MDBX는 mapped file을 곧 RAM 전체로 취급하지 않습니다. Reader는 시작할 때 고른 transaction generation의 page graph를 계속 걷고, writer는 변경된 leaf에서 root까지 새 path를 만든 뒤 새 meta를 공개합니다. 오래 열린 reader가 사라져야 그 reader가 볼 수 있던 retired page를 다시 쓸 수 있습니다.",
    paired: {
      href: "/cs/blockchain/mdbx-validation#overview",
      label: "MDBX 운영 검증",
    },
  },
  {
    id: "mdbx-validation",
    href: "/cs/blockchain/mdbx-validation#overview",
    shortTitle: "MDBX 검증",
    track: "practice",
    mapLabel: "commit·중단·재실행 대조",
    question: "어떤 중단·재실행 증거가 있어야 MDBX 설정과 버전을 운영에 적용할 수 있을까요?",
    parentHref: "/cs/blockchain/mdbx-internals#return-map",
    parentLabel: "MDBX의 mmap·CoW·MVCC 메커니즘",
    closure: "MDBX 변경은 commit 성공 횟수나 처리량만으로 승인하지 않습니다. 소스와 sync mode, filesystem·장치를 고정하고 data page·meta·sync 경계에서 중단한 뒤, 다시 연 세대와 논리 rows를 독립 oracle에 대조합니다. Long reader·map full·DUPSORT 경계까지 통과한 run에서만 지연과 공간 비용을 비교합니다.",
    anchors: [
      { href: "/cs/blockchain/mdbx-internals#page-map", label: "Mapped page와 page fault" },
      { href: "/cs/blockchain/mdbx-internals#transaction", label: "CoW path와 meta 공개" },
      { href: "/cs/blockchain/mdbx-internals#reclaim", label: "Reader와 page 재사용" },
      { href: "/cs/blockchain/mdbx-internals#dupsort", label: "DUPSORT 순서 계약" },
    ],
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
