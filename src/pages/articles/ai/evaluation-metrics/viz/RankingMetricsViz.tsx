const ranked = [
  { rank: "01", relevance: "3 · 핵심 정답", discount: "gain 7.00" },
  { rank: "02", relevance: "0 · 무관", discount: "gain 0.00" },
  { rank: "03", relevance: "2 · 유용", discount: "gain 1.50" },
  { rank: "04", relevance: "1 · 부분 관련", discount: "gain 0.43" },
];

const choices = [
  ["하나만 빨리 찾기", "MRR"],
  ["정답 여러 개 회수", "Recall@k"],
  ["단계형 relevance", "NDCG@k"],
  ["여러 positive의 순서", "MAP"],
];

export default function RankingMetricsViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">One query · four ranked items</p>
      <h3 className="mt-1 text-lg font-semibold">먼저 한 query의 목록을 평가하고, 그다음 query들을 평균냅니다</h3>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="overflow-hidden rounded-lg border border-border/60">
          {ranked.map((item) => (
            <div key={item.rank} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-border/50 px-4 py-3 last:border-b-0">
              <span className="font-mono text-xs font-semibold text-muted-foreground">{item.rank}</span>
              <span className="min-w-0 break-words text-xs">{item.relevance}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{item.discount}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border/60 bg-background p-4">
          <p className="text-xs font-semibold">사용자 행동에 맞는 질문</p>
          <div className="mt-3 space-y-3">
            {choices.map(([question, metric]) => (
              <div key={question} className="flex items-start justify-between gap-4 border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
                <span className="text-xs leading-5 text-muted-foreground">{question}</span>
                <span className="shrink-0 font-mono text-xs font-semibold">{metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
