import VizFrame from "@/components/viz/VizFrame";

const branches = [
  ["Supervision cost", "DeiT", "teacher + distillation token", "ImageNet-1K recipe"],
  ["High-resolution cost", "Swin", "local + shifted windows", "hierarchical features"],
  ["Label scarcity", "MAE", "visible-only encoder", "masked pixel reconstruction"],
];

export default function ArchitectureViz() {
  return (
    <VizFrame eyebrow="Architecture branches" title="ViT 이후에는 현재 병목에 따라 서로 다른 경로로 갈라집니다" description="각 분기는 attention 자체, supervision source, encoder input 중 다른 경계를 바꿉니다.">
      <div className="grid min-w-0 gap-8 md:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
        <div className="border-l border-indigo-500 pl-5"><p className="font-semibold">Vanilla ViT</p><p className="mt-2 text-sm leading-6 text-muted-foreground">patch projection<br/>global encoder<br/>supervised pretraining</p></div>
        <ol className="divide-y divide-border border-y border-border">
          {branches.map(([problem, model, change, output]) => <li key={model} className="grid gap-2 py-5 text-sm sm:grid-cols-[8rem_5rem_minmax(0,1fr)_minmax(0,.9fr)] sm:gap-5"><span className="text-muted-foreground">{problem}</span><strong>{model}</strong><span>{change}</span><span className="text-muted-foreground">{output}</span></li>)}
        </ol>
      </div>
    </VizFrame>
  );
}
