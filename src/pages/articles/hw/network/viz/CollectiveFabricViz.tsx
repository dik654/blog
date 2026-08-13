import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function CollectiveFabricViz() {
  return (
    <HardwareViz
      title="Collective 완료 시간은 rank에서 remote rank까지의 합성 path입니다"
      description="노드 안 NVLink·PCIe와 노드 밖 HCA·switch가 같은 operation의 연속 구간을 이룹니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <HardwareNode
          title="Rank · GPU"
          detail="count · datatype · stream"
          tone="violet"
        />
        <HardwareArrow label="local path" />
        <HardwareNode
          title="NVLink · PCIe"
          detail="peer topology · shared root"
          tone="blue"
        />
        <HardwareArrow label="HCA" />
        <HardwareNode
          title="Switched fabric"
          detail="route · congestion · failure"
          tone="emerald"
        />
        <HardwareArrow label="reduce/deliver" />
        <HardwareNode
          title="All ranks complete"
          detail="time · algbw · busbw"
          tone="amber"
        />
      </div>
    </HardwareViz>
  );
}
