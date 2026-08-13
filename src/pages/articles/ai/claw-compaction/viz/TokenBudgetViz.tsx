import {
  CompactFrame,
  CompactRule,
  CompactSteps,
} from "./CompactionPrimitives";

export default function TokenBudgetViz() {
  return (
    <CompactFrame
      label="TOKEN BUDGET"
      title="입력 한도 전체를 대화에 쓰지 않는다"
      description="system prompt, tool schema, 최근 대화뿐 아니라 다음 응답과 안전 여유까지 같은 context window를 나눠 씁니다."
      note="정확한 비율은 모델 context, 평균 출력 길이와 tool schema를 실측해 정합니다. 중요한 permission·effect fact는 token 예산을 이유로 사실과 다르게 축약하지 않습니다."
    >
      <CompactSteps
        steps={[
          {
            label: "FIXED",
            title: "system·tools",
            body: "매 호출에 반복되는 고정 비용",
            tone: "violet",
          },
          {
            label: "STATE",
            title: "prior summary",
            body: "오래된 대화를 대신하는 압축 상태",
            tone: "blue",
          },
          {
            label: "RECENT",
            title: "최근 원문",
            body: "현재 작업의 세부 문맥",
            tone: "emerald",
          },
          {
            label: "RESERVE",
            title: "출력·안전 여유",
            body: "응답과 추정 오차를 위한 공간",
            tone: "amber",
          },
        ]}
      />
      <CompactRule>
        <strong>시작 조건:</strong> 현재 입력만 맞는지가 아니라 예상 출력까지
        넣을 수 있는지를 봅니다.
      </CompactRule>
    </CompactFrame>
  );
}
