import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stream-open — Alice(client)는 홀수, Bob(server)은 짝수 stream ID.
 * SYN은 첫 DATA/WINDOW_UPDATE에 붙고 request bytes가 ACK를 기다리지 않고 함께 간다.
 * Bob은 ACK 또는 RST로 답한다. ACK 없는 outbound 256개면 새 open은 Pending, 전체 기본 상한 512는 별개.
 */
const SCENES = [
  {
    label: "번호표 정하기",
    summary: "Alice 홀수 · Bob 짝수",
    note: "Client인 Alice는 홀수 stream ID, server인 Bob은 짝수 ID를 씁니다. 이 글의 payroll 요청은 stream 1, 작은 receipt는 stream 3입니다.",
  },
  {
    label: "SYN을 첫 frame에 붙임",
    summary: "ACK 전에 request 출발",
    note: "SYN은 '이 번호로 새 stream을 연다'는 표시입니다. Alice는 stream 1의 첫 DATA(또는 WINDOW_UPDATE)에 SYN을 붙이고, ACK를 기다리지 않고 request bytes를 함께 보낼 수 있습니다.",
  },
  {
    label: "갈래 A · Bob이 ACK",
    summary: "stream 1 열림",
    note: "ACK는 Bob이 stream 1을 보았다는 답입니다. Alice의 request는 이 ACK보다 먼저 출발해 있었습니다.",
  },
  {
    label: "갈래 B · Bob이 RST",
    summary: "이미 보낸 request 거절",
    note: "RST는 그 stream을 거절하거나 끊는 표시입니다. request가 이미 떠난 뒤 RST가 돌아올 수 있으므로, 빠른 대신 이 경우를 application이 처리해야 합니다.",
  },
  {
    label: "ACK 없는 open이 256개",
    summary: "다음 open → Pending",
    note: "현재 rust-yamux는 ACK를 아직 못 받은 outbound stream이 256개에 이르면 새 open을 Pending(바로 열지 않고 대기)으로 둡니다. 전체 동시 stream 기본 상한 512개는 이와 다른 장부입니다.",
  },
] as const;

const W = 360;
const H = 200;
const AX = 70;
const BX = 290;

function Lifelines() {
  return (
    <>
      <text x={AX} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">Alice · client</text>
      <text x={BX} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">Bob · server</text>
      <line x1={AX} x2={AX} y1={28} y2={H - 8} stroke="#94a3b8" strokeWidth={1} />
      <line x1={BX} x2={BX} y1={28} y2={H - 8} stroke="#94a3b8" strokeWidth={1} />
    </>
  );
}

function Arrow({ y, toRight, label, sub, color }: { y: number; toRight: boolean; label: string; sub: string; color: string }) {
  const x1 = toRight ? AX + 4 : BX - 4;
  const x2 = toRight ? BX - 4 : AX + 4;
  const head = toRight ? `M ${x2} ${y} l -8 -4 v 8 Z` : `M ${x2} ${y} l 8 -4 v 8 Z`;
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={head} fill={color} />
      <text x={(AX + BX) / 2} y={y - 7} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{label}</text>
      <text x={(AX + BX) / 2} y={y + 15} textAnchor="middle" fontSize={10} fill="#64748b">{sub}</text>
    </g>
  );
}

function Sequence({ step }: { step: 1 | 2 | 3 }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={SCENES[step].label}>
      <Lifelines />
      <Arrow y={62} toRight label="DATA · stream 1 · SYN" sub="+ request bytes (ACK를 기다리지 않음)" color="#2563eb" />
      {step === 2 && <Arrow y={128} toRight={false} label="ACK · stream 1" sub="stream 1이 양쪽에서 열림" color="#16a34a" />}
      {step === 3 && <Arrow y={128} toRight={false} label="RST · stream 1" sub="앞서 보낸 request가 거절됨" color="#dc2626" />}
      {step === 1 && (
        <text x={(AX + BX) / 2} y={140} textAnchor="middle" fontSize={11} fill="#64748b">Bob의 답: ACK 또는 RST</text>
      )}
    </svg>
  );
}

function Ids() {
  const rows = [
    { who: "Alice · client", ids: ["1", "3", "5", "…"], color: "#2563eb", rule: "홀수" },
    { who: "Bob · server", ids: ["2", "4", "6", "…"], color: "#64748b", rule: "짝수" },
  ];
  return (
    <div className="grid gap-3">
      {rows.map((row) => (
        <div key={row.who} className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-2 text-sm">
          <span className="font-bold" style={{ color: row.color }}>{row.who}</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {row.ids.map((id) => (
              <span key={id} className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm" style={{ borderColor: row.color }}>
                {id}
              </span>
            ))}
            <span className="ml-1 text-xs text-muted-foreground">{row.rule} stream ID</span>
          </div>
        </div>
      ))}
      <p className="text-xs leading-5 text-muted-foreground">이 글의 사례: stream 1 = payroll 200 KiB, stream 3 = 작은 receipt</p>
    </div>
  );
}

function Backlog() {
  return (
    <div className="grid gap-4 text-sm">
      <div>
        <p className="font-bold">ACK를 아직 못 받은 outbound open</p>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <div className="h-5 rounded-sm" style={{ backgroundColor: "#d97706" }} />
          <span className="font-mono text-xs font-bold">256 / 256</span>
        </div>
        <p className="mt-2 inline-block rounded-md border border-dashed px-2 py-1 text-xs font-semibold" style={{ borderColor: "#d97706", color: "#b45309" }}>
          257번째 open 요청 → Pending
        </p>
      </div>
      <div className="rounded-md border border-border px-3 py-2">
        <p className="font-bold">connection 전체 동시 stream</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">기본 상한 512개 · connection이 보유하는 전체 stream 수를 세는 다른 제한</p>
      </div>
    </div>
  );
}

export default function StreamOpenViz() {
  return (
    <SceneShell
      eyebrow="stream open"
      title="SYN과 request가 함께 떠나고, 답은 ACK나 RST로 돌아옵니다"
      description="왼쪽 세로선이 Alice, 오른쪽이 Bob입니다. 화살표 하나가 같은 연결 위로 가는 frame 하나입니다."
      ariaLabel="Yamux stream ID 규칙, SYN과 ACK·RST 교환, 256개 ACK 대기 제한"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) return <Ids />;
        if (active === 4) return <Backlog />;
        return <Sequence step={active as 1 | 2 | 3} />;
      }}
    />
  );
}
