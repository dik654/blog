import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mask — h=2, p=.25, q=.75. h̃는 확률 .25로 0, 확률 .75로 8/3.
 * 평균 .25×0+.75×8/3=2, 분산 (−2)²×.25 + (2/3)²×.75 = 1 + 1/3 = 4/3 = (p/q)h².
 */
const W = 360;
const H = 200;
const X0 = 40;
const X1 = 330;
const MAX_X = 3;
const BASE_Y = 140;
const FULL = 100;
const BAR_W = 26;
const x = (value: number) => X0 + (value / MAX_X) * (X1 - X0);

const OUTCOMES = [
  { value: 0, prob: 0.25, label: "0", probLabel: "확률 .25" },
  { value: 8 / 3, prob: 0.75, label: "8/3", probLabel: "확률 .75" },
] as const;

const SCENES = [
  { label: "train 두 결과", summary: "0 또는 8/3", note: "mask가 꺼지면 0, 켜지면 2/.75=8/3입니다. 막대 높이가 각 결과가 나올 확률입니다." },
  { label: "평균 2", summary: ".25×0 + .75×8/3 = 2", note: "확률을 무게로 두면 균형점이 2입니다. 그러나 2라는 값은 어느 한 train forward에서도 나오지 않습니다." },
  { label: "분산 4/3", summary: "1 + 1/3 = 4/3", note: "평균 2에서 각 결과까지 거리를 제곱해 확률로 가중합합니다. 0 쪽은 (−2)²×.25=1, 8/3 쪽은 (2/3)²×.75=1/3이고, 합 4/3은 식 (p/q)h²=(.25/.75)×4와 같습니다." },
  { label: "eval", summary: "mask 없음 → 2", note: "일반 eval은 mask 없이 모든 경로를 그대로 쓰므로 이 coordinate의 output은 매번 2입니다. 0과 8/3 사이를 오가는 퍼짐은 train의 mask에서 생깁니다." },
] as const;

export default function DropoutSpreadViz() {
  return (
    <SceneShell
      eyebrow="h=2 · p=.25 · q=.75"
      title="평균은 2에 맞지만 한 번의 output은 0이나 8/3으로 흩어집니다"
      description="가로축은 dropout 뒤 값 h̃, 막대 높이는 그 값이 나올 확률입니다. 분산은 값이 평균에서 얼마나 흩어지는지를 거리 제곱의 확률 가중합으로 잰 양입니다."
      ariaLabel="dropout 뒤 두 결과 0과 8/3의 확률, 평균 2, 분산 4/3, eval output 2"
      scenes={SCENES}
      render={(active) => {
        const evalMode = active === 3;
        const mean = x(2);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {OUTCOMES.map((outcome) => {
              const height = outcome.prob * FULL;
              const left = x(outcome.value) - BAR_W / 2;
              return (
                <g key={outcome.label} opacity={evalMode ? 0.2 : 1}>
                  <rect x={left} y={BASE_Y - height} width={BAR_W} height={height} rx={2} fill="#2563eb" opacity={0.8} />
                  <text x={left + BAR_W / 2} y={BASE_Y - height - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">{outcome.probLabel}</text>
                </g>
              );
            })}
            {evalMode && (
              <g>
                <rect x={mean - BAR_W / 2} y={BASE_Y - FULL} width={BAR_W} height={FULL} rx={2} fill="#16a34a" opacity={0.85} />
                <text x={mean - BAR_W / 2 - 6} y={BASE_Y - FULL + 12} textAnchor="end" fontSize={11} fontWeight={700} fill="#15803d">eval: 확률 1로 2</text>
              </g>
            )}
            {active === 2 && (
              <g>
                <line x1={x(0) + 4} x2={mean} y1={BASE_Y - 40} y2={BASE_Y - 40} stroke="#d97706" strokeWidth={1.25} />
                <text x={(x(0) + mean) / 2} y={BASE_Y - 46} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">(−2)²×.25 = 1</text>
                <line x1={mean} x2={x(8 / 3)} y1={BASE_Y - 104} y2={BASE_Y - 104} stroke="#d97706" strokeWidth={1.25} />
                <text x={mean - 4} y={BASE_Y - 110} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">(2/3)²×.75 = 1/3</text>
              </g>
            )}
            <line x1={X0 - 20} x2={X1} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 1, 2, 3].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={BASE_Y} y2={BASE_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(tick)} y={BASE_Y + 16} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            <text x={x(8 / 3)} y={BASE_Y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">8/3</text>
            {active >= 1 && (
              <g>
                <path d={`M ${mean} ${BASE_Y + 22} l -7 12 h 14 z`} fill={evalMode ? "#16a34a" : "#7c3aed"} />
                <text x={mean} y={BASE_Y + 50} textAnchor="middle" fontSize={11} fontWeight={700} fill={evalMode ? "#15803d" : "#6d28d9"}>{evalMode ? "eval output 2" : "평균 2"}</text>
              </g>
            )}
            <text x={X0 - 10} y={H - 4} fontSize={10} fill="#64748b">가로축: dropout 뒤 값 h̃</text>
          </svg>
        );
      }}
    />
  );
}
