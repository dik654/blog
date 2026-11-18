import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 공통 조상 102 다음에서 old 103~105와 new 103′~105′가 갈라진다.
 * 위 줄 = 이전 canonical(old), 아래 줄 = 새 canonical. A·B 표시는 각 extension이 저장한 처리 위치.
 * 높이 번호가 같아도 branch가 다르므로 위치는 (block number, block hash)로 본다.
 */
const SCENES = [
  {
    label: "두 갈래",
    summary: "공통 조상 102",
    note: "102 다음에서 chain이 두 갈래로 나뉩니다. 위 줄의 103·104·105와 아래 줄의 103′·104′·105′는 높이 번호가 같지만 서로 다른 block이고, 이제 아래 줄이 canonical입니다.",
  },
  {
    label: "시작 위치",
    summary: "A = old 105 · B = 102",
    note: "A는 old branch의 105까지 파생 인덱스에 반영했고, B는 102에 머물러 있습니다. A가 높이 105만 저장했다면 위 줄의 105인지 아래 줄의 105′인지 가릴 수 없으므로 위치를 (block number, block hash)로 저장합니다.",
  },
  {
    label: "A 되돌림",
    summary: "105 → 104 → 103 취소 · head 102",
    note: "A는 old 103~105에서 만든 행을 tip에서 공통 조상 쪽으로, 105→104→103 순서로 지웁니다. 그러면 A의 위치는 B와 같은 공통 조상 102가 됩니다.",
  },
  {
    label: "새 branch 적용",
    summary: "A: 103′ → 105′ · B: 103′부터",
    note: "A는 공통 조상 다음 block부터 103′→104′→105′ 순서로 새 행을 씁니다. B는 지울 행이 없으므로 102 다음인 103′부터 새 branch를 이어서 처리하면 됩니다.",
  },
] as const;

const XS = [140, 232, 324] as const;
const OLD_Y = 50;
const NEW_Y = 160;
const ROOT = { x: 44, y: 105 };
const W = 64;
const H = 30;

function Block({ x, y, label, stroke, dashed = false, fill = "none" }: { x: number; y: number; label: string; stroke: string; dashed?: boolean; fill?: string }) {
  return (
    <g>
      <rect x={x - W / 2} y={y - H / 2} width={W} height={H} rx={6} fill={fill} stroke={stroke} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={stroke}>
        {label}
      </text>
    </g>
  );
}

function Tag({ x, y, letter, color }: { x: number; y: number; letter: string; color: string }) {
  return (
    <g>
      <rect x={x - 11} y={y - 10} width={22} height={20} rx={4} fill={color} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">
        {letter}
      </text>
    </g>
  );
}

const OLD = "#64748b";
const NEW = "#2563eb";
const REMOVED = "#dc2626";
const A_COLOR = "#b45309";
const B_COLOR = "#0f766e";

export default function ExExReorgBranchViz() {
  return (
    <SceneShell
      eyebrow="Reorg 모양"
      title="높이 105가 두 branch에 하나씩 있습니다"
      description="위 줄은 이전 canonical, 아래 줄은 새 canonical입니다. A·B 표시는 두 extension이 저장한 처리 위치입니다."
      note="block 이름은 본문 사례의 설명용 식별자입니다."
      ariaLabel="공통 조상 102에서 갈라진 old와 new branch 위에서 Extension A와 B의 위치가 바뀌는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const rolledBack = active >= 2;
        const applied = active >= 3;
        const aAtRoot = active === 2;
        return (
          <svg viewBox="0 0 400 220" className="block h-auto w-full text-foreground" role="img" aria-label={SCENES[active].summary}>
            <text x={XS[0] - W / 2} y={18} fontSize={13} fill={OLD}>이전 canonical (old)</text>
            <text x={XS[0] - W / 2} y={212} fontSize={13} fill={NEW}>새 canonical (new)</text>

            {/* 공통 조상에서 두 줄로 갈라지는 선 */}
            <path d={`M ${ROOT.x + W / 2} ${ROOT.y} C 92 ${ROOT.y}, 88 ${OLD_Y}, ${XS[0] - W / 2} ${OLD_Y}`} fill="none" stroke={OLD} strokeWidth={1} />
            <path d={`M ${ROOT.x + W / 2} ${ROOT.y} C 92 ${ROOT.y}, 88 ${NEW_Y}, ${XS[0] - W / 2} ${NEW_Y}`} fill="none" stroke={NEW} strokeWidth={1.25} />
            {[0, 1].map((i) => (
              <g key={i}>
                <line x1={XS[i] + W / 2} y1={OLD_Y} x2={XS[i + 1] - W / 2} y2={OLD_Y} stroke={OLD} strokeWidth={1} />
                <line x1={XS[i] + W / 2} y1={NEW_Y} x2={XS[i + 1] - W / 2} y2={NEW_Y} stroke={NEW} strokeWidth={1.25} />
              </g>
            ))}

            <Block x={ROOT.x} y={ROOT.y} label="102" stroke="currentColor" />
            {["103", "104", "105"].map((label, i) => (
              <Block key={label} x={XS[i]} y={OLD_Y} label={label} stroke={rolledBack ? REMOVED : OLD} dashed={rolledBack} />
            ))}
            {["103′", "104′", "105′"].map((label, i) => (
              <Block key={label} x={XS[i]} y={NEW_Y} label={label} stroke={NEW} fill={applied ? "#2563eb22" : "none"} />
            ))}

            {/* 같은 높이 표시: 세로 점선 */}
            {active === 0
              ? [XS[0], XS[2]].map((x) => <line key={x} x1={x} y1={OLD_Y + H / 2 + 4} x2={x} y2={NEW_Y - H / 2 - 4} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />)
              : null}
            {active === 0 ? (
              <text x={XS[1]} y={109} textAnchor="middle" fontSize={13} fill="#64748b">같은 높이 · 다른 block</text>
            ) : null}

            {rolledBack ? (
              <text x={XS[1]} y={OLD_Y + 34} textAnchor="middle" fontSize={13} fill={REMOVED}>A가 만든 행 삭제 · 105→104→103</text>
            ) : null}
            {applied ? (
              <text x={XS[1]} y={NEW_Y - 24} textAnchor="middle" fontSize={13} fill={NEW}>A가 새 행 기록 · 103′→104′→105′</text>
            ) : null}

            {active >= 1 ? (
              <>
                {active === 1 ? <Tag x={XS[2] + W / 2 + 18} y={OLD_Y} letter="A" color={A_COLOR} /> : null}
                {aAtRoot ? <Tag x={ROOT.x - 12} y={ROOT.y - 32} letter="A" color={A_COLOR} /> : null}
                {applied ? <Tag x={XS[2] + W / 2 + 18} y={NEW_Y} letter="A" color={A_COLOR} /> : null}
                <Tag x={ROOT.x + 12} y={ROOT.y - 32} letter="B" color={B_COLOR} />
              </>
            ) : null}
            {applied ? (
              <path d={`M ${ROOT.x} ${ROOT.y + H / 2} L ${ROOT.x} ${NEW_Y} L ${XS[0] - W / 2 - 6} ${NEW_Y}`} fill="none" stroke={B_COLOR} strokeWidth={1.25} strokeDasharray="4 3" markerEnd="url(#exex-branch-arrow)" />
            ) : null}
            {applied ? (
              <text x={ROOT.x - 4} y={NEW_Y + 26} fontSize={12} fill={B_COLOR}>B 다음 처리</text>
            ) : null}
            <defs>
              <marker id="exex-branch-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
                <path d="M0 0 L8 4 L0 8 z" fill={B_COLOR} />
              </marker>
            </defs>
          </svg>
        );
      }}
    />
  );
}
