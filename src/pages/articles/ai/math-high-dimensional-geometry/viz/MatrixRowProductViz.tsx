import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 점을 행으로 모은 X에 components_.T를 오른쪽에서 곱한다.
 * 4×4 입력과 설명용 행렬 [1/2,1/2,1/2,1/2]의 곱은 4×1의 [0,2,4,6]입니다. 무작위 생성기의 출력이 아닙니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const W = 340;
const H = 216;
const C = 30;
const Y0 = 28;
const XX = 18;
const PX = 172;
const OX = 248;
const OUT = [0, 2, 4, 6] as const;

const SCENES = [
  { label: "크기 맞추기", summary: "4×4 · 4×1 → 4×1", note: "점이 행이므로 X는 점 4개 × 칸 4개입니다. components_는 1×4이고 전치하면 4×1입니다. 가운데 4가 맞아 곱할 수 있고 결과는 점마다 숫자 하나입니다." },
  { label: "둘째 점의 행", summary: "1·½ ×4 = 2", note: "둘째 행 (1,1,1,1)의 칸마다 1/2을 곱해 더하면 2입니다. 한 행의 계산이 곧 한 점의 합을 2로 나누는 일입니다." },
  { label: "넷째 점의 행", summary: "3·½ ×4 = 6", note: "넷째 행 (3,3,3,3)에 같은 네 숫자를 곱해 더하면 6입니다. 모든 점에 같은 규칙을 적용합니다." },
  { label: "모든 행", summary: "[0, 2, 4, 6]", note: "출력 4×1은 앞에서 손으로 구한 0, 2, 4, 6입니다. 이 행렬은 직접 고른 사례이고, 무작위 생성기가 이 값을 뽑는다는 뜻이 아닙니다." },
] as const;

export default function MatrixRowProductViz() {
  return (
    <SceneShell
      eyebrow="실제 transform의 곱"
      title="점이 행이라 한 행의 곱이 한 점의 출력입니다"
      description="왼쪽이 네 점을 행으로 모은 X, 가운데가 전치한 행렬, 오른쪽이 출력입니다."
      note="네 점과 행렬은 본문에서 직접 고른 설명용 값입니다."
      ariaLabel="네 점의 행렬과 사영 행렬의 곱"
      scenes={SCENES}
      render={(active) => {
        const hot = active === 1 ? 1 : active === 2 ? 3 : null;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={XX + 2 * C} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>X (4×4)</text>
            <text x={PX + C / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>4×1</text>
            <text x={OX + C / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>4×1</text>
            {[0, 1, 2, 3].map((row) => (
              <g key={row}>
                {[0, 1, 2, 3].map((col) => (
                  <g key={col}>
                    <rect x={XX + col * C} y={Y0 + row * C} width={C - 2} height={C - 2} rx={2} fill={row === hot ? BLUE : "none"} fillOpacity={0.14} stroke={row === hot ? BLUE : "#94a3b8"} strokeWidth={1} />
                    <text x={XX + col * C + (C - 2) / 2} y={Y0 + row * C + 19} textAnchor="middle" fontSize={13} fontWeight={row === hot ? 700 : 400} fill={row === hot ? BLUE : GRAY}>{row}</text>
                  </g>
                ))}
                <rect x={PX} y={Y0 + row * C} width={C - 2} height={C - 2} rx={2} fill={hot !== null ? AMBER : "none"} fillOpacity={0.14} stroke={hot !== null ? AMBER : "#94a3b8"} strokeWidth={1} />
                <text x={PX + (C - 2) / 2} y={Y0 + row * C + 19} textAnchor="middle" fontSize={13} fontWeight={hot !== null ? 700 : 400} fill={hot !== null ? AMBER : GRAY}>½</text>
                {(active === 3 || row === hot) && (
                  <g>
                    <rect x={OX} y={Y0 + row * C} width={C - 2} height={C - 2} rx={2} fill={BLUE} fillOpacity={0.14} stroke={BLUE} strokeWidth={1} />
                    <text x={OX + (C - 2) / 2} y={Y0 + row * C + 19} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>{OUT[row]}</text>
                  </g>
                )}
                {active !== 3 && row !== hot && <rect x={OX} y={Y0 + row * C} width={C - 2} height={C - 2} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />}
              </g>
            ))}
            <text x={XX + 4 * C + 16} y={Y0 + 2 * C + 4} textAnchor="middle" fontSize={16} fontWeight={700} fill={GRAY}>×</text>
            <text x={PX + C + 20} y={Y0 + 2 * C + 4} textAnchor="middle" fontSize={16} fontWeight={700} fill={GRAY}>=</text>
            {active === 0 && <text x={W / 2} y={Y0 + 4 * C + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>점 4개 × 칸 4개 · 칸 4개 × 출력 1칸</text>}
            {hot !== null && <text x={W / 2} y={Y0 + 4 * C + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>{`${hot}·½ + ${hot}·½ + ${hot}·½ + ${hot}·½ = ${OUT[hot]}`}</text>}
            {active === 3 && <text x={W / 2} y={Y0 + 4 * C + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>각 행이 합을 2로 나눈 값</text>}
          </svg>
        );
      }}
    />
  );
}
