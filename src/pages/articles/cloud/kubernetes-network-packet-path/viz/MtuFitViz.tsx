import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mtu-egress — 1500 B 한도(가정) 안에 바깥 header와 안쪽 packet이 들어가는지.
 * 축: 0~54 B와 1465~1555 B를 같은 축척(2.3 단위/B)으로 그리고 가운데를 생략합니다.
 * 계산: 20 + 8 + 8 + 14 = 50, 1500 − 50 = 1450, 1500 − 20 = 1480, 1500 + 50 = 1550.
 * "작은 packet"의 크기는 글이 정하지 않아 생략 구간 안에서 끝나게 그립니다.
 */
const UNIT = 2.3;
const LEFT = 8;
const LEFT_END_B = 54;
const RIGHT_START_B = 1465;
const RIGHT_X = 148;
const BAR_Y = 42;
const BAR_H = 34;
const LIMIT = 1500;

const bx = (bytes: number) => (bytes <= LEFT_END_B ? LEFT + bytes * UNIT : RIGHT_X + (bytes - RIGHT_START_B) * UNIT);
const GAP_START = bx(LEFT_END_B);

type Scene = {
  label: string;
  summary: string;
  headers: readonly { size: number; color: string }[];
  inner: number | null;
  innerLabel: string;
  order: string;
  verdict: string;
  over: boolean;
  note: string;
};

const IPV4 = "#b45309";
const UDP = "#92400e";
const VX = "#a16207";
const ETH = "#78350f";
const VXLAN_HEADERS = [
  { size: 20, color: IPV4 },
  { size: 8, color: UDP },
  { size: 8, color: VX },
  { size: 14, color: ETH },
] as const;

const SCENES: readonly Scene[] = [
  {
    label: "직접 라우팅",
    summary: "1500 B 전부 사용",
    headers: [],
    inner: 1500,
    innerLabel: "안쪽 1500 B",
    order: "바깥 header 없음",
    verdict: "한도에 딱 맞음",
    over: false,
    note: "MTU는 한 번에 운반하는 최대 packet 크기입니다. 이 사례의 물리망은 1500 B로 가정했고, 바깥 header가 없으니 Pod가 그 전부를 쓸 수 있습니다.",
  },
  {
    label: "IP-in-IP",
    summary: "1500 − 20 = 1480 B",
    headers: [{ size: 20, color: IPV4 }],
    inner: 1480,
    innerLabel: "안쪽 1480 B",
    order: "왼쪽부터 바깥 IPv4 20",
    verdict: "한도에 딱 맞음",
    over: false,
    note: "바깥 IPv4 header 20 B를 앞에 붙이므로 안쪽 packet은 1480 B까지 쓸 수 있습니다.",
  },
  {
    label: "VXLAN · 안쪽을 줄이지 않으면",
    summary: "50 + 1500 = 1550 B",
    headers: VXLAN_HEADERS,
    inner: 1500,
    innerLabel: "안쪽 1500 B",
    order: "왼쪽부터 바깥 IPv4 20 · UDP 8 · VXLAN 8 · 안쪽 Ethernet 14",
    verdict: "50 B 초과",
    over: true,
    note: "안쪽 packet도 1500 B라면 바깥 header를 붙일 자리가 없습니다. 이 50 B를 미리 빼지 않으면 fragmentation(쪼개기)이나 drop(버림) 없이 운반할 수 없습니다.",
  },
  {
    label: "같은 설정의 작은 packet",
    summary: "작은 ping은 통과",
    headers: VXLAN_HEADERS,
    inner: null,
    innerLabel: "",
    order: "작은 packet의 크기는 설명용 가정이라 생략 구간에서 끝나게 그렸습니다",
    verdict: "한도 아래",
    over: false,
    note: "같은 설정에서도 작은 packet은 header를 더해도 한도 아래에 남습니다. 그래서 작은 ping은 되는데 큰 응답만 timeout이면 route가 아니라 이 한도와 ICMP(오류를 알리는 제어 message) 차단을 먼저 의심합니다.",
  },
  {
    label: "VXLAN · 안쪽을 줄이면",
    summary: "1500 − 50 = 1450 B",
    headers: VXLAN_HEADERS,
    inner: 1450,
    innerLabel: "안쪽 1450 B",
    order: "왼쪽부터 바깥 IPv4 20 · UDP 8 · VXLAN 8 · 안쪽 Ethernet 14",
    verdict: "한도에 딱 맞음",
    over: false,
    note: "이 사례의 workload interface가 1450 B인 이유입니다. 1450은 외울 상수가 아니라 이 경로의 뺄셈 결과이며, VLAN tag나 WireGuard처럼 header를 더 붙이는 층이 있으면 그 몫도 같은 자리에서 뺍니다.",
  },
];

function FitBar({ scene }: { scene: Scene }) {
  const headerTotal = scene.headers.reduce<number>((sum, header) => sum + header.size, 0);
  const headerEnds = scene.headers.map((_, index) =>
    scene.headers.slice(0, index + 1).reduce<number>((sum, header) => sum + header.size, 0),
  );
  const total = scene.inner === null ? null : headerTotal + scene.inner;
  const innerStart = bx(headerTotal);
  const limitX = bx(LIMIT);
  const midGap = (GAP_START + RIGHT_X) / 2;
  const fits = total === null || total <= LIMIT;

  return (
    <svg viewBox="0 0 360 104" className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      {/* 안쪽 packet */}
      <rect x={innerStart} y={BAR_Y} width={GAP_START - innerStart} height={BAR_H} fill="#2563eb" opacity={0.75} />
      {total === null ? (
        <rect x={GAP_START} y={BAR_Y} width={(midGap - GAP_START) * 0.8} height={BAR_H} fill="#2563eb" opacity={0.75} />
      ) : (
        <>
          <rect x={GAP_START} y={BAR_Y} width={RIGHT_X - GAP_START} height={BAR_H} fill="#2563eb" opacity={0.3} />
          <rect x={RIGHT_X} y={BAR_Y} width={Math.min(bx(total), limitX) - RIGHT_X} height={BAR_H} fill="#2563eb" opacity={0.75} />
          {!fits && <rect x={limitX} y={BAR_Y} width={bx(total) - limitX} height={BAR_H} fill="#dc2626" opacity={0.7} />}
          <text x={RIGHT_X + (Math.min(bx(total), limitX) - RIGHT_X) / 2} y={BAR_Y + 21} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
            {scene.innerLabel}
          </text>
          {!fits && (
            <text x={(limitX + bx(total)) / 2} y={BAR_Y + 21} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
              50 B 넘침
            </text>
          )}
        </>
      )}
      {/* 바깥 header */}
      {scene.headers.map((header, index) => {
        const end = headerEnds[index];
        const start = end - header.size;
        return (
          <g key={`${index}-${header.size}`}>
            <rect x={bx(start)} y={BAR_Y} width={header.size * UNIT} height={BAR_H} fill={header.color} stroke="#ffffff" strokeWidth={1} />
            <text x={bx(start) + (header.size * UNIT) / 2} y={BAR_Y + 21} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
              {header.size}
            </text>
          </g>
        );
      })}
      {/* 생략 표시 */}
      <text x={midGap} y={BAR_Y + BAR_H + 15} textAnchor="middle" fontSize={11} fill="#64748b">생략</text>
      <text x={LEFT} y={BAR_Y + BAR_H + 15} fontSize={11} fill="#64748b">0 B</text>
      {/* 한도 */}
      <line x1={limitX} x2={limitX} y1={22} y2={BAR_Y + BAR_H + 6} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
      <text x={limitX} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">물리망 한도 1500 B(가정)</text>
      <text x={limitX} y={BAR_Y + BAR_H + 18} textAnchor="middle" fontSize={11} fill="#dc2626">1500</text>
    </svg>
  );
}

export default function MtuFitViz() {
  return (
    <SceneShell
      eyebrow="크기 회계"
      title="바깥 header를 붙일 자리는 안쪽 packet에서 나옵니다"
      description="막대 왼쪽 끝이 packet의 시작입니다. 주황 칸은 바깥에 더한 header(숫자는 byte), 파란 칸은 Pod가 보낸 안쪽 packet입니다. 가운데 생략 구간을 빼면 양쪽은 같은 축척입니다."
      ariaLabel="직접 라우팅, IP-in-IP, VXLAN에서 header와 안쪽 packet이 1500 바이트 한도 안에 들어가는지 비교"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        return (
          <div>
            <FitBar scene={item} />
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs leading-5">
              <span className="min-w-0 text-muted-foreground">{item.order}</span>
              <span className={`shrink-0 font-bold ${item.over ? "text-red-700 dark:text-red-400" : "text-foreground"}`}>{item.verdict}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
