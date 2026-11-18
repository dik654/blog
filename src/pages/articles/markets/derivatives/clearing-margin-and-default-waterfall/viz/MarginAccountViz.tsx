import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 단위 백만 원. 개시증거금 12, 유지 기준 9, 첫날 손실 8 → 잔액 4,
 * 추가 납부 8 → 12(처음 수준 회복은 설명용 약정), 둘째 날 이익 5 → 12 + 5 = 17.
 */
const START = 12;
const MAINTENANCE = 9;
const DAY1_LOSS = 8;
const TOP_UP = START - (START - DAY1_LOSS);
const DAY2_GAIN = 5;

const STEPS = [
  { short: "체결", balance: START, flow: 0 },
  { short: "첫날 정산", balance: START - DAY1_LOSS, flow: -DAY1_LOSS },
  { short: "추가 납부", balance: START, flow: TOP_UP },
  { short: "둘째 날 정산", balance: START + DAY2_GAIN, flow: DAY2_GAIN },
] as const;

const SCENES = [
  { label: "계약을 열며 12를 넣습니다", summary: "잔액 12 · 유지 기준 9", note: "개시증거금 12는 앞으로 정리하는 동안 생길 수 있는 손실을 막는 담보입니다. 점선이 유지 기준 9이며, 잔액이 이 아래로 내려가면 추가 납부 요구가 생길 수 있습니다." },
  { label: "첫날 손실 8이 빠져나갑니다", summary: "12 − 8 = 4 < 9", note: "선물 가격 변화로 생긴 손실 8이 변동증거금으로 반대편에 넘어갑니다. 벌금이 아니라 계약가치의 이동입니다. 남은 4는 유지 기준 9보다 낮습니다." },
  { label: "8을 더 넣어 12로 돌립니다", summary: "4 + 8 = 12", note: "중개사는 처음 수준 12로 돌리도록 8을 더 내라고 요구할 수 있습니다. 이 8은 수익이 아니라 다음 손실을 견딜 담보입니다. 12로 돌린다는 조건은 설명용 약정(가정)이며, 실제 기준과 납부 시한은 거래소·중개사·고객 조건에 따라 다릅니다." },
  { label: "둘째 날 이익 5가 넘어옵니다", summary: "12 + 5 = 17", note: "이번에는 반대편의 손실 5가 이쪽 계좌로 들어옵니다. 매일 가격을 다시 붙이고 이긴 쪽과 진 쪽 사이에서 돈을 옮기기 때문입니다. 17은 본문 숫자를 더한 값입니다." },
] as const;

const W = 400;
const H = 200;
const BASE_Y = 160;
const TOP_Y = 30;
const MAX = 18;
const COL_W = 72;
const BAR_W = 34;
const LEFT = 30;
const y = (value: number) => BASE_Y - (value / MAX) * (BASE_Y - TOP_Y);
const cx = (index: number) => LEFT + COL_W / 2 + index * COL_W + index * 8;

export default function MarginAccountViz() {
  return (
    <SceneShell
      eyebrow="일일정산"
      title="증거금 12에서 손실 8이 빠지면 추가 납부가 생깁니다"
      description="막대 하나가 각 시점의 계좌 잔액(백만 원)입니다. 개시증거금은 처음 맡기는 담보, 변동증거금은 매일 생긴 손익을 현금으로 주고받는 돈입니다. 숫자는 3절의 교육용 사례입니다."
      ariaLabel="개시증거금 12, 첫날 손실 8로 잔액 4, 추가 납부 8로 12, 둘째 날 이익 5로 17이 되는 계좌 잔액"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={LEFT - 6} x2={W - 6} y1={y(MAINTENANCE)} y2={y(MAINTENANCE)} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
          <text x={LEFT - 8} y={y(MAINTENANCE) + 4} textAnchor="end" fontSize={10} fill="#b45309">9</text>
          <text x={W - 6} y={y(MAINTENANCE) - 5} textAnchor="end" fontSize={10} fill="#b45309">유지 기준</text>
          {STEPS.map((step, index) => {
            const shown = index <= active;
            const current = index === active;
            const below = step.balance < MAINTENANCE;
            const fill = below ? "#dc2626" : "#2563eb";
            return (
              <g key={step.short} opacity={shown ? 1 : 0.18}>
                <rect x={cx(index) - BAR_W / 2} y={y(step.balance)} width={BAR_W} height={BASE_Y - y(step.balance)} rx={2} fill={shown ? fill : "#94a3b8"} opacity={current ? 0.9 : 0.5} />
                {shown && (
                  <text x={cx(index)} y={y(step.balance) - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={fill}>{step.balance}</text>
                )}
                {shown && step.flow !== 0 && (
                  <text x={cx(index)} y={BASE_Y + 30} textAnchor="middle" fontSize={10} fill={step.flow < 0 ? "#b91c1c" : "#15803d"}>
                    {step.flow < 0 ? `−${Math.abs(step.flow)} 나감` : `+${step.flow} 들어옴`}
                  </text>
                )}
                <text x={cx(index)} y={BASE_Y + 15} textAnchor="middle" fontSize={10} fill="#64748b">{step.short}</text>
              </g>
            );
          })}
          <line x1={LEFT - 6} x2={W - 6} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
        </svg>
      )}
    />
  );
}
