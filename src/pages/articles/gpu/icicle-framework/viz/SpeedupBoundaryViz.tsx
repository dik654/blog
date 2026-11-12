import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release-gate — S_e2e 예시.
 * Reference 12ms(load+run+verify, 내역은 본문에 없음).
 * Candidate: load 2 + H2D 2 + kernel 1 + D2H 1 + sync 1 + verify 2 = 9ms → 12/9 ≈ 1.33배.
 */
const REF_MS = 12;
const SCALE = 12;

const PARTS = [
  { name: "load", ms: 2, color: "#64748b" },
  { name: "H2D", ms: 2, color: "#7c3aed" },
  { name: "kernel", ms: 1, color: "#2563eb" },
  { name: "D2H", ms: 1, color: "#a855f7" },
  { name: "sync", ms: 1, color: "#0891b2" },
  { name: "verify", ms: 2, color: "#d97706" },
] as const;

const CAND_MS = PARTS.reduce<number>((sum, p) => sum + p.ms, 0);

const SCENES = [
  {
    label: "kernel만 재서 견주면",
    summary: "12 ÷ 1 = 12배처럼 보입니다",
    note: "Reference 전체 12ms를 candidate kernel 1ms와 나란히 두면 12배처럼 보입니다. 두 막대가 서로 다른 경계를 잰 것이라 이 비교는 성립하지 않습니다.",
  },
  {
    label: "같은 경계로 더하면",
    summary: `12 ÷ ${CAND_MS} ≈ ${(REF_MS / CAND_MS).toFixed(2)}배`,
    note: "Candidate에도 load 2, H2D 2, D2H 1, sync 1, verify 2ms를 같은 경계로 더하면 9ms입니다. Kernel 1ms는 그중 한 조각이고, end-to-end speedup은 12배가 아니라 약 1.33배입니다.",
  },
] as const;

export default function SpeedupBoundaryViz() {
  return (
    <SceneShell
      eyebrow="같은 시간 경계"
      title="Kernel이 1ms여도 candidate 전체는 9ms입니다"
      description="막대 길이가 시간(ms)입니다. Reference 12ms는 준비·실행·검증을 합한 값이며 본문은 그 내역을 나누지 않으므로 한 덩어리로 그렸습니다. H2D·D2H는 host와 GPU 사이의 입력·출력 전송입니다."
      ariaLabel="kernel 시간만 잰 비교와 같은 경계로 더한 end-to-end 비교"
      scenes={SCENES}
      render={(active) => {
        const shown = active === 0 ? PARTS.filter((p) => p.name === "kernel") : PARTS;
        const total = shown.reduce<number>((sum, p) => sum + p.ms, 0);
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <div className="flex items-baseline justify-between gap-3 text-xs sm:text-sm">
                <span className="text-muted-foreground">reference (load+run+verify)</span>
                <span className="shrink-0 font-mono font-bold">{REF_MS}ms</span>
              </div>
              <div className="mt-1 flex h-6 min-w-0 overflow-hidden rounded-sm bg-muted/40">
                <div className="h-full" style={{ width: "100%", backgroundColor: "#94a3b8" }} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between gap-3 text-xs sm:text-sm">
                <span className="font-bold">candidate {active === 0 ? "(kernel만)" : "(같은 경계)"}</span>
                <span className="shrink-0 font-mono font-bold">{total}ms</span>
              </div>
              <div className="mt-1 flex h-6 min-w-0 overflow-hidden rounded-sm bg-muted/40">
                {shown.map((p) => (
                  <div key={p.name} className="h-full border-r border-white/70 last:border-r-0" style={{ width: `${(p.ms / SCALE) * 100}%`, backgroundColor: p.color }} />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {PARTS.map((p) => {
                const on = shown.some((q) => q.name === p.name);
                return (
                  <span key={p.name} className={`inline-flex items-center gap-1.5 ${on ? "" : "opacity-35"}`}>
                    <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: p.color }} />
                    {p.name} {p.ms}ms
                  </span>
                );
              })}
            </div>
            <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>0</span>
              <span>6</span>
              <span>12ms</span>
            </div>
          </div>
        );
      }}
    />
  );
}
