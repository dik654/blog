import { PolicyFrame, PolicyRule, PolicySteps } from "./PolicyVizPrimitives";

export default function LaneContextViz() {
  return (
    <PolicyFrame
      label="EVALUATION SNAPSHOT"
      title="서로 다른 source의 evidence를 한 시점의 context로 고정한다"
      description="Git·CI·task·approval collector가 provenance와 freshness를 보존하고 evaluator는 완성된 snapshot만 읽습니다."
      note="Lane과 LaneContext는 이 저장소 내부 이름이며, 핵심 설계는 immutable snapshot과 source별 Unknown 처리입니다."
    >
      <PolicySteps
        items={[
          {
            label: "GIT",
            title: "Revision",
            body: "branch·worktree·head SHA와 dirty state를 수집합니다.",
            tone: "blue",
          },
          {
            label: "CI",
            title: "Verification",
            body: "run·artifact·result와 대상 revision을 연결합니다.",
            tone: "violet",
          },
          {
            label: "CONTROL",
            title: "Task & approval",
            body: "owner·dependency·block·approval scope를 수집합니다.",
            tone: "amber",
          },
          {
            label: "SNAPSHOT",
            title: "LaneContext",
            body: "generation·observed_at·Unknown cause를 함께 고정합니다.",
            tone: "emerald",
          },
        ]}
      />
      <PolicyRule>
        새 callback은 현재 snapshot을 수정하지 않고 다음 generation에
        반영합니다.
      </PolicyRule>
    </PolicyFrame>
  );
}
