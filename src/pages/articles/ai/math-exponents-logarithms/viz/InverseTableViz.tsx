const rows = [
  ["−2", "2⁻² = 0.25", "log₂ 0.25 = −2"],
  ["0", "2⁰ = 1", "log₂ 1 = 0"],
  ["3", "2³ = 8", "log₂ 8 = 3"],
];

export default function InverseTableViz() {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 px-4 py-3 text-sm font-bold sm:px-6">지수 함수와 로그 함수가 입력·출력을 되돌리는 예</figcaption>
      <div className="overflow-x-auto"><table className="w-full min-w-[34rem] text-left text-sm"><thead className="bg-muted/25 text-xs text-muted-foreground"><tr><th className="px-5 py-3">지수 y</th><th className="px-5 py-3">Exponential: y → x</th><th className="px-5 py-3">Logarithm: x → y</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]} className="border-t border-border/60">{row.map((cell) => <td key={cell} className="px-5 py-3 font-mono">{cell}</td>)}</tr>)}</tbody></table></div>
    </figure>
  );
}
