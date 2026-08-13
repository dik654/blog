import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function InterconnectPathViz() {
  return (
    <HardwareViz
      title="GPU memory에서 remote GPU memory까지의 실제 path"
      description="Node 안 peer path와 node 밖 network path가 연결되며, 각 구간의 폭·공유·latency를 따로 측정합니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <HardwareNode
          title="GPU memory"
          detail="source buffer · stream dependency"
          tone="violet"
        />
        <HardwareArrow label="NVLink or PCIe" />
        <HardwareNode
          title="PCIe topology"
          detail="switch · root · NUMA · ACS"
          tone="blue"
        />
        <HardwareArrow label="GPUDirect" />
        <HardwareNode
          title="HCA · NIC"
          detail="DMA queue · link port"
          tone="emerald"
        />
        <HardwareArrow label="fabric" />
        <HardwareNode
          title="Remote GPU"
          detail="route · remote topology"
          tone="amber"
        />
      </div>
    </HardwareViz>
  );
}
