import {
  SessionFrame,
  SessionRule,
  SessionSteps,
} from "./SessionVizPrimitives";

export default function TurnLoopViz() {
  return (
    <SessionFrame
      label="TURN TRANSACTION"
      title="append·execute·commit 경계를 외부 effect마다 둔다"
      description="로그인 실패 수정 turn은 요청과 실행 의도를 먼저 append하고, edit 결과와 test receipt를 각각 commit한 뒤에야 최종 응답을 확정합니다."
      note="turn 전체를 데이터베이스 transaction처럼 rollback할 수는 없습니다. 파일 수정이나 외부 API 호출은 이미 적용됐을 수 있으므로 receipt로 중복을 탐지하고 필요하면 보상 작업을 새 event로 기록합니다."
    >
      <SessionSteps
        items={[
          {
            label: "01 · APPEND INTENT",
            title: "요청과 base revision",
            body: "로그인 실패 요청과 expected revision을 검증해 turn intent를 append합니다.",
            tone: "blue",
          },
          {
            label: "02 · BUILD TRANSIENT",
            title: "Attempt buffer",
            body: "model stream과 partial tool JSON은 완성될 때까지 commit 대상과 분리합니다.",
            tone: "violet",
          },
          {
            label: "03 · EFFECT COMMIT",
            title: "Permission → edit",
            body: "승인 digest, idempotency key, file digest와 edit result를 같은 attempt에 commit합니다.",
            tone: "amber",
          },
          {
            label: "04 · VERIFY COMMIT",
            title: "Test receipt → complete",
            body: "deterministic test receipt와 최종 message를 기록하고 새 session revision을 공개합니다.",
            tone: "emerald",
          },
        ]}
      />
      <SessionRule>
        rollback은 아직 commit하지 않은 stream buffer와 derived view에만 적용합니다.
        edit가 실행된 뒤 실패했다면 receipt를 확인해 reconcile하고, 완료·취소·승인
        대기·budget 소진을 서로 다른 outcome으로 기록합니다.
      </SessionRule>
    </SessionFrame>
  );
}
