import { JournalCards, JournalFrame, LinkRule } from "./JournalPrimitives";

export default function OverviewViz() {
  return (
    <JournalFrame
      label="THREE ENTRY POINTS"
      title="하나의 사건을 세 번 쓰지 않고, 질문별 진입점을 만든다"
      description="시간, 결정, 원칙은 서로 다른 문서가 소유하며 상세 내용은 상대 링크로 연결합니다."
      note="이 구조는 개인 프로젝트 사례입니다. 팀에 이미 release note, RFC, runbook이 있다면 같은 질문을 담당하는 기존 문서에 역할을 매핑하면 됩니다."
    >
      <JournalCards
        cards={[
          {
            label: "WHEN / WHAT",
            title: "Changelog",
            body: "검증된 guard가 언제 반영됐고 어떤 behavior가 달라졌는지 찾습니다.",
            example: "2026-04-16 · empty overwrite 차단 · test-guard-empty-03",
          },
          {
            label: "WHY",
            title: "ADR",
            body: "single JSON을 유지하지 않고 profile별 파일로 나눈 이유와 비용을 보존합니다.",
            example: "ADR-005 · options → decision → consequences",
          },
          {
            label: "NEXT TIME",
            title: "Lessons",
            body: "다른 destructive update에도 적용할 현재 원칙과 검증법을 소유합니다.",
            example: "empty derived state ≠ overwrite permission",
          },
        ]}
      />
      <LinkRule>
        <strong>중복 방지:</strong> 각 문서는 자기 질문의 답만 쓰고, 나머지는 한
        문장 요약과 링크로 연결합니다.
      </LinkRule>
    </JournalFrame>
  );
}
