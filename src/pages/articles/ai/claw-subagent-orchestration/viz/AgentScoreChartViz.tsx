import {
  OrchestrationFrame,
  OrchestrationRule,
  OrchestrationSteps,
} from "./OrchestrationVizPrimitives";

export default function AgentScoreChartViz() {
  return (
    <OrchestrationFrame
      label="TWO-STAGE DECISION"
      title="안전 조건과 선호 점수를 한 숫자로 섞지 않는다"
      description="먼저 hard constraint를 통과시킨 뒤 검증된 품질과 운영 비용을 비교합니다."
      note="최근 success rate는 작업 난이도와 표본 수를 함께 보며, 자기 보고가 아닌 verifier 결과로 계산합니다."
    >
      <OrchestrationSteps
        columns={3}
        items={[
          {
            label: "REQUIRED",
            title: "Permission fit",
            body: "필요 이상의 write·network·secret 권한은 탈락합니다.",
            tone: "rose",
          },
          {
            label: "QUALITY",
            title: "Verified outcomes",
            body: "동일 유형의 artifact 통과율과 오류를 봅니다.",
            tone: "emerald",
          },
          {
            label: "OPERATIONS",
            title: "Latency · cost",
            body: "대기 시간, 모델 비용과 통합 부담을 비교합니다.",
            tone: "blue",
          },
        ]}
      />
      <OrchestrationRule>
        hard constraint를 만족하지 못한 후보는 높은 품질 점수로 권한 위험을
        상쇄할 수 없습니다.
      </OrchestrationRule>
    </OrchestrationFrame>
  );
}
