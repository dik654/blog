import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function RdmaPathViz() {
  return (
    <HardwareViz
      title="RDMA는 control을 없애지 않고 반복 payload movement를 NIC에 맡깁니다"
      description="Memory registration과 queue setup은 host가 소유하고, NIC DMA 뒤 completion과 recovery가 다시 host로 돌아옵니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <HardwareNode
          title="Register memory"
          detail="range · access · lkey/rkey · lifetime"
          tone="violet"
        />
        <HardwareArrow label="post" />
        <HardwareNode
          title="Work queue"
          detail="operation · address · length"
          tone="blue"
        />
        <HardwareArrow label="DMA" />
        <HardwareNode
          title="NIC · transport"
          detail="packet · retry · congestion"
          tone="emerald"
        />
        <HardwareArrow label="complete" />
        <HardwareNode
          title="Host recovery"
          detail="CQ · timeout · reconnect"
          tone="amber"
        />
      </div>
    </HardwareViz>
  );
}
