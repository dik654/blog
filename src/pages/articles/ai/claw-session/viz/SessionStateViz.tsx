import {
  SessionFrame,
  SessionRule,
  SessionSteps,
} from "./SessionVizPrimitives";

export default function SessionStateViz() {
  return (
    <SessionFrame
      label="SESSION LIFECYCLE"
      title="Cancel·pause·resume·shutdown은 서로 다른 범위를 바꾼다"
      description="Cancel은 active turn attempt를 끝내고, pause는 session을 checkpoint 가능한 상태로 만들며, shutdown은 runtime 자원을 회수합니다. durable 기록의 삭제는 어느 동작에도 포함되지 않습니다."
      note="AwaitingPermission·RunningTool 같은 turn substate와 Restoring·Running·Paused·Closed 같은 session lifecycle을 분리합니다. Closed도 deleted가 아니며 retention 기간에는 다시 열 수 있습니다."
    >
      <SessionSteps
        items={[
          {
            label: "RUNNING",
            title: "Turn 허용",
            body: "single writer가 새 입력을 받고 active turn의 transient·committed state를 관리합니다.",
            tone: "blue",
          },
          {
            label: "CANCEL · TURN SCOPE",
            title: "Attempt 중단",
            body: "active cancellation scope에 신호를 보내되 session 자체는 Running 또는 Idle로 남을 수 있습니다.",
            tone: "emerald",
          },
          {
            label: "PAUSING → PAUSED",
            title: "Checkpoint 후 정지",
            body: "신규 turn을 막고 effect를 reconcile한 뒤 durable checkpoint가 성공해야 Paused를 공개합니다.",
            tone: "amber",
          },
          {
            label: "DRAINING → CLOSED",
            title: "Shutdown & resume",
            body: "drain → cancel → persist → release로 닫고, resume은 validate·rebind·reconcile 후 새 lease를 얻습니다.",
            tone: "slate",
          },
        ]}
      />
      <SessionRule>
        pause나 shutdown도 외부 effect를 되돌리지 않습니다. 상태 전이에는
        compare-and-swap revision, actor, reason과 마지막 effect receipt를 남기고
        resume 시 중단된 attempt를 재실행하기 전에 reconcile합니다.
      </SessionRule>
    </SessionFrame>
  );
}
