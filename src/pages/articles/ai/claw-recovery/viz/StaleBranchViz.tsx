import {
  RecoveryFrame,
  RecoveryRule,
  RecoverySteps,
} from "./RecoveryVizPrimitives";

export default function StaleBranchViz() {
  return (
    <RecoveryFrame
      label="BRANCH REVIEW"
      title="stale signal과 destructive action 사이에 review를 둔다"
      description="branch age는 후보를 찾는 signal이며 rebase·archive·delete 결정에는 owner와 실제 work state가 필요합니다."
      note="open PR, active task, unpushed work와 unknown owner가 있으면 자동 삭제하지 않습니다."
    >
      <RecoverySteps
        items={[
          {
            label: "SIGNAL",
            title: "Age · activity",
            body: "마지막 commit과 task heartbeat를 확인합니다.",
            tone: "blue",
          },
          {
            label: "GRAPH",
            title: "Ahead · behind",
            body: "merge-base와 divergence를 함께 계산합니다.",
            tone: "violet",
          },
          {
            label: "SAFETY",
            title: "Owner · work state",
            body: "PR, dirty worktree와 protected ref를 확인합니다.",
            tone: "amber",
          },
          {
            label: "ACTION",
            title: "Notify · archive",
            body: "review 후 recoverable action부터 진행합니다.",
            tone: "emerald",
          },
        ]}
      />
      <RecoveryRule>
        force-push와 delete는 dry run, expected SHA, archive 확인과 별도 승인을
        요구합니다.
      </RecoveryRule>
    </RecoveryFrame>
  );
}
