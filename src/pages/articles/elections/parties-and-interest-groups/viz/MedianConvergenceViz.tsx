import SceneShell from "./SceneShell";

/**
 * 본문 대응: #competition — 유권자 집단 아홉 개가 1~9번에 하나씩, 가운데는 5번.
 * 각 집단은 더 가까운 정당을 고르고, 거리가 같으면 반씩 나눈다고 둔다(가정).
 * (4,7) → 5:4, (4,6) → 4.5:4.5, (5,6) → 5:4. 옮긴 쪽이 매번 집단을 더 얻는다.
 */
const POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const SCENES = [
  { label: "4번과 7번에 있을 때", left: 4, right: 7, note: "1~5번 집단은 4번이 더 가깝고 6~9번 집단은 7번이 더 가깝습니다. 왼쪽 정당이 집단 5개, 오른쪽 정당이 집단 4개를 얻습니다.", summary: "왼쪽 5 : 오른쪽 4" },
  { label: "오른쪽이 7번 → 6번", left: 4, right: 6, note: "5번 집단은 4번과 6번까지 거리가 1로 같아 반씩 나눈다고 둡니다(가정). 오른쪽 정당이 얻는 집단은 4개에서 4.5개로 늘어납니다.", summary: "왼쪽 4.5 : 오른쪽 4.5" },
  { label: "왼쪽도 4번 → 5번", left: 5, right: 6, note: "상대도 같은 유혹을 받습니다. 왼쪽 정당이 가운데인 5번으로 오면 1~5번 집단을 가져가 4.5개에서 5개로 늘어납니다.", summary: "왼쪽 5 : 오른쪽 4" },
  { label: "둘 다 5번 쪽으로 밀린다", left: 5, right: 6, note: "계산이 보여 주는 것은 가운데로 가려는 힘까지입니다. 극단 지지자의 기권, 당내 선택, 한 축에 놓이지 않는 쟁점이 있으면 두 정당이 완전히 겹친다고 말할 수 없습니다.", summary: "가운데로 미는 힘" },
] as const;

const LEFT_COLOR = "#2563eb";
const RIGHT_COLOR = "#d97706";
const W = 360;
const H = 196;
const AXIS_Y = 112;
const px = (pos: number) => 28 + (pos - 1) * 38;

type Choice = "left" | "right" | "tie";

function choose(pos: number, left: number, right: number): Choice {
  const dl = Math.abs(pos - left);
  const dr = Math.abs(pos - right);
  if (dl === dr) return "tie";
  return dl < dr ? "left" : "right";
}

function Marker({ pos, prev, color, label, row }: { pos: number; prev: number | null; color: string; label: string; row: number }) {
  const y = 44 + row * 26;
  const x = px(pos);
  return (
    <g>
      {prev !== null && (
        <g>
          <path d={`M${px(prev) - 6} ${y - 5} L${px(prev) + 6} ${y - 5} L${px(prev)} ${y + 5} Z`} fill="none" stroke={color} strokeWidth={1} strokeDasharray="2 2" />
          <line x1={px(prev) + (x > px(prev) ? 9 : -9)} x2={x + (x > px(prev) ? -12 : 12)} y1={y} y2={y} stroke={color} strokeWidth={1} />
          <path d={x > px(prev) ? `M${x - 16} ${y - 4} L${x - 11} ${y} L${x - 16} ${y + 4}` : `M${x + 16} ${y - 4} L${x + 11} ${y} L${x + 16} ${y + 4}`} fill="none" stroke={color} strokeWidth={1.25} />
        </g>
      )}
      <path d={`M${x - 7} ${y - 6} L${x + 7} ${y - 6} L${x} ${y + 6} Z`} fill={color} />
      <text x={14} y={y + 4} fontSize={12} fontWeight={700} fill={color}>
        {label}
      </text>
      <line x1={x} x2={x} y1={y + 7} y2={AXIS_Y - 13} stroke={color} strokeWidth={1} strokeDasharray="2 3" />
    </g>
  );
}

export default function MedianConvergenceViz() {
  return (
    <SceneShell
      eyebrow="한 축 위의 두 정당"
      title="옮긴 쪽이 매번 집단을 더 얻어 둘 다 가운데로 밀립니다"
      description="원 하나가 유권자 집단 하나입니다. 집단 크기는 같고 각 집단은 더 가까운 정당을 고른다고 둡니다(가정). 가운데 유권자는 5번입니다."
      note="본문의 설명용 사례입니다. 실제 정당의 위치나 득표를 측정한 값이 아닙니다."
      ariaLabel="정책 축 1번부터 9번의 유권자 집단과 두 정당 위치에 따른 집단 수 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const counts = POSITIONS.reduce<{ left: number; right: number }>(
          (acc, pos) => {
            const c = choose(pos, scene.left, scene.right);
            if (c === "left") return { left: acc.left + 1, right: acc.right };
            if (c === "right") return { left: acc.left, right: acc.right + 1 };
            return { left: acc.left + 0.5, right: acc.right + 0.5 };
          },
          { left: 0, right: 0 },
        );
        const prevLeft = active === 2 || active === 3 ? 4 : null;
        const prevRight = active === 1 || active === 3 ? 7 : null;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Marker pos={scene.left} prev={prevLeft} color={LEFT_COLOR} label="왼쪽 정당" row={0} />
            <Marker pos={scene.right} prev={prevRight} color={RIGHT_COLOR} label="오른쪽 정당" row={1} />
            <text x={px(5)} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f766e">
              가운데 유권자 ↓
            </text>
            <line x1={14} x2={W - 14} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {POSITIONS.map((pos) => {
              const c = choose(pos, scene.left, scene.right);
              const x = px(pos);
              const color = c === "left" ? LEFT_COLOR : c === "right" ? RIGHT_COLOR : "#64748b";
              return (
                <g key={pos}>
                  {c === "tie" ? (
                    <g>
                      <path d={`M${x} ${AXIS_Y - 11} A11 11 0 0 0 ${x} ${AXIS_Y + 11} Z`} fill={LEFT_COLOR} opacity={0.22} />
                      <path d={`M${x} ${AXIS_Y - 11} A11 11 0 0 1 ${x} ${AXIS_Y + 11} Z`} fill={RIGHT_COLOR} opacity={0.22} />
                      <circle cx={x} cy={AXIS_Y} r={11} fill="none" stroke="#64748b" strokeWidth={1.25} />
                    </g>
                  ) : (
                    <circle cx={x} cy={AXIS_Y} r={11} fill={color} fillOpacity={0.16} stroke={color} strokeWidth={1.25} />
                  )}
                  <text x={x} y={AXIS_Y + 4} textAnchor="middle" fontSize={12} fontWeight={pos === 5 ? 800 : 600} fill="#64748b">
                    {pos}
                  </text>
                  <text x={x} y={AXIS_Y + 28} textAnchor="middle" fontSize={12} fill={color}>
                    {c === "left" ? "왼" : c === "right" ? "오" : "반반"}
                  </text>
                </g>
              );
            })}
            <text x={14} y={H - 30} fontSize={12} fontWeight={700} fill={LEFT_COLOR}>
              왼쪽 정당 · 집단 {counts.left}개
            </text>
            <text x={W - 14} y={H - 30} textAnchor="end" fontSize={12} fontWeight={700} fill={RIGHT_COLOR}>
              오른쪽 정당 · 집단 {counts.right}개
            </text>
            <rect x={14} y={H - 20} width={(counts.left / 9) * (W - 28)} height={10} fill={LEFT_COLOR} opacity={0.7} />
            <rect x={14 + (counts.left / 9) * (W - 28)} y={H - 20} width={(counts.right / 9) * (W - 28)} height={10} fill={RIGHT_COLOR} opacity={0.7} />
          </svg>
        );
      }}
    />
  );
}
