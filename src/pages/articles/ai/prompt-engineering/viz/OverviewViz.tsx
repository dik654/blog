import VizFrame from "@/components/viz/VizFrame";

const fields = [
  ["Objective", "무엇을 바꿀 것인가"], ["Audience", "누가 결과를 쓰는가"],
  ["Evidence", "어떤 자료만 근거로 삼는가"], ["Constraints", "금지·범위·예산"],
  ["Output", "Field·type·format"], ["Completion", "어떻게 통과를 판정하는가"],
] as const;

export default function OverviewViz() {
  return (
    <VizFrame eyebrow="Request contract" title="모호한 요청을 여섯 개의 검증 가능한 질문으로 나눕니다" description="Prompt가 길어서가 아니라 필요한 계약 칸이 비거나 서로 충돌할 때 실패합니다.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([name, question], index) => (
          <section key={name} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-baseline justify-between gap-4"><h4 className="text-sm font-bold">{name}</h4><span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span></div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{question}</p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
