import {
  SessionFrame,
  SessionRule,
  SessionSteps,
} from "./SessionVizPrimitives";

export default function ForkRewindFlowViz() {
  return (
    <SessionFrame
      label="BRANCHING HISTORY"
      title="Fork는 base revision을 공유하고 identity와 workspace를 분리한다"
      description="기존 event를 지우지 않고 branch ID·parent·base revision/hash·workspace revision을 고정한 뒤 이후 event만 독립적으로 append합니다."
      note="Rewind도 과거 기록 삭제가 아니라 과거 revision에서 새 head를 만드는 작업입니다. session history를 되돌려도 이미 적용된 파일 변경이나 외부 effect가 자동으로 rollback되지는 않습니다."
    >
      <SessionSteps
        items={[
          {
            label: "BASE · REV 42",
            title: "Shared checkpoint",
            body: "로그인 실패 수정 전 message와 ledger, workspace hash를 같은 revision에 고정합니다.",
            tone: "blue",
          },
          {
            label: "BRANCH A · HEAD 47",
            title: "기존 수정안",
            body: "원래 branch ID와 workspace revision, edit·test receipt를 그대로 유지합니다.",
            tone: "slate",
          },
          {
            label: "BRANCH B · HEAD 45",
            title: "대안 수정안",
            body: "새 identity와 worktree에서 같은 base를 참조해 다른 patch를 검증합니다.",
            tone: "violet",
          },
          {
            label: "MERGE · NEW REVISION",
            title: "Conflict & receipt",
            body: "base 대비 diff와 충돌을 해결하고 permission·test receipt를 다시 만든 뒤 채택합니다.",
            tone: "emerald",
          },
        ]}
      />
      <SessionRule>
        merge는 transcript 이어붙이기가 아닙니다. 같은 파일을 바꿨다면 three-way
        merge와 재검증이 필요하며 unresolved conflict, 새 approval과 test
        receipt를 새 session revision에 남깁니다.
      </SessionRule>
    </SessionFrame>
  );
}
