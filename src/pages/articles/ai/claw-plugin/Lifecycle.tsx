import LifecycleViz from "./viz/LifecycleViz";

const healthRows = [
  [
    "Startup",
    "handshake와 필수 초기화가 deadline 안에 끝났는가",
    "실패하면 Ready로 공개하지 않음",
  ],
  ["Readiness", "지금 새 호출을 받을 수 있는가", "실패하면 routing에서 제외"],
  [
    "Liveness",
    "process가 교착 없이 진행할 수 있는가",
    "정책에 따라 restart 또는 quarantine",
  ],
  [
    "Integrity",
    "artifact·protocol·출력 경계가 유지되는가",
    "위반하면 즉시 격리하고 재승인",
  ],
];

export default function Lifecycle() {
  return (
    <section id="lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Ready·Draining·Quarantined를 구분하는 lifecycle
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>enabled: boolean</code> 하나로 상태를 표현하면 process가
          시작됐지만 아직 준비되지 않은 순간, update 중 이전 generation에 남은
          호출, integrity 위반으로 재실행하면 안 되는 상태를 구분할 수 없습니다.
          lifecycle은 호출을 받을 수 있는지와 process가 살아 있는지를 별도로
          나타내야 합니다.
        </p>

        <LifecycleViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          상태 전이는 원인과 generation을 함께 기록한다
        </h3>
        <p>
          검증된 artifact가 Starting으로 들어가 handshake를 마치면 Ready가 되고 disable이나 update가 시작되면 Draining으로 이동합니다.
          Draining은 새 호출을 받지 않지만 이미 시작한 호출은 자신이 가진 generation에서 끝낼 수 있습니다. 종료 deadline을 넘기면 취소 후 Stopped로 이동하며
          모든 전이는 actor·reason·previous generation을 감사 이벤트로 남깁니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          health check의 질문을 나눈다
        </h3>
        <p>
          process가 존재한다는 사실과 새 호출을 받을 준비가 됐다는 사실은 다릅니다. 무거운 실제 작업을 짧은 주기로 반복하는 health check는 장애를 더 만들 수 있으므로 각
          probe가 답할 질문과 timeout, 실패 threshold를 분리합니다. 고정된 “5분마다 검사”보다 plugin 특성과 최근 트래픽에 맞춘 interval과 jitter가
          필요합니다.
        </p>
        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-border/70">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Probe</th>
                <th className="px-4 py-3 font-semibold">질문</th>
                <th className="px-4 py-3 font-semibold">실패 시 기본 동작</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {healthRows.map(([probe, question, action]) => (
                <tr key={probe}>
                  <td className="px-4 py-3 font-medium">{probe}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {question}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          자동 재시작에는 retry budget과 circuit breaker가 필요하다
        </h3>
        <p>
          일시적 network 오류나 crash는 backoff 후 재시작할 수 있지만 잘못된 configuration과 protocol 위반을 같은 방식으로 반복하면 restart
          loop가 됩니다. 오류를 transient, configuration, integrity로 분류하고 시간 창 안의 시도 횟수를 제한합니다. retry budget을 소진하면
          circuit를 열어 새 호출을 빠르게 실패시키고 사람이 원인을 확인할 수 있게 합니다.
        </p>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
          {[
            [
              "Transient",
              "jitter를 둔 exponential backoff 안에서 제한적으로 재시작",
            ],
            ["Configuration", "설정이나 dependency가 바뀔 때까지 Failed 유지"],
            ["Integrity", "Quarantined로 격리하고 artifact 재검증·재승인 요구"],
          ].map(([title, description]) => (
            <section key={title} className="rounded-2xl border bg-card p-4">
              <h4 className="text-sm font-bold">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </section>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          종료는 신규 호출 차단부터 시작한다
        </h3>
        <p>
          shutdown에서 먼저 process를 죽이면 진행 중 tool call이 어떤 상태로 끝났는지 알 수 없습니다. registry에서 generation을 Draining으로
          바꿔 새 호출을 막고 진행 중 call에 cancellation을 전파한 뒤 deadline까지 기다립니다. 마지막에는 process tree, pipe, temporary
          directory, delegated credential을 회수하고 telemetry flush는 별도 짧은 deadline 안에서 수행합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          lifecycle metric은 정책을 조정할 근거가 된다
        </h3>
        <p>
          generation별 startup latency, readiness failure, restart count,
          in-flight calls, forced termination과 quarantine reason을 기록하면
          어느 plugin의 timeout과 resource limit을 조정해야 할지 알 수 있습니다.
          고정된 “실패율 10%면 경고”보다 operation별 baseline과 사용자 영향에
          맞춘 alert가 낫습니다. 기록 방식과 cardinality 원칙은
          <a href="/ai/claw-telemetry"> telemetry 글</a>에서 이어집니다.
        </p>
      </div>
    </section>
  );
}
