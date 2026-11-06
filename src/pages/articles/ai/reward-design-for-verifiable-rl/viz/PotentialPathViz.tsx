import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — γ=1, potential 0→0.5→0.2→0이면 더해지는 값은 +0.5, −0.3, −0.2이고 합은 0입니다.
 * 방문마다 +0.5를 주면 순환만으로 합이 늘어납니다(세 번 방문은 그림을 위한 가정).
 */
const SCENES = [
  { label: "상태마다 보조값", summary: "Φ: 0 → 0.5 → 0.2 → 0", note: "potential Φ는 상태에 붙이는 보조값입니다. 경로의 네 상태에 0, 0.5, 0.2, 0을 붙였습니다 (가정)." },
  { label: "더하는 값은 변화량", summary: "+0.5, −0.3, −0.2", note: "γ=1이면 γΦ(s′)−Φ(s)는 다음 상태와 현재 상태의 차이입니다. 선분마다 그 변화량이 reward에 더해집니다." },
  { label: "경로를 따라 더하면", summary: "0.5 − 0.3 − 0.2 = 0", note: "중간 값이 앞뒤에서 지워져 처음과 끝의 potential만 남습니다. 둘 다 0이므로 더해진 값의 합도 0입니다." },
  { label: "방문마다 +0.5를 주면", summary: "0.5 → 1 → 1.5 … (세 번 방문, 가정)", note: "변화량이 아니라 방문에 점수를 주면 지워질 값이 없습니다. 목표에 가지 않고 순환만 해도 합계가 양수로 쌓입니다." },
] as const;

const W = 360;
const H = 186;
const L = 34;
const R = 14;
const T = 14;
const B = 30;
const MAX = 1.5;
const px = (step: number) => L + (step / 3) * (W - L - R);
const py = (value: number) => T + ((MAX - value) / MAX) * (H - T - B);

const PHI = [0, 0.5, 0.2, 0];
const VISIT = [0, 0.5, 1, 1.5];
const DELTAS = ["+0.5", "−0.3", "−0.2"];
const line = (values: readonly number[]) => values.map((value, step) => `${px(step)},${py(value)}`).join(" ");

export default function PotentialPathViz() {
  return (
    <SceneShell
      eyebrow="Reward shaping: 중간 점수 더하기"
      title="보조값의 변화를 더하면 중간이 지워지고, 방문 점수는 쌓입니다"
      description="가로는 경로의 단계입니다. 파란 선은 보조값 Φ인데, 시작값이 0이라 그때까지 더해진 변화량의 합과 같습니다. γ는 미래 점수를 깎는 할인율로, 여기서는 1로 둡니다 (가정)."
      note="같은 할인율과 적절한 종료 상태 조건을 둔 이론이며, 임의의 과정 점수까지 자동으로 보존하지 않습니다."
      ariaLabel="potential 변화량의 합과 방문 점수 합계 비교"
      scenes={SCENES}
      render={(active) => {
        const visits = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 0.5, 1, 1.5].map((tick) => (
              <g key={tick}>
                <line x1={L} x2={W - R} y1={py(tick)} y2={py(tick)} stroke="#94a3b8" strokeWidth={tick === 0 ? 1 : 0.5} strokeDasharray={tick === 0 ? undefined : "2 3"} />
                <text x={L - 6} y={py(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            {PHI.map((_, step) => (
              <text key={step} x={px(step)} y={H - 10} textAnchor="middle" fontSize={11} fill="#64748b">{step === 0 ? "시작" : `${step}단계`}</text>
            ))}
            <polyline points={line(PHI)} fill="none" stroke="#2563eb" strokeWidth={1.25} opacity={visits ? 0.5 : 1} />
            {PHI.map((value, step) => (
              <circle key={step} cx={px(step)} cy={py(value)} r={4} fill="#2563eb" opacity={visits ? 0.5 : 1} />
            ))}
            {active === 0 && PHI.map((value, step) => (
              <text key={step} x={px(step)} y={py(value) - 9} textAnchor={step === 0 ? "start" : step === 3 ? "end" : "middle"} fontSize={12} fontWeight={700} fill="#2563eb">{value}</text>
            ))}
            {(active === 1 || active === 2) && DELTAS.map((delta, step) => (
              <text key={delta} x={(px(step) + px(step + 1)) / 2} y={(py(PHI[step]) + py(PHI[step + 1])) / 2 - 9} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">{delta}</text>
            ))}
            {active === 2 && (
              <text x={px(3)} y={py(0) - 12} textAnchor="end" fontSize={12} fontWeight={700} fill="#16a34a">합 0</text>
            )}
            {visits && (
              <>
                <polyline points={line(VISIT)} fill="none" stroke="#d97706" strokeWidth={1.25} />
                {VISIT.map((value, step) => (
                  <rect key={step} x={px(step) - 4} y={py(value) - 4} width={8} height={8} fill="#d97706" />
                ))}
                {VISIT.slice(1).map((value, step) => (
                  <text key={value} x={px(step + 1) - 8} y={py(value) - 6} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">{value}</text>
                ))}
                <text x={px(3)} y={py(0.42)} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">변화량 합은 0</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
