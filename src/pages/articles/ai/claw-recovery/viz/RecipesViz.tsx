import {
  RecoveryFrame,
  RecoveryRule,
  RecoverySteps,
} from "./RecoveryVizPrimitives";

export default function RecipesViz() {
  return (
    <RecoveryFrame
      label="BOUNDED RECOVERY"
      title="lane-17의 timeout을 effect 확인 없이 곧바로 재시도하지 않습니다"
      description="같은 로그인 test라도 첫 attempt의 결과가 불명확하면 분류·checkpoint·제한된 action·검증을 하나의 recovery receipt로 연결합니다."
      note="두 번째 test가 통과해도 첫 process나 외부 job이 남았다면 Recovered가 아닙니다. 같은 fingerprint 반복, budget 소진, destructive action 필요 중 하나면 evidence와 함께 escalation합니다."
    >
      <RecoverySteps
        compactMobile
        items={[
          {
            label: "01",
            title: "Timeout을 분류",
            body: "runner-timeout fingerprint와 exit 부재를 기록하고 code·conflict failure와 구분합니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "현재 state 보존",
            body: "lane-17 SHA, auth diff, process·job ID와 첫 attempt receipt를 checkpoint에 묶습니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "한 번만 다시 실행",
            body: "precondition과 idempotency가 맞을 때 남은 budget 1회로 같은 fixture를 제한해 실행합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Effect까지 검증",
            body: "auth test receipt, 새 regression과 첫 process·외부 job의 terminal state를 확인합니다.",
            tone: "emerald",
          },
        ]}
      />
      <RecoveryRule>
        Timeout은 실패 결과가 아니라 결과를 아직 모른다는 신호일 수 있습니다.
        따라서 retry 전에 첫 effect를 reconcile하고 attempt 수를 먼저 소비합니다.
      </RecoveryRule>
    </RecoveryFrame>
  );
}
