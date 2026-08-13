import VizFrame from "@/components/viz/VizFrame";

const choices = [
  ["LSTM", "C와 h 분리 · 4 affine blocks", "긴 state control·널리 지원되는 fused kernel", "parameter·state traffic 증가"],
  ["GRU", "h 하나 · 3 affine blocks", "더 작은 recurrent cell", "LSTM보다 항상 우수하다는 보장 없음"],
  ["BiLSTM", "forward + backward recurrent pass", "전체 sequence encoding·tagging", "causal/streaming에는 미래 누출"],
  ["Modern alternatives", "attention·SSM·gated long conv", "parallel training·long context", "state semantics와 serving path가 서로 다름"],
];

export default function RecurrentChoiceViz() {
  return (
    <VizFrame
      eyebrow="Architecture decision"
      title="Recurrent unit 이름보다 causality, state budget와 parallelism을 먼저 고릅니다"
      description="같은 dataset에서도 latency, streaming 여부와 sequence length가 달라지면 적합한 operator가 달라집니다."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {choices.map(([name, structure, fit, caution]) => (
          <article key={name} className="rounded-lg border border-border/70 bg-background p-4">
            <p className="font-semibold text-foreground">{name}</p>
            <p className="mt-2 font-mono text-xs leading-5 text-primary">{structure}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">적합: {fit}</p>
            <p className="mt-3 border-t border-border/60 pt-3 text-xs leading-5 text-foreground/70">경계: {caution}</p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}
