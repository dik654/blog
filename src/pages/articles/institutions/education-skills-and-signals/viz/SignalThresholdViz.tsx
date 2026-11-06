import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 자격이 신호가 되는 조건. 임금 이득 1,200, 비용 600·1,800, 비용이 같으면 600·600(가정).
 * 1,200−600=+600, 1,200−1,800=−600. 막대 길이는 만 원 축에 맞췄습니다.
 */
const GAIN = 1200;
const MAX = 1800;
const X0 = 92;
const AXIS_W = 240;
const px = (value: number) => (value / MAX) * AXIS_W;

const SCENES = [
  { label: "자격의 값", summary: "임금 합계 +1,200만 원", high: null, low: null, verdict: "", note: "고용주가 자격 보유자에게 임금을 모두 합쳐 1,200만 원 더 준다고 놓습니다. 두 사람 모두 받을 수 있는 금액이라 차이는 자격을 따는 비용에서 납니다." },
  { label: "능력이 높은 사람", summary: "1,200 − 600 = +600", high: 600, low: null, verdict: "", note: "같은 자격을 따는 데 600만 원이 든다고 둡니다. 600만 원이 남으니 자격을 땁니다." },
  { label: "능력이 낮은 사람", summary: "1,200 − 1,800 = −600", high: 600, low: 1800, verdict: "자격을 보면 두 사람이 구별됩니다", note: "같은 자격에 1,800만 원이 들면 600만 원을 잃으니 따지 않습니다. 임금 1,200이 두 비용 600과 1,800 사이에 있어 높은 쪽만 자격을 따므로, 자격 유무가 능력 정보를 전합니다." },
  { label: "비용이 둘 다 600이면", summary: "둘 다 +600 → 둘 다 땀", high: 600, low: 600, verdict: "자격으로는 구별하지 못합니다", note: "둘 다 600만 원을 남기니 둘 다 따고, 자격으로 구별할 수 없습니다. Spence는 신호 비용이 생산 능력과 음의 상관(능력이 높을수록 비용이 낮은 관계)을 가지지 않으면 신호가 지원자를 구별하지 못한다고 씁니다." },
] as const;

function Row({ y, name, cost }: { y: number; name: string; cost: number | null }) {
  const net = cost === null ? null : GAIN - cost;
  return (
    <g>
      <text x={0} y={y + 16} fontSize={11} fontWeight={700} fill="currentColor">{name}</text>
      <rect x={X0} y={y} width={AXIS_W} height={22} rx={3} fill="#94a3b8" fillOpacity={0.12} />
      {cost === null ? (
        <text x={X0 + 8} y={y + 15} fontSize={11} fill="#64748b">비용은 다음 장면</text>
      ) : (
        <>
          <rect x={X0} y={y} width={px(cost)} height={22} rx={3} fill="#d97706" fillOpacity={0.8} />
          <text x={X0 + 6} y={y + 15} fontSize={11} fontWeight={700} fill="#ffffff">비용 {cost.toLocaleString("en-US")}</text>
          <text x={X0} y={y + 38} fontSize={11} fontWeight={700} fill={net !== null && net > 0 ? "#2563eb" : "#dc2626"}>
            {net !== null && net > 0 ? `+${net.toLocaleString("en-US")} 남음 → 딴다` : `−${Math.abs(net ?? 0).toLocaleString("en-US")} 손해 → 안 딴다`}
          </text>
        </>
      )}
    </g>
  );
}

export default function SignalThresholdViz() {
  return (
    <SceneShell
      eyebrow="신호의 조건"
      title="비용이 능력마다 달라야 자격이 사람을 가릅니다"
      description="가로축은 만 원입니다. 파란 점선이 자격으로 더 받는 임금 합계 1,200이고, 비용 막대가 그 선을 넘으면 따는 쪽이 손해입니다. 금액은 모두 글이 놓은 값입니다(가정)."
      ariaLabel="자격의 임금 이득 1200만원과 능력별 취득 비용을 비교해 누가 자격을 따는지 보여 줌"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const lineX = X0 + px(GAIN);
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={lineX} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">임금 +1,200</text>
            <Row y={24} name="능력 높은 사람" cost={scene.high} />
            <Row y={76} name="능력 낮은 사람" cost={scene.low} />
            <line x1={lineX} x2={lineX} y1={18} y2={132} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
            <line x1={X0} x2={X0 + AXIS_W} y1={132} y2={132} stroke="#94a3b8" strokeWidth={1} />
            {[0, 600, 1200, 1800].map((tick) => (
              <text key={tick} x={X0 + px(tick)} y={147} textAnchor="middle" fontSize={10} fill="#64748b">{tick.toLocaleString("en-US")}</text>
            ))}
            {scene.verdict && (
              <>
                <rect x={0} y={158} width={360} height={32} rx={8} fill="none" stroke="#2563eb" strokeWidth={1} />
                <text x={180} y={179} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{scene.verdict}</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
