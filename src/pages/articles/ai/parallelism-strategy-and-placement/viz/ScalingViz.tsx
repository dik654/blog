import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scaling — T(1)=42 ms는 GPU 한 장에 다 들어간다고 가정한 계산값.
 * TP 8: 이상 42/8=5.25, 실제 6.3 → 42/(8×6.3)=83%.
 * TP 16: 이상 42/16=2.625, 실제 11 → 42/(16×11)=24%.
 * DP 2: 일 2배, TPOT 6.3 그대로 → 약 100%.
 */
const MAX = 42;
const fmt = (ms: number) => `${ms} ms`;

const SCENES = [
  { label: "Strong · TP 8", summary: "42 / (8 × 6.3) = 83%", note: "같은 일을 8장으로 나눕니다. 이상값은 8분의 1인 5.25 ms인데 실제는 6.3 ms이고, 그 비율이 83%입니다. 42 ms는 한 장에 다 들어간다고 가정한 계산값입니다.", rows: [["GPU 1장 (가정)", 42, "#94a3b8"], ["8장 · 이상값", 42 / 8, "#16a34a"], ["8장 · 실제", 6.3, "#2563eb"]] },
  { label: "Strong · TP 16", summary: "42 / (16 × 11) = 24%", note: "GPU를 두 배로 늘려 node를 넘기면 이상값은 2.63 ms인데 실제는 11 ms입니다. token 당 시간은 TP 8의 6.3 ms보다 오히려 늘어나고 효율은 24%까지 떨어집니다.", rows: [["GPU 1장 (가정)", 42, "#94a3b8"], ["16장 · 이상값", 42 / 16, "#16a34a"], ["16장 · 실제", 11, "#dc2626"]] },
  { label: "Weak · DP 2", summary: "6.3 / 6.3 ≈ 100%", note: "GPU 묶음과 요청을 함께 두 배로 늘립니다. router가 균등하고 replica가 독립이면 token 당 시간은 그대로이고 초당 token이 두 배가 됩니다.", rows: [["묶음 1개 · 요청 W", 6.3, "#2563eb"], ["묶음 2개 · 요청 2W", 6.3, "#2563eb"]] },
] as const;

export default function ScalingViz() {
  return (
    <SceneShell
      eyebrow="Scaling efficiency"
      title="같은 축에서 보는 83%, 24%, 약 100%"
      description="막대는 모두 token 당 시간(ms)이며 축이 같습니다. 이상값은 GPU 수만큼 정확히 줄어든다고 친 값입니다."
      ariaLabel="TP 8, TP 16, DP 2의 token 당 시간과 효율"
      scenes={SCENES}
      render={(index) => {
        const rows: readonly (readonly [string, number, string])[] = SCENES[index].rows;
        return (
        <div className="min-h-[7.5rem] min-w-0 space-y-2.5">
          {rows.map(([name, ms, color]) => (
            <div key={name} className="grid grid-cols-[6.75rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-xs">
              <span className="text-muted-foreground">{name}</span>
              <div className="h-5 min-w-0 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm" style={{ width: `${(ms / MAX) * 100}%`, backgroundColor: color }} />
              </div>
              <span className="text-right font-mono font-semibold">{fmt(Math.round(ms * 100) / 100)}</span>
            </div>
          ))}
        </div>
        );
      }}
    />
  );
}
