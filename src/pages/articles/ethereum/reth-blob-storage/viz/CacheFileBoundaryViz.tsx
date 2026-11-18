import SceneShell from "./SceneShell";

/**
 * 본문 대응: #failure-boundaries (+ #write-read) — Pool 성공·Store 실패, cache가 file보다 먼저 갱신되는 순서,
 * eviction 뒤 miss, corrupt file의 DecodeError와 contains, restart 때 디렉터리 삭제.
 * 쓰기 실패·eviction·손상은 경계를 보이기 위한 가정 상황이다.
 */
type Cell = { text: string; tone: "ok" | "empty" | "bad" | "warn" };

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  pool: Cell;
  cache: Cell;
  file: Cell;
  get: Cell;
  contains: Cell;
}[] = [
  {
    label: "Pool insertion 성공",
    summary: "T₀ entry는 Pool에",
    note: "T₀가 Pool에 추가된 뒤 sidecar S₀는 Pool lock 밖에서 BlobStore insert로 넘어갑니다. 두 저장소는 한 transaction처럼 함께 바뀌지 않습니다.",
    pool: { text: "T₀ 있음", tone: "ok" },
    cache: { text: "비어 있음", tone: "empty" },
    file: { text: "없음", tone: "empty" },
    get: { text: "—", tone: "empty" },
    contains: { text: "—", tone: "empty" },
  },
  {
    label: "Cache 먼저 갱신",
    summary: "insert_one: index · LRU → 파일",
    note: "Disk backend의 insert_one은 S₀를 RLP로 encode하고 versioned-hash index와 sidecar LRU cache를 먼저 갱신합니다. blob_dir/H₀ 파일 쓰기는 그다음입니다.",
    pool: { text: "T₀ 있음", tone: "ok" },
    cache: { text: "H₀ → S₀", tone: "ok" },
    file: { text: "쓰는 중", tone: "warn" },
    get: { text: "—", tone: "empty" },
    contains: { text: "—", tone: "empty" },
  },
  {
    label: "파일 쓰기 실패 (가정)",
    summary: "warning + failed-insert metric",
    note: "파일 쓰기가 실패하면 BlobStore insert가 오류를 돌려주고 Pool은 warning과 failed-insert metric을 남깁니다. 이미 성공한 Pool insertion을 되돌리지 않으므로 T₀는 Pool에 남습니다.",
    pool: { text: "T₀ 있음", tone: "ok" },
    cache: { text: "H₀ → S₀", tone: "ok" },
    file: { text: "없음", tone: "bad" },
    get: { text: "—", tone: "empty" },
    contains: { text: "—", tone: "empty" },
  },
  {
    label: "같은 process에서 조회",
    summary: "get(H₀) → cache hit",
    note: "get(H₀)은 cache를 먼저 보므로 write 실패 직후 같은 process에서는 S₀가 반환될 수 있습니다. 파일이 없다는 사실은 이 응답에서 드러나지 않습니다.",
    pool: { text: "T₀ 있음", tone: "ok" },
    cache: { text: "H₀ → S₀", tone: "ok" },
    file: { text: "없음", tone: "bad" },
    get: { text: "S₀ (cache hit)", tone: "ok" },
    contains: { text: "true", tone: "ok" },
  },
  {
    label: "Cache eviction 뒤 (가정)",
    summary: "get(H₀) → None",
    note: "LRU가 H₀를 밀어내면 다음 get은 파일로 내려가지만 파일이 없어 None이 될 수 있습니다. 그래서 이 순서를 atomic durability라고 부를 수 없습니다.",
    pool: { text: "T₀ 있음", tone: "ok" },
    cache: { text: "H₀ 밀려남", tone: "empty" },
    file: { text: "없음", tone: "bad" },
    get: { text: "None", tone: "bad" },
    contains: { text: "false", tone: "bad" },
  },
  {
    label: "다른 경우: 파일 손상 (가정)",
    summary: "contains true · get DecodeError",
    note: "파일은 있지만 RLP decode가 실패하면 get은 None이 아니라 DecodeError입니다. contains는 cache hit 또는 파일 존재만 보므로 이때도 true일 수 있습니다. 별도 digest·generation 검사는 없습니다.",
    pool: { text: "T₀ 있음", tone: "ok" },
    cache: { text: "H₀ 없음", tone: "empty" },
    file: { text: "있음 · 손상", tone: "warn" },
    get: { text: "DecodeError", tone: "bad" },
    contains: { text: "true", tone: "warn" },
  },
  {
    label: "Process restart",
    summary: "open이 blob 디렉터리 전체 삭제",
    note: "DiskFileBlobStore::open은 이전 blob directory를 전부 지우고 새로 만듭니다. Restart 뒤 partial write를 복구하는 WAL·receipt store가 아니라 재생성 가능한 local cache입니다.",
    pool: { text: "—", tone: "empty" },
    cache: { text: "새로 시작", tone: "empty" },
    file: { text: "디렉터리 재생성 · 비어 있음", tone: "empty" },
    get: { text: "None", tone: "bad" },
    contains: { text: "false", tone: "bad" },
  },
];

const TONE: Record<Cell["tone"], string> = {
  ok: "border-primary text-foreground",
  empty: "border-dashed border-border text-muted-foreground",
  bad: "border-red-600 text-red-700 dark:text-red-400",
  warn: "border-amber-600 text-amber-700 dark:text-amber-400",
};

function Box({ title, cell }: { title: string; cell: Cell }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 ${TONE[cell.tone]}`}>
      <span className="block text-[10px] font-black tracking-[0.06em] text-muted-foreground">{title}</span>
      <span className="mt-1 block break-keep font-mono text-xs font-bold leading-5">{cell.text}</span>
    </div>
  );
}

export default function CacheFileBoundaryViz() {
  return (
    <SceneShell
      eyebrow="실패 경계"
      title="Cache와 파일은 따로 바뀌고, 응답은 둘 중 먼저 본 쪽을 따릅니다"
      description="위 줄은 상태가 머무는 세 곳, 아래 줄은 같은 순간의 조회 결과입니다. LRU cache는 최근에 쓴 sidecar를 메모리에 두고 오래된 것부터 밀어내는 칸입니다. 쓰기 실패·eviction·파일 손상은 경계를 보이려는 가정 상황입니다."
      note="Reth v2.8.1 Disk backend 기준입니다. Write·read latency, cache hit rate와 실제 실패 빈도는 측정하지 않았습니다."
      ariaLabel="Pool, sidecar cache, blob 파일의 상태와 get, contains 결과가 실패 상황마다 달라지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Box title="POOL" cell={scene.pool} />
              <Box title="SIDECAR LRU CACHE" cell={scene.cache} />
              <Box title="BLOB_DIR/H₀" cell={scene.file} />
            </div>
            <div className="text-center text-xs text-muted-foreground" aria-hidden>
              ↓ 조회
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Box title="GET(H₀)" cell={scene.get} />
              <Box title="CONTAINS(H₀)" cell={scene.contains} />
            </div>
          </div>
        );
      }}
    />
  );
}
