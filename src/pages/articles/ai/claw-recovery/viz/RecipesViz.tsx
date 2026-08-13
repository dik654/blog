import {
  RecoveryFrame,
  RecoveryRule,
  RecoverySteps,
} from "./RecoveryVizPrimitives";

export default function RecipesViz() {
  return (
    <RecoveryFrame
      label="BOUNDED RECOVERY"
      title="state를 보존한 뒤 한 단계씩 복구한다"
      description="failure evidence와 precondition이 맞을 때만 action을 실행하고 별도 verifier로 성공을 판정합니다."
      note="destructive action은 checkpoint와 명시적 approval이 없으면 자동 recipe에서 제외합니다."
    >
      <RecoverySteps
        items={[
          {
            label: "01",
            title: "Classify",
            body: "transient·code·conflict·resource failure를 구분합니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Checkpoint",
            body: "diff, branch와 외부 job identity를 보존합니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Act",
            body: "idempotent하거나 보상 가능한 최소 action을 실행합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Verify",
            body: "원래 failure와 새 regression을 독립적으로 검사합니다.",
            tone: "emerald",
          },
        ]}
      />
      <RecoveryRule>
        같은 fingerprint가 반복되거나 budget이 끝나면 recipe를 바꾸거나
        escalation합니다.
      </RecoveryRule>
    </RecoveryFrame>
  );
}
