const ALPHAS = [0.6, 0.8, 0.9] as const;
const KS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const series = ALPHAS.map((alpha) => KS.map((k) => Array.from({length: k+1},(_,i) => alpha**i).reduce((a,b) => a+b,0)/(1+k*0.05)));
export default function SpeedupTable() {
  return <figure className="not-prose my-8 min-w-0">
    <figcaption className="mb-4 text-sm leading-7">직렬 후보 비용 c=0.05, 검증 비용 1의 가정입니다. 굵은 값은 각 열에서 K=1~8 중 가장 큰 시간 비입니다.</figcaption>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm tabular-nums">
        <thead><tr><th className="p-3 text-left">K</th>{ALPHAS.map(a => <th className="p-3 text-right" key={a}>α={a}</th>)}</tr></thead>
        <tbody>{KS.map((k,i)=><tr className="border-t border-border" key={k}><th className="p-3 text-left font-normal">{k}</th>{series.map((row,j)=><td key={j} className={`p-3 text-right ${i===row.indexOf(Math.max(...row)) ? "font-bold text-primary" : ""}`}>{row[i].toFixed(2)}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <p className="mt-4 text-sm leading-7 text-muted-foreground">탐색 밖의 깊이가 더 나을 수 있습니다. 실제 검증 비용과 나머지 처리 시간이 달라지면 표를 다시 계산합니다.</p>
  </figure>;
}
