import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kl-divergence — 폭=실제 비중 P, 높이=한 글자 비용, 넓이=평균 비용.
 * P의 비용 (1,2,2) → 넓이 0.5+0.5+0.5=1.5. Q의 비용 (2,2,1) → 1+0.5+0.25=1.75.
 * 차이: A +0.5, B 0, C −0.25 → 0.25 bit.
 */
const WEIGHTS: readonly number[] = [0.5, 0.25, 0.25];
const LETTERS = ["A", "B", "C"] as const;
const COST_P: readonly number[] = [1, 2, 2];
const COST_Q: readonly number[] = [2, 2, 1];

const SCENES = [
  { label: "P에 맞춘 비용", summary: "0.5 + 0.5 + 0.5 = 1.5 bit", note: "폭은 실제 비중 P로 고정합니다. 높이가 P에 맞춘 비용 1, 2, 2일 때 세 칸의 넓이를 합한 값이 엔트로피 H(P)입니다." },
  { label: "Q로 매긴 비용", summary: "1 + 0.5 + 0.25 = 1.75 bit", note: "폭은 그대로 두고 높이만 Q의 비용 2, 2, 1로 바꿉니다. 이 넓이의 합이 교차 엔트로피 H(P,Q)입니다." },
  { label: "늘고 준 넓이", summary: "+0.5 + 0 − 0.25 = 0.25 bit", note: "A 칸은 0.5 늘고 C 칸은 0.25 줄어듭니다. C처럼 음수인 글자가 있어도 P로 평균한 합은 0.25이며, 이 값이 D_KL(P‖Q)입니다." },
] as const;

const X0 = 40;
const WIDTH = 300;
const BASE = 168;
const UNIT = 58;

const xAt = (letter: number) => X0 + WIDTH * WEIGHTS.slice(0, letter).reduce<number>((sum, weight) => sum + weight, 0);
const widthAt = (letter: number) => WIDTH * WEIGHTS[letter];

export default function AreaLedgerViz() {
  return (
    <SceneShell
      eyebrow="넓이로 보는 평균 비용"
      title="폭을 고정하고 높이만 바꾸면 늘어난 넓이가 KL입니다"
      description="가로 폭은 글자가 실제로 나오는 비중, 세로 높이는 그 글자 하나의 비용(bit)입니다. 폭×높이인 넓이를 모두 더하면 평균 비용입니다."
      ariaLabel="실제 비중을 폭, 비용을 높이로 둔 넓이로 H(P), H(P,Q), KL 발산을 비교"
      scenes={SCENES}
      render={(active) => {
        const heights = active === 0 ? COST_P : COST_Q;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[1, 2].map((tick) => (
              <g key={tick}>
                <line x1={X0} x2={X0 + WIDTH} y1={BASE - tick * UNIT} y2={BASE - tick * UNIT} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 4" />
                <text x={X0 - 8} y={BASE - tick * UNIT + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            <text x={X0 - 8} y={BASE - 2 * UNIT - 14} textAnchor="end" fontSize={11} fill="#64748b">bit</text>
            {LETTERS.map((letter, index) => {
              const x = xAt(index);
              const w = widthAt(index);
              const area = WEIGHTS[index] * heights[index];
              if (active < 2) {
                return (
                  <g key={letter}>
                    <rect x={x + 1} y={BASE - heights[index] * UNIT} width={w - 2} height={heights[index] * UNIT} fill={active === 0 ? "#94a3b8" : "#2563eb"} fillOpacity={0.3} stroke={active === 0 ? "#64748b" : "#2563eb"} strokeWidth={1} />
                    <text x={x + w / 2} y={BASE - heights[index] * UNIT * 0.4 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={active === 0 ? "#64748b" : "#2563eb"}>{area}</text>
                  </g>
                );
              }
              const low = Math.min(COST_P[index], COST_Q[index]);
              const change = WEIGHTS[index] * (COST_Q[index] - COST_P[index]);
              const changeTop = Math.max(COST_P[index], COST_Q[index]);
              return (
                <g key={letter}>
                  <rect x={x + 1} y={BASE - low * UNIT} width={w - 2} height={low * UNIT} fill="#94a3b8" fillOpacity={0.25} stroke="#94a3b8" strokeWidth={1} />
                  {change !== 0 && (
                    <rect
                      x={x + 1}
                      y={BASE - changeTop * UNIT}
                      width={w - 2}
                      height={UNIT}
                      fill={change > 0 ? "#d97706" : "#16a34a"}
                      fillOpacity={change > 0 ? 0.45 : 0.15}
                      stroke={change > 0 ? "#d97706" : "#16a34a"}
                      strokeDasharray={change > 0 ? undefined : "4 3"}
                      strokeWidth={1}
                    />
                  )}
                  <text x={x + w / 2} y={change === 0 ? BASE - UNIT + 5 : BASE - (changeTop - 0.5) * UNIT + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={change > 0 ? "#b45309" : change < 0 ? "#15803d" : "#64748b"}>
                    {change > 0 ? `+${change}` : change < 0 ? `−${Math.abs(change)}` : "0"}
                  </text>
                </g>
              );
            })}
            <line x1={X0} x2={X0 + WIDTH} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {LETTERS.map((letter, index) => (
              <text key={letter} x={xAt(index) + widthAt(index) / 2} y={BASE + 17} textAnchor="middle" fontSize={13} fill="#64748b">{`${letter} · 폭 ${index === 0 ? "1/2" : "1/4"}`}</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
