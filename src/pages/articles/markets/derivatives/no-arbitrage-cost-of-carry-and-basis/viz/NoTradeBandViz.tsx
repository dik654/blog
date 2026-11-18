import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism(1문단)·#case·#limits — 복제비용 103보다 비싸면 현물 매수·선물 매도,
 * 싸면 반대 거래. 거래비용이 있으면 한 점이 아니라 거래하지 않는 띠가 생기고 제약이 크면 넓어진다.
 * 108 − 103 = 5, 103 − 99 = 4. 비용 2(가정) → 띠 101~105, 남는 값 3·2.
 * 비용 4(가정) → 띠 99~107, 남는 값 1·0.
 */
const FAIR = 103;
const LO = 96;
const HI = 110;
const W = 360;
const H = 112;
const x = (price: number) => 24 + ((price - LO) / (HI - LO)) * (W - 48);
const TICKS: readonly number[] = [97, 99, 101, 103, 105, 107, 109];

const SCENES = [
  { label: "호가 108", quotes: [108], cost: 0, summary: "103보다 5 비쌈 → 현물 매수·선물 매도", note: "선물이 복제비용보다 비싸면 현물을 사고 선물을 팝니다. 이 주문은 현물 가격을 올리고 선물 가격을 내리는 힘이 되어 차이 5를 줄이는 방향으로 작동합니다." },
  { label: "호가 99", quotes: [99], cost: 0, summary: "103보다 4 쌈 → 현물 차입 매도·선물 매수", note: "선물이 싸면 반대 거래입니다. 현물을 빌려 팔고 받은 돈을 운용한 뒤 만기에 선물로 지수를 사서 되갚습니다. 공매도가 가능한지, 차입 비용이 얼마인지에 따라 실제로 할 수 있는지가 달라집니다." },
  { label: "거래비용 2(가정)", quotes: [108, 99], cost: 2, summary: "띠 101~105 · 남는 값 3과 2", note: "한 번의 차익거래에 비용 2가 든다고 가정하면 101과 105 사이 호가에서는 비용을 빼고 남는 것이 없어 아무도 움직이지 않습니다. 108은 비용을 빼고 3, 99는 2가 남아 여전히 띠 밖입니다." },
  { label: "제약이 더 클 때(가정)", quotes: [108, 99], cost: 4, summary: "띠 99~107 · 남는 값 1과 0", note: "10절처럼 차입금리·공매도·세금·보관 제약이 겹쳐 비용이 4라고 가정하면 띠가 99~107로 넓어집니다. 99는 띠의 끝에 닿아 남는 값이 0이고, 108도 1만 남습니다. 103과의 차이가 곧 공짜 이익은 아닙니다." },
] as const;

function action(quote: number) {
  return quote > FAIR ? "현물 매수·선물 매도" : "현물 차입 매도·선물 매수";
}

export default function NoTradeBandViz() {
  return (
    <SceneShell
      eyebrow="무차익의 띠"
      title="복제비용 103에서 벗어난 호가가 거래를 부릅니다"
      description="가로축은 선물 호가입니다. 점선 103은 3절의 복제비용(현물 100 + 이자 5 − 배당 2)이고, 파란 칸은 비용을 빼면 남는 것이 없어 거래하지 않는 가격 띠입니다. 비용 2와 4는 띠를 보이려는 가정입니다."
      ariaLabel="선물 호가 108과 99가 복제비용 103과 거래하지 않는 가격 띠에 대해 어디에 놓이는지"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const quotes: readonly number[] = scene.quotes;
        const bandLo = FAIR - scene.cost;
        const bandHi = FAIR + scene.cost;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {scene.cost > 0 && (
                <>
                  <rect x={x(bandLo)} y={36} width={x(bandHi) - x(bandLo)} height={34} fill="#2563eb" fillOpacity={0.12} stroke="#2563eb" strokeWidth={1} />
                  <text x={x(FAIR)} y={51} textAnchor="middle" fontSize={11} fill="#1d4ed8">거래 없음</text>
                </>
              )}
              <line x1={x(LO)} x2={x(HI)} y1={70} y2={70} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={66} y2={74} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(tick)} y={88} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
                </g>
              ))}
              <line x1={x(FAIR)} x2={x(FAIR)} y1={scene.cost > 0 ? 57 : 30} y2={74} stroke="#475569" strokeWidth={1.25} strokeDasharray="3 2" />
              <text x={x(FAIR)} y={106} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">복제비용 103</text>
              {quotes.map((quote) => {
                const color = quote > FAIR ? "#d97706" : "#16a34a";
                return (
                  <g key={quote}>
                    <path d={`M ${x(quote)} 34 l -6 -10 h 12 z`} fill={color} />
                    <text x={x(quote)} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>호가 {quote}</text>
                    <line x1={x(quote)} x2={x(quote)} y1={34} y2={70} stroke={color} strokeWidth={1} />
                  </g>
                );
              })}
            </svg>
            <div className="grid gap-1 text-xs leading-5 sm:text-sm">
              {[108, 99].map((quote) => {
                const shown = quotes.includes(quote);
                const gap = Math.abs(quote - FAIR);
                const left = Math.max(gap - scene.cost, 0);
                return (
                  <p key={quote} className={shown ? "" : "invisible"}>
                    <span className="font-mono font-bold">{quote}</span> · {scene.cost > 0 && left === 0 ? "띠 끝이라 거래 유인 없음" : action(quote)} · 차이 {gap}
                    {scene.cost > 0 ? ` − 비용 ${scene.cost} = 남는 값 ${left}` : ""}
                  </p>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
