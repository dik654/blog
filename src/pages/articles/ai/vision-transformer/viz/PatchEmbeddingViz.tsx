import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Image", "224 × 224 × 3", "pixel grid"],
  ["Patch", "14 × 14 × (16²·3)", "196 regions"],
  ["Project", "196 × D", "shared E"],
  ["Position", "197 × D", "[CLS] + grid"],
];

export default function PatchEmbeddingViz() {
  return (
    <VizFrame eyebrow="Shape trace" title="224px image와 16px patch가 197-token sequence가 되는 과정" description="각 단계의 shape를 따라가면 checkpoint와 resolution incompatibility를 먼저 발견할 수 있습니다.">
      <ol className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-3">
        {stages.map(([name, shape, note], i) => <li key={name} className="contents"><div className="min-w-0 border-l border-cyan-500 pl-4"><span className="font-mono text-xs text-cyan-700 dark:text-cyan-300">0{i+1}</span><p className="mt-2 font-semibold">{name}</p><p className="mt-2 break-words font-mono text-xs">{shape}</p><p className="mt-3 text-xs text-muted-foreground">{note}</p></div>{i<stages.length-1&&<span aria-hidden className="hidden text-muted-foreground lg:block">→</span>}</li>)}
      </ol>
      <div className="mt-8 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2"><p><b>Projection parity</b><br/><span className="text-muted-foreground">flatten + matrix = kernel P, stride P</span></p><p><b>Resolution change</b><br/><span className="text-muted-foreground">special token 분리 → 2D grid interpolation</span></p></div>
    </VizFrame>
  );
}
