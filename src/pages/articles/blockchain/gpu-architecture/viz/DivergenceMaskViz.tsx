import SceneShell from "./ArchSceneShell";

/**
 * 본문 대응: #warp 끝 divergence 문단 — 같은 warp 안 branch가 갈리면 active mask로 경로를 나눠 실행할 수 있다.
 * lane 0–19가 A, lane 20–31이 B로 가는 분할은 그림용 가정이다.
 */
const WARP = 32;
const SPLIT = 20;

const SCENES = [
  {
    label: "1. 갈리기 전",
    summary: "32 / 32 lanes 실행",
    mode: "all",
    note: "Branch 전에는 warp의 32개 lane이 같은 instruction을 함께 실행합니다.",
  },
  {
    label: "2. A 경로만 켭니다",
    summary: "20 lanes 실행 · 12 lanes 대기 (가정)",
    mode: "a",
    note: "조건이 lane마다 다르게 나오면 warp는 active mask로 A로 가는 lane만 켜고 그 경로를 실행할 수 있습니다. 나머지 lane은 이 동안 쉽니다.",
  },
  {
    label: "3. B 경로만 켭니다",
    summary: "12 lanes 실행 · 20 lanes 대기 (가정)",
    mode: "b",
    note: "이어서 mask를 뒤집어 B로 가는 lane만 실행합니다. 두 경로를 차례로 지나는 동안 쉬는 lane이 생겨 lane utilization이 줄어듭니다.",
  },
  {
    label: "4. 다시 합쳐질 수 있습니다",
    summary: "divergence ≠ 틀린 결과",
    mode: "all",
    note: "각 lane은 자기 경로의 결과를 가지므로 divergence가 틀린 결과를 뜻하지는 않습니다. 짧은 branch를 억지로 없애 instruction을 늘리는 것도 항상 이득은 아니어서, eligible warps·stall reason·branch efficiency·kernel time을 함께 봅니다. Volta 이후에는 재수렴 시점이 보장되지 않아, 필요하면 __syncwarp()로 맞춥니다.",
  },
] as const;

export default function DivergenceMaskViz() {
  return (
    <SceneShell
      eyebrow="Branch divergence"
      title="한 warp 안에서 길이 갈리면 두 경로를 차례로 지날 수 있습니다"
      description="칸 하나가 lane 하나입니다. Active mask는 이번 instruction을 실행할 lane만 켜 두는 표시입니다. lane 0–19가 A, 20–31이 B로 가는 분할은 그림용 가정입니다."
      ariaLabel="32 lanes warp가 active mask로 A와 B 경로를 나누어 실행하는 네 단계"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid min-w-0 grid-cols-8 gap-1 sm:grid-cols-16">
              {Array.from({ length: WARP }, (_, lane) => {
                const inA = lane < SPLIT;
                const on = mode === "all" || (mode === "a" && inA) || (mode === "b" && !inA);
                const fill = !on ? "#ffffff00" : mode === "all" ? "#4f46e5" : inA ? "#0d9488" : "#d97706";
                return (
                  <div
                    key={lane}
                    className={`flex h-8 min-w-0 items-center justify-center rounded-[4px] border font-mono text-[10px] ${on ? "border-transparent text-white" : "border-dashed border-border text-muted-foreground/60"}`}
                    style={{ backgroundColor: fill }}
                  >
                    {active === 0 ? lane : inA ? "A" : "B"}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2 gap-y-1 text-xs">
              {(["all", "a", "b", "all"] as const).map((step, index) => (
                <div key={index} className="contents">
                  <span className={`font-mono ${index === active ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                    {index === 0 ? "branch 전" : index === 3 ? "합류 가능" : step === "a" ? "A 경로" : "B 경로"}
                  </span>
                  <div className="flex h-3.5 min-w-0 overflow-hidden rounded-sm bg-muted/40">
                    <span
                      className="block h-full"
                      style={{
                        width: step === "b" ? `${((WARP - SPLIT) / WARP) * 100}%` : step === "a" ? `${(SPLIT / WARP) * 100}%` : "100%",
                        marginLeft: step === "b" ? `${(SPLIT / WARP) * 100}%` : 0,
                        backgroundColor: index === active ? (step === "a" ? "#0d9488" : step === "b" ? "#d97706" : "#4f46e5") : "#cbd5e1",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">아래 띠는 시간 순서입니다. 색 칸이 그 구간에 실행 중인 lane, 빈 칸이 쉬는 lane입니다.</p>
          </div>
        );
      }}
    />
  );
}
