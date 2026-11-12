import SceneShell from "./SceneShell";

/**
 * 본문 대응: #handshake 둘째 문단 — 공격자가 피해자 주소를 source로 꾸민 작은 FINDNODE를 보내면
 * 큰 NEIGHBORS 응답이 피해자에게 간다. Bob이 그 상대의 최근 12시간 PONG 기록을 요구하면
 * 이 amplification이 줄어든다. 응답 크기는 본문에 수치가 없어 선 굵기로 비례 표시하지 않는다.
 */
const SCENES = [
  {
    label: "source를 꾸민 FINDNODE",
    summary: "작은 요청 · 출발 주소 = 피해자",
    mode: "spoof",
    note: "공격자가 작은 FINDNODE를 보내면서 UDP source를 피해자 주소로 꾸밉니다. 이 요청에 대한 답은 꾸민 주소, 곧 피해자에게 갑니다.",
  },
  {
    label: "gate가 없다면",
    summary: "큰 NEIGHBORS → 피해자",
    mode: "open",
    note: "Bob이 그대로 답하면 큰 NEIGHBORS 응답(이 글의 fixture로는 12개와 4개, 두 packet)이 요청하지 않은 피해자에게 몰립니다. 작은 요청이 큰 응답으로 불어나는 것이 amplification입니다.",
  },
  {
    label: "recent-PONG gate",
    summary: "기록 없음 → NEIGHBORS 안 보냄",
    mode: "gated",
    note: "Bob은 상대가 자기 PING에 PONG을 돌려준 기록이 최근 12시간 안에 있을 때만 NEIGHBORS를 보냅니다. 이 요청에는 그 기록이 없으므로 답하지 않습니다. 이 gate는 amplification을 줄입니다.",
  },
  {
    label: "proof를 마친 Alice",
    summary: "PING H_B → PONG(H_B) 뒤 응답",
    mode: "alice",
    note: "Bob이 PING H_B를 보내고 Alice가 H_B를 담은 PONG을 돌려주면 Bob 쪽에 recent-PONG 기록이 생깁니다. 그 뒤 Alice의 FINDNODE에는 NEIGHBORS가 갑니다.",
  },
] as const;

type Mode = (typeof SCENES)[number]["mode"];

const RED = "#dc2626";
const AMBER = "#d97706";
const GREEN = "#059669";
const BLUE = "#0284c7";
const MUTED = "#94a3b8";

function Node({ x, y, label, sub, color, dim = false }: { x: number; y: number; label: string; sub: string; color: string; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.3 : 1}>
      <rect x={x - 50} y={y - 22} width={100} height={44} rx={8} fill="none" stroke={color} strokeWidth={1.25} />
      <text x={x} y={y - 3} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
        {label}
      </text>
      <text x={x} y={y + 13} textAnchor="middle" fontSize={11} fill="#64748b">
        {sub}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={1.25}
      strokeDasharray={dashed ? "5 4" : undefined}
      markerEnd={`url(#amp-arrow-${color.slice(1)})`}
    />
  );
}

function Label({ x, y, text, color, anchor = "middle" }: { x: number; y: number; text: string; color: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={12} fontWeight={700} fill={color}>
      {text}
    </text>
  );
}

function Drawing({ mode }: { mode: Mode }) {
  const alice = mode === "alice";
  return (
    <svg viewBox="0 0 320 226" role="img" aria-label="공격자, Bob, 피해자 사이의 packet 흐름" className="mx-auto h-auto w-full max-w-md">
      <defs>
        {[RED, AMBER, GREEN, BLUE].map((c) => (
          <marker key={c} id={`amp-arrow-${c.slice(1)}`} viewBox="0 0 8 8" markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0 0 L8 4 L0 8 Z" fill={c} />
          </marker>
        ))}
      </defs>

      <Node x={56} y={36} label={alice ? "Alice" : "공격자"} sub={alice ? "자기 주소로 요청" : "주소를 꾸밈"} color={alice ? BLUE : RED} />
      <Node x={56} y={190} label="피해자" sub="요청한 적 없음" color={MUTED} dim={alice} />
      <Node x={264} y={113} label="Bob" sub="NEIGHBORS 보유" color="#475569" />

      {!alice && (
        <>
          <Arrow x1={108} y1={44} x2={212} y2={104} color={AMBER} />
          <Label x={216} y={30} text="작은 FINDNODE" color={AMBER} />
          <Label x={216} y={46} text="source = 피해자" color={AMBER} />
        </>
      )}

      {mode === "open" && (
        <>
          <Arrow x1={212} y1={124} x2={108} y2={182} color={RED} />
          <Arrow x1={216} y1={134} x2={110} y2={194} color={RED} />
          <Label x={186} y={196} text="큰 NEIGHBORS" color={RED} anchor="start" />
          <Label x={186} y={212} text="(12 + 4)" color={RED} anchor="start" />
        </>
      )}

      {mode === "gated" && (
        <>
          <line x1={136} y1={140} x2={152} y2={156} stroke={MUTED} strokeWidth={1.25} />
          <line x1={152} y1={140} x2={136} y2={156} stroke={MUTED} strokeWidth={1.25} />
          <rect x={160} y={166} width={156} height={48} rx={8} fill="none" stroke={GREEN} strokeWidth={1} />
          <Label x={238} y={186} text="최근 12시간 PONG 기록?" color={GREEN} />
          <Label x={238} y={204} text="없음 → 응답 안 함" color={GREEN} />
        </>
      )}

      {alice && (
        <>
          <Arrow x1={212} y1={98} x2={108} y2={30} color={BLUE} dashed />
          <Arrow x1={108} y1={42} x2={212} y2={106} color={BLUE} dashed />
          <Arrow x1={108} y1={54} x2={212} y2={114} color={AMBER} />
          <Arrow x1={212} y1={124} x2={108} y2={60} color={GREEN} />
          <Label x={150} y={160} text="① PING H_B (Bob → Alice)" color={BLUE} anchor="start" />
          <Label x={150} y={176} text="② PONG(H_B) (Alice → Bob)" color={BLUE} anchor="start" />
          <Label x={150} y={192} text="③ FINDNODE (Alice → Bob)" color={AMBER} anchor="start" />
          <Label x={150} y={208} text="④ NEIGHBORS → Alice" color={GREEN} anchor="start" />
        </>
      )}
    </svg>
  );
}

export default function AmplificationGateViz() {
  return (
    <SceneShell
      eyebrow="endpoint proof"
      title="큰 응답은 주소를 증명한 상대에게만 보냅니다"
      description="공격자, Bob, 피해자 세 자리만 두었습니다. 선 굵기는 packet 크기에 비례하지 않습니다."
      ariaLabel="source를 꾸민 FINDNODE와 recent-PONG gate"
      scenes={SCENES}
      render={(active) => <Drawing mode={SCENES[active].mode} />}
    />
  );
}
