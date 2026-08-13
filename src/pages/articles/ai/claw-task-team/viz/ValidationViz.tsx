import { TaskFrame, TaskRule, TaskSteps } from "./TaskVizPrimitives";

export default function ValidationViz() {
  return (
    <TaskFrame
      label="THREE CHECKPOINTS"
      title="같은 task를 세 시점에서 다른 기준으로 검증한다"
      description="명세의 일관성, 실행 capability, 결과 evidence는 서로 대체할 수 없습니다."
      note="임의 completion command도 code execution이므로 Bash와 같은 permission·sandbox 경계를 통과합니다."
    >
      <TaskSteps
        columns={3}
        items={[
          {
            label: "REGISTER",
            title: "Well-formed contract",
            body: "goal, constraint와 dependency 모순을 찾습니다.",
            tone: "blue",
          },
          {
            label: "DISPATCH",
            title: "Effective scope",
            body: "team·worker capability와 실제 path를 resolve합니다.",
            tone: "violet",
          },
          {
            label: "COMPLETE",
            title: "Isolated verifier",
            body: "clean environment에서 artifact와 criterion을 검사합니다.",
            tone: "emerald",
          },
        ]}
      />
      <TaskRule>
        partially complete와 manual review는 성공이 아니라 남은 검증을 명시하는
        별도 상태입니다.
      </TaskRule>
    </TaskFrame>
  );
}
