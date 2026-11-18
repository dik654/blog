import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 1문단 — 중복 처리와 배달 못 한 메시지의 보관 규칙이 없으면 작업이 사라지거나 두 번 실행될 수 있다.
 * 3·4장면의 규칙은 #mechanism 2문단(메시지 ID로 중복을 막고, 실패 메시지는 죽은 편지 큐에서 원인을 바로잡은 뒤 다시 처리)에서 가져왔다.
 * 메시지 이름(주문 #7)은 그림용 가정이다. 재시도 횟수와 중복이 생기는 이유는 본문에 없어 적지 않는다.
 */
const ACCENT = "#2563eb";
const RED = "#dc2626";
const GREEN = "#16a34a";
const AMBER = "#d97706";
const MUTED = "#94a3b8";
const LABEL = "#475569";

type Mode = "lost" | "twice" | "dedupe" | "dead";

const SCENES = [
  {
    label: "규칙 없음 · 실패하면",
    summary: "작업이 사라질 수 있음",
    mode: "lost",
    note: "메시지 큐는 할 일을 적어 두고 작업자가 꺼내 처리하는 줄입니다. 작업자가 처리하다 실패했는데 그 메시지를 보관하는 규칙이 없으면, 주문 같은 작업이 아무 기록 없이 사라질 수 있습니다.",
  },
  {
    label: "규칙 없음 · 같은 메시지가 두 번",
    summary: "주문이 두 번 실행될 수 있음",
    mode: "twice",
    note: "같은 메시지를 두 번 처리하는 경우를 막는 규칙이 없으면 같은 주문이 두 번 실행될 수 있습니다. 왜 두 번 오게 되는지는 이 글이 다루지 않으므로 그림에서도 원인을 적지 않았습니다.",
  },
  {
    label: "메시지 ID로 중복 막기",
    summary: "이미 처리한 ID는 건너뜀",
    mode: "dedupe",
    note: "7절의 순서대로 메시지마다 ID를 붙여 두고, 이미 처리한 ID가 다시 오면 실행하지 않습니다. 주문 기록은 한 줄만 남습니다.",
  },
  {
    label: "재시도 뒤 죽은 편지 큐에 보관",
    summary: "버리지 않고 모아 둔 뒤 다시 처리",
    mode: "dead",
    note: "죽은 편지 큐(dead-letter queue)는 끝내 처리하지 못한 메시지를 버리지 않고 따로 모아 두는 큐입니다. 재시도해도 실패한 메시지를 여기 두고, 로그로 원인을 바로잡은 뒤 다시 처리합니다. 재시도 횟수는 본문에 없어 적지 않았습니다.",
  },
] as const satisfies readonly { label: string; summary: string; mode: Mode; note: string }[];

function Msg({ x, y, text, color, faded = false }: { x: number; y: number; text: string; color: string; faded?: boolean }) {
  return (
    <g opacity={faded ? 0.35 : 1}>
      <rect x={x} y={y} width={62} height={22} rx={4} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + 31} y={y + 15} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="currentColor">{text}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} markerEnd={`url(#qr-${color.slice(1)})`} />;
}

export default function QueueRulesViz() {
  return (
    <SceneShell
      eyebrow="큐에 넣었다고 끝이 아닙니다"
      title="보관 규칙이 없으면 작업이 사라지거나 두 번 돕니다"
      description="왼쪽이 메시지 큐, 가운데가 작업자, 오른쪽이 실제로 남은 주문 기록입니다. 아래 칸은 마지막 장면에서 쓰는 죽은 편지 큐입니다. '주문 #7'은 그림용 가정입니다."
      ariaLabel="규칙 없는 큐에서 작업이 사라지거나 두 번 실행되는 경우와, 메시지 ID와 죽은 편지 큐로 막는 경우"
      scenes={SCENES}
      render={(active) => {
        const mode: Mode = SCENES[active].mode;
        const twiceLike = mode === "twice" || mode === "dedupe";
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              {[ACCENT, RED, GREEN, AMBER, MUTED].map((color) => (
                <marker key={color} id={`qr-${color.slice(1)}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M0 0 L8 4 L0 8 z" fill={color} />
                </marker>
              ))}
            </defs>

            <text x={8} y={14} fontSize={10.5} fontWeight={700} fill={LABEL}>메시지 큐</text>
            <rect x={4} y={20} width={86} height={84} rx={8} fill="none" stroke={MUTED} strokeWidth={1} />
            <text x={146} y={14} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={LABEL}>작업자</text>
            <rect x={116} y={40} width={60} height={44} rx={8} fill="none" stroke={ACCENT} strokeWidth={1} />
            <text x={146} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">처리</text>
            <text x={258} y={14} fontSize={10.5} fontWeight={700} fill={LABEL}>남은 주문 기록</text>
            <rect x={252} y={20} width={104} height={84} rx={8} fill="none" stroke={MUTED} strokeWidth={1} />

            {mode === "lost" ? (
              <>
                <Msg x={16} y={51} text="주문 #7" color={ACCENT} />
                <Arrow x1={78} y1={62} x2={114} y2={62} color={ACCENT} />
                <text x={146} y={100} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>✕ 실패</text>
                <Arrow x1={176} y1={62} x2={204} y2={112} color={RED} dashed />
                <text x={210} y={122} fontSize={10.5} fontWeight={700} fill={RED}>사라질 수 있음</text>
                <text x={210} y={136} fontSize={10} fill={RED}>(보관 규칙 없음)</text>
                <text x={304} y={66} textAnchor="middle" fontSize={11} fill={MUTED}>(비어 있음)</text>
              </>
            ) : null}

            {twiceLike ? (
              <>
                <Msg x={16} y={32} text="주문 #7" color={ACCENT} />
                <Msg x={16} y={70} text="주문 #7" color={mode === "dedupe" ? AMBER : ACCENT} />
                <Arrow x1={78} y1={43} x2={114} y2={54} color={ACCENT} />
                <Arrow x1={78} y1={81} x2={114} y2={72} color={mode === "dedupe" ? AMBER : ACCENT} />
                <Arrow x1={176} y1={54} x2={250} y2={42} color={GREEN} />
                <rect x={260} y={30} width={88} height={22} rx={4} fill="none" stroke={GREEN} strokeWidth={1} />
                <text x={304} y={45} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="currentColor">주문 #7 실행</text>
                {mode === "twice" ? (
                  <>
                    <Arrow x1={176} y1={72} x2={250} y2={80} color={RED} />
                    <rect x={260} y={70} width={88} height={22} rx={4} fill="none" stroke={RED} strokeWidth={1} />
                    <text x={304} y={85} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={RED}>주문 #7 또 실행</text>
                  </>
                ) : (
                  <>
                    <text x={304} y={85} textAnchor="middle" fontSize={10.5} fill={MUTED}>두 번째 줄 없음</text>
                    <text x={146} y={124} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={AMBER}>같은 ID → 이미 처리함, 건너뜀</text>
                  </>
                )}
              </>
            ) : null}

            {mode === "dead" ? (
              <>
                <Msg x={16} y={51} text="주문 #7" color={ACCENT} />
                <Arrow x1={78} y1={62} x2={114} y2={62} color={ACCENT} />
                <path d="M168 40 C 190 18, 102 18, 124 40" fill="none" stroke={AMBER} strokeWidth={1} markerEnd={`url(#qr-${AMBER.slice(1)})`} />
                <text x={146} y={100} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={AMBER}>재시도해도 실패</text>
                <Arrow x1={146} y1={106} x2={146} y2={140} color={AMBER} />
                <Arrow x1={222} y1={142} x2={180} y2={86} color={GREEN} dashed />
                <Arrow x1={176} y1={66} x2={258} y2={76} color={GREEN} dashed />
                <text x={240} y={128} fontSize={10.5} fill="#15803d">원인 고친 뒤</text>
                <text x={240} y={141} fontSize={10.5} fill="#15803d">작업자가 다시 처리</text>
                <rect x={260} y={66} width={88} height={22} rx={4} fill="none" stroke={GREEN} strokeWidth={1} />
                <text x={304} y={81} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="currentColor">주문 #7 실행</text>
              </>
            ) : null}

            <g opacity={mode === "dead" ? 1 : 0.25}>
              <rect x={60} y={142} width={172} height={42} rx={8} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray={mode === "dead" ? undefined : "4 3"} />
              <text x={146} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">죽은 편지 큐</text>
              <text x={146} y={176} textAnchor="middle" fontSize={10} fill={LABEL}>{mode === "dead" ? "주문 #7 보관 · 로그로 원인 확인" : "처리 못 한 메시지 보관 칸"}</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
