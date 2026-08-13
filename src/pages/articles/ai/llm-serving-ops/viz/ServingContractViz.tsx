import VizFrame from "@/components/viz/VizFrame";

const path = [
  ["Request contract", "prompt · output cap · tools"],
  ["Gateway", "eligible route · deadline"],
  ["Runtime", "queue · prefill · decode"],
  ["GPU capacity", "ready replica · KV budget"],
] as const;

export default function ServingContractViz() {
  return (
    <VizFrame
      eyebrow="Serving contract"
      title="한 요청의 지연과 실패를 계층별로 분해합니다"
      description="아래 경로를 따라 요청이 이동하고, 각 계층의 timestamp와 상태는 같은 request ID로 다시 관측 계층에 모입니다."
      note="Runtime 내부의 batching·scheduler·KV cache 원리는 vLLM 정본 글이 소유합니다. 이 글은 그 신호를 배포·routing·autoscaling 결정으로 연결합니다."
    >
      <div className="grid gap-4 md:grid-cols-4">
        {path.map(([title, body], index) => (
          <div key={title} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{title}</p>
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
            </div>
            <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-7 grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-3">
        <div>
          <p className="text-xs font-bold text-foreground">사용자 경험</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            TTFT · TPOT · completion · error
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">수요와 압력</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            arrival · waiting · prompt/output length
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">실행 provenance</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            alias · deployment · artifact · fallback
          </p>
        </div>
      </div>
    </VizFrame>
  );
}
