import { JournalCards, JournalFrame, LinkRule } from "./JournalPrimitives";

export default function ThreeLayersViz() {
  return (
    <JournalFrame
      label="WRITE ONCE, FOLLOW LINKS"
      title="작업 결과에서 결정과 원칙으로 필요한 만큼만 올라간다"
      description="작은 작업은 Changelog에서 끝나며, 장기 결정과 반복 원칙이 있을 때만 다음 문서가 생깁니다."
      note="도입 초기에는 과거 기록을 모두 옮기지 않습니다. 현재 작업부터 시작하고 실제로 다시 필요한 지식만 승격합니다."
    >
      <JournalCards
        cards={[
          {
            label: "EVERY USEFUL CHANGE",
            title: "Changelog에 기록",
            body: "Guard의 검증된 결과와 run·commit·test를 연결합니다. 대부분의 작업은 여기서 끝납니다.",
            example: "always after verification",
          },
          {
            label: "IF DECISION MATTERS",
            title: "ADR로 연결",
            body: "Single JSON에서 profile별 파일로 전환한 장기 선택처럼 배경을 보존할 때만 연결합니다.",
            example: "conditional · ADR-005",
          },
          {
            label: "IF LESSON REPEATS",
            title: "Lessons를 갱신",
            body: "다른 destructive update에도 같은 판단이 필요할 때 현재 원칙과 검증법을 갱신합니다.",
            example: "conditional · one canonical lesson",
          },
        ]}
      />
      <LinkRule>
        <strong>조회 경로:</strong> 언제는 Changelog, 왜는 ADR, 지금의 기준은
        Lessons에서 시작합니다.
      </LinkRule>
    </JournalFrame>
  );
}
