import { TaskFrame, TaskRule, TaskSteps } from "./TaskVizPrimitives";

export default function TaskStatusViz() {
  return (
    <TaskFrame
      label="VERSIONED STATE"
      title="상태 전이와 attempt evidence를 함께 저장한다"
      description="scheduler와 worker가 같은 task를 갱신하므로 expected version과 유효 전이를 원자적으로 확인합니다."
      note="늦게 도착한 이전 attempt event는 현재 task version과 generation이 다르면 거부합니다."
    >
      <TaskSteps
        items={[
          {
            label: "01",
            title: "Pending",
            body: "dependency와 validation을 통과한 배정 대기 상태입니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Leased",
            body: "worker와 만료 시각, attempt를 원자적으로 기록합니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Running",
            body: "heartbeat와 progress artifact를 현재 attempt에 연결합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Terminal",
            body: "completed·failed·cancelled와 verifier evidence를 남깁니다.",
            tone: "emerald",
          },
        ]}
      />
      <TaskRule>
        completed 전이는 worker의 자기 보고가 아니라 acceptance verifier 결과를
        요구합니다.
      </TaskRule>
    </TaskFrame>
  );
}
