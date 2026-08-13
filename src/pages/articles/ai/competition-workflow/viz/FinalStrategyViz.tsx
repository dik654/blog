const candidates = [
  ["A", ".842", ".004", "기준", "12 ms", "통과"],
  ["B", ".845", ".013", "A와 높음", "29 ms", "보류"],
  ["C", ".843", ".005", "A와 낮음", "16 ms", "앙상블 후보"],
];

export default function FinalStrategyViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Selection ledger</p>
      <h3 className="mt-1 text-lg font-semibold">최고점 한 칸이 아니라 선택에 필요한 위험을 같은 행에서 봅니다</h3>
      <div className="mt-5 overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead className="bg-muted/35 text-xs text-muted-foreground">
            <tr>{["후보", "OOF 평균", "fold SD", "오류 상관", "p95", "결정"].map((h) => <th key={h} className="border-b border-border/60 px-4 py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {candidates.map((row) => <tr key={row[0]} className="border-b border-border/50 last:border-b-0">{row.map((cell, i) => <td key={`${row[0]}-${i}`} className={`px-4 py-3 ${i === 0 || i === 5 ? "font-semibold" : "text-muted-foreground"}`}>{cell}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">C는 A보다 단독 평균이 약간 높고 오류가 덜 겹쳐 ensemble 후보가 됩니다. 실제 채택은 동일 OOF 행의 조합 결과와 제출 budget에서 다시 판정합니다.</p>
    </div>
  );
}
