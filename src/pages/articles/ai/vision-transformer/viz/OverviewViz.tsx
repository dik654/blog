import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["Spatial unit", "local pixel window", "non-overlap patch token"],
  ["Shared operation", "same kernel at every location", "same projection + encoder block"],
  ["Long-range path", "depth builds receptive field", "global attention in one block"],
  ["Position prior", "grid in operator", "explicit position signal"],
];

export default function OverviewViz() {
  return (
    <VizFrame eyebrow="Representation boundary" title="CNN과 ViT는 같은 image에서 서로 다른 계산 단위를 만듭니다" description="우열표가 아니라 spatial prior를 어디에 두는지 비교하는 지도입니다.">
      <div className="min-w-0 overflow-hidden border-y border-border">
        <div className="hidden grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] gap-6 border-b border-border py-3 text-xs font-semibold text-muted-foreground sm:grid"><span>질문</span><span>CNN</span><span>ViT</span></div>
        {rows.map(([question, cnn, vit]) => <div key={question} className="grid min-w-0 gap-2 border-b border-border py-5 text-sm last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-6"><strong>{question}</strong><span className="text-muted-foreground">{cnn}</span><span className="text-violet-800 dark:text-violet-200">{vit}</span></div>)}
      </div>
      <p className="mt-6 border-l border-violet-500 pl-4 text-sm leading-6 text-muted-foreground">ViT는 spatial prior를 제거한 것이 아니라 patch size·position·pretraining data와 objective 쪽으로 옮겼습니다.</p>
    </VizFrame>
  );
}
