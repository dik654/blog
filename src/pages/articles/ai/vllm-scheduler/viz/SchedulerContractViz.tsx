const INPUTS = ["RUNNING · WAITING state", "남은 token과 priority", "free KV blocks"];
const OUTPUTS = ["request별 token 수", "새 KV block mapping", "worker 실행 metadata"];

export default function SchedulerContractViz() {
  return (
    <figure data-viz="scheduler-decision-contract" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">SCHEDULER CONTRACT</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">요청 상태와 자원 snapshot을 한 번 실행할 batch 계약으로 바꿉니다</h3>
      </figcaption>
      <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-[1fr_3rem_1.05fr_3rem_1fr] lg:items-center">
        <article className="min-w-0 rounded-lg border bg-background p-5">
          <p className="text-xs font-bold text-muted-foreground">INPUT SNAPSHOT</p>
          <div className="mt-4 grid gap-2">
            {INPUTS.map((item) => <p key={item} className="rounded-md border bg-muted/20 px-3 py-3 text-sm leading-6">{item}</p>)}
          </div>
        </article>
        <p className="text-center text-muted-foreground"><span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span></p>
        <article className="min-w-0 rounded-lg border border-primary/35 bg-primary/[0.04] p-5">
          <p className="text-xs font-bold text-primary">DECIDE</p>
          <p className="mt-3 font-bold">Policy ordering</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">FCFS·priority로 후보를 순회합니다.</p>
          <div className="my-4 border-t" />
          <p className="font-bold">Hard feasibility</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Token·sequence·KV 조건을 모두 검사합니다.</p>
        </article>
        <p className="text-center text-muted-foreground"><span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span></p>
        <article className="min-w-0 rounded-lg border bg-background p-5">
          <p className="text-xs font-bold text-muted-foreground">SCHEDULER OUTPUT</p>
          <div className="mt-4 grid gap-2">
            {OUTPUTS.map((item) => <p key={item} className="rounded-md border bg-muted/20 px-3 py-3 text-sm leading-6">{item}</p>)}
          </div>
        </article>
      </div>
    </figure>
  );
}
