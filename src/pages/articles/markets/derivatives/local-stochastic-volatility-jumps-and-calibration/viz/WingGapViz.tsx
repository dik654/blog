import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 첫 문단 — 90 풋 30%·100 중앙 20%·110 콜 24%(1절 가정)를 고정 20%와 비교하면 10·0·4%p, 단순 합 14%p.
 * 가로 = 행사가, 세로 = 옵션가격에서 거꾸로 푼 흔들림(%). 세 점 사이 값은 본문에 없어 선으로 잇지 않는다.
 */
const W = 360;
const H = 210;
const X0 = 56;
const X1 = 330;
const Y_TOP = 24;
const Y_BOT = 170;
const V_MIN = 14;
const V_MAX = 32;
const x = (strike: number) => X0 + ((strike - 85) / 30) * (X1 - X0);
const y = (vol: number) => Y_BOT - ((vol - V_MIN) / (V_MAX - V_MIN)) * (Y_BOT - Y_TOP);
const FLAT = 20;

const POINTS = [
  { strike: 90, vol: 30, name: "90 풋" },
  { strike: 100, vol: 20, name: "100 중앙" },
  { strike: 110, vol: 24, name: "110 콜" },
] as const;
const GAPS = POINTS.map((point) => point.vol - FLAT);
const GAP_SUM = GAPS.reduce<number>((sum, gap) => sum + Math.abs(gap), 0);

const SCENES = [
  { label: "세 옵션이 요구하는 값", summary: "30% · 20% · 24%", note: "같은 만기의 세 옵션가격을 맞추도록 흔들림 값을 거꾸로 풀면 행사가마다 다른 값이 나옵니다(1절 가정). 낮은 행사가 쪽 날개가 가장 높습니다." },
  { label: "20% 하나를 넣으면", summary: "가로선 하나", note: "모든 옵션에 20% 하나를 쓰면 행사가와 상관없이 같은 높이의 가로선이 됩니다. 중앙 100은 이 선 위에 있습니다." },
  { label: "어긋남", summary: "10%p · 0 · 4%p", note: "가로선과 각 점의 세로 거리가 어긋남입니다. 90 풋은 10%포인트, 중앙은 0, 110 콜은 4%포인트입니다." },
  { label: "단순 합계", summary: `10 + 0 + 4 = ${GAP_SUM}%p`, note: "절대 어긋남을 단순히 더하면 14%포인트입니다. 이는 가격오차가 아니라 표면의 모양을 보는 설명용 합계입니다." },
] as const;

const POINT = "#2563eb";
const FLAT_COLOR = "#64748b";
const GAP = "#d97706";

export default function WingGapViz() {
  return (
    <SceneShell
      eyebrow="날개 어긋남"
      title="20% 가로선 하나로는 양쪽 날개에 닿지 않습니다"
      description="가로축은 행사가, 세로축은 옵션가격에 맞도록 거꾸로 푼 흔들림 값(%)입니다. 주가는 100이고 세 값은 1절의 가정입니다."
      ariaLabel="행사가 90, 100, 110에서 30, 20, 24퍼센트인 역산 흔들림과 고정 20퍼센트 가로선의 차이 10, 0, 4퍼센트포인트"
      scenes={SCENES}
      render={(active) => {
        const showFlat = active >= 1;
        const showGap = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X0} x2={X0} y1={Y_TOP - 6} y2={Y_BOT} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X1} y1={Y_BOT} y2={Y_BOT} stroke="#94a3b8" strokeWidth={1} />
            {[20, 24, 30].map((tick) => (
              <g key={tick}>
                <line x1={X0 - 4} x2={X0} y1={y(tick)} y2={y(tick)} stroke="#94a3b8" strokeWidth={1} />
                <text x={X0 - 8} y={y(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tick}%</text>
              </g>
            ))}
            {POINTS.map((point) => (
              <text key={`t-${point.strike}`} x={x(point.strike)} y={Y_BOT + 18} textAnchor="middle" fontSize={12} fill="#64748b">{point.strike}</text>
            ))}
            <text x={X1} y={Y_BOT + 34} textAnchor="end" fontSize={12} fill="#64748b">행사가</text>

            {showFlat && (
              <g>
                <line x1={X0} x2={X1} y1={y(FLAT)} y2={y(FLAT)} stroke={FLAT_COLOR} strokeWidth={1.25} strokeDasharray="5 3" />
                <text x={X1} y={y(FLAT) + 16} textAnchor="end" fontSize={12} fontWeight={700} fill={FLAT_COLOR}>고정 20%</text>
              </g>
            )}

            {showGap &&
              POINTS.map((point, index) =>
                GAPS[index] === 0 ? (
                  <text key={`g-${point.strike}`} x={x(point.strike)} y={y(FLAT) + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={GAP}>0</text>
                ) : (
                  <g key={`g-${point.strike}`}>
                    <line x1={x(point.strike)} x2={x(point.strike)} y1={y(FLAT)} y2={y(point.vol) + 6} stroke={GAP} strokeWidth={1.25} />
                    <text x={x(point.strike) + 8} y={(y(FLAT) + y(point.vol)) / 2 + 4} fontSize={12} fontWeight={700} fill={GAP}>{GAPS[index]}%p</text>
                  </g>
                ),
              )}

            {POINTS.map((point) => (
              <g key={`p-${point.strike}`}>
                <circle cx={x(point.strike)} cy={y(point.vol)} r={5} fill={POINT} />
                <text x={x(point.strike)} y={y(point.vol) - 10} textAnchor="middle" fontSize={12} fontWeight={700} fill={POINT}>
                  {point.name} {point.vol}%
                </text>
              </g>
            ))}

            {active === 3 && (
              <g>
                <rect x={X0 + 150} y={Y_TOP - 4} width={118} height={24} rx={4} fill="#ffffff" stroke={GAP} strokeWidth={1} />
                <text x={X0 + 209} y={Y_TOP + 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={GAP}>합 {GAP_SUM}%p (설명용)</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
