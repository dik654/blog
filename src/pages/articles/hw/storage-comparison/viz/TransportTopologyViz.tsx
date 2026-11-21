import SceneShell from "./SceneShell";

/**
 * 본문 대응: #io-path — SATA(ATA command·SATA link·NCQ, point-to-point), SAS(SCSI command, dual-port·expander를
 * 제공할 수 있음), NVMe(queue 중심 protocol, PCIe·fabric transport; PCIe에서 SQ·CQ는 host 메모리, doorbell로 알림). drive 수·queue 수는 예시.
 */
const SCENES = [
  {
    label: "SATA",
    summary: "ATA command · host와 drive 1:1",
    note: "SATA는 ATA command를 SATA link로 보냅니다. 선 하나가 host port와 drive 하나를 잇는 point-to-point 모양입니다. NCQ(native command queuing)는 여러 명령을 대기시킵니다. 칸 수는 예시입니다.",
  },
  {
    label: "SAS",
    summary: "SCSI command · expander·dual-port",
    note: "SAS는 SCSI command를 씁니다. expander는 한 연결을 여러 drive로 가르고, dual-port는 drive 하나에 길 두 개가 닿게 합니다. SAS는 이를 제공할 수 있지만 이름만으로 보장되지는 않습니다.",
  },
  {
    label: "NVMe",
    summary: "queue 중심 · PCIe 또는 fabric",
    note: "NVMe는 queue 중심 protocol이며 PCIe에 직접 붙거나 fabric transport로 network 너머에 닿습니다. PCIe에서는 submission·completion queue가 host 메모리에 있고, host가 doorbell register에 써서 알리면 drive가 명령을 가져갑니다(controller 메모리에 queue를 두는 선택지도 있습니다). 칸 수는 예시입니다. 오른쪽 장치가 모두 SSD여도 이 차이는 그대로입니다.",
  },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const SLATE = "#64748b";
const LINE = "#94a3b8";

const W = 360;
const H = 200;

function Box({ x, y, w, h, label, sub, stroke = LINE, dashed = false }: { x: number; y: number; w: number; h: number; label: string; sub?: string; stroke?: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={stroke} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 2 : y + h / 2 + 4} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="currentColor">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" fontSize={9.5} fill={SLATE}>{sub}</text>}
    </g>
  );
}

function Queue({ x, y, slots }: { x: number; y: number; slots: number }) {
  return (
    <g>
      {Array.from({ length: slots }, (_, i) => (
        <rect key={i} x={x + i * 11} y={y} width={9} height={14} rx={2} fill={AMBER} opacity={0.75} />
      ))}
    </g>
  );
}

function Sata() {
  return (
    <g>
      <Box x={12} y={76} w={84} h={44} label="host" sub="SATA port" />
      <line x1={96} y1={98} x2={262} y2={98} stroke={BLUE} strokeWidth={1.25} />
      <text x={179} y={90} textAnchor="middle" fontSize={10.5} fill="currentColor">ATA command</text>
      <text x={179} y={114} textAnchor="middle" fontSize={10} fill={SLATE}>SATA link 1개 (point-to-point)</text>
      <Box x={262} y={76} w={86} h={44} label="drive" sub="1대" stroke={BLUE} />
      <Queue x={262} y={130} slots={4} />
      <text x={262} y={160} fontSize={10} fill={AMBER}>NCQ: 명령 여러 개 대기</text>
    </g>
  );
}

function Sas() {
  const drives = [22, 82, 142];
  return (
    <g>
      <Box x={8} y={30} w={70} h={36} label="host port A" />
      <Box x={8} y={128} w={70} h={36} label="host port B" />
      <Box x={112} y={30} w={74} h={36} label="expander" />
      <Box x={112} y={128} w={74} h={36} label="expander" />
      <line x1={78} y1={48} x2={112} y2={48} stroke={BLUE} strokeWidth={1.25} />
      <line x1={78} y1={146} x2={112} y2={146} stroke={AMBER} strokeWidth={1.25} />
      {drives.map((y) => (
        <g key={y}>
          <line x1={186} y1={48} x2={262} y2={y + 12} stroke={BLUE} strokeWidth={1} />
          <line x1={186} y1={146} x2={262} y2={y + 24} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
          <Box x={262} y={y} w={86} h={36} label="drive" sub="port 2개" />
        </g>
      ))}
      <text x={149} y={94} textAnchor="middle" fontSize={10} fill={SLATE}>한 연결 → 여러 drive</text>
      <text x={149} y={108} textAnchor="middle" fontSize={10} fill={SLATE}>drive마다 길 두 개</text>
      <text x={8} y={192} fontSize={10} fill={SLATE}>SCSI command · 구성 예시 (가정)</text>
    </g>
  );
}

function Nvme() {
  return (
    <g>
      <rect x={12} y={14} width={100} height={110} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={62} y={30} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="currentColor">host</text>
      <text x={62} y={43} textAnchor="middle" fontSize={9.5} fill={SLATE}>메모리</text>
      <g>
        {[0, 1, 2].map((r) => (
          <Queue key={r} x={22} y={54 + r * 18} slots={3} />
        ))}
        <text x={58} y={66} fontSize={10} fill={AMBER}>SQ·CQ</text>
        <text x={58} y={80} fontSize={9} fill={AMBER}>(개수 예시)</text>
      </g>
      <line x1={112} y1={62} x2={262} y2={62} stroke={BLUE} strokeWidth={1.25} />
      <text x={187} y={54} textAnchor="middle" fontSize={10.5} fill="currentColor">PCIe에 직접</text>
      <text x={187} y={78} textAnchor="middle" fontSize={9.5} fill={SLATE}>doorbell → drive가 가져감</text>
      <Box x={262} y={40} w={86} h={44} label="NVMe drive" sub="NVM subsystem" stroke={BLUE} />
      <path d="M54 124 V164 H130" fill="none" stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" />
      <line x1={204} y1={164} x2={262} y2={164} stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" />
      <rect x={130} y={152} width={74} height={24} rx={12} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={167} y={168} textAnchor="middle" fontSize={10} fill="currentColor">network</text>
      <text x={100} y={190} fontSize={10} fill={SLATE}>fabric transport</text>
      <Box x={262} y={146} w={86} h={36} label="NVMe target" sub="원격" dashed />
    </g>
  );
}

export default function TransportTopologyViz() {
  return (
    <SceneShell
      eyebrow="command · transport · 연결 모양"
      title="SATA, SAS, NVMe는 선이 이어지는 모양부터 다릅니다"
      description="왼쪽은 명령을 보내는 host, 오른쪽은 저장 장치이며, 선은 명령이 지나는 길입니다. 세 장면을 같은 자리에 두고 넘겨 보며 비교합니다."
      ariaLabel="SATA의 1대1 link와 NCQ, SAS의 expander와 dual-port, NVMe의 host 메모리 queue와 PCIe 또는 fabric 연결"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Sata />}
          {active === 1 && <Sas />}
          {active === 2 && <Nvme />}
        </svg>
      )}
    />
  );
}
