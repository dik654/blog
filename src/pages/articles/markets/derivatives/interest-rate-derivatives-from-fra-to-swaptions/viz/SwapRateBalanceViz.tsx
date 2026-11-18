import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source 둘째 문단 — 스왑 고정금리는 오늘 금리의 복사가 아니라
 * 변동 지급의 현재가치 합 = 고정 지급의 현재가치 합이 되도록 곡선 전체로 정한다.
 * 가정: 명목 10억, 1년마다 4번 지급, 예상 변동금리 3·4·5·6%, 할인도 같은 금리로(곡선 하나).
 * 할인계수 D1 = 1/1.03, D2 = D1/1.04, D3 = D2/1.05, D4 = D3/1.06.
 * 변동 PV 합 ≈ 1억 6,125만, 고정 3% PV 합 ≈ 1억 897만, 균형 고정금리 ≈ 4.44%.
 */
const NOTIONAL = 100000; // 10억 원을 만 원 단위로
const FORWARDS: readonly number[] = [0.03, 0.04, 0.05, 0.06];
const DISCOUNT: readonly number[] = FORWARDS.reduce<number[]>((acc, rate) => [...acc, (acc.length ? acc[acc.length - 1] : 1) / (1 + rate)], []);
const ANNUITY = DISCOUNT.reduce<number>((sum, d) => sum + d, 0);
const FLOAT_PAY = FORWARDS.map((rate) => rate * NOTIONAL);
const FLOAT_PV = FLOAT_PAY.map((pay, i) => pay * DISCOUNT[i]);
const FLOAT_SUM = FLOAT_PV.reduce<number>((sum, v) => sum + v, 0);
const COPY_RATE = FORWARDS[0];
const COPY_PV = DISCOUNT.map((d) => COPY_RATE * NOTIONAL * d);
const COPY_SUM = COPY_PV.reduce<number>((sum, v) => sum + v, 0);
const PAR_RATE = FLOAT_SUM / NOTIONAL / ANNUITY;
const PAR_PV = DISCOUNT.map((d) => PAR_RATE * NOTIONAL * d);
const PAR_SUM = PAR_PV.reduce<number>((sum, v) => sum + v, 0);

const won = (manwon: number) => {
  const rounded = Math.round(manwon);
  const eok = Math.floor(rounded / 10000);
  const rest = rounded % 10000;
  return eok > 0 ? `${eok}억 ${rest.toLocaleString("en-US")}만` : `${rest.toLocaleString("en-US")}만`;
};
const pct = (rate: number) => `${(rate * 100).toFixed(2)}%`;

const W = 360;
const H = 176;
const BASE = 146;
const MAX = 6000;
const h = (v: number) => (v / MAX) * 112;
const colX = (i: number) => 30 + i * 82;
const BW = 30;

const SCENES = [
  {
    label: "예상 변동 지급",
    summary: "3,000 · 4,000 · 5,000 · 6,000만",
    note: "곡선이 앞으로의 변동금리를 3·4·5·6%로 가리킨다고 가정합니다. 명목 10억 원이면 해마다 받을 변동 지급은 점점 커집니다.",
  },
  {
    label: "현재가치로 당기기",
    summary: `변동 쪽 합 ${won(FLOAT_SUM)} 원`,
    note: "먼 해의 돈일수록 여러 해의 금리로 할인하므로 막대가 더 많이 줄어듭니다. 4년째 6,000만 원은 오늘 약 5,033만 원입니다.",
  },
  {
    label: "오늘 금리를 복사하면",
    summary: `고정 3% → ${won(COPY_SUM)} ≠ ${won(FLOAT_SUM)}`,
    note: "첫 해 금리 3%를 그대로 고정금리로 쓰면 고정 쪽 현재가치 합이 변동 쪽보다 작습니다. 두 현재가치가 같아야 한다는 8절의 기준을 맞추지 못합니다.",
  },
  {
    label: "양쪽이 같아지는 고정금리",
    summary: `고정 ${pct(PAR_RATE)} → 양쪽 ${won(PAR_SUM)}`,
    note: `고정 지급의 현재가치 합이 변동 쪽과 같아지는 금리는 약 ${pct(PAR_RATE)}입니다. 첫 해 금리도, 마지막 해 금리도 아니고 네 해의 곡선 전체가 정한 값입니다(8절). 실제로는 담보 약정이 정하는 할인곡선도 결과에 영향을 줍니다.`,
  },
] as const;

export default function SwapRateBalanceViz() {
  return (
    <SceneShell
      eyebrow="스왑 고정금리"
      title="고정금리는 양쪽 지급의 현재가치가 같아지는 자리에서 정해집니다"
      description="막대 하나가 한 해의 지급(만 원)입니다. 파란 테두리는 할인 전 변동 지급, 칠한 파란 막대는 그 현재가치, 주황 막대는 고정 쪽 현재가치입니다. 명목 10억, 1년마다 4번 지급, 예상 변동금리 3·4·5·6%, 같은 금리로 할인하는 곡선 하나는 모두 설명을 위한 가정입니다."
      ariaLabel="예상 변동금리 3, 4, 5, 6퍼센트의 현재가치 합과 같아지는 스왑 고정금리 약 4.44퍼센트"
      scenes={SCENES}
      render={(active) => {
        const fixedPv = active === 2 ? COPY_PV : active === 3 ? PAR_PV : null;
        const fixedSum = active === 2 ? COPY_SUM : active === 3 ? PAR_SUM : null;
        return (
          <div className="mx-auto w-full max-w-[540px]">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={20} x2={W - 10} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              {FORWARDS.map((rate, i) => {
                const x = colX(i);
                const pay = FLOAT_PAY[i];
                const pv = FLOAT_PV[i];
                const fixed = fixedPv ? fixedPv[i] : null;
                return (
                  <g key={rate}>
                    <rect x={x} y={BASE - h(pay)} width={BW} height={h(pay)} rx={2} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray={active >= 1 ? "3 3" : undefined} />
                    {active >= 1 && <rect x={x} y={BASE - h(pv)} width={BW} height={h(pv)} rx={2} fill="#1d4ed8" />}
                    <text
                      x={x + BW / 2}
                      y={active >= 1 ? BASE - h(pv) + 14 : BASE - h(pay) - 5}
                      textAnchor="middle"
                      fontSize={active >= 1 ? 9 : 10}
                      fontWeight={700}
                      fill={active >= 1 ? "#ffffff" : "#1d4ed8"}
                    >
                      {Math.round(active >= 1 ? pv : pay).toLocaleString("en-US")}
                    </text>
                    {fixed !== null && (
                      <g>
                        <rect x={x + BW + 4} y={BASE - h(fixed)} width={BW} height={h(fixed)} rx={2} fill="#b45309" />
                        <text x={x + BW * 1.5 + 4} y={BASE - h(fixed) + 14} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">{Math.round(fixed).toLocaleString("en-US")}</text>
                      </g>
                    )}
                    <text x={x + BW} y={BASE + 14} textAnchor="middle" fontSize={11} fill="#64748b">{`${i + 1}년 · ${Math.round(rate * 100)}%`}</text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs leading-5">
              <div className="rounded-lg border px-2 py-2" style={{ borderColor: "#2563eb" }}>
                <span className="block text-muted-foreground">변동 쪽 현재가치 합</span>
                <span className={`block font-mono text-sm font-bold ${active >= 1 ? "" : "opacity-0"}`}>{won(FLOAT_SUM)} 원</span>
              </div>
              <div className="rounded-lg border px-2 py-2" style={{ borderColor: "#d97706" }}>
                <span className="block text-muted-foreground">고정 쪽 현재가치 합</span>
                <span className={`block font-mono text-sm font-bold ${fixedSum === null ? "opacity-0" : ""}`}>{fixedSum === null ? "−" : `${won(fixedSum)} 원`}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
