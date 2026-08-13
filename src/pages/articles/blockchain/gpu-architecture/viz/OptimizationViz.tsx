import { Arrow, GpuFlow, GpuNode } from "./GpuArchitectureVizPrimitives";

export default function OptimizationViz() {
  return (
    <GpuFlow
      title="최적화는 peak 숫자가 아니라 가장 긴 실행 구간을 줄이는 일입니다"
      description="같은 kernel에서 instruction·memory byte·active warps를 측정한 뒤 병목에 해당하는 변화만 적용합니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <GpuNode
          title="Profiler evidence"
          detail="kernel time · stalls · bytes"
          tone="host"
        />
        <Arrow label="classify" />
        <GpuNode
          title="Bottleneck"
          detail="compute · latency · bandwidth"
          tone="risk"
        />
        <Arrow label="change one axis" />
        <GpuNode
          title="Achieved result"
          detail="same input · correct output"
          tone="compute"
        />
      </div>
      <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-3">
        <GpuNode
          title="Coalescing"
          detail="useful bytes / transactions"
          tone="memory"
        />
        <GpuNode
          title="Occupancy"
          detail="latency hiding resource budget"
          tone="control"
        />
        <GpuNode
          title="Fusion"
          detail="launch와 HBM round trip 감소"
          tone="compute"
        />
      </div>
    </GpuFlow>
  );
}
