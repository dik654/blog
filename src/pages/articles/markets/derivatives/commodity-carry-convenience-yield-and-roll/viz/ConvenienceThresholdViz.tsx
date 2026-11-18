import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 재고가 줄면 편의수익이 커지고 가까운 쪽 가격이 먼 만기보다 높아질 수 있다.
 * 3절 장부: 선물 = 현물 75 + 자금 0.75 + 보관 1 − 편의수익.
 * 편의수익 0.5 → 76.25, 1.75 → 75(경계), 2 → 74.75(본문), 3 → 73.75. 0.5·3은 가정.
 */
const SPOT = 75;
const FUNDING = 0.75;
const STORAGE = 1;
const COST = FUNDING + STORAGE;

const SCENES = [
  { label: "재고가 넉넉할 때", cy: 0.5, tag: "가정", summary: "편의수익 0.5(가정) → 선물 76.25", note: "한 배럴을 더 들고 있는 운영상 이익이 작으면 비용 1.75달러가 두드러져 석 달 선물이 현물보다 비싼 콘탱고 방향이 됩니다. 그 차이가 보유비용을 보상할 수 있습니다." },
  { label: "비용과 편익이 같을 때", cy: 1.75, tag: "경계", summary: "편의수익 1.75 → 선물 75", note: "편의수익이 자금·보관비 1.75달러와 같으면 더하고 빼는 값이 상쇄되어 선물이 현물과 같습니다. 이 점을 넘으면 방향이 바뀝니다." },
  { label: "재고가 줄었을 때", cy: 2, tag: "본문", summary: "편의수익 2 → 선물 74.75", note: "3절의 사례입니다. 편의수익 2달러가 비용 1.75달러보다 조금 커서 석 달 선물이 현물보다 0.25달러 쌉니다." },
  { label: "재고가 더 귀할 때", cy: 3, tag: "가정", summary: "편의수익 3(가정) → 선물 73.75", note: "오늘 가진 물량의 가치가 더 커지면 선물은 현물 아래로 더 내려갑니다. 실제로는 계절 수요, 생산 일정과 계약별 인도 가능 재고도 함께 봐야 합니다." },
] as const;

const W = 360;
const H = 96;
const LO = 73;
const HI = 77;
const x = (price: number) => 30 + ((price - LO) / (HI - LO)) * (W - 60);
const TICKS = [73, 74, 75, 76, 77] as const;

function fmt(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

export default function ConvenienceThresholdViz() {
  return (
    <SceneShell
      eyebrow="편의수익의 경계"
      title="편의수익이 비용 1.75를 넘으면 선물이 현물보다 싸집니다"
      description="3절의 배럴당 장부(현물 75, 자금 0.75, 보관·보험 1)를 그대로 두고 편의수익만 바꿉니다. 편의수익은 재고를 지금 쓸 수 있어 얻는 운영상 이익이며 현금으로 들어오지 않습니다. 2는 본문 사례, 0.5와 3은 가정입니다."
      ariaLabel="편의수익을 0.5, 1.75, 2, 3달러로 바꿀 때 석 달 선물가격이 현물 75달러 위아래로 움직이는 모습"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const fut = SPOT + COST - scene.cy;
        const diff = fut - SPOT;
        const color = diff > 0 ? "#2563eb" : diff < 0 ? "#d97706" : "#475569";
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[auto_auto_auto_auto_auto] items-end justify-center gap-x-2 gap-y-1 text-center font-mono text-sm sm:gap-x-4">
              <span className="text-[11px] text-muted-foreground">현물</span>
              <span className="text-[11px] text-muted-foreground">자금</span>
              <span className="text-[11px] text-muted-foreground">보관·보험</span>
              <span className="text-[11px] text-muted-foreground">편의수익</span>
              <span className="text-[11px] text-muted-foreground">석 달 선물</span>
              <span>75</span>
              <span>+0.75</span>
              <span>+1</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">−{fmt(scene.cy)}</span>
              <span className="font-bold" style={{ color }}>= {fmt(fut)}</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`현물 75, 선물 ${fmt(fut)}`}>
              <text x={x(LO)} y={14} fontSize={12} fill="#b45309">← 선물 &lt; 현물 (백워데이션 방향)</text>
              <text x={x(HI)} y={30} textAnchor="end" fontSize={12} fill="#1d4ed8">선물 &gt; 현물 (콘탱고 방향) →</text>
              <line x1={x(LO)} x2={x(HI)} y1={60} y2={60} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={56} y2={64} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(tick)} y={80} textAnchor="middle" fontSize={12} fill="#64748b">{tick}</text>
                </g>
              ))}
              <line x1={x(SPOT)} x2={x(SPOT)} y1={50} y2={66} stroke="#475569" strokeWidth={1.25} strokeDasharray="3 2" />
              <text x={x(SPOT)} y={94} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">현물 75</text>
              <path d={`M ${x(fut)} 58 l -6 -10 h 12 z`} fill={color} className="transition-transform duration-300 motion-reduce:transition-none" />
              <text x={x(fut)} y={44} textAnchor={fut > SPOT ? "start" : fut < SPOT ? "end" : "middle"} dx={fut > SPOT ? 8 : fut < SPOT ? -8 : 0} fontSize={13} fontWeight={700} fill={color}>
                선물 {fmt(fut)}
              </text>
            </svg>
            <p className="text-center text-xs text-muted-foreground">편의수익 {fmt(scene.cy)}달러({scene.tag}) · 선물−현물 {diff > 0 ? "+" : diff < 0 ? "−" : ""}{fmt(Math.abs(diff))}</p>
          </div>
        );
      }}
    />
  );
}
