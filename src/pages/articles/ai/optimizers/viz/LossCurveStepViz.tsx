import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #why-step-size — 오차 (θ−1)²의 곡선 위 이동.
 * θ=3: 오차 4, 변화율 2(θ−1)=4. η=0.1 → 3−0.4=2.6, 오차 1.6²=2.56. η=2 → 3−8=−5, 오차 (−6)²=36.
 */
const SCENES: readonly ShellScene[] = [
  { label: "현재 지점의 기울기", summary: "θ = 3 · 오차 4 · 변화율 4", note: "변화율 4는 θ=3 바로 근처에서 곡선이 얼마나 가파르게 올라가는지입니다. 초록 선이 그 기울기로, 곡선은 이 선에서 점점 벌어집니다." },
  { label: "이동 크기 0.1", summary: "θ = 2.6 · 오차 2.56", note: "0.1×4=0.4만큼 왼쪽으로 옮기면 오차가 4에서 2.56으로 줄어듭니다. 이 곡선에서는 작은 이동이 오차를 줄였습니다." },
  { label: "이동 크기 2", summary: "θ = −5 · 오차 36", note: "2×4=8만큼 옮기면 θ=1의 바닥을 지나쳐 오차가 36으로 커집니다. 변화율 4는 그 지점의 값으로 올바르지만 멀리 이동한 뒤까지 예언하지 않습니다." },
];

const W = 360;
const H = 226;
const BASE = 192;
const TOP = 18;
const X_MIN = -6;
const X_MAX = 4.5;
const Y_MAX = 40;
const sx = (theta: number) => 22 + ((theta - X_MIN) / (X_MAX - X_MIN)) * (W - 36);
const sy = (loss: number) => BASE - (loss / Y_MAX) * (BASE - TOP);
const loss = (theta: number) => (theta - 1) ** 2;
const CURVE = Array.from({ length: 106 }, (_, index) => X_MIN + index * 0.1)
  .filter((theta) => loss(theta) <= Y_MAX)
  .map((theta) => `${sx(theta).toFixed(1)},${sy(loss(theta)).toFixed(1)}`)
  .join(" ");
const TICKS = [-5, 1, 3];

function Point({ theta, color }: { theta: number; color: string }) {
  return <circle cx={sx(theta)} cy={sy(loss(theta))} r={5} fill={color} />;
}

export default function LossCurveStepViz() {
  return (
    <SceneShell
      eyebrow="이동 크기"
      title="같은 변화율 4에서 이동 크기만 바꾸면 도착하는 곳이 다릅니다"
      description="가로축은 학습 중인 숫자 θ, 세로축은 오차입니다. 곡선은 설명을 위해 고른 (θ−1)²이며, θ=3의 오차 4는 첫 사례의 오차 2.5와 별개인 예입니다 (가정)."
      ariaLabel="오차 곡선 위에서 이동 크기 0.1과 2의 도착 지점 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={22} x2={W - 14} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          {TICKS.map((theta) => (
            <g key={theta}>
              <line x1={sx(theta)} x2={sx(theta)} y1={BASE} y2={BASE + 5} stroke="#94a3b8" strokeWidth={1} />
              <text x={sx(theta)} y={BASE + 18} textAnchor="middle" fontSize={12} fill="#64748b">
                {theta < 0 ? `−${Math.abs(theta)}` : theta}
              </text>
            </g>
          ))}
          <text x={W - 14} y={BASE + 32} textAnchor="end" fontSize={12} fill="#64748b">
            θ
          </text>
          <text x={sx(1)} y={BASE - 7} textAnchor="middle" fontSize={12} fill="#64748b">
            오차 0
          </text>
          <polyline points={CURVE} fill="none" stroke="#64748b" strokeWidth={1.25} />
          {active === 0 && (
            <>
              <line x1={sx(2)} y1={sy(0)} x2={sx(4.2)} y2={sy(8.8)} stroke="#16a34a" strokeWidth={1.25} />
              <Point theta={3} color="#2563eb" />
              <text x={W - 14} y={112} textAnchor="end" fontSize={13} fontWeight={700} fill="#2563eb">
                θ=3 · 오차 4
              </text>
              <text x={sx(3.4)} y={186} textAnchor="start" fontSize={12} fill="#16a34a">
                기울기 4
              </text>
            </>
          )}
          {active === 1 && (
            <>
              <Point theta={3} color="#94a3b8" />
              <Point theta={2.6} color="#2563eb" />
              <text x={W - 14} y={94} textAnchor="end" fontSize={13} fontWeight={700} fill="#2563eb">
                θ=2.6 · 오차 2.56
              </text>
              <text x={W - 14} y={112} textAnchor="end" fontSize={12} fill="#64748b">
                0.4만 옮김 (회색은 출발점)
              </text>
            </>
          )}
          {active === 2 && (
            <>
              <line x1={sx(3)} y1={sy(4)} x2={sx(-5) + 7} y2={sy(36) + 5} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
              <Point theta={3} color="#94a3b8" />
              <Point theta={-5} color="#dc2626" />
              <text x={sx(-5) + 12} y={sy(36) - 4} textAnchor="start" fontSize={13} fontWeight={700} fill="#dc2626">
                θ=−5 · 오차 36
              </text>
              <text x={W - 14} y={112} textAnchor="end" fontSize={12} fill="#64748b">
                출발점 θ=3
              </text>
            </>
          )}
        </svg>
      )}
    />
  );
}
