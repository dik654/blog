import SceneShell from "./SceneShell";

/**
 * 본문 대응: #not-a-cause 첫 문단 — 값이 두 배가 된 것만 보고는 어느 자리가 움직였는지 가를 수 없다.
 * 값 수준 배수 = 가진 돈 배수 × 손 바뀜 배수 ÷ 오간 물량 배수 (M V = P T 를 P 에 대해 푼 꼴).
 * 돈 ×2 → 2, 손 바뀜 ×2 → 2, 물량 ÷2 → 2, 섞인 예(가정) 1.6 × 1.5 ÷ 1.2 = 2.4 ÷ 1.2 = 2.
 */
type Knobs = { m: number; v: number; q: number } | null;

const SCENES: readonly { label: string; summary: string; note: string; knobs: Knobs; assumed?: boolean }[] = [
  {
    label: "보이는 것은 값뿐입니다",
    summary: "값 수준 ×2",
    note: "값이 두 배가 되었다는 사실만 있습니다. 가진 돈, 손 바뀜, 오간 물량은 아직 모릅니다. 식은 네 자리가 서로 맞아야 한다는 것만 말하므로 세 자리 모두 물음표로 남습니다.",
    knobs: null,
  },
  {
    label: "가진 돈이 두 배였을 수도",
    summary: "2 × 1 ÷ 1 = 2",
    note: "가진 돈이 두 배가 되고 손 바뀜과 물량이 그대로면 값이 두 배가 됩니다.",
    knobs: { m: 2, v: 1, q: 1 },
  },
  {
    label: "손 바뀜이 두 배였을 수도",
    summary: "1 × 2 ÷ 1 = 2",
    note: "가진 돈은 그대로인데 같은 돈이 두 배로 자주 쓰여도 값이 두 배가 됩니다. 결과만 보면 바로 앞 장면과 구별되지 않습니다.",
    knobs: { m: 1, v: 2, q: 1 },
  },
  {
    label: "오간 물건이 절반이었을 수도",
    summary: "1 × 1 ÷ 0.5 = 2",
    note: "돈도 손 바뀜도 그대로인데 오간 물건이 절반이 되어도 값은 두 배가 됩니다. 이번에도 값 자리만 보면 앞의 두 경우와 같습니다.",
    knobs: { m: 1, v: 1, q: 0.5 },
  },
  {
    label: "셋이 섞였을 수도",
    summary: "1.6 × 1.5 ÷ 1.2 = 2 (가정)",
    note: "돈 1.6배, 손 바뀜 1.5배, 물량 1.2배(가정한 배수)로 셋 다 움직여도 값은 두 배입니다. 네 경우 모두 값 막대가 같아 관찰된 값 하나로는 가를 수 없습니다.",
    knobs: { m: 1.6, v: 1.5, q: 1.2 },
    assumed: true,
  },
];

const ROWS = [
  { key: "m", label: "가진 돈", color: "#6366f1" },
  { key: "v", label: "손 바뀜", color: "#0ea5e9" },
  { key: "q", label: "오간 물량", color: "#14b8a6" },
] as const;

const PRICE_C = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";
const X0 = 88;
const UNIT = 72;

const fmt = (n: number) => `×${Number(n.toFixed(2))}`;

export default function PriceDoubledPathsViz() {
  return (
    <SceneShell
      eyebrow="거꾸로 거슬러 가기"
      title="값이 두 배가 된 해를 거슬러 가면 길이 여럿입니다"
      description="막대 길이는 기준 해를 1로 둔 배수입니다. 값 수준 배수 = 가진 돈 배수 × 손 바뀜 배수 ÷ 오간 물량 배수입니다."
      note="앞의 세 경우는 본문 4절의 예이고, 마지막 섞인 경우의 1.6배·1.5배·1.2배는 그림을 위한 가정입니다."
      ariaLabel="값 수준이 두 배가 되는 네 가지 서로 다른 경우"
      scenes={SCENES}
      render={(active) => {
        const knobs = SCENES[active].knobs;
        return (
          <svg viewBox="0 0 340 214" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X0 + UNIT} x2={X0 + UNIT} y1={14} y2={190} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
            <text x={X0 + UNIT} y={10} textAnchor="middle" fontSize={11} fill="#64748b">
              기준 ×1
            </text>
            {ROWS.map((row, i) => {
              const y = 26 + i * 40;
              const mult = knobs ? knobs[row.key] : null;
              const changed = mult !== null && mult !== 1;
              return (
                <g key={row.key}>
                  <text x={12} y={y + 14} fontSize={14} fontWeight={700} fill={row.color}>
                    {row.label}
                  </text>
                  {mult === null ? (
                    <text x={X0 + 6} y={y + 15} fontSize={15} fontWeight={700} fill={MUTED}>
                      ?
                    </text>
                  ) : (
                    <>
                      <rect x={X0} y={y} width={UNIT * mult} height={20} rx={3} fill={row.color} opacity={changed ? 0.75 : 0.3} />
                      <text x={X0 + UNIT * mult + 8} y={y + 15} fontSize={14} fontWeight={700} fill={changed ? row.color : MUTED}>
                        {fmt(mult)}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
            <line x1={12} x2={328} y1={150} y2={150} stroke={MUTED} strokeWidth={1} />
            <text x={12} y={180} fontSize={14} fontWeight={700} fill={PRICE_C}>
              값 수준
            </text>
            <rect x={X0} y={166} width={UNIT * 2} height={20} rx={3} fill={PRICE_C} opacity={0.75} />
            <text x={X0 + UNIT * 2 + 8} y={181} fontSize={14} fontWeight={700} fill={PRICE_C}>
              ×2 (관찰)
            </text>
            <text x={12} y={208} fontSize={11} fill={knobs ? INK : MUTED}>
              {knobs ? "값 = 돈 × 손 바뀜 ÷ 물량 (배수)" : "세 자리는 식만으로 정해지지 않습니다"}
            </text>
          </svg>
        );
      }}
    />
  );
}
