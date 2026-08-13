const lanes = [
  ["Forward", "float master W", "fake quantize", "low-bit error가 섞인 loss"],
  ["Backward", "upstream gradient", "STE surrogate", "float W를 optimizer가 update"],
  ["Deployment", "converted artifact", "real low-bit kernel", "quality·latency 재측정"],
];

export default function QATTrainViz() {
  return <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">QAT execution lanes</p>
    <h3 className="mt-1 text-lg font-semibold">Forward의 계단 함수와 backward의 근사 경로를 분리합니다</h3>
    <div className="mt-5 overflow-x-auto">
      <div className="min-w-[44rem] divide-y divide-border/70 border-y border-border/70">
        {lanes.map(([lane, input, operation, output]) => <div key={lane} className="grid grid-cols-[7rem_1fr_1fr_1.25fr] gap-4 py-4 text-sm">
          <strong>{lane}</strong><span>{input}</span><span className="font-mono text-xs">{operation}</span><span className="text-muted-foreground">{output}</span>
        </div>)}
      </div>
    </div>
  </div>;
}
