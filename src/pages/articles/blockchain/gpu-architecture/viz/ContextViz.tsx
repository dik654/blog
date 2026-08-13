import { Arrow, GpuFlow, GpuNode } from "./GpuArchitectureVizPrimitives";

export default function ContextViz() {
  return (
    <GpuFlow
      title="CPU의 요청이 GPU 결과가 되어 돌아오는 고정 trace"
      description="프로그래밍 계층, 실행 계층, 저장 계층과 장치 밖 연결을 한 줄로 섞지 않고 순서대로 읽습니다."
      note="Grid·block·thread의 자세한 인덱싱은 CUDA thread hierarchy 정본 글에서 이어집니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <GpuNode
          title="CPU · runtime"
          detail="buffer 준비 · kernel launch"
          tone="host"
        />
        <Arrow label="command" />
        <GpuNode
          title="Grid · blocks"
          detail="논리 작업표와 resource 요구"
          tone="control"
        />
        <Arrow label="place" />
        <GpuNode
          title="SM · warps"
          detail="ready warp의 instruction issue"
          tone="compute"
        />
        <Arrow label="load/store" />
        <GpuNode
          title="Register → HBM"
          detail="가까운 상태부터 외부 memory까지"
          tone="memory"
        />
      </div>
    </GpuFlow>
  );
}
