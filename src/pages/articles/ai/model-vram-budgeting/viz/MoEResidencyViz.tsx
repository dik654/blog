import VizFrame from "@/components/viz/VizFrame";

const LEDGERS = [
  {
    title: "Stored / resident",
    question: "GPU에 들어가는가?",
    value: "total checkpoint bytes",
    includes: "all experts · shared weights · scales",
    excludes: "token당 활성 FLOPs",
  },
  {
    title: "Active path",
    question: "한 token이 무엇을 계산하는가?",
    value: "selected experts + shared path",
    includes: "routing · active GEMM · communication",
    excludes: "전체 memory capacity",
  },
  {
    title: "Request / runtime",
    question: "Context와 batch가 무엇을 더하는가?",
    value: "KV/state + workspace",
    includes: "prefill · decode · MTP runtime state",
    excludes: "checkpoint headline만의 추정",
  },
] as const;

export default function MoEResidencyViz() {
  return (
    <VizFrame
      eyebrow="MoE serving ledgers"
      title="Total parameter와 active parameter는 서로 다른 질문에 답합니다"
      description="같은 model을 capacity·token path·request runtime의 세 장부로 나눠야 ‘들어간다’와 ‘빠르다’를 섞지 않습니다."
      note="Active parameter가 작아도 inactive expert weights의 residency, routing·all-to-all과 긴-context state는 사라지지 않습니다."
    >
      <div data-viz-canvas className="grid gap-px overflow-hidden border border-border/70 bg-border/60 md:grid-cols-3">
        {LEDGERS.map((ledger, index) => (
          <section key={ledger.title} className="min-w-0 bg-background p-5">
            <p className="font-mono text-[10px] font-black text-primary">
              LEDGER {String(index + 1).padStart(2, "0")}
            </p>
            <h4 className="mt-2 text-base font-black">{ledger.title}</h4>
            <p className="mt-4 text-xs font-semibold text-foreground">{ledger.question}</p>
            <p className="mt-2 break-words border-l border-primary/50 pl-3 font-mono text-xs leading-5 text-primary">
              {ledger.value}
            </p>
            <dl className="mt-5 space-y-3 border-t border-border/60 pt-4 text-xs leading-5">
              <div>
                <dt className="font-bold">포함</dt>
                <dd className="mt-1 text-muted-foreground">{ledger.includes}</dd>
              </div>
              <div>
                <dt className="font-bold">단독으로 답하지 못함</dt>
                <dd className="mt-1 text-muted-foreground">{ledger.excludes}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
