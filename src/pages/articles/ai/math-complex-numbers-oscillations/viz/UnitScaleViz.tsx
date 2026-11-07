import SceneShell from "./SceneShell";

/**
 * 본문 대응: #unit-circle — (3,4)를 길이 5로 나누면 (3/5,4/5), cos φ=3/5, sin φ=4/5.
 * 한 번 돌린 단위 길이 점은 (−4/5,3/5). 5를 다시 곱하면 사례의 점으로 돌아온다.
 */
const SCENES = [
  { label: "길이 5인 점", summary: "(3,4)", show: 0, note: "왼쪽은 사례의 원입니다. 원점에서 점까지의 길이가 5입니다." },
  { label: "5로 나눕니다", summary: "(3/5, 4/5) = (cos φ, sin φ)", show: 1, note: "오른쪽은 길이 1인 원을 크게 그린 것입니다. φ는 원점에서 이 점으로 향한 각도입니다. 각도를 소수로 계산하지 않아도 가로가 cos φ=3/5, 세로가 sin φ=4/5입니다." },
  { label: "한 번 돌린 점", summary: "(−4/5, 3/5)", show: 2, note: "왼쪽 (−4,3)도 5로 나누면 오른쪽 (−4/5,3/5)입니다. 왼쪽에서 오른쪽으로 갈 때 5로 나누었으니, 5를 곱하면 사례의 점으로 돌아옵니다." },
] as const;

function Panel({ cx, radius, ticks, title, a, b, labelA, labelB, showB, color }: { cx: number; radius: number; ticks: string; title: string; a: readonly [number, number]; b: readonly [number, number]; labelA: string; labelB: string; showB: boolean; color: string }) {
  const cy = 112;
  const px = (value: number) => cx + value * radius;
  const py = (value: number) => cy - value * radius;
  return (
    <g>
      <text x={cx} y={14} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">{title}</text>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.7} />
      <line x1={cx - radius - 6} x2={cx + radius + 6} y1={cy} y2={cy} stroke="#94a3b8" strokeWidth={1} />
      <line x1={cx} x2={cx} y1={cy - radius - 6} y2={cy + radius + 6} stroke="#94a3b8" strokeWidth={1} />
      <text x={cx + radius - 2} y={cy + 15} textAnchor="middle" fontSize={11} fill="#64748b">{ticks}</text>
      <line x1={px(a[0])} x2={px(a[0])} y1={cy} y2={py(a[1])} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={cx} x2={px(a[0])} y1={py(a[1])} y2={py(a[1])} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={cx} x2={px(a[0])} y1={cy} y2={py(a[1])} stroke={color} strokeWidth={1.25} />
      <circle cx={px(a[0])} cy={py(a[1])} r={4.5} fill={color} />
      <text x={px(a[0]) + 2} y={py(a[1]) - 9} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{labelA}</text>
      {showB && (
        <g>
          <line x1={cx} x2={px(b[0])} y1={cy} y2={py(b[1])} stroke="#d97706" strokeWidth={1.25} />
          <circle cx={px(b[0])} cy={py(b[1])} r={4.5} fill="#d97706" />
          <text x={px(b[0]) - 4} y={py(b[1]) - 9} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">{labelB}</text>
        </g>
      )}
    </g>
  );
}

export default function UnitScaleViz() {
  return (
    <SceneShell
      eyebrow="길이를 1로"
      title="길이로 나누면 두 좌표에 방향만 남습니다"
      description="두 원은 눈금이 다릅니다. 왼쪽 원의 반지름은 5, 오른쪽 원의 반지름은 1입니다. 같은 방향의 점을 나란히 놓았습니다."
      ariaLabel="길이 5인 점을 길이 1인 원으로 옮기는 과정"
      scenes={SCENES}
      render={(active) => {
        const { show } = SCENES[active];
        return (
          <svg viewBox="0 0 360 212" className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Panel cx={90} radius={70} ticks="5" title="반지름 5" a={[0.6, 0.8]} b={[-0.8, 0.6]} labelA="(3,4)" labelB="(−4,3)" showB={show === 2} color="#2563eb" />
            {show >= 1 && <Panel cx={270} radius={70} ticks="1" title="반지름 1" a={[0.6, 0.8]} b={[-0.8, 0.6]} labelA="(3/5, 4/5)" labelB="(−4/5, 3/5)" showB={show === 2} color="#2563eb" />}
            {show >= 1 && <text x={180} y={118} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">÷5</text>}
          </svg>
        );
      }}
    />
  );
}
