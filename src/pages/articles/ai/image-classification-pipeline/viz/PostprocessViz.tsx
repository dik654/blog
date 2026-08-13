import VizFrame from "@/components/viz/VizFrame";

const states = [
  ["Logit", "model raw score", "class order 확인"],
  ["Probability", "softmax + temperature", "NLL·Brier·reliability"],
  ["Aggregate", "valid TTA + diverse models", "marginal gain·latency"],
  ["Decision", "argmax · threshold · reject", "업무 비용·용량"],
];

export default function PostprocessViz() {
  return (
    <VizFrame
      eyebrow="Inference state transition"
      title="Score·probability·decision을 같은 값처럼 다루지 않습니다"
      description="각 화살표는 validation에서 선택하고 versioning할 parameter가 있는 별도 변환입니다."
    >
      <ol className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-3">
        {states.map(([name, operation, audit], i) => (
          <li key={name} className="contents">
            <div className="min-w-0 border-l border-amber-500 pl-4">
              <span className="font-mono text-xs text-amber-700 dark:text-amber-300">0{i + 1}</span>
              <p className="mt-2 font-semibold">{name}</p>
              <p className="mt-2 break-words text-sm text-muted-foreground">{operation}</p>
              <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">검사 · {audit}</p>
            </div>
            {i < states.length - 1 && <span aria-hidden className="hidden text-muted-foreground lg:block">→</span>}
          </li>
        ))}
      </ol>
      <p className="mt-8 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">최종 artifact = model revision + preprocessing + temperature + TTA + weights + threshold + selection split digest</p>
    </VizFrame>
  );
}
