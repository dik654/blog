import {
  OverviewFrame,
  OverviewRule,
  OverviewSteps,
} from "./OverviewVizPrimitives";

export default function ArchitectureViz() {
  return (
    <OverviewFrame
      label="INDEPENDENT REIMPLEMENTATION"
      title="Claw Code가 소유하는 것은 host loop다"
      description="이 그림은 독립 reference implementation의 요청 경로입니다. Claude Code의 공식 source나 내부 구조를 설명하는 도식이 아닙니다."
      note="hooks와 MCP가 capability를 늘려도 host의 permission gate를 건너뛸 수는 없습니다. 이 경계는 Claw Code repository에서 관찰한 설계이지 모든 coding agent의 보편 구조라는 주장도 아닙니다."
    >
      <OverviewSteps
        items={[
          {
            label: "01 · REQUEST",
            title: "CLI · host entry",
            body: "사용자 요청을 runtime command로 바꾸고 event를 표시합니다.",
            tone: "blue",
          },
          {
            label: "02 · LOOP OWNER",
            title: "Agent runtime",
            body: "conversation state와 model·tool turn의 다음 단계를 소유합니다.",
            tone: "violet",
          },
          {
            label: "03 · POLICY / EFFECT",
            title: "Permission → tool",
            body: "side effect 전에 allow·deny·ask를 판정한 뒤 제한된 동작을 실행합니다.",
            tone: "amber",
          },
          {
            label: "04 · OBSERVATION",
            title: "Result → session",
            body: "tool result와 provider event를 기록해 다음 model turn의 입력으로 돌려줍니다.",
            tone: "emerald",
          },
        ]}
      />
      <OverviewRule>
        요청 → 제안 → 정책 판정 → 실행 → 관찰의 순환을 host runtime이 닫습니다.
        모델은 다음 행동을 제안하지만, 실행 권한과 side effect는 host가 강제합니다.
      </OverviewRule>
    </OverviewFrame>
  );
}
