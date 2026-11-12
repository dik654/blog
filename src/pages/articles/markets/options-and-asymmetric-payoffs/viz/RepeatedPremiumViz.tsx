import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits 첫 문단 — 콜 매도자가 8을 10번 벌어 80을 쌓아도 한 번 주가 200에서 92를 잃으면 합계 −12.
 * 매도자 한 번의 만기 손익 = 8 − max(S − 100, 0). 주가 100 이하면 +8, 200이면 8 − 100 = −92.
 * 누적: 8, 16, …, 80, 그리고 80 − 92 = −12.
 */
const TRADES = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, -92] as const;
const CUMULATIVE = TRADES.reduce<number[]>((acc, value) => [...acc, (acc.length ? acc[acc.length - 1] : 0) + value], []);

const W = 360;
const H = 206;
const L = 40;
const R = 350;
const TOP = 18;
const BOTTOM = 178;
const Y_MIN = -100;
const Y_MAX = 90;
const SLOT = (R - L) / TRADES.length;

const sx = (index: number) => L + SLOT * index + SLOT / 2;
const py = (value: number) => TOP + ((Y_MAX - value) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);

const SCENES = [
  {
    label: "작은 이익 열 번",
    summary: "8 × 10 = 80",
    shown: 10,
    note: "만기 주가가 100을 넘지 않으면 콜 매도자는 받은 8을 그대로 남깁니다. 이런 만기가 열 번 이어지면(가정) 막대는 작지만 점으로 그린 누적은 80까지 꾸준히 올라갑니다.",
  },
  {
    label: "큰 손실 한 번",
    summary: "80 − 92 = −12",
    shown: 11,
    note: "열한 번째 만기에 주가가 200이면 받은 8에서 차액 100을 내야 해 −92입니다. 열 번 쌓은 80이 한 번에 사라지고 합계는 −12입니다. 이긴 횟수만 세면 놓치는 부분이라 각 거래의 확률과 규모를 함께 봐야 합니다.",
  },
] as const;

export default function RepeatedPremiumViz() {
  return (
    <SceneShell
      eyebrow="반복한 콜 매도"
      title="8을 열 번 받아도 92를 한 번 잃으면 합계는 −12입니다"
      description="막대 하나가 한 번의 콜 매도(행사가격 100·프리미엄 8, 단위 1)의 만기 손익이고, 점과 선은 그때까지의 누적 합계입니다. 열 번 뒤 한 번이라는 순서는 10절의 예를 그린 가정입니다."
      note="거래비용·세금·이자와 만기 전 담보 요구는 넣지 않았습니다."
      ariaLabel="콜 매도 열한 번의 회차별 손익과 누적 합계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const last = scene.shown - 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[-80, -40, 0, 40, 80].map((value) => (
              <g key={value}>
                <line x1={L} x2={R} y1={py(value)} y2={py(value)} stroke={value === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={1} />
                <text x={L - 6} y={py(value) + 4} textAnchor="end" fontSize={11} fill="#64748b">{value > 0 ? `+${value}` : value < 0 ? `−${-value}` : "0"}</text>
              </g>
            ))}
            {TRADES.map((value, index) => {
              const visible = index < scene.shown;
              const top = value >= 0 ? py(value) : py(0);
              return (
                <g key={index}>
                  <rect
                    x={sx(index) - 6}
                    y={top}
                    width={12}
                    height={Math.abs(py(value) - py(0))}
                    rx={1.5}
                    fill={value >= 0 ? "#16a34a" : "#dc2626"}
                    opacity={visible ? 0.75 : 0}
                  />
                  <text x={sx(index)} y={BOTTOM + 16} textAnchor="middle" fontSize={11} fill={visible ? "#64748b" : "#cbd5e1"}>{index + 1}</text>
                </g>
              );
            })}
            <CumulativeLine last={last} />
            {active === 1 && (
              <text x={sx(10) - 10} y={py(-70)} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">200에서 −92</text>
            )}
            <text x={R} y={BOTTOM + 28} textAnchor="end" fontSize={11} fill="#64748b">회차</text>
          </svg>
        );
      }}
    />
  );
}

function CumulativeLine({ last }: { last: number }) {
  const points = CUMULATIVE.slice(0, last + 1);
  const end = points[points.length - 1];
  return (
    <g>
      <polyline points={points.map((value, index) => `${sx(index)},${py(value)}`).join(" ")} fill="none" stroke="#2563eb" strokeWidth={1.25} />
      {points.map((value, index) => (
        <circle key={index} cx={sx(index)} cy={py(value)} r={index === last ? 3.5 : 2.5} fill="#2563eb" />
      ))}
      <text
        x={sx(last) - 8}
        y={end >= 0 ? py(end) - 8 : py(end) + 18}
        textAnchor="end"
        fontSize={11}
        fontWeight={700}
        fill="#1e3a8a"
      >
        {end >= 0 ? `누적 +${end}` : `합계 −${-end}`}
      </text>
    </g>
  );
}
