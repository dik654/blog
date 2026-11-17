import SceneShell from "./SceneShell";

/**
 * 본문 대응: #feature-steering — x' = x + α·d_j. α=0 control과 여러 강도를 함께 비교하고,
 * α는 정상 activation 분포와 비교해 정한다. 큰 α의 변화는 out-of-distribution corruption일 수 있다.
 * 가정: 2차원 그림, 정상 범위는 가로 반지름 1.6·세로 반지름 1.0 타원, x = (−0.4, 0.2), |d_j| = 1, α = 0·1·2·4.
 * x' 가로 좌표 −0.4, 0.6, 1.6, 3.6 → 타원 식 값 0.10, 0.18, 1.04, 5.10 (1 이하 안쪽, 1~1.5 경계, 그 너머 밖으로 색을 나눔).
 */
const RX = 1.6;
const RY = 1.0;
const X0 = [-0.4, 0.2] as const;
const ALPHAS = [0, 1, 2, 4];
const inside = (x: number, y: number) => (x / RX) ** 2 + (y / RY) ** 2;

const OX = 104;
const OY = 92;
const U = 46;
const sx = (v: number) => OX + v * U;
const sy = (v: number) => OY - v * U;

const DOTS = Array.from({ length: 40 }, (_, k) => {
  const r = Math.sqrt((k + 0.5) / 40) * 0.95;
  const t = k * 2.39996;
  return [r * Math.cos(t) * RX, r * Math.sin(t) * RY] as const;
});

const SCENES: { label: string; summary: string; note: string; alpha: number }[] = [
  {
    label: "α = 0 control",
    summary: "x' = x",
    note: "방향을 더하지 않은 채 같은 절차를 실행한 기준입니다. Δy는 이 결과와의 차이로 잽니다.",
    alpha: 0,
  },
  {
    label: "작은 α",
    summary: "α = 1 · 정상 범위 안",
    note: "x'가 여전히 평소 activation이 모이는 범위 안에 있습니다. α=0 control과 견주어 예측한 방향의 변화가 반복되는지 봅니다.",
    alpha: 1,
  },
  {
    label: "중간 α",
    summary: "α = 2 · 범위 경계",
    note: "x'가 평소 범위의 가장자리에 닿습니다. 강도를 하나만 보지 않고 0, 1, 2처럼 여러 강도에서 변화가 어떻게 커지는지(dose–response) 함께 봅니다.",
    alpha: 2,
  },
  {
    label: "큰 α",
    summary: "α = 4 · 범위 밖",
    note: "x'가 평소 activation이 거의 없는 곳까지 밀려났습니다. 출력이 크게 바뀌어도 feature의 정상 역할이 아니라 out-of-distribution corruption일 수 있으므로 capability side effect도 함께 기록합니다.",
    alpha: 4,
  },
];

function Plane({ alpha }: { alpha: number }) {
  const xp = X0[0] + alpha;
  const level = inside(xp, X0[1]);
  const color = level <= 1 ? "#2563eb" : level <= 1.5 ? "#d97706" : "#dc2626";
  return (
    <svg viewBox="0 0 360 184" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`α=${alpha}일 때 개입한 activation 위치`}>
      <ellipse cx={OX} cy={OY} rx={RX * U} ry={RY * U} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <text x={OX} y={OY + RY * U + 16} textAnchor="middle" fontSize={10} fill="#64748b">정상 activation 범위 (가정)</text>
      {DOTS.map(([x, y], k) => (
        <circle key={k} cx={sx(x)} cy={sy(y)} r={2} fill="#94a3b8" opacity={0.7} />
      ))}
      <line x1={sx(X0[0])} y1={sy(X0[1])} x2={sx(X0[0] + 4)} y2={sy(X0[1])} stroke="#e2e8f0" strokeWidth={1} />
      {ALPHAS.map((a) => (
        <g key={a}>
          <line x1={sx(X0[0] + a)} x2={sx(X0[0] + a)} y1={30} y2={sy(X0[1]) + 4} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
          <text x={sx(X0[0] + a)} y={24} textAnchor="middle" fontSize={10} fill={a === alpha ? color : "#94a3b8"} fontWeight={a === alpha ? 700 : 400}>α={a}</text>
        </g>
      ))}
      {alpha > 0 && (
        <line x1={sx(X0[0])} y1={sy(X0[1])} x2={sx(xp) - 6} y2={sy(X0[1])} stroke={color} strokeWidth={1.25} />
      )}
      <circle cx={sx(X0[0])} cy={sy(X0[1])} r={4} fill="#475569" />
      <text x={sx(X0[0])} y={sy(X0[1]) + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">x</text>
      {alpha > 0 && (
        <>
          <circle cx={sx(xp)} cy={sy(X0[1])} r={5} fill={color} />
          <text x={sx(xp)} y={sy(X0[1]) + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>x&apos;</text>
        </>
      )}
      <line x1={250} x2={300} y1={164} y2={164} stroke="#64748b" strokeWidth={1} />
      <polygon points="300,164 294,161 294,167" fill="#64748b" />
      <text x={305} y={168} fontSize={10} fill="#64748b">d_j 방향</text>
    </svg>
  );
}

export default function SteeringDoseViz() {
  return (
    <SceneShell
      eyebrow="개입 강도"
      title="α를 키우면 x'가 평소 activation 범위를 벗어납니다"
      description="회색 점은 평소 수집되는 activation, x는 원 activation, x' = x + α·d_j는 feature 방향 d_j를 α만큼 더한 activation입니다. 2차원 평면과 범위 모양, α 값은 그림을 위한 가정이며 Δy 크기는 그리지 않았습니다."
      ariaLabel="개입 강도 α를 0, 1, 2, 4로 키울 때 개입한 activation이 정상 범위를 벗어나는 네 장면"
      scenes={SCENES}
      render={(i) => <Plane alpha={SCENES[i].alpha} />}
    />
  );
}
