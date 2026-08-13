import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function ContextViz() {
  return (
    <HardwareViz
      title="Workload에서 application completion까지의 network trace"
      description="Port 사양보다 먼저 traffic을 고정하고, topology와 transport를 거쳐 실제 완료 시간과 오류를 측정합니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <HardwareNode
          title="Traffic matrix"
          detail="endpoint · bytes · phase · burst"
          tone="neutral"
        />
        <HardwareArrow label="map" />
        <HardwareNode
          title="Device path"
          detail="GPU · PCIe · HCA affinity"
          tone="violet"
        />
        <HardwareArrow label="route" />
        <HardwareNode
          title="Fabric"
          detail="link · leaf · spine · congestion"
          tone="blue"
        />
        <HardwareArrow label="measure" />
        <HardwareNode
          title="Completion"
          detail="goodput · p99 · wait · recovery"
          tone="emerald"
        />
      </div>
    </HardwareViz>
  );
}
