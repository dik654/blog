import ParabolaPlot from "./ParabolaPlot";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 같은 시작값 4, 곱하는 수만 0.5·2·3.
 * 위치 4→2→1→0.5(점수 8→2→0.5→0.125), 4→−4→4→−4(점수 8), 4→−8→16→−32(점수 8→32→128→512).
 * 앞 장면의 위치 기록 Viz와 달리 곡선 위의 높이, 즉 점수를 그립니다.
 */
const SCENES = [
  { label: "곱하는 수 0.5", summary: "점수 8 → 2 → 0.5 → 0.125", factor: 0.5, range: 5, yMax: 10, ticks: [-4, -2, 0, 2, 4], note: "곡선의 같은 쪽 비탈을 따라 내려옵니다. 움직일수록 낮은 점수에 닿습니다." },
  { label: "곱하는 수 2", summary: "점수 8 → 8 → 8 → 8", factor: 2, range: 5, yMax: 10, ticks: [-4, -2, 0, 2, 4], note: "바닥을 넘어 반대편의 같은 높이에 닿습니다. 위치는 바뀌지만 0까지의 거리 4와 점수 8은 그대로입니다." },
  { label: "곱하는 수 3", summary: "점수 8 → 32 → 128 → 512", factor: 3, range: 36, yMax: 560, ticks: [-32, -16, 0, 16, 32], note: "넘어갈 때마다 더 높은 곳에 닿습니다. 값이 커서 이 장면만 축을 넓혔고, 작은 점선 칸이 앞 두 장면에서 본 범위입니다." },
] as const;

const BLUE = "#2563eb";
const GRAY = "#94a3b8";

export default function OvershootViz() {
  return (
    <SceneShell
      eyebrow="곡선 위에서 본 이동"
      title="내려가는 방향을 골라도 반대편의 더 높은 곳에 닿을 수 있습니다"
      description="곡선의 높이가 점수 x²/2(가정)이고 호 하나가 한 번의 이동입니다. 시작값 4에서 세 번씩 움직입니다."
      ariaLabel="곱하는 수에 따라 곡선 위에서 달라지는 세 번의 이동과 점수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const points = Array.from({ length: 4 }, (_, t) => 4 * (1 - scene.factor) ** t);
        const tickSet: readonly number[] = scene.ticks;
        return (
          <ParabolaPlot xRange={scene.range} yMax={scene.yMax} ticks={scene.ticks} ariaLabel={`${scene.label}: ${scene.summary}`}>
            {(sx, sy, base) => (
              <>
                {active === 2 && <rect x={sx(-5)} y={sy(10)} width={sx(5) - sx(-5)} height={base - sy(10)} fill="none" stroke={GRAY} strokeWidth={1} strokeDasharray="2 2" />}
                {points.slice(1).map((x, index) => {
                  const from = points[index];
                  const ax = sx(from);
                  const ay = sy((from * from) / 2);
                  const bx = sx(x);
                  const by = sy((x * x) / 2);
                  const cx = (ax + bx) / 2;
                  const cy = Math.min(ay, by) - 8 - index * 9;
                  const angle = Math.atan2(by - cy, bx - cx);
                  const head = [angle + 2.6, angle - 2.6].map((a) => `${bx + Math.cos(a) * 6},${by + Math.sin(a) * 6}`).join(" ");
                  return (
                    <g key={index}>
                      <path d={`M${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`} fill="none" stroke={BLUE} strokeWidth={1} />
                      <polygon points={`${bx},${by} ${head}`} fill={BLUE} />
                    </g>
                  );
                })}
                {points.map((x, index) => (
                  <g key={index}>
                    <circle cx={sx(x)} cy={sy((x * x) / 2)} r={3} fill={index === 0 ? "#ffffff" : BLUE} stroke={BLUE} strokeWidth={1} />
                    {active === 0 && index < 2 && (
                      <text x={sx(x) + (index === 0 ? -6 : 9)} y={sy((x * x) / 2) + (index === 0 ? -9 : 5)} textAnchor={index === 0 ? "end" : "start"} fontSize={11} fontWeight={700} fill={BLUE}>점수 {(x * x) / 2}</text>
                    )}
                    {active === 1 && index < 2 && (
                      <text x={sx(x) + (x > 0 ? -8 : 8)} y={sy((x * x) / 2) + 14} textAnchor={x > 0 ? "end" : "start"} fontSize={11} fontWeight={700} fill={BLUE}>점수 {(x * x) / 2}</text>
                    )}
                    {active === 2 && index > 0 && (
                      <text x={sx(x) + (x > 0 ? 8 : index === 3 ? 8 : -8)} y={sy((x * x) / 2) + (index === 3 ? 18 : 4)} textAnchor={x > 0 || index === 3 ? "start" : "end"} fontSize={11} fontWeight={700} fill={BLUE}>점수 {(x * x) / 2}</text>
                    )}
                    {!tickSet.includes(x) && index > 0 && (active !== 0 || x >= 0.5) && (
                      <text x={sx(x)} y={base + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>{x}</text>
                    )}
                  </g>
                ))}
              </>
            )}
          </ParabolaPlot>
        );
      }}
    />
  );
}
