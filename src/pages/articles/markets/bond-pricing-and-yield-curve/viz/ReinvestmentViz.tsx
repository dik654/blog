import BondSceneShell from "./BondSceneShell";

/**
 * 본문 대응: #ytm-assumption — 만기수익률이 실현되려면 중간 이자를 같은 수익률로 다시 굴려야 한다.
 * 부품 1의 채권을 100(액면)에 사서 만기까지 들고 있다. 만기수익률은 3%.
 * 1년 뒤 이자 3은 2년, 2년 뒤 이자 3은 1년 굴린다. 재투자 금리 1%·3%·5%(가정).
 * 3%: 3.1827 + 3.09 + 103 = 109.2727 = 100 × 1.03³ → 연 3.00%
 * 1%: 3.0603 + 3.03 + 103 = 109.0903 → 연 2.94%,  5%: 3.3075 + 3.15 + 103 = 109.4575 → 연 3.06%
 */
const PRICE = 100;
const COUPON = 3;
const LAST = 103;
const YTM = 0.03;
const RATES = [0.03, 0.01, 0.05];

function outcome(r: number) {
  const first = COUPON * (1 + r) ** 2;
  const second = COUPON * (1 + r);
  const total = first + second + LAST;
  return { first, second, extra: first + second - 2 * COUPON, total, realized: (total / PRICE) ** (1 / 3) - 1 };
}

const NEEDED = outcome(YTM).extra;
const BAR_MAX = 0.5;

const pctText = (v: number) => `${(v * 100).toFixed(2)}%`;

const SCENES = RATES.map((r, i) => {
  const o = outcome(r);
  const tag = i === 0 ? "" : " (가정)";
  const notes = [
    `받은 이자를 만기수익률과 같은 3%로 굴리면 3년 뒤 합계가 ${o.total.toFixed(2)}이고, 100이 연 3%로 3년 불어난 값과 같습니다. 이 경우 실현 수익률이 만기수익률과 일치합니다.`,
    `금리가 내려 1%로만 굴릴 수 있으면 이자가 이자를 낳는 몫이 ${o.extra.toFixed(2)}로 줄어 합계가 ${o.total.toFixed(2)}입니다. 만기까지 들고 있어도 연 ${pctText(o.realized)}로 만기수익률 3%보다 낮습니다.`,
    `금리가 올라 5%로 굴리면 그 몫이 ${o.extra.toFixed(2)}로 늘어 합계 ${o.total.toFixed(2)}, 연 ${pctText(o.realized)}입니다. 같은 채권을 같은 값에 샀어도 결과가 달라집니다.`,
  ];
  return {
    label: `받은 이자를 ${Math.round(r * 100)}%로 굴리면${tag}`,
    summary: `실현 연 ${pctText(o.realized)}`,
    note: notes[i],
  };
});

const MUTED = "#94a3b8";
const CASH = "#2563eb";
const ROLL = "#d97706";

const X = (year: number) => 52 + year * 128;

export default function ReinvestmentViz() {
  return (
    <BondSceneShell
      eyebrow="재투자 가정"
      title="중간에 받은 이자를 몇 %로 굴리느냐가 실현 수익률을 바꿉니다"
      description="부품 1의 채권(액면 100, 표면금리 3%, 3년)을 100에 사서 만기까지 들고 있습니다. 이 가격의 만기수익률은 3%입니다. 실현 수익률은 100이 3년 뒤 합계가 되는 연 복리율입니다."
      note="재투자 금리 1%·5%는 방향을 보이기 위한 가정이며, 굴리는 동안 그대로라고 둡니다."
      ariaLabel="중간 이자의 재투자 금리에 따라 달라지는 실현 수익률"
      scenes={SCENES}
      render={(active) => {
        const r = RATES[active];
        const o = outcome(r);
        const extraWidth = (o.extra / BAR_MAX) * 100;
        const neededAt = (NEEDED / BAR_MAX) * 100;
        const color = active === 0 ? CASH : active === 1 ? "#dc2626" : "#16a34a";
        return (
          <div className="min-w-0">
            <div className="w-full min-w-0 overflow-x-auto">
              <svg viewBox="0 0 480 170" role="img" aria-label={SCENES[active].label} className="mx-auto h-auto w-full min-w-[30rem] max-w-xl">
                <line x1={X(0) - 20} y1={120} x2={X(3) + 24} y2={120} stroke={MUTED} strokeWidth={1} />
                {[0, 1, 2, 3].map((year) => (
                  <g key={year}>
                    <line x1={X(year)} y1={116} x2={X(year)} y2={124} stroke={MUTED} strokeWidth={1} />
                    <text x={X(year)} y={138} textAnchor="middle" fontSize={12} fill={MUTED}>
                      {year}년
                    </text>
                  </g>
                ))}
                <text x={X(0)} y={104} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">
                  −100 지불
                </text>
                {[1, 2].map((year) => (
                  <text key={year} x={X(year)} y={104} textAnchor="middle" fontSize={12} fontWeight={700} fill={CASH}>
                    +3 이자
                  </text>
                ))}
                <text x={X(3)} y={104} textAnchor="middle" fontSize={12} fontWeight={700} fill={CASH}>
                  +103
                </text>

                <path d={`M ${X(1)} 92 Q ${X(2)} 10 ${X(3) - 6} 80`} fill="none" stroke={ROLL} strokeWidth={1} strokeDasharray="4 3" />
                <path d={`M ${X(2)} 92 Q ${X(2.5)} 70 ${X(3) - 10} 86`} fill="none" stroke={ROLL} strokeWidth={1} strokeDasharray="4 3" />
                <text x={X(1.5)} y={40} textAnchor="middle" fontSize={12} fill={ROLL}>
                  2년 굴림
                </text>
                <text x={X(2.5)} y={66} textAnchor="middle" fontSize={12} fill={ROLL}>
                  1년
                </text>
                <text x={X(3) + 24} y={158} textAnchor="end" fontSize={12} fontWeight={700} fill={color}>
                  3년 뒤 합계 {o.total.toFixed(2)}
                </text>
              </svg>
            </div>
            <ul className="mt-1 space-y-0.5 font-mono text-xs text-[#b45309] dark:text-[#f59e0b]">
              <li>1년 뒤 이자: 3 × (1+{Math.round(r * 100)}%)² = {o.first.toFixed(2)}</li>
              <li>2년 뒤 이자: 3 × (1+{Math.round(r * 100)}%) = {o.second.toFixed(2)}</li>
            </ul>
            <div className="mt-3 text-xs">
              <p className="font-bold text-muted-foreground">이자가 낳은 이자 (합계에서 3 + 3 + 103을 뺀 몫)</p>
              <div className="relative mt-2 h-5 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm" style={{ width: `${extraWidth}%`, backgroundColor: color }} />
                <div className="absolute inset-y-[-4px] w-px bg-foreground" style={{ left: `${neededAt}%` }} aria-hidden />
              </div>
              <div className="mt-1 flex justify-between gap-2 font-mono">
                <span className="font-bold" style={{ color }}>
                  {o.extra.toFixed(2)}
                </span>
                <span className="text-muted-foreground">세로선 = 연 3%에 필요한 {NEEDED.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
