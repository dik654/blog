import SceneShell from "./SceneShell";

/**
 * 본문 대응: #liquidation-peg-tools — "위험 조정 담보 가치가 빚보다 작아지면 unsafe",
 * 그리고 unsafe 판정·경매 시작·담보 낙찰·bad debt 해소가 서로 다른 단계라는 점.
 * 위험 조정 가치 = oracle 가치 ÷ 청산 비율. 청산 비율 130%와 oracle 가치 120달러는 가정.
 * 150 ÷ 1.3 ≈ 115.38, 120 ÷ 1.3 ≈ 92.31. 빚 100 → 105는 본문의 rate 1 → 1.05 예시.
 */
const RATIO = 1.3;
const W = 360;
const LEFT = 96;
const RIGHT = 334;
const MAX = 160;
const x = (v: number) => LEFT + (v / MAX) * (RIGHT - LEFT);

const BARS = [
  { value: 150, debt: 100 },
  { value: 150, debt: 105 },
  { value: 120, debt: 105 },
] as const;

const STAGES = ["unsafe 판정", "경매 시작", "담보 낙찰", "bad debt 해소"] as const;

const SCENES = [
  {
    label: "rate 1 · 가치 150",
    summary: "115.38 ≥ 100 → 안전",
    note: "위험 조정 가치는 oracle 가치를 담보 종류의 청산 비율로 나눈 값입니다. 청산 비율을 130%로 가정하면 150 ÷ 1.3 ≈ 115.38이 빚 100보다 커서 unsafe가 아닙니다.",
  },
  {
    label: "rate 1.05",
    summary: "115.38 ≥ 105 → 여유 10.38",
    note: "담보는 그대로인데 수수료가 쌓여 빚이 105가 됐습니다. 위험 조정 가치와의 간격이 15.38에서 10.38로 줄었습니다.",
  },
  {
    label: "oracle 가치 120 (가정)",
    summary: "92.31 < 105 → unsafe",
    note: "Oracle update 뒤 가치가 120이면 담보 가치 자체는 빚 105보다 큽니다. 그래도 위험 조정 가치 120 ÷ 1.3 ≈ 92.31이 105보다 작아 liquidation module이 unsafe로 판정할 수 있습니다.",
  },
  {
    label: "경매 시작",
    summary: "Dog → Clipper",
    note: "판정 뒤 Dog가 금고에서 빚과 담보를 떼어 Clipper 경매로 넘깁니다. 이것은 경매가 시작됐다는 기록일 뿐, 담보가 팔렸다는 뜻이 아닙니다.",
  },
  {
    label: "경매가 늦어질 때",
    summary: "낙찰 대기",
    note: "본문이 드는 지연 원인은 시장 혼잡, oracle과 실제 가격의 차이, keeper 실패입니다. 이 동안 경매는 시작됐지만 낙찰은 아직입니다.",
  },
  {
    label: "낙찰과 해소는 따로",
    summary: "네 단계 · 네 기록",
    note: "담보 낙찰과 bad debt 해소도 같은 단계가 아닙니다. 경매에서 얼마가 회수되는지는 본문이 정하지 않으므로 금액은 그리지 않았습니다.",
  },
] as const;

function StageTrack({ done, waiting }: { done: number; waiting: number | null }) {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {STAGES.map((stage, index) => {
        const isDone = index < done;
        const isWaiting = waiting === index;
        return (
          <li
            key={stage}
            className={`rounded-md border px-2 py-2 text-center text-xs leading-5 ${
              isDone ? "border-[#2563eb] bg-[#2563eb]/10 font-bold text-[#2563eb]" : isWaiting ? "border-dashed border-[#d97706] font-bold text-[#b45309]" : "border-dashed border-border text-muted-foreground"
            }`}
          >
            {index + 1}. {stage}
            <span className="block text-[11px] font-normal">{isDone ? "기록됨" : isWaiting ? "늦어질 수 있음" : "아직"}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function LiquidationLineViz() {
  return (
    <SceneShell
      eyebrow="청산선과 그 뒤의 단계"
      title="담보가 빚보다 많아도 unsafe가 될 수 있고, 판정 뒤에도 단계가 셋 더 남습니다"
      description="막대는 달러 단위입니다. 회색은 oracle 가치, 파란색은 그 값을 청산 비율로 나눈 위험 조정 가치(빚보다 작아지면 빨간색), 주황 선은 현재 빚(art × rate)입니다. 아래 칸은 청산의 네 단계입니다."
      note="청산 비율 130%와 oracle 가치 120달러는 그림을 위한 가정입니다. 실제 청산 비율은 담보 종류와 governance 시점의 parameter로 읽습니다."
      ariaLabel="위험 조정 담보 가치와 빚을 비교해 unsafe 판정에 이르고, 경매 시작, 낙찰, bad debt 해소로 나뉘는 장면"
      scenes={SCENES}
      render={(active) => {
        const bar = BARS[Math.min(active, 2)];
        const adjusted = bar.value / RATIO;
        const unsafe = adjusted < bar.debt;
        const handedOver = active >= 3;
        const done = active < 2 ? 0 : active === 2 ? 1 : 2;
        const waiting = active === 4 ? 2 : null;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} 132`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`oracle 가치 ${bar.value}, 위험 조정 가치 ${adjusted.toFixed(2)}, 빚 ${bar.debt}`}>
              {!handedOver && (<g>
                <text x={LEFT - 6} y={30} textAnchor="end" fontSize={12} fill="#64748b">oracle 가치</text>
                <rect x={LEFT} y={18} width={x(bar.value) - LEFT} height={16} rx={2} fill="#94a3b8" />
                <text x={LEFT + 6} y={30} textAnchor="start" fontSize={12} fontWeight={700} fill="#ffffff">{bar.value}</text>
                <text x={LEFT - 6} y={62} textAnchor="end" fontSize={12} fill="#64748b">위험 조정</text>
                <rect x={LEFT} y={50} width={x(adjusted) - LEFT} height={16} rx={2} fill={unsafe ? "#dc2626" : "#2563eb"} />
                <text x={LEFT + 6} y={62} textAnchor="start" fontSize={12} fontWeight={700} fill="#ffffff">{adjusted.toFixed(2)}</text>
                <line x1={x(bar.debt)} x2={x(bar.debt)} y1={10} y2={76} stroke="#d97706" strokeWidth={1.25} />
                <text x={x(bar.debt)} y={92} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">빚 {bar.debt}</text>
              </g>)}
              {!handedOver && (
                <g>
                  <line x1={LEFT} x2={RIGHT} y1={104} y2={104} stroke="#94a3b8" strokeWidth={1} />
                  {[0, 50, 100, 150].map((tick) => (
                    <text key={tick} x={x(tick)} y={120} textAnchor="middle" fontSize={12} fill="#64748b">{tick}</text>
                  ))}
                </g>
              )}
              {handedOver && (
                <>
                  <rect x={LEFT} y={22} width={RIGHT - LEFT} height={50} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
                  <text x={(LEFT + RIGHT) / 2} y={44} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">금고에서 떼어 낸 빚과 담보</text>
                  <text x={(LEFT + RIGHT) / 2} y={62} textAnchor="middle" fontSize={12} fill="#64748b">→ Clipper 경매로 넘어감</text>
                </>
              )}
            </svg>
            <StageTrack done={done} waiting={waiting} />
          </div>
        );
      }}
    />
  );
}
