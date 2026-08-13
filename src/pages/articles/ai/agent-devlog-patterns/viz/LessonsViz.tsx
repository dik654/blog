import { JournalCards, JournalFrame, LinkRule } from "./JournalPrimitives";

export default function LessonsViz() {
  return (
    <JournalFrame
      label="REUSABLE KNOWLEDGE"
      title="사건을 복제하지 않고 현재 원칙으로 압축한다"
      description="반복된 경험에서 적용 조건과 검증법을 뽑고, 구체적인 사건과 결정은 근거 링크로 남깁니다."
      note="한 번의 사건도 보안처럼 예방 가치가 분명하면 교훈이 될 수 있습니다. 다만 적용 범위와 근거를 함께 써야 과잉 일반화를 피할 수 있습니다."
    >
      <JournalCards
        cards={[
          {
            label: "OBSERVE",
            title: "사건 축적",
            body: "빈 결과가 overwrite로 이어진 run과 비슷한 destructive update 사건을 모읍니다.",
            example: "run-1842 · related incidents",
          },
          {
            label: "GENERALIZE",
            title: "원칙과 범위",
            body: "기존 state가 있고 파생 결과가 비어 있으면 자동 replace하지 않는다고 명시합니다.",
            example: "guard before replace · scope: compaction/migration",
          },
          {
            label: "VERIFY",
            title: "검증 방법",
            body: "빈 결과, 일부 결과, 정상 전체 결과를 나눠 회귀 test로 확인합니다.",
            example: "empty · partial · full fixtures",
          },
        ]}
      />
      <LinkRule>
        <strong>단일 소유권:</strong> 같은 주제의 새 사건은 새 Lessons 파일을
        만드는 대신 기존 원칙을 갱신하고 근거 링크를 추가합니다.
      </LinkRule>
    </JournalFrame>
  );
}
