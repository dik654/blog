import { TaskFrame, TaskRule, TaskSteps } from "./TaskVizPrimitives";

export default function TeamCronViz() {
  return (
    <TaskFrame
      label="SCHEDULED TASK PATH"
      title="cron도 수동 요청과 같은 registry 경로를 탄다"
      description="scheduler는 versioned task를 만들고 team routing과 validation, permission을 우회하지 않습니다."
      note="timezone, misfire, overlap과 idempotency policy가 schedule expression만큼 중요합니다."
    >
      <TaskSteps
        items={[
          {
            label: "01",
            title: "Due run",
            body: "timezone과 logical run time으로 실행 시점을 확정합니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Deduplicate",
            body: "schedule ID와 예정 시각으로 중복 생성을 막습니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Create task",
            body: "template version을 포함해 registry validation을 받습니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Route team",
            body: "capability와 concurrency가 맞는 worker pool에 배정합니다.",
            tone: "emerald",
          },
        ]}
      />
      <TaskRule>
        이전 run이 남아 있으면 job별 skip·queue·replace 정책을 적용합니다.
      </TaskRule>
    </TaskFrame>
  );
}
