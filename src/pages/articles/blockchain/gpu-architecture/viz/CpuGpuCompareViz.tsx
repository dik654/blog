import { Arrow, GpuFlow, GpuNode } from "./GpuArchitectureVizPrimitives";

export default function CpuGpuCompareViz() {
  return (
    <GpuFlow
      title="CPU와 GPU는 같은 연산을 서로 다른 방식으로 숨깁니다"
      description="CPU는 한 thread의 지연을 낮추는 자원에, GPU는 많은 독립 작업으로 지연을 가리는 자원에 더 큰 비중을 둡니다."
    >
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <section className="min-w-0 border-l border-slate-400/60 pl-4">
          <p className="text-sm font-bold">CPU · latency 중심</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <GpuNode title="큰 core" detail="분기 예측 · out-of-order" />
            <Arrow />
            <GpuNode
              title="짧은 single-thread 시간"
              detail="복잡한 control flow"
              tone="control"
            />
          </div>
        </section>
        <section className="min-w-0 border-l border-emerald-400/60 pl-4">
          <p className="text-sm font-bold">GPU · throughput 중심</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <GpuNode
              title="많은 resident warps"
              detail="독립 thread state"
              tone="compute"
            />
            <Arrow />
            <GpuNode
              title="높은 총 처리량"
              detail="stall 동안 다른 warp issue"
              tone="memory"
            />
          </div>
        </section>
      </div>
    </GpuFlow>
  );
}
