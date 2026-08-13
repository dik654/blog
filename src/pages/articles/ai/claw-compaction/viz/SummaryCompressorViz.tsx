import {
  CompactFrame,
  CompactRule,
  CompactSteps,
} from "./CompactionPrimitives";

export default function SummaryCompressorViz() {
  return (
    <CompactFrame
      label="SECOND-PASS COMPRESSION"
      title="summary가 자체 예산을 넘을 때 fact 단위로 줄인다"
      description="로그인 수정 상태를 다시 자유 요약하지 않고 fact를 추출·정리·정렬한 뒤 완전한 단위로 budget에 맞춥니다."
      note="2차 압축은 추가 손실을 만듭니다. 예산 안의 summary에는 실행하지 않으며 authority·external effect·receipt 원본을 이 단계에서 변경하지 않습니다."
    >
      <CompactSteps
        steps={[
          {
            label: "EXTRACT",
            title: "fact 추출",
            body: "goal, pending, error, auth file, permission과 receipt를 분리합니다.",
            tone: "blue",
          },
          {
            label: "CLEAN",
            title: "정규화·중복 제거",
            body: "빈 값과 중복을 제거하고 path·call ID·digest를 정규화합니다.",
            tone: "violet",
          },
          {
            label: "RANK",
            title: "다음 행동 기준 정렬",
            body: "미완료 test와 실패 원인, 적용된 edit receipt를 먼저 둡니다.",
            tone: "amber",
          },
          {
            label: "FIT",
            title: "fact 단위로 채우기",
            body: "path나 error condition을 자르지 않고 완전한 fact부터 budget에 넣습니다.",
            tone: "emerald",
          },
        ]}
      />
      <CompactRule>
        <strong>성공 기준:</strong> 압축률보다 next action, 오류 원인, permission,
        edit/test receipt와 미완료 항목의 보존을 우선합니다.
      </CompactRule>
    </CompactFrame>
  );
}
