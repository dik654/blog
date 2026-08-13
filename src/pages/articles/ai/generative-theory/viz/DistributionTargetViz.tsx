export default function DistributionTargetViz() {
  return (
    <figure
      data-viz="distribution-target"
      className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-sm font-bold">Training sample에서 새 sample까지</p>
      </figcaption>
      <div className="grid items-center gap-4 p-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:p-6">
        <Block title="Dataset" body="x₁, x₂, …, xₙ" />
        <Arrow />
        <Block
          title="Distribution model"
          body="pθ(x) 또는 sampling path"
          accent
        />
        <Arrow />
        <Block title="New sample" body="x̃ ∼ pθ" />
      </div>
      <p className="border-t border-border/60 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-6">
        Conditional generation은 가운데 model에 c를 함께 넣어 pθ(x|c)를
        학습합니다.
      </p>
    </figure>
  );
}
function Block({
  title,
  body,
  accent = false,
}: {
  title: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 text-center ${accent ? "border-primary/40 bg-primary/[0.05]" : "border-border/70 bg-background"}`}
    >
      <p className="text-sm font-bold">{title}</p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
function Arrow() {
  return (
    <span aria-hidden className="text-center text-sm text-muted-foreground">
      <span className="sm:hidden">↓</span>
      <span className="hidden sm:inline">→</span>
    </span>
  );
}
