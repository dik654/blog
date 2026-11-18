import SceneShell from "./GpuSceneShell";

/**
 * 본문 대응: #workload-envelope "가상 계산" — usable(가정) 24 GB board 23 GB, 32 GB board 31 GB.
 * Weight 22 + state 0.5 × 2 = 1 + workspace 1 + headroom 1 = 25 GB.
 * 25 > 23 → 24 GB board 탈락, 25 ≤ 31 → 32 GB board 통과(여유 6 GB).
 */
const PARTS = [
  { key: "weight", label: "Weight 22 GB", size: 22, color: "#64748b" },
  { key: "state", label: "State 0.5 × 2 = 1 GB", size: 0.5 * 2, color: "#2563eb" },
  { key: "workspace", label: "Workspace 1 GB", size: 1, color: "#d97706" },
  { key: "headroom", label: "Headroom 1 GB", size: 1, color: "#7c3aed" },
] as const;

const BOARDS = [
  { name: "24 GB board", total: 24, usable: 23 },
  { name: "32 GB board", total: 32, usable: 31 },
] as const;

const X_MAX = 34;
const TICKS = [0, 8, 16, 24, 32] as const;

const SCENES = [
  { label: "Weight 22 GB", summary: "22 GB", upto: 1, note: "Weight만 놓으면 두 board 모두 usable 안에 들어갑니다. 24 GB board에도 1 GB가 남아 보입니다." },
  { label: "Request state를 더합니다", summary: "22 + 0.5 × 2 = 23 GB", upto: 2, note: "Request마다 0.5 GB씩 두 개가 동시에 resident하면 1 GB가 더해집니다. 24 GB board의 usable 23 GB가 꽉 찹니다." },
  { label: "Workspace를 더합니다", summary: "23 + 1 = 24 GB", upto: 3, note: "Kernel workspace 1 GB를 더하면 24 GB입니다. 표기 용량과 같아 보여도 usable 23 GB를 이미 넘었습니다." },
  { label: "Headroom까지 더해 판정합니다", summary: "25 GB: 23 초과 · 31 이하", upto: 4, note: "운영 여유 1 GB까지 합한 25 GB는 24 GB board의 usable 23 GB를 넘어 탈락하고, 32 GB board는 31 GB 안에 들어가 6 GB가 남아 benchmark로 넘어갑니다." },
] as const;

export default function MemoryBudgetFitViz() {
  return (
    <SceneShell
      eyebrow="Memory 예산 쌓기"
      title="Weight가 들어가도 state·workspace·여유를 쌓으면 24 GB board는 넘칩니다"
      description="막대 한 줄이 board 하나입니다. 회색 테두리는 표기 용량, 세로 점선은 usable memory입니다. 모든 GB 값은 본문의 가상 계산이며, 특히 usable 23·31 GB는 실제 후보에서 runtime 측정값으로 바꿔야 하는 설명용 가정입니다."
      ariaLabel="weight 22, state 1, workspace 1, headroom 1 GB를 쌓아 25 GB가 24 GB board의 usable 23 GB를 넘고 32 GB board의 31 GB 안에 드는 과정"
      scenes={SCENES}
      render={(active) => {
        const upto = SCENES[active].upto;
        const shown = PARTS.slice(0, upto);
        const need = shown.reduce<number>((sum, part) => sum + part.size, 0);
        const pct = (gb: number) => `${(gb / X_MAX) * 100}%`;
        const starts = shown.map((_, i) => shown.slice(0, i).reduce<number>((sum, part) => sum + part.size, 0));
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-x-2">
              <div>
                <div className="mb-1 h-4" />
                {BOARDS.map((board) => (
                  <div key={board.name} className="h-14 text-xs font-semibold leading-[3.5rem]">{board.name}</div>
                ))}
              </div>
              <div className="min-w-0 pr-4">
                <div className="relative mb-1 h-4 text-[10px] text-muted-foreground">
                  {TICKS.map((t) => (
                    <span key={t} className="absolute -translate-x-1/2 font-mono" style={{ left: pct(t) }}>{t}</span>
                  ))}
                </div>
                {BOARDS.map((board) => {
                  const fits = need <= board.usable;
                  return (
                    <div key={board.name} className="relative h-14">
                      <div className="absolute top-2 h-6 rounded-sm border border-[#94a3b8]" style={{ left: 0, width: pct(board.total) }} />
                      {shown.map((part, i) => (
                        <div
                          key={part.key}
                          className="absolute top-2 h-6"
                          style={{ left: pct(starts[i]), width: pct(part.size), backgroundColor: part.color, opacity: starts[i] + part.size > board.usable ? 0.55 : 1 }}
                        />
                      ))}
                      <div className="absolute top-0 h-10 border-l border-dashed border-foreground" style={{ left: pct(board.usable) }} />
                      <span
                        className={`absolute top-9 whitespace-nowrap text-[11px] font-bold ${fits ? "text-[#15803d] dark:text-[#4ade80]" : "text-[#b91c1c] dark:text-[#f87171]"}`}
                        style={{ left: 0 }}
                      >
                        {`필요 ${need} / usable ${board.usable} GB · ${fits ? "들어감" : "넘침"}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {PARTS.map((part, i) => (
                <span key={part.key} className={`inline-flex items-center gap-1.5 ${i < upto ? "" : "opacity-40"}`}>
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: part.color }} />
                  {part.label}
                </span>
              ))}
              <span>흐린 칸: usable을 넘은 부분</span>
            </div>
          </div>
        );
      }}
    />
  );
}
