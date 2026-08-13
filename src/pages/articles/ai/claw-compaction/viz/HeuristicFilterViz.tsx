import {
  CompactFrame,
  CompactRule,
  CompactSteps,
} from "./CompactionPrimitives";

export default function HeuristicFilterViz() {
  return (
    <CompactFrame
      label="PRIORITY POLICY"
      title="다음 행동과 복구에 필요한 fact부터 남긴다"
      description="로그인 실패 수정의 목표·미완료 검증·오류 조건과 durable evidence reference를 먼저 보존하고 반복 탐색은 예산이 남을 때만 포함합니다."
      note="우선순위는 권한이 아닙니다. summary에서 fact를 남기거나 줄여도 permission scope, file state와 external effect의 실제 값은 각 owner가 결정합니다."
    >
      <CompactSteps
        columns={3}
        steps={[
          {
            label: "KEEP FIRST",
            title: "목표·pending test",
            body: "다음 turn에서 무엇을 검증할지 결정하는 현재 상태",
            tone: "emerald",
          },
          {
            label: "KEEP CONTEXT",
            title: "오류·auth file·receipt",
            body: "실패를 재현하고 이미 적용한 edit를 중복하지 않게 하는 근거",
            tone: "blue",
          },
          {
            label: "DROP LATER",
            title: "반복 search·긴 stdout",
            body: "현재 task와 연결이 약하고 external reference로 다시 찾을 수 있는 세부",
            tone: "amber",
          },
        ]}
      />
      <CompactRule>
        <strong>보호 장치:</strong> permission denial, unresolved error와
        deterministic test receipt에는 reserve를 두고 제거한 fact 유형과 source
        revision을 metric으로 남깁니다.
      </CompactRule>
    </CompactFrame>
  );
}
