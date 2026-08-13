import VizFrame from "@/components/viz/VizFrame";

const trace = [
  ["t=1", "<SOS>", "고마워", "prefix 1개"],
  ["t=2", "고마워", "요", "prefix 2개"],
  ["t=3", "요", "<EOS>", "종료"],
];

export default function AutoregressiveDecodeViz() {
  return (
    <VizFrame
      eyebrow="Autoregressive decode"
      title="한 token을 선택하는 순간 다음 step의 입력과 전체 sequence score가 함께 바뀝니다"
      description="Greedy는 후보 하나만 유지하고 beam search는 누적 log probability가 높은 여러 prefix를 유지합니다."
    >
      <div className="divide-y divide-border/60 rounded-lg border border-border/70 bg-background">
        {trace.map(([step, input, selected, state]) => (
          <div key={step} className="grid gap-2 p-4 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_5rem] sm:items-center">
            <p className="font-mono text-xs font-bold text-primary">{step}</p>
            <p className="text-xs text-muted-foreground">입력 <span className="font-mono text-foreground">{input}</span></p>
            <p className="text-xs text-muted-foreground">선택 <span className="font-mono font-bold text-foreground">{selected}</span></p>
            <p className="text-xs text-muted-foreground sm:text-right">{state}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Fact label="Stopping" value="EOS 또는 max length" />
        <Fact label="Sequence score" value="token log-probability의 합" />
        <Fact label="Search trade-off" value="quality·latency·length bias" />
      </div>
    </VizFrame>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 border-l border-border pl-3"><p className="text-[11px] font-bold text-muted-foreground">{label}</p><p className="mt-1 break-words text-xs leading-5 text-foreground/80">{value}</p></div>;
}
