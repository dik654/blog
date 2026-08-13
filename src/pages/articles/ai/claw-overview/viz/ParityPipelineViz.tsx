import {
  OverviewFrame,
  OverviewRule,
  OverviewSteps,
} from "./OverviewVizPrimitives";

export default function ParityPipelineViz() {
  return (
    <OverviewFrame
      label="LAYERED EVIDENCE"
      title="빠른 parity test가 못 보는 영역을 실제 통합 테스트가 채운다"
      description="한 종류의 테스트에 완결성을 기대하지 않고, 실행 빈도와 외부 현실성을 서로 다른 계층이 소유하게 합니다."
      note="release gate로 갈수록 느리고 비싸지지만 provider와 OS가 만드는 실제 차이를 더 많이 관찰합니다. 어느 한 계층도 제품 전체의 parity를 단독으로 증명하지 않습니다."
    >
      <OverviewSteps
        columns={3}
        items={[
          {
            label: "EVERY COMMIT",
            title: "Fixture parity",
            body: "고정 fixture로 state transition과 parser 회귀를 빠르게 찾습니다.",
            tone: "emerald",
          },
          {
            label: "CONTRACT",
            title: "Provider integration",
            body: "인증, 실제 stream과 provider protocol drift를 확인합니다.",
            tone: "blue",
          },
          {
            label: "RELEASE",
            title: "End-to-end",
            body: "sandbox, OS I/O와 실제 사용자 경로를 함께 검증합니다.",
            tone: "violet",
          },
        ]}
      />
      <OverviewRule>
        Golden output 변경에는 contract 설명을 남깁니다. 이유 없는 snapshot
        갱신으로 regression을 정상 결과처럼 만들지 않습니다.
      </OverviewRule>
    </OverviewFrame>
  );
}
