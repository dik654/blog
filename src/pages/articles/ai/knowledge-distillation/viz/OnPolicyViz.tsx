const lanes = [
  {
    name: "Off-policy sequence KD",
    sample: "teacher / fixed dataset가 response 생성",
    state: "student가 아직 방문하지 않은 prefix 중심",
    signal: "dense token NLL 또는 teacher distribution",
  },
  {
    name: "On-policy distillation",
    sample: "현재 student가 response 생성",
    state: "student가 실제로 만든 실수와 prefix",
    signal: "같은 prefix에서 frozen teacher가 token별 채점",
  },
] as const;

export default function OnPolicyViz() {
  return (
    <figure data-viz data-viz-canvas className="overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">Sampling distribution</p>
        <h3 className="mt-1 text-base font-semibold">On-policy의 차이는 loss 이름보다 student가 만든 prefix에서 배운다는 데 있습니다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          두 방식 모두 token-level supervision을 줄 수 있지만, teacher가 채점하는 상태를 누가 생성했는지가 다릅니다.
        </p>
      </figcaption>
      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2">
        {lanes.map((lane, index) => (
          <section key={lane.name} className={`rounded-lg border p-4 ${index === 1 ? "border-foreground/45 bg-muted/30" : "border-border"}`}>
            <div className="flex items-start justify-between gap-3">
              <strong className="text-sm">{lane.name}</strong>
              <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="border-t border-border pt-3">
                <dt className="text-xs text-muted-foreground">Sequence를 만드는 주체</dt>
                <dd className="mt-1 leading-6">{lane.sample}</dd>
              </div>
              <div className="border-t border-border pt-3">
                <dt className="text-xs text-muted-foreground">Teacher가 보는 상태</dt>
                <dd className="mt-1 leading-6">{lane.state}</dd>
              </div>
              <div className="border-t border-border pt-3">
                <dt className="text-xs text-muted-foreground">학습 신호</dt>
                <dd className="mt-1 leading-6">{lane.signal}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
      <p className="border-t border-border bg-muted/20 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
        On-policy는 teacher와 student가 같은 model이라는 뜻이 아닙니다. Student가 표본을 만들고 teacher가 그 표본의 다음-token 분포를 평가한다는 뜻입니다.
      </p>
    </figure>
  );
}
