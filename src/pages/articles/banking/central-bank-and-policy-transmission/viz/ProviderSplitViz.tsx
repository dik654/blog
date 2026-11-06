import SceneShell from "./SceneShell";

/**
 * 본문 대응: #corridor-boundary — 비은행 제공자의 대안 3.8%, 은행 예치 4%, 중개 비용 0.15%p(가정).
 * 은행 최대 지급 여력 4 − 0.15 = 3.85. 3.83에 거래하면 제공자 +0.03, 은행 +0.02.
 */
const SCENES = [
  { label: "제공자의 다른 선택", summary: "다른 투자 3.8% · 4% 예치는 못 함", note: "비은행 자금 제공자는 중앙은행의 4% 예치에 직접 접근할 수 없습니다. 그에게 열린 다른 투자 수익률은 3.8%입니다. 위험과 기간의 다른 차이는 생략합니다." },
  { label: "은행이 줄 수 있는 한도", summary: "4 − 0.15 = 3.85%", note: "은행이 그 돈을 받아 4%에 두려면 연율로 환산한 중개 비용 0.15%포인트가 든다고 가정합니다. 비용을 뺀 은행의 최대 지급 여력은 3.85%입니다. 이 0.15는 연준 연구의 추정치가 아닙니다." },
  { label: "3.83%에 거래하면", summary: "제공자 +0.03 · 은행 +0.02", note: "제공자는 3.8%보다 0.03%포인트 더 받고, 은행은 4−3.83−0.15=0.02%포인트를 남깁니다. 4% 아래의 거래가 나타나도 두 사람이 모두 더 나은 선택을 했을 수 있습니다." },
] as const;

const x = (rate: number) => 20 + (rate - 3.75) * 1100;
const TOP = 74;
const BOTTOM = 92;
const GRAY = "#64748b";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const AMBER = "#d97706";

function Tick({ rate, label, dy = 0, color = GRAY }: { rate: number; label: string; dy?: number; color?: string }) {
  return (
    <g>
      <line x1={x(rate)} x2={x(rate)} y1={TOP - 4} y2={BOTTOM + 6 + dy} stroke={color} strokeWidth={1} />
      <text x={x(rate)} y={BOTTOM + 19 + dy} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function ProviderSplitViz() {
  return (
    <SceneShell
      eyebrow="4% 아래의 거래"
      title="4%보다 낮은 금리에서도 두 사람 모두 더 나을 수 있습니다"
      description="가로축은 연이율입니다. 3.8%, 4%, 0.15%포인트와 3.83%는 모두 글의 가정이며 실제 시장 관측값이 아닙니다."
      ariaLabel="비은행 제공자의 대안, 은행의 지급 한도, 3.83퍼센트 거래의 몫 나누기"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 142" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={x(3.8)} y={TOP} width={x(4) - x(3.8)} height={BOTTOM - TOP} fill="#94a3b8" fillOpacity={0.15} />
          {active >= 1 && <rect x={x(3.85)} y={TOP} width={x(4) - x(3.85)} height={BOTTOM - TOP} fill={AMBER} fillOpacity={0.35} />}
          {active === 2 && <rect x={x(3.8)} y={TOP} width={x(3.83) - x(3.8)} height={BOTTOM - TOP} fill={GREEN} fillOpacity={0.5} />}
          {active === 2 && <rect x={x(3.83)} y={TOP} width={x(3.85) - x(3.83)} height={BOTTOM - TOP} fill={BLUE} fillOpacity={0.5} />}

          <Tick rate={3.8} label="3.80" />
          <Tick rate={4} label="4.00" />
          {active >= 1 && <Tick rate={3.85} label="3.85" dy={active === 2 ? 14 : 0} color={AMBER} />}
          {active === 2 && <Tick rate={3.83} label="3.83" dy={0} color={BLUE} />}

          <text x={x(3.8)} y={30} textAnchor="middle" fontSize={11} fill={GRAY}>제공자의</text>
          <text x={x(3.8)} y={44} textAnchor="middle" fontSize={11} fill={GRAY}>다른 투자</text>
          <text x={x(4)} y={30} textAnchor="middle" fontSize={11} fill={GRAY}>중앙은행 예치</text>
          <text x={x(4)} y={44} textAnchor="middle" fontSize={11} fill={GRAY}>(제공자 접근 불가)</text>

          {active >= 1 && <text x={(x(3.85) + x(4)) / 2} y={TOP - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>중개 비용 0.15</text>}
          {active === 2 && (
            <>
              <text x={x(3.83) - 2} y={TOP - 8} textAnchor="end" fontSize={12} fontWeight={700} fill={GREEN}>제공자 +0.03</text>
              <line x1={x(3.84)} x2={x(3.84)} y1={TOP - 18} y2={TOP} stroke={BLUE} strokeWidth={1} />
              <text x={x(3.83) + 2} y={TOP - 22} fontSize={12} fontWeight={700} fill={BLUE}>은행 +0.02</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
