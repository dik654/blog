import ParabolaPlot from "./ParabolaPlot";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — f(x)=x²/2, 곱하는 수 0.5.
 * 다시 계산: 4(기울기 4, −2)→2(기울기 2, −1)→1(기울기 1, −0.5)→0.5. 처음 기울기 4를 고집: 4→2→0→−2.
 */
const SCENES = [
  { label: "위치 4에서", summary: "기울기 4 → 2를 빼 위치 2", at: 4, slope: 4, next: 2, path: [4, 2], note: "짧은 선이 그 위치에서 곡선에 닿는 접선이고, 이 선의 기울기가 4입니다. 0.5를 곱한 2만큼 왼쪽으로 옮깁니다." },
  { label: "위치 2에서 다시 계산", summary: "기울기 2 → 1을 빼 위치 1", at: 2, slope: 2, next: 1, path: [4, 2, 1], note: "새 위치에서는 접선이 더 완만해 기울기가 2입니다. 그래서 이번에 빼는 양은 1로 줄어듭니다." },
  { label: "위치 1에서 다시 계산", summary: "기울기 1 → 0.5를 빼 위치 0.5", at: 1, slope: 1, next: 0.5, path: [4, 2, 1, 0.5], note: "바닥에 가까울수록 기울기가 작아져 이동도 저절로 작아집니다. 점수는 8→2→0.5→0.125로 내려갑니다." },
  { label: "처음 기울기 4를 계속 쓰면", summary: "매번 2를 빼 4→2→0→−2", at: 4, slope: 4, next: 2, path: [4, 2, 0, -2], note: "기울기를 다시 계산하지 않으면 이동이 2로 고정됩니다. 가장 낮은 위치 0을 찾고도 멈추지 않고 −2로 지나칩니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";

export default function RegradientViz() {
  return (
    <SceneShell
      eyebrow="위치가 바뀌면 기울기도 바뀝니다"
      title="이동할 때마다 그 자리의 기울기를 다시 구해야 합니다"
      description="곡선은 점수 x²/2(가정)이고 아래 화살표가 한 번의 이동입니다. 기울기에 곱하는 수는 0.5입니다."
      ariaLabel="위치마다 기울기를 다시 계산할 때와 처음 기울기를 고정할 때의 이동"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const path: readonly number[] = scene.path;
        const last = path[path.length - 1];
        return (
          <ParabolaPlot xRange={5} yMax={13} ticks={[-4, -2, 0, 2, 4]} ariaLabel={`${scene.label}: ${scene.summary}`}>
            {(sx, sy, base) => {
              const half = 0.9;
              const y0 = (scene.at * scene.at) / 2;
              return (
                <>
                  <line x1={sx(scene.at - half)} y1={sy(y0 - scene.slope * half)} x2={sx(scene.at + half)} y2={sy(y0 + scene.slope * half)} stroke={AMBER} strokeWidth={1.25} />
                  <text x={sx(scene.at) - 10} y={sy(y0) - 10} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>기울기 {scene.slope}</text>
                  {path.slice(1).map((x, index) => {
                    const from = path[index];
                    const arrowY = base + 8;
                    const dir = x < from ? 1 : -1;
                    return (
                      <g key={index}>
                        <line x1={sx(from)} x2={sx(x) + dir * 4} y1={arrowY} y2={arrowY} stroke={BLUE} strokeWidth={1.25} />
                        <polygon points={`${sx(x)},${arrowY} ${sx(x) + dir * 6},${arrowY - 3.5} ${sx(x) + dir * 6},${arrowY + 3.5}`} fill={BLUE} />
                      </g>
                    );
                  })}
                  {path.map((x) => (
                    <g key={x}>
                      <line x1={sx(x)} x2={sx(x)} y1={sy((x * x) / 2)} y2={base} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
                      <circle cx={sx(x)} cy={sy((x * x) / 2)} r={3.5} fill={BLUE} />
                    </g>
                  ))}
                  {(last === 1 || last === 0.5) && <text x={sx(last)} y={base + 24} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>{last}</text>}
                </>
              );
            }}
          </ParabolaPlot>
        );
      }}
    />
  );
}
