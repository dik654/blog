const audit = [
  ["1 · Parity", "Metric·label order·row mapping·preprocess/inference가 같은가?", "fixture + checksum"],
  ["2 · Sampling", "Public subset이 작거나 class/group/time 구성이 다른가?", "known metadata slice"],
  ["3 · Direction", "후보 쌍의 local/public 우열이 같은가?", "pair agreement"],
  ["4 · Adaptation", "Public 결과를 보고 protocol을 몇 번 바꿨는가?", "decision log"],
  ["5 · Final", "선택에 쓰지 않은 기간·site·private에서 유지되는가?", "frozen holdout"],
];

export default function CVLBViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Mismatch audit</p>
      <h3 className="mt-1 text-lg font-semibold">Public score에 맞추기 전에 실패 원인을 위에서부터 좁힙니다</h3>
      <div className="mt-5 divide-y divide-border/60 rounded-lg border border-border/60">
        {audit.map(([step, question, receipt]) => <div key={step} className="grid gap-2 px-4 py-4 sm:grid-cols-[0.75fr_1.8fr_0.8fr] sm:gap-5"><p className="text-sm font-semibold">{step}</p><p className="text-sm leading-6">{question}</p><p className="text-xs text-muted-foreground">근거 · {receipt}</p></div>)}
      </div>
    </div>
  );
}
