import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 5억 원을 각 트랜치 5%(3.5+1+0.5)로 남길 때와 후순위로만 남길 때.
 * 면적 = 금액. 1억 원 높이 = 1.8, 트랜치 폭 120 = 100%. 왼쪽 띠 폭 6 = 5%, 오른쪽 띠 폭 60 = 후순위의 절반.
 * 왼쪽 손실 = L×5%: 8→0.4, 15→0.75, 35→1.75. 오른쪽 손실 = min(L,10)×½: 8→4, 15→5, 35→5.
 * 후순위 안에서는 같은 비율로 손실을 나눈다고 본 것은 이 그림의 가정이다.
 */
const SCENES = [
  { label: "남기는 모양", summary: "같은 5억 원, 다른 위치", loss: 0, note: "파란 부분이 계속 보유하는 5억 원입니다. 왼쪽은 세 트랜치에 세로로 얇게, 오른쪽은 후순위 한곳에 남깁니다." },
  { label: "손실 8억 원", summary: "남긴 쪽 손실 0.4 대 4", loss: 8, note: "손실이 후순위 안에서 끝나도 오른쪽은 5억 원 중 4억 원을 잃습니다. 왼쪽은 후순위에 걸친 0.5 안에서 0.4억 원만 잃습니다." },
  { label: "손실 15억 원", summary: "남긴 쪽 손실 0.75 대 5", loss: 15, note: "왼쪽은 후순위 0.5 전부와 중순위 1의 4분의 1인 0.25를 잃어 0.75억 원입니다. 오른쪽은 후순위가 다 사라져 5억 원 전부를 잃습니다." },
  { label: "손실 35억 원", summary: "남긴 쪽 손실 1.75 대 5", loss: 35, note: "왼쪽은 0.5 + 1 + 0.25 = 1.75억 원입니다. 나머지 손실은 다른 투자자에게 남으니 위험보유는 전액 보상 보증이 아닙니다." },
] as const;

const TOP = 34;
const BOTTOM = 214;
const UNIT = 1.8;
const COLS = [
  { x: 40, head: "각 트랜치의 5%", holdingLabel: "남긴 5 = 3.5 + 1 + 0.5" },
  { x: 200, head: "후순위로 5억 원", holdingLabel: "남긴 5 = 후순위 10의 절반" },
];
const COL_W = 120;
const TRANCHES = [
  { name: "선순위 70", from: 30, size: 70, opacity: 0.14 },
  { name: "중순위 20", from: 10, size: 20, opacity: 0.26 },
  { name: "후순위 10", from: 0, size: 10, opacity: 0.38 },
];
const BLUE = "#2563eb";
const RED = "#dc2626";
const TEXT = "#64748b";
const yOf = (amount: number) => BOTTOM - amount * UNIT;
const fmt = (value: number) => String(Math.round(value * 100) / 100);

export default function RiskRetentionShapeViz() {
  return (
    <SceneShell
      eyebrow="위험보유의 모양"
      title="같은 5억 원을 남겨도 어디에 남기느냐에 따라 손실이 다릅니다"
      description="위험보유는 경제적 이해관계 일부를 계속 드는 것입니다. 면적이 금액이고 파랑은 남긴 몫, 진한 빨강은 그 손실, 옅은 빨강은 전체 손실입니다. 왼쪽은 EU Article 6(3)(a)의 각 트랜치 5%, 오른쪽은 후순위 손실을 같은 비율로 나눈 가정이고, 100억 원도 가정입니다."
      ariaLabel="각 트랜치 5퍼센트 보유와 후순위 5억 원 보유의 손실 비교"
      scenes={SCENES}
      render={(active) => {
        const { loss } = SCENES[active];
        const verticalLoss = loss * 0.05;
        const juniorLoss = Math.min(loss, 10) * 0.5;
        const held = [verticalLoss, juniorLoss];
        return (
          <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[470px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {COLS.map((col, index) => (
              <g key={col.x}>
                <text x={col.x + COL_W / 2} y={TOP - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEXT}>{col.head}</text>
                {TRANCHES.map((tranche) => (
                  <g key={tranche.name}>
                    <rect x={col.x} y={yOf(tranche.from + tranche.size)} width={COL_W} height={tranche.size * UNIT} fill="#64748b" fillOpacity={tranche.opacity} stroke={TEXT} strokeWidth={1} />
                  </g>
                ))}
                {loss > 0 && <rect x={col.x} y={yOf(loss)} width={COL_W} height={loss * UNIT} fill={RED} fillOpacity={0.22} />}
                {index === 0 ? (
                  <>
                    <rect x={col.x} y={TOP} width={6} height={BOTTOM - TOP} fill={BLUE} />
                    <rect x={col.x} y={yOf(loss)} width={6} height={loss * UNIT} fill={RED} />
                  </>
                ) : (
                  <>
                    <rect x={col.x} y={yOf(10)} width={60} height={10 * UNIT} fill={BLUE} />
                    <rect x={col.x} y={yOf(Math.min(loss, 10))} width={60} height={Math.min(loss, 10) * UNIT} fill={RED} />
                  </>
                )}
                {TRANCHES.map((tranche) => (
                  <text key={tranche.name} x={col.x + COL_W - 6} y={yOf(tranche.from + tranche.size / 2) + 4} textAnchor="end" fontSize={10} fontWeight={700} fill={TEXT}>{tranche.name}</text>
                ))}
                <text x={col.x + COL_W / 2} y={BOTTOM + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={active === 0 ? BLUE : RED}>
                  {active === 0 ? col.holdingLabel : `남긴 쪽 손실 ${fmt(held[index])}`}
                </text>
                <text x={col.x + COL_W / 2} y={BOTTOM + 36} textAnchor="middle" fontSize={11} fill={TEXT}>
                  {active === 0 ? "손실 전" : `나머지 투자자 ${fmt(loss - held[index])}`}
                </text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
