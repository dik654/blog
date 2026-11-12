import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scheduler-source — 사례의 두 번째 실행에서 A의 남은 양을 구하고(516–523행),
 * 남은 예산 4와 min을 취한 뒤, KV 확보(578–586행)가 되면 637행에서 예산을 차감한다.
 * 확보 실패 시 590행부터 정책에 따라 다른 요청을 빼고 재시도한다.
 * 원문 식: num_tokens_with_spec + num_output_placeholders − num_computed_tokens = 6 + 0 − 4 = 2.
 */
const BUDGET = 4;

const SCENES = [
  {
    label: "남은 양 구하기",
    summary: "6 + 0 − 4 = 2",
    lines: "516–519행",
    note: "A의 num_tokens_with_spec은 6, num_output_placeholders는 0, num_computed_tokens는 4입니다. 아직 계산하지 않은 token은 2입니다. (가정)",
  },
  {
    label: "예산으로 자르기",
    summary: "min(2, 4) = 2",
    lines: "523행",
    note: "남은 양 2와 남은 token_budget 4 가운데 작은 값을 고릅니다. A에는 2를 배정합니다. 원문에는 이 밖에도 추가 조건이 있습니다.",
  },
  {
    label: "KV 확보 뒤 차감",
    summary: "budget 4 − 2 = 2",
    lines: "578–586 · 637행",
    note: "allocate_slots가 KV 블록을 확보하는 등 추가 조건이 모두 통과한다면 637행에서 예산이 2로 줄고, B에 남은 2를 쓸 수 있습니다. (가정)",
  },
  {
    label: "KV 확보 실패",
    summary: "정책에 따라 빼고 재시도",
    lines: "590행~",
    note: "(가정을 바꿈) allocate_slots가 실패하면 우선순위 정책은 priority와 도착 시각으로, 다른 정책은 running의 뒤에서 뺄 요청을 고른 뒤 재시도합니다. 항상 마지막 요청만 빼는 것은 아닙니다.",
  },
] as const;

type Cell = "A" | "B" | "free";

function cellsFor(active: number): readonly Cell[] {
  if (active === 0) return ["free", "free", "free", "free"];
  if (active === 1) return ["A", "A", "free", "free"];
  if (active === 2) return ["A", "A", "B", "B"];
  return ["A", "A", "free", "free"];
}

const CELL_STYLE: Record<Cell, string> = {
  A: "border-blue-600 bg-blue-600/10 text-blue-700 dark:text-blue-300",
  B: "border-emerald-600 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300",
  free: "border-dashed border-border text-muted-foreground",
};

export default function SchedulerStepViz() {
  return (
    <SceneShell
      eyebrow="scheduler.py 한 번의 판단"
      title="A의 남은 2를 고르고, KV를 확보해야 예산이 줄어듭니다"
      description="7절 두 번째 실행의 A를 고정 commit의 scheduler.py로 따라갑니다. 네모 4칸은 이번 실행의 token_budget 4입니다. KV는 이미 처리한 token의 key·value 기록이며, allocate_slots가 그 기록을 둘 블록을 확보합니다."
      ariaLabel="A의 남은 token 계산, 예산 min, KV 확보 뒤 예산 차감, 확보 실패 시 정책별 preemption 분기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cells = cellsFor(active);
        const failed = active === 3;
        const tentative = active === 1 || failed;
        const allocState = active < 2 ? "아직 확인 전" : failed ? "실패" : "성공 (가정)";
        return (
          <div className="min-w-0 space-y-4">
            <div className="min-w-0 rounded-lg border border-border bg-background p-3">
              <p className="text-xs font-semibold text-primary">{scene.lines}</p>
              <p className="mt-1 break-words font-mono text-xs leading-6">
                <span className={active === 0 ? "font-bold" : "text-muted-foreground"}>num_tokens_with_spec 6 + num_output_placeholders 0 − num_computed_tokens 4 = 2</span>
              </p>
              <p className={`break-words font-mono text-xs leading-6 ${active === 1 ? "font-bold" : "text-muted-foreground"}`}>min(2, token_budget 4) = 2</p>
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-xs text-muted-foreground">token_budget 칸 (A = 파랑, B = 초록)</p>
              <div className="grid grid-cols-4 gap-2">
                {cells.map((cell, index) => (
                  <div
                    key={index}
                    className={`rounded-md border py-2 text-center text-sm font-semibold ${cell === "A" && tentative ? "border-dashed border-blue-600 text-blue-700 dark:text-blue-300" : CELL_STYLE[cell]}`}
                  >
                    {cell === "free" ? "·" : cell === "A" && tentative ? "A?" : cell}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                남은 token_budget:{" "}
                <span className="font-mono font-bold text-foreground">
                  {active === 2 ? "2 → B가 쓸 수 있음" : tentative ? `${BUDGET} (A? = 배정 예정, 아직 차감 전)` : BUDGET}
                </span>
              </p>
            </div>
            <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className={`rounded-md border px-3 py-2 text-xs ${failed ? "border-red-600" : active === 2 ? "border-emerald-600" : "border-dashed border-border"}`}>
                <p className="font-semibold">allocate_slots</p>
                <p className={failed ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}>{allocState}</p>
              </div>
              <div className={`rounded-md border px-3 py-2 text-xs leading-5 ${failed ? "border-amber-600" : "border-dashed border-border/60 text-muted-foreground/60"}`}>
                <p className="font-semibold">실패하면 뺄 요청 고르기</p>
                <p>우선순위 정책: priority와 도착 시각</p>
                <p>그 밖의 정책: running의 뒤에서</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
