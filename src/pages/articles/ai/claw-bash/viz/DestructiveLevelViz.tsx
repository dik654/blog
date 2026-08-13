import { BashFrame, BashRule, BashSteps } from "./BashVizPrimitives";

export default function DestructiveLevelViz() {
  return (
    <BashFrame
      label="RISK CONTEXT"
      title="명령 이름보다 target과 복구 가능성을 본다"
      description="같은 삭제 명령도 경계, 범위와 version control 상태에 따라 다른 decision이 필요합니다."
      note="flag 기반 severity는 빠른 신호일 뿐 canonical target 분석을 대체하지 않습니다."
    >
      <BashSteps
        items={[
          {
            label: "DENY",
            title: "Host · device",
            body: "root filesystem과 raw device처럼 복구 어려운 target입니다.",
            tone: "rose",
          },
          {
            label: "CONFIRM",
            title: "Workspace 전체",
            body: "정확한 범위와 복구 지점을 보여 주고 승인받습니다.",
            tone: "amber",
          },
          {
            label: "REVIEW",
            title: "Tracked source",
            body: "작은 범위라도 사용자 작업 손실 가능성을 확인합니다.",
            tone: "violet",
          },
          {
            label: "LIMITED",
            title: "Generated output",
            body: "명확한 build artifact와 clean state에서만 낮은 risk입니다.",
            tone: "emerald",
          },
        ]}
      />
      <BashRule>
        wildcard expansion과 symlink를 반영한 실제 target 집합이 승인 화면과
        enforcement에서 같아야 합니다.
      </BashRule>
    </BashFrame>
  );
}
