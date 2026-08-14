import GuardrailsViz from "./viz/GuardrailsViz";

const guardrails = [
  {
    title: "Budget",
    body: "token·turn·wall time·cost에 상한과 중단 상태를 둡니다.",
  },
  {
    title: "Capability",
    body: "tool, path, network와 secret을 최소 권한으로 제한합니다.",
  },
  {
    title: "Topology",
    body: "spawn depth, concurrency와 dependency를 runtime에서 강제합니다.",
  },
  {
    title: "Evidence",
    body: "완료 문장이 아니라 artifact와 verifier 결과로 종료를 판정합니다.",
  },
] as const;

export default function Guardrails() {
  return (
    <section id="guardrails" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Guardrail은 prompt가 아니라 runtime이 강제한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          worker가 원래 범위를 벗어나는 현상을 흔히 drift라고 부르지만, 원인은
          모델 하나로 환원되지 않습니다. 완료 조건이 모호하거나 tool 권한이
          과도하고, 중단 신호가 runtime까지 전파되지 않아도 탐색은 끝없이
          늘어납니다. guardrail은 이런 실패를 prompt 주의사항이 아니라 실행
          제약으로 바꾸는 장치입니다.
        </p>

        <div className="not-prose my-8">
          <GuardrailsViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {guardrails.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-lg border border-border/70 bg-card p-4"
          >
            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          budget 초과를 정상 완료와 구분한다
        </h3>
        <p className="leading-7">
          token, turn, wall-clock time과 monetary cost는 서로 다른 자원입니다.
          하나의 상한만 두면 tool loop나 대기 중인 process를 놓칠 수 있으므로
          runtime이 모두 추적하고, 초과 시 <code>BudgetExceeded</code> 같은
          명시적 상태로 worker와 child process를 종료합니다.
        </p>
        <p className="leading-7">
          partial result를 반환할 수는 있지만 completed로 표시하면 안 됩니다.
          이미 검증한 사실, 아직 확인하지 못한 부분과 남은 artifact를 구조화해야
          main agent가 사용 여부와 재시도 범위를 판단할 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          tool allowlist에 resource scope를 더한다
        </h3>
        <p className="leading-7">
          read tool만 주는 것은 좋은 시작이지만 “읽기 전용”도 repository 밖의
          secret을 읽을 수 있다면 충분하지 않습니다. tool name과 함께 path
          prefix, network endpoint, secret handle과 operation을 capability로
          묶어 session마다 최소 범위만 발급합니다.
        </p>
        <p className="leading-7">
          worker가 허용되지 않은 tool을 요청하면 prompt에 경고하는 데서 그치지
          않고 registry와 executor가 거부해야 합니다. 작업 취소나 종료 시에는
          임시 credential과 capability를 즉시 회수합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          scope 설명과 enforcement를 구분한다
        </h3>
        <p className="leading-7">
          목표, focus와 return format은 worker의 판단을 돕지만 보안 경계는
          아닙니다. “auth module만 보라”는 문장과 실제 filesystem allowlist를
          함께 적용해야 합니다. write 작업은 file ownership이나 isolated
          worktree로 충돌 범위도 제한합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          재귀와 동시성은 spawn 시점에 막는다
        </h3>
        <p className="leading-7">
          worker가 다시 worker를 만들 수 있으면 tree가 빠르게 커질 수 있습니다.
          max depth, active worker 수와 전체 budget을 parent와 child에 걸쳐
          추적하고, spawn 요청을 받는 runtime이 초과를 거부합니다. 복잡한 계층이
          꼭 필요하지 않다면 main agent가 flat한 worker 집합을 관리하는 편이
          관찰하기 쉽습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          output 길이가 아니라 완료 조건을 검증한다
        </h3>
        <p className="leading-7">
          결과가 비어 있는지나 “I cannot”이 들어 있는지만 보는 heuristic은 실제
          품질을 말해 주지 않습니다. expected schema, source reference, changed
          file, test command와 domain verifier를 task contract에 연결해 산출물을
          검증합니다.
        </p>
        <p className="leading-7">
          검증 실패에는 제한된 retry budget을 적용하고, 같은 prompt를 반복하는
          대신 실패 evidence를 다음 시도에 전달합니다. 반복 실패는 main agent나
          사용자에게 escalation해 자동 루프가 비용만 소비하지 않게 합니다.
        </p>
      </div>
    </section>
  );
}
