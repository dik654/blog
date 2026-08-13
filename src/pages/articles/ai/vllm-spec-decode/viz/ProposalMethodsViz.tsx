const METHODS = [
  {
    name: "Draft model",
    source: "별도 소형 LM의 token probability",
    advantage: "모델 조합 선택 폭이 넓음",
    check: "같은 vocabulary·빠른 draft·분포 유사성",
  },
  {
    name: "EAGLE",
    source: "Target hidden feature와 token",
    advantage: "Target에 가까운 feature-level proposal",
    check: "호환 checkpoint·추가 memory·runtime 지원",
  },
  {
    name: "Native MTP",
    source: "Target 학습 시 포함한 future-token module",
    advantage: "별도 full draft LM 없이 후보 생성",
    check: "Architecture/weight·depth·numerical acceptance",
  },
  {
    name: "N-gram · suffix",
    source: "Prompt와 생성 prefix의 반복 pattern",
    advantage: "추가 neural model이 필요 없음",
    check: "반복이 적은 workload에서는 낮은 hit rate",
  },
] as const;

export default function ProposalMethodsViz() {
  return (
    <figure
      data-viz="speculative-proposal-methods"
      className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">PROPOSER DESIGN SPACE</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          바뀌는 것은 후보 생성 경로이고, target verification 계약은 같습니다
        </h3>
      </figcaption>
      <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
        {METHODS.map((method) => (
          <article key={method.name} className="min-w-0 rounded-lg border bg-background p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-bold">{method.name}</h4>
              <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">proposal</span>
            </div>
            <dl className="mt-5 grid gap-4 text-sm">
              <div><dt className="text-xs font-bold text-muted-foreground">사용 정보</dt><dd className="mt-1.5 leading-6">{method.source}</dd></div>
              <div><dt className="text-xs font-bold text-muted-foreground">기대 이점</dt><dd className="mt-1.5 leading-6">{method.advantage}</dd></div>
              <div><dt className="text-xs font-bold text-muted-foreground">도입 전 확인</dt><dd className="mt-1.5 leading-6">{method.check}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </figure>
  );
}
