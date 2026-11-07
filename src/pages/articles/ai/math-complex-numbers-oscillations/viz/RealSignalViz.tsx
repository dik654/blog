import SceneShell from "./SceneShell";
import { Plane, TipToTail } from "./Plane";

/**
 * 본문 대응: #applications — 가로만 기록한 3,−4,−3,4. X₁=6+8i, X₃=6−8i, X₀=X₂=0.
 * 각 크기 10, 실수 코사인 진폭은 2×10/4=5.
 */
type Term = readonly [number, number];
const SAMPLES = [3, -4, -3, 4] as const;
const X1: readonly Term[] = [[3, 0], [0, 4], [3, 0], [0, 4]];
const X3: readonly Term[] = [[3, 0], [0, -4], [3, 0], [0, -4]];
const COLORS: readonly string[] = ["#2563eb", "#d97706", "#16a34a", "#dc2626"];

const SCENES = [
  { label: "가로만 기록합니다", summary: "3, −4, −3, 4", note: "회전하는 점의 가로 좌표만 남긴 실수 신호입니다. 표본 순서대로 왼쪽에 세웠습니다." },
  { label: "X₁", summary: "X₁ = 6 + 8i · 크기 10", note: "같은 변환을 적용하면 네 항의 끝점이 6+8i입니다. 크기는 10이고, 앞에서 본 복소 사례의 20과 다릅니다." },
  { label: "X₃", summary: "X₃ = 6 − 8i · 크기 10", note: "또 하나의 성분이 나타납니다. 세로 부호만 다른 짝입니다. X₀과 X₂는 0입니다." },
  { label: "두 짝에서 진폭 읽기", summary: "2 × 10 ÷ 4 = 5", note: "이 경우 진폭은 2×10/4=5로 출발점의 길이와 같습니다. 0번 성분이나 짝수 표본 수의 정중앙 성분은 이런 서로 다른 짝이 없어 같은 2배 규칙을 그대로 쓰지 않습니다." },
] as const;

export default function RealSignalViz() {
  return (
    <SceneShell
      eyebrow="실수 신호"
      title="가로만 남기면 크기가 두 성분으로 나뉩니다"
      description="왼쪽은 네 표본의 가로 값, 오른쪽은 변환 항을 머리와 꼬리로 이은 경로입니다. 끝점이 계수입니다. 색은 n=0, 1, 2, 3 순서입니다."
      ariaLabel="실수 신호의 두 성분과 진폭 계산"
      scenes={SCENES}
      render={(active) => (
        <Plane
          width={350}
          height={220}
          originX={160}
          originY={110}
          unit={11}
          xTicks={[3, 6]}
          yTicks={[-8, -4, 4, 8]}
          xLabel=""
          yLabel=""
          ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}
          render={(m) => (
            <g>
              {SAMPLES.map((value, n) => {
                const x = 16 + n * 26;
                return (
                  <g key={n}>
                    <line x1={x} x2={x} y1={110} y2={110 - value * 11} stroke={COLORS[n]} strokeWidth={1.25} />
                    <circle cx={x} cy={110 - value * 11} r={3.5} fill={COLORS[n]} />
                    <text x={x} y={110 - value * 11 + (value > 0 ? -7 : 16)} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS[n]}>{value < 0 ? `−${-value}` : value}</text>
                  </g>
                );
              })}
              <line x1={6} x2={112} y1={110} y2={110} stroke="#94a3b8" strokeWidth={1} />
              {(active === 1 || active === 3) && <TipToTail map={m} terms={X1} colors={COLORS} />}
              {(active === 2 || active === 3) && <TipToTail map={m} terms={X3} colors={COLORS} />}
              {(active === 1 || active === 3) && <text x={m.x(6) + 6} y={m.y(8) + 4} fontSize={12} fontWeight={700} fill="#64748b">6+8i</text>}
              {(active === 2 || active === 3) && <text x={m.x(6) + 6} y={m.y(-8) + 4} fontSize={12} fontWeight={700} fill="#64748b">6−8i</text>}
            </g>
          )}
        />
      )}
    />
  );
}
