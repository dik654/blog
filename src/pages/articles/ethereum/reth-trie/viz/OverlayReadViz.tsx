import SceneShell from "./TrieSceneShell";

/**
 * 본문 대응: #state-root "Base snapshot과 hashed overlay를 결합합니다" + "Root 비교가 storage write보다 먼저입니다".
 * reader는 parent root에 고정된 DB trie를 base로, execution 변경을 overlay로 우선 적용한다.
 * key A(balance 10→11)는 본문 사례. key D(삭제)와 key F(dirty prefix 밖)는 설명용 가정.
 */
interface Column {
  key: string;
  overlay: string;
  base: string;
  result: string;
  scene: number;
}

const COLUMNS: readonly Column[] = [
  { key: "A", overlay: "balance 11", base: "balance 10", result: "11 · overlay 우선", scene: 1 },
  { key: "D (가정)", overlay: "삭제", base: "값 있음", result: "없음 · base로 되살리지 않음", scene: 2 },
  { key: "F (가정)", overlay: "변경 없음", base: "기존 subtree hash", result: "dirty prefix 밖 · hash 재사용", scene: 3 },
];

const SCENES = [
  {
    label: "두 층을 겹칩니다",
    summary: "overlay 위 · base 아래",
    note: "base는 parent root r100에 고정한 database trie이고, overlay는 이번 execution bundle이 만든 account·storage 변경입니다. 같은 key를 읽을 때 overlay를 먼저 봅니다.",
  },
  {
    label: "A: overlay 값이 이깁니다",
    summary: "10이 아니라 11",
    note: "base에는 A의 balance 10이 남아 있지만 overlay에 11이 있으므로 계산에는 11을 씁니다. parent trie 자체는 바꾸지 않습니다.",
  },
  {
    label: "D: 삭제도 overlay의 값입니다",
    summary: "base가 되살리면 틀림",
    note: "overlay가 D를 삭제했다면 base에 옛 값이 있어도 '없음'으로 읽어야 합니다. overlay에 값이 없다고 보고 base로 내려가면 지운 값이 되살아납니다.",
  },
  {
    label: "F: dirty prefix 밖은 재사용",
    summary: "다시 펼치지 않음",
    note: "바뀐 key와 prefix가 겹치지 않는 child는 base의 기존 hash를 그대로 씁니다. 다만 서로 다른 storage generation을 섞어 읽으면 안 됩니다.",
  },
  {
    label: "root 비교가 기록보다 먼저",
    summary: "일치해야 publish",
    note: "candidate root가 header root와 일치해야 changeset·trie update·checkpoint를 publish합니다. 다르면 address/storage key, old/new value, visited prefix, node encoding과 fork를 남기고, 잘못 계산한 root를 canonical marker에 연결하지 않습니다.",
  },
] as const;

function cellClass(on: boolean, tone: "plain" | "win" | "warn" = "plain") {
  if (!on) return "border-border text-muted-foreground";
  if (tone === "win") return "border-primary bg-primary/10 text-foreground";
  if (tone === "warn") return "border-amber-600/70 bg-amber-500/10 text-foreground";
  return "border-foreground/40 text-foreground";
}

function OverlayReadFigure({ active }: { active: number }) {
  const layersOn = active === 0;
  return (
    <div className="min-w-0 text-xs leading-5">
      <div className="grid grid-cols-[4.5rem_repeat(3,minmax(0,1fr))] gap-1.5 sm:grid-cols-[7rem_repeat(3,minmax(0,1fr))] sm:gap-2">
        <span />
        {COLUMNS.map((column) => (
          <strong key={column.key} className={`break-keep text-center ${active === column.scene ? "text-primary" : ""}`}>key {column.key}</strong>
        ))}
        <span className={`self-center break-keep font-semibold ${layersOn ? "text-primary" : "text-muted-foreground"}`}>overlay<br />이번 변경</span>
        {COLUMNS.map((column) => (
          <div key={column.key} className={`break-keep rounded-md border px-1.5 py-2 text-center ${cellClass(layersOn || active === column.scene, column.scene === 3 ? "plain" : "win")}`}>{column.overlay}</div>
        ))}
        <span className={`self-center break-keep font-semibold ${layersOn ? "text-primary" : "text-muted-foreground"}`}>base<br />r100 고정</span>
        {COLUMNS.map((column) => (
          <div key={column.key} className={`break-keep rounded-md border px-1.5 py-2 text-center ${active === column.scene && column.scene !== 3 ? "border-border text-muted-foreground line-through" : cellClass(layersOn || active === column.scene, column.scene === 3 ? "win" : "plain")}`}>{column.base}</div>
        ))}
        <span className="self-center break-keep font-semibold text-muted-foreground">읽은 결과</span>
        {COLUMNS.map((column) => (
          <div key={column.key} className={`break-keep rounded-md border px-1.5 py-2 text-center ${cellClass(active === column.scene, column.scene === 2 ? "warn" : "win")}`}>{active >= column.scene ? column.result : "…"}</div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className={`rounded-md border px-3 py-2 ${cellClass(active === 4, "win")}`}>
          <strong>candidate root = header root</strong>
          <span className="block">→ changeset · trie update · checkpoint publish</span>
        </div>
        <div className={`rounded-md border px-3 py-2 ${cellClass(active === 4, "warn")}`}>
          <strong>candidate root ≠ header root</strong>
          <span className="block">→ 원인을 남기고 canonical marker에 연결하지 않음</span>
        </div>
      </div>
    </div>
  );
}

export default function OverlayReadViz() {
  return (
    <SceneShell
      eyebrow="base + hashed overlay"
      title="같은 key를 읽을 때 overlay가 먼저, base는 그다음입니다"
      description="열 하나가 key 하나입니다. A는 본문 사례이고 D와 F는 삭제·재사용 경우를 보이려고 둔 가정입니다."
      ariaLabel="parent에 고정된 base trie 위에 execution 변경 overlay를 겹쳐 읽는 규칙과 root 비교 뒤 기록 순서"
      scenes={SCENES}
      render={(active) => <OverlayReadFigure active={active} />}
    />
  );
}
