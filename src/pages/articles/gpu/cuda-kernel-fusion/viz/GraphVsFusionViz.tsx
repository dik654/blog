import FusionSceneShell from "./FusionSceneShell";

/**
 * 본문 대응: #release-gate 끝 — fusion은 kernel 사이 HBM traffic과 GPU 실행 시간을, CUDA graph는 짧은 kernel을
 * 낼 때마다 드는 CPU launch 제출 비용을 줄인다. 둘은 함께 적용할 수 있고 graph는 fusion 뒤 남은 제출 비용을 줄인다.
 * 위 줄 = CPU가 낸 제출, 아래 줄 = GPU에서 실행되는 kernel(파랑)과 kernel 사이 HBM 중간값 왕복(주황).
 * kernel 6개, 이웃 두 개씩 합쳐 3개가 되는 구성과 칸 폭은 가정. 시간 눈금이 아니다.
 */
const SCENES = [
  {
    label: "기준: 짧은 kernel 여섯 개",
    summary: "제출 6 · kernel 6 · 중간 왕복 5",
    note: "CPU는 kernel마다 launch를 제출하고, GPU에서는 kernel이 끝날 때마다 중간값을 HBM에 썼다가 다음 kernel이 다시 읽습니다.",
    fused: false,
    graph: false,
  },
  {
    label: "Fusion만: GPU 쪽 줄이 짧아집니다",
    summary: "제출 3 · kernel 3 · 중간 왕복 2",
    note: "이웃한 두 kernel을 하나로 합치면 그 사이의 HBM 왕복이 사라집니다. kernel 수가 줄어 제출도 줄지만 남은 세 kernel은 여전히 하나씩 제출합니다.",
    fused: true,
    graph: false,
  },
  {
    label: "Graph만: CPU 쪽 제출이 한 번으로 줄어듭니다",
    summary: "제출 1 · kernel 6 · 중간 왕복 5",
    note: "graph는 setup을 instantiate 때 한 번 내고 이후 replay 한 번으로 kernel 여섯 개를 띄웁니다. GPU 쪽 kernel과 HBM 왕복은 그대로입니다.",
    fused: false,
    graph: true,
  },
  {
    label: "둘 다: 서로 다른 줄을 각각 줄입니다",
    summary: "제출 1 · kernel 3 · 중간 왕복 2",
    note: "fusion으로 GPU 쪽 중간 왕복과 kernel 수를 줄인 뒤, 남은 launch 제출 비용을 graph가 마저 줄입니다. 두 방법은 경쟁하지 않고 같은 workload에 함께 적용할 수 있습니다.",
    fused: true,
    graph: true,
  },
] as const;

const W = 340;
const H = 148;
const X0 = 62;
const CPU_Y = 30;
const GPU_Y = 92;
const KW = 30;
const HW = 10;

export default function GraphVsFusionViz() {
  return (
    <FusionSceneShell
      eyebrow="Fusion · CUDA graph"
      title="Fusion은 GPU 쪽을, CUDA graph는 CPU 제출 쪽을 줄입니다"
      description="위 줄은 CPU가 내는 launch 제출, 아래 줄은 GPU의 kernel(파랑)과 kernel 사이 HBM 중간값 왕복(주황)입니다. kernel 여섯 개와 칸 폭은 가정이며 시간 눈금이 아닙니다."
      ariaLabel="fusion과 CUDA graph가 각각 줄이는 GPU 실행과 CPU 제출 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const kernels = scene.fused ? 3 : 6;
        const kernelW = scene.fused ? KW * 2 : KW;
        const gpuParts = Array.from({ length: kernels * 2 - 1 }, (_, part) => part);
        const partX = (part: number) => X0 + Math.floor((part + 1) / 2) * kernelW + Math.floor(part / 2) * HW;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={6} y={CPU_Y + 4} fontSize={11} fontWeight={700} fill="#334155">CPU 제출</text>
            <text x={6} y={GPU_Y + 4} fontSize={11} fontWeight={700} fill="#334155">GPU 실행</text>
            <line x1={X0} x2={334} y1={CPU_Y + 14} y2={CPU_Y + 14} stroke="#e2e8f0" strokeWidth={1} />
            <line x1={X0} x2={334} y1={GPU_Y + 18} y2={GPU_Y + 18} stroke="#e2e8f0" strokeWidth={1} />
            {scene.graph ? (
              <g>
                <rect x={X0} y={CPU_Y - 10} width={86} height={20} rx={4} fill="#ede9fe" stroke="#7c3aed" strokeWidth={1} />
                <text x={X0 + 43} y={CPU_Y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#5b21b6">graph replay</text>
              </g>
            ) : (
              Array.from({ length: kernels }, (_, index) => (
                <g key={index}>
                  <rect x={X0 + index * 32} y={CPU_Y - 10} width={26} height={20} rx={4} fill="#f1f5f9" stroke="#475569" strokeWidth={1} />
                  <text x={X0 + index * 32 + 13} y={CPU_Y + 4} textAnchor="middle" fontSize={10} fill="#334155">L{index + 1}</text>
                </g>
              ))
            )}
            {gpuParts.map((part) => {
              const isKernel = part % 2 === 0;
              const x = partX(part);
              return isKernel ? (
                <g key={part}>
                  <rect x={x} y={GPU_Y - 12} width={kernelW} height={24} rx={4} fill="#dbeafe" stroke="#2563eb" strokeWidth={1} />
                  <text x={x + kernelW / 2} y={GPU_Y + 4} textAnchor="middle" fontSize={10} fill="#1e3a8a">{scene.fused ? `K${part + 1}+${part + 2}` : `K${part / 2 + 1}`}</text>
                </g>
              ) : (
                <rect key={part} x={x} y={GPU_Y - 8} width={HW} height={16} rx={2} fill="#fde68a" stroke="#b45309" strokeWidth={1} />
              );
            })}
            <text x={6} y={136} fontSize={10} fill="#64748b">
              {scene.fused ? "합친 칸 = 이웃 두 kernel의 계산 · 사이 주황 칸 사라짐" : "주황 칸 = 중간값 HBM write + read"}
            </text>
          </svg>
        );
      }}
    />
  );
}
