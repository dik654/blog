import {
  OverviewFrame,
  OverviewRule,
  OverviewSteps,
} from "./OverviewVizPrimitives";

export default function ParityFlowViz() {
  return (
    <OverviewFrame
      label="REFERENCE ≠ ORACLE"
      title="Python과 Rust를 같은 contract 위에 놓는다"
      description="언어별 내부 구조를 복제하는 대신 같은 fixture에서 외부에 드러나는 의미를 canonical form으로 비교합니다."
      note="Python reference는 선택한 동작을 읽기 쉽게 표현한 비교 기준이지 자동으로 옳은 명세가 아닙니다. mismatch가 나면 fixture, 정규화 규칙, product contract와 의도된 변경을 차례로 확인합니다."
    >
      <OverviewSteps
        items={[
          {
            label: "01",
            title: "Shared fixture",
            body: "입력, mock I/O와 지켜야 할 invariant를 두 구현에 똑같이 제공합니다.",
            tone: "blue",
          },
          {
            label: "02A",
            title: "Python reference",
            body: "선택한 behavior를 작고 읽기 쉬운 형태로 재현합니다.",
            tone: "violet",
          },
          {
            label: "02B",
            title: "Rust runtime",
            body: "정본 Rust host loop의 public contract를 실행합니다.",
            tone: "emerald",
          },
          {
            label: "03",
            title: "Canonical diff",
            body: "시간·UUID 같은 비결정 필드를 정규화한 semantic result를 비교합니다.",
            tone: "amber",
          },
        ]}
      />
      <OverviewRule>
        같은 결과란 같은 내부 class나 field가 아니라 같은 permission outcome,
        tool result, session state와 계약된 event order를 뜻합니다.
      </OverviewRule>
    </OverviewFrame>
  );
}
