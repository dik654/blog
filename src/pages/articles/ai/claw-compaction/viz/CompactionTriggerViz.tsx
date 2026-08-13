import {
  CompactFrame,
  CompactRule,
  CompactSteps,
} from "./CompactionPrimitives";

export default function CompactionTriggerViz() {
  return (
    <CompactFrame
      label="TRIGGER"
      title="같은 변환으로 들어오는 세 가지 경로"
      description="예방, 명시적 요청, provider 오류 복구는 시작 조건만 다르고 실제 compaction 책임은 공유합니다."
      note="Trigger는 context 변환을 시작할 뿐 권한을 넓히거나 이미 실행된 external effect를 되돌리지 않습니다. 구체적인 이름과 임계값은 provider와 harness에 따라 달라질 수 있습니다."
    >
      <CompactSteps
        columns={3}
        steps={[
          {
            label: "BEFORE CALL",
            title: "예방",
            body: "출력 여유를 포함한 token budget을 먼저 확인합니다.",
            tone: "blue",
          },
          {
            label: "USER",
            title: "명시적 실행",
            body: "디버깅과 사용자의 직접 제어 경로를 제공합니다.",
            tone: "violet",
          },
          {
            label: "RECOVERY",
            title: "오류 뒤 복구",
            body: "context length 오류를 감지하고 제한된 횟수만 재시도합니다.",
            tone: "amber",
          },
        ]}
      />
      <CompactRule>
        <strong>공통 진입점:</strong> trigger마다 다른 요약을 만들지 않고 같은{" "}
        <code>compact_session()</code>을 호출합니다.
      </CompactRule>
    </CompactFrame>
  );
}
