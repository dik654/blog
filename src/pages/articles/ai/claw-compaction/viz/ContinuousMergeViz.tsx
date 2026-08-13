import {
  CompactFrame,
  CompactRule,
  CompactSteps,
} from "./CompactionPrimitives";

export default function ContinuousMergeViz() {
  return (
    <CompactFrame
      label="REPEATED COMPACTION"
      title="prior state를 parse하고 새 fact만 field별로 병합한다"
      description="각 cycle은 versioned state를 복원하고 새 로그인-debug 구간의 fact와 receipt를 병합한 뒤 budget을 넘을 때만 2차 압축합니다."
      note="포맷 migration이나 parse가 실패하면 기존 state를 보존합니다. 일반 message로 간주해 다시 자유 요약하면 누락을 정상 상태처럼 굳힐 수 있습니다."
    >
      <CompactSteps
        columns={3}
        steps={[
          {
            label: "CYCLE N",
            title: "prior state 읽기",
            body: "version·schema·source revision을 확인해 구조화된 상태를 복원합니다.",
            tone: "blue",
          },
          {
            label: "+ NEW",
            title: "새 구간 병합",
            body: "새 error·file·permission·edit/test receipt를 field 규칙에 맞춰 합칩니다.",
            tone: "violet",
          },
          {
            label: "NEXT",
            title: "새 prior state",
            body: "불변식, token budget과 next-action 복원을 확인해 다음 cycle로 넘깁니다.",
            tone: "emerald",
          },
        ]}
      />
      <CompactRule>
        <strong>회귀 평가:</strong> 여러 cycle 뒤에도 이미 적용한 edit를 반복하지
        않고 auth file, unresolved failure와 다음 test를 올바르게 선택하는지
        확인합니다.
      </CompactRule>
    </CompactFrame>
  );
}
