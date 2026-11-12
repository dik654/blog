import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pricing-in — 한 개당 얹는 값이 장부를 바꾸고, 시장이 멈추는 자리를 바꾼다.
 * 낼 수 있는 금액 10, 9, 8, 7, 6, 5 / 장부 4, 5, 6, 7, 8, 9 / 제삼자 몫 2.
 * 얹는 값 0 → 4개(값 7), 2 → 3개(값 8), 4 → 2개(셋째가 사라짐).
 */
const WTP = [10, 9, 8, 7, 6, 5] as const;
const MC = [4, 5, 6, 7, 8, 9] as const;
const EXTERNAL = 2;

const TAXES = [0, 2, 4] as const;

const made = (tax: number) =>
  WTP.filter((w, i) => w >= MC[i] + tax).length;

const SCENES = [
  {
    label: "아무것도 얹지 않으면",
    summary: `${made(0)}개 · 값 7`,
    tax: TAXES[0],
    note: "장부가 4, 5, 6, 7, 8, 9이고 값 7에서 네 개가 만들어집니다. 넷째는 실제로 드는 값 9가 낼 수 있는 7을 넘는데도 만들어집니다.",
  },
  {
    label: "한 개당 2를 얹으면",
    summary: `${made(2)}개 · 값 8`,
    tax: TAXES[1],
    note: "장부가 6, 7, 8, 9, 10, 11이 되어 빨간 점선과 겹칩니다. 값이 8로 움직이고 세 개가 만들어집니다. 넷째를 만들려던 사람은 장부가 9라 값 8에서 물러납니다. 아무도 제삼자의 사정을 알 필요가 없었습니다.",
  },
  {
    label: "4를 얹으면 (실제보다 큼)",
    summary: `${made(4)}개 · 셋째가 사라짐`,
    tax: TAXES[2],
    note: "장부가 8, 9, 10, 11, 12, 13이 되어 두 개만 남습니다. 셋째는 낼 수 있는 8과 실제로 드는 8이 같아 다 세어도 밑지지 않는 단위였는데 만들어지지 않습니다.",
  },
] as const;

const W = 360;
const H = 252;
const BASE_Y = 198;
const UNIT = 9;
const LEFT = 18;
const STEP = 57;
const BAR_W = 19;

const OK = "#16a34a";
const COST = "#6366f1";
const TAX = "#d97706";
const WARN = "#ef4444";
const MUTED = "#64748b";
const GRID = "#94a3b8";

export default function PricingInViz() {
  return (
    <SceneShell
      eyebrow="값에 얹는 길"
      title="얹는 값이 장부를 바꾸고 멈추는 자리를 바꿉니다"
      description="한 쌍이 막대 둘입니다. 왼쪽은 낼 수 있는 금액, 오른쪽은 만드는 쪽 장부(재료·시간·전기)에 얹은 값을 더한 것입니다. 낼 수 있는 금액이 장부 이상인 쌍만 만들어집니다."
      note="본문의 숫자를 그대로 씁니다. 빨간 점선은 제삼자 몫 2까지 센 실제로 드는 값이며, 그 2를 정확히 안다고 둔 계산입니다."
      ariaLabel="얹는 값 0, 2, 4에서 만들어지는 수량 비교"
      scenes={SCENES}
      render={(active) => {
        const tax = SCENES[active].tax;
        const y = (v: number) => BASE_Y - v * UNIT;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g fontSize={12} fill={MUTED}>
              <rect x={LEFT} y={8} width={10} height={10} fill={OK} opacity={0.75} />
              <text x={LEFT + 14} y={17}>낼 수 있는</text>
              <rect x={LEFT + 84} y={8} width={10} height={10} fill={COST} opacity={0.75} />
              <text x={LEFT + 98} y={17}>장부</text>
              <rect x={LEFT + 140} y={8} width={10} height={10} fill={TAX} opacity={0.85} />
              <text x={LEFT + 154} y={17}>얹은 값</text>
              <line x1={LEFT} x2={LEFT + 20} y1={31} y2={31} stroke={WARN} strokeWidth={1.25} strokeDasharray="3 2" />
              <text x={LEFT + 24} y={35}>실제로 드는 값(얹기 전 장부+2)</text>
            </g>
            {WTP.map((w, i) => {
              const x = LEFT + i * STEP;
              const ledger = MC[i] + tax;
              const isMade = w >= ledger;
              const social = MC[i] + EXTERNAL;
              return (
                <g key={i}>
                  <rect x={x} y={y(w)} width={BAR_W} height={w * UNIT} fill={OK} opacity={isMade ? 0.75 : 0.25} />
                  <text x={x + BAR_W / 2} y={y(w) - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={isMade ? OK : MUTED}>{w}</text>
                  <rect x={x + BAR_W + 4} y={y(MC[i])} width={BAR_W} height={MC[i] * UNIT} fill={COST} opacity={isMade ? 0.75 : 0.25} />
                  {tax > 0 && (
                    <rect x={x + BAR_W + 4} y={y(ledger)} width={BAR_W} height={tax * UNIT} fill={TAX} opacity={isMade ? 0.85 : 0.35} />
                  )}
                  <text x={x + BAR_W * 1.5 + 4} y={y(ledger) - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={isMade ? COST : MUTED}>{ledger}</text>
                  <line x1={x + BAR_W + 1} x2={x + BAR_W * 2 + 7} y1={y(social)} y2={y(social)} stroke={WARN} strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={x + BAR_W + 2} y={BASE_Y + 16} textAnchor="middle" fontSize={12} fill={MUTED}>{i + 1}번째</text>
                  <text x={x + BAR_W + 2} y={BASE_Y + 32} textAnchor="middle" fontSize={12} fontWeight={700} fill={isMade ? OK : MUTED}>
                    {isMade ? "만듦" : "안 만듦"}
                  </text>
                </g>
              );
            })}
            <line x1={LEFT - 6} x2={W - 8} y1={BASE_Y} y2={BASE_Y} stroke={GRID} strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
