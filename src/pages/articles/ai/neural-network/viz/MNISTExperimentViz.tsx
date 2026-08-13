import VizFrame from "@/components/viz/VizFrame";

const train = ["Train split mini-batch", "Forward + scalar loss", "Backward + optimizer step"];
const evaluate = ["Validation split", "eval mode + no_grad", "loss·accuracy·error cases"];

function Lane({ label, items }: { label: string; items: string[] }) {
  return (
    <section className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
      <p className="text-xs font-bold text-primary">{label}</p>
      <ol className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 text-sm leading-5">
            <span className="font-mono text-xs text-muted-foreground">{index + 1}</span>
            <span className="min-w-0 text-foreground/80">{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function MNISTExperimentViz() {
  return (
    <VizFrame
      eyebrow="Small end-to-end experiment"
      title="MNIST의 가치는 높은 점수보다 train과 evaluation 경계를 한 번에 확인하는 데 있습니다"
      description="같은 preprocessing을 사용하되 parameter update가 있는 경로와 generalization을 측정하는 경로를 분리합니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Lane label="TRAIN — parameter를 바꾸는 경로" items={train} />
        <Lane label="EVALUATE — 바꾸지 않고 재는 경로" items={evaluate} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Train도 낮음" value="underfitting / optimization" />
        <Metric label="Train↑ · val↓" value="overfitting / split shift" />
        <Metric label="둘 다 높음" value="새 data slice로 재검증" />
      </div>
    </VizFrame>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 border-l border-border pl-3"><p className="text-xs font-semibold text-foreground">{label}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{value}</p></div>;
}
