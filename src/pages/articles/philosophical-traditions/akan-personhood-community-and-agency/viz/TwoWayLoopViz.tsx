import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 공동체와 개인을 한쪽만 남기는 두 그림을 피합니다(두 극단은 6절 관계적 행위자성의 경계와 같음).
 * 내려오는 화살표: 언어·돌봄·책임을 기름. 올라가는 화살표: 비판과 이유를 듣는 절차.
 */
const SCENES = [
  { label: "개인이 흡수되는 그림", summary: "공동체 → 사람, 한 방향", note: "공동체의 현재 관습이 언제나 옳다면 도덕적 개선과 내부 비판을 설명하기 어렵습니다(2절). 올라가는 화살표가 끊긴 그림입니다." },
  { label: "혼자 만들어지는 그림", summary: "공동체에서 받은 것이 없음", note: "아이는 혼자 언어와 책임을 발명하지 않습니다. 돌봄을 받은 경험이 다른 사람을 도울 능력을 만듭니다. 내려오는 화살표가 끊긴 그림입니다." },
  { label: "두 화살표를 함께 두기", summary: "기르고, 비판받고, 고칠 수 있음", note: "위험한 공사나 자재 독점을 지적한 비판은 공동선을 위한 기여일 수 있습니다. 공동체적 기준은 개인의 이유를 들을 절차를 포함할 때 자기 잘못을 고칠 수 있습니다." },
] as const;

const IDLE = "#94a3b8";
const MUTED = "#64748b";
const DOWN = "#2563eb";
const UP = "#b45309";
const DOWN_X = 118;
const UP_X = 222;
const TOP = 54;
const BOTTOM = 146;

function Cut({ x }: { x: number }) {
  const y = (TOP + BOTTOM) / 2;
  return (
    <g>
      <line x1={x} x2={x} y1={TOP} y2={BOTTOM} stroke={IDLE} strokeWidth={1} strokeDasharray="3 3" />
      <path d={`M${x - 7} ${y - 7} L${x + 7} ${y + 7} M${x + 7} ${y - 7} L${x - 7} ${y + 7}`} stroke="#dc2626" strokeWidth={1.25} fill="none" />
    </g>
  );
}

function Down() {
  return (
    <g>
      <line x1={DOWN_X} x2={DOWN_X} y1={TOP} y2={BOTTOM - 8} stroke={DOWN} strokeWidth={1.25} />
      <path d={`M${DOWN_X} ${BOTTOM} l-5 -9 l10 0 Z`} fill={DOWN} />
      <text x={DOWN_X - 8} y={92} textAnchor="end" fontSize={12} fontWeight={700} fill={DOWN}>언어·돌봄</text>
      <text x={DOWN_X - 8} y={109} textAnchor="end" fontSize={12} fontWeight={700} fill={DOWN}>책임을 가르침</text>
    </g>
  );
}

function Up() {
  return (
    <g>
      <line x1={UP_X} x2={UP_X} y1={BOTTOM} y2={TOP + 8} stroke={UP} strokeWidth={1.25} />
      <path d={`M${UP_X} ${TOP} l-5 9 l10 0 Z`} fill={UP} />
      <text x={UP_X + 8} y={92} fontSize={12} fontWeight={700} fill={UP}>부당함을 지적</text>
      <text x={UP_X + 8} y={109} fontSize={12} fontWeight={700} fill={UP}>이유를 들려줌</text>
    </g>
  );
}

export default function TwoWayLoopViz() {
  return (
    <SceneShell
      eyebrow="두 화살표"
      title="공동체와 사람 사이의 화살표를 하나만 남기면 생기는 두 그림"
      description="행위자성은 공동체의 기대를 판단하고 때로 비판하는 개인의 힘입니다. 내려오면 기르는 쪽, 올라가면 비판하는 쪽입니다."
      ariaLabel="공동체에서 사람으로, 사람에서 공동체로 가는 두 화살표 가운데 하나를 끊은 두 그림과 둘 다 둔 그림"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 196" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={70} y={6} width={200} height={46} rx={8} fill="none" stroke={IDLE} strokeWidth={1} />
          <text x={170} y={34} textAnchor="middle" fontSize={14} fontWeight={700} className="fill-foreground">공동체</text>
          <rect x={70} y={148} width={200} height={46} rx={8} fill="none" stroke={IDLE} strokeWidth={1} />
          <text x={170} y={176} textAnchor="middle" fontSize={14} fontWeight={700} className="fill-foreground">사람</text>

          {active === 1 ? <Cut x={DOWN_X} /> : <Down />}
          {active === 0 ? <Cut x={UP_X} /> : <Up />}
          {active === 0 && <text x={UP_X + 14} y={104} fontSize={12} fill={MUTED}>내부 비판 없음</text>}
          {active === 1 && <text x={DOWN_X - 14} y={104} textAnchor="end" fontSize={12} fill={MUTED}>받은 것 없음</text>}
        </svg>
      )}
    />
  );
}
