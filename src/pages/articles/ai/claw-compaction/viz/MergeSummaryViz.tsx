import {
  CompactFrame,
  CompactRule,
  CompactSteps,
} from "./CompactionPrimitives";

export default function MergeSummaryViz() {
  return (
    <CompactFrame
      label="FIELD-AWARE MERGE"
      title="각 필드의 의미에 맞춰 prior state와 새 fact를 합친다"
      description="이전 summary를 다시 자유 요약하지 않고 로그인 수정 상태의 최신값, 집합, 사건과 순서를 field별 규칙으로 병합합니다."
      note="자연어 유사도만으로 dedup하면 다른 실패를 합칠 수 있습니다. task ID, canonical path, tool call ID, error code와 receipt digest 같은 안정적인 key를 우선합니다."
    >
      <CompactSteps
        steps={[
          {
            label: "LATEST",
            title: "current work",
            body: "로그인 수정과 검증 중 어느 단계인지 가장 최근 상태를 선택합니다.",
            tone: "blue",
          },
          {
            label: "SET",
            title: "pending·files",
            body: "auth file과 남은 test를 stable key로 합치고 완료 항목을 제외합니다.",
            tone: "violet",
          },
          {
            label: "EVENT",
            title: "errors·milestones",
            body: "실패 원인, permission, edit와 test receipt의 해결 여부를 보존합니다.",
            tone: "amber",
          },
          {
            label: "ORDER",
            title: "timeline",
            body: "effect와 검증 순서는 유지하고 오래된 탐색 세부는 낮게 평가합니다.",
            tone: "emerald",
          },
        ]}
      />
      <CompactRule>
        <strong>목표:</strong> 여러 번 병합해도 같은 receipt가 늘지 않고, 최신
        test 실패가 과거 성공에 덮이지 않으며 권한 상태를 추측하지 않아야
        합니다.
      </CompactRule>
    </CompactFrame>
  );
}
