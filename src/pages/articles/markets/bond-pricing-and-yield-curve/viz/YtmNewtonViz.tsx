import BondSceneShell from "./BondSceneShell";

/**
 * 본문 대응: #ytm AlgorithmBlock — 시장 가격에서 만기수익률을 거꾸로 찾는 뉴턴 반복.
 * 부품 1의 채권(액면 100, 표면금리 3%, 3년)이 할인율 5%일 때의 값 94.55를 시장 가격으로 둔다.
 * f(y) = 계산 가격 − 94.55, 시작값 3% → 4.9255% → 4.9999%에서 차이가 허용 오차 안에 든다.
 */
const FACE = 100;
const COUPON = 0.03;
const YEARS = [1, 2, 3] as const;
const MARKET = YEARS.reduce<number>((sum, t) => sum + (COUPON * FACE) / 1.05 ** t, 0) + FACE / 1.05 ** 3;
const EPS = 0.01;

function gap(y: number) {
  return YEARS.reduce<number>((sum, t) => sum + (COUPON * FACE) / (1 + y) ** t, 0) + FACE / (1 + y) ** 3 - MARKET;
}

function slope(y: number) {
  return YEARS.reduce<number>((sum, t) => sum - (t * COUPON * FACE) / (1 + y) ** (t + 1), 0) - (3 * FACE) / (1 + y) ** 4;
}

/** 시작값 3%에서 뉴턴 반복 두 번 */
const ITER = [0, 1].reduce<number[]>((acc) => {
  const y = acc[acc.length - 1];
  return [...acc, y - gap(y) / slope(y)];
}, [COUPON]);

const X = (yPct: number) => 48 + yPct * 50;
const Y = (f: number) => 112 - f * 5.6;
const CURVE = Array.from({ length: 81 }, (_, i) => i / 10)
  .map((yPct) => `${X(yPct).toFixed(1)},${Y(gap(yPct / 100)).toFixed(1)}`)
  .join(" ");

const pct = (y: number) => `${(y * 100).toFixed(4)}%`;
const diff = (y: number) => {
  const v = gap(y);
  return Math.abs(v) < 0.01 ? v.toFixed(4) : v.toFixed(2);
};

const SCENES = [
  {
    label: "차이가 0이 되는 y를 찾는다",
    summary: `f(y) = 계산 가격 − ${MARKET.toFixed(2)}`,
    note: `시장 가격 ${MARKET.toFixed(2)}를 맞추는 할인율을 찾는 문제를 "계산 가격과 시장 가격의 차이 f(y)를 0으로 만드는 y"로 바꿉니다. 곡선이 오른쪽으로 갈수록 계속 내려가므로 0선을 한 번만 지납니다.`,
  },
  {
    label: "시작값 3%에서 접선을 따라간다",
    summary: `차이 +${diff(ITER[0])} → ${pct(ITER[1])}`,
    note: `표면금리 3%에서 계산 가격은 100이라 시장 가격보다 ${diff(ITER[0])} 큽니다. 그 점의 접선이 0선과 만나는 ${pct(ITER[1])}가 다음 추정값입니다.`,
  },
  {
    label: "차이가 허용 오차 안에 들면 멈춘다",
    summary: `차이 ${diff(ITER[2])} → 약 5%`,
    note: `${pct(ITER[1])}에서는 차이가 ${diff(ITER[1])}로 아직 허용 오차 ${EPS}보다 큽니다. 한 번 더 옮긴 ${pct(ITER[2])}에서 차이가 ${diff(ITER[2])}가 되어 멈춥니다. 답은 부품 1에서 가격을 만든 할인율 5%와 같습니다.`,
  },
];

const MUTED = "#94a3b8";
const CURVE_COLOR = "#2563eb";
const STEP_COLOR = "#d97706";
const DONE_COLOR = "#16a34a";

export default function YtmNewtonViz() {
  return (
    <BondSceneShell
      eyebrow="만기수익률 찾기"
      title="가격 차이 곡선에서 접선을 따라 0선으로 다가갑니다"
      description={`부품 1의 채권(액면 100, 표면금리 3%, 3년)이 할인율 5%로 계산한 값 ${MARKET.toFixed(2)}에 거래된다고 둡니다. 세로축은 계산 가격에서 시장 가격을 뺀 차이입니다.`}
      note={`허용 오차 ${EPS}(액면 100 기준)는 설명용 선택입니다(가정).`}
      ariaLabel="뉴턴 반복으로 만기수익률을 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const shown = ITER.slice(0, active + 1);
        return (
          <div className="min-w-0">
            <div className="w-full min-w-0 overflow-x-auto">
              <svg viewBox="0 0 480 200" role="img" aria-label={SCENES[active].label} className="mx-auto h-auto w-full max-w-lg">
                <line x1={X(0)} y1={20} x2={X(0)} y2={168} stroke={MUTED} strokeWidth={1} />
                <line x1={X(0)} y1={Y(0)} x2={X(8)} y2={Y(0)} stroke="#64748b" strokeWidth={1} />
                <text x={X(0) + 6} y={Y(0) - 6} fontSize={12} fill="#64748b">
                  0선: 계산 가격 = 시장 가격
                </text>
                {[0, 2, 4, 6, 8].map((v) => (
                  <text key={v} x={X(v)} y={186} textAnchor="middle" fontSize={12} fill={MUTED}>
                    {v}%
                  </text>
                ))}
                {[10, -5].map((v) => (
                  <text key={v} x={X(0) - 6} y={Y(v) + 3} textAnchor="end" fontSize={12} fill={MUTED}>
                    {v > 0 ? `+${v}` : v}
                  </text>
                ))}
                <text x={X(0) + 6} y={16} fontSize={12} fill={MUTED}>
                  f(y)
                </text>
                <text x={X(8)} y={198} textAnchor="end" fontSize={12} fill={MUTED}>
                  할인율 y
                </text>
                <polyline points={CURVE} fill="none" stroke={CURVE_COLOR} strokeWidth={1.25} />

                {active >= 1 &&
                  shown.slice(0, -1).map((y, k) => (
                    <g key={k}>
                      <line x1={X(y * 100)} y1={Y(gap(y))} x2={X(shown[k + 1] * 100)} y2={Y(0)} stroke={STEP_COLOR} strokeWidth={1} strokeDasharray="4 3" />
                      <line x1={X(shown[k + 1] * 100)} y1={Y(0)} x2={X(shown[k + 1] * 100)} y2={Y(gap(shown[k + 1]))} stroke={MUTED} strokeWidth={1} />
                    </g>
                  ))}
                {shown.map((y, k) => {
                  const last = k === shown.length - 1;
                  const done = active === 2 && last;
                  return (
                    <circle key={k} cx={X(y * 100)} cy={Y(gap(y))} r={3.5} fill={done ? DONE_COLOR : STEP_COLOR} />
                  );
                })}
                {active === 0 && (
                  <text x={X(5) + 8} y={Y(0) - 8} fontSize={12} fill={CURVE_COLOR}>
                    0선을 지나는 자리는 하나
                  </text>
                )}
                {active >= 1 && (
                  <text x={X(3) + 8} y={Y(gap(ITER[0])) - 10} fontSize={12} fontWeight={700} fill={STEP_COLOR}>
                    시작 3% · 차이 +{diff(ITER[0])}
                  </text>
                )}
                {active === 2 && (
                  <text x={X(5) + 8} y={Y(0) - 8} fontSize={12} fontWeight={700} fill={DONE_COLOR}>
                    {pct(ITER[2])}에서 멈춤
                  </text>
                )}
              </svg>
            </div>
            <table className="mt-2 w-full text-left font-mono text-xs">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-0.5 font-normal">반복</th>
                  <th className="py-0.5 font-normal">추정 y</th>
                  <th className="py-0.5 font-normal">가격 차이</th>
                  <th className="py-0.5 font-normal">판정</th>
                </tr>
              </thead>
              <tbody>
                {ITER.map((y, k) => {
                  const visible = k <= active;
                  const stop = Math.abs(gap(y)) < EPS;
                  return (
                    <tr key={k} className={visible ? "" : "text-transparent"} aria-hidden={!visible}>
                      <td className="py-0.5">{k}</td>
                      <td className="py-0.5">{pct(y)}</td>
                      <td className="py-0.5">{diff(y)}</td>
                      <td className="py-0.5">{stop ? "멈춤" : "계속"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }}
    />
  );
}
