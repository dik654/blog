import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-two-paths — 입력·출력 2칸에서 배울 숫자를 실제 칸으로 셉니다.
 * 두 표·중간 3칸: 2×3+3×2=12. 세 표·중간 3칸 유지: 2×3+2×3+3×2=18(+50%).
 * 세 표·중간 2칸: 2×2+2×2+2×2=12.
 */
type Matrix = { name: string; rows: number; cols: number } | null;

const SCENES = [
  {
    label: "표 두 개 · 중간 3칸",
    summary: "2×3 + 3×2 = 12",
    mats: [{ name: "입력→중간", rows: 2, cols: 3 }, { name: "중간→출력", rows: 3, cols: 2 }, null] as readonly Matrix[],
    note: "한 경로에 곡선만 적용하는 구조입니다. 입력 2칸을 중간 3칸으로 보내는 표와, 중간 3칸을 출력 2칸으로 되돌리는 표가 있습니다. 칸 하나가 배울 숫자 하나입니다.",
  },
  {
    label: "표 세 개 · 중간 3칸 유지",
    summary: "2×3 + 2×3 + 3×2 = 18",
    mats: [{ name: "조절 표", rows: 2, cols: 3 }, { name: "내용 표", rows: 2, cols: 3 }, { name: "출력 표", rows: 3, cols: 2 }] as readonly Matrix[],
    note: "두 경로로 나누면 조절값을 만드는 표가 하나 더 생깁니다. 중간 폭 3을 그대로 두면 숫자는 18개로, 12개보다 50% 늘어납니다 (가정).",
  },
  {
    label: "표 세 개 · 중간 2칸",
    summary: "2×2 + 2×2 + 2×2 = 12",
    mats: [{ name: "조절 표", rows: 2, cols: 2 }, { name: "내용 표", rows: 2, cols: 2 }, { name: "출력 표", rows: 2, cols: 2 }] as readonly Matrix[],
    note: "중간 폭을 3에서 2로 줄이면 표가 세 개여도 다시 12개입니다 (가정). 숫자 수가 같아도 곱셈·메모리 접근·실행 시간까지 같다고 보장되지는 않습니다.",
  },
] as const;

const MAX_TOTAL = 18;

function Grid({ mat }: { mat: Matrix }) {
  if (!mat) {
    return (
      <div className="flex min-h-[7.5rem] flex-col items-center justify-center rounded-lg border border-dashed border-border/50 p-2 text-center text-xs text-muted-foreground/60">
        표 없음
      </div>
    );
  }
  const cells = Array.from({ length: mat.rows * mat.cols }, (_, i) => i);
  return (
    <div className="flex min-h-[7.5rem] flex-col items-center justify-between gap-1 rounded-lg border border-border p-2">
      <span className="text-center text-xs font-semibold leading-4">{mat.name}</span>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${mat.cols}, 1rem)` }}>
        {cells.map((i) => (
          <span key={i} className="h-4 w-4 rounded-sm border border-blue-600 bg-blue-600/15" />
        ))}
      </div>
      <span className="font-mono text-xs text-muted-foreground">
        {mat.rows}×{mat.cols} = {mat.rows * mat.cols}
      </span>
    </div>
  );
}

export default function ParamCountViz() {
  return (
    <SceneShell
      eyebrow="배울 숫자 세기"
      title="표가 하나 늘면 중간 폭을 줄여야 같은 숫자 수가 됩니다"
      description="입력과 출력은 각각 두 칸입니다. 작은 네모 하나가 표에 들어 있는 배울 숫자 하나이며, bias(따로 더하는 상수)는 세지 않습니다."
      ariaLabel="두 표와 세 표 구조에서 배울 숫자 개수를 칸으로 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const total = scene.mats.reduce<number>((sum, m) => sum + (m ? m.rows * m.cols : 0), 0);
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {scene.mats.map((mat, slot) => (
                <Grid key={slot} mat={mat} />
              ))}
            </div>
            <div className="space-y-2">
              {[
                { label: "기준 (표 두 개)", value: 12, color: "#64748b" },
                { label: "이 구조", value: total, color: "#2563eb" },
              ].map((bar) => (
                <div key={bar.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(bar.value / MAX_TOTAL) * 100}%`, backgroundColor: bar.color }} />
                  </div>
                  <span className="text-right font-mono font-bold">{bar.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
