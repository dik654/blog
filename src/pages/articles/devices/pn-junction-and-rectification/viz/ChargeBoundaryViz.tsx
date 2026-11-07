import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture, #depletion — 붙이기 전 → 서로 건너기 → 경계에 남은 고정 전하 → 되돌리는 전기장.
 * 칸 수는 설명용이며 농도에 비례하지 않는다. 각 자리는 고정 이온 하나와 이동 전하 하나의 짝이다.
 */
const W = 360;
const H = 190;
const COLS_LEFT = [34, 74, 114, 154];
const COLS_RIGHT = [206, 246, 286, 326];
const ROWS = [78, 112, 146];
const HOLE = "#d97706";
const ELECTRON = "#2563eb";
const FIELD = "#16a34a";
const MUTED = "#64748b";

const SCENES = [
  { label: "붙이기 전", summary: "왼쪽 정공 · 오른쪽 전자", note: "각 영역에서 많은 이동 전하가 다릅니다. 고정 이온과 이동 전하가 짝을 이뤄 영역은 거의 중성입니다." },
  { label: "서로 건너기", summary: "전자 ← · 정공 →", note: "붙이면 농도가 높은 쪽에서 낮은 쪽으로 퍼집니다. 전자는 왼쪽으로, 정공은 오른쪽으로 건너갑니다." },
  { label: "경계에 남기", summary: "왼쪽 − · 오른쪽 +", note: "건너간 전자와 정공은 서로 만나 사라질 수 있습니다. 이온은 결정에 고정되어 건너가지 않으므로 경계 양쪽에 전하가 드러납니다." },
  { label: "이동을 되돌리기", summary: "전기장: 오른쪽 → 왼쪽", note: "드러난 양전하에서 음전하로 향하는 전기장이 정공을 왼쪽으로, 전자를 오른쪽으로 움직이게 합니다. 처음 퍼지던 방향과 반대입니다." },
] as const;

function Arrow({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  const tip = x2 > x1 ? -5 : 5;
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M${x2 + tip} ${y - 4} L${x2} ${y} L${x2 + tip} ${y + 4}`} fill="none" stroke={color} strokeWidth={1.25} />
    </g>
  );
}

export default function ChargeBoundaryViz() {
  return (
    <SceneShell
      eyebrow="두 영역이 만나는 경계"
      title="움직이는 전하가 떠나고 고정 전하가 남습니다"
      description="정공은 전자가 빠져 양전하처럼 움직이는 자리입니다. 동그라미는 이동 전하, 네모는 움직이지 못하는 이온입니다."
      note="칸의 수와 간격은 설명용이며 농도나 실제 길이에 비례하지 않습니다."
      ariaLabel="두 영역을 붙인 뒤 전자와 정공이 건너가고 고정 이온이 남아 전기장을 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const joined = active > 0;
        const crossed = active === 1;
        const gone = active >= 2;
        const boundaryCarrierHidden = gone;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={12} y={54} width={joined ? 168 : 160} height={112} fill="#d97706" fillOpacity={0.06} stroke="#94a3b8" strokeWidth={1} />
            <rect x={joined ? 180 : 188} y={54} width={joined ? 168 : 160} height={112} fill="#2563eb" fillOpacity={0.06} stroke="#94a3b8" strokeWidth={1} />
            <text x={92} y={48} textAnchor="middle" fontSize={11} fontWeight={700} fill={HOLE}>왼쪽: 정공이 많음</text>
            <text x={268} y={48} textAnchor="middle" fontSize={11} fontWeight={700} fill={ELECTRON}>오른쪽: 전자가 많음</text>

            {COLS_LEFT.map((cx, column) =>
              ROWS.map((cy) => {
                const atBoundary = column === COLS_LEFT.length - 1;
                return (
                  <g key={`l${cx}-${cy}`}>
                    <rect x={cx - 15} y={cy - 6} width={12} height={12} rx={2} fill={atBoundary && gone ? HOLE : "none"} fillOpacity={0.2} stroke={MUTED} strokeWidth={atBoundary && gone ? 1.25 : 1} />
                    <text x={cx - 9} y={cy + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={MUTED}>−</text>
                    {!(atBoundary && boundaryCarrierHidden) && (
                      <g className="transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `translateX(${atBoundary && crossed ? 42 : 0}px)` }}>
                        <circle cx={cx + 7} cy={cy} r={6.5} fill="#ffffff" stroke={HOLE} strokeWidth={1.25} />
                        <text x={cx + 7} y={cy + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={HOLE}>+</text>
                      </g>
                    )}
                  </g>
                );
              }),
            )}
            {COLS_RIGHT.map((cx, column) =>
              ROWS.map((cy) => {
                const atBoundary = column === 0;
                return (
                  <g key={`r${cx}-${cy}`}>
                    <rect x={cx + 3} y={cy - 6} width={12} height={12} rx={2} fill={atBoundary && gone ? ELECTRON : "none"} fillOpacity={0.2} stroke={MUTED} strokeWidth={atBoundary && gone ? 1.25 : 1} />
                    <text x={cx + 9} y={cy + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={MUTED}>+</text>
                    {!(atBoundary && boundaryCarrierHidden) && (
                      <g className="transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `translateX(${atBoundary && crossed ? -42 : 0}px)` }}>
                        <circle cx={cx - 7} cy={cy} r={6.5} fill={ELECTRON} />
                        <text x={cx - 7} y={cy + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">−</text>
                      </g>
                    )}
                  </g>
                );
              }),
            )}
            {active === 1 && (
              <>
                <text x={180} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={MUTED}>농도가 높은 쪽 → 낮은 쪽</text>
                <Arrow x1={158} x2={202} y={24} color={HOLE} />
                <text x={152} y={28} textAnchor="end" fontSize={10.5} fontWeight={700} fill={HOLE}>정공</text>
                <Arrow x1={202} x2={158} y={34} color={ELECTRON} />
                <text x={208} y={38} fontSize={10.5} fontWeight={700} fill={ELECTRON}>전자</text>
              </>
            )}
            {active >= 2 && (
              <>
                <line x1={137} x2={223} y1={176} y2={176} stroke={MUTED} strokeWidth={1} />
                <text x={180} y={188} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={MUTED}>이동 전하가 줄어든 자리</text>
              </>
            )}
            {active === 3 && (
              <>
                <text x={180} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={FIELD}>전기장</text>
                <Arrow x1={226} x2={134} y={24} color={FIELD} />
                <Arrow x1={120} x2={70} y={24} color={HOLE} />
                <text x={62} y={28} textAnchor="end" fontSize={10.5} fontWeight={700} fill={HOLE}>정공</text>
                <Arrow x1={240} x2={290} y={24} color={ELECTRON} />
                <text x={298} y={28} fontSize={10.5} fontWeight={700} fill={ELECTRON}>전자</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
