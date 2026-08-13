import RecipesViz from "./viz/RecipesViz";

const recipeParts = [
  {
    title: "Precondition",
    body: "이 실패가 recipe 대상인지와 현재 상태가 안전한지 확인합니다.",
  },
  {
    title: "Checkpoint",
    body: "diff, branch, logs와 외부 job ID를 복구 가능한 형태로 보존합니다.",
  },
  {
    title: "Action",
    body: "최소 side effect의 한 단계만 실행하고 결과를 구조화합니다.",
  },
  {
    title: "Verifier",
    body: "원래 실패가 해결됐고 새 회귀가 없는지 별도 기준으로 확인합니다.",
  },
] as const;

export default function Recipes() {
  return (
    <section id="recipes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Recovery recipe는 전제·checkpoint·검증을 함께 가진다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          recovery recipe는 실패 이름에 명령 목록을 연결한 macro가 아닙니다.
          같은 build failure라도 dependency outage, compile error와 disk full은
          대응이 다르므로 evidence로 원인을 분류하고, 현재 state가 recipe의
          precondition을 만족할 때만 실행해야 합니다.
        </p>
        <p className="leading-7">
          분석 snapshot의 <code>RecoveryRecipe</code>와 step enum은 내부
          구현입니다. 중요한 것은 step 개수가 아니라 변경 전 상태를 보존하고,
          실행 후 성공을 독립적으로 확인하며, 실패 시 어디까지 적용됐는지 알 수
          있는 contract입니다.
        </p>

        <div className="not-prose my-8">
          <RecipesViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {recipeParts.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
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
          transient failure만 단순 retry한다
        </h3>
        <p className="leading-7">
          rate limit, 짧은 network timeout처럼 상태를 바꾸지 않고 시간이 지나면
          나아질 수 있는 오류는 bounded backoff로 재시도할 수 있습니다. compile
          error와 merge conflict는 입력이 같으면 결과도 같으므로 먼저 state를
          수정하거나 다른 주체에게 넘겨야 합니다.
        </p>
        <p className="leading-7">
          retry budget은 recipe, task와 외부 dependency별로 추적하고 같은 실패
          fingerprint가 반복되면 일찍 중단합니다. command가 실패했다고 무조건
          LLM에게 다시 보내는 것은 recovery가 아니라 비용이 큰 반복입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          destructive step 앞에는 recoverable checkpoint를 둔다
        </h3>
        <p className="leading-7">
          <code>ResetToHead</code>, file delete와 rebase는 사용자 작업을 잃거나
          history를 바꿀 수 있습니다. clean worktree, 정확한 target과 owner
          approval을 확인하고, 필요하면 temporary branch·stash·commit으로 현재
          state를 보존합니다. checkpoint가 없으면 자동 recipe 대상에서
          제외합니다.
        </p>
        <p className="leading-7">
          shell step은 recovery engine의 특별 권한으로 실행하지 않고 일반 Bash와
          같은 validation, permission과 sandbox를 통과합니다. 외부 CI 재실행은
          idempotency key와 job ID를 기록해 timeout retry가 duplicate job을
          만들지 않게 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          merge conflict는 자동 rebase 성공만으로 끝나지 않는다
        </h3>
        <p className="leading-7">
          conflict marker를 제거하고 <code>rebase --continue</code>가 성공해도
          양쪽 변경의 의미가 보존됐다는 보장은 없습니다. conflicted file의
          owner와 relevant test를 contract에 넣고, generated file이나
          lockfile처럼 재생성할 수 있는 경우와 business logic을 구분합니다.
        </p>
        <p className="leading-7">
          verifier는 원래 실패한 test만 먼저 실행해 빠르게 feedback을 주고, 통과
          뒤에는 affected suite와 release gate를 실행합니다. local pass와 remote
          CI pass를 서로 다른 evidence로 남깁니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          partial recovery는 성공이 아니라 새 state다
        </h3>
        <p className="leading-7">
          여러 step 중 일부만 적용됐다면 <code>PartiallyRecovered</code>에
          적용된 action, 남은 side effect와 rollback 방법을 기록합니다. 다음
          evaluation이 이를 단순 실패 전 상태로 오해해 같은 step을 반복하지 않게
          recovery attempt ID와 state version도 갱신합니다.
        </p>
        <p className="leading-7">
          verifier가 성공 조건을 확인한 뒤에만 recovered terminal state로
          전환합니다. 그 전에는 제한된 추가 recipe를 선택하거나 evidence
          bundle과 함께 escalation합니다.
        </p>
      </div>
    </section>
  );
}
