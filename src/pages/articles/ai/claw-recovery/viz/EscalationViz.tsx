import {
  RecoveryFrame,
  RecoveryRule,
  RecoverySteps,
} from "./RecoveryVizPrimitives";

export default function EscalationViz() {
  return (
    <RecoveryFrame
      label="SAFE HANDOFF"
      title="자동화를 멈추고 책임과 evidence를 넘긴다"
      description="failure severity와 필요한 decision에 맞는 owner를 찾아 acknowledgement까지 추적합니다."
      note="notification delivery와 human ownership은 다른 상태이며 응답이 없을 때만 다음 route로 올립니다."
    >
      <RecoverySteps
        items={[
          {
            label: "01",
            title: "Freeze",
            body: "새 action을 막고 lease·credential을 회수합니다.",
            tone: "rose",
          },
          {
            label: "02",
            title: "Bundle",
            body: "state, attempts, impact와 선택지를 구조화합니다.",
            tone: "blue",
          },
          {
            label: "03",
            title: "Route",
            body: "team queue·user·on-call 중 실제 owner로 보냅니다.",
            tone: "violet",
          },
          {
            label: "04",
            title: "Acknowledge",
            body: "message ID, owner와 response deadline을 기록합니다.",
            tone: "emerald",
          },
        ]}
      />
      <RecoveryRule>
        incident key로 update를 묶어 중복 알림을 줄이고 resolved 상태에서 후속
        retry를 중단합니다.
      </RecoveryRule>
    </RecoveryFrame>
  );
}
