import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — 3단위 0.63에서 멈춘 B를 따로 끝까지 실행하니 0.85, 채택 기준 0.80.
 * A: 1단위 0.60 → 3단위 0.65 → 9단위 0.70. B: 0.59 → 0.63 → (감사) 0.85. 모두 본문의 가정 점수.
 */
const A_POINTS: readonly (readonly [number, number])[] = [[1, 0.6], [3, 0.65], [9, 0.7]];
const B_POINTS: readonly (readonly [number, number])[] = [[1, 0.59], [3, 0.63]];
const B_AUDIT: readonly [number, number] = [9, 0.85];
const THRESHOLD = 0.8;

const SCENES = [
  { label: "3단위에서 비교", summary: "A 0.65 > B 0.63 → B 중단", note: "3단위에서 A·B·C 중 상위 1/3인 A만 계속합니다. B는 0.63에서 멈춥니다. (C는 그림에서 생략)" },
  { label: "A만 9단위까지", summary: "A 9단위 0.70", note: "A는 9단위까지 학습해 0.70이 됩니다. 정책만 따르면 B의 9단위 점수는 관측되지 않습니다." },
  { label: "B를 따로 끝까지 실행", summary: "B 0.85 ≥ 기준 0.80 → 놓친 후보", note: "따로 끝까지 실행한 B는 0.85로 최종 채택 기준 0.80을 통과합니다. 이 감사에서는 놓친 후보이며, 초기 순위만으로 최종 순위를 보장할 수 없다는 근거가 됩니다. (가정)" },
] as const;

const W = 360;
const H = 204;
const X0 = 46;
const X1 = 300;
const Y_TOP = 18;
const Y_BASE = 172;
const S_MIN = 0.5;
const S_MAX = 0.9;
const x = (unit: number) => X0 + (unit / 9) * (X1 - X0);
const y = (score: number) => Y_BASE - ((score - S_MIN) / (S_MAX - S_MIN)) * (Y_BASE - Y_TOP);
const path = (points: readonly (readonly [number, number])[]) =>
  points.map(([u, s], i) => `${i === 0 ? "M" : "L"} ${x(u)} ${y(s)}`).join(" ");

export default function LateBloomerViz() {
  return (
    <SceneShell
      eyebrow="늦게 좋아지는 후보"
      title="3단위에서 뒤진 B가 9단위에서는 기준을 넘습니다"
      description="가로는 학습한 자원 단위(1단위=1,000번 갱신), 세로는 점수(클수록 좋음)입니다. 점은 관측한 점수이고 선은 점을 이은 것일 뿐 그 사이 곡선 모양은 모릅니다."
      note="점수와 채택 기준 0.80은 본문 3·11절의 가정입니다."
      ariaLabel="A와 B의 1, 3, 9단위 점수와 채택 기준 0.80"
      scenes={SCENES}
      render={(active) => {
        const aPoints = active === 0 ? A_POINTS.slice(0, 2) : A_POINTS;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0.5, 0.6, 0.7, 0.8, 0.9].map((s) => (
              <g key={s}>
                <line x1={X0} x2={X1} y1={y(s)} y2={y(s)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={X0 - 6} y={y(s) + 4} textAnchor="end" fontSize={10} fill="#64748b">{s.toFixed(1)}</text>
              </g>
            ))}
            {[1, 3, 9].map((u) => (
              <text key={u} x={x(u)} y={Y_BASE + 16} textAnchor="middle" fontSize={10} fill="#64748b">{u}단위</text>
            ))}
            <line x1={X0} x2={X1} y1={Y_BASE} y2={Y_BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X1} y1={y(THRESHOLD)} y2={y(THRESHOLD)} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
            <text x={X1 + 4} y={y(THRESHOLD) + 4} fontSize={10} fill="#dc2626">기준 0.80</text>

            <path d={path(aPoints)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            {aPoints.map(([u, s]) => (
              <g key={`a${u}`}>
                <circle cx={x(u)} cy={y(s)} r={4} fill="#2563eb" />
                <text x={x(u)} y={y(s) - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">{s.toFixed(2)}</text>
              </g>
            ))}
            <text x={x(aPoints[aPoints.length - 1][0]) + 8} y={y(aPoints[aPoints.length - 1][1]) + 4} fontSize={11} fontWeight={700} fill="#2563eb">A</text>

            <path d={path(B_POINTS)} fill="none" stroke="#d97706" strokeWidth={1.25} />
            {B_POINTS.map(([u, s]) => (
              <g key={`b${u}`}>
                <rect x={x(u) - 4} y={y(s) - 4} width={8} height={8} fill="#d97706" />
                <text x={x(u)} y={y(s) + 17} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">{s.toFixed(2)}</text>
              </g>
            ))}
            {active < 2 && (
              <text x={x(3) + 18} y={y(0.63) + 17} fontSize={10} fontWeight={700} fill="#d97706">B 중단</text>
            )}
            {active === 2 && (
              <g>
                <path d={`M ${x(3)} ${y(0.63)} L ${x(B_AUDIT[0])} ${y(B_AUDIT[1])}`} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
                <rect x={x(B_AUDIT[0]) - 4} y={y(B_AUDIT[1]) - 4} width={8} height={8} fill="#d97706" />
                <text x={x(B_AUDIT[0])} y={y(B_AUDIT[1]) - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">0.85</text>
                <text x={x(B_AUDIT[0]) + 8} y={y(B_AUDIT[1]) + 4} fontSize={11} fontWeight={700} fill="#d97706">B (감사)</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
