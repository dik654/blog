import MptSceneShell from "./MptSceneShell";

/**
 * 본문 대응: #path-encoding — compact hex-prefix 두 예.
 * 홀수 leaf [1,2,3,4,5] → flag 3 → 3 1 2 3 4 5 → 31 23 45.
 * 짝수 extension [a,b] → flag 0 + padding 0 → 0 0 a b → 00 ab.
 * nibble 두 개가 1 byte이므로 flag를 붙인 뒤 전체 nibble 수가 짝수여야 bytes로 묶입니다.
 */
type CellKind = "flag" | "pad" | "path";
type Cell = readonly [CellKind, string];

const SLOTS = 6;

interface PackScene {
  label: string;
  summary: string;
  cells: readonly Cell[];
  packed: boolean;
  note: string;
}

const SCENES: readonly PackScene[] = [
  {
    label: "leaf 경로 5칸",
    summary: "nibble 5개 = 홀수",
    cells: [["path", "1"], ["path", "2"], ["path", "3"], ["path", "4"], ["path", "5"]],
    packed: false,
    note: "nibble은 4-bit 한 칸으로, 0부터 f까지 한 글자로 적습니다. 1 byte는 nibble 두 개입니다. 이 leaf의 남은 경로는 1·2·3·4·5, 다섯 칸이라 홀수 길이입니다.",
  },
  {
    label: "flag 3을 앞에",
    summary: "flag 1개 + 5개 = 6개",
    cells: [["flag", "3"], ["path", "1"], ["path", "2"], ["path", "3"], ["path", "4"], ["path", "5"]],
    packed: false,
    note: "첫 flag nibble 하나가 'leaf'와 '홀수 길이'를 함께 나타냅니다. 이 경우 값은 3입니다. 5칸에 flag 한 칸을 더하면 6칸이 되어 두 칸씩 남김없이 짝이 맞습니다.",
  },
  {
    label: "leaf bytes로 묶기",
    summary: "31 23 45 (3 bytes)",
    cells: [["flag", "3"], ["path", "1"], ["path", "2"], ["path", "3"], ["path", "4"], ["path", "5"]],
    packed: true,
    note: "앞에서부터 두 칸씩 묶으면 31 · 23 · 45, 3 bytes입니다. 첫 byte의 상위 4-bit는 flag이고 하위 4-bit는 이미 경로의 첫 nibble 1입니다.",
  },
  {
    label: "extension 경로 2칸",
    summary: "nibble 2개 = 짝수",
    cells: [["path", "a"], ["path", "b"]],
    packed: false,
    note: "이번에는 extension의 경로 a·b, 두 칸입니다. 짝수 길이라 flag 한 칸만 붙이면 3칸이 되어 두 칸씩 묶을 때 한 칸이 남습니다.",
  },
  {
    label: "flag 0과 padding 0",
    summary: "flag + padding + 2개 = 4개",
    cells: [["flag", "0"], ["pad", "0"], ["path", "a"], ["path", "b"]],
    packed: false,
    note: "flag 0이 'extension'과 '짝수 길이'를 나타내고, 그 뒤에 padding 0 한 칸을 채워 4칸으로 맞춥니다. padding은 경로가 아니라 자리 맞춤용 칸입니다.",
  },
  {
    label: "extension bytes로 묶기",
    summary: "00 ab (2 bytes)",
    cells: [["flag", "0"], ["pad", "0"], ["path", "a"], ["path", "b"]],
    packed: true,
    note: "결과는 00 · ab, 2 bytes입니다. 첫 byte는 flag와 padding만 담고, 경로는 두 번째 byte부터 시작합니다. 이 flag와 padding 규칙이 느슨하면 같은 경로가 여러 bytes로 적힐 수 있습니다.",
  },
];

const CELL_STYLE: Record<CellKind, string> = {
  flag: "border-amber-600 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  pad: "border-dashed border-slate-500 bg-muted/40 text-muted-foreground",
  path: "border-primary/70 bg-primary/[0.06] text-foreground",
};

const CELL_NAME: Record<CellKind, string> = { flag: "flag", pad: "padding", path: "경로" };

function NibbleRow({ cells }: { cells: readonly Cell[] }) {
  return (
    <div className="grid grid-cols-6 gap-1.5 sm:gap-2" aria-label="nibble 칸">
      {Array.from({ length: SLOTS }, (_, slot) => {
        const cell = cells[slot];
        if (!cell) {
          return <div key={slot} className="h-16 rounded-md border border-dashed border-border/40" aria-hidden />;
        }
        const [kind, value] = cell;
        return (
          <div key={slot} className={`flex h-16 flex-col items-center justify-center rounded-md border ${CELL_STYLE[kind]}`}>
            <span className="font-mono text-lg font-bold leading-6">{value}</span>
            <span className="text-[10px] leading-4">{CELL_NAME[kind]}</span>
          </div>
        );
      })}
    </div>
  );
}

function ByteRow({ cells, packed }: { cells: readonly Cell[]; packed: boolean }) {
  const pairs = Array.from({ length: SLOTS / 2 }, (_, index) => cells.slice(index * 2, index * 2 + 2));
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2" aria-label="bytes">
      {pairs.map((pair, index) => {
        const filled = packed && pair.length === 2;
        return (
          <div
            key={index}
            className={`flex h-12 items-center justify-center rounded-md border text-center ${
              filled ? "border-foreground/60 bg-background" : "border-dashed border-border/40"
            }`}
          >
            {filled ? (
              <span className="font-mono text-base font-bold">
                {pair.map(([, value]) => value).join("")}
                <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">byte {index + 1}</span>
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground/60">{packed ? "" : "아직 묶지 않음"}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function HexPrefixPackingViz() {
  return (
    <MptSceneShell
      eyebrow="compact hex-prefix · 두 예"
      title="flag를 붙여 nibble 수를 짝수로 맞춘 뒤 두 칸씩 묶습니다"
      description="compact hex-prefix는 extension·leaf의 경로 앞에 flag nibble을 붙여 bytes로 적는 규칙입니다. 위 칸은 nibble 하나, 아래 칸은 nibble 두 개를 묶은 1 byte입니다. 본문의 홀수 길이 leaf [1,2,3,4,5]와 짝수 길이 extension [a,b]를 차례로 인코딩합니다."
      note="flag 값은 본문이 든 두 경우(홀수 leaf → 3, 짝수 extension → 0)만 표시했습니다."
      ariaLabel="홀수 길이 leaf 경로와 짝수 길이 extension 경로를 compact hex-prefix bytes로 바꾸는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm border border-amber-600 bg-amber-500/10" />flag</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm border border-dashed border-slate-500 bg-muted/40" />padding</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm border border-primary/70 bg-primary/[0.06]" />경로 nibble</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">nibble (4-bit)</p>
            <NibbleRow cells={scene.cells} />
            <p className="text-xs font-semibold text-muted-foreground">bytes (nibble 2개씩)</p>
            <ByteRow cells={scene.cells} packed={scene.packed} />
          </div>
        );
      }}
    />
  );
}
