import SceneShell from "./SceneShell";

/**
 * 본문 대응: #calico-path — 같은 node, 직접 라우팅, IP-in-IP, VXLAN, CrossSubnet의 갈림.
 * 주소는 3절 사례입니다. CrossSubnet 장면의 subnet 구분은 설명용 가정이라 node 주소를 적지 않습니다.
 */
type Kind = "same" | "direct" | "ipip" | "vxlan";

const SCENES: ReadonlyArray<{
  label: string;
  summary: string;
  kind: Kind;
  q1: string;
  q2: string;
  q2Answer: string;
  subnet: string;
  addresses: boolean;
  note: string;
}> = [
  {
    label: "같은 node",
    summary: "물리 NIC·tunnel 없음",
    kind: "same",
    q1: "예",
    q2: "물리망이 Pod 경로를 아는가?",
    q2Answer: "묻지 않음",
    subnet: "",
    addresses: true,
    note: "같은 node의 두 Pod는 host route와 두 veth를 지나므로 물리 NIC나 tunnel이 필요하지 않습니다. 다른 Pod 주소는 설명용 가정입니다.",
  },
  {
    label: "직접 라우팅",
    summary: "원래 packet 그대로",
    kind: "direct",
    q1: "아니오",
    q2: "물리망이 Pod 경로를 아는가?",
    q2Answer: "알 수 있음",
    subnet: "",
    addresses: true,
    note: "물리망(underlay)이 Pod CIDR(Pod 주소 대역, 이 사례의 10.244.2.0/24) route를 알 수 있으면 원래 packet을 직접 보낼 수 있습니다.",
  },
  {
    label: "IP-in-IP",
    summary: "IPv4 header 하나 더",
    kind: "ipip",
    q1: "아니오",
    q2: "물리망이 Pod 경로를 아는가?",
    q2Answer: "알 수 없음",
    subnet: "",
    addresses: true,
    note: "물리망이 Pod 주소를 모르면 node 주소 사이의 바깥 packet으로 감쌉니다. IP-in-IP는 원래 IPv4 packet 앞에 IPv4 header를 하나 더 붙입니다. 감싸기는 암호화와 같은 뜻이 아닙니다.",
  },
  {
    label: "VXLAN",
    summary: "UDP 4789로 감쌈",
    kind: "vxlan",
    q1: "아니오",
    q2: "물리망이 Pod 경로를 아는가?",
    q2Answer: "알 수 없음",
    subnet: "",
    addresses: true,
    note: "VXLAN은 Ethernet frame을 VXLAN·UDP·IP header로 감싸며 기본 UDP port 4789를 씁니다. 물리망은 바깥의 node 주소만 보고 운반합니다.",
  },
  {
    label: "CrossSubnet · 같은 subnet",
    summary: "직접 보냄",
    kind: "direct",
    q1: "아니오",
    q2: "두 node가 같은 subnet인가?",
    q2Answer: "예(가정)",
    subnet: "같은 subnet(가정)",
    addresses: false,
    note: "CrossSubnet은 같은 subnet의 node끼리는 직접 보냅니다. 감싸지 않으니 그만큼 overhead(덧붙는 비용)가 줄어듭니다.",
  },
  {
    label: "CrossSubnet · 다른 subnet",
    summary: "이 구간만 감쌈",
    kind: "vxlan",
    q1: "아니오",
    q2: "두 node가 같은 subnet인가?",
    q2Answer: "아니오(가정)",
    subnet: "다른 subnet(가정)",
    addresses: false,
    note: "다른 subnet일 때만 감쌉니다. 그림은 이 글의 설치 예시인 VXLANCrossSubnet을 따랐습니다. 실제 mode는 cluster 선언과 route·interface를 대조해 확인합니다.",
  },
];

const BLUE = "#2563eb";
const AMBER = "#d97706";
const LINE = "#94a3b8";
const TEXT = "#64748b";

function Box({ x, y, w, h, lines, on }: { x: number; y: number; w: number; h: number; lines: readonly string[]; on: boolean }) {
  const mid = y + h / 2;
  const start = lines.length === 1 ? mid + 4 : mid - 3;
  return (
    <g opacity={on ? 1 : 0.45}>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="none" stroke={on ? BLUE : LINE} strokeWidth={1} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={start + index * 13} textAnchor="middle" fontSize={11} fill={on ? BLUE : TEXT} fontWeight={on && index === 0 ? 700 : 400}>
          {line}
        </text>
      ))}
    </g>
  );
}

function PathMap({ kind, subnet, addresses }: { kind: Kind; subnet: string; addresses: boolean }) {
  const same = kind === "same";
  const wrapped = kind === "ipip" || kind === "vxlan";
  const across = !same;
  return (
    <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label="두 node와 물리망 위의 packet 경로">
      <text x={8} y={14} fontSize={12} fontWeight={700} fill={TEXT}>{addresses ? "node A · 192.0.2.11" : "node A"}</text>
      <text x={196} y={14} fontSize={12} fontWeight={700} fill={TEXT}>{addresses ? "node B · 192.0.2.12" : "node B"}</text>
      <rect x={6} y={20} width={160} height={106} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
      <rect x={194} y={20} width={160} height={106} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
      <rect x={6} y={142} width={348} height={26} rx={4} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={14} y={159} fontSize={11} fill={TEXT}>물리망</text>
      <text x={346} y={159} textAnchor="end" fontSize={11} fontWeight={700} fill={TEXT}>{subnet}</text>

      <Box x={14} y={28} w={102} h={36} lines={["client Pod", "10.244.1.12"]} on />
      <Box x={14} y={68} w={102} h={36} lines={["다른 Pod(가정)", "10.244.1.21"]} on={same} />
      <Box x={126} y={28} w={32} h={76} lines={["host", "route"]} on />
      <Box x={126} y={110} w={32} h={14} lines={[]} on={across} />
      <text x={142} y={121} textAnchor="middle" fontSize={10} fill={across ? BLUE : TEXT}>NIC</text>

      <Box x={202} y={28} w={32} h={76} lines={["host", "route"]} on={across} />
      <Box x={244} y={28} w={102} h={36} lines={["server Pod", "10.244.2.34"]} on={across} />
      <Box x={202} y={110} w={32} h={14} lines={[]} on={across} />
      <text x={218} y={121} textAnchor="middle" fontSize={10} fill={across ? BLUE : TEXT}>NIC</text>

      <line x1={116} x2={126} y1={46} y2={46} stroke={BLUE} strokeWidth={1.25} />
      {same && <line x1={116} x2={126} y1={86} y2={86} stroke={BLUE} strokeWidth={1.25} />}
      {across && (
        <>
          <line x1={142} x2={142} y1={104} y2={110} stroke={BLUE} strokeWidth={1.25} />
          <line x1={218} x2={218} y1={104} y2={110} stroke={BLUE} strokeWidth={1.25} />
          <line x1={234} x2={244} y1={46} y2={46} stroke={BLUE} strokeWidth={1.25} />
          <path
            d="M142 124 V155 H218 V124"
            fill="none"
            stroke={wrapped ? AMBER : BLUE}
            strokeWidth={1.25}
            strokeDasharray={wrapped ? "4 3" : undefined}
          />
          {wrapped && (
            <>
              <text x={120} y={136} textAnchor="end" fontSize={11} fontWeight={700} fill={AMBER}>감쌈</text>
              <text x={240} y={136} fontSize={11} fontWeight={700} fill={AMBER}>벗김</text>
            </>
          )}
        </>
      )}
    </svg>
  );
}

function PacketGlyph({ kind, addresses }: { kind: Kind; addresses: boolean }) {
  const inner = (
    <span className="block rounded-md border border-blue-600 bg-background px-2 py-1 text-center font-mono text-xs leading-5 text-blue-700 dark:text-blue-300">
      {kind === "same" ? "10.244.1.12 → 10.244.1.21" : "10.244.1.12 → 10.244.2.34"}
    </span>
  );
  const outer = addresses ? "192.0.2.11 → 192.0.2.12" : "node A → node B";
  if (kind === "same" || kind === "direct") {
    return <div>{inner}</div>;
  }
  return (
    <div className="rounded-md border border-dashed border-amber-600 p-1.5">
      <p className="px-1 pb-1 font-mono text-xs leading-5 text-amber-700 dark:text-amber-300">
        {kind === "ipip" ? `바깥 IPv4 ${outer}` : `바깥 IP ${outer} · UDP 4789 · VXLAN`}
      </p>
      {kind === "vxlan" ? (
        <div className="rounded-md border border-border p-1.5">
          <p className="px-1 pb-1 text-xs leading-5 text-muted-foreground">Ethernet frame</p>
          {inner}
        </div>
      ) : (
        inner
      )}
    </div>
  );
}

export default function CalicoPathMapViz() {
  return (
    <SceneShell
      eyebrow="경로의 갈림"
      title="목적지 Pod가 어디 있고 물리망이 무엇을 아는지가 길을 가릅니다"
      description="위는 길을 가르는 질문, 그림은 packet이 지나는 칸, 아래는 packet의 모양입니다. 주황 점선 구간에서 물리망은 바깥 주소만 봅니다."
      ariaLabel="같은 node, 직접 라우팅, IP-in-IP, VXLAN, CrossSubnet 경로 비교"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        return (
          <div className="space-y-3">
            <dl className="grid gap-1 text-xs leading-5 sm:grid-cols-2 sm:gap-3 sm:text-sm">
              <div className="flex items-baseline justify-between gap-2 border-b border-border pb-1">
                <dt className="text-muted-foreground">같은 node인가?</dt>
                <dd className="font-bold">{item.q1}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2 border-b border-border pb-1">
                <dt className="text-muted-foreground">{item.q2}</dt>
                <dd className="shrink-0 font-bold">{item.q2Answer}</dd>
              </div>
            </dl>
            <PathMap kind={item.kind} subnet={item.subnet} addresses={item.addresses} />
            <PacketGlyph kind={item.kind} addresses={item.addresses} />
          </div>
        );
      }}
    />
  );
}
