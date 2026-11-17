import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release-gate — speedup은 같은 end-to-end 경계에서 잰다.
 * 본문 예: baseline 100ms 중 kernel chain 20ms, 나머지 80ms. Kernel chain 10배 → 2ms.
 * candidate 최소 80 + 2 = 82ms, S = 100 / 82 ≈ 1.22.
 */
const REST = 80;
const KERNEL = 20;
const FACTOR = 10;
const FAST_KERNEL = KERNEL / FACTOR;
const BASELINE = REST + KERNEL;
const CANDIDATE = REST + FAST_KERNEL;
const SPEEDUP = (BASELINE / CANDIDATE).toFixed(2);
const SCALE = BASELINE;

const SCENES = [
  {
    label: "기존 전체 경로",
    summary: `${REST} + ${KERNEL} = ${BASELINE} ms`,
    note: `입력 준비부터 verifier receipt까지 잰 baseline이 ${BASELINE} ms이고, 그중 GPU로 옮길 kernel chain이 ${KERNEL} ms, 나머지가 ${REST} ms라는 본문의 예입니다.`,
  },
  {
    label: "Kernel chain만 10배",
    summary: `${KERNEL} → ${FAST_KERNEL} ms`,
    note: `가속은 ${KERNEL} ms 구간에만 닿습니다. 나머지 ${REST} ms는 그대로라 candidate는 최소 ${REST} + ${FAST_KERNEL} = ${CANDIDATE} ms입니다.`,
  },
  {
    label: "End-to-end speedup",
    summary: `S = ${BASELINE} / ${CANDIDATE} ≈ ${SPEEDUP}배`,
    note: `Kernel 쪽만 보면 10배지만 같은 경계의 전체 시간으로 나누면 약 ${SPEEDUP}배입니다. 두 경로 모두 같은 verifier가 승인한 proof만 셉니다.`,
  },
] as const;

function Segment({ width, color, label, dashed = false }: { width: number; color: string; label: string; dashed?: boolean }) {
  return (
    <div
      className={`flex h-full min-w-0 items-center justify-center overflow-hidden border font-mono text-[11px] font-bold ${dashed ? "border-dashed" : ""}`}
      style={{ width: `${(width / SCALE) * 100}%`, borderColor: color, backgroundColor: dashed ? "transparent" : `${color}22`, color }}
    >
      {label}
    </div>
  );
}

export default function EndToEndSpeedupViz() {
  return (
    <SceneShell
      eyebrow="End-to-end speedup"
      title="10배 빠른 kernel이 전체를 10배 줄이지는 않습니다"
      description="막대 길이는 같은 축척의 ms입니다. 보라색은 GPU로 가속하는 kernel chain, 회색은 그 밖의 나머지 시간이며 숫자는 본문의 예입니다."
      ariaLabel="baseline 100ms 중 20ms만 10배 빨라질 때 전체 82ms와 speedup 1.22배"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs">
            <span className="font-bold">Baseline</span>
            <div className="flex h-8 min-w-0 gap-px">
              <Segment width={REST} color="#64748b" label={`${REST}`} />
              <Segment width={KERNEL} color="#7c3aed" label={`${KERNEL}`} />
            </div>
            <span className="text-right font-mono font-bold">{BASELINE} ms</span>
          </div>
          <div className={`grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs ${active === 0 ? "opacity-30" : ""}`}>
            <span className="font-bold">Candidate</span>
            <div className="flex h-8 min-w-0 gap-px">
              <Segment width={REST} color="#64748b" label={`${REST}`} />
              <Segment width={FAST_KERNEL} color="#7c3aed" label="" />
              <Segment width={KERNEL - FAST_KERNEL} color="#94a3b8" label="" dashed />
            </div>
            <span className="text-right font-mono font-bold">{active === 0 ? "?" : `≥${CANDIDATE} ms`}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className={`rounded-lg border p-2 ${active === 2 ? "border-border" : "border-border/40 opacity-40"}`}>
              <span className="block text-[11px] text-muted-foreground">kernel chain만 보면</span>
              <strong className="font-mono text-sm">{KERNEL} / {FAST_KERNEL} = {FACTOR}배</strong>
            </div>
            <div className={`rounded-lg border p-2 ${active === 2 ? "border-primary bg-primary/5" : "border-border/40 opacity-40"}`}>
              <span className="block text-[11px] text-muted-foreground">같은 경계의 전체로 보면</span>
              <strong className="font-mono text-sm">{BASELINE} / {CANDIDATE} ≈ {SPEEDUP}배</strong>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">Candidate의 {FAST_KERNEL} ms 칸은 보라색 얇은 띠, 점선은 줄어든 {KERNEL - FAST_KERNEL} ms입니다.</p>
        </div>
      )}
    />
  );
}
