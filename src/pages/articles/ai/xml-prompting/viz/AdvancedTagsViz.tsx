import VizFrame from "@/components/viz/VizFrame";

const documents = [
  ["doc-01", "policy.md", "환불은 결제 후 7일 이내 신청합니다."],
  ["doc-02", "faq.md", "처리 상태는 계정 페이지에서 확인합니다."],
] as const;

export default function AdvancedTagsViz() {
  return (
    <VizFrame
      eyebrow="Repeated documents"
      title="반복되는 문서는 같은 구조와 안정적인 id로 묶습니다"
      description="source와 id를 데이터에 붙여 두면 답변의 근거를 특정하고, 후속 validator가 citation을 원문과 대조할 수 있습니다."
    >
      <div className="grid gap-7 lg:grid-cols-[1fr_13rem] lg:items-start">
        <div className="space-y-6">
          {documents.map(([id, source, excerpt]) => (
            <section key={id} className="min-w-0 border-t border-border/80 pt-4">
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
                <code className="text-xs font-bold text-primary">id={id}</code>
                <span className="min-w-0 text-xs text-muted-foreground [overflow-wrap:anywhere]">
                  source={source}
                </span>
              </div>
              <p className="mt-2 min-w-0 text-xs leading-5 text-foreground [overflow-wrap:anywhere]">
                {excerpt}
              </p>
            </section>
          ))}
        </div>
        <aside className="min-w-0 border-l border-border pl-4">
          <p className="text-[11px] font-bold text-muted-foreground">Answer receipt</p>
          <p className="mt-3 text-sm font-bold">7일 이내 신청</p>
          <p className="mt-2 text-xs leading-5 text-primary [overflow-wrap:anywhere]">
            citation · doc-01
          </p>
        </aside>
      </div>
    </VizFrame>
  );
}
