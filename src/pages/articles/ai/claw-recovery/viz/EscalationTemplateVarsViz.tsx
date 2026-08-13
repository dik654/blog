import {
  RecoveryFrame,
  RecoveryRule,
  RecoverySteps,
} from "./RecoveryVizPrimitives";

export default function EscalationTemplateVarsViz() {
  return (
    <RecoveryFrame
      label="EVIDENCE BUNDLE"
      title="받는 사람이 바로 결정할 수 있는 정보를 보낸다"
      description="원문 log를 붙여 넣기보다 incident identity, 영향, 현재 state와 안전한 선택지를 요약합니다."
      note="raw artifact는 access-controlled link로 분리하고 secret·prompt·user data를 redaction합니다."
    >
      <RecoverySteps
        items={[
          {
            label: "WHAT",
            title: "Failure",
            body: "class, fingerprint와 발생 시각을 담습니다.",
            tone: "rose",
          },
          {
            label: "IMPACT",
            title: "Affected scope",
            body: "task, branch, service와 사용자 영향을 연결합니다.",
            tone: "amber",
          },
          {
            label: "TRIED",
            title: "Recovery attempts",
            body: "recipe, 결과와 남은 budget을 시간순으로 보여 줍니다.",
            tone: "blue",
          },
          {
            label: "NEXT",
            title: "Decision options",
            body: "approve·rollback·defer 같은 구체적 선택지를 제시합니다.",
            tone: "emerald",
          },
        ]}
      />
      <RecoveryRule>
        template value는 typed field에서 가져오고 notifier별 escaping을
        적용합니다.
      </RecoveryRule>
    </RecoveryFrame>
  );
}
