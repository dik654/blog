import VizFrame from "@/components/viz/VizFrame";

const items = [
  ["Token IDs", "[B, N]", "tokenizer output"],
  ["Position signal", "[N, D]", "order·distance cue"],
  ["Attention mask", "broadcast → [B,H,N,N]", "read visibility"],
  ["Loss mask", "[B, N]", "gradient target"],
] as const;

export default function InputContractViz() {
  return (
    <VizFrame
      eyebrow="Tensor boundary"
      title="같은 sequence에 붙는 입력이라도 역할과 broadcast 축이 다릅니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([name, shape, role]) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs text-primary">
              {shape}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {role}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
