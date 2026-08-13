import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Input contract", "IDs · positions · masks", "representation"],
  ["Attention", "Q reads visible K·V", "token mixing"],
  ["Residual + norm", "preserve + stabilize", "state update"],
  ["FFN", "expand · activate · project", "feature mixing"],
  ["Output contract", "logits · loss or decoding", "task interface"],
] as const;

export default function TransformerBlockViz() {
  return (
    <VizFrame
      eyebrow="Execution map"
      title="Transformer를 입력 tensor에서 task output까지 하나의 계약으로 읽습니다"
      description="Architecture 계열은 visibility와 source가 달라도 token mixing·feature mixing·residual update라는 공통 축을 공유합니다."
    >
      <div className="divide-y divide-border/70">
        {stages.map(([title, detail, role], index) => (
          <div
            key={title}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[3rem_10rem_1fr_8rem] sm:items-center sm:gap-5"
          >
            <span className="font-mono text-xs font-bold text-primary">
              0{index + 1}
            </span>
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="break-words font-mono text-xs leading-5 text-muted-foreground">
              {detail}
            </p>
            <p className="text-xs font-semibold text-foreground/70 sm:text-right">
              {role}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
