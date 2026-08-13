import {
  CompactFrame,
  CompactRule,
  CompactSteps,
} from "./CompactionPrimitives";

export default function PhaseTransitionViz() {
  return (
    <CompactFrame
      label="KEEP / REDUCE / REFERENCE"
      title="다음 행동을 결정하는 사실은 남기고 원문 부피만 줄인다"
      description="로그인 실패 사례에서 목표·변경 파일·권한·edit/test 결과는 보존하고, 반복 search와 긴 stdout은 줄이되 원본 evidence identity는 유지합니다."
      note="원본 transcript와 exact patch·test log는 감사 저장소에 남길 수 있습니다. model context의 compacted state는 lossless archive가 아니며 durable evidence를 대신하지 않습니다."
    >
      <CompactSteps
        columns={2}
        steps={[
          {
            label: "BEFORE",
            title: "Raw login-debug history",
            body: "요청, 반복 search, permission, edit, 전체 stdout과 test result가 한 배열에 섞여 있습니다.",
            tone: "amber",
          },
          {
            label: "AFTER",
            title: "State + receipts + recent",
            body: "목표·auth file·failure condition·edit/test receipt는 남기고 최근 turn은 원문으로 유지합니다.",
            tone: "emerald",
          },
        ]}
      />
      <CompactRule>
        <strong>손실 허용:</strong> 반복 설명과 성공한 command의 전체 출력은 줄일
        수 있습니다. 권한 거부, unresolved failure, call/result identity와 아직
        하지 않은 검증은 “완료”로 바꾸거나 삭제하면 안 됩니다.
      </CompactRule>
    </CompactFrame>
  );
}
