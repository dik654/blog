import { WorkerFrame, WorkerRule, WorkerSteps } from "./WorkerVizPrimitives";

export default function MisdeliveryViz() {
  return (
    <WorkerFrame
      label="DELIVERY PROTOCOL"
      title="전송과 수신, 실행을 다른 상태로 기록한다"
      description="message identity와 acknowledgement가 있어야 늦은 event와 중복 retry를 구분할 수 있습니다."
      note="terminal echo-back은 bytes 표시를 확인할 뿐 request 처리 acknowledgement가 아닙니다."
    >
      <WorkerSteps
        items={[
          {
            label: "01",
            title: "Send",
            body: "worker·generation·task·attempt ID와 payload를 보냅니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Acknowledge",
            body: "같은 identity로 수신과 ownership을 확인합니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Deduplicate",
            body: "timeout retry가 side effect를 중복 실행하지 않게 합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Finalize",
            body: "terminal state와 검증된 artifact를 연결합니다.",
            tone: "emerald",
          },
        ]}
      />
      <WorkerRule>
        restart는 새 generation과 attempt이며 이전 결과는 검증 없이 현재 작업에
        합치지 않습니다.
      </WorkerRule>
    </WorkerFrame>
  );
}
