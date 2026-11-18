import SceneShell from "./SceneShell";

/**
 * 본문 대응: #parallel-frontier — bucket 합 뒤 큰 digit부터 running sum을 누적하는 weighted reduction.
 * w=2 window 하나의 bucket B1, B2, B3. 목표 1·B1 + 2·B2 + 3·B3.
 * R: B3 → B3+B2 → B3+B2+B1, 합계: B3 → 2B3+B2 → 3B3+2B2+B1.
 */
const BUCKETS = [3, 2, 1] as const;

/** 장면별 [B3, B2, B1]의 running sum 포함 여부와 누적 합계의 계수 */
const STATES = [
  { running: [0, 0, 0], total: [0, 0, 0] },
  { running: [1, 0, 0], total: [1, 0, 0] },
  { running: [1, 1, 0], total: [2, 1, 0] },
  { running: [1, 1, 1], total: [3, 2, 1] },
] as const;

const SCENES = [
  { label: "목표: digit만큼 곱해 더하기", summary: "1·B1 + 2·B2 + 3·B3", note: "B2 안의 point는 digit이 2였으므로 두 번, B3 안의 point는 세 번 더해져야 합니다. 빈 칸 수가 각 bucket에 필요한 횟수입니다." },
  { label: "큰 digit부터: B3", summary: "R = B3 · 합계 = B3", note: "running sum R에 가장 큰 bucket B3을 넣고, 그 R을 합계에 한 번 더합니다." },
  { label: "B2를 R에 더하기", summary: "R = B3+B2 · 합계 = 2B3+B2", note: "R에 B2를 보탠 뒤 다시 합계에 더합니다. B3은 두 번째로 더해지고 B2는 처음 더해집니다. 이 줄은 바로 앞 R이 끝나야 시작할 수 있습니다." },
  { label: "B1까지 더하면 끝", summary: "합계 = 3B3 + 2B2 + B1", note: "모든 칸이 채워져 목표와 같아졌습니다. digit을 곱하는 scalar multiplication 없이 덧셈만으로 무게가 붙지만, 각 줄이 앞 줄을 기다리는 순서는 남습니다." },
] as const;

function Cells({ count, filled, color }: { count: number; filled: number; color: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }, (_, k) => (
        <span
          key={k}
          className="h-5 w-5 rounded-sm border"
          style={{ borderColor: color, backgroundColor: k < filled ? color : "transparent" }}
        />
      ))}
    </div>
  );
}

export default function BucketRunningSumViz() {
  return (
    <SceneShell
      eyebrow="weighted reduction"
      title="큰 digit부터 running sum을 쌓으면 무게가 저절로 붙습니다"
      description="w=2 window 하나에 남은 bucket 세 개를 합칩니다. 오른쪽 칸 하나가 그 bucket을 합계에 한 번 더한 횟수입니다."
      ariaLabel="bucket B3, B2, B1을 running sum으로 누적해 3B3 + 2B2 + B1을 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 text-[11px] text-muted-foreground">
              <span>bucket</span>
              <span>R에 들어 있나</span>
              <span>합계에 더한 횟수</span>
            </div>
            {BUCKETS.map((b, row) => (
              <div key={b} className="grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border bg-background px-2 py-2">
                <span className="font-mono text-sm font-bold">B{b}</span>
                <span className={`font-mono text-xs ${state.running[row] ? "font-bold text-[#2563eb]" : "text-muted-foreground"}`}>
                  {state.running[row] ? "포함" : "아직"}
                </span>
                <div className="flex items-center gap-2">
                  <Cells count={b} filled={state.total[row]} color="#2563eb" />
                  <span className="font-mono text-xs">{state.total[row]}/{b}</span>
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
