import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 어제 포지션 그대로면 6 손실, 장중 헤지 거래가 2를 벌어 실제 손실 4.
 * 위험값(한도) 5와 비교: 가상 6 > 5 → 예외, 실제 4 < 5 → 예외 없음.
 */
const LIMIT = 5;
const HYPO = 6;
const HEDGE = 2;
const ACTUAL = HYPO - HEDGE;

const W = 360;
const H = 200;
const BASE_Y = 168;
const TOP_Y = 24;
const MAX = 8;
const BAR_W = 64;
const COLS = [70, 180, 290] as const;
const yOf = (loss: number) => BASE_Y - (loss / MAX) * (BASE_Y - TOP_Y);

const SCENES = [
  { label: "가상 손실 6", summary: "6 > 5 → 예외", shown: 1, note: "어제 포지션을 그대로 뒀다면 시장 움직임으로 6을 잃었다고 놓습니다. 위험값 5를 넘으므로 가상 손익으로는 예외입니다." },
  { label: "장중 헤지 거래 +2", summary: "6 − 2", shown: 2, note: "같은 날 장중에 한 헤지 거래가 2를 벌었습니다. 이 거래는 어제 장부에 없던 것이라 가상 손익에는 들어가지 않고 실제 손익에만 들어갑니다." },
  { label: "실제 손실 4", summary: "4 < 5 → 예외 없음", shown: 3, note: "실제 손실은 6 − 2 = 4라 한도 5 아래입니다. 같은 날, 같은 위험값인데 실제 손익으로는 예외가 없습니다." },
  { label: "두 판정을 함께 남깁니다", summary: "가상: 예외 · 실제: 예외 없음", shown: 3, note: "가상 손익은 어제 장부의 위험 포착력을 깨끗하게 검사하고, 실제 손익은 거래 활동까지 포함한 결과를 봅니다. 둘 다 필요하지만 서로 대신할 수 없고, 수수료 수익을 넣어 예외를 감추지도 않습니다." },
] as const;

export default function HypoActualViz() {
  return (
    <SceneShell
      eyebrow="같은 날 두 손익"
      title="장중 거래가 벌어 준 2가 가상 손익의 예외를 실제 손익에서 가립니다"
      description="막대 높이는 손실 크기이고 점선은 어제 계산한 위험값 5입니다. 4절의 설명용 숫자를 그대로 씁니다."
      ariaLabel="가상 손실 6과 실제 손실 4를 위험값 5와 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const bars = [
          { name: "가상 손실", top: HYPO, bottom: 0, color: "#dc2626", value: `${HYPO}`, verdict: "예외" },
          { name: "장중 헤지 이익", top: HYPO, bottom: ACTUAL, color: "#16a34a", value: `+${HEDGE}`, verdict: "" },
          { name: "실제 손실", top: ACTUAL, bottom: 0, color: "#2563eb", value: `${ACTUAL}`, verdict: "예외 없음" },
        ];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={16} x2={W - 16} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            {bars.map((bar, i) => {
              const visible = i < scene.shown;
              const x = COLS[i] - BAR_W / 2;
              return (
                <g key={bar.name} opacity={visible ? 1 : 0.15}>
                  <rect x={x} y={yOf(bar.top)} width={BAR_W} height={yOf(bar.bottom) - yOf(bar.top)} rx={3} fill={bar.color} opacity={0.85} />
                  {i === 1 ? <line x1={COLS[0] + BAR_W / 2} x2={x} y1={yOf(HYPO)} y2={yOf(HYPO)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" /> : null}
                  {i === 2 ? <line x1={COLS[1] + BAR_W / 2} x2={x} y1={yOf(ACTUAL)} y2={yOf(ACTUAL)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" /> : null}
                  <text x={COLS[i]} y={yOf(bar.top) - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a" className="dark:fill-[#e2e8f0]">{visible ? bar.value : ""}</text>
                  <text x={COLS[i]} y={BASE_Y + 16} textAnchor="middle" fontSize={11} fill="#64748b">{bar.name}</text>
                  {index === 3 && bar.verdict ? (
                    <text x={COLS[i]} y={yOf(bar.bottom) - (yOf(bar.bottom) - yOf(bar.top)) / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">{bar.verdict}</text>
                  ) : null}
                </g>
              );
            })}
            <line x1={16} x2={W - 16} y1={yOf(LIMIT)} y2={yOf(LIMIT)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 4" />
            <text x={W - 16} y={yOf(LIMIT) - 5} textAnchor="end" fontSize={11} fontWeight={700} fill="#d97706">위험값 5</text>
          </svg>
        );
      }}
    />
  );
}
