import VizFrame from "@/components/viz/VizFrame";

const formats = [
  ["XML", "의미 있는 section과 반복 문서", "nesting·escaping·parser policy"],
  ["JSON + Schema", "typed API payload", "field·type·enum validation"],
  ["Markdown", "사람이 읽는 보고서", "heading·citation rubric"],
  ["Plain text", "짧고 단순한 요청", "구분자와 acceptance criteria"],
] as const;

export default function OverviewDetailViz() {
  return (
    <VizFrame
      eyebrow="Format decision"
      title="모델 이름이 아니라 최종 consumer와 검증 방식으로 format을 고릅니다"
      description="XML은 여러 선택지 중 하나입니다. 구조가 필요 없는 요청이라면 태그를 늘리지 않는 편이 더 읽기 쉽습니다."
    >
      <div className="grid gap-7 sm:grid-cols-2">
        {formats.map(([format, fit, check], index) => (
          <section key={format} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="text-sm font-bold">{format}</h4>
              <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              적합 · {fit}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              검증 · {check}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
