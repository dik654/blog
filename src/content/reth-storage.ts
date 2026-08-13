export interface RethStorageLayout {
  id: "v1" | "v2";
  title: string;
  status: string;
  summary: string;
  routes: readonly string[];
}

export interface RethStorageRoute {
  data: string;
  v1: string;
  v2: string;
  note: string;
}

/**
 * Reth storage articles share this manifest so a backend route is not redefined
 * independently in the DB, provider, pipeline and RPC explanations.
 */
export const RETH_STORAGE_LAYOUTS: readonly RethStorageLayout[] = [
  {
    id: "v1",
    title: "Storage V1",
    status: "legacy MDBX-only layout",
    summary:
      "기존 data directory가 metadata에 V1을 기록했다면 명시적으로 migration하기 전까지 그 layout을 유지한다.",
    routes: [
      "typed MDBX tables",
      "plain state tables",
      "history and lookup tables",
    ],
  },
  {
    id: "v2",
    title: "Storage V2",
    status: "new databases default",
    summary:
      "hot/cold data를 성격에 맞게 나눠 RocksDB와 static files로 routing하고 legacy plain-state tables를 피한다.",
    routes: [
      "RocksDB history indices",
      "RocksDB transaction-hash lookups",
      "static-file changesets",
    ],
  },
] as const;

export const RETH_STORAGE_ROUTES: readonly RethStorageRoute[] = [
  {
    data: "history indices",
    v1: "MDBX tables",
    v2: "RocksDB",
    note: "historical account·storage lookup을 위한 index",
  },
  {
    data: "transaction-hash lookups",
    v1: "MDBX table",
    v2: "RocksDB",
    note: "hash에서 canonical transaction 위치를 찾는 index",
  },
  {
    data: "account·storage changesets",
    v1: "MDBX tables",
    v2: "static files",
    note: "unwind와 historical reconstruction에 쓰이는 ordered history",
  },
  {
    data: "plain account·storage state",
    v1: "MDBX plain-state tables",
    v2: "legacy tables를 사용하지 않는 layout",
    note: "caller는 provider abstraction을 통해 읽고 physical route를 가정하지 않는다.",
  },
] as const;

export const RETH_STORAGE_RULES = [
  "새 data directory는 Storage V2를 기본으로 초기화한다.",
  "초기화된 data directory는 metadata에 기록된 mode를 계속 사용한다.",
  "V1에서 V2로 바꾸려면 migrate-v2, V2 snapshot 복원, 또는 새 sync가 필요하다.",
  "storage layout과 pruning은 별도 축이다. 전자는 어디에 저장할지, 후자는 얼마나 보존할지를 정한다.",
] as const;
