import { Arrow, GpuFlow, GpuNode } from "./GpuArchitectureVizPrimitives";

export default function WarpScheduleViz() {
  return (
    <GpuFlow
      title="Memory wait를 없애는 대신 ready warp로 덮습니다"
      description="Scheduler는 같은 SM에 이미 resident인 warp 가운데 dependency가 풀린 warp의 instruction을 issue합니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <GpuNode
          title="Warp A · stalled"
          detail="HBM load 결과를 기다림"
          tone="risk"
        />
        <Arrow label="scheduler" />
        <GpuNode
          title="Warp B · ready"
          detail="독립 operand 준비 완료"
          tone="compute"
        />
        <Arrow label="issue" />
        <GpuNode
          title="Execution unit"
          detail="useful instruction 수행"
          tone="control"
        />
      </div>
      <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-3">
        <GpuNode
          title="Register 한도"
          detail="thread당 증가하면 resident warp 감소"
        />
        <GpuNode
          title="Shared-memory 한도"
          detail="block당 증가하면 resident block 감소"
        />
        <GpuNode
          title="Block/thread 한도"
          detail="architecture limit와 함께 최소값 결정"
        />
      </div>
    </GpuFlow>
  );
}
