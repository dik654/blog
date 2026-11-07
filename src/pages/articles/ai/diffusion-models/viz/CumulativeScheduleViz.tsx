import SceneShell from "./SceneShell";

/**
 * 본문 대응: #schedule — β₁=0.1, β₂=0.2.
 * ᾱ₁=0.9, ᾱ₂=0.9×0.8=0.72, 누적 noise 1−0.72=0.28 (이전 noise 0.1×0.8=0.08 + 새 noise 0.2).
 */
interface Row {
  label: string;
  op: string;
  signal: number;
  noise: number;
}

const ROWS: readonly Row[] = [
  { label: "x₀", op: "원본", signal: 1, noise: 0 },
  { label: "x₁", op: "β₁=0.1 · 0.9배", signal: 0.9, noise: 0.1 },
  { label: "x₂", op: "β₂=0.2 · 0.8배", signal: 0.72, noise: 0.28 },
];

const SCENES = [
  { label: "원본", summary: "signal 1.00", shown: 1, direct: false, note: "전체 variance를 1로 놓고 시작합니다(가정). variance(분산)는 값이 흩어진 정도이며, 여기서는 전체에서 차지하는 몫으로 읽습니다." },
  { label: "첫 step", summary: "α₁ = 1 − 0.1 = 0.9", shown: 2, direct: false, note: "β₁만큼 새 noise가 들어오고 이전 state의 몫은 α₁=0.9배가 됩니다. signal 0.9, noise 0.1입니다." },
  { label: "둘째 step", summary: "ᾱ₂ = 0.9 × 0.8 = 0.72", shown: 3, direct: false, note: "이전 몫 전체가 0.8배가 됩니다. signal은 0.9×0.8=0.72이고, 이렇게 남은 비율 αₜ를 누적해 곱한 값이 ᾱₜ입니다. noise는 이전 0.1×0.8=0.08에 새 0.2를 더해 0.28이고, 1−0.72와 같습니다." },
  { label: "곱만 알면 한 번에", summary: "x₀ → x₂ 직접", shown: 3, direct: true, note: "누적 곱 ᾱₜ만 알면 x₁을 거치지 않고 x₂의 signal·noise 몫을 바로 정할 수 있습니다. Gaussian이 합성에 닫혀 있어 가능한 일입니다." },
];

function Bar({ signal, noise }: { signal: number; noise: number }) {
  return (
    <div className="flex h-7 min-w-0 overflow-hidden rounded-sm border border-border">
      <div className="h-full bg-[#2563eb]" style={{ width: `${signal * 100}%` }} />
      <div className="h-full bg-[#f59e0b]" style={{ width: `${noise * 100}%` }} />
    </div>
  );
}

export default function CumulativeScheduleViz() {
  return (
    <SceneShell
      eyebrow="누적 곱"
      title="남는 비율을 곱하면 원본이 얼마나 남았는지 나옵니다"
      description="막대 전체가 variance 1입니다. 파란 부분은 원본 signal의 몫, 주황 부분은 누적 noise의 몫입니다. β₁=0.1, β₂=0.2는 아래 예시의 값입니다."
      ariaLabel="두 step 동안 signal variance가 0.9와 0.72로 줄고 noise가 0.28로 느는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            {ROWS.map((row, index) => {
              const shown = index < scene.shown;
              return (
                <div key={row.label} className={scene.direct && index === 1 ? "opacity-35" : ""}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                    <span className={shown ? "font-bold" : "text-muted-foreground/50"}>{row.label} · {row.op}</span>
                    <span className="font-mono text-muted-foreground">{shown ? `${row.signal.toFixed(2)} / ${row.noise.toFixed(2)}` : "−"}</span>
                  </div>
                  {shown ? <Bar signal={row.signal} noise={row.noise} /> : <div className="h-7 rounded-sm border border-dashed border-border" />}
                </div>
              );
            })}
            <p className="pt-1 text-xs text-muted-foreground">
              <span className="mr-1 inline-block h-2.5 w-2.5 bg-[#2563eb]" />signal
              <span className="ml-3 mr-1 inline-block h-2.5 w-2.5 bg-[#f59e0b]" />noise
              <span className="ml-3">숫자는 signal / noise</span>
            </p>
          </div>
        );
      }}
    />
  );
}
