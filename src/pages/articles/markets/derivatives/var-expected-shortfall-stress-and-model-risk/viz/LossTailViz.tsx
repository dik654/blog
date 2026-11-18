import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case (1·3·4절) — 설명용 하루 손실 0,0,1,1,2,2,3,4,6,10.
 * 8/10 = 80%가 4 이하 → 80% VaR 4. 문턱을 넘은 6과 10의 평균 (6+10)/2 = 8 → 80% ES 8.
 * 스트레스 손실 18은 표본 밖에서 따로 정한 복합 충격의 재평가 손실이라 확률 칸에 넣지 않고 오른쪽 별도 칸에 둡니다.
 */
const LOSSES = [0, 0, 1, 1, 2, 2, 3, 4, 6, 10] as readonly number[];
const VAR = 4;
const TAIL = LOSSES.filter((loss) => loss > VAR);
const ES = TAIL.reduce<number>((total, loss) => total + loss, 0) / TAIL.length;
const STRESS = 18;

const W = 400;
const H = 218;
const BASE_Y = 178;
const TOP_Y = 22;
const MAX = 20;
const LEFT = 26;
const BAR_W = 22;
const GAP = 7;
const STRESS_X = 352;
const y = (value: number) => BASE_Y - (value / MAX) * (BASE_Y - TOP_Y);
const bx = (slot: number) => LEFT + slot * (BAR_W + GAP);

const SCENES = [
  { label: "열 손실을 줄 세웁니다", summary: "0·0·1·1·2·2·3·4·6·10", note: "열 상황이 같은 가능성이라고 놓은 설명용 하루 손실입니다(가정). 막대 하나가 한 상황, 즉 전체의 10%입니다. 대부분은 4 안에 있지만 마지막 두 막대가 훨씬 큽니다." },
  { label: "80% 문턱 = VaR 4", summary: "10개 중 8개가 4 이하", note: "작은 쪽부터 여덟 막대, 곧 80%가 4 이하이므로 이 표본 규칙에서 80% VaR는 4입니다. 열 상황 중 두 상황은 4를 넘으므로 4가 최대손실이라는 뜻은 아닙니다." },
  { label: "문턱 밖 평균 = ES 8", summary: `(6 + 10) ÷ 2 = ${ES}`, note: "문턱을 넘은 두 손실 6과 10의 평균이 8입니다. 이것이 설명용 80% 예상손실(ES)입니다. 표본이 작거나 문턱에 같은 값이 몰리면 계산 규칙에 따라 결과가 달라질 수 있습니다." },
  { label: "스트레스 18은 표본 밖", summary: "과거 최악 10 · 지정 충격 18", note: "4절의 복합 충격 시나리오(금리·주가·환율·매수호가)를 재평가하면 손실 18이 나올 수 있습니다. 이 값은 열 상황 표본에 들어 있지 않고 발생확률도 말하지 않으므로 오른쪽 별도 칸에 둡니다." },
] as const;

export default function LossTailViz() {
  return (
    <SceneShell
      eyebrow="문턱과 꼬리"
      title="80% VaR는 문턱 4, ES는 그 바깥 평균 8입니다"
      description="막대 높이가 하루 손실이고, 막대 아래 숫자가 그 값입니다. VaR는 손실을 작은 순서로 세웠을 때 정한 비율(여기서는 80%)이 그 아래에 드는 경계값이고, 예상손실(ES)은 그 경계를 넘은 손실들의 평균입니다. 80%와 열 상황은 손으로 계산하기 위한 설명용 값입니다."
      ariaLabel="열 개 손실의 80퍼센트 VaR 4와 예상손실 8, 그리고 표본 밖 스트레스 손실 18"
      scenes={SCENES}
      render={(index) => {
        const showVar = index >= 1;
        const showEs = index >= 2;
        const showStress = index === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            {[0, 5, 10, 15, 20].map((tick) => (
              <g key={tick}>
                <line x1={LEFT - 4} x2={W - 8} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={LEFT - 7} y={y(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            {LOSSES.map((loss, slot) => {
              const inTail = loss > VAR;
              const fill = showEs && inTail ? "#dc2626" : showVar && !inTail ? "#2563eb" : "#94a3b8";
              const height = Math.max(BASE_Y - y(loss), 1.5);
              return (
                <g key={slot}>
                  <rect x={bx(slot)} y={BASE_Y - height} width={BAR_W} height={height} rx={2} fill={fill} opacity={showVar && !showEs && inTail ? 0.45 : 0.9} />
                  <text x={bx(slot) + BAR_W / 2} y={BASE_Y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">{loss}</text>
                </g>
              );
            })}
            {showVar && (
              <g>
                <line x1={LEFT} x2={bx(9) + BAR_W + 4} y1={y(VAR)} y2={y(VAR)} stroke="#2563eb" strokeWidth={1.25} />
                <text x={LEFT + 2} y={y(VAR) - 22} fontSize={11} fontWeight={700} fill="#2563eb">VaR 4 · 여기까지 8개 = 80%</text>
              </g>
            )}
            {showEs && (
              <g>
                <line x1={bx(8) - 4} x2={bx(9) + BAR_W + 4} y1={y(ES)} y2={y(ES)} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={bx(8) - 6} y={y(ES) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">ES 8</text>
              </g>
            )}
            <line x1={STRESS_X - 18} x2={STRESS_X - 18} y1={TOP_Y - 8} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
            <text x={STRESS_X + BAR_W / 2} y={BASE_Y + 32} textAnchor="middle" fontSize={10} fill="#64748b">표본 밖</text>
            {showStress && (
              <g>
                <rect x={STRESS_X} y={y(STRESS)} width={BAR_W} height={BASE_Y - y(STRESS)} rx={2} fill="none" stroke="#7c3aed" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={STRESS_X + BAR_W / 2} y={y(STRESS) - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill="#7c3aed">18</text>
              </g>
            )}
            <line x1={LEFT - 4} x2={W - 8} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <text x={(bx(0) + bx(9) + BAR_W) / 2} y={BASE_Y + 32} textAnchor="middle" fontSize={10} fill="#64748b">열 상황(각 10%) · 작은 손실부터</text>
          </svg>
        );
      }}
    />
  );
}
