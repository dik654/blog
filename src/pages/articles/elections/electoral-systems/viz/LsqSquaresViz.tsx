import SceneShell from "./SceneShell";
import { MUTED_COLOR, PARTY_COLORS, PARTY_NAMES } from "./parties";

/**
 * 본문 대응: #disproportionality — 44·41·15%의 표가 9·0·0석이 될 때의 차이를 실제 면적으로 그린다.
 * v−s = −56·41·15 (합 0), 제곱 3136·1681·225 (합 5042), 5042÷2 = 2521, √2521 ≈ 50.2.
 * 같은 절차로 4·4·1 → 3.7, 3·6·0 → 22.3. 1퍼센트포인트 = 2 SVG 단위.
 */
const UNIT = 2;
const GAPS: readonly { party: number; vote: number; seat: number; diff: number }[] = [
  { party: 0, vote: 44, seat: 100, diff: -56 },
  { party: 1, vote: 41, seat: 0, diff: 41 },
  { party: 2, vote: 15, seat: 0, diff: 15 },
];

const SCENES = [
  {
    label: "그대로 더하면 0",
    summary: "−56 + 41 + 15 = 0",
    note: "의석률은 전체 의석에서 그 정당이 얻은 비율입니다. 득표율에서 의석률을 빼면 가당의 −56은 나당·다당의 41과 15를 합한 크기와 같아 서로 지워집니다.",
  },
  {
    label: "제곱하면 면적이 된다",
    summary: "3136 + 1681 + 225 = 5042",
    note: "차이를 한 변으로 하는 정사각형을 그리면 부호가 사라지고 크기만 남습니다. 큰 어긋남은 면적이 훨씬 커져 더 무겁게 들어갑니다.",
  },
  {
    label: "반으로 줄이고 한 변으로",
    summary: "√(5042 ÷ 2) ≈ 50.2",
    note: "한 정당이 더 받은 만큼 다른 정당이 덜 받아 같은 왜곡을 두 번 세었으므로 반으로 나눕니다. 그 면적의 한 변이 불비례 지수이고 단위는 다시 퍼센트포인트입니다.",
  },
  {
    label: "같은 표, 다른 의석",
    summary: "3.7 · 22.3 · 50.2",
    note: "같은 계산을 다른 의석 결과에 적용한 값입니다. 0이면 득표율과 의석률이 일치합니다. 이 수는 비례에서 벗어난 정도만 재므로, 값이 작다고 곧바로 더 좋은 제도라는 뜻은 아닙니다.",
  },
] as const;

function DiffBars() {
  const center = 150;
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="세 정당의 득표율과 의석률 차이 막대" className="h-auto w-full max-w-lg">
      <line x1={center} x2={center} y1={18} y2={150} stroke={MUTED_COLOR} strokeWidth={1} />
      {GAPS.map((g, i) => {
        const y = 14 + i * 46;
        const w = Math.abs(g.diff) * UNIT;
        const x = g.diff < 0 ? center - w : center;
        return (
          <g key={g.party}>
            <text x={8} y={y} fontSize={11} fontWeight={700} fill={PARTY_COLORS[g.party]}>
              {PARTY_NAMES[g.party]} 득표 {g.vote}% · 의석 {g.seat}%
            </text>
            <rect x={x} y={y + 6} width={w} height={18} fill={PARTY_COLORS[g.party]} fillOpacity={0.35} stroke={PARTY_COLORS[g.party]} strokeWidth={1} />
            <text x={g.diff < 0 ? center + 6 : center + w + 6} y={y + 19} fontSize={12} fontWeight={700} fill={PARTY_COLORS[g.party]}>
              {g.diff > 0 ? `+${g.diff}` : `−${Math.abs(g.diff)}`}
            </text>
          </g>
        );
      })}
      <text x={center} y={170} textAnchor="middle" fontSize={12} fontWeight={700} fill={MUTED_COLOR}>
        왼쪽 56 = 오른쪽 41 + 15
      </text>
    </svg>
  );
}

function Squares() {
  const base = 150;
  const positions: readonly number[] = [8, 136, 234];
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="차이를 한 변으로 하는 세 정사각형" className="h-auto w-full max-w-lg">
      {GAPS.map((g, i) => {
        const side = Math.abs(g.diff);
        const size = side * UNIT;
        const x = positions[i];
        return (
          <g key={g.party}>
            <text x={x} y={base - size - 6} fontSize={11} fontWeight={700} fill={PARTY_COLORS[g.party]}>
              {side}² = {side * side}
            </text>
            <rect x={x} y={base - size} width={size} height={size} fill={PARTY_COLORS[g.party]} fillOpacity={0.3} stroke={PARTY_COLORS[g.party]} strokeWidth={1} />
            <text x={x} y={base + 16} fontSize={11} fontWeight={700} fill={PARTY_COLORS[g.party]}>
              {PARTY_NAMES[g.party]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Reduced() {
  const base = 168;
  const whole = Math.sqrt(5042) * UNIT;
  const half = Math.sqrt(2521) * UNIT;
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="합친 면적과 그 절반 면적의 정사각형" className="h-auto w-full max-w-lg">
      <rect x={8} y={base - whole} width={whole} height={whole} fill="none" stroke={MUTED_COLOR} strokeWidth={1} strokeDasharray="4 3" />
      <rect x={8} y={base - half} width={half} height={half} fill={PARTY_COLORS[0]} fillOpacity={0.3} stroke={PARTY_COLORS[0]} strokeWidth={1.25} />
      <text x={8 + half / 2} y={base - half / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={PARTY_COLORS[0]}>
        2521
      </text>
      <text x={170} y={62} fontSize={12} fontWeight={700} fill={MUTED_COLOR}>점선 면적 5042</text>
      <text x={170} y={84} fontSize={12} fontWeight={700} fill={MUTED_COLOR}>÷ 2 = 2521</text>
      <text x={170} y={106} fontSize={12} fontWeight={700} fill={PARTY_COLORS[0]}>한 변 √2521 ≈ 50.2</text>
    </svg>
  );
}

function Scale() {
  const x = (v: number) => 16 + (v / 60) * 288;
  const points: readonly { v: number; text: string; rule: string; anchor: "start" | "middle" | "end"; y: number }[] = [
    { v: 3.7, text: "3.7", rule: "전국 비례 4·4·1", anchor: "start", y: 56 },
    { v: 22.3, text: "22.3", rule: "경계만 바꾼 3·6·0", anchor: "middle", y: 134 },
    { v: 50.2, text: "50.2", rule: "단순다수 9·0·0", anchor: "end", y: 56 },
  ];
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="세 의석 결과의 불비례 지수를 나타낸 수직선" className="h-auto w-full max-w-lg">
      <line x1={x(0)} x2={x(60)} y1={95} y2={95} stroke={MUTED_COLOR} strokeWidth={1} />
      {[0, 20, 40, 60].map((tick) => (
        <g key={tick}>
          <line x1={x(tick)} x2={x(tick)} y1={91} y2={99} stroke={MUTED_COLOR} strokeWidth={1} />
          <text x={x(tick)} y={tick === 20 ? 88 : 112} textAnchor="middle" fontSize={10} fill={MUTED_COLOR}>{tick}</text>
        </g>
      ))}
      {points.map((p) => (
        <g key={p.v}>
          <circle cx={x(p.v)} cy={95} r={5} fill={PARTY_COLORS[0]} />
          <line x1={x(p.v)} x2={x(p.v)} y1={95} y2={p.y < 95 ? p.y + 6 : p.y - 26} stroke={PARTY_COLORS[0]} strokeWidth={1} />
          <text x={x(p.v)} y={p.y - 14} textAnchor={p.anchor} fontSize={13} fontWeight={700} fill={PARTY_COLORS[0]}>{p.text}</text>
          <text x={x(p.v)} y={p.y} textAnchor={p.anchor} fontSize={11} fill={MUTED_COLOR}>{p.rule}</text>
        </g>
      ))}
    </svg>
  );
}

export default function LsqSquaresViz() {
  return (
    <SceneShell
      eyebrow="불비례 지수"
      title="어긋남을 제곱하면 큰 차이가 면적으로 드러납니다"
      description="44·41·15퍼센트의 표가 9·0·0석이 된 경우입니다. 막대와 정사각형의 길이는 같은 축척입니다. 불비례 지수는 득표율과 의석률이 어긋난 정도를 하나로 잰 수입니다."
      ariaLabel="불비례 지수 계산을 막대와 정사각형으로 표현"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) return <DiffBars />;
        if (active === 1) return <Squares />;
        if (active === 2) return <Reduced />;
        return <Scale />;
      }}
    />
  );
}
