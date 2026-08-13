import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Input", "x", "n coordinates"],
  ["First map", "z = Bx", "m coordinates"],
  ["Second map", "y = Az", "p coordinates"],
  ["Composition", "y = (AB)x", "one equivalent map"],
] as const;

export default function CompositionViz() {
  return (
    <VizFrame eyebrow="Composition" title="공유하는 중간 dimension이 두 map의 interface입니다">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map(([name, math, detail]) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <p className="text-xs font-bold text-primary">{name}</p>
            <p className="mt-3 break-words font-mono text-sm font-semibold">{math}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
