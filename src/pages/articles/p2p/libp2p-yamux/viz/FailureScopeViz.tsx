import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release — RST는 stream 1의 request와 partial buffer만 실패시키고,
 * GO_AWAY·TCP/Noise I/O error는 connection의 모든 sibling stream을 깨운다.
 * FIN은 한 방향만 닫는 half-close, 양쪽 FIN이 모여야 완전히 닫힌다. poll_flush 성공 ≠ Bob handler 저장 영수증.
 */
const SCENES = [
  { label: "stream 1에 RST", summary: "그 한 줄만 실패", note: "RST는 stream 1의 request와 partial payroll buffer만 실패시킵니다. Stream 3은 connection이 건강하고 자기 credit가 남아 있으면 계속 진행할 수 있습니다." },
  { label: "GO_AWAY 또는 I/O error", summary: "연결의 모든 stream이 깨어남", note: "GO_AWAY나 TCP·Noise I/O error는 connection 전체의 일입니다. 모든 sibling stream이 깨어나고, 같은 PeerId로 보낸 in-flight request 전체를 다시 분류해야 합니다." },
  { label: "한쪽 FIN", summary: "half-close", note: "FIN은 보내는 쪽 한 방향만 닫습니다. 여기서는 Alice가 먼저 FIN을 보냈다고 둡니다(가정). Bob→Alice 방향은 아직 열려 있습니다." },
  { label: "양쪽 FIN", summary: "stream 완전히 닫힘", note: "Bob도 FIN을 보내 두 방향의 FIN이 모이면 stream 1이 완전히 닫힙니다." },
  { label: "flush 성공의 범위", summary: "local queue까지만", note: "poll_flush 성공은 Alice 쪽 local command queue를 밀었다는 뜻입니다. Bob의 handler가 payroll을 저장했다는 영수증이 아닙니다. 그 확인은 application receipt와 CID·digest 검증이 따로 맡습니다." },
] as const;

const RED = "#dc2626";
const GREEN = "#16a34a";
const MUTED = "#94a3b8";

function StreamBox({ name, state, color }: { name: string; state: string; color: string }) {
  return (
    <div className="rounded-md border px-3 py-2" style={{ borderColor: color }}>
      <p className="text-sm font-bold">{name}</p>
      <p className="mt-0.5 text-xs font-semibold" style={{ color }}>{state}</p>
    </div>
  );
}

function Scope({ all }: { all: boolean }) {
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: all ? RED : MUTED, borderStyle: all ? "dashed" : "solid" }}>
      <p className="text-xs font-bold" style={{ color: all ? RED : "#64748b" }}>
        Alice↔Bob connection (Noise/TCP) · {all ? "GO_AWAY 또는 I/O error" : "건강함"}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <StreamBox name="stream 1 · payroll" state={all ? "에러로 깨어남" : "RST · request 실패"} color={RED} />
        <StreamBox name="stream 3 · receipt" state={all ? "에러로 깨어남" : "credit 있으면 계속"} color={all ? RED : GREEN} />
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {all ? "같은 PeerId의 in-flight request 전체를 재분류" : "실패 범위 = stream 1 하나"}
      </p>
    </div>
  );
}

function Direction({ label, closed }: { label: string; closed: boolean }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-sm">
      <span className="font-mono text-xs font-bold">{label}</span>
      <div className="h-2 rounded-sm" style={{ backgroundColor: closed ? MUTED : GREEN, opacity: closed ? 0.5 : 1 }} />
      <span className="text-right text-xs font-bold" style={{ color: closed ? "#64748b" : GREEN }}>{closed ? "FIN · 닫힘" : "열림"}</span>
    </div>
  );
}

function HalfClose({ both }: { both: boolean }) {
  return (
    <div className="grid gap-3 rounded-lg border border-border p-3">
      <p className="text-xs font-bold text-muted-foreground">stream 1의 두 방향</p>
      <Direction label="Alice → Bob" closed />
      <Direction label="Bob → Alice" closed={both} />
      <p className="text-xs font-bold" style={{ color: both ? "#64748b" : "#d97706" }}>
        {both ? "두 방향 모두 FIN → stream 완전히 닫힘" : "한 방향만 닫힘 → 아직 stream은 살아 있음"}
      </p>
    </div>
  );
}

function Flush() {
  const hops = [
    { name: "Alice local command queue", reached: true },
    { name: "공유 연결 (wire)", reached: false },
    { name: "Bob handler 저장", reached: false },
  ];
  return (
    <div className="grid gap-2 text-sm">
      {hops.map((hop, index) => (
        <div key={hop.name} className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{index + 1}</span>
          <div className="rounded-md border px-3 py-2" style={{ borderColor: hop.reached ? GREEN : MUTED, borderStyle: hop.reached ? "solid" : "dashed" }}>
            <p className="font-semibold">{hop.name}</p>
            <p className="text-xs" style={{ color: hop.reached ? GREEN : "#64748b" }}>
              {hop.reached ? "poll_flush 성공이 말해 주는 곳" : "flush 성공만으로는 알 수 없음"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FailureScopeViz() {
  return (
    <SceneShell
      eyebrow="실패 범위와 닫기"
      title="RST는 한 줄을, GO_AWAY·I/O error는 연결 전체를 끊습니다"
      description="빨간 테두리가 실패가 닿는 범위입니다. 뒤의 장면은 FIN의 한 방향 닫기와 flush 성공이 말해 주는 범위를 따로 보입니다."
      ariaLabel="RST와 GO_AWAY의 실패 범위, FIN half-close, flush와 receipt의 차이"
      scenes={SCENES}
      render={(active) => {
        if (active <= 1) return <Scope all={active === 1} />;
        if (active <= 3) return <HalfClose both={active === 3} />;
        return <Flush />;
      }}
    />
  );
}
