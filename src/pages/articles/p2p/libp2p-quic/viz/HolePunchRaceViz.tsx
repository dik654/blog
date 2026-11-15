import QuicSceneShell from "./QuicSceneShell";

/**
 * 본문 대응: #hole-punching — 한 QUIC hole-punch attempt가 끝나는 두 갈래.
 * 64 random bytes, 10~200ms random delay, handshake timeout 5초는 본문 값이다.
 * 5초 동안 보내는 횟수: 송신·처리 시간을 0으로 두면(가정) 5000/200 = 25 ~ 5000/10 = 500번 안팎.
 * 도착 시점은 본문이 정하지 않으므로 timeout 막대 위에 위치를 찍지 않는다.
 */
const BLUE = "#2563eb";
const GREEN = "#059669";
const RED = "#dc2626";
const AMBER = "#d97706";
const LINE = "#94a3b8";
const TEXT = "#64748b";

type Phase = "gate" | "dup" | "punch" | "inbound" | "timeout";

const SCENES = [
  {
    phase: "gate",
    label: "시작 조건",
    summary: "/p2p/PeerId + 재사용할 listener",
    attempt: "아직 등록 전",
    timer: "시작 전",
    outcome: "둘 중 하나라도 없으면 이 branch를 시작하지 않음",
    note: "Listener role의 hole-punch branch는 multiaddr에 PeerId가 있고 재사용할 active listener가 있어야 시작합니다. 일반 dial처럼 새 dialer endpoint를 만드는 대신 이미 열린 listening UDP socket을 복제해 씁니다.",
  },
  {
    phase: "dup",
    label: "같은 remote의 두 번째 시도",
    summary: "HolePunchInProgress로 거부",
    attempt: "203.0.113.7:4001 → 진행 중 attempt 1개",
    timer: "첫 attempt 기준으로 진행 중",
    outcome: "두 번째 attempt 거부",
    note: "Attempt는 remote SocketAddr로 등록합니다. 같은 remote address에 살아 있는 attempt가 있으면 두 번째 시도는 HolePunchInProgress로 거부합니다.",
  },
  {
    phase: "punch",
    label: "punch 반복",
    summary: "64B 송신 → 10~200ms 대기 → 반복",
    attempt: "203.0.113.7:4001 → 진행 중",
    timer: "진행 중 (0 ~ 5초 사이)",
    outcome: "아직 결정 안 됨",
    note: "Puncher는 64 random bytes를 UDP로 보내고 10~200ms 사이 random delay 뒤 다시 보냅니다. 송신 시간을 0으로 두면(가정) 5초 동안 대략 25~500번입니다. 이 packet은 NAT mapping을 만들 기회이지 QUIC connection 성공 자체가 아닙니다.",
  },
  {
    phase: "inbound",
    label: "inbound가 먼저 도착",
    summary: "observed PeerId + Connection 반환",
    attempt: "203.0.113.7:4001 → receiver로 전달",
    timer: "5초 전에 끝남 (도착 시점은 정해져 있지 않음)",
    outcome: "Direct QUIC connection. Target 일치 확인은 상위 계층 몫",
    note: "Transport poll이 같은 remote address의 matching inbound QUIC connection을 attempt receiver로 넘깁니다. 현재 branch는 expected PeerId와 다르면 warning만 남기고 실제 identity를 반환하므로, Bob이 맞는지는 상위 계층이 확인합니다.",
  },
  {
    phase: "timeout",
    label: "timeout이 먼저",
    summary: "5초 → direct path 실패",
    attempt: "203.0.113.7:4001 → handshake-timeout 오류",
    timer: "5초 도달",
    outcome: "Receipt를 남기고 bounded backoff 뒤 relay·다른 transport",
    note: "5초 안에 matching inbound가 오지 않으면 direct path는 실패합니다. Symmetric NAT나 UDP 차단 환경은 direct path가 열리지 않을 수 있으므로 receipt에 fallback reason을 남기고 bounded backoff 뒤 relay나 다른 transport로 넘어갑니다.",
  },
] as const satisfies readonly {
  phase: Phase;
  label: string;
  summary: string;
  attempt: string;
  timer: string;
  outcome: string;
  note: string;
}[];

/** 예시 송신 간격(가정): 그림 위 packet 위치만 정하며 시간 축이 아니다. */
const PACKET_X = [86, 106, 126, 150, 170, 194] as const;

function Lane({ phase }: { phase: Phase }) {
  // dup 장면에도 첫 attempt가 살아 있으므로 그 attempt의 punch packet을 함께 그린다.
  const punching = phase === "dup" || phase === "punch" || phase === "inbound" || phase === "timeout";
  return (
    <svg viewBox="0 0 300 124" className="mx-auto block h-auto w-full max-w-md" role="img" aria-label="로컬 listener socket과 remote 주소 사이 packet 흐름">
      <rect x="4" y="22" width="72" height="62" rx="8" fill="none" stroke={phase === "gate" ? BLUE : LINE} strokeWidth="1" />
      <text x="40" y="44" textAnchor="middle" fontSize="11" fontWeight="700" fill={TEXT}>
        로컬
      </text>
      <text x="40" y="59" textAnchor="middle" fontSize="10.5" fill={TEXT}>
        listener
      </text>
      <text x="40" y="72" textAnchor="middle" fontSize="10.5" fill={TEXT}>
        UDP socket
      </text>
      <rect x="224" y="22" width="72" height="62" rx="8" fill="none" stroke={LINE} strokeWidth="1" />
      <text x="260" y="44" textAnchor="middle" fontSize="11" fontWeight="700" fill={TEXT}>
        remote
      </text>
      <text x="260" y="59" textAnchor="middle" fontSize="10.5" fill={TEXT}>
        203.0.113.7
      </text>
      <text x="260" y="72" textAnchor="middle" fontSize="10.5" fill={TEXT}>
        :4001
      </text>
      <line x1="76" y1="40" x2="224" y2="40" stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="76" y1="66" x2="224" y2="66" stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
      {punching &&
        PACKET_X.map((x) => (
          <rect key={x} x={x} y="35" width="13" height="10" rx="2" fill="none" stroke={phase === "timeout" ? AMBER : BLUE} strokeWidth="1" />
        ))}
      <text x="150" y="15" textAnchor="middle" fontSize="10" fill={punching ? BLUE : TEXT}>
        {phase === "dup" ? "첫 attempt의 64 random bytes 반복 →" : punching ? "64 random bytes 반복 →" : "아직 packet 없음"}
      </text>
      {phase === "inbound" && (
        <g>
          <line x1="222" y1="66" x2="80" y2="66" stroke={GREEN} strokeWidth="1.25" />
          <path d="M80 66 L88 62 L88 70 Z" fill={GREEN} />
          <text x="150" y="84" textAnchor="middle" fontSize="10" fontWeight="700" fill={GREEN}>
            ← matching inbound QUIC
          </text>
        </g>
      )}
      {phase === "dup" && (
        <g>
          <rect x="40" y="94" width="220" height="24" rx="6" fill="none" stroke={RED} strokeWidth="1" strokeDasharray="3 2" />
          <text x="150" y="110" textAnchor="middle" fontSize="10" fontWeight="700" fill={RED}>
            두 번째 attempt 거부: HolePunchInProgress
          </text>
        </g>
      )}
      {phase === "timeout" && (
        <text x="150" y="84" textAnchor="middle" fontSize="10" fontWeight="700" fill={RED}>
          inbound 없음
        </text>
      )}
    </svg>
  );
}

function Slot({ title, value, tone }: { title: string; value: string; tone: "plain" | "good" | "bad" }) {
  const border = tone === "good" ? "border-emerald-600" : tone === "bad" ? "border-red-600" : "border-border";
  return (
    <div className={`min-w-0 rounded-lg border bg-background px-3 py-2 text-xs leading-5 ${border}`}>
      <span className="block font-bold">{title}</span>
      <span className="break-words">{value}</span>
    </div>
  );
}

export default function HolePunchRaceViz() {
  return (
    <QuicSceneShell
      eyebrow="hole-punch attempt"
      title="punch packet을 보내는 동안 inbound 도착과 5초 timeout 중 먼저 오는 쪽이 결과를 정합니다"
      description="Hole punch는 NAT 뒤의 두 peer가 서로에게 UDP packet을 먼저 보내 NAT에 바깥으로 향하는 mapping을 만들어 두는 시도입니다. 위쪽 점선은 보내는 packet, 아래쪽 점선은 돌아오는 연결이며, packet 간격은 그림용이라 시간 축이 아닙니다(가정)."
      ariaLabel="QUIC hole-punch attempt의 시작 조건, 중복 거부, punch 반복, inbound 성공과 timeout 실패 갈래"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        const timerTone = scene.phase === "timeout" ? "bad" : scene.phase === "inbound" ? "good" : "plain";
        const outcomeTone = scene.phase === "inbound" ? "good" : scene.phase === "timeout" || scene.phase === "dup" ? "bad" : "plain";
        return (
          <div className="min-w-0 space-y-3">
            <Lane phase={scene.phase} />
            <div className="grid min-w-0 gap-2 sm:grid-cols-3">
              <Slot title="attempt 등록 (remote SocketAddr)" value={scene.attempt} tone="plain" />
              <Slot title="handshake timeout 5초" value={scene.timer} tone={timerTone} />
              <Slot title="결과" value={scene.outcome} tone={outcomeTone} />
            </div>
          </div>
        );
      }}
    />
  );
}
