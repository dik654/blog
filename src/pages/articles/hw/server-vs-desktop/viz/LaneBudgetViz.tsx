import SceneShell from "./SceneShell";

/**
 * 본문 대응: 도입 사례의 숫자 절 — (가정) GPU 네 개 × 16 lane = 64 lane, 여기에 NIC·NVMe가 더해지고,
 * 합계가 맞아도 어느 root·slot·socket에 연결되는지가 실제 폭과 locality를 정한다.
 * NIC·NVMe의 lane 수는 글에 없으므로 눈금 위 길이로 그리지 않는다.
 */
const GPU_COUNT = 4;
const LANES_PER_GPU = 16;
const GPU_LANES = GPU_COUNT * LANES_PER_GPU;

const W = 360;
const H = 200;
const LEFT = 20;
const BAR_W = W - 2 * LEFT;
const SEG_W = BAR_W / GPU_COUNT;

const SCENES = [
  {
    label: "GPU만 세어도",
    summary: `${LANES_PER_GPU} × ${GPU_COUNT} = ${GPU_LANES} lane`,
    note: "lane은 주변 장치가 쓰는 PCIe 확장 통로 한 가닥입니다. (가정) GPU 네 개가 각각 16 lane을 요구하면 GPU만으로 64 lane이 필요합니다.",
  },
  {
    label: "NIC·NVMe도 길을 요구합니다",
    summary: `${GPU_LANES} + NIC + NVMe`,
    note: "고속 NIC와 NVMe도 각각 lane을 요구합니다. 글은 그 수를 정하지 않으므로 칸 길이 없이 더할 항목으로만 표시했습니다. CPU의 총 lane 수가 이 합계 이상이어야 하는 것이 첫 조건입니다.",
  },
  {
    label: "합계가 맞아도 연결 위치",
    summary: "공유한 길 → 실제 폭 감소",
    note: "root는 CPU에서 장치 쪽 PCIe 길이 갈라져 나오는 출발점입니다. (가정) 도입 사례에서는 네 장 모두 OS에 보였지만 두 슬롯이 다른 장치와 길을 나눠 실제 전송 폭이 줄었습니다. 어느 두 슬롯인지는 예시입니다.",
  },
  {
    label: "한 socket 뒤에 몰리면",
    summary: "socket을 넘는 접근 = NUMA 비용",
    note: "NUMA(non-uniform memory access)는 processor와 memory의 가까움에 따라 접근 비용이 달라지는 구조입니다. Lane 합계가 맞아도 모든 장치가 같은 socket 뒤에 몰리면 memory와 network locality가 나빠질 수 있습니다.",
  },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const SLATE = "#64748b";
const LINE = "#94a3b8";

function Box({ x, y, w, h, label, sub, stroke = LINE, dashed = false, muted = false }: { x: number; y: number; w: number; h: number; label: string; sub?: string; stroke?: string; dashed?: boolean; muted?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={stroke} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 2 : y + h / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={muted ? SLATE : "currentColor"}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" fontSize={10} fill={SLATE}>
          {sub}
        </text>
      )}
    </g>
  );
}

function LaneBar({ showExtra }: { showExtra: boolean }) {
  return (
    <g>
      <text x={LEFT} y={30} fontSize={11} fill={SLATE}>
        요구 lane (칸 하나 = GPU 한 개의 16 lane)
      </text>
      {Array.from({ length: GPU_COUNT }, (_, i) => (
        <g key={i}>
          <rect x={LEFT + i * SEG_W + 1} y={42} width={SEG_W - 2} height={34} rx={4} fill={BLUE} opacity={i % 2 === 0 ? 0.85 : 0.65} />
          <text x={LEFT + i * SEG_W + SEG_W / 2} y={63} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ffffff">
            GPU{i + 1} · 16
          </text>
        </g>
      ))}
      <text x={LEFT} y={96} fontSize={10} fill={SLATE}>0</text>
      <text x={LEFT + BAR_W} y={96} textAnchor="end" fontSize={10} fill={SLATE}>{GPU_LANES} lane</text>
      {showExtra ? (
        <g>
          <text x={LEFT} y={124} fontSize={11} fontWeight={600} fill="currentColor">+ 더할 항목 (lane 수는 글에 없음)</text>
          <Box x={LEFT} y={134} w={150} h={40} label="고속 NIC" sub="lane 수 미지정" stroke={AMBER} dashed />
          <Box x={LEFT + 170} y={134} w={150} h={40} label="NVMe" sub="lane 수 미지정" stroke={AMBER} dashed />
        </g>
      ) : (
        <text x={W / 2} y={140} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">
          {LANES_PER_GPU} × {GPU_COUNT} = {GPU_LANES} lane (GPU만)
        </text>
      )}
    </g>
  );
}

function SharedPath() {
  const cpu = { x: 130, y: 12, w: 100, h: 34 };
  const slotY = 152;
  const slotW = 70;
  const slotX = (i: number) => 14 + i * 84;
  const shared = { x: 232, y: 98 };
  return (
    <g>
      <Box x={cpu.x} y={cpu.y} w={cpu.w} h={cpu.h} label="CPU root" />
      {[0, 1].map((i) => (
        <line key={i} x1={cpu.x + 30 + i * 12} y1={cpu.y + cpu.h} x2={slotX(i) + slotW / 2} y2={slotY} stroke={BLUE} strokeWidth={1.25} />
      ))}
      <line x1={cpu.x + 70} y1={cpu.y + cpu.h} x2={shared.x} y2={shared.y} stroke={AMBER} strokeWidth={1.25} />
      {[2, 3].map((i) => (
        <line key={i} x1={shared.x} y1={shared.y} x2={slotX(i) + slotW / 2} y2={slotY} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
      ))}
      <line x1={shared.x} y1={shared.y} x2={316} y2={80} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
      <circle cx={shared.x} cy={shared.y} r={4} fill={AMBER} />
      <Box x={286} y={58} w={64} h={24} label="다른 장치" muted />
      <text x={shared.x - 8} y={shared.y + 4} textAnchor="end" fontSize={10} fill={AMBER}>나눠 쓰는 길</text>
      {Array.from({ length: GPU_COUNT }, (_, i) => (
        <Box key={i} x={slotX(i)} y={slotY} w={slotW} h={34} label={`GPU${i + 1}`} sub={i < 2 ? "제 폭" : "폭 감소"} stroke={i < 2 ? BLUE : AMBER} />
      ))}
      <text x={14} y={136} fontSize={10} fill={BLUE}>직접 연결</text>
    </g>
  );
}

function SocketSkew() {
  const sockets = [
    { x: 14, label: "socket 0" },
    { x: 206, label: "socket 1" },
  ];
  const devices = ["GPU1", "GPU2", "GPU3", "GPU4", "NIC", "NVMe"];
  return (
    <g>
      {sockets.map((s) => (
        <g key={s.label}>
          <Box x={s.x} y={10} w={140} h={26} label={`memory (${s.label})`} muted />
          <line x1={s.x + 70} y1={36} x2={s.x + 70} y2={50} stroke={LINE} strokeWidth={1} />
          <Box x={s.x} y={50} w={140} h={30} label={s.label} />
        </g>
      ))}
      <line x1={154} y1={65} x2={206} y2={65} stroke={AMBER} strokeWidth={1.25} strokeDasharray="4 3" />
      <text x={180} y={58} textAnchor="middle" fontSize={10} fill={AMBER}>socket 사이</text>
      {devices.map((d, i) => {
        const x = 8 + i * 32;
        return (
          <g key={d}>
            <line x1={84} y1={80} x2={x + 14} y2={140} stroke={BLUE} strokeWidth={1} />
            <rect x={x} y={140} width={28} height={30} rx={4} fill="none" stroke={BLUE} strokeWidth={1} />
            <text x={x + 14} y={159} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="currentColor">{d}</text>
          </g>
        );
      })}
      <text x={276} y={112} textAnchor="middle" fontSize={11} fill={SLATE}>연결된 장치 없음</text>
      <text x={276} y={150} textAnchor="middle" fontSize={10.5} fill={AMBER}>socket 1 memory를 쓰는 작업은</text>
      <text x={276} y={166} textAnchor="middle" fontSize={10.5} fill={AMBER}>socket을 건너 장치에 닿습니다</text>
      <text x={8} y={190} fontSize={10} fill={SLATE}>장치가 모두 socket 0 뒤 (가정)</text>
    </g>
  );
}

export default function LaneBudgetViz() {
  return (
    <SceneShell
      eyebrow="lane 계산과 연결 위치"
      title="lane 합계가 맞아도 어느 길에 꽂혔는지가 남습니다"
      description="도입 사례의 (가정) 숫자를 그대로 씁니다. 앞 두 장면은 요구 lane을 세고, 뒤 두 장면은 같은 장치가 어느 root·socket 뒤에 연결되는지를 봅니다."
      ariaLabel="GPU 네 개의 64 lane 요구, NIC와 NVMe 추가, 공유된 길로 인한 폭 감소, 한 socket 쏠림"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active <= 1 && <LaneBar showExtra={active === 1} />}
          {active === 2 && <SharedPath />}
          {active === 3 && <SocketSkew />}
        </svg>
      )}
    />
  );
}
