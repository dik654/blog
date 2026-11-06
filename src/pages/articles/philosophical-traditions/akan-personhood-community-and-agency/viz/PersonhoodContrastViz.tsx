import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — Stanford 철학백과 항목이 정리한 위레두와 기에케의 대비.
 * 위레두: 사람됨을 성취를 통해 정도에 따라 이루어 감. 기에케: 인간은 나이·지위와 무관하게 사람, 공동체 속 실현은 있어도 새로 획득 아님.
 * 글에 수치가 없어 단계 수와 높이는 모양만 보이는 가정입니다.
 */
const SCENES = [
  { label: "콰시 위레두", summary: "사람됨을 정도에 따라 이루어 감", note: "개인의 성취를 통해 사람됨이 정도에 따라 이루어집니다. 칸이 쌓이는 모양이 이 ‘정도’입니다. 칸 수는 가정입니다." },
  { label: "콰메 기에케", summary: "처음부터 사람, 실현은 공동체 속에서", note: "인간은 나이나 사회적 지위와 무관하게 사람입니다. 사람됨이 공동체 속에서 온전히 실현될 수는 있어도, 살아가며 새로 획득하는 것은 아닙니다." },
  { label: "무엇이 다른가", summary: "쌓이는가, 실현되는가", note: "살아가며 달라지는 것이 위쪽은 사람됨 자체, 아래쪽은 그 실현입니다. 기본 대우나 권리의 양을 그린 것은 아니며, 연구자마다 인격의 정도를 다르게 설명합니다." },
] as const;

const W = 340;
const COL_X = [6, 116, 226] as const;
const COL_W = 108;
const CELL_H = 16;
const STEP = 19;
const BLUE = "#2563eb";
const AMBER = "#b45309";
const MUTED = "#64748b";
const IDLE = "#94a3b8";

export default function PersonhoodContrastViz() {
  return (
    <SceneShell
      eyebrow="두 해석"
      title="같은 삶을 두고, 사람됨이 쌓이는가 이미 있는 사람됨이 실현되는가"
      description="두 현대 아칸 철학자의 대비입니다. 왼쪽에서 오른쪽으로 한 사람의 삶이 흐릅니다. 칸 수와 높이는 수치가 아니라 모양만 보이는 가정입니다."
      ariaLabel="위레두의 정도에 따라 쌓이는 사람됨과 기에케의 처음부터 있는 사람 지위와 그 실현 대비"
      scenes={SCENES}
      render={(active) => {
        const upper = active === 1 ? 0.3 : 1;
        const lower = active === 0 ? 0.3 : 1;
        return (
          <svg viewBox={`0 0 ${W} 216`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={upper}>
              <text x={6} y={14} fontSize={13} fontWeight={700} fill={BLUE}>위레두: 사람됨이 정도에 따라</text>
              {COL_X.map((x, column) =>
                Array.from({ length: column + 1 }, (_, level) => (
                  <rect key={`${x}-${level}`} x={x} y={78 - level * STEP - CELL_H + 2} width={COL_W} height={CELL_H} rx={2} fill={BLUE} />
                )),
              )}
            </g>
            <g opacity={lower}>
              <text x={6} y={108} fontSize={13} fontWeight={700} fill={AMBER}>기에케: 처음부터 사람, 실현은 공동체 속에서</text>
              <rect x={COL_X[0]} y={141} width={COL_X[2] + COL_W - COL_X[0]} height={34} rx={3} fill={AMBER} />
              <text x={W / 2} y={163} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">사람 (나이·지위와 무관)</text>
              <path d={`M${COL_X[0]} 139 V${139 - 6} H${COL_X[1]} V${139 - 13} H${COL_X[2]} V${139 - 20} H${COL_X[2] + COL_W} V139 Z`} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
              <text x={COL_X[2] + COL_W / 2} y={134} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>공동체 속 실현</text>
            </g>
            <line x1={6} x2={W - 12} y1={188} y2={188} stroke={IDLE} strokeWidth={1} />
            <path d={`M${W - 12} 183 L${W - 4} 188 L${W - 12} 193 Z`} fill={IDLE} />
            <text x={6} y={207} fontSize={12} fill={MUTED}>태어남</text>
            <text x={W - 4} y={207} textAnchor="end" fontSize={12} fill={MUTED}>살아가며</text>
          </svg>
        );
      }}
    />
  );
}
