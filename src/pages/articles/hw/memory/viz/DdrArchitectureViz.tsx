import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function DdrArchitectureViz() {
  return (
    <HardwareViz
      title="DDR5는 한 DIMM의 요청 경로를 두 subchannel로 나눕니다"
      description="Data width, transfer rate와 channel population을 분리해 대역폭을 계산하고, timing cycle은 nanosecond로 환산합니다."
    >
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <section className="min-w-0 border-l border-slate-400/60 pl-4">
          <p className="text-sm font-bold">DDR4 module path</p>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto_1fr]">
            <HardwareNode title="64-bit channel" detail="하나의 command path" />
            <HardwareArrow />
            <HardwareNode
              title="Burst"
              detail="channel data transfer"
              tone="amber"
            />
          </div>
        </section>
        <section className="min-w-0 border-l border-violet-400/60 pl-4">
          <p className="text-sm font-bold">DDR5 module path</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <HardwareNode
              title="Subchannel A"
              detail="독립 command · 32-bit data"
              tone="violet"
            />
            <HardwareNode
              title="Subchannel B"
              detail="독립 command · 32-bit data"
              tone="blue"
            />
          </div>
        </section>
      </div>
      <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-3">
        <HardwareNode
          title="이론 bandwidth"
          metric="MT/s × 8 B × channels"
          detail="전송 상한"
          tone="emerald"
        />
        <HardwareNode
          title="CAS time"
          metric="CL × clock period"
          detail="일부 timing만 환산"
          tone="amber"
        />
        <HardwareNode
          title="실제 결과"
          metric="GB/s · ns"
          detail="NUMA와 queue 포함"
          tone="rose"
        />
      </div>
    </HardwareViz>
  );
}
