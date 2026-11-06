import SceneShell from "./SceneShell";

/**
 * 본문 대응: #noise-variance — T=1, n구간, h=1/n.
 * √h·ε: n×h=1 고정. h·ε: n×h²=h. n=4 → .25, n=16 → .0625.
 */
const SCENES = [
  { label: "한 번에 1초", n: 1, summary: "두 경우 모두 분산 1", note: "구간이 하나이면 h=1이라 √h와 h가 같습니다. 잘못된 구현의 차이는 구간을 나누기 시작해야 드러납니다." },
  { label: "네 번으로", n: 4, summary: "4×0.25=1 · 4×0.0625=0.25", note: "올바른 증가량은 칸 하나의 분산이 h=0.25이고 네 칸을 더해 1입니다. h를 곱하면 칸 하나가 0.25²=0.0625라 전체가 0.25입니다." },
  { label: "열여섯 번으로", n: 16, summary: "16×0.0625=1 · 16×0.00390625=0.0625", note: "올바른 쪽은 칸이 작아지고 많아져도 합이 1로 유지됩니다. 잘못된 쪽은 0.0625로 더 작아집니다. 간격을 줄일수록 남아야 할 흔들림이 사라집니다. 이는 Brownian 증가량 자체의 합에 대한 계산입니다." },
] as const;

const X0 = 12;
const FULL = 324;

function Row({ y, title, cell, n, color }: { y: number; title: string; cell: number; n: number; color: string }) {
  const total = cell * n;
  return (
    <g>
      <text x={X0} y={y - 7} fontSize={12.5} fontWeight={700} fill={color}>{title}</text>
      <rect x={X0} y={y} width={FULL} height={30} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
      {Array.from({ length: n }, (_, index) => (
        <rect key={index} x={X0 + index * cell * FULL} y={y} width={cell * FULL} height={30} fill={color} opacity={0.75} stroke="#ffffff" strokeWidth={cell * FULL > 6 ? 1 : 0} />
      ))}
      <text x={X0} y={y + 45} fontSize={12} fill="#64748b">칸 {n}개 × 분산 {cell} = 전체 분산 {total}</text>
    </g>
  );
}

export default function NoiseScaleViz() {
  return (
    <SceneShell
      eyebrow="전체 시간에서 검산"
      title="√h를 곱하면 전체 분산이 1로 남고 h를 곱하면 줄어듭니다"
      description="전체 시간 T=1을 n개 구간으로 나눕니다. 칸 하나가 한 구간 증가량의 분산이고 점선 틀의 폭이 분산 1입니다. 독립인 증가량의 분산은 더해집니다."
      ariaLabel="증가량의 분산을 칸으로 쌓아 비교"
      scenes={SCENES}
      render={(active) => {
        const { n } = SCENES[active];
        const h = 1 / n;
        return (
          <svg viewBox="0 0 348 168" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Row y={22} title="올바른 √h·ε" cell={h} n={n} color="#2563eb" />
            <Row y={106} title="잘못된 h·ε" cell={h * h} n={n} color="#dc2626" />
          </svg>
        );
      }}
    />
  );
}
