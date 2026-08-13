import VizFrame from "@/components/viz/VizFrame";

const candidates = [
  ["EfficientNet", "local convolution", "depth · width · resolution", "compound family"],
  ["ConvNeXt", "local convolution", "modern block · recipe", "pure ConvNet"],
  ["ViT", "global patch relation", "patch size · tokens · attention", "pretraining-sensitive"],
];

export default function BackboneComparisonViz() {
  return (
    <VizFrame
      eyebrow="Backbone decision"
      title="구조 설명은 후보를 만들고, 배포 측정이 선택을 끝냅니다"
      description="Architecture family의 inductive bias와 resource scaling을 먼저 읽은 뒤 같은 checkpoint·input·fine-tuning budget에서 측정합니다."
    >
      <div className="min-w-0 overflow-hidden border-y border-border">
        <div className="hidden grid-cols-[8rem_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,.9fr)] gap-5 border-b border-border py-3 text-xs font-semibold text-muted-foreground md:grid">
          <span>family</span><span>spatial prior</span><span>scale knob</span><span>paper scope</span>
        </div>
        {candidates.map(([name, prior, scale, scope]) => (
          <div key={name} className="grid min-w-0 gap-2 border-b border-border py-5 text-sm last:border-b-0 md:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,.9fr)] md:gap-5">
            <strong>{name}</strong><span>{prior}</span><span className="text-muted-foreground">{scale}</span><span className="text-muted-foreground">{scope}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
        <div className="border-l border-violet-500 pl-4"><p className="font-semibold">논문·registry로 후보 축소</p><p className="mt-2 text-sm leading-6 text-muted-foreground">pretrained recipe · license · supported input · FLOPs</p></div>
        <span className="hidden text-muted-foreground md:block">→</span>
        <div className="border-l border-emerald-500 pl-4"><p className="font-semibold">target runtime으로 최종 선택</p><p className="mt-2 text-sm leading-6 text-muted-foreground">paired quality · p50/p95 · throughput · peak memory</p></div>
      </div>
    </VizFrame>
  );
}
