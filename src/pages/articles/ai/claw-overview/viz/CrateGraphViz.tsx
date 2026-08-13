import {
  OverviewFrame,
  OverviewRule,
  OverviewSteps,
} from "./OverviewVizPrimitives";

export default function CrateGraphViz() {
  return (
    <OverviewFrame
      label="CRATE DEPENDENCY"
      title="호출은 중심 runtime으로 들어오고 결과는 contract로 돌아온다"
      description="분석 snapshot의 crate 이름보다 누가 host loop와 state를 소유하는지, 역방향 의존이 생기지 않는지를 봅니다."
      note="crate 수와 이름은 repository snapshot에 따라 바뀔 수 있습니다. 여기서 유지할 원칙은 주 실행 runtime이 CLI 화면 타입이나 test harness에 의존하지 않는다는 점입니다."
    >
      <OverviewSteps
        columns={2}
        items={[
          {
            label: "CALLER → CORE",
            title: "CLI · plugin",
            body: "runtime의 public contract를 호출하되 conversation state를 직접 바꾸지 않습니다.",
            tone: "blue",
          },
          {
            label: "STATE OWNER",
            title: "Runtime · session",
            body: "host loop, state transition과 실행 이후의 다음 단계를 소유합니다.",
            tone: "violet",
          },
          {
            label: "CORE → PORT",
            title: "Provider · tools",
            body: "runtime의 요청을 외부 호출과 제한된 side effect로 바꾸고 structured result를 반환합니다.",
            tone: "emerald",
          },
          {
            label: "TEST → CORE",
            title: "Parity harness",
            body: "주 실행 runtime을 호출해 관찰 결과를 검증하지만 runtime의 import 대상은 아닙니다.",
            tone: "slate",
          },
        ]}
      />
      <OverviewRule>
        의존 방향은 CLI / harness → runtime → provider / tools입니다. Telemetry는
        이 경로를 관찰하되 상태 전이를 결정하지 않습니다.
      </OverviewRule>
    </OverviewFrame>
  );
}
