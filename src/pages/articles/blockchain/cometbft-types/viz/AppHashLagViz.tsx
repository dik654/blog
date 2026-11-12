import SceneShell from "./SceneShell";

/**
 * 본문 대응: #block-header "왜 AppHash는 한 높이 늦게 보일까요?"
 * Header h는 proposal 전에 만들어지므로 block h 실행 결과를 담지 못합니다.
 * Header 41의 AppHash는 B40 실행 결과(R40), B41 실행 결과(R41)는 Header 42에 실립니다.
 */
const HEIGHTS: readonly number[] = [40, 41, 42];
const COL_X: readonly number[] = [8, 138, 268];
const COL_W = 104;

const SCENES = [
  { label: "Header 41을 먼저 만듭니다", summary: "Header 41 · AppHash = R40", note: "B41을 제안하려면 Header 41이 먼저 있어야 합니다. 이때 B41은 아직 실행되지 않았으므로 AppHash 칸에는 이미 끝난 B40의 실행 결과 R40만 넣을 수 있습니다." },
  { label: "B41을 실행합니다", summary: "FinalizeBlock(B41) → R41", note: "B41이 FinalizeBlock으로 실행되어야 B41 뒤의 application state, 곧 R41이 생깁니다. Header 41은 이미 만들어졌으므로 R41을 거기에 되돌려 넣지 않습니다." },
  { label: "R41은 Header 42에 실립니다", summary: "Header 42 · AppHash = R41", note: "B41의 실행 결과는 다음 높이의 header에 연결됩니다. 그래서 각 header의 AppHash 칸은 언제나 한 칸 왼쪽 block의 receipt입니다." },
  { label: "Header 41의 AppHash 읽기", summary: "B40 실행 뒤 state · B41 아님", note: "장애 조사에서 Header 41의 AppHash를 ‘B41 실행 뒤 state’로 읽으면 한 높이를 어긋나게 판단합니다. B41 실행 결과를 보려면 Header 42의 AppHash를 봐야 합니다." },
] as const;
const ARIA: readonly string[] = SCENES.map((scene) => `${scene.label}: ${scene.summary}`);

const BLUE = "#2563eb";
const GRAY = "#94a3b8";
const MUTED = "#64748b";
const RED = "#dc2626";

function Arrow({ x1, y1, x2, y2, on, scene, dashed = false }: { x1: number; y1: number; x2: number; y2: number; on: boolean; scene: number; dashed?: boolean }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={on ? BLUE : GRAY}
      strokeWidth={on ? 1.25 : 1}
      strokeDasharray={dashed ? "3 3" : undefined}
      markerEnd={on ? `url(#apphash-arrow-on-${scene})` : `url(#apphash-arrow-${scene})`}
    />
  );
}

function Column({ index, active }: { index: number; active: number }) {
  const h = HEIGHTS[index];
  const x = COL_X[index];
  const cx = x + COL_W / 2;
  const executed = index === 0 || (index === 1 && active >= 1);
  const future = index === 2 && active < 2;
  const headerOn = (index === 1 && (active === 0 || active === 3)) || (index === 2 && active === 2);
  const appRowOn = (index === 1 && (active === 0 || active === 3)) || (index === 2 && active === 2);
  const execOn = index === 1 && active === 1;
  const resultOn = index === 1 && (active === 1 || active === 2);
  const opacity = future ? 0.4 : 1;
  return (
    <g opacity={opacity}>
      <rect x={x} y={30} width={COL_W} height={74} rx={6} fill="none" stroke={headerOn ? BLUE : GRAY} strokeWidth={headerOn ? 1.25 : 1} />
      <text x={cx} y={47} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">Header {h}</text>
      <rect x={x + 6} y={55} width={COL_W - 12} height={18} rx={3} fill="none" stroke={GRAY} strokeWidth={1} />
      <text x={cx} y={69} textAnchor="middle" fontSize={11} fill={MUTED}>DataHash(B{h})</text>
      <rect x={x + 6} y={78} width={COL_W - 12} height={18} rx={3} fill="none" stroke={appRowOn ? BLUE : GRAY} strokeWidth={appRowOn ? 1.25 : 1} />
      <text x={cx} y={92} textAnchor="middle" fontSize={11} fontWeight={appRowOn ? 700 : 400} fill={appRowOn ? BLUE : MUTED}>AppHash = R{h - 1}</text>

      <Arrow x1={cx} y1={104} x2={cx} y2={146} on={execOn} scene={active} dashed={!executed} />
      <rect x={x} y={150} width={COL_W} height={28} rx={6} fill="none" stroke={execOn ? BLUE : GRAY} strokeWidth={execOn ? 1.25 : 1} strokeDasharray={executed ? undefined : "3 3"} />
      <text x={cx} y={169} textAnchor="middle" fontSize={12} fill={executed ? "currentColor" : MUTED}>
        {executed ? `B${h} 실행` : `B${h} 실행 전`}
      </text>

      <Arrow x1={cx} y1={178} x2={cx} y2={196} on={resultOn} scene={active} dashed={!executed} />
      <rect x={x} y={200} width={COL_W} height={28} rx={6} fill="none" stroke={resultOn ? BLUE : GRAY} strokeWidth={resultOn ? 1.25 : 1} strokeDasharray={executed ? undefined : "3 3"} />
      <text x={cx} y={219} textAnchor="middle" fontSize={12} fontWeight={resultOn ? 700 : 400} fill={executed ? (resultOn ? BLUE : "currentColor") : MUTED}>
        {executed ? `R${h} (B${h} 뒤)` : `R${h} 아직 없음`}
      </text>
    </g>
  );
}

export default function AppHashLagViz() {
  return (
    <SceneShell
      eyebrow="AppHash 한 높이 지연"
      title="Header 41의 AppHash 칸에는 B40의 실행 결과가 들어갑니다"
      description="열 하나가 한 높이입니다. 위 상자는 proposal 전에 만드는 Header이고 그 안의 DataHash는 그 block tx의 commitment입니다. 아래 두 상자는 그 block의 실행과 결과입니다. R40은 B40을 실행한 뒤의 application state를 뜻합니다. 그림의 AppHash 칸은 본문의 AppHash·LastResultsHash를 함께 줄여 적은 것입니다."
      ariaLabel="Header 41의 AppHash가 B40 실행 결과를 담고 B41 실행 결과는 Header 42에 실리는 과정"
      scenes={SCENES}
      render={(active) => {
        const lag41On = active === 0 || active === 3;
        const lag42On = active === 2;
        return (
          <svg viewBox="0 0 380 272" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={ARIA[active]}>
            <defs>
              <marker id={`apphash-arrow-${active}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0L8 4L0 8Z" fill={GRAY} />
              </marker>
              <marker id={`apphash-arrow-on-${active}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0L8 4L0 8Z" fill={BLUE} />
              </marker>
            </defs>
            <text x={8} y={18} fontSize={12} fill={MUTED}>높이 →</text>
            {HEIGHTS.map((h, index) => (
              <Column key={h} index={index} active={active} />
            ))}
            <Arrow x1={112} y1={214} x2={142} y2={89} on={lag41On} scene={active} />
            <Arrow x1={242} y1={214} x2={272} y2={89} on={lag42On} scene={active} dashed={active < 1} />
            {active === 3 && (
              <g>
                <text x={190} y={248} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>Header 41의 AppHash = B40 실행 뒤 state</text>
                <text x={190} y={265} textAnchor="middle" fontSize={12} fill={RED}>‘B41 실행 뒤 state’로 읽으면 한 높이 어긋남</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
