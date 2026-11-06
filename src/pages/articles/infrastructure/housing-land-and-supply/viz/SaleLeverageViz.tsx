import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 판매 10→9억은 −10%, 토지 3→2억은 −33.3%. 비용 7→7.5억은 +7.1%, 토지 3→2.5억은 −16.7%.
 * 다른 금액을 고정하면 변화액이 토지 칸에 그대로 내려앉는다.
 */
const UNIT = 24;
const X0 = 56;

const SCENES = [
  {
    label: "판매 예상이 1억 줄면",
    summary: "판매 −10% → 토지 −33%",
    note: "같은 1억인데 10억에서는 10%이고 3억에서는 1÷3≈33%입니다. 비용 7억을 그대로 둔 원래 조건의 계산입니다.",
    rows: [
      { name: "판매", from: 10, to: 9, rate: "−10%" },
      { name: "토지", from: 3, to: 2, rate: "−33%" },
    ],
  },
  {
    label: "비용이 5천만 원 늘면",
    summary: "비용 +7% → 토지 −17%",
    note: "0.5억은 7억의 약 7%지만(0.5÷7) 3억에서는 약 17%입니다(0.5÷3). 판매를 10억으로 두고 토지를 아직 사지 않은 지연 사례의 숫자입니다.",
    rows: [
      { name: "비용", from: 7, to: 7.5, rate: "+7%" },
      { name: "토지", from: 3, to: 2.5, rate: "−17%" },
    ],
  },
] as const;

export default function SaleLeverageViz() {
  return (
    <SceneShell
      eyebrow="마지막 칸의 비율"
      title="같은 금액의 변화가 마지막 칸에서는 큰 비율이 됩니다"
      description="막대 폭은 금액에 비례하고 빗금 친 부분이 변화액입니다. 금액은 모두 가정입니다."
      ariaLabel="판매와 비용의 변화가 토지 잔여 금액에 더 큰 비율로 나타나는 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 132" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <defs>
            <pattern id="housing-leverage-hatch" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width={6} height={6} fill="#ffffff" fillOpacity={0} />
              <line x1={0} x2={0} y1={0} y2={6} stroke="#dc2626" strokeWidth={1} />
            </pattern>
          </defs>
          {SCENES[active].rows.map((row, index) => {
            const y = 14 + index * 60;
            const low = Math.min(row.from, row.to);
            const high = Math.max(row.from, row.to);
            return (
              <g key={row.name}>
                <text x={X0 - 8} y={y + 19} textAnchor="end" fontSize={13} fontWeight={700} fill="#64748b">{row.name}</text>
                <rect x={X0} y={y} width={low * UNIT} height={28} fill={row.name === "토지" ? "#2563eb" : "#94a3b8"} />
                <rect x={X0 + low * UNIT} y={y} width={(high - low) * UNIT} height={28} fill="url(#housing-leverage-hatch)" stroke="#dc2626" strokeWidth={1} />
                <text x={X0 + (low * UNIT) / 2} y={y + 19} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">{low}억</text>
                <text x={X0 + high * UNIT + 5} y={y + 19} fontSize={13} fontWeight={700} fill="#dc2626">{row.rate}</text>
                <text x={X0} y={y + 44} fontSize={13} fill="#64748b">{row.from}억 → {row.to}억</text>
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
