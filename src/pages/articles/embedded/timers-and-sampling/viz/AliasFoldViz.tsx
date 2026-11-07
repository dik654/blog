import SceneShell from "./SceneShell";

/**
 * 본문 대응: #alias, #rate — 100 Hz 눈금의 절반 경계 50 Hz와 |100 − 70| = 30.
 * 50에서 70까지 +20, 50에서 30까지 −20이므로 경계에서 접은 자리처럼 읽힌다.
 */
const W = 360;
const H = 136;
const AXIS_Y = 96;
const x = (hz: number) => 20 + (hz / 100) * 320;
const LOW = "#2563eb";
const HIGH = "#d97706";
const MUTED = "#64748b";
const TICKS = [0, 30, 50, 70, 100];

const SCENES = [
  { label: "눈금이 정하는 경계", summary: "100 ÷ 2 = 50 Hz", note: "10 ms마다 읽으면 샘플 빈도는 100 Hz, 절반 경계는 50 Hz입니다. 이상적인 복원 조건은 입력의 가장 높은 주파수가 이 경계보다 낮을 것을 요구합니다." },
  { label: "30 Hz는 경계 아래", summary: "100 > 2 × 30 성립", note: "60보다 100이 크므로 조건을 만족합니다. 30 Hz는 색칠한 구간 안에 있습니다." },
  { label: "70 Hz는 경계 위", summary: "100 > 2 × 70 불성립", note: "140보다 100이 작으므로 조건을 만족하지 못합니다. 70 Hz는 색칠한 구간 밖입니다." },
  { label: "경계에서 접힌 자리", summary: "|100 − 70| = 30 Hz", note: "70 Hz는 경계 위로 20, 30 Hz는 경계 아래로 20 떨어져 있습니다. 그래서 70 Hz가 30 Hz와 같은 샘플을 남깁니다." },
] as const;

export default function AliasFoldViz() {
  return (
    <SceneShell
      eyebrow="절반 경계"
      title="70 Hz가 50 Hz 경계에서 접혀 30 Hz 자리에 놓입니다"
      description="가로축은 1초에 반복하는 횟수(Hz)입니다. 색칠한 구간이 100 Hz 샘플에서 절반 경계 아래입니다."
      note="등간격 100 Hz의 이상적인 점 샘플과 순수한 코사인을 가정한 이 두 성분의 계산입니다. 임의의 높은 주파수에서 100을 한 번만 빼면 항상 0–50 Hz에 들어온다는 뜻은 아닙니다."
      ariaLabel="주파수 축 위에서 70 헤르츠가 50 헤르츠 경계를 기준으로 30 헤르츠 자리에 접히는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showLow = active === 1 || active === 3;
        const showHigh = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={x(0)} y={AXIS_Y - 16} width={x(50) - x(0)} height={16} fill={LOW} opacity={0.14} />
            <line x1={x(0)} x2={x(100)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            <line x1={x(50)} x2={x(50)} y1={AXIS_Y - 58} y2={AXIS_Y + 6} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(50)} y={AXIS_Y - 62} textAnchor="middle" fontSize={11} fontWeight={700} fill={MUTED}>절반 경계 50 Hz</text>
            {TICKS.map((hz) => (
              <g key={hz}>
                <line x1={x(hz)} x2={x(hz)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(hz)} y={AXIS_Y + 17} textAnchor="middle" fontSize={11} fill={MUTED}>{hz}</text>
              </g>
            ))}
            {showLow && <circle cx={x(30)} cy={AXIS_Y} r={5.5} fill={LOW} />}
            {showHigh && <circle cx={x(70)} cy={AXIS_Y} r={5.5} fill={active === 3 ? "#ffffff" : HIGH} stroke={HIGH} strokeWidth={1.25} />}
            {active === 1 && <text x={x(30)} y={AXIS_Y - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={LOW}>30 Hz</text>}
            {active === 2 && <text x={x(70)} y={AXIS_Y - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={HIGH}>70 Hz</text>}
            {active === 3 && (
              <>
                <path d={`M${x(70)} ${AXIS_Y - 8} Q${x(50)} ${AXIS_Y - 64} ${x(30)} ${AXIS_Y - 8}`} fill="none" stroke={HIGH} strokeWidth={1.25} />
                <path d={`M${x(30) + 1} ${AXIS_Y - 17} L${x(30)} ${AXIS_Y - 8} L${x(30) + 9} ${AXIS_Y - 10}`} fill="none" stroke={HIGH} strokeWidth={1.25} />
                <text x={(x(30) + x(50)) / 2} y={AXIS_Y + 32} textAnchor="middle" fontSize={11} fontWeight={700} fill={LOW}>경계 − 20</text>
                <text x={(x(50) + x(70)) / 2} y={AXIS_Y + 32} textAnchor="middle" fontSize={11} fontWeight={700} fill={HIGH}>경계 + 20</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
