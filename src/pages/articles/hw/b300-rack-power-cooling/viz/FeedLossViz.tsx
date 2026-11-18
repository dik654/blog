import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 첫 문단 "A/B feed … 한 feed 상실 뒤 허용 용량" + #source 실물 1의 전류 검산.
 * DC 고밀도 rack 피크 76kW. I = P / (√3 × 400V × 0.99) = 76000 / 685.9 ≈ 110.8A.
 * 80% continuous-load derating을 적용하는 관할권의 단일 125A 회로 → usable ≈ 100A < 110.8A.
 */
const PEAK_KW = 76;
const VOLT = 400;
const PF = 0.99;
const CURRENT = (PEAK_KW * 1000) / (Math.sqrt(3) * VOLT * PF);
const BREAKER = 125;
const USABLE = BREAKER * 0.8;
const SCALE_MAX = 140;

const SCENES = [
  {
    label: "정상: 두 feed가 함께 급전",
    summary: "A + B = rack 피크 76kW",
    note: "A/B feed는 rack 하나에 전원을 넣는 서로 독립된 두 급전 경로입니다. 정상일 때 둘이 피크 76kW를 나눠 받지만, 실제로 어떻게 나누는지는 측정해야 하므로 칸을 비워 두었습니다.",
  },
  {
    label: "A feed를 잃으면",
    summary: "B 혼자 76kW",
    note: "한 경로가 빠진 N−1 상태에서는 남은 B가 rack 피크 전부를 받습니다. 1절의 가정 사건에서 ‘feed 하나나 pump 하나가 빠지면 네 대를 유지할 수 없다’고 한 상황 중 전기 쪽이 이것입니다.",
  },
  {
    label: "76kW를 전류로 바꾸면",
    summary: `약 ${CURRENT.toFixed(1)}A > 사용 가능 ${USABLE}A`,
    note: "균형 3상·400V·역률 0.99(가정)로 계산하면 약 110.8A입니다. 80% 연속부하 감액을 적용하는 관할권에서 125A 단일 회로는 약 100A만 쓸 수 있어 혼자 감당하지 못합니다. 그래서 공식 고밀도 표는 utility source마다 여러 3상 회로와 2N 구성을 제시합니다. 이 계산으로 breaker나 cable을 고르지는 않습니다.",
  },
] as const;

function Feed({ name, state }: { name: string; state: "share" | "lost" | "full" }) {
  const lost = state === "lost";
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2 text-xs sm:text-sm">
      <span className={`font-semibold ${lost ? "text-muted-foreground line-through" : ""}`}>{name} feed</span>
      <div className={`relative h-6 min-w-0 rounded-sm border ${lost ? "border-dashed border-border/50" : "border-border"} bg-muted/30`}>
        {state === "share" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-sm border border-dashed border-blue-500/60 text-[11px] text-muted-foreground">
            분담 몫 (실측)
          </div>
        )}
        {state === "full" && (
          <div className="flex h-full w-full items-center justify-center rounded-sm text-[11px] font-bold text-white" style={{ backgroundColor: "#2563eb" }}>
            76kW 전부
          </div>
        )}
        {lost && <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-red-700 dark:text-red-400">상실</div>}
      </div>
    </div>
  );
}

export default function FeedLossViz() {
  return (
    <SceneShell
      eyebrow="한 feed를 잃은 상태"
      title="피크 76kW rack에서 급전 하나가 빠지면 남은 쪽이 전부 받습니다"
      description="3절의 DC 고밀도 rack(B300 4대, 피크 76kW) 하나를 따라갑니다. 정상 합계가 아니라 한 경로를 잃은 상태가 회로 용량의 기준이 됩니다."
      ariaLabel="A B 두 급전 경로 중 하나를 잃었을 때 남은 경로가 rack 피크를 모두 받고 전류가 회로 사용 한도를 넘는 과정"
      scenes={SCENES}
      render={(active) => {
        const showCurrent = active === 2;
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              <Feed name="A" state={active === 0 ? "share" : "lost"} />
              <Feed name="B" state={active === 0 ? "share" : "full"} />
              <p className="pl-[4rem] text-xs text-muted-foreground">→ rack 1개 · B300 4대 · 피크 {PEAK_KW}kW</p>
            </div>
            <div className={`space-y-1.5 rounded-lg border p-3 transition-opacity duration-300 motion-reduce:transition-none ${showCurrent ? "border-border" : "border-dashed border-border/40 opacity-40"}`}>
              <p className="text-xs font-semibold">B feed 전류 (A) · B가 125A 단일 회로라고 가정</p>
              <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
                <div
                  className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: showCurrent ? `${(CURRENT / SCALE_MAX) * 100}%` : "0%", backgroundColor: "#dc2626" }}
                />
                {[
                  { value: USABLE, label: `사용 가능 ${USABLE}`, color: "#d97706" },
                  { value: BREAKER, label: `회로 ${BREAKER}`, color: "#64748b" },
                ].map((mark) => (
                  <div key={mark.label} className="absolute inset-y-[-4px] border-l border-dashed" style={{ left: `${(mark.value / SCALE_MAX) * 100}%`, borderColor: mark.color }} />
                ))}
              </div>
              <div className="relative h-8 text-[10px] sm:text-[11px]">
                <span className="absolute -translate-x-full whitespace-nowrap pr-1 text-amber-700 dark:text-amber-400" style={{ left: `${(USABLE / SCALE_MAX) * 100}%` }}>
                  사용 가능 {USABLE}
                </span>
                <span className="absolute whitespace-nowrap pl-1 text-muted-foreground" style={{ left: `${(BREAKER / SCALE_MAX) * 100}%`, top: "1rem", transform: "translateX(-100%)" }}>
                  회로 {BREAKER}
                </span>
                <span className="absolute left-0 top-4 font-mono font-bold text-red-700 dark:text-red-400">{showCurrent ? `≈ ${CURRENT.toFixed(1)}` : ""}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
