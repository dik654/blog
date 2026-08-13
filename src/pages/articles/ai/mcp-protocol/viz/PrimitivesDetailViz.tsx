import VizFrame from "@/components/viz/VizFrame";

const flow = [
  ["Describe", "inputSchema · optional outputSchema", "형태를 정의"],
  ["Validate", "Schema + domain rule + authorization", "실행 전에 검사"],
  ["Execute", "Domain operation + effect receipt", "업무를 수행"],
  ["Return", "complete · isError 또는 input_required", "다음 행동을 표시"],
] as const;

export default function PrimitivesDetailViz() {
  return (
    <VizFrame
      eyebrow="Typed Tool lifecycle"
      title="Schema-valid에서 끝나지 않고 업무 검증과 결과 상태까지 이어집니다"
      description="Protocol error와 tool execution error를 나누면 client와 model이 복구 가능한 실패만 수정해 재시도할 수 있습니다."
      note="List cache는 discovery 비용을 줄일 뿐, 실제 call 시점의 authorization을 생략하지 않습니다."
    >
      <ol className="grid gap-6 md:grid-cols-4">
        {flow.map(([label, body, outcome], index) => (
          <li key={label} className="min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            <h4 className="mt-2 text-sm font-bold">{label}</h4>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
            <p className="mt-3 text-xs font-semibold text-primary">{outcome}</p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
