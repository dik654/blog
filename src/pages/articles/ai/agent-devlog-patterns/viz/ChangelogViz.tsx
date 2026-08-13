import { JournalCards, JournalFrame, LinkRule } from "./JournalPrimitives";

export default function ChangelogViz() {
  return (
    <JournalFrame
      label="TIME INDEX"
      title="최근 변경에서 상세 근거로 이동하는 구조"
      description="Changelog는 짧은 결과와 링크만 소유하므로 파일을 열었을 때 현재 상태를 빠르게 훑을 수 있습니다."
      note="단일 파일, 최신순, 월별 archive는 가능한 구현 중 하나입니다. 실제 release와 조회 패턴에 맞는 구조를 선택합니다."
    >
      <JournalCards
        cards={[
          {
            label: "RESULT",
            title: "변경 결과",
            body: "빈 compaction 결과가 기존 profile을 덮어쓰지 못하도록 guard를 추가했습니다.",
            example: "2026-04-16 · behavior changed",
          },
          {
            label: "EVIDENCE",
            title: "코드·issue",
            body: "실패 run, 수정 commit, 회귀 test로 독자가 결과를 다시 확인하게 합니다.",
            example: "run-1842 · c8f… · test-guard-empty-03",
          },
          {
            label: "CONTEXT",
            title: "ADR·Lessons",
            body: "저장 구조의 결정 이유나 재사용 원칙이 필요할 때만 다음 문서로 이동합니다.",
            example: "ADR-005 · destructive-derived-update.md",
          },
        ]}
      />
      <LinkRule>
        <strong>길이 경계:</strong> 항목이 보고서처럼 길어지면 내용을 지우는
        것이 아니라, 상세 맥락의 소유 문서로 옮기고 링크를 남깁니다.
      </LinkRule>
    </JournalFrame>
  );
}
