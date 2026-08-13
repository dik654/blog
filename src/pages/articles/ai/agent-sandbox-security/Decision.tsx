import {
  DEFENSE_LAYERS,
  WORKLOAD_DECISIONS,
} from "@/content/agent-sandbox-security";

export default function Decision() {
  return (
    <section id="decision" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        workload 신뢰도와 필요한 device로 선택한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          runtime 이름부터 고르면 과도한 비용이나 빈 경계가 생긴다. 먼저 실행할
          코드의 신뢰도, 필요한 credential·network·GPU, session 수명, 허용
          가능한 호환성 비용을 정한 뒤 각 층을 채운다.
        </p>
        <div data-viz="sandbox-workload-decision-ledger" className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
          <div className="hidden grid-cols-[1fr_11rem_1.5fr] gap-4 border-b bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>workload</span><span>runtime 출발점</span><span>필수 결합 통제</span>
          </div>
          <div className="divide-y divide-border/70">
            {WORKLOAD_DECISIONS.map((item) => (
              <article key={item.trust} className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[1fr_11rem_1.5fr] md:gap-4">
                <div><span className="text-[11px] font-semibold text-muted-foreground md:hidden">workload</span><p className="text-sm font-semibold">{item.trust}</p></div>
                <div><span className="text-[11px] font-semibold text-muted-foreground md:hidden">runtime 출발점</span><p className="text-sm">{item.runtime}</p></div>
                <div className="min-w-0"><span className="text-[11px] font-semibold text-muted-foreground md:hidden">필수 결합 통제</span><p className="break-words text-sm text-muted-foreground">{item.controls}</p></div>
              </article>
            ))}
          </div>
        </div>
        <div data-viz="sandbox-defense-layer-cards" className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {DEFENSE_LAYERS.map(([title, body]) => (
            <article key={title} className="rounded-lg border bg-card p-4">
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {body}
              </p>
            </article>
          ))}
        </div>
        <h3 className="mt-8 mb-3 text-xl font-semibold">배포 전 마지막 점검</h3>
        <ol>
          <li>pod 안에서 실제 token·route·mount·device를 inventory한다.</li>
          <li>허용 destination과 API method를 positive allowlist로 만든다.</li>
          <li>RuntimeClass와 seccomp가 실제 node에서 적용됐는지 확인한다.</li>
          <li>
            DNS·metadata·control plane·host escape 경로를 각각 테스트한다.
          </li>
          <li>차단 log와 session trace가 사고 조사에 남는지 확인한다.</li>
        </ol>
        <p className="leading-7">
          핵심은 “gVisor인가 Kata인가” 하나가 아니다. 공격 경로의 각 간선을 서로
          다른 통제로 끊고, 한 통제가 실패해도 다음 경계에서 멈추는 구조가
          프로덕션 샌드박스다.
        </p>
      </div>
    </section>
  );
}
