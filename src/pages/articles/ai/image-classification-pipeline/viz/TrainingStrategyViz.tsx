import VizFrame from "@/components/viz/VizFrame";

const experiments = [
  ["01", "Baseline", "pretrained input contract", "reference"],
  ["02", "Augmentation", "한 transform family의 label 보존", "paired ablation"],
  ["03", "Resolution", "small-object gain 대 latency·memory", "new stage"],
  ["04", "Pseudo-label", "class별 precision 대 coverage", "optional"],
];

export default function TrainingStrategyViz() {
  return (
    <VizFrame
      eyebrow="Experiment ladder"
      title="이득을 확인한 stage만 다음 실험의 baseline이 됩니다"
      description="여러 recipe를 한꺼번에 쌓지 않고, 각 변경이 data·objective·compute 중 어느 경계를 바꾸는지 기록합니다."
      note="각 row는 같은 split·seeds·evaluation receipt를 재사용합니다. Untouched test는 마지막 선택 뒤에만 엽니다."
    >
      <ol className="border-y border-border">
        {experiments.map(([index, name, test, state], i) => (
          <li key={name} className="relative grid min-w-0 grid-cols-[2.2rem_minmax(0,1fr)] gap-x-3 border-b border-border py-5 text-sm last:border-b-0 sm:grid-cols-[2.2rem_8rem_minmax(0,1fr)_7rem] sm:gap-x-5">
            <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300">{index}</span>
            <strong>{name}</strong>
            <span className="col-start-2 mt-2 text-muted-foreground sm:col-start-auto sm:mt-0">{test}</span>
            <span className="col-start-2 mt-2 text-xs text-foreground sm:col-start-auto sm:mt-0">{state}</span>
            {i < experiments.length - 1 && <span aria-hidden className="absolute -bottom-2 left-[1.02rem] bg-muted px-1 text-xs text-muted-foreground">↓</span>}
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
