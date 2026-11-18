import SceneShell from "./SceneShell";

/**
 * 본문 대응: #crypto-usage — RFC 8017 두 소수 분기의 h와 m=m2+q·h.
 * 0~34에서 7로 나눈 나머지가 2인 후보 2+7h(h=0..4)를 놓고 5로 나눈 나머지를 비교한다.
 * h=(3−2)×3 mod 5=3 → 2+7×3=23, 23 mod 5=3=m1.
 */
const P = 5;
const Q = 7;
const M1 = 3;
const M2 = 2;
const Q_INV = 3;
const H = ((M1 - M2) * Q_INV) % P;
const CANDIDATES = [0, 1, 2, 3, 4].map((h) => ({ h, value: M2 + Q * h }));

const W = 360;
const LABEL_X = 6;
const LEFT = 40;
const RIGHT = W - 16;
const AXIS_Y = 70;
const MAX = 35;
const px = (v: number) => LEFT + (v / MAX) * (RIGHT - LEFT);

const SCENES = [
  {
    label: "7에서의 기록은 그대로",
    summary: "2, 9, 16, 23, 30",
    note: "m₂=2에 7을 몇 번 더해도 7로 나눈 나머지는 2입니다. 0~34 안에는 h=0부터 4까지 다섯 후보가 있습니다.",
  },
  {
    label: "5에서의 나머지는 바뀜",
    summary: "2 → 4 → 1 → 3 → 0",
    note: "7을 하나 더할 때마다 5로 나눈 나머지가 2씩 밀립니다(7=5+2). 다섯 후보의 나머지가 0~4를 한 번씩 거칩니다.",
  },
  {
    label: "h를 계산으로 바로 고름",
    summary: `h = (3−2)×3 mod 5 = ${H}`,
    note: "하나씩 시험하지 않고 h=(m₁−m₂)·qInv mod p로 3을 얻습니다. 2+7×3=23은 5로 나누면 m₁=3, 7로 나누면 m₂=2입니다.",
  },
] as const;

export default function GarnerCandidatesViz() {
  return (
    <SceneShell
      eyebrow="7의 배수 더하기"
      title="7의 나머지를 지킨 채 5의 나머지만 맞춥니다"
      description="수직선은 0부터 n=35 바로 앞의 34까지이고 점 하나가 후보 m₂+7h입니다. 9절의 교육용 수 p=5, q=7, m₁=3, m₂=2, qInv=3을 씁니다(가정)."
      ariaLabel="7로 나눈 나머지가 2인 후보 2, 9, 16, 23, 30과 각 후보를 5로 나눈 나머지, h=3으로 고른 23"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
          {[0, 35].map((t) => (
            <g key={t}>
              <line x1={px(t)} x2={px(t)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
              <text x={px(t)} y={AXIS_Y + 18} textAnchor="middle" fontSize={10} fill="#64748b">{t === 35 ? "35=n" : t}</text>
            </g>
          ))}
          <text x={LABEL_X} y={18} fontSize={11} fill="#64748b">h</text>
          <text x={LABEL_X} y={128} fontSize={11} fill="#64748b">÷5</text>
          {CANDIDATES.map(({ h, value }) => {
            const chosen = active === 2 && h === H;
            const dim = active === 2 && !chosen;
            const color = chosen ? "#2563eb" : "#475569";
            return (
              <g key={h} opacity={dim ? 0.4 : 1}>
                <text x={px(value)} y={18} textAnchor="middle" fontSize={13} fill="#64748b">{h}</text>
                {h > 0 && (
                  <path
                    d={`M ${px(value - Q) + 4} ${AXIS_Y - 10} Q ${(px(value - Q) + px(value)) / 2} ${AXIS_Y - 34} ${px(value) - 4} ${AXIS_Y - 10}`}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth={1}
                  />
                )}
                {h > 0 && (
                  <text x={(px(value - Q) + px(value)) / 2} y={AXIS_Y - 26} textAnchor="middle" fontSize={11} fill="#64748b">+7</text>
                )}
                <circle cx={px(value)} cy={AXIS_Y} r={chosen ? 6 : 4.5} fill={color} />
                <text x={px(value)} y={AXIS_Y + 34} textAnchor="middle" fontSize={14} fontWeight={700} fill={color}>{value}</text>
                {active >= 1 && (
                  <text x={px(value)} y={128} textAnchor="middle" fontSize={14} fontWeight={chosen ? 700 : 400} fill={chosen ? "#2563eb" : "#475569"}>
                    {value % P}
                  </text>
                )}
                {chosen && (
                  <rect x={px(value) - 14} y={112} width={28} height={24} rx={6} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                )}
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
