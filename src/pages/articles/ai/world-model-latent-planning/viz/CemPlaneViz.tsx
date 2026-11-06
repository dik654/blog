import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 행동 좌표 평면의 네 후보. 본문 예: [+1,+1], [+1,−1] → 평균 [+1,0].
 * 비용 4가 둘이므로 다른 쪽을 고르면 [+1,+1], [−1,+1] → 평균 [0,+1].
 * 다음 분포의 폭은 수치를 주지 않고 "첫 좌표는 같고 둘째 좌표만 갈림"만 그린다.
 */
const CX = 180;
const CY = 106;
const UNIT = 70;
const INK = "#64748b";
const LINE = "#94a3b8";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const AMBER = "#d97706";

const px = (a: number) => CX + a * UNIT;
const py = (a: number) => CY - a * UNIT;

const POINTS = [
  { a: 1, b: 1, cost: 0 },
  { a: 1, b: -1, cost: 4 },
  { a: -1, b: 1, cost: 4 },
  { a: -1, b: -1, cost: 16 },
] as const;

interface Scene {
  label: string;
  summary: string;
  note: string;
  elite: readonly string[];
  mean: readonly [number, number] | null;
  band: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "후보를 평면의 점으로", summary: "비용 0 · 4 · 4 · 16", elite: [], mean: null, band: false, note: "두 행동을 가로·세로 좌표로 놓으면 후보 하나가 점 하나입니다. 큰 연속 행동 공간에서는 이런 점을 일부만 표본으로 뽑습니다. 여기서는 설명을 위해 앞의 네 후보를 그대로 씁니다." },
  { label: "비용이 낮은 두 후보", summary: "평균 [+1, 0]", elite: ["1,1", "1,-1"], mean: [1, 0], band: false, note: "비용이 낮은 후보 두 개가 [+1,+1]과 [+1,−1]이라면 두 행동 좌표의 평균은 [+1,0]입니다. 이렇게 고른 좋은 후보 묶음을 elite라고 합니다." },
  { label: "같은 비용의 다른 쪽을 고르면", summary: "평균 [0, +1]", elite: ["1,1", "-1,1"], mean: [0, 1], band: false, note: "비용 4인 후보는 둘입니다. [−1,+1]을 고르면 평균은 [0,+1]로 바뀝니다. 비용이 같은 후보를 고르는 방식이 결과를 바꾸는 예입니다." },
  { label: "다음 표본 분포", summary: "평균 주변으로 좁힘", elite: ["1,1", "1,-1"], mean: [1, 0], band: true, note: "CEM은 elite 통계를 다음 표본 분포에 사용합니다. [+1,+1]과 [+1,−1]이면 첫 좌표는 같고 둘째 좌표만 갈립니다. 점선 띠는 그 모양을 나타낸 그림일 뿐 수치가 아니며, 탐색 분산도 결과를 바꾸고 전역 최적해는 보장되지 않습니다." },
];

const fmt = (value: number) => (value > 0 ? "+1" : value < 0 ? "−1" : "0");

export default function CemPlaneViz() {
  return (
    <SceneShell
      eyebrow="CEM의 한 걸음"
      title="좋은 후보의 평균이 다음에 뽑을 자리를 옮깁니다"
      description="CEM은 후보 행동을 표본으로 뽑고 비용이 작은 후보들의 통계로 다음 표본 분포를 좁히는 계획 방법입니다. 가로는 첫 행동, 세로는 둘째 행동입니다."
      note="이 평면은 본문의 네 후보를 재사용한 설명용 가정이며 실제 CEM 실행 기록이 아닙니다."
      ariaLabel="두 행동 좌표 평면에서 elite 후보를 골라 평균을 구하고 다음 분포를 정하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const mean = scene.mean;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={px(-1.4)} x2={px(1.15)} y1={CY} y2={CY} stroke={LINE} strokeWidth={1} />
            <line x1={CX} x2={CX} y1={py(1.4)} y2={py(1.4) + 2.8 * UNIT} stroke={LINE} strokeWidth={1} />
            <text x={px(-1.4) - 4} y={CY + 4} textAnchor="end" fontSize={12} fill={INK}>첫 행동</text>
            <text x={CX + 6} y={py(1.4) + 4} fontSize={12} fill={INK}>둘째 행동</text>
            {scene.band && (
              <rect x={px(1) - 10} y={py(1) - 12} width={20} height={2 * UNIT + 24} rx={8} fill="none" stroke={AMBER} strokeWidth={1.25} strokeDasharray="4 3" />
            )}
            {POINTS.map((point) => {
              const isElite = scene.elite.includes(`${point.a},${point.b}`);
              const anchor = point.a > 0 ? "start" : "end";
              const tx = px(point.a) + (point.a > 0 ? 14 : -14);
              return (
                <g key={`${point.a},${point.b}`}>
                  <circle cx={px(point.a)} cy={py(point.b)} r={isElite ? 7 : 5} fill={isElite ? GREEN : "none"} stroke={isElite ? GREEN : INK} strokeWidth={1} />
                  <text x={tx} y={py(point.b) - 2} textAnchor={anchor} fontSize={12} fontWeight={isElite ? 700 : 400} fill={isElite ? GREEN : INK}>[{fmt(point.a)},{fmt(point.b)}]</text>
                  <text x={tx} y={py(point.b) + 13} textAnchor={anchor} fontSize={12} fill={isElite ? GREEN : INK}>비용 {point.cost}</text>
                </g>
              );
            })}
            {mean && (
              <g>
                <rect x={px(mean[0]) - 5} y={py(mean[1]) - 5} width={10} height={10} fill={BLUE} />
                <text x={px(mean[0]) + (mean[0] > 0 ? 18 : 8)} y={py(mean[1]) + (mean[1] > 0 ? 22 : 4)} fontSize={12} fontWeight={700} fill={BLUE}>평균 [{fmt(mean[0])},{fmt(mean[1])}]</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
