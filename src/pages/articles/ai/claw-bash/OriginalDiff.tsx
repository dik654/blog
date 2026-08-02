export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Production hardening: 마지막까지 닫아야 할 것</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          현재 snapshot에는 호출되지 않는 네 단계 validation 후보와 Linux <code>unshare</code>
          launcher가 있다. 실제 사용자 머신에서 임의 command를 실행하는 제품은 이들을 production
          호출 경로에 연결하는 것부터 parser, 도구별 option semantics, sandbox portability, process
          tree와 audit까지 함께 설계해야 한다. 단계 수보다 중요한 것은 각 실패를 누가 막는지 빈칸이
          없는 것이다.
        </p>
        <div className="not-prose my-6 divide-y divide-border rounded-md border border-border">
          {[
            ['Syntax', 'pipeline, redirection, heredoc, subshell, command substitution을 AST로 해석', '첫 token 분류의 blind spot을 줄인다.'],
            ['Tool semantics', 'git, fd, docker, kubectl 등 executable별 위험 option과 operand를 판정', '같은 basename 안의 read/write/system 행동을 구분한다.'],
            ['Containment', 'filesystem·network·secret·process namespace를 OS policy로 제한', '분류가 틀려도 금지한 side effect가 실패한다.'],
            ['Lifecycle', 'process group/job, timeout escalation, cancel, reap, output backpressure', '자식이 남거나 pipe가 메모리를 고갈시키는 일을 막는다.'],
            ['Audit', 'permission, sandbox profile, command digest, exit/signal/timeout, truncation을 기록', '사후에 무엇을 허용했고 실제로 어떤 결과가 났는지 재구성한다.'],
          ].map(([area, implementation, purpose]) => (
            <div key={area} className="grid gap-2 px-4 py-4 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)]">
              <strong className="text-sm">{area}</strong>
              <span className="text-sm leading-relaxed">{implementation}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">{purpose}</span>
            </div>
          ))}
        </div>

        <h3>Exit code를 성공/실패 boolean으로 줄이지 않는다</h3>
        <p>
          <code>grep</code>은 match가 없으면 1을 반환하지만 시스템 오류는 아니다. signal 종료, timeout,
          policy deny, sandbox setup 실패도 일반 non-zero exit와 다른 사건이다. 결과 schema는
          <code>exit_code</code>뿐 아니라 <code>termination_reason</code>, signal, timeout, stdout/stderr
          truncation을 표현해야 한다.
        </p>

        <h3>Sandbox availability는 배포 전제다</h3>
        <p>
          실행 시점에 “없으면 그냥 host에서 실행”하는 정책은 위험을 런타임 우연에 맡긴다. production
          startup에서 필요한 containment 기능을 probe하고, profile 요구를 만족하지 못하면 worker를
          unhealthy로 만들거나 위험 command를 fail-closed로 거부한다. 플랫폼 지원 표와 residual risk를
          사용자에게 보이는 운영 계약으로 둔다.
        </p>

        <h3>Incident response까지 연결한다</h3>
        <p>
          의심 command가 실행되면 session을 중지하고 process tree를 종료한 뒤, 변경 파일·network
          destination·사용된 permission override를 trace로 남겨야 한다. “validator가 통과했다”는 로그는
          충분하지 않다. authorization decision과 sandbox policy, 실제 exit semantics를 하나의 실행
          record로 묶어야 재현과 정책 개선이 가능하다.
        </p>
      </div>
    </section>
  );
}
