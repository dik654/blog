import VizFrame from "@/components/viz/VizFrame";

const levels = [
  ["Ground-truth label", "ROC-AUC · AP/PR-AUC", "score ranking 비교"],
  ["Review budget", "Precision@k · recall · 조사 시간", "alert policy 비교"],
  ["Label 없음", "blind review · slice 안정성 · drift", "가설을 좁히는 증거"],
] as const;

export default function EvaluationBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Evaluation ladder"
      title="사용 가능한 정답 신호에 따라 주장할 수 있는 범위가 달라집니다"
      description="Unsupervised라는 말은 평가까지 정답 없이 가능하다는 뜻이 아닙니다."
    >
      <div className="space-y-3">
        {levels.map(([signal, metric, claim], index) => (
          <div key={signal} className="grid min-w-0 gap-2 rounded-lg border border-border/70 bg-background p-4 sm:grid-cols-[2rem_1fr_1fr] sm:items-center sm:gap-4">
            <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
            <div className="min-w-0"><p className="text-sm font-bold text-foreground">{signal}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{metric}</p></div>
            <p className="border-t border-border/60 pt-2 text-xs leading-5 text-foreground/75 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">{claim}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
