import LaneContextViz from "./viz/LaneContextViz";

const evidenceGroups = [
  ["Work", "task·branch·worktree·head SHA"],
  ["Verification", "build·test·lint result와 artifact"],
  ["Control", "owner·approval·dependency·block reason"],
  ["Freshness", "observed_at·source version·expiry"],
] as const;

export default function LaneContext() {
  return (
    <section id="lane-context" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        LaneContext는 한 번의 정책 평가에 사용하는 immutable snapshot이다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 저장소에서 <code>Lane</code>은 브랜치·workspace·task를 묶은 병렬
          작업 단위를 가리키는 내부 이름입니다. <code>LaneContext</code>는 그
          작업의 현재 상태를 policy evaluator가 읽을 수 있도록 정규화한
          snapshot이며, 업계 공통 프레임워크의 타입은 아닙니다.
        </p>
        <p className="leading-7">
          context를 따로 만드는 이유는 rule이 Git, CI, task registry를 평가 도중
          제각각 조회하지 않게 하기 위해서입니다. collector가 한 evaluation
          generation에 필요한 evidence를 모으고, evaluator는 그 고정된 값만
          읽어야 판단을 재현할 수 있습니다.
        </p>

        <div className="not-prose my-8">
          <LaneContextViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {evidenceGroups.map(([title, body]) => (
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
          값마다 provenance와 freshness를 보존한다
        </h3>
        <p className="leading-7">
          <code>tests_passed: true</code>만 저장하면 어느 commit에서 누가 실행한
          결과인지 알 수 없습니다. check result에는 source, observed time,
          commit SHA 또는 tree digest, environment와 artifact reference를
          포함해야 합니다. 정책은 값뿐 아니라 그 evidence가 아직 유효한지도
          평가합니다.
        </p>
        <p className="leading-7">
          branch 상태는 Git collector가, CI 상태는 provider adapter가,
          approval은 registry가 소유하게 하면 source별 오류를 구분할 수
          있습니다. 한 source 조회가 실패해도 context 전체를 빈 기본값으로
          만들지 않고 해당 field를 Unknown과 cause로 표시합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          사용자·모델의 자기 보고는 evidence reference로 연결한다
        </h3>
        <p className="leading-7">
          에이전트가 “테스트를 통과했다”고 쓴 text는 관측 신호일 뿐 품질 gate의
          사실이 아닙니다. tool result의 call ID, CI run과 commit SHA처럼 확인
          가능한 evidence를 context에 연결하고, 단순 자연어 주장은 별도
          unverified field로 유지합니다.
        </p>
        <p className="leading-7">
          block reason이나 사람의 approval처럼 의미 판단이 필요한 값도 actor,
          scope, target version과 expiry를 기록합니다. “approved” boolean 하나는
          이후 변경된 commit까지 승인한 것처럼 잘못 재사용될 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          snapshot을 만든 뒤에는 변경하지 않는다
        </h3>
        <p className="leading-7">
          evaluation 중 비동기 callback이 같은 object를 갱신하면 앞쪽
          condition과 뒤쪽 condition이 서로 다른 시점의 상태를 보게 됩니다. 새
          evidence는 다음 generation의 snapshot을 만들 때 반영하고 현재
          evaluation에는 immutable value를 전달합니다.
        </p>
        <p className="leading-7">
          context에는 generation, resource version과 collected_at을 넣습니다.
          rule trace와 action proposal이 같은 generation을 가리키게 하면
          production incident에서도 당시 판단을 다시 실행할 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          오래 걸린 action 앞에서는 다시 읽는다
        </h3>
        <p className="leading-7">
          immutable snapshot은 평가의 일관성을 보장하지만 최신성을 보장하지는
          않습니다. merge·rebase·delete 직전에 branch head, lease와 approval
          version을 다시 확인하고 expected version이 다르면 action을 중단한 뒤
          새 context를 수집합니다.
        </p>
        <p className="leading-7">
          이 재검증은 TOCTOU(time-of-check to time-of-use) 문제를 줄입니다. 단순
          알림처럼 side effect가 작고 idempotent한 action과 history를 바꾸는
          action에 같은 freshness 기준을 적용할 필요는 없으므로 action class별
          precondition을 둡니다.
        </p>
      </div>
    </section>
  );
}
