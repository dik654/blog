import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism(2문단)·#names — 만기가 다가오면 남은 자금비용과 배당 기간이 짧아지고
 * 선물 − 현물로 정한 베이시스가 0에 가까워진다.
 * (가정) 현물이 100에 머물고, 이자 5·배당 2가 남은 기간에 비례한다.
 * 남은 m개월의 공정 베이시스 = (5 − 2) × m / 12 → 12: 3, 6: 1.5, 1: 0.25, 0: 0.
 */
const SPOT = 100;
const INTEREST = 5;
const DIV = 2;

const SCENES = [
  { label: "만기까지 12개월", months: 12, summary: "이자 5 − 배당 2 = 베이시스 3", note: "1년이 남았을 때는 3절의 장부 그대로입니다. 공정가치 103과 현물 100의 차이 3이 이 글에서 정한 베이시스(선물 − 현물)입니다." },
  { label: "6개월 남음", months: 6, summary: "이자 2.5 − 배당 1 = 1.5", note: "남은 기간이 절반이면 갚을 이자와 앞으로 받을 배당도 절반으로 가정했습니다. 두 항목이 함께 줄어 차이도 1.5로 줄어듭니다." },
  { label: "1개월 남음", months: 1, summary: "약 0.42 − 0.17 = 0.25", note: "한 달이 남으면 이자는 5의 12분의 1, 배당은 2의 12분의 1만 남습니다. 공정가치는 100.25로 현물에 거의 붙습니다." },
  { label: "결제일", months: 0, summary: "남은 보유비용 0 → 베이시스 0", note: "결제일에는 들고 갈 기간이 없어 공정가치가 현물과 같아집니다. 이때도 값이 다르면 싼 곳에서 사서 비싼 곳에 넘길 유인이 생깁니다. 인도 장소·품질·시간이 다르면 그 조정분을 먼저 맞춰야 하므로 무조건 0이 된다는 뜻은 아닙니다." },
] as const;

const W = 360;
const H = 156;
const LEFT = 40;
const RIGHT = 20;
const TOP = 18;
const BOTTOM = 124;
const Y_LO = 99.5;
const Y_HI = 103.5;
const xm = (months: number) => LEFT + ((12 - months) / 12) * (W - LEFT - RIGHT);
const yp = (price: number) => BOTTOM - ((price - Y_LO) / (Y_HI - Y_LO)) * (BOTTOM - TOP);
const Y_TICKS: readonly number[] = [100, 101, 102, 103];
const X_TICKS: readonly number[] = [12, 9, 6, 3, 0];

function fmt(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

export default function BasisConvergenceViz() {
  return (
    <SceneShell
      eyebrow="베이시스 수렴"
      title="남은 기간이 줄면 선물과 현물의 차이도 줄어듭니다"
      description="베이시스는 이 글에서 선물 가격 − 현물 가격으로 정합니다. 회색 선이 현물, 파란 선이 공정가치입니다. 현물이 100에 머물고 이자 5와 배당 2가 남은 기간에 비례한다고 가정한 그림입니다."
      ariaLabel="만기까지 남은 기간이 12, 6, 1, 0개월일 때 공정가치와 현물 100의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const interest = (INTEREST * scene.months) / 12;
        const div = (DIV * scene.months) / 12;
        const basis = interest - div;
        const fair = SPOT + basis;
        const mx = xm(scene.months);
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: 공정가치 ${fmt(fair)}, 베이시스 ${fmt(basis)}`}>
              {Y_TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={LEFT} x2={W - RIGHT} y1={yp(tick)} y2={yp(tick)} stroke="#e2e8f0" strokeWidth={1} />
                  <text x={LEFT - 6} y={yp(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
                </g>
              ))}
              {X_TICKS.map((tick) => (
                <text key={tick} x={xm(tick)} y={BOTTOM + 16} textAnchor="middle" fontSize={11} fill="#64748b">{tick === 0 ? "결제일" : `${tick}개월`}</text>
              ))}
              <text x={W - RIGHT} y={BOTTOM + 30} textAnchor="end" fontSize={10} fill="#64748b">시간 경과 → 남은 기간이 줄어듦</text>
              <line x1={xm(12)} x2={xm(0)} y1={yp(SPOT)} y2={yp(SPOT)} stroke="#64748b" strokeWidth={1.25} />
              <line x1={xm(12)} x2={xm(0)} y1={yp(103)} y2={yp(SPOT)} stroke="#2563eb" strokeWidth={1.25} />
              <text x={xm(9)} y={yp(SPOT + 2.25) - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">공정가치</text>
              <text x={xm(12) + 4} y={yp(SPOT) + 14} fontSize={11} fontWeight={700} fill="#475569">현물 100(가정)</text>
              {basis > 0 && <line x1={mx} x2={mx} y1={yp(fair)} y2={yp(SPOT)} stroke="#d97706" strokeWidth={1.25} />}
              <circle cx={mx} cy={yp(fair)} r={3.5} fill="#2563eb" />
              <circle cx={mx} cy={yp(SPOT)} r={3.5} fill="#64748b" />
              <text
                x={mx}
                y={scene.months >= 6 ? (yp(fair) + yp(SPOT)) / 2 + 4 : yp(fair) - 14}
                textAnchor={scene.months >= 6 ? "start" : "end"}
                dx={scene.months >= 6 ? 8 : -4}
                fontSize={12}
                fontWeight={700}
                fill="#d97706"
              >
                베이시스 {fmt(basis)}
              </text>
            </svg>
            <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs sm:text-sm">
              <span className="text-[11px] text-muted-foreground">남은 이자</span>
              <span className="text-[11px] text-muted-foreground">남은 배당</span>
              <span className="text-[11px] text-muted-foreground">공정가치</span>
              <span className="text-[11px] text-muted-foreground">베이시스</span>
              <span>{fmt(interest)}</span>
              <span>−{fmt(div)}</span>
              <span>{fmt(fair)}</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">{fmt(basis)}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
