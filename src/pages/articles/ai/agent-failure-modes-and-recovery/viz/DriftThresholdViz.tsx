import SceneShell from "./SceneShell";

/**
 * 본문 대응: #side-effect-control 펼침 — 학습용 가정 n=8, d_i=0.05, τ=0.3.
 * D_n = 0.05n → 6단계 0.30(같음, 엄격한 부등호라 미성립), 7단계 0.35부터 D_n > τ. 8단계 0.40.
 */
const STEPS = 8;
const D = 0.05;
const TAU = 0.3;
const W = 360;
const H = 200;
const LEFT = 34;
const RIGHT = 8;
const BASE = 170;
const TOP = 22;
const MAX = 0.4;
const SLOT = (W - LEFT - RIGHT) / STEPS;
const yOf = (value: number) => BASE - (value / MAX) * (BASE - TOP);

const ACCENT = "#2563eb";
const RED = "#dc2626";
const WARN = "#d97706";
const LINE = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "1단계", n: 1, summary: "D₁ = 0.05", note: "d는 한 결정이 직전에 승인된 하위 목표에서 벗어난 정도입니다. 칸 하나가 d=0.05이고 단독으로는 작습니다. 상쇄 없이 그대로 더한다고 가정합니다." },
  { label: "6단계", n: 6, summary: "D₆ = 0.30 = τ", note: "누적값 D가 허용 임계값 τ=0.3과 정확히 같습니다. 판정은 D > τ이므로 아직 실패가 아닙니다." },
  { label: "7단계", n: 7, summary: "D₇ = 0.35 > τ", note: "같은 크기의 칸을 하나 더 쌓았을 뿐인데 0.35가 되어 처음으로 임계값을 넘습니다. 7단계 하나를 원인으로 지목하는 식은 아닙니다." },
  { label: "8단계", n: 8, summary: "D₈ = 0.40", note: "재승인 없이 계속 커집니다. 이 숫자는 학습용 가정이며 실제 agent 오류를 측정한 값이 아닙니다. 단위·측정법·상쇄 여부·임계값이 정해지지 않으면 단계 수만으로 실패를 판정할 수 없습니다." },
] as const;

export default function DriftThresholdViz() {
  return (
    <SceneShell
      eyebrow="학습용 누적 모델"
      title="한 칸은 작아도 쌓인 합은 임계값을 넘을 수 있습니다"
      description="막대 하나가 그 단계까지의 누적 이탈량 D입니다. 8단계, 단계마다 d=0.05, 허용 임계값 τ=0.3은 모두 학습용 가정이며 실제 실패율이 아닙니다."
      ariaLabel="단계별 이탈 0.05가 쌓여 6단계에서 임계값 0.3과 같아지고 7단계에서 넘는 과정"
      scenes={SCENES}
      render={(active) => {
        const current = SCENES[active].n;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: STEPS }, (_, index) => {
              const step = index + 1;
              const x = LEFT + index * SLOT + 5;
              const barWidth = SLOT - 10;
              const reached = step <= current;
              return (
                <g key={step}>
                  {reached
                    ? Array.from({ length: step }, (_, cell) => {
                        const above = (cell + 1) * D > TAU + 1e-9;
                        return (
                          <rect
                            key={cell}
                            x={x}
                            y={yOf((cell + 1) * D)}
                            width={barWidth}
                            height={yOf(cell * D) - yOf((cell + 1) * D) - 1}
                            fill={above ? RED : step === current ? ACCENT : LINE}
                          />
                        );
                      })
                    : <rect x={x} y={yOf(step * D)} width={barWidth} height={BASE - yOf(step * D)} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />}
                  <text x={x + barWidth / 2} y={BASE + 16} textAnchor="middle" fontSize={12} fontWeight={step === current ? 700 : 400} fill={TEXT}>{step}</text>
                  {step === current && (
                    <text x={x + barWidth / 2} y={yOf(step * D) - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={step * D > TAU + 1e-9 ? RED : ACCENT}>
                      {(step * D).toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}
            <line x1={LEFT} x2={W - RIGHT} y1={yOf(TAU)} y2={yOf(TAU)} stroke={WARN} strokeWidth={1.25} strokeDasharray="5 3" />
            <text x={LEFT - 4} y={yOf(TAU) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={WARN}>τ 0.3</text>
            <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke={LINE} strokeWidth={1} />
            <text x={LEFT - 4} y={BASE + 16} textAnchor="end" fontSize={12} fill={TEXT}>단계</text>
          </svg>
        );
      }}
    />
  );
}
