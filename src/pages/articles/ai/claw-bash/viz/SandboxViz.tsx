import { BashFrame, BashRule, BashSteps } from "./BashVizPrimitives";

export default function SandboxViz() {
  return (
    <BashFrame
      label="OS ISOLATION"
      title="명령을 해석하기보다 실행 환경을 좁힌다"
      description="bubblewrap은 mount, PID와 network namespace를 조합해 process가 닿을 수 있는 범위를 줄입니다."
      note="host kernel은 공유하므로 seccomp·cgroup·non-root·egress policy를 함께 적용해야 합니다."
    >
      <BashSteps
        items={[
          {
            label: "MOUNT",
            title: "Read-only system",
            body: "system path는 읽기 전용 view로 제공합니다.",
            tone: "blue",
          },
          {
            label: "WRITE",
            title: "Workspace only",
            body: "작업 경로와 tmp만 필요한 범위에서 씁니다.",
            tone: "emerald",
          },
          {
            label: "NETWORK",
            title: "Default deny",
            body: "외부 통신은 명시적 egress policy로만 엽니다.",
            tone: "violet",
          },
          {
            label: "PROCESS",
            title: "PID · resources",
            body: "host process 관찰과 자원 고갈을 별도로 제한합니다.",
            tone: "amber",
          },
        ]}
      />
      <BashRule>
        untrusted mode에서 backend 준비에 실패하면 host shell로 fallback하지
        않고 fail-closed로 중단합니다.
      </BashRule>
    </BashFrame>
  );
}
