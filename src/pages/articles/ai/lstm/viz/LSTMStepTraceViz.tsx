import VizFrame from "@/components/viz/VizFrame";

const channels = [
  ["channel A", "0.95", "0.08", "보존 우선", "C: 0.80 → 0.78"],
  ["channel B", "0.20", "0.75", "새 정보 우선", "C: −0.30 → 0.46"],
  ["channel C", "0.70", "0.40", "혼합", "C: 0.50 → 0.19"],
];

export default function LSTMStepTraceViz() {
  return (
    <VizFrame
      eyebrow="One recurrent step"
      title="Gate는 cell 전체를 켜고 끄지 않고 channel마다 다른 비율을 만듭니다"
      description="아래 값은 계산 경로를 보여 주기 위한 예시입니다. 실제 channel의 의미와 gate 값은 data와 objective에서 학습됩니다."
    >
      <div className="grid gap-3 lg:grid-cols-3">
        {channels.map(([name, forget, input, policy, result]) => (
          <article key={name} className="rounded-lg border border-border/70 bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-foreground">{name}</p>
              <span className="text-xs font-medium text-primary">{policy}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <Value label="forget f" value={forget} />
              <Value label="input i" value={input} />
            </div>
            <p className="mt-4 border-t border-border/60 pt-3 font-mono text-xs text-foreground/75">{result}</p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}

function Value({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-muted/40 p-3"><p className="text-muted-foreground">{label}</p><p className="mt-1 font-mono font-bold text-foreground">{value}</p></div>;
}
