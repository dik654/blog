import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 두 칸 입력이 비율 → 조절값 → 내용과 곱 → 합으로 이어지는 순서.
 * x=(1,−1): σ=(0.731059, 0.268941), g=x·σ=(0.731059, −0.268941), v=(2,−3),
 * g×v=(1.462117, 0.806824), 합 2.268941. 순서를 바꾼 (−1,1)은 합 2.731059.
 * Wg=단위행렬, Wv=대각(2,3), Wo 두 행 (1,0)은 본문이 정한 가정입니다.
 */
type Cell = readonly [string, string];
type Row = { key: string; label: string; sub: string; cells: Cell; signs: readonly [number, number] };

const ORIGINAL: readonly Row[] = [
  { key: "x", label: "입력 x", sub: "두 칸", cells: ["1", "−1"], signs: [1, -1] },
  { key: "r", label: "비율 σ(x)", sub: "항상 0–1", cells: ["0.731059", "0.268941"], signs: [1, 1] },
  { key: "g", label: "조절값 x·σ(x)", sub: "원래 값을 곱함", cells: ["0.731059", "−0.268941"], signs: [1, -1] },
  { key: "v", label: "내용 v", sub: "2배·3배 (가정)", cells: ["2", "−3"], signs: [1, -1] },
  { key: "m", label: "칸끼리 곱", sub: "조절값 × 내용", cells: ["1.462117", "0.806824"], signs: [1, 1] },
];

const SWAPPED: readonly Row[] = [
  { key: "x", label: "입력 x", sub: "순서만 바꿈", cells: ["−1", "1"], signs: [-1, 1] },
  { key: "r", label: "비율 σ(x)", sub: "항상 0–1", cells: ["0.268941", "0.731059"], signs: [1, 1] },
  { key: "g", label: "조절값 x·σ(x)", sub: "원래 값을 곱함", cells: ["−0.268941", "0.731059"], signs: [-1, 1] },
  { key: "v", label: "내용 v", sub: "2배·3배 (가정)", cells: ["−2", "3"], signs: [-1, 1] },
  { key: "m", label: "칸끼리 곱", sub: "조절값 × 내용", cells: ["0.537883", "2.193176"], signs: [1, 1] },
];

const SCENES = [
  {
    label: "비율 만들기",
    summary: "σ(1)≈0.731 · σ(−1)≈0.269",
    rows: ORIGINAL,
    shown: 2,
    total: null,
    note: "σ(x)=1/(1+exp(−x))는 어떤 입력이든 0과 1 사이의 비율을 냅니다. 입력 −1에서도 비율은 양수 0.268941입니다. 여기까지는 아직 원래 값을 곱하지 않았습니다.",
  },
  {
    label: "원래 값을 곱하기",
    summary: "−1 × 0.268941 = −0.268941",
    rows: ORIGINAL,
    shown: 3,
    total: null,
    note: "조절 경로는 이 비율에 원래 값을 곱합니다. 둘째 칸은 −1을 곱했으므로 조절값이 음수입니다. 0–1 범위에 있는 것은 비율이고, 곱한 뒤의 조절값은 그 범위를 벗어날 수 있습니다.",
  },
  {
    label: "내용과 같은 칸끼리 곱",
    summary: "(−0.268941) × (−3) = +0.806824",
    rows: ORIGINAL,
    shown: 5,
    total: null,
    note: "다른 경로가 만든 내용 (2,−3)과 위치별로 곱합니다. 첫 칸끼리, 둘째 칸끼리만 만나며 칸을 섞지 않습니다. 둘째 칸은 음수 두 개가 곱해져 양수가 됩니다.",
  },
  {
    label: "마지막 표로 다시 섞기",
    summary: "출력 ≈ (2.268941, 0)",
    rows: ORIGINAL,
    shown: 5,
    total: "2.268941",
    note: "마지막 표가 첫 출력에는 두 칸을 더하고 둘째 출력에는 0을 내도록 정했습니다 (가정). 1.462117 + 0.806824 ≈ 2.268941입니다.",
  },
  {
    label: "입력 순서를 바꾸면",
    summary: "(−1,1) → 출력 첫 칸 ≈ 2.731059",
    rows: SWAPPED,
    shown: 5,
    total: "2.731059",
    note: "같은 표에 (−1,1)을 넣으면 위치별 곱은 약 (0.537883, 2.193176), 합은 약 2.731059입니다. 두 입력 모두 원래 합은 0이지만 출력은 2.268941과 2.731059로 다릅니다. 표의 숫자는 이해를 위한 가정입니다.",
  },
] as const;

function Value({ text, sign, on }: { text: string; sign: number; on: boolean }) {
  if (!on) return <div className="flex h-10 items-center justify-center rounded-md border border-dashed border-border/50 font-mono text-xs text-muted-foreground/50">·</div>;
  const neg = sign < 0;
  return (
    <div className={`flex h-9 flex-col items-center justify-center rounded-md border font-mono text-sm leading-tight ${neg ? "border-red-500/70 bg-red-500/5" : "border-border bg-background"}`}>
      <span className={neg ? "font-semibold text-red-700 dark:text-red-400" : "font-semibold"}>{text}</span>
      <span className="text-[10px] text-muted-foreground">{neg ? "음수" : "양수"}</span>
    </div>
  );
}

export default function GatedCellTraceViz() {
  return (
    <SceneShell
      eyebrow="두 칸 추적"
      title="비율은 0–1이어도 곱한 값의 부호는 바뀝니다"
      description="1절의 입력 (1,−1)을 칸별로 따라갑니다. 위에서 아래로 한 줄씩 계산이 진행되고, 붉은 테두리는 음수입니다."
      ariaLabel="입력 두 칸이 sigmoid 비율, 조절값, 내용과의 곱, 마지막 합으로 이어지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,6rem)_minmax(0,6rem)] gap-2 text-xs text-muted-foreground">
              <span />
              <span className="text-center">칸 1</span>
              <span className="text-center">칸 2</span>
            </div>
            {scene.rows.map((row, index) => {
              const on = index < scene.shown;
              return (
                <div key={row.key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,6rem)_minmax(0,6rem)] items-center gap-2">
                  <div className={`min-w-0 text-xs leading-5 sm:text-sm ${on ? "" : "text-muted-foreground/50"}`}>
                    <span className="block font-semibold">{row.label}</span>
                    <span className="block text-[11px] text-muted-foreground">{row.sub}</span>
                  </div>
                  <Value text={row.cells[0]} sign={row.signs[0]} on={on} />
                  <Value text={row.cells[1]} sign={row.signs[1]} on={on} />
                </div>
              );
            })}
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,12.5rem)] items-center gap-2 border-t border-border pt-2">
              <div className={`text-xs leading-5 sm:text-sm ${scene.total ? "" : "text-muted-foreground/50"}`}>
                <span className="block font-semibold">출력 첫 칸</span>
                <span className="block text-[11px] text-muted-foreground">두 곱을 더함 (가정)</span>
              </div>
              <div className={`flex h-10 items-center justify-center rounded-md border font-mono text-sm ${scene.total ? "border-blue-600 font-bold text-blue-700 dark:text-blue-400" : "border-dashed border-border/50 text-muted-foreground/50"}`}>
                {scene.total ?? "·"}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
