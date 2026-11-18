import StateSceneShell from "./StateSceneShell";

/**
 * 본문 대응: #proof-caching — account는 (address, block_hash), storage는 storage_hash 안의 slot,
 * code는 code_hash로 찾는다. Head가 H1에서 H2로 바뀔 때 무엇을 재사용할 수 있는지.
 * S2는 storage root가 달라진 경우를 보이려는 가정이다.
 */

type Mark = "none" | "insert" | "hit" | "miss" | "stale" | "wrong";

interface Row {
  key: string;
  value: string;
  mark: Mark;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  query: string;
  accountTitle: string;
  account: readonly Row[];
  storage: readonly Row[];
  code: readonly Row[];
}

const EMPTY: Row = { key: "", value: "", mark: "none" };

const SCENES: readonly Scene[] = [
  {
    label: "H1 검증 후 저장",
    summary: "세 cache에 서로 다른 key",
    note: "Block H1에서 account·storage proof를 모두 검증한 뒤에만 넣습니다. Account는 block마다 바뀔 수 있어 (A, H1)로, storage는 storage hash S 안의 slot 5로, code는 code hash C로 찾습니다.",
    query: "조회: block H1 · 주소 A · slot 5",
    accountTitle: "key = (address, block_hash)",
    account: [{ key: "(A, H1)", value: "S · C 포함", mark: "insert" }, EMPTY],
    storage: [{ key: "S → slot 5", value: "7", mark: "insert" }, EMPTY],
    code: [{ key: "C", value: "bytecode", mark: "insert" }],
  },
  {
    label: "Head가 H2로",
    summary: "(A, H2) 없음 → 다시 증명",
    note: "Optimistic head가 H1에서 H2로 바뀌었습니다. (A, H1)은 남아 있어도 H2 조회에는 쓸 수 없습니다. H2의 account proof를 새로 검증해야 합니다.",
    query: "조회: block H2 · 주소 A · slot 5",
    accountTitle: "key = (address, block_hash)",
    account: [{ key: "(A, H1)", value: "H2에는 사용 불가", mark: "stale" }, { key: "(A, H2)", value: "없음", mark: "miss" }],
    storage: [{ key: "S → slot 5", value: "7", mark: "none" }, EMPTY],
    code: [{ key: "C", value: "bytecode", mark: "none" }],
  },
  {
    label: "같은 S·C 재확인",
    summary: "storage·code는 재사용",
    note: "H2 account proof를 검증해 보니 storage root가 그대로 S, code hash가 그대로 C입니다. Hash가 내용을 식별하므로 이미 저장한 (S, 5)와 C 항목을 H2 조회에 조합할 수 있습니다.",
    query: "조회: block H2 · 주소 A · slot 5",
    accountTitle: "key = (address, block_hash)",
    account: [{ key: "(A, H1)", value: "S · C 포함", mark: "none" }, { key: "(A, H2)", value: "S · C 포함", mark: "insert" }],
    storage: [{ key: "S → slot 5", value: "7", mark: "hit" }, EMPTY],
    code: [{ key: "C", value: "bytecode", mark: "hit" }],
  },
  {
    label: "Storage root가 바뀌면",
    summary: "S2 칸 없음 → 새 proof",
    note: "H2 account proof가 다른 storage root S2(가정)를 확인했다면 S 칸의 항목은 쓸 수 없습니다. H1에서 증명한 S로는 H2의 slot proof를 검증할 수 없으므로, S2를 root로 storage proof를 새로 검증한 뒤 넣습니다.",
    query: "조회: block H2 · 주소 A · slot 5",
    accountTitle: "key = (address, block_hash)",
    account: [{ key: "(A, H1)", value: "S · C 포함", mark: "none" }, { key: "(A, H2)", value: "S2 · C 포함", mark: "insert" }],
    storage: [{ key: "S → slot 5", value: "7 · root S일 때만 유효", mark: "stale" }, { key: "S2 → slot 5", value: "없음", mark: "miss" }],
    code: [{ key: "C", value: "bytecode", mark: "hit" }],
  },
  {
    label: "Address만 key로 쓰면",
    summary: "H1 값이 H2 답으로 나감",
    note: "“latest account cache”처럼 address A 하나만 key로 쓰면, H2를 물어도 H1에서 저장한 account가 그대로 나옵니다. 어느 block의 값인지라는 경계가 key에서 사라졌기 때문입니다.",
    query: "조회: block H2 · 주소 A · slot 5",
    accountTitle: "key = address (잘못된 설계)",
    account: [{ key: "A", value: "H1의 account", mark: "wrong" }, EMPTY],
    storage: [{ key: "S → slot 5", value: "7", mark: "none" }, EMPTY],
    code: [{ key: "C", value: "bytecode", mark: "none" }],
  },
];

const MARK_TEXT: Record<Mark, string> = {
  none: "",
  insert: "저장",
  hit: "재사용",
  miss: "miss",
  stale: "해당 없음",
  wrong: "틀린 snapshot",
};

const MARK_COLOR: Record<Mark, string> = {
  none: "#94a3b8",
  insert: "#2563eb",
  hit: "#16a34a",
  miss: "#d97706",
  stale: "#94a3b8",
  wrong: "#dc2626",
};

function CacheRow({ row }: { row: Row }) {
  if (!row.key) {
    return <div className="h-[3.25rem] rounded-md border border-dashed border-border/50" aria-hidden />;
  }
  const color = MARK_COLOR[row.mark];
  const dim = row.mark === "stale";
  return (
    <div
      className="flex h-[3.25rem] min-w-0 items-center justify-between gap-2 rounded-md border bg-background px-2.5"
      style={{ borderColor: row.mark === "none" ? undefined : color }}
    >
      <div className={`min-w-0 ${dim ? "opacity-55" : ""}`}>
        <p className={`break-keep font-mono text-xs font-bold ${dim ? "line-through" : ""}`}>{row.key}</p>
        <p className="break-keep text-[11px] leading-4 text-muted-foreground">{row.value}</p>
      </div>
      <span className="shrink-0 font-mono text-[11px] font-bold" style={{ color }}>
        {MARK_TEXT[row.mark]}
      </span>
    </div>
  );
}

function Table({ title, keyLabel, rows }: { title: string; keyLabel: string; rows: readonly Row[] }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold">{title}</p>
      <p className="mb-1.5 break-keep font-mono text-[11px] text-muted-foreground">{keyLabel}</p>
      <div className="space-y-1.5">
        {rows.map((row, i) => (
          <CacheRow key={i} row={row} />
        ))}
      </div>
    </div>
  );
}

function Diagram({ scene }: { scene: Scene }) {
  const codeRows: readonly Row[] = [...scene.code, EMPTY];
  return (
    <div className="min-w-0" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <p className="mb-3 rounded-md border border-primary/40 px-3 py-2 font-mono text-xs font-bold text-primary">{scene.query}</p>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-3">
        <Table title="Account cache" keyLabel={scene.accountTitle} rows={scene.account} />
        <Table title="Storage cache" keyLabel="key = storage_hash → slot" rows={scene.storage} />
        <Table title="Code cache" keyLabel="key = code_hash" rows={codeRows} />
      </div>
    </div>
  );
}

export default function CacheIdentityViz() {
  return (
    <StateSceneShell
      eyebrow="Cache identity"
      title="Head가 바뀌면 account는 다시, storage·code는 hash가 같을 때만 재사용합니다"
      description="세 cache는 key가 다릅니다. 칸은 검증을 마친 항목만 담고, block H1·H2, storage root S, code hash C는 본문의 이름을 따릅니다."
      ariaLabel="Block이 H1에서 H2로 바뀔 때 account, storage, code cache 항목을 재사용할 수 있는지"
      scenes={SCENES}
      render={(active) => <Diagram scene={SCENES[active]} />}
    />
  );
}
