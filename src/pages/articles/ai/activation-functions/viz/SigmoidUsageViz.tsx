import VizFrame from "@/components/viz/VizFrame";

const usages = [
  { name: "Binary output", contract: "σ(logit)", reason: "Bernoulli probability" },
  { name: "Multi-label", contract: "class별 σ", reason: "독립 label probability" },
  { name: "Recurrent gate", contract: "forget · input · output", reason: "0–1 통과 비율" },
  { name: "Learned gate", contract: "value ⊙ σ(gate)", reason: "feature별 조건부 통과" },
] as const;

export default function SigmoidUsageViz() {
  return (
    <VizFrame eyebrow="Current roles" title="Sigmoid는 hidden 기본값에서 밀려났지만 probability와 gate에는 남아 있습니다" description="같은 0–1 범위라도 output의 통계적 의미와 내부 정보 흐름의 의미를 구분합니다.">
      <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2">
        {usages.map((item, index) => (
          <div key={item.name} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-baseline justify-between gap-4"><p className="text-xs font-bold text-foreground">{item.name}</p><span className="font-mono text-[10px] font-bold text-primary">0{index + 1}</span></div>
            <p className="mt-2 break-words font-mono text-xs text-primary">{item.contract}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.reason}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
