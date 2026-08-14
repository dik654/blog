const nodes = [
  { level: "L0", items: ["input x", "constant 5"] },
  { level: "L1", items: ["a = x²", "b = x + 5"] },
  { level: "L2", items: ["out = a · b"] },
] as const;

export function WitnessFrontierViz() {
  return (
    <figure className="not-prose my-8 rounded-xl border border-border bg-background p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-bold">Witness program을 dependency frontier로 읽기</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">같은 level 안의 독립 producer만 동시에 실행할 수 있습니다.</p>
      </figcaption>
      <div className="grid min-w-0 gap-3 md:grid-cols-3">
        {nodes.map((node, index) => (
          <div key={node.level} className="relative min-w-0 rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-xs font-bold text-primary">{node.level}</p>
            <div className="mt-3 space-y-2">{node.items.map((item) => <div key={item} className="break-words rounded-md border border-border bg-background px-3 py-2 text-xs leading-5">{item}</div>)}</div>
            {index < nodes.length - 1 && <span aria-hidden className="absolute -bottom-3 left-1/2 h-3 border-l border-border md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:h-auto md:w-3 md:border-b md:border-l-0" />}
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg border border-border px-3 py-2 text-xs leading-5 text-muted-foreground">예: x=3이면 L1에서 a=9와 b=8을 함께 계산하고, L2가 두 결과를 받아 out=72를 만듭니다.</p>
    </figure>
  );
}
