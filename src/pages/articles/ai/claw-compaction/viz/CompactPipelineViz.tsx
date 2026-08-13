import {
  CompactFrame,
  CompactRule,
  CompactSteps,
} from "./CompactionPrimitives";

export default function CompactPipelineViz() {
  return (
    <CompactFrame
      label="COMPACTION PIPELINE"
      title="raw history를 검증 가능한 compacted state로 바꾼다"
      description="로그인 실패 수정 기록에서 보존할 사실과 외부 evidence를 먼저 고른 뒤 구조화하고, 복원 검사를 통과한 경우에만 다음 model context를 교체합니다."
      note="Compaction은 context representation을 바꾸는 작업입니다. 이미 내려진 permission decision, 실행된 edit와 외부 effect를 취소하거나 rollback하지 않으며 durable ledger와 receipt를 참조합니다."
    >
      <CompactSteps
        steps={[
          {
            label: "01 · RAW HISTORY",
            title: "보존 경계 계산",
            body: "로그인 요청, call/result pair와 최근 turn을 요약 대상에서 분리합니다.",
            tone: "blue",
          },
          {
            label: "02 · SELECT / SUMMARIZE",
            title: "작업 상태 추출",
            body: "목표·auth file·실패 원인·permission·edit/test receipt를 구조화합니다.",
            tone: "violet",
          },
          {
            label: "03 · COMPACTED STATE",
            title: "Prior state + recent",
            body: "구조화된 오래된 상태와 최근 원문, artifact reference를 합칩니다.",
            tone: "amber",
          },
          {
            label: "04 · VERIFY / RESTORE",
            title: "검증 뒤 교체",
            body: "schema·budget·tool pair·핵심 fact를 검사하고 실패하면 기존 context를 유지합니다.",
            tone: "emerald",
          },
        ]}
      />
      <CompactRule>
        <strong>복원 질문:</strong> 다음 model이 수정한 파일, test 결과, 미완료
        작업과 사용자가 거부한 권한을 다시 말할 수 있는가? 답할 수 없다면 새
        state를 commit하지 않습니다.
      </CompactRule>
    </CompactFrame>
  );
}
