import { OverviewFrame, OverviewSteps } from "./OverviewVizPrimitives";

export default function PythonSubsystemsViz() {
  return (
    <OverviewFrame
      label="OBSERVABLE CONTRACT"
      title="reference layer는 내부 구조가 아니라 네 가지 관찰면을 비교한다"
      description="언어별 class 수나 field 배치 대신 runtime 밖에서 같은 의미로 확인할 수 있는 결과를 고정합니다."
      note="mock은 실제 filesystem permission, process signal, provider network를 재현하지 못합니다. 이 영역은 별도의 integration test가 소유합니다."
    >
      <OverviewSteps
        items={[
          {
            label: "POLICY",
            title: "Permission",
            body: "같은 요청이 같은 allow·deny·ask 결과를 내는지 확인합니다.",
            tone: "amber",
          },
          {
            label: "EFFECT",
            title: "Tool result",
            body: "output과 error category를 공통 형태로 비교합니다.",
            tone: "emerald",
          },
          {
            label: "STATE",
            title: "Session",
            body: "turn 뒤에 남은 message와 compaction state를 확인합니다.",
            tone: "violet",
          },
          {
            label: "STREAM",
            title: "Events",
            body: "event 의미와 순서가 contract를 지키는지 확인합니다.",
            tone: "blue",
          },
        ]}
      />
    </OverviewFrame>
  );
}
