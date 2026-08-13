import { HookFrame, HookRule, HookSteps } from "./HookVizPrimitives";

export default function PrePostFlowViz() {
  return (
    <HookFrame
      label="HOOK BOUNDARIES"
      title="실행 전 제한과 실행 후 관찰의 책임을 나눈다"
      description="Pre hook은 permission을 더 엄격하게 만들 수 있고, Post hook은 이미 발생한 side effect와 별도로 후속 결과를 남깁니다."
      note="Post hook 실패를 원래 tool failure로 바꾸면 모델이 완료된 action을 중복 실행할 수 있습니다."
    >
      <HookSteps
        items={[
          {
            label: "01",
            title: "Canonical action",
            body: "tool input·resource·attempt를 고정합니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Base + Pre",
            body: "기본 policy와 pre hook을 가장 제한적으로 합칩니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Execute",
            body: "최종 approval과 boundary를 통과한 action만 실행합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Post evidence",
            body: "tool result와 post hook result를 분리해 기록합니다.",
            tone: "emerald",
          },
        ]}
      />
      <HookRule>
        action이 수정되면 새 identity로 validation과 permission을 다시
        수행합니다.
      </HookRule>
    </HookFrame>
  );
}
