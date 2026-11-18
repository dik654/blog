import SceneShell from "./ArchSceneShell";

/**
 * 본문 대응: #warp 아래 resident block 식 — 글의 예시 숫자를 그대로 쓴다.
 * 130 threads ÷ 32 = 4.06 → 올림 5 warps(마지막 warp는 2 lanes만 참).
 * B_max 16 · B_T 8 · B_W 6 · B_R 3 · B_S 5 → min = 3(register). Register를 줄여 B_R = 4가 되면 min = 4.
 */
const LIMITS = [
  { key: "B_max", name: "architecture 상한", value: 16 },
  { key: "B_T", name: "thread가 허용", value: 8 },
  { key: "B_W", name: "warp가 허용", value: 6 },
  { key: "B_R", name: "register가 허용", value: 3 },
  { key: "B_S", name: "shared memory가 허용", value: 5 },
] as const;

const THREADS = 130;
const WARP = 32;
const WARPS = Math.ceil(THREADS / WARP);
const SCALE = 16;

const SCENES = [
  {
    label: "1. 덜 찬 warp도 한 칸을 씁니다",
    summary: "130 ÷ 32 → 올림 5 warps",
    note: "Thread 130개는 32개씩 네 warp를 채우고 2개가 남습니다. 남은 2개도 warp 한 칸을 통째로 차지하므로 block 하나가 5 warps로 계산됩니다.",
  },
  {
    label: "2. 다섯 제약이 각자 허용하는 block 수",
    summary: "16 · 8 · 6 · 3 · 5",
    note: "SM의 thread·warp·register·shared memory 한도를 block 하나의 사용량으로 나누면 각 자원이 허용하는 block 수가 나옵니다. 여기에 architecture 상한까지 다섯 값을 나란히 놓습니다.",
  },
  {
    label: "3. 가장 짧은 막대가 상한입니다",
    summary: "min = 3 · register 때문",
    note: "다른 자원이 여유가 있어도 register가 3 blocks만 허용하면 SM에는 3 blocks만 resident할 수 있습니다.",
  },
  {
    label: "4. Register를 줄이면 상한이 4로",
    summary: "min = 4 · 하지만 더 빠르다는 보장 없음",
    note: "Register 사용을 줄여 register 막대가 4가 되면 상한은 4 blocks입니다. 그러나 줄인 만큼 spill traffic이 늘면 실행 시간은 오히려 나빠질 수 있습니다. Resident block 상한은 latency hiding의 기회일 뿐 성능 보장이 아닙니다.",
  },
] as const;

export default function OccupancyLimitViz() {
  return (
    <SceneShell
      eyebrow="Resident block 상한"
      title="다섯 자원 가운데 가장 빡빡한 하나가 resident block 수를 정합니다"
      description="Resident block은 한 SM에 동시에 올라가 있는 block입니다. 숫자는 모두 아래 식의 예시이며, 130 threads 예와 막대 예는 서로 다른 예입니다."
      ariaLabel="130 threads가 5 warps가 되는 계산과 다섯 제약 중 최솟값이 resident block 상한이 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const values = LIMITS.map((limit) => (active === 3 && limit.key === "B_R" ? 4 : limit.value));
        const min = Math.min(...values);
        return (
          <div className="grid min-w-0 gap-5 md:grid-cols-2 md:gap-6">
            <div className={`min-w-0 ${active === 0 ? "" : "opacity-40"}`}>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Block 하나 = thread 130개</p>
              <div className="space-y-1">
                {Array.from({ length: WARPS }, (_, warp) => {
                  const filled = Math.min(WARP, THREADS - warp * WARP);
                  return (
                    <div key={warp} className="grid grid-cols-[3.5rem_minmax(0,1fr)_3rem] items-center gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">warp {warp}</span>
                      <div className="grid min-w-0 grid-cols-[repeat(32,minmax(0,1fr))] gap-px rounded-[3px] border border-border p-px">
                        {Array.from({ length: WARP }, (_, lane) => (
                          <span key={lane} className={`block h-2.5 rounded-[2px] ${lane < filled ? "bg-[#4f46e5]" : "bg-transparent"}`} />
                        ))}
                      </div>
                      <span className={`text-right font-mono text-[11px] ${filled < WARP ? "font-bold text-[#b45309]" : "text-muted-foreground"}`}>
                        {filled}/32
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`min-w-0 space-y-2 ${active === 0 ? "opacity-40" : ""}`}>
              <p className="text-xs font-semibold text-muted-foreground">각 제약이 허용하는 block 수</p>
              {LIMITS.map((limit, index) => {
                const value = values[index];
                const isMin = active >= 2 && value === min;
                const changed = active === 3 && limit.key === "B_R";
                return (
                  <div key={limit.key} className="grid grid-cols-[8.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
                    <span className={isMin ? "font-bold" : "text-muted-foreground"}>
                      <span className="font-mono">{limit.key}</span> {limit.name}
                    </span>
                    <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
                      <div
                        className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                        style={{ width: `${(value / SCALE) * 100}%`, backgroundColor: isMin ? "#dc2626" : "#94a3b8" }}
                      />
                    </div>
                    <span className={`text-right font-mono ${isMin ? "font-bold text-[#b91c1c]" : ""}`}>
                      {changed ? "3→4" : value}
                    </span>
                  </div>
                );
              })}
              <p className={`pt-1 text-sm font-semibold ${active >= 2 ? "" : "invisible"}`}>
                resident 상한 = min(…) = <span className="font-mono text-[#b91c1c]">{min} blocks</span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
