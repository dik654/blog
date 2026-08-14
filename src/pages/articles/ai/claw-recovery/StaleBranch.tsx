import StaleBranchViz from "./viz/StaleBranchViz";
import { CitationBlock } from "@/components/ui/citation";

const branchSignals = [
  {
    title: "Activity",
    body: "최근 commit 시각은 참고하되 작업 가치와 owner 상태를 함께 봅니다.",
  },
  {
    title: "Divergence",
    body: "ahead·behind와 merge-base, conflict 가능성을 구분합니다.",
  },
  {
    title: "Work state",
    body: "uncommitted change, open PR, CI와 active worker를 확인합니다.",
  },
  {
    title: "Recovery",
    body: "archive ref와 owner acknowledgement가 있는지 확인합니다.",
  },
] as const;

export default function StaleBranch() {
  return (
    <section id="stale-branch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Stale branch는 나이만으로 rebase하거나 삭제하지 않는다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          오래 활동이 없는 branch는 review 대상이 될 수 있지만, 일정 시간이
          지났다는 이유만으로 가치가 사라진 것은 아닙니다. release branch나
          보류된 실험처럼 오래 유지할 이유가 있을 수 있고, 자동 rebase와 삭제는
          remote history와 사용자 작업을 바꾸는 destructive action입니다.
        </p>
        <p className="leading-7">
          stale detector는 삭제 결정을 내리는 장치가 아니라 owner가 상태를
          재검토하도록 signal을 모으는 장치로 두는 편이 안전합니다. 임계값은
          repository policy에 속하며 “7일, 100 commits, 5회 실패” 같은 snapshot
          숫자를 일반 원칙으로 쓰지 않습니다.
        </p>

        <div className="not-prose my-8">
          <StaleBranchViz />
        </div>

        <div id="paper-claw-stale-branch-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code stale_branch.rs @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/stale_branch.rs"
            citeKey={2}
            type="code"
          >
            <p>
              <strong>문제:</strong> topic branch가 main보다 뒤처졌는지와
              diverged했는지를 구분합니다. <strong>기여:</strong> pinned source는
              <code>git rev-list --count</code>와 missing commit subject를 사용해
              Fresh·Stale·Diverged 및 warn·block·rebase·merge action을 만듭니다.
              <strong>전제:</strong> repository path와 두 ref, Git command 결과를
              고정합니다. <strong>근거 범위:</strong> ahead·behind 판정과 action
              선택입니다. <strong>일반화 금지:</strong> branch age·dirty worktree·PR
              owner·conflict preview·safe force-push까지 확인한다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {branchSignals.map((item) => (
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
          behind와 diverged를 구분한다
        </h3>
        <p className="leading-7">
          target보다 뒤처진 commit 수만 보면 branch 자체의 새 commit과
          merge-base를 놓칩니다. ahead·behind를 모두 계산하고, open PR과
          conflict preview, protected branch 여부를 확인합니다. 단순히 behind가
          크다는 이유로 rebase를 시작하지 않습니다.
        </p>
        <p className="leading-7">
          automation worker가 소유한 ephemeral branch와 사람이 장기 작업 중인
          branch policy도 나눕니다. 전자는 task lease와 terminal state로 정리할
          수 있지만, 후자는 owner acknowledgement가 없으면 알림과 label
          변경까지만 자동화합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          refresh는 별도 worktree에서 dry run한다
        </h3>
        <p className="leading-7">
          최신 target을 fetch한 뒤 clean temporary worktree에서 rebase 또는
          merge를 시도하면 원래 checkout의 미커밋 변경을 건드리지 않습니다.
          conflict가 나면 abort하고 conflict list와 candidate resolution을
          artifact로 남긴 뒤 owner나 recovery workflow에 전달합니다.
        </p>
        <p className="leading-7">
          자동으로 conflict를 해결한 경우에도 affected test와 diff review를
          통과하기 전에는 remote branch를 force-push하지 않습니다. force
          update가 필요하면 expected old SHA를 조건으로 사용해 다른 사람이
          그사이 올린 commit을 덮어쓰지 않게 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          archive와 delete를 분리한다
        </h3>
        <p className="leading-7">
          branch를 정리하기 전에 current SHA를 가리키는 durable archive ref와
          metadata, owner, reason을 남기고 remote에서 ref가 실제로 보이는지
          확인합니다. archive가 성공했다고 곧바로 delete하지 않고 retention
          기간과 별도 approval을 둡니다.
        </p>
        <p className="leading-7">
          open PR, protected branch, active task, unpushed commit 또는 owner
          unknown 중 하나라도 있으면 자동 삭제 대상에서 제외합니다. 삭제 뒤에는
          무엇이 제거됐고 어떤 ref로 복구할 수 있는지 audit event로 남깁니다.
        </p>
      </div>
    </section>
  );
}
