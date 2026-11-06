import SceneShell from "./SceneShell";

/**
 * 본문 대응: #regression-gate — 짝차이 2,3,2,3,2 → 평균 2.4, 표본분산 0.3,
 * 표준오차 √0.06 ≈ 0.24495, 2.776445×0.24495 ≈ 0.68 → [1.72, 3.08]. 허용 악화 3 ms.
 */
const W = 340;
const H = 118;
const LEFT = 14;
const RIGHT = 326;
const AXIS_Y = 92;
const MAX = 4;
const x = (ms: number) => LEFT + (ms / MAX) * (RIGHT - LEFT);

const BASE = [98, 100, 102, 99, 101];
const AFTER = [100, 103, 104, 102, 103];
const DOTS = [
  { ms: 2, level: 0 },
  { ms: 2, level: 1 },
  { ms: 2, level: 2 },
  { ms: 3, level: 0 },
  { ms: 3, level: 1 },
];

const SCENES = [
  { label: "짝차이 다섯 개", summary: "2 · 3 · 2 · 3 · 2 ms", note: "(가정) 같은 조건끼리 짝지어 변경 후에서 기준을 뺍니다. 축의 점 하나가 한 조건의 차이입니다." },
  { label: "평균", summary: "12 ÷ 5 = 2.4 ms", note: "다섯 차이의 평균은 2.4 ms입니다. 다섯 값은 개별 요청의 꼬리 지연 표본이 아니라 평균 완료시간의 차이입니다." },
  { label: "95% 구간", summary: "2.4 ± 0.68 → 1.72–3.08 ms", note: "차이들의 퍼짐으로 평균 차이의 불확실성을 구합니다. 독립인 정규 분포의 짝차이를 가정합니다. 평균 차이가 흔들리는 크기(표준오차) 0.24495에 95%용 배수(t값) 2.776445를 곱한 폭이 약 0.68입니다." },
  { label: "0과 비교", summary: "하한 1.72 > 0", note: "구간 전체가 0보다 오른쪽에 있으니 악화가 있다는 근거입니다. 다음 장면의 허용 범위 판정과는 다른 판정입니다." },
  { label: "허용선 3 ms와 비교", summary: "상한 3.08 > 3", note: "허용 악화를 3 ms로 미리 정했다면 평균 2.4는 선 안쪽이어도 상한이 선을 넘습니다. 이 자료만으로는 3 ms 이내라고 확인할 수 없습니다." },
] as const;

export default function RegressionIntervalViz() {
  return (
    <SceneShell
      eyebrow="평균과 구간"
      title="평균이 허용선 안쪽이어도 구간이 선을 넘으면 통과라고 할 수 없습니다"
      description="가로축은 변경 후 평균 완료시간에서 기준을 뺀 차이(ms)입니다. 오른쪽일수록 더 나빠졌습니다."
      ariaLabel="짝차이 다섯 개, 평균 2.4, 95퍼센트 구간 1.72에서 3.08, 허용선 3"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <table className="w-full table-fixed border-collapse text-center font-mono text-xs">
            <tbody>
              <tr>
                <th scope="row" className="w-16 py-0.5 text-left font-normal text-muted-foreground">기준</th>
                {BASE.map((value, index) => <td key={index}>{value}</td>)}
              </tr>
              <tr>
                <th scope="row" className="py-0.5 text-left font-normal text-muted-foreground">변경 후</th>
                {AFTER.map((value, index) => <td key={index}>{value}</td>)}
              </tr>
              <tr className="border-t border-border">
                <th scope="row" className="py-0.5 text-left font-bold">차이</th>
                {AFTER.map((value, index) => <td key={index} className="font-bold text-[#2563eb] dark:text-[#93c5fd]">{value - BASE[index]}</td>)}
              </tr>
            </tbody>
          </table>
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-2 h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 1, 2, 3, 4].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(tick)} y={AXIS_Y + 18} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            {active === 3 && (
              <g>
                <line x1={x(0)} x2={x(0)} y1={6} y2={AXIS_Y} stroke="#16a34a" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={x(0) + 5} y={14} fontSize={12} fontWeight={700} fill="#16a34a">차이 0</text>
              </g>
            )}
            {active === 4 && (
              <g>
                <line x1={x(3)} x2={x(3)} y1={6} y2={AXIS_Y} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={x(3) + 5} y={14} fontSize={12} fontWeight={700} fill="#dc2626">허용 3 ms</text>
              </g>
            )}
            {DOTS.map((dot, index) => (
              <circle key={index} cx={x(dot.ms)} cy={AXIS_Y - 7 - dot.level * 11} r={4} fill="#64748b" opacity={active === 0 ? 1 : 0.35} />
            ))}
            {active >= 2 && (
              <g>
                <rect x={x(1.72)} y={AXIS_Y - 54} width={x(3.08) - x(1.72)} height={8} fill="#2563eb" opacity={0.3} />
                <line x1={x(1.72)} x2={x(3.08)} y1={AXIS_Y - 50} y2={AXIS_Y - 50} stroke="#2563eb" strokeWidth={1.25} />
                <text x={x(1.72)} y={AXIS_Y - 58} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">1.72</text>
                <text x={x(3.08)} y={AXIS_Y - 58} fontSize={12} fontWeight={700} fill="#2563eb">3.08</text>
              </g>
            )}
            {active >= 1 && (
              <g>
                <line x1={x(2.4)} x2={x(2.4)} y1={AXIS_Y - 58} y2={AXIS_Y} stroke="#2563eb" strokeWidth={1.25} />
                <text x={x(2.4)} y={AXIS_Y - 62} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">평균 2.4</text>
              </g>
            )}
          </svg>
        </div>
      )}
    />
  );
}
