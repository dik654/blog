import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gpudirect-topology — NVLink 없는 PCIe 노드의 두 확인.
 * (1) ib_write_bw --use_cuda와 host 메모리 전송의 대역폭이 비슷한지,
 * (2) NCCL 2.4.2부터 NCCL_NET_GDR_READ 기본값은 NVLink 플랫폼에서만 1, 그 밖에서 0 →
 *     0이면 보내는 데이터가 CPU 메모리를 거쳐 NIC로 간다. 1이 PCIe에서 조금 느릴 수 있어 같은 collective로 비교한다.
 * 그림은 보내는 쪽만 그립니다. 대역폭 숫자는 본문에 없으므로 적지 않습니다.
 */
type Edge = "gpuNic" | "gpuCpu" | "cpuNic";

const SCENES = [
  { label: "직접 등록이 되는지부터", summary: "--use_cuda ≈ host 메모리?", edges: ["gpuNic", "cpuNic"] as Edge[], dashed: false, note: "RTX PRO 6000처럼 NVIDIA 문서가 GPUDirect RDMA 지원을 제품명으로 적지 않은 카드는 지원을 가정하지 않습니다. 노드마다 ib_write_bw --use_cuda로 GPU 메모리를 직접 등록해 보내 보고, host 메모리로 보낸 대역폭과 비슷하게 나오는지 봅니다." },
  { label: "NCCL 기본값 0", summary: "GPU → CPU 메모리 → NIC", edges: ["gpuCpu", "cpuNic"] as Edge[], dashed: false, note: "NCCL 2.4.2부터 NCCL_NET_GDR_READ 기본값은 NVLink 플랫폼에서만 1이고 그 밖에서는 0입니다. 0이면 보내는 데이터를 먼저 CPU 메모리에 옮긴 뒤 NIC로 넘깁니다. 앞 장면의 확인이 끝났어도 PCIe 노드의 보내는 쪽은 GPU 메모리를 직접 읽지 않습니다." },
  { label: "1로 명시하면", summary: "GPU → NIC 직접 읽기", edges: ["gpuNic"] as Edge[], dashed: false, note: "NIC가 보내는 데이터를 GPU 메모리에서 직접 읽습니다. 다만 NCCL 문서는 PCIe 같은 플랫폼에서 GPU 메모리를 직접 읽는 쪽이 조금 느릴 수 있다고도 적습니다." },
  { label: "같은 collective로 비교", summary: "기본값 실행 vs 1 실행", edges: ["gpuCpu", "cpuNic", "gpuNic"] as Edge[], dashed: true, note: "어느 길이 빠른지 미리 정하지 않습니다. 같은 collective를 기본값(0)과 1로 각각 실행해 결과를 비교한 뒤 고릅니다." },
] as const;

const BLUE = "#2563eb";
const MUTED = "#cbd5e1";

function Box({ x, y, title, sub }: { x: number; y: number; title: string; sub: string }) {
  return (
    <g>
      <rect x={x} y={y} width={100} height={42} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={x + 50} y={y + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{title}</text>
      <text x={x + 50} y={y + 33} textAnchor="middle" fontSize={11.5} fill="#64748b">{sub}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, on, dashed }: { x1: number; y1: number; x2: number; y2: number; on: boolean; dashed: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = (offset: number) => `${x2 - 8 * Math.cos(angle + offset)},${y2 - 8 * Math.sin(angle + offset)}`;
  const color = on ? BLUE : MUTED;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed && on ? "5 4" : undefined} />
      <polygon points={`${x2},${y2} ${head(0.45)} ${head(-0.45)}`} fill={color} />
    </g>
  );
}

export default function GdrReadPathViz() {
  return (
    <SceneShell
      eyebrow="PCIe 노드 · 보내는 쪽"
      title="보내는 데이터가 GPU 메모리에서 NIC까지 가는 두 길"
      description="NVLink가 없는 PCIe 노드 한 대에서 보내는 쪽만 그렸습니다. NCCL_NET_GDR_READ는 보내는 데이터를 NIC가 GPU 메모리에서 직접 읽을지 정하는 NCCL 환경 변수입니다. 대역폭 숫자는 본문에 없어 적지 않았습니다."
      ariaLabel="ib_write_bw 확인, NCCL_NET_GDR_READ 기본값 0과 1의 보내는 경로, 같은 collective 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const on = (edge: Edge) => scene.edges.includes(edge);
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <Box x={130} y={10} title="CPU 메모리" sub="host 메모리" />
              <Box x={10} y={124} title="GPU 메모리" sub="보낼 buffer" />
              <Box x={250} y={124} title="NIC" sub="RoCE로 송신" />
              <Arrow x1={110} y1={145} x2={248} y2={145} on={on("gpuNic")} dashed={scene.dashed} />
              <Arrow x1={70} y1={122} x2={148} y2={54} on={on("gpuCpu")} dashed={scene.dashed} />
              <Arrow x1={212} y1={54} x2={290} y2={122} on={on("cpuNic")} dashed={scene.dashed} />
              <text x={180} y={138} textAnchor="middle" fontSize={11.5} fill={on("gpuNic") ? BLUE : "#94a3b8"}>{index === 0 ? "--use_cuda" : "직접 읽기 (1)"}</text>
              <text x={92} y={80} textAnchor="end" fontSize={11.5} fill={on("gpuCpu") ? BLUE : "#94a3b8"}>먼저 옮김 (0)</text>
              <text x={268} y={80} textAnchor="start" fontSize={11.5} fill={on("cpuNic") ? BLUE : "#94a3b8"}>{index === 0 ? "host 메모리" : "넘김 (0)"}</text>
            </svg>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs">
              {index === 0 ? (
                <>
                  <p className="rounded-lg border border-border p-2"><strong className="block">GPU 메모리 등록</strong><span className="text-muted-foreground">ib_write_bw --use_cuda</span></p>
                  <p className="rounded-lg border border-border p-2"><strong className="block">host 메모리</strong><span className="text-muted-foreground">같은 명령, 비교 기준</span></p>
                </>
              ) : (
                <>
                  <p className={`rounded-lg border p-2 ${index === 1 || index === 3 ? "border-[#2563eb]" : "border-border text-muted-foreground"}`}><strong className="block">기본값 0</strong><span className="text-muted-foreground">CPU 메모리를 거침</span></p>
                  <p className={`rounded-lg border p-2 ${index === 2 || index === 3 ? "border-[#2563eb]" : "border-border text-muted-foreground"}`}><strong className="block">1로 명시</strong><span className="text-muted-foreground">GPU 메모리를 직접 읽음</span></p>
                </>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
