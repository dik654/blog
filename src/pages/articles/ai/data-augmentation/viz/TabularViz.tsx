const checks = [
  ["Column", "Range·unit·dtype", "나이 −3, 통화 단위 혼합"],
  ["Row", "합계·비율·category 조합", "부분합이 총액보다 큼"],
  ["Entity", "같은 사용자·장비의 상태", "서로 다른 entity record 혼합"],
  ["Time", "과거→현재→미래 순서", "미래 정보를 training row에 사용"],
  ["Split", "Training fold 내부 생성", "Validation neighbor가 합성에 참여"],
];

export default function TabularViz() {
  return (
    <figure data-viz="tabular-synthesis-checks" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption className="mb-5 text-sm font-semibold">Synthetic row의 현실성을 다섯 층에서 검사합니다</figcaption>
      <div className="divide-y divide-border/70 border-y border-border/70">
        {checks.map(([scope, contract, failure]) => (
          <div key={scope} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)]">
            <p className="font-semibold text-amber-700 dark:text-amber-300">{scope}</p>
            <p className="text-sm leading-6">{contract}</p>
            <p className="text-sm leading-6 text-muted-foreground">실패 예: {failure}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
