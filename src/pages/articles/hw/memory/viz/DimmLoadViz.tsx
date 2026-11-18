import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dimm-electrical-load — UDIMM은 controller가 DRAM load를 직접 구동,
 * RDIMM은 RCD가 command/address를 받아 다시 구동, 3DS는 die 적층, MRDIMM은 두 rank data를 multiplex.
 * DRAM 8개·적층 4단·블록 개수는 그림을 위한 가정입니다.
 */
const SCENES = [
  {
    label: "UDIMM",
    summary: "controller → DRAM 8개 직접",
    note: "Buffer가 없어 controller의 command/address 선이 module 위 DRAM마다 직접 닿습니다. DRAM이 늘수록 controller가 혼자 구동해야 하는 load도 늘어납니다.",
  },
  {
    label: "RDIMM",
    summary: "controller → RCD 1개 → DRAM",
    note: "RCD(Registering Clock Driver)가 command/address를 받아 DRAM 쪽으로 다시 구동합니다. Controller 쪽에서 보면 닿는 곳이 RCD 하나로 줄어듭니다.",
  },
  {
    label: "3DS RDIMM",
    summary: "RCD 뒤에 DRAM die 적층",
    note: "RCD 뒤의 DRAM 자리마다 die를 쌓아 module 하나의 capacity를 늘립니다. 이 stacked die를 logical rank로 다룹니다.",
  },
  {
    label: "MRDIMM",
    summary: "두 rank data를 번갈아 보냄",
    note: "두 rank가 내놓는 data stream을 multiplex해 한 줄로 번갈아 보냅니다. 지원 platform에서 transfer rate를 높이려는 구조입니다.",
  },
] as const;

const CTRL = "#475569";
const CA = "#dc2626";
const RCD = "#7c3aed";
const DRAM = "#2563eb";
const R0 = "#2563eb";
const R1 = "#d97706";
const MUTED = "#94a3b8";

const CHIPS = Array.from({ length: 8 }, (_, i) => 120 + i * 28);
const CHIP_W = 22;
const BUS_Y = 132;
const CHIP_Y = 150;
const CHIP_H = 30;

function Controller() {
  return (
    <g>
      <rect x={6} y={74} width={74} height={40} rx={6} fill="none" stroke={CTRL} strokeWidth={1.25} />
      <text x={43} y={91} textAnchor="middle" fontSize={10} fontWeight={700} fill={CTRL}>memory</text>
      <text x={43} y={105} textAnchor="middle" fontSize={10} fontWeight={700} fill={CTRL}>controller</text>
    </g>
  );
}

function Chips({ stacked }: { stacked: boolean }) {
  return (
    <g>
      {CHIPS.map((x) =>
        stacked ? (
          <g key={x}>
            {[0, 1, 2, 3].map((layer) => (
              <rect key={layer} x={x} y={CHIP_Y + layer * 7.5} width={CHIP_W} height={6} fill={DRAM} fillOpacity={0.25} stroke={DRAM} strokeWidth={0.75} />
            ))}
          </g>
        ) : (
          <rect key={x} x={x} y={CHIP_Y} width={CHIP_W} height={CHIP_H} fill={DRAM} fillOpacity={0.18} stroke={DRAM} strokeWidth={1} />
        ),
      )}
      <text x={CHIPS[0]} y={194} fontSize={10} fill={DRAM}>
        {stacked ? "DRAM 자리마다 die 4단 (가정)" : "DRAM 8개 (가정)"}
      </text>
    </g>
  );
}

function Bus({ color }: { color: string }) {
  return (
    <g>
      <line x1={CHIPS[0] + CHIP_W / 2} x2={CHIPS[7] + CHIP_W / 2} y1={BUS_Y} y2={BUS_Y} stroke={color} strokeWidth={1.25} />
      {CHIPS.map((x) => (
        <line key={x} x1={x + CHIP_W / 2} x2={x + CHIP_W / 2} y1={BUS_Y} y2={CHIP_Y} stroke={color} strokeWidth={1} />
      ))}
    </g>
  );
}

function Registered({ stacked }: { stacked: boolean }) {
  return (
    <g>
      <Controller />
      <path d="M 80 94 L 100 94 L 100 66 L 196 66" fill="none" stroke={CA} strokeWidth={1.25} />
      <rect x={196} y={50} width={72} height={32} rx={5} fill={RCD} fillOpacity={0.14} stroke={RCD} strokeWidth={1.25} />
      <text x={232} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill={RCD}>RCD</text>
      <line x1={232} x2={232} y1={82} y2={BUS_Y} stroke={RCD} strokeWidth={1.25} />
      <Bus color={RCD} />
      <Chips stacked={stacked} />
      <text x={86} y={58} fontSize={9} fill={CA}>controller가 닿는 곳 1개</text>
      <text x={238} y={110} fontSize={10} fill={RCD}>다시 구동</text>
    </g>
  );
}

function Mux() {
  // 두 rank의 블록 2개씩이 그대로 한 줄 4개가 됩니다. multiplex는 data를 늘리지 않고 순서만 엮습니다.
  const out = [0, 1, 0, 1] as const;
  return (
    <g>
      <Controller />
      <rect x={270} y={34} width={82} height={30} rx={5} fill={R0} fillOpacity={0.14} stroke={R0} strokeWidth={1.25} />
      <text x={311} y={53} textAnchor="middle" fontSize={11} fontWeight={700} fill={R0}>rank 0</text>
      <rect x={270} y={128} width={82} height={30} rx={5} fill={R1} fillOpacity={0.14} stroke={R1} strokeWidth={1.25} />
      <text x={311} y={147} textAnchor="middle" fontSize={11} fontWeight={700} fill={R1}>rank 1</text>
      <path d="M 270 49 L 222 49 L 222 76" fill="none" stroke={R0} strokeWidth={1} />
      <path d="M 270 143 L 222 143 L 222 112" fill="none" stroke={R1} strokeWidth={1} />
      {[0, 1].map((i) => (
        <rect key={`a-${i}`} x={236 + i * 16} y={43} width={10} height={12} fill={R0} fillOpacity={0.5} stroke={R0} strokeWidth={0.75} />
      ))}
      {[0, 1].map((i) => (
        <rect key={`b-${i}`} x={236 + i * 16} y={137} width={10} height={12} fill={R1} fillOpacity={0.5} stroke={R1} strokeWidth={0.75} />
      ))}
      <rect x={190} y={76} width={64} height={36} rx={5} fill="none" stroke={CTRL} strokeWidth={1.25} />
      <text x={222} y={98} textAnchor="middle" fontSize={10} fontWeight={700} fill={CTRL}>multiplex</text>
      <line x1={80} x2={190} y1={94} y2={94} stroke={CTRL} strokeWidth={1} />
      {out.map((rank, i) => (
        <rect key={i} x={92 + i * 15} y={88} width={10} height={12} fill={rank === 0 ? R0 : R1} fillOpacity={0.5} stroke={rank === 0 ? R0 : R1} strokeWidth={0.75} />
      ))}
      <text x={92} y={124} fontSize={10} fill={CTRL}>한 줄에 0·1을 번갈아</text>
      <text x={6} y={194} fontSize={10} fill={MUTED}>data 흐름만 그렸습니다 · 블록 수는 가정</text>
    </g>
  );
}

function Unbuffered() {
  return (
    <g>
      <Controller />
      <path d={`M 80 94 L 100 94 L 100 ${BUS_Y} L ${CHIPS[0] + CHIP_W / 2} ${BUS_Y}`} fill="none" stroke={CA} strokeWidth={1.25} />
      <Bus color={CA} />
      <Chips stacked={false} />
      <text x={104} y={120} fontSize={10} fill={CA}>controller 선이 DRAM마다 닿음</text>
    </g>
  );
}

export default function DimmLoadViz() {
  return (
    <SceneShell
      eyebrow="DIMM type"
      title="Controller가 직접 몇 곳을 구동하느냐가 갈립니다"
      description="왼쪽이 CPU 쪽 memory controller, 오른쪽이 module 위 DRAM입니다. 앞의 세 장면은 command/address 선만, 마지막 장면은 data 흐름만 그렸습니다."
      note="개수와 적층 단수는 그림을 위한 가정입니다. 지원 type·rank·DPC 조합은 CPU·board 문서가 정합니다."
      ariaLabel="UDIMM, RDIMM, 3DS RDIMM, MRDIMM에서 controller와 DRAM 사이 연결 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Unbuffered />}
          {active === 1 && <Registered stacked={false} />}
          {active === 2 && <Registered stacked />}
          {active === 3 && <Mux />}
        </svg>
      )}
    />
  );
}
