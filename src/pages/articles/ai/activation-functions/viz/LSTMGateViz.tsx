import VizFrame from "@/components/viz/VizFrame";

const gates = [
  { name: "Forget gate", formula: "fₜ = σ(·)", role: "이전 cell을 얼마나 유지" },
  { name: "Input gate", formula: "iₜ = σ(·)", role: "새 candidate를 얼마나 반영" },
  { name: "Output gate", formula: "oₜ = σ(·)", role: "현재 state를 얼마나 노출" },
] as const;

export default function LSTMGateViz() {
  return (
    <VizFrame eyebrow="Role separation" title="Sigmoid는 비율을 정하고 tanh는 signed candidate를 만듭니다" description="두 activation은 대체 관계가 아니라 recurrent cell 안에서 출력 범위가 다른 역할을 맡습니다.">
      <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-12">
        <div className="min-w-0 divide-y divide-border/70 border-y border-border/70">
          {gates.map((gate) => <div key={gate.name} className="grid gap-2 py-4 sm:grid-cols-[1fr_7rem_1.2fr] sm:gap-5"><p className="text-xs font-bold text-foreground">{gate.name}</p><p className="font-mono text-xs text-primary">{gate.formula}</p><p className="text-xs leading-5 text-muted-foreground">{gate.role}</p></div>)}
        </div>
        <div className="min-w-0 border-l border-primary/50 pl-5"><p className="text-xs font-bold text-foreground">Candidate</p><p className="mt-2 font-mono text-lg font-bold text-primary">gₜ = tanh(·)</p><p className="mt-3 text-xs leading-5 text-muted-foreground">−1부터 1까지의 signed content를 만든 뒤 sigmoid gate와 곱합니다.</p></div>
      </div>
    </VizFrame>
  );
}
