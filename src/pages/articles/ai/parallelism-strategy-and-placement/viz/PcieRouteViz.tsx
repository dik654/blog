import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fabric-tiers — NVSwitch node는 모든 쌍이 같은 속도, PCIe node는 두 GPU의 위치에 따라 경로가 다릅니다.
 * socket 2개·socket당 switch 1개·switch당 GPU 4장은 그림을 위한 가정입니다. 경로별 비용 차이의 크기는
 * 글에 수치가 없어 길이로 그리지 않습니다.
 */
const W = 360;
const H = 176;
const GPU_W = 34;
const GPU_Y = 136;
const gpuX = (index: number) => 16 + index * 42 + (index >= 4 ? 8 : 0);
const gpuMid = (index: number) => gpuX(index) + GPU_W / 2;

const SW = [gpuMid(0) + 63 - 25, gpuMid(4) + 63 - 25] as const;
const CPU_Y = 48;
const SW_Y = 92;
const BOX_W = 50;

const SCENES = [
  { label: "NVSwitch node", summary: "모든 쌍이 같은 속도", note: "GPU 8장이 모두 NVSwitch에 붙어 있어 어떤 두 장을 골라도 같은 속도로 통신합니다. 900 GB/s는 switch 전체가 아니라 GPU 한 장의 NVLink 대역폭입니다.", mode: "nv" },
  { label: "PCIe · 같은 switch 아래 (PIX)", summary: "GPU → switch → GPU", note: "NVLink가 없으면 GPU끼리 PCIe로 이어집니다. 그림의 같은 switch 아래 두 장은 switch 하나만 거칩니다.", mode: "pix" },
  { label: "PCIe · socket을 넘음 (SYS)", summary: "CPU 두 개를 지남", note: "다른 socket의 GPU로 가면 경로가 CPU root complex(CPU 쪽 PCIe 연결부)를 지나 길어집니다. 경로가 다르므로 고정 latency α와 대역폭 B도 달라집니다.", mode: "sys" },
  { label: "PCIe · P2P가 꺼진 경우", summary: "host memory 경유", note: "GPU끼리 직접 보내는 P2P가 꺼지면 데이터가 host memory를 거칩니다. nvidia-smi topo로 경로를, NCCL 로그로 실제 transport를 확인합니다.", mode: "host" },
] as const;

function Box({ x, y, w, label, on }: { x: number; y: number; w: number; label: string; on: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={24} rx={4} fill={on ? "#2563eb" : "none"} fillOpacity={on ? 0.14 : 0} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={on ? 1.25 : 1} />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" fontSize={10} fontWeight={on ? 700 : 400} fill={on ? "#2563eb" : "#64748b"}>{label}</text>
    </g>
  );
}

function Gpus({ on }: { on: readonly number[] }) {
  return (
    <>
      {Array.from({ length: 8 }, (_, index) => (
        <Box key={index} x={gpuX(index)} y={GPU_Y} w={GPU_W} label={`G${index}`} on={on.includes(index)} />
      ))}
    </>
  );
}

function PathLine({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#2563eb" strokeWidth={1.25} />;
}

function Faint({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#94a3b8" strokeWidth={1} />;
}

const swMid = (index: 0 | 1) => SW[index] + BOX_W / 2;

function NvNode() {
  const y = 64;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="GPU 8장이 모두 NVSwitch 하나에 붙은 구조">
      {Array.from({ length: 8 }, (_, index) => <Faint key={index} d={`M${gpuMid(index)} ${GPU_Y}V${y + 24}`} />)}
      <PathLine d={`M${gpuMid(0)} ${GPU_Y}V${y + 24}M${gpuMid(5)} ${GPU_Y}V${y + 24}`} />
      <Box x={16} y={y} w={W - 32} label="NVSwitch · GPU당 900 GB/s" on />
      <Gpus on={[0, 5]} />
    </svg>
  );
}

const BUS_Y = SW_Y + 32;
const CPU_BOTTOM = CPU_Y + 24;
const SW_BOTTOM = SW_Y + 24;

function PcieNode({ mode }: { mode: "pix" | "sys" | "host" }) {
  const on = mode === "sys" ? [0, 4] : [0, 1];
  const left = swMid(0);
  const right = swMid(1);
  const cpuLink = `M${left + BOX_W / 2} ${CPU_Y + 12}H${right - BOX_W / 2}`;
  const gpuToSwitch = (gpu: number, sw: number) => `M${gpuMid(gpu)} ${GPU_Y}V${BUS_Y}H${sw}V${SW_BOTTOM}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={mode === "pix" ? "같은 PCIe switch 아래 두 GPU의 경로" : mode === "sys" ? "CPU socket을 넘는 두 GPU의 경로" : "P2P가 꺼져 host memory를 거치는 경로"}>
      {Array.from({ length: 8 }, (_, index) => <Faint key={index} d={gpuToSwitch(index, index < 4 ? left : right)} />)}
      <Faint d={`M${left} ${SW_Y}V${CPU_BOTTOM}M${right} ${SW_Y}V${CPU_BOTTOM}`} />
      <Faint d={cpuLink} />
      {mode !== "sys" && <PathLine d={`${gpuToSwitch(0, left)}${gpuToSwitch(1, left)}`} />}
      {mode === "sys" && <PathLine d={`${gpuToSwitch(0, left)}${gpuToSwitch(4, right)}M${left} ${SW_Y}V${CPU_BOTTOM}M${right} ${SW_Y}V${CPU_BOTTOM}${cpuLink}`} />}
      {mode === "host" && <PathLine d={`M${left} ${SW_Y}V${CPU_BOTTOM}M${left} ${CPU_Y}V26`} />}
      <Box x={left - BOX_W / 2} y={CPU_Y} w={BOX_W} label="CPU 0" on={mode !== "pix"} />
      <Box x={right - BOX_W / 2} y={CPU_Y} w={BOX_W} label="CPU 1" on={mode === "sys"} />
      {mode === "host" && <Box x={left - 45} y={2} w={90} label="host memory" on />}
      <Box x={SW[0]} y={SW_Y} w={BOX_W} label="switch" on />
      <Box x={SW[1]} y={SW_Y} w={BOX_W} label="switch" on={mode === "sys"} />
      <Gpus on={on} />
    </svg>
  );
}

export default function PcieRouteViz() {
  return (
    <SceneShell
      eyebrow="node 안의 경로"
      title="NVSwitch는 어느 두 장이든 같지만, PCIe는 두 장의 위치가 경로를 정합니다"
      description="socket 2개, switch 2개, switch당 4장은 그림을 위한 배치(가정)입니다. 파란 선이 G 두 장 사이 경로입니다."
      ariaLabel="NVSwitch node와 PCIe node에서 두 GPU 사이 경로 비교"
      scenes={SCENES}
      render={(index) => {
        const { mode } = SCENES[index];
        return mode === "nv" ? <NvNode /> : <PcieNode mode={mode} />;
      }}
    />
  );
}
