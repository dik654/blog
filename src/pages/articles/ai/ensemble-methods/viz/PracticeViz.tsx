const rows = [
  ["A", ".214", "—", "8 ms", "시작"],
  ["A + C", ".201", ".013", "15 ms", "채택"],
  ["A + C + B", ".199", ".002", "24 ms", "보류"],
  ["A + C + D", ".200", ".001", "42 ms", "제외"],
];

export default function PracticeViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Greedy OOF decision ledger</p>
      <h3 className="mt-1 text-lg font-semibold">추가 model의 paired gain과 end-to-end p95를 같은 행에서 판단합니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        <div className="grid gap-2 border-b border-border/60 bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground sm:grid-cols-[1.2fr_.7fr_.7fr_.7fr_.7fr] sm:gap-4"><span>Ensemble</span><span>OOF loss</span><span>Δ gain</span><span>p95</span><span>결정</span></div>
        {rows.map((row) => <div key={row[0]} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 sm:grid-cols-[1.2fr_.7fr_.7fr_.7fr_.7fr] sm:gap-4 sm:py-3">{row.map((cell,index)=><p key={`${index}-${cell}`} className={index===0?"text-sm font-semibold":"font-mono text-xs text-muted-foreground"}>{cell}</p>)}</div>)}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">예시 숫자는 선택 규칙을 설명하기 위한 값입니다. 실제 채택에는 fold·seed·slice 반복성과 hard SLA를 함께 적용합니다.</p>
    </div>
  );
}
