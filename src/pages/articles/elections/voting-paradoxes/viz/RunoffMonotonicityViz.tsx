import SceneShell from "./SceneShell";

/**
 * 본문 대응: #other-rules 둘째 펼침 — 100명 결선. 40 가>나>다, 31 나>다>가, 29 다>가>나.
 * 1차 다 탈락 → 29명이 가로, 가 69 : 나 31. 네 명이 나→가 → 44·27·29, 나 탈락 → 27명이 다로, 다 56 : 가 44.
 */
type BallotKey = "a" | "b" | "c";
type Segment = { ballot: BallotKey; n: number; moved?: boolean };
type Row = { option: string; segments: Segment[]; status: string; out?: boolean; won?: boolean };

const COLOR: Record<BallotKey, string> = { a: "#2563eb", b: "#d97706", c: "#16a34a" };
const NAME: Record<BallotKey, string> = { a: "가>나>다", b: "나>다>가", c: "다>가>나" };

const SCENES: readonly (
  { label: string; summary: string; note: string; counts: Record<BallotKey, number>; rows: Row[] }
)[] = [
  {
    label: "1차: 1위 표만 셉니다",
    summary: "가 40 · 나 31 · 다 29",
    note: "막대 길이가 그 안을 1위로 둔 사람 수입니다. 가장 적은 다가 탈락합니다.",
    counts: { a: 40, b: 31, c: 29 },
    rows: [
      { option: "가", segments: [{ ballot: "a", n: 40 }], status: "40" },
      { option: "나", segments: [{ ballot: "b", n: 31 }], status: "31" },
      { option: "다", segments: [{ ballot: "c", n: 29 }], status: "29 탈락", out: true },
    ],
  },
  {
    label: "결선: 다의 29명이 가로",
    summary: "가 69 : 나 31 → 가 승",
    note: "다>가>나를 적은 29명은 다가 빠지면 가를 고릅니다. 가가 69대 31로 이깁니다.",
    counts: { a: 40, b: 31, c: 29 },
    rows: [
      { option: "가", segments: [{ ballot: "a", n: 40 }, { ballot: "c", n: 29, moved: true }], status: "69 승", won: true },
      { option: "나", segments: [{ ballot: "b", n: 31 }], status: "31" },
      { option: "다", segments: [], status: "탈락", out: true },
    ],
  },
  {
    label: "네 명이 가를 더 좋아하게 됩니다",
    summary: "가 44 · 나 27 · 다 29",
    note: "나를 1위로 두었던 네 명이 가>나>다로 바꿉니다. 가는 늘었지만 나가 27로 줄어 이번에는 다가 아니라 나가 탈락합니다.",
    counts: { a: 44, b: 27, c: 29 },
    rows: [
      { option: "가", segments: [{ ballot: "a", n: 40 }, { ballot: "a", n: 4, moved: true }], status: "40+4" },
      { option: "나", segments: [{ ballot: "b", n: 27 }], status: "27 탈락", out: true },
      { option: "다", segments: [{ ballot: "c", n: 29 }], status: "29" },
    ],
  },
  {
    label: "결선: 나의 27명이 다로",
    summary: "다 56 : 가 44 → 가 패",
    note: "나>다>가를 적은 27명은 나가 빠지면 다를 고릅니다. 가의 지지가 늘었는데 결과는 승리에서 패배로 바뀌었습니다. 이것이 단조성 위반입니다.",
    counts: { a: 44, b: 27, c: 29 },
    rows: [
      { option: "가", segments: [{ ballot: "a", n: 44 }], status: "44" },
      { option: "나", segments: [], status: "탈락", out: true },
      { option: "다", segments: [{ ballot: "c", n: 29 }, { ballot: "b", n: 27, moved: true }], status: "56 승", won: true },
    ],
  },
];

export default function RunoffMonotonicityViz() {
  return (
    <SceneShell
      eyebrow="결선의 대가"
      title="가를 더 좋아한 네 명 때문에 가가 질 수 있습니다"
      description="유권자 100명의 예입니다(가정). 1차에서 한 안을 떨어뜨리고 남은 둘을 결선에 붙입니다. 글로 따라가는 설명은 바로 아래 펼침에 있습니다."
      note="점선 테두리는 그 장면에서 옮겨 온 표입니다."
      ariaLabel="결선 투표에서 네 명이 가로 옮겨 탈락자가 바뀌고 가가 패배하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(["a", "b", "c"] as const).map((key) => (
                <span key={key} className="flex min-w-0 flex-wrap items-center gap-x-1">
                  <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: COLOR[key] }} />
                  <span>{NAME[key]}</span>
                  <strong className="font-mono">{scene.counts[key]}명</strong>
                </span>
              ))}
            </div>
            <div className="space-y-2">
              {scene.rows.map((row) => (
                <div key={row.option} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-sm">
                  <span className={row.won ? "font-bold" : row.out ? "text-muted-foreground" : ""}>{row.option}</span>
                  <div className={`flex h-7 min-w-0 overflow-hidden rounded-sm ${row.out && row.segments.length === 0 ? "border border-border" : "bg-muted/40"}`}>
                    {row.segments.map((segment, index) => (
                      <span
                        key={index}
                        className="box-border flex h-full items-center justify-center font-mono text-xs font-bold text-white"
                        style={{
                          width: `${segment.n}%`,
                          backgroundColor: COLOR[segment.ballot],
                          outline: segment.moved ? "1px dashed #0f172a" : undefined,
                          outlineOffset: segment.moved ? "-2px" : undefined,
                          opacity: row.out ? 0.45 : 1,
                        }}
                      >
                        {segment.n >= 20 ? segment.n : ""}
                      </span>
                    ))}
                  </div>
                  <span className={`text-right font-mono text-xs ${row.won ? "font-bold" : row.out ? "text-muted-foreground" : ""}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
