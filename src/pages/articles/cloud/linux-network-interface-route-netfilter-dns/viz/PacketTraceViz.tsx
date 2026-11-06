import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #kernel-source — 1절 Pod의 첫 SYN과 그 응답을 Pod·호스트·노드 밖 세 구역에 걸쳐 따라간다.
 * 칸 번호는 글의 원문 순서다. 응답의 FORWARD·POST_ROUTING은 7절 규칙(내 주소가 아니면 ip_forward → FORWARD → ip_output의 POST_ROUTING)으로 켠다. MASQUERADE·veth_xmit는 나가는 길의 일이라 응답 장면의 칸 이름에서 뺀다.
 */
type StopKey = "sock" | "podOut" | "veth" | "peer" | "bridge" | "pre" | "route" | "fwd" | "post" | "eth0" | "server";

const ZONES: readonly { name: string; stops: readonly { key: StopKey; label: string; backLabel?: string }[] }[] = [
  {
    name: "Pod network namespace",
    stops: [
      { key: "sock", label: "프로세스 · 소켓" },
      { key: "podOut", label: "LOCAL_OUT · POST_ROUTING" },
      { key: "veth", label: "eth0 · veth_xmit", backLabel: "eth0" },
    ],
  },
  {
    name: "호스트",
    stops: [
      { key: "peer", label: "veth 짝" },
      { key: "bridge", label: "bridge FDB" },
      { key: "pre", label: "PRE_ROUTING · conntrack" },
      { key: "route", label: "라우팅 결정" },
      { key: "fwd", label: "FORWARD" },
      { key: "post", label: "POST_ROUTING · MASQUERADE", backLabel: "POST_ROUTING" },
      { key: "eth0", label: "노드 eth0" },
    ],
  },
  { name: "노드 밖", stops: [{ key: "server", label: "서버" }] },
];

interface Scene extends ShellScene {
  on: readonly StopKey[];
  src: string;
  dst: string;
}

const SCENES: readonly Scene[] = [
  { label: "Pod 안", summary: "ip_route_output → veth_xmit", on: ["sock", "podOut", "veth"], src: "Pod IP", dst: "서버 IP", note: "connect()가 기본 게이트웨이(cni0 주소)를 얻고, 두 훅을 지나 eth0에 닿습니다. veth_xmit가 짝의 수신 경로에 프레임을 넣습니다." },
  { label: "bridge", summary: "BR_FDB_LOCAL → br_pass_frame_up", on: ["peer", "bridge"], src: "Pod IP", dst: "서버 IP", note: "호스트 쪽 짝이 bridge 포트입니다. 목적지 MAC이 cni0 자신이라 FDB에서 BR_FDB_LOCAL로 나오고, 프레임은 호스트 IP 계층으로 올라갑니다." },
  { label: "conntrack", summary: "nf_conntrack_in · 항목 만들기", on: ["pre"], src: "Pod IP", dst: "서버 IP", note: "ip_rcv가 훅을 부르면 nf_conntrack_in이 tuple을 만들어 표를 찾고, 없으면 항목을 만듭니다. 상한을 넘으면 경고와 함께 여기서 버립니다." },
  { label: "라우팅과 FORWARD", summary: "default 경로 → ip_forward", on: ["route", "fwd"], src: "Pod IP", dst: "서버 IP", note: "통과하면 fib_table_lookup이 default 경로를 돌려주고, ip_forward가 FORWARD 훅을 지나 ip_output으로 넘깁니다." },
  { label: "출발 주소 변환", summary: "MASQUERADE → 노드 IP", on: ["post", "eth0", "server"], src: "노드 IP", dst: "서버 IP", note: "POST_ROUTING에서 MASQUERADE 규칙이 conntrack 항목에 변환을 기록하며 출발 주소를 노드 IP로 바꿉니다." },
  { label: "응답 들어옴", summary: "reply tuple → 목적지 되돌림", on: ["server", "eth0", "pre"], src: "서버 IP", dst: "노드 IP → Pod IP", note: "PRE_ROUTING에서 conntrack이 reply 방향 tuple로 같은 항목을 찾아 목적지를 Pod IP로 되돌립니다." },
  { label: "소켓까지", summary: "10.244.1.0/24 dev cni0", on: ["route", "fwd", "post", "bridge", "peer", "veth", "sock"], src: "서버 IP", dst: "Pod IP", note: "라우팅 결정이 10.244.1.0/24 dev cni0를 고릅니다. Pod IP는 내 주소가 아니므로 7절의 규칙대로 FORWARD·POST_ROUTING을 지나 bridge → veth 짝 → Pod의 eth0 → 소켓 순서로 닿습니다." },
];

export default function PacketTraceViz() {
  return (
    <SceneShell
      eyebrow="패킷 한 벌 추적"
      title="첫 SYN이 Pod를 나가 서버까지 갔다가 응답으로 돌아오는 길"
      description="진한 칸이 이번 장면에 지나는 자리이고, 위 줄은 그때 패킷의 주소입니다. 응답은 칸의 위아래 순서가 아니라 아래 글의 순서로 지납니다."
      ariaLabel="Pod에서 나간 SYN과 응답이 지나는 자리와 주소 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="mb-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-2 text-xs leading-4">
              <p className="rounded border border-border px-2 py-1"><span className="text-muted-foreground">출발 </span><b>{scene.src}</b></p>
              <p className="rounded border border-border px-2 py-1"><span className="text-muted-foreground">목적지 </span><b>{scene.dst}</b></p>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,0.7fr)] sm:gap-2">
              {ZONES.map((zone) => (
                <div key={zone.name} className="rounded-lg border border-border/70 px-1.5 py-1">
                  <p className="mb-0.5 text-[11px] font-bold leading-4 text-muted-foreground">{zone.name}</p>
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-1">
                    {zone.stops.map((stop) => {
                      const on = scene.on.includes(stop.key);
                      return (
                        <span key={stop.key} className={`flex min-h-6 min-w-0 items-center justify-center rounded border px-1 text-center text-[11px] leading-4 [overflow-wrap:anywhere] ${on ? "border-[#2563eb] bg-[#2563eb] font-bold text-white" : "border-border/70 text-muted-foreground"}`}>
                          {active >= 5 ? (stop.backLabel ?? stop.label) : stop.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
