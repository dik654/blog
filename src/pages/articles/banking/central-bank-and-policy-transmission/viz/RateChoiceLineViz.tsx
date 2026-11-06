import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 맡기면 4%, 빌리면 5%(가정). B는 3%를, A는 6%를 거절하고 4.6%에 합의한 한 사례.
 */
const SCENES = [
  { label: "B가 거절하는 쪽", summary: "4%보다 낮으면 빌려주지 않음", note: "B는 중앙은행에 맡기기만 해도 4%를 받으니 A에게 3%를 받고 빌려줄 이유가 없습니다." },
  { label: "A가 거절하는 쪽", summary: "5%보다 높으면 빌리지 않음", note: "A도 5%로 빌릴 수 있으니 B에게 6%를 낼 이유가 없습니다. 두 은행이 이 거래에 실제로 접근할 수 있고 수수료·담보 비용·신용 위험 차이를 생략한 경우입니다." },
  { label: "그 사이의 합의", summary: "4.6% (한 사례)", note: "4.6%는 다른 선택의 범위만으로 유일하게 정해지지 않습니다. 누가 더 급한지, 경쟁 상대가 얼마나 있는지, 거래 관계가 어떤지에 따라 달라지며 자동으로 중간인 4.5%가 나오는 것도 아닙니다." },
] as const;

const x = (rate: number) => 30 + (rate - 3) * 100;
const LINE_Y = 74;
const GRAY = "#64748b";
const BLUE = "#2563eb";
const RED = "#dc2626";

function Rejected({ rate, label }: { rate: number; label: string }) {
  return (
    <g>
      <line x1={x(rate) - 6} x2={x(rate) + 6} y1={LINE_Y - 6} y2={LINE_Y + 6} stroke={RED} strokeWidth={1.25} />
      <line x1={x(rate) - 6} x2={x(rate) + 6} y1={LINE_Y + 6} y2={LINE_Y - 6} stroke={RED} strokeWidth={1.25} />
      <text x={rate === 3 ? x(rate) - 12 : x(rate) + 12} y={LINE_Y - 34} textAnchor={rate === 3 ? "start" : "end"} fontSize={12} fontWeight={700} fill={RED}>{label}</text>
      <line x1={x(rate)} x2={x(rate)} y1={LINE_Y - 28} y2={LINE_Y - 9} stroke={RED} strokeWidth={1} />
    </g>
  );
}

export default function RateChoiceLineViz() {
  return (
    <SceneShell
      eyebrow="협상의 범위"
      title="다른 선택이 있으면 거절할 금리가 먼저 정해집니다"
      description="가로축은 A와 B가 하루 거래에 붙일 연이율입니다. 4%와 5%를 포함한 모든 금리는 글의 가정이며 어느 나라의 금리표도 아닙니다."
      ariaLabel="B가 거절하는 금리, A가 거절하는 금리, 그 사이의 합의"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 118" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={x(4)} y={LINE_Y - 7} width={x(5) - x(4)} height={14} fill={BLUE} fillOpacity={active === 2 ? 0.25 : 0.1} />
          {active === 0 && <rect x={x(3)} y={LINE_Y - 7} width={x(4) - x(3)} height={14} fill={RED} fillOpacity={0.12} />}
          {active === 1 && <rect x={x(5)} y={LINE_Y - 7} width={x(6) - x(5)} height={14} fill={RED} fillOpacity={0.12} />}
          <line x1={x(3)} x2={x(6)} y1={LINE_Y} y2={LINE_Y} stroke="#94a3b8" strokeWidth={1} />
          {[3, 4, 5, 6].map((rate) => (
            <g key={rate}>
              <line x1={x(rate)} x2={x(rate)} y1={LINE_Y - 7} y2={LINE_Y + 7} stroke={GRAY} strokeWidth={1} />
              <text x={x(rate)} y={LINE_Y + 22} textAnchor="middle" fontSize={12} fontWeight={rate === 4 || rate === 5 ? 700 : 400} fill={GRAY}>{rate}%</text>
            </g>
          ))}
          <text x={x(4)} y={LINE_Y + 38} textAnchor="middle" fontSize={11} fill={GRAY}>맡기면 받는 금리</text>
          <text x={x(5)} y={LINE_Y + 38} textAnchor="middle" fontSize={11} fill={GRAY}>빌리면 내는 금리</text>

          {active === 0 && <Rejected rate={3} label="B가 3%를 거절" />}
          {active === 1 && <Rejected rate={6} label="A가 6%를 거절" />}
          {active === 2 && (
            <>
              <line x1={x(4.5)} x2={x(4.5)} y1={LINE_Y - 7} y2={LINE_Y + 7} stroke={GRAY} strokeWidth={1} strokeDasharray="2 2" />
              <text x={x(4.5) - 4} y={LINE_Y - 14} textAnchor="end" fontSize={11} fill={GRAY}>중간 4.5%</text>
              <circle cx={x(4.6)} cy={LINE_Y} r={5} fill={BLUE} />
              <text x={x(4.6) + 2} y={LINE_Y - 14} fontSize={12} fontWeight={700} fill={BLUE}>합의 4.6%</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
