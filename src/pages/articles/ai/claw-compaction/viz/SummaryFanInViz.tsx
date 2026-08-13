import {
  CompactFrame,
  CompactRule,
  CompactSteps,
} from "./CompactionPrimitives";

export default function SummaryFanInViz() {
  return (
    <CompactFrame
      label="STATE TRANSITION"
      title="오래된 turn은 상태로, 최근 turn은 원문으로"
      description="여러 메시지를 하나의 구조화된 prior context로 모으되 system message와 최근 대화는 별도로 유지합니다."
      note="Compaction은 lossless archive도 effect rollback도 아닙니다. 원문 transcript와 실행 receipt가 필요하면 세션·artifact 저장소에 별도로 보존합니다."
    >
      <CompactSteps
        columns={3}
        steps={[
          {
            label: "OLD",
            title: "오래된 메시지",
            body: "목표·결정·오류·파일 fact를 추출합니다.",
            tone: "amber",
          },
          {
            label: "SUMMARY",
            title: "prior context",
            body: "다음 호출에 필요한 구조화된 상태로 만듭니다.",
            tone: "violet",
          },
          {
            label: "RECENT",
            title: "최근 메시지",
            body: "현재 작업 맥락을 원문 그대로 이어 붙입니다.",
            tone: "emerald",
          },
        ]}
      />
      <CompactRule>
        <strong>보존 경계:</strong> system instruction과 tool call/result pair가
        압축 경계에서 끊기지 않아야 합니다.
      </CompactRule>
    </CompactFrame>
  );
}
