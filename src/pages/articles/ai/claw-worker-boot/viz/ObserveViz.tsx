import { WorkerFrame, WorkerRule, WorkerSteps } from "./WorkerVizPrimitives";

export default function ObserveViz() {
  return (
    <WorkerFrame
      label="OBSERVATION PRIORITY"
      title="강한 신호부터 상태를 조합한다"
      description="process와 protocol을 우선하고 terminal text는 compatibility hint로만 사용합니다."
      note="확신이 낮은 화면 패턴은 Unknown으로 남기며 자동 완료나 입력 전송을 일으키지 않습니다."
    >
      <WorkerSteps
        columns={3}
        items={[
          {
            label: "AUTHORITATIVE",
            title: "Exit · signal",
            body: "OS process lifecycle과 실제 exit status를 봅니다.",
            tone: "rose",
          },
          {
            label: "STRUCTURED",
            title: "Worker event",
            body: "task ID가 붙은 ready·progress·result를 받습니다.",
            tone: "emerald",
          },
          {
            label: "HEURISTIC",
            title: "PTY screen",
            body: "protocol이 없는 CLI의 prompt와 error를 추정합니다.",
            tone: "amber",
          },
        ]}
      />
      <WorkerRule>
        runtime state와 관찰이 다르면 evidence를 확인한 뒤 전이하고, 화면
        문구만으로 성공을 선언하지 않습니다.
      </WorkerRule>
    </WorkerFrame>
  );
}
