import OpsSceneShell from "./OpsSceneShell";

/**
 * 본문 대응: #retry-receipt — client가 응답을 못 받아도 server는 ticket을 이미 만들었을 수 있다.
 * 새 identity로 재전송하면 ticket이 두 개, 같은 operation ID로 재전송하면 기존 receipt를 조회해 하나.
 * 예시 값(create-ticket:tenant7:request42, ticketId=91, attempt 1 timeout / attempt 2 조회)은 본문 TermBreakdown의 예.
 */
const X = { client: 52, server: 180, tickets: 308 } as const;
const MUTED = "#64748b";
const ACCENT = "#2563eb";
const BAD = "#dc2626";
const GOOD = "#16a34a";

const SCENES = [
  {
    label: "Attempt 1 전송",
    summary: "attempt 1 · ticket 0",
    note: "Write tool 호출에는 retry 사이에도 바뀌지 않는 operation ID가 실립니다. 이 ID는 network 시도 하나가 아니라 ‘ticket 하나 만들기’라는 논리 작업을 가리킵니다.",
    attempts: 1,
    tickets: 0,
  },
  {
    label: "응답만 사라짐",
    summary: "attempt 1 · ticket 1 · client는 모름",
    note: "Server는 ticket 91을 만들고 receipt를 기록했지만 응답이 client에 닿지 않았습니다. Client 쪽에서는 timeout만 보입니다. Timeout은 미실행 증명이 아니므로, 이 시점에 ticket이 있는지 없는지 client는 알 수 없습니다.",
    attempts: 1,
    tickets: 1,
  },
  {
    label: "갈래 A · 새 identity로 재전송",
    summary: "attempt 2 · ticket 2",
    note: "같은 요청을 새 identity로 다시 보내면 server는 이를 새 작업으로 봅니다. 찾을 receipt가 없으니 ticket을 하나 더 만들고, 사용자가 원한 작업 하나에 ticket이 두 개 생깁니다.",
    attempts: 2,
    tickets: 2,
  },
  {
    label: "갈래 B · 같은 operation ID로 재전송",
    summary: "attempt 2 · ticket 1",
    note: "같은 operation ID로 다시 보내면 server는 새 effect를 만들기 전에 기존 receipt를 먼저 조회합니다. 이미 끝난 작업이므로 ticketId 91을 그대로 돌려줍니다. Attempt는 2번이어도 effect는 1번입니다. 이 결과에는 server가 operation ID와 receipt를 원자적으로 기록하고, receipt가 client의 retry window보다 오래 남으며, 조회에도 caller·tenant 권한 검사가 붙는다는 전제가 있습니다.",
    attempts: 2,
    tickets: 1,
  },
] as const;

function Arrow({ from, to, y, label, color = ACCENT, lost = false }: { from: number; to: number; y: number; label: string; color?: string; lost?: boolean }) {
  const dir = to > from ? 1 : -1;
  const tip = to - dir * 2;
  const mid = (from + to) / 2;
  return (
    <g>
      <line x1={from} y1={y} x2={lost ? mid : tip - dir * 6} y2={y} stroke={color} strokeWidth="1.25" strokeDasharray={lost ? "4 3" : undefined} />
      {lost ? (
        <g stroke={BAD} strokeWidth="1.25">
          <line x1={mid - 5} y1={y - 5} x2={mid + 5} y2={y + 5} />
          <line x1={mid - 5} y1={y + 5} x2={mid + 5} y2={y - 5} />
        </g>
      ) : (
        <polygon points={`${tip},${y} ${tip - dir * 7},${y - 4} ${tip - dir * 7},${y + 4}`} fill={color} />
      )}
      <text x={lost ? (mid + from) / 2 : mid} y={y - 6} textAnchor="middle" fontSize="11" fill={color === MUTED ? MUTED : "currentColor"}>
        {label}
      </text>
    </g>
  );
}

function Note({ x, y, text, color = MUTED, anchor = "middle" }: { x: number; y: number; text: string; color?: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="11" fontWeight="700" fill={color}>
      {text}
    </text>
  );
}

function Timeline({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 360 274" role="img" aria-label={SCENES[active].label} className="mx-auto block h-auto w-full max-w-[24rem] text-foreground">
      {(["client", "server", "tickets"] as const).map((lane) => (
        <g key={lane}>
          <text x={X[lane]} y={18} textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">
            {lane === "client" ? "Client" : lane === "server" ? "MCP server" : "Ticket system"}
          </text>
          <line x1={X[lane]} y1={26} x2={X[lane]} y2={266} stroke="#cbd5e1" strokeWidth="1" />
        </g>
      ))}
      <Arrow from={X.client} to={X.server} y={52} label="attempt 1" />
      <Note x={(X.client + X.server) / 2} y={70} text="op …request42" />
      {active >= 1 && (
        <g>
          <Arrow from={X.server} to={X.tickets} y={92} label="create" />
          <Note x={X.tickets} y={110} text="ticket 91" color={GOOD} />
          <Note x={X.server} y={126} text="receipt 저장 (op → 91)" />
          <Arrow from={X.server} to={X.client} y={154} label="응답" color={MUTED} lost />
          <Note x={X.client - 40} y={174} text="timeout" color={BAD} anchor="start" />
        </g>
      )}
      {active === 2 && (
        <g>
          <Arrow from={X.client} to={X.server} y={204} label="attempt 2 · 새 ID" color={BAD} />
          <Note x={X.server} y={220} text="receipt 없음 → 새 작업" color={BAD} />
          <Arrow from={X.server} to={X.tickets} y={246} label="create" color={BAD} />
          <Note x={X.tickets} y={268} text="ticket 2개째" color={BAD} />
        </g>
      )}
      {active === 3 && (
        <g>
          <Arrow from={X.client} to={X.server} y={204} label="attempt 2 · 같은 ID" />
          <Note x={X.server} y={220} text="receipt 조회 → 있음" color={GOOD} />
          <Arrow from={X.server} to={X.client} y={250} label="ticketId 91 반환" color={GOOD} />
          <Note x={X.tickets} y={268} text="create 없음" />
        </g>
      )}
    </svg>
  );
}

function Counter({ name, value, max, bad }: { name: string; value: number; max: number; bad: boolean }) {
  return (
    <div className="min-w-0 rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{name}</p>
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: max }, (_, index) => (
          <span
            key={index}
            className="h-4 w-6 rounded-sm border"
            style={{ borderColor: index < value ? (bad ? BAD : ACCENT) : "#cbd5e1", backgroundColor: index < value ? (bad ? BAD : ACCENT) : "transparent" }}
          />
        ))}
        <span className="ml-1 font-mono text-sm font-bold">{value}</span>
      </div>
    </div>
  );
}

export default function RetryReceiptTimelineViz() {
  return (
    <OpsSceneShell
      eyebrow="Timeout 뒤 retry"
      title="응답이 사라진 뒤, 다시 보내는 방식이 ticket 수를 정한다"
      description="세로선 셋은 Client, MCP server, 외부 Ticket system이고 위에서 아래로 시간이 흐릅니다. 예시 operation ID는 create-ticket:tenant7:request42이고, receipt는 server가 남기는 외부 변경의 기록(어느 ticket이 어떤 상태로 생겼는지)입니다. 장면 3과 4는 장면 2 뒤에 올 수 있는 두 갈래입니다."
      ariaLabel="응답 유실 뒤 새 identity 재전송과 같은 operation ID 재전송의 ticket 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 items-center gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
            <Timeline active={active} />
            <div className="grid min-w-0 grid-cols-2 gap-2 md:grid-cols-1">
              <Counter name="Network attempt 수" value={scene.attempts} max={2} bad={false} />
              <Counter name="생긴 ticket 수" value={scene.tickets} max={2} bad={scene.tickets > 1} />
            </div>
          </div>
        );
      }}
    />
  );
}
