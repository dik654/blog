import ContentBoundary from "@/components/articles/content-boundary";
import NetworkLearningFlowViz, { type NetworkFlowMode } from "./viz/NetworkLearningFlowViz";

type RouteFlowMode = Exclude<NetworkFlowMode, "fundamentals">;

const COPY: Record<RouteFlowMode, { eyebrow: string; title: string; lead: string; boundary: "gpu-interconnects" | "rdma-roce" | "gpu-collective-network" }> = {
  interconnect: {
    eyebrow: "먼저 한 GPU의 buffer가 node 밖으로 나가는 길을 봅니다",
    title: "GPU interconnect는 PCIe·NVLink라는 이름보다 실제 device pair의 경로입니다",
    lead: "GPU memory에서 출발한 byte가 같은 node의 peer GPU 또는 HCA에 도달하려면 switch·root complex·NUMA 경계를 지납니다. 먼저 한 구간씩 그린 뒤 raw bandwidth, topology와 node-local/network 경계를 조합합니다.",
    boundary: "gpu-interconnects",
  },
  rdma: {
    eyebrow: "먼저 등록한 memory range 하나와 NIC의 DMA를 봅니다",
    title: "RDMA는 CPU를 없애는 기술이 아니라 control과 반복 data movement를 분리하는 방법입니다",
    lead: "CPU는 memory range와 권한, queue와 completion을 준비하고 NIC는 그 계약 안에서 payload를 DMA합니다. 이 작은 경계에서 시작해 key lifetime·RoCE GID·GPU direct path를 순서대로 붙입니다.",
    boundary: "rdma-roce",
  },
  collective: {
    eyebrow: "먼저 rank 하나가 collective에 내놓는 buffer를 봅니다",
    title: "GPU collective network는 rank 계약과 실제 local·remote path를 함께 측정합니다",
    lead: "All-reduce는 단순한 대용량 전송이 아닙니다. 모든 rank가 같은 operation·count·datatype·순서로 참여하고, node 안 NVLink와 node 밖 HCA·fabric을 지나야 끝납니다. 마지막에는 algbw·busbw와 wire counter를 분리합니다.",
    boundary: "gpu-collective-network",
  },
};

export default function NetworkRouteIntro({ mode }: { mode: RouteFlowMode }) {
  const copy = COPY[mode];
  return (
    <section id="overview" className="mb-16 scroll-mt-20 space-y-7">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">{copy.eyebrow}</p><h2 className="text-3xl font-bold tracking-tight">{copy.title}</h2></header>
      <p className="text-lg leading-8 text-foreground/90">{copy.lead}</p>
      <NetworkLearningFlowViz mode={mode} />
      <ContentBoundary article={copy.boundary} />
    </section>
  );
}
