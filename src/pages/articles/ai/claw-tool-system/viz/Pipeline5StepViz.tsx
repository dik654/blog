import { ToolFrame, ToolRule, ToolSteps } from "./ToolVizPrimitives";

export default function Pipeline5StepViz() {
  return (
    <ToolFrame
      label="FIVE HOST BOUNDARIES"
      title="등록된 계약에서 result까지 다섯 경계를 순서대로 지난다"
      description="JSON 모양이 맞는 것, 현재 workspace에서 의미가 있는 것, 실제 side effect가 허용되는 것은 서로 다른 조건입니다."
      note="schema·domain·permission·execution error는 서로 다른 stable code로 반환합니다. 어느 단계에서든 실패하면 뒤 단계는 실행하지 않습니다."
    >
      <ToolSteps
        columns={5}
        items={[
          {
            label: "01 · REGISTRY",
            title: "Registry entry",
            body: "host가 등록한 name·schema digest·generation에 call을 묶습니다.",
            tone: "blue",
          },
          {
            label: "02 · VALIDATE",
            title: "Schema & domain",
            body: "required field와 canonical path·test target을 검증합니다.",
            tone: "violet",
          },
          {
            label: "03 · AUTHORIZE",
            title: "Effect descriptor",
            body: "read·write·process effect를 계산해 permission 판정을 받습니다.",
            tone: "amber",
          },
          {
            label: "04 · DISPATCH",
            title: "Executor",
            body: "Allow된 action만 deadline과 cancellation 아래 실행합니다.",
            tone: "emerald",
          },
          {
            label: "05 · RETURN",
            title: "Result envelope",
            body: "content, code, artifact와 잘림 여부를 정규화합니다.",
            tone: "slate",
          },
        ]}
      />
      <ToolRule>
        unknown field와 임의 coercion을 허용하지 않습니다. 모델이 수정할 수 있는
        오류에는 field path와 기대 type을 주되 secret과 내부 경로는 노출하지
        않습니다.
      </ToolRule>
    </ToolFrame>
  );
}
