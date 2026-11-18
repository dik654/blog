import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 셋째 문단 — 롱스태프·슈워츠 최소제곱 몬테카를로.
 * (가정) 미국형 풋, 행사가 100, 한 관찰 시점의 경로 14개. 점 위치는 원리를 보이기 위한 예시.
 * S = 현재 주가, Y = 그 경로의 다음 시점까지 할인 가치.
 * 2차 최소제곱 회귀(중심 93.571): c0 6.8904, c1 −0.55484, c2 0.012517 → 즉시 행사가치 100−S와 약 S 93에서 교차.
 */
const PATHS = [
  [72, 24], [75, 22.5], [79, 17], [82, 16.5], [86, 10], [89, 11], [92, 6],
  [95, 7.5], [98, 3.5], [101, 5], [104, 1.5], [108, 2.5], [112, 0], [117, 1],
] as const;
const PATH_LIST: readonly (readonly [number, number])[] = PATHS;
const CENTER = 93.571;
const C0 = 6.8904;
const C1 = -0.55484;
const C2 = 0.012517;
const STRIKE = 100;
const fit = (s: number) => C0 + C1 * (s - CENTER) + C2 * (s - CENTER) ** 2;
const exercise = (s: number) => Math.max(STRIKE - s, 0);

const SCENES = [
  { label: "같은 시점, 여러 경로", summary: "경로마다 지금 주가가 다름", note: "(가정) 행사가 100인 미국형 풋의 한 관찰 시점입니다. 경로 열네 개가 이 시점에 서로 다른 주가에 와 있습니다. 한 경로만 보면 계속 보유한 가치를 알 수 없습니다." },
  { label: "다음 시점까지의 할인 가치", summary: "점 하나 = 한 경로의 (주가, 할인 가치)", note: "각 경로가 다음 시점까지 가서 얻은 값을 현재로 할인해 세로 위치에 찍습니다. 같은 주가 근처에서도 경로마다 값이 흩어집니다." },
  { label: "회귀로 계속 보유 가치를 추정", summary: "파란 곡선 = 주가의 함수로 맞춘 값", note: "흩어진 점들에 가장 가까운 곡선을 최소제곱으로 맞춥니다(여기서는 2차 곡선, 가정). 이 곡선이 '지금 주가가 이만할 때 계속 보유하면 기대되는 가치'의 추정입니다." },
  { label: "즉시 행사가치와 비교", summary: "주황 선이 위인 경로 → 지금 행사", note: "주황 선은 지금 행사하면 받는 값입니다. 주가가 낮아 주황 선이 파란 곡선보다 위인 경로는 이 시점에 행사하고, 나머지는 계속 보유합니다. 이렇게 경로마다 행사 시점이 정해집니다." },
] as const;

const W = 360;
const H = 210;
const LEFT = 30;
const RIGHT = 16;
const TOP = 14;
const BOTTOM = 172;
const S_MIN = 68;
const S_MAX = 120;
const x = (s: number) => LEFT + ((s - S_MIN) / (S_MAX - S_MIN)) * (W - LEFT - RIGHT);
const y = (v: number) => BOTTOM - (v / 32) * (BOTTOM - TOP);
const GRID_S = Array.from({ length: 53 }, (_, i) => S_MIN + i);
const FIT_LINE = GRID_S.map((s) => `${x(s)},${y(fit(s))}`).join(" ");
const EX_LINE = GRID_S.map((s) => `${x(s)},${y(exercise(s))}`).join(" ");

export default function LsmRegressionViz() {
  return (
    <SceneShell
      eyebrow="미국형 행사 판단"
      title="여러 경로를 한 곡선으로 묶어 계속 보유 가치를 추정합니다"
      description="가로는 한 관찰 시점의 주가, 세로는 가치입니다. 점의 위치와 곡선 모양은 원리를 보이기 위한 예시라 축 숫자를 적지 않았습니다(가정)."
      ariaLabel="최소제곱 몬테카를로에서 경로별 할인 가치를 주가로 회귀하고 즉시 행사가치와 비교하는 예시"
      scenes={SCENES}
      render={(active) => {
        const showValues = active >= 1;
        const showFit = active >= 2;
        const showExercise = active >= 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={LEFT} x2={W - RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <text x={W - RIGHT} y={BOTTOM + 18} textAnchor="end" fontSize={11} fill="#64748b">현재 주가 →</text>
            <text x={LEFT - 6} y={TOP + 4} textAnchor="end" fontSize={11} fill="#64748b">↑</text>
            <text x={LEFT + 6} y={TOP + 4} fontSize={11} fill="#64748b">가치</text>
            {showExercise && <polyline points={EX_LINE} fill="none" stroke="#d97706" strokeWidth={1.25} />}
            {showFit && <polyline points={FIT_LINE} fill="none" stroke="#2563eb" strokeWidth={1.25} />}
            {PATH_LIST.map(([s, v]) => {
              const exerciseNow = showExercise && exercise(s) > fit(s);
              return (
                <g key={s}>
                  {!showValues && <line x1={x(s)} x2={x(s)} y1={BOTTOM - 8} y2={BOTTOM} stroke="#334155" strokeWidth={1.25} />}
                  {showValues && (
                    <circle
                      cx={x(s)}
                      cy={y(v)}
                      r={4}
                      fill={exerciseNow ? "#d97706" : showExercise ? "#ffffff" : "#334155"}
                      stroke={exerciseNow ? "#d97706" : "#334155"}
                      strokeWidth={1}
                    />
                  )}
                </g>
              );
            })}
            {showFit && (
              <g>
                <line x1={W - RIGHT - 128} x2={W - RIGHT - 112} y1={TOP + 6} y2={TOP + 6} stroke="#2563eb" strokeWidth={1.25} />
                <text x={W - RIGHT - 106} y={TOP + 10} fontSize={11} fontWeight={700} fill="#2563eb">계속 보유 가치(추정)</text>
              </g>
            )}
            {showExercise && (
              <>
                <line x1={W - RIGHT - 128} x2={W - RIGHT - 112} y1={TOP + 24} y2={TOP + 24} stroke="#d97706" strokeWidth={1.25} />
                <text x={W - RIGHT - 106} y={TOP + 28} fontSize={11} fontWeight={700} fill="#d97706">즉시 행사가치</text>
                <text x={x(78)} y={BOTTOM - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">지금 행사</text>
                <text x={x(108)} y={y(12)} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">계속 보유</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
