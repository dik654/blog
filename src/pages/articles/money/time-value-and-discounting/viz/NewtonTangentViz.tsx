import SceneShell from "./SceneShell";

/**
 * 본문 대응: #irr AlgorithmBlock — 접선이 0을 지나는 자리로 옮기는 반복.
 * f = NPV(r), 흐름 −10,000/+4,000×3(만 원), 시작 30%(가정): 30 → 3.21 → 9.08 → 9.70%.
 * 마지막 장면은 −10,000/+23,000/−13,200(가정)의 15% 지점: 기울기 약 −33, 접선이 약 72.5%에서 0을 지남.
 */
const ONE = [-10000, 4000, 4000, 4000] as const;
const TWO = [-10000, 23000, -13200] as const;
const f = (flows: readonly number[], r: number) => flows.reduce<number>((sum, c, t) => sum + c / (1 + r) ** t, 0);
const slope = (flows: readonly number[], r: number) => flows.reduce<number>((sum, c, t) => sum - (t * c) / (1 + r) ** (t + 1), 0);
const next = (flows: readonly number[], r: number) => r - f(flows, r) / slope(flows, r);

const R0 = 0.3;
const ITER = [0, 1, 2, 3].reduce<number[]>((acc) => [...acc, next(ONE, acc[acc.length - 1])], [R0]);

const W = 360;
const H = 190;
const L = 46;
const RIGHT = 350;
const T = 14;
const B = 166;
const R_MAX = 0.36;

const VIEWS = {
  one: { flows: ONE, min: -3600, max: 2400, ticks: [2000, 0, -2000] },
  two: { flows: TWO, min: -240, max: 60, ticks: [0, -200] },
} as const;

const SCENES = [
  { label: "시작값을 넣습니다", summary: "r = 30%에서 NPV ≈ −2,736", view: "one", at: ITER[0], tangent: false, trail: 1, note: "주황 점이 곡선 위의 지금 자리, 초록 빈 점이 시도값입니다. 시작값은 보통 0.1 같은 값을 쓰지만, 사례에서는 첫 걸음에 답에 붙어 버려 접선이 보이도록 30%로 잡았습니다(가정)." },
  { label: "접선을 긋습니다", summary: "접선이 0을 지나는 곳: 약 3.21%", view: "one", at: ITER[0], tangent: true, trail: 2, note: "그 점의 기울기로 곧은 선을 그어 0선과 만나는 자리를 다음 시도값으로 삼습니다. 곡선이 휘어 있어 답을 지나쳤습니다." },
  { label: "그 자리에서 다시", summary: "약 3.21% → 약 9.08%", view: "one", at: ITER[1], tangent: true, trail: 3, note: "새 자리에서 같은 일을 합니다. 이번에는 첫 걸음보다 답에 훨씬 가까이 갑니다." },
  { label: "멈춥니다", summary: "약 9.70% · NPV ≈ 0", view: "one", at: ITER[3], tangent: false, trail: 5, note: "함숫값이 허용 오차 안에 들어오거나 r이 더 움직이지 않으면 멈춥니다. 이 현금흐름의 내부수익률 약 9.7%에 닿았습니다." },
  { label: "기울기가 0에 가까우면", summary: "다음 값이 약 72.5%로 튐 (가정)", view: "two", at: 0.15, tangent: true, trail: 1, note: "부호가 두 번 바뀌는 가정 사례의 꼭대기 근처로, 세로 눈금이 앞과 다릅니다. 접선이 거의 눕혀져 0선을 그림 밖에서 만납니다. 뉴턴 방법이 발산할 수 있어, 구간을 좁혀 가는 이분법으로 물러서는 편이 안전합니다." },
] as const;

export default function NewtonTangentViz() {
  return (
    <SceneShell
      eyebrow="수치로 찾기"
      title="접선을 따라 0선까지 미끄러지기를 되풀이합니다"
      description="아래 절차의 세 번째 줄인 뉴턴 방법을 그림으로 옮겼습니다. 가로는 할인율, 세로는 순현재가치(만 원)입니다. 현금흐름은 앞의 −1억, 매년 +4천만 원 사례입니다."
      ariaLabel="뉴턴 방법으로 내부수익률을 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const view = VIEWS[scene.view];
        const sx = (r: number) => L + (r / R_MAX) * (RIGHT - L);
        const sy = (v: number) => B - ((v - view.min) / (view.max - view.min)) * (B - T);
        const steps = 72;
        const d = Array.from({ length: steps + 1 }, (_, i) => {
          const r = (i / steps) * R_MAX;
          return `${i === 0 ? "M" : "L"}${sx(r).toFixed(1)} ${sy(f(view.flows, r)).toFixed(1)}`;
        }).join(" ");
        const y0 = f(view.flows, scene.at);
        const m = slope(view.flows, scene.at);
        const x1 = Math.max(0, Math.min(R_MAX, next(view.flows, scene.at)));
        const x0 = Math.max(0, scene.at + (scene.at > x1 ? 0.02 : -0.03));
        const yAt = (r: number) => y0 + m * (r - scene.at);
        const trail = scene.view === "one" ? ITER.slice(0, scene.trail) : [];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {(view.ticks as readonly number[]).map((tick) => (
              <g key={tick}>
                <line x1={L} x2={RIGHT} y1={sy(tick)} y2={sy(tick)} stroke={tick === 0 ? "#64748b" : "#94a3b8"} strokeWidth={1} strokeOpacity={tick === 0 ? 1 : 0.35} />
                <text x={L - 5} y={sy(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick > 0 ? `+${tick.toLocaleString("en-US")}` : tick === 0 ? "0" : `−${Math.abs(tick).toLocaleString("en-US")}`}</text>
              </g>
            ))}
            {[0, 0.1, 0.2, 0.3].map((r) => (
              <text key={r} x={sx(r)} y={B + 16} textAnchor="middle" fontSize={11} fill="#64748b">{Math.round(r * 100)}%</text>
            ))}
            <path d={d} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            {scene.tangent && (
              <line x1={sx(x0)} y1={sy(yAt(x0))} x2={sx(x1)} y2={sy(yAt(x1))} stroke="#d97706" strokeWidth={1.25} />
            )}
            {trail.map((r, i) => (
              <g key={i}>
                <circle cx={sx(r)} cy={sy(0)} r={3} fill="#ffffff" stroke="#16a34a" strokeWidth={1} />
                {i === trail.length - 1 && (
                  <text x={sx(r) - 4} y={r > 0.25 ? sy(0) - 8 : sy(0) + 16} textAnchor="end" fontSize={12} fontWeight={700} fill="#16a34a">
                    {(r * 100).toFixed(r < 0.25 ? 2 : 0)}%
                  </text>
                )}
              </g>
            ))}
            <circle cx={sx(scene.at)} cy={sy(y0)} r={4} fill="#d97706" />
            {scene.view === "two" && <text x={RIGHT} y={27} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">약 72.5%까지 → 그림 밖</text>}
          </svg>
        );
      }}
    />
  );
}
