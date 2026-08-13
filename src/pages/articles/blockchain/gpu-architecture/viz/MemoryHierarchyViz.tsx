import { Arrow, GpuFlow, GpuNode } from "./GpuArchitectureVizPrimitives";

export default function MemoryHierarchyViz() {
  return (
    <GpuFlow
      title="한 load가 가까운 저장소에서 끝날수록 HBM traffic이 줄어듭니다"
      description="아래 순서는 보편적인 고정 latency 표가 아니라 scope·capacity·traffic 비용이 달라지는 경계입니다."
      note="Register spill은 이름과 달리 chip 밖 별도 local RAM이 아니라 thread-private address가 device memory에 놓이는 현상입니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <GpuNode
          title="Register"
          detail="thread-private · operand"
          tone="compute"
        />
        <Arrow label="spill/reuse" />
        <GpuNode
          title="Shared · L1"
          detail="block 협업 · SM-local cache"
          tone="control"
        />
        <Arrow label="miss" />
        <GpuNode title="L2" detail="chip-wide · 모든 SM 공유" tone="memory" />
        <Arrow label="miss" />
        <GpuNode
          title="HBM / GDDR"
          detail="큰 용량 · 높은 latency"
          tone="risk"
        />
      </div>
    </GpuFlow>
  );
}
