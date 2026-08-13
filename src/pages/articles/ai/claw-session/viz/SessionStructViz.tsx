import {
  SessionFrame,
  SessionRule,
  SessionSteps,
} from "./SessionVizPrimitives";

export default function SessionStructViz() {
  return (
    <SessionFrame
      label="DURABLE FACTS VS TRANSIENT BYTES"
      title="commit된 작업 기록과 진행 중 stream buffer를 분리한다"
      description="로그인 실패 수정 세션은 message뿐 아니라 permission, tool result와 test receipt를 revision에 묶되 아직 완성되지 않은 provider stream은 별도 buffer에 둡니다."
      note="세션 객체 하나에 모든 mutable state를 넣으라는 뜻은 아닙니다. append-only event, derived view와 transient runtime buffer를 서로 다른 수명으로 관리하되 session·turn·attempt identity로 연결합니다."
    >
      <SessionSteps
        items={[
          {
            label: "COMMITTED · MESSAGE",
            title: "요청과 응답 block",
            body: "로그인 실패 요청, 완성된 assistant message와 call/result 대응을 보존합니다.",
            tone: "blue",
          },
          {
            label: "COMMITTED · EFFECT",
            title: "실행과 검증 ledger",
            body: "permission decision, edit result, idempotency key와 deterministic test receipt를 남깁니다.",
            tone: "violet",
          },
          {
            label: "COMMITTED · BOUNDARY",
            title: "Authority & recovery",
            body: "workspace·policy·tool generation, approval scope와 checkpoint revision을 참조합니다.",
            tone: "amber",
          },
          {
            label: "TRANSIENT · ATTEMPT",
            title: "Stream buffer",
            body: "partial text·JSON delta·in-flight process handle은 완성 전 session event가 아닙니다.",
            tone: "emerald",
          },
        ]}
      />
      <SessionRule>
        crash가 나면 transient buffer는 버릴 수 있지만 commit된 message, effect와
        receipt는 rollback하지 않습니다. 세션은 대용량 artifact·telemetry의
        identity만 참조하고 원본 수명은 각 저장소가 관리합니다.
      </SessionRule>
    </SessionFrame>
  );
}
