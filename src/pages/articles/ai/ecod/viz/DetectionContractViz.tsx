import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Reference rows", "정상·이상이 섞인 비교 집단", "분포를 정하는 데이터"],
  ["Continuous score", "클수록 tail에서 드문 row", "검토 순서를 정하는 값"],
  ["Decision policy", "threshold·review budget", "업무 행동으로 바꾸는 규칙"],
] as const;

export default function DetectionContractViz() {
  return (
    <VizFrame
      eyebrow="Detection contract"
      title="ECOD가 만드는 것은 label이 아니라 검토 우선순위입니다"
      description="Detector가 만든 evidence와 조직이 정한 action policy를 분리해야 contamination을 실제 이상 비율로 오해하지 않습니다."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {stages.map(([title, body, note], index) => (
          <div key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{title}</p>
              <span className="shrink-0 font-mono text-xs text-primary">0{index + 1}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            <p className="mt-4 border-t border-border/60 pt-3 text-xs leading-5 text-foreground/70">{note}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
