import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function ContextViz() {
  return (
    <HardwareViz
      title="요청이 DRAM에서 돌아오기까지의 메모리 선택 trace"
      description="용량 표가 아니라 CPU controller, channel, DIMM, DRAM과 운영 telemetry를 한 경로로 연결합니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <HardwareNode
          title="Workload"
          detail="working set · access locality"
          tone="neutral"
        />
        <HardwareArrow label="request" />
        <HardwareNode
          title="Controller · channel"
          detail="queue · interleave · NUMA"
          tone="blue"
        />
        <HardwareArrow label="command" />
        <HardwareNode
          title="DIMM · rank"
          detail="registered load · supported DPC"
          tone="violet"
        />
        <HardwareArrow label="read/write" />
        <HardwareNode
          title="DRAM + RAS"
          detail="data · ECC · error telemetry"
          tone="emerald"
        />
      </div>
    </HardwareViz>
  );
}
