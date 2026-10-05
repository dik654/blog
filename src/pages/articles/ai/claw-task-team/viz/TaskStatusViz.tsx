import { TaskFrame, TaskRule, TaskSteps } from "./TaskVizPrimitives";

export default function TaskStatusViz() {
  return (
    <TaskFrame
      label="AUTH-401-17 · ATTEMPT 2"
      title="로그인 수정은 lease version 7과 검증 증거를 따라 전이한다"
      description="src/auth.ts만 고치는 worker w-3의 작업을 생성부터 완료 판정까지 추적합니다."
      note="이 그림은 안전한 hardening 계약입니다. Pinned registry가 durable lease·분산 CAS·verifier gate를 모두 구현했다는 뜻은 아닙니다."
    >
      <TaskSteps
        items={[
          {
            label: "01",
            title: "Pending",
            body: "scope·금지 조건·login fixture가 검증된 배정 대기 상태입니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Leased",
            body: "w-3·attempt 2·lease version 7과 만료 시각을 함께 기록합니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Running",
            body: "src/auth.ts diff와 heartbeat를 현재 attempt에 연결합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Completed",
            body: "허용된 diff와 login fixture exit 0을 verifier가 확인합니다.",
            tone: "emerald",
          },
        ]}
        compactMobile
      />
      <TaskRule>
        Packet의 scope는 권한이 아닙니다. credential·network 접근은 별도 policy가
        거부하며, worker의 자기 보고만으로 Completed가 되지 않습니다.
      </TaskRule>
    </TaskFrame>
  );
}
