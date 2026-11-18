import SceneShell from "./SceneShell";

/**
 * 본문 대응: #engine — SYNCING이면 optimistic 표시를 붙인 후보로 보존, VALID면 표시를 풀고, INVALID면 관련 branch를 제거.
 * B353은 B352 위에 이어진 block을 보이려는 가정이다. B353의 payload는 B352 위에서 실행되므로 B352가 판정 전이면
 * B353도 optimistic(점선)이다. B352의 VALID는 B353 자신의 판정을 대신하지 않으므로 VALID 장면에서도 점선으로 둔다.
 */
const W = 360;
const H = 168;
const NODE_W = 84;
const NODE_H = 30;
const ROW_Y = 62;
const XS = [12, 138, 264] as const;

const SCENES = [
  {
    label: "SYNCING",
    summary: "판정 남음 → optimistic 후보",
    note: "SYNCING은 ‘유효하다’가 아니라 execution client가 아직 판정을 끝내지 못했다는 뜻입니다. Consensus transition과 data availability가 통과했다면 B352는 버려지지 않고 optimistic 표시가 붙은 후보로 남습니다. 이 상태를 finalized execution처럼 사용자에게 내보내면 안 됩니다.",
  },
  {
    label: "나중에 VALID",
    summary: "optimistic 표시를 풂",
    note: "Execution client가 나중에 VALID를 돌려주면 B352에 붙어 있던 optimistic 표시를 풉니다. 그래도 head나 finalized block이 되는지는 fork choice와 finality가 따로 정합니다.",
  },
  {
    label: "나중에 INVALID",
    summary: "관련 branch를 제거",
    note: "INVALID는 execution 규칙 위반이 확인됐다는 뜻입니다. 이때는 B352와, 그 위에 이어진 block(B353, 가정)을 포함한 관련 branch를 제거합니다. 일시적인 동기화 지연(SYNCING)과 규칙 위반(INVALID)을 같은 장애로 다루지 않는 이유가 이 차이입니다.",
  },
] as const;

export default function EngineVerdictViz() {
  return (
    <SceneShell
      eyebrow="Engine 응답 · B352"
      title="SYNCING은 보류 표시이고, 나중에 오는 VALID와 INVALID가 B352의 운명을 가릅니다"
      description="상자 하나가 block, 점선 테두리가 optimistic 표시입니다. Consensus transition과 data availability는 이미 통과했다고 둡니다. B353은 B352 위에 이어진 block을 보이려는 가정입니다."
      ariaLabel="Engine 응답 SYNCING, VALID, INVALID에 따라 B352 후보가 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const removed = active === 2;
        const b352Stroke = active === 0 ? "#d97706" : active === 1 ? "#16a34a" : "#dc2626";
        const tag = active === 0 ? "optimistic" : active === 1 ? "VALID" : "INVALID · 제거";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={12} y={22} fontSize={10} fill="#64748b">
              Engine 응답
            </text>
            <text x={84} y={22} fontSize={12} fontWeight={700} fill={b352Stroke}>
              {active === 0 ? "SYNCING" : active === 1 ? "VALID" : "INVALID"}
            </text>
            <line x1={XS[0] + NODE_W} x2={XS[1]} y1={ROW_Y + NODE_H / 2} y2={ROW_Y + NODE_H / 2} stroke={removed ? "#dc2626" : "#94a3b8"} strokeWidth={1} strokeDasharray={removed ? "3 3" : undefined} />
            <line x1={XS[1] + NODE_W} x2={XS[2]} y1={ROW_Y + NODE_H / 2} y2={ROW_Y + NODE_H / 2} stroke={removed ? "#dc2626" : "#94a3b8"} strokeWidth={1} strokeDasharray={removed ? "3 3" : undefined} />
            <rect x={XS[0]} y={ROW_Y} width={NODE_W} height={NODE_H} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={XS[0] + NODE_W / 2} y={ROW_Y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">
              B351
            </text>
            <rect x={XS[1]} y={ROW_Y} width={NODE_W} height={NODE_H} rx={6} fill="none" stroke={b352Stroke} strokeWidth={1.25} strokeDasharray={active === 0 ? "4 3" : undefined} opacity={removed ? 0.6 : 1} />
            <text x={XS[1] + NODE_W / 2} y={ROW_Y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill={removed ? "#dc2626" : "#475569"} textDecoration={removed ? "line-through" : undefined}>
              B352
            </text>
            <text x={XS[1] + NODE_W / 2} y={ROW_Y + NODE_H + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill={b352Stroke}>
              {tag}
            </text>
            <rect x={XS[2]} y={ROW_Y} width={NODE_W} height={NODE_H} rx={6} fill="none" stroke={removed ? "#dc2626" : "#94a3b8"} strokeWidth={1} strokeDasharray={removed ? undefined : "4 3"} opacity={removed ? 0.6 : 1} />
            <text x={XS[2] + NODE_W / 2} y={ROW_Y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill={removed ? "#dc2626" : "#475569"} textDecoration={removed ? "line-through" : undefined}>
              B353(가정)
            </text>
            {removed && (
              <text x={XS[2] + NODE_W / 2} y={ROW_Y + NODE_H + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">
                함께 제거
              </text>
            )}
            <text x={12} y={H - 10} fontSize={10.5} fill="#64748b">
              {active === 0 ? "점선 = 실행 판정이 남은 후보" : active === 1 ? "B352의 optimistic 표시가 풀림" : "B351은 그대로 남음"}
            </text>
          </svg>
        );
      }}
    />
  );
}
