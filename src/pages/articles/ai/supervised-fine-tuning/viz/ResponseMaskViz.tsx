import VizFrame from "@/components/viz/VizFrame";

const tokens = [
  ["<user>", "context", "0"],
  ["질문", "context", "0"],
  ["<assistant>", "boundary", "0"],
  ["답", "target", "1"],
  ["변", "target", "1"],
  ["<eos>", "target", "1"],
];

export default function ResponseMaskViz() {
  return (
    <VizFrame
      eyebrow="Response-only loss"
      title="Prompt는 읽되 response target만 채점합니다"
      description="Attention context에 남는지와 gradient target인지가 서로 다른 상태임을 token별로 표시합니다."
      note="Attention mask와 loss mask를 같은 tensor 의미로 취급하면 prompt 재생·padding loss 같은 silent bug가 생깁니다."
    >
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/70 bg-border/60 sm:grid-cols-3 lg:grid-cols-6">
        {tokens.map(([token, role, mask]) => (
          <div key={token} className="min-w-0 bg-background p-3">
            <p className="break-all font-mono text-xs font-semibold text-foreground">{token}</p>
            <p className="mt-3 text-[11px] text-muted-foreground">{role}</p>
            <p className="mt-1 font-mono text-xs font-bold text-primary">mask {mask}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
