import RulesDslViz from "./viz/RulesDslViz";

const ruleParts = [
  ["Identity", "stable rule ID·version·owner"],
  ["Condition", "immutable snapshot만 읽는 predicate"],
  ["Proposal", "허용된 action type과 canonical arguments"],
  ["Control", "priority·cooldown·idempotency scope"],
] as const;

export default function Rules() {
  return (
    <section id="rules" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Policy rule은 상태를 읽고 action을 제안하는 선언적 계약이다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          policy engine의 rule은 자연어로 “상황을 봐서 적당히 처리하라”고 지시하는 prompt가 아닙니다. 고정된 snapshot을 대상으로 condition을 평가하고
          참일 때 실행 가능한 action proposal을 만드는 데이터입니다. 실제 side effect는 별도 executor가 맡습니다. 최신 상태와 권한을 다시 확인한 뒤에
          수행합니다.
        </p>
        <p className="leading-7">
          분석 snapshot의 <code>PolicyCondition</code> enum과 YAML 표현은 이
          저장소의 내부 DSL입니다. <em>DSL</em>(domain-specific language)은 특정
          문제에 맞춘 작은 표현 체계라는 업계 표준 용어지만, 이 enum 목록 자체가
          범용 표준은 아닙니다.
        </p>

        <div className="not-prose my-8">
          <RulesDslViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ruleParts.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          missing evidence는 false가 아니라 Unknown이다
        </h3>
        <p className="leading-7">
          CI 결과를 아직 받지 못한 상태와 test가 실패한 상태는 다릅니다.
          condition evaluator가 둘 다 <code>false</code>로 줄이면 “실패해서
          발동하지 않음”과 “판단할 수 없어 보류함”을 구분할 수 없습니다. 최소한
          <code>True</code>, <code>False</code>, <code>Unknown</code>을 구분하고
          Unknown의 원인과 필요한 evidence를 남겨야 합니다.
        </p>
        <p className="leading-7">
          <code>And</code>, <code>Or</code>, <code>Not</code> 같은 표준 논리
          연산자도 3-valued logic에서는 Unknown 전파 규칙을 명시해야 합니다.
          merge나 delete처럼 영향이 큰 action은 Unknown을 통과로 바꾸지 않는
          fail-closed 정책이 안전합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          evaluator 안에서는 side effect를 만들지 않는다
        </h3>
        <p className="leading-7">
          condition을 확인하는 동안 shell command를 실행하거나 CI를 다시 요청하면 평가를 반복할 때마다 외부 상태가 바뀝니다. 순서를 나눠야 합니다. collector가
          먼저 evidence를 모아 immutable snapshot을 만들고 evaluator는 순수 함수처럼 그 값만 읽습니다. 그래야 같은 입력에서 같은 결과가 나옵니다.
        </p>
        <p className="leading-7">
          custom script condition이 꼭 필요하다면 read-only input과 sandbox, deadline, output schema, version을 모두
          고정합니다. 임의 Lua나 shell 표현식을 engine process 안에서 실행하는 것은 DSL의 유연성이 아니라 새 code execution boundary입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          여러 rule의 proposal을 먼저 모은 뒤 충돌을 해결한다
        </h3>
        <p className="leading-7">
          priority가 높은 첫 rule을 즉시 실행하면 뒤에 있는 block·escalate rule을 보지 못할 수 있습니다. 같은 snapshot에 매칭된 proposal을 모두
          모으고 incompatible action을 감지한 뒤 deterministic arbitration으로 하나의 plan을 만듭니다. 안전을 넓히는 action보다 제한·중단
          action이 우선한다는 규칙도 이 단계에서 명시합니다.
        </p>
        <p className="leading-7">
          priority가 같은데 서로 상충하는 proposal은 config 순서에 기대지 말고 validation error나 명시적 tie-breaker로 처리합니다. static
          validation은 같은 condition에서 충돌하는 action을 찾습니다. runtime trace는 실제로 함께 매칭된 rule ID와 선택 이유를 기록합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          action 직전에 snapshot version을 다시 확인한다
        </h3>
        <p className="leading-7">
          평가가 끝난 뒤에도 CI나 branch head가 바뀔 수 있습니다. proposal에 snapshot version과 expected resource identity를 넣는
          이유입니다. executor는 optimistic concurrency check를 통과한 경우에만 action을 수행하고 상태가 달라졌다면 새 snapshot으로 재평가합니다.
        </p>
        <p className="leading-7">
          periodic reconciliation과 event trigger가 같은 rule을 동시에 깨울 수
          있으므로 <code>rule + resource + state version</code>에서 idempotency
          key를 만듭니다. cooldown은 중복 방지의 보조 수단이지 정확한 identity를
          대신하지 않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          rule test는 decision table과 trace를 함께 본다
        </h3>
        <p className="leading-7">
          rule마다 true·false·unknown과 경계 시간을 포함한 table test를 둡니다. 여러 rule을 조합할 때는 충돌과 priority를 검증합니다.
          production trace에 snapshot reference와 matched condition, rejected proposal, 최종 plan을 남기면 “왜 이
          action이 실행됐는가”를 재현할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
