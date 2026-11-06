import SceneShell from "./SceneShell";

/**
 * 본문 대응: #listen-queues — SYN 대기열과 accept 대기열 중 어느 줄이 언제 찼는지에 따른 세 갈래.
 * 정상 / SYN 대기열 가득(cookie) / SYN 도착 때 accept 대기열 가득(버림) / 마지막 ACK 때 accept 대기열 가득(짧은 half-open).
 */
const W = 360;
const H = 208;
const COL = { client: 44, syn: 132, accept: 228, program: 316 } as const;
const BOX_TOP = 8;
const BOX_H = 52;
const LANES: readonly number[] = [90, 118, 146, 174];

type Column = keyof typeof COL;

interface Message {
  from: Column;
  to: Column;
  lane: number;
  label: string;
  tone?: "ok" | "bad" | "retry";
  blocked?: boolean;
}

interface QueueScene {
  synFull: boolean;
  acceptFull: boolean;
  acceptStatus?: string;
  messages: readonly Message[];
}

const STATES: readonly QueueScene[] = [
  {
    synFull: false,
    acceptFull: false,
    messages: [
      { from: "client", to: "syn", lane: 0, label: "SYN" },
      { from: "syn", to: "client", lane: 1, label: "SYN-ACK" },
      { from: "client", to: "accept", lane: 2, label: "마지막 ACK" },
      { from: "accept", to: "program", lane: 3, label: "accept()" },
    ],
  },
  {
    synFull: true,
    acceptFull: false,
    messages: [
      { from: "client", to: "syn", lane: 0, label: "SYN" },
      { from: "syn", to: "client", lane: 1, label: "SYN-ACK", tone: "retry" },
    ],
  },
  {
    synFull: false,
    acceptFull: true,
    acceptStatus: "SYN 때 가득",
    messages: [
      { from: "client", to: "accept", lane: 0, label: "SYN", tone: "bad", blocked: true },
      { from: "client", to: "syn", lane: 2, label: "1초 뒤 SYN", tone: "retry" },
    ],
  },
  {
    synFull: false,
    acceptFull: true,
    acceptStatus: "ACK 때 가득",
    messages: [
      { from: "client", to: "syn", lane: 0, label: "SYN" },
      { from: "syn", to: "client", lane: 1, label: "SYN-ACK" },
      { from: "client", to: "accept", lane: 2, label: "마지막 ACK", tone: "bad", blocked: true },
      { from: "syn", to: "client", lane: 3, label: "SYN-ACK", tone: "retry" },
    ],
  },
];

const SCENES = [
  { label: "정상 경로", summary: "SYN 줄 → accept 줄 → 프로그램", note: "SYN을 받으면 SYN-ACK로 답하고 handshake가 끝나면 연결은 accept 대기열로 옮겨 프로그램이 꺼낼 때까지 섭니다. v6.12는 두 줄 모두 같은 backlog와 비교합니다." },
  { label: "SYN 대기열 가득", summary: "저장 없이 cookie로 답함", note: "syncookies(기본 1)가 켜져 있으면 연결 상태를 저장하지 않고 순서 번호에 정보를 담아 SYN-ACK로 답합니다. dmesg에 'Possible SYN flooding on port'가 찍힙니다." },
  { label: "SYN 때 accept 대기열 가득", summary: "SYN을 버림 · 응답 없음", note: "cookie 여부와 상관없이 버립니다. 서버가 답하지 않으므로 클라이언트는 오류 없이 1초 뒤에 SYN을 다시 보냅니다." },
  { label: "마지막 ACK 때 accept 대기열 가득", summary: "ACK를 버림 · 짧은 half-open", note: "클라이언트는 연결됐다고 믿지만 서버의 요청 소켓은 SYN 대기열에 남습니다. tcp_abort_on_overflow가 기본값 0이면 SYN-ACK를 다시 보내 회복할 기회를 줍니다." },
] as const;

function Box({ x, title, status, full }: { x: number; title: readonly string[]; status?: string; full?: boolean }) {
  const width = 76;
  const stroke = full ? "#dc2626" : "#94a3b8";
  return (
    <g>
      <rect x={x - width / 2} y={BOX_TOP} width={width} height={BOX_H} rx={6} fill="none" stroke={stroke} strokeWidth={1} strokeDasharray={full ? "3 2" : undefined} />
      {title.map((line, index) => (
        <text key={line} x={x} y={BOX_TOP + 14 + index * 13} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{line}</text>
      ))}
      {status && <text x={x} y={BOX_TOP + BOX_H - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={full ? "#dc2626" : "#64748b"}>{status}</text>}
    </g>
  );
}

function MessageArrow({ message }: { message: Message }) {
  const x1 = COL[message.from];
  const x2 = COL[message.to];
  const y = LANES[message.lane];
  const direction = x2 > x1 ? 1 : -1;
  const color = message.tone === "bad" ? "#dc2626" : message.tone === "retry" ? "#d97706" : "#2563eb";
  const end = message.blocked ? x2 - 8 * direction : x2;
  return (
    <g>
      <line x1={x1} x2={end} y1={y} y2={y} stroke={color} strokeWidth={1.25} strokeDasharray={message.tone === "retry" ? "4 3" : undefined} />
      {message.blocked ? (
        <g stroke={color} strokeWidth={1.25}>
          <line x1={end - 4} x2={end + 4} y1={y - 5} y2={y + 5} />
          <line x1={end - 4} x2={end + 4} y1={y + 5} y2={y - 5} />
        </g>
      ) : (
        <polyline points={`${x2 - 7 * direction},${y - 4} ${x2},${y} ${x2 - 7 * direction},${y + 4}`} fill="none" stroke={color} strokeWidth={1.25} />
      )}
      <text x={(x1 + x2) / 2} y={y - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{message.label}</text>
    </g>
  );
}

export default function TwoQueuesViz() {
  return (
    <SceneShell
      eyebrow="두 줄의 세 갈래"
      title="어느 줄이 언제 찼는지에 따라 답장, 버림, 재전송이 갈립니다"
      description="SYN 대기열은 handshake 중인 연결, accept 대기열은 마친 연결의 줄입니다. ✕는 버려진 자리, 점선은 재전송이나 상태를 저장하지 않은 답장입니다."
      ariaLabel="SYN 대기열과 accept 대기열 상태에 따른 handshake 경로 네 가지"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {(Object.keys(COL) as Column[]).map((column) => (
              <line key={column} x1={COL[column]} x2={COL[column]} y1={BOX_TOP + BOX_H} y2={H - 6} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 4" />
            ))}
            <Box x={COL.client} title={["클라이언트"]} />
            <Box x={COL.syn} title={["SYN", "대기열"]} status={state.synFull ? "가득" : "여유"} full={state.synFull} />
            <Box x={COL.accept} title={["accept", "대기열"]} status={state.acceptStatus ?? "여유"} full={state.acceptFull} />
            <Box x={COL.program} title={["프로그램"]} />
            {state.messages.map((message) => (
              <MessageArrow key={`${message.lane}-${message.label}`} message={message} />
            ))}
          </svg>
        );
      }}
    />
  );
}
