import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { DecisionRecordViz } from "../devlog-learning-viz";

export default function ModernArticle() {
  return <article className="space-y-16">
    <section id="overview" className="scroll-mt-20 space-y-7">
      <LessonHeader number="01" eyebrow="정의" title="ADR은 선택 당시의 맥락과 대가를 보존하는 결정 영수증입니다">코드가 보여 주지 못하는 ‘왜’를 한 significant decision 단위로 남깁니다.</LessonHeader>
      <ContentBoundary article="architecture-decision-records" />
      <TermLesson name="Architecture Decision Record" oneLine="이후 선택을 제약하는 decision 하나의 title·status·context·options·decision·consequences를 보존하는 작은 문서입니다." shape="context → options → decision → consequences" example="ADR-005는 profile state를 single JSON이 아니라 profile별 파일에 두기로 한 선택을 소유합니다." boundary="작은 bug fix·진행률·매일의 작업 상태는 ADR로 만들지 않습니다." />
    </section>
    <section id="drivers" className="scroll-mt-20 space-y-7">
      <LessonHeader number="02" eyebrow="비교" title="대안보다 먼저 decision driver를 고정합니다">대안마다 다른 잣대를 대면 미래에 결론을 재검토할 수 없습니다.</LessonHeader>
      <TermLesson name="Decision-driver comparability" oneLine="복구 범위·동시성·migration·운영 비용처럼 선택을 좌우하는 기준을 먼저 정하고 모든 option을 같은 축에서 비교하는 계약입니다." shape="drivers D₁…Dₙ × options A/B/C → comparable trade-offs" example="single JSON·profile별 파일·DB를 모두 blast radius와 migration cost로 비교합니다." boundary="근거 없는 숫자 점수나 ‘요즘 유행’ 같은 option별 다른 기준을 만들지 않습니다." />
      <DecisionRecordViz />
    </section>
    <section id="status" className="scroll-mt-20 space-y-7">
      <LessonHeader number="03" eyebrow="상태" title="accepted와 implemented를 분리합니다">결정 채택, 구현, migration, rollout, 검증은 각자 다른 evidence를 가집니다.</LessonHeader>
      <TermLesson name="Decision–implementation separation" oneLine="ADR status는 결정의 lifecycle만 나타내고 구현 task·배포·rollback readiness는 별도 실행 artifact로 추적하는 경계입니다." shape="proposed → accepted | implementation task → deployed → verified" example="ADR-005가 accepted여도 migration test와 production rollout이 끝나기 전에는 implemented라고 쓰지 않습니다." boundary="Stakeholder 합의가 자동으로 코드·data migration·운영 검증을 완료하지 않습니다." />
    </section>
    <section id="supersession" className="scroll-mt-20 space-y-7">
      <LessonHeader number="04" eyebrow="역사" title="결정이 바뀌어도 원문을 고쳐 쓰지 않습니다">과거 code를 이해하려면 그 당시 유효했던 context가 남아 있어야 합니다.</LessonHeader>
      <TermLesson name="ADR supersession chain" oneLine="기존 ADR을 superseded로 표시하고 새 ADR이 대체 이유와 변경된 context를 link하여 과거와 현재 결정을 모두 찾게 하는 history입니다." shape="ADR-004 ←superseded by— ADR-005 ← ADR-006" example="동시 write가 급증해 DB로 옮기면 ADR-005를 삭제하지 않고 ADR-006이 supersede합니다." boundary="번호를 재사용하거나 accepted 원문을 현재 결론에 맞게 덮어쓰지 않습니다." />
      <div id="paper-nygard-adr" className="not-prose scroll-mt-24 border-l border-primary pl-4"><CitationBlock source="Michael Nygard — Documenting Architecture Decisions" citeKey={1} type="paper" href="https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions"><EvidenceGrid problem="중요한 architecture decision의 동기와 trade-off는 code만 남으면 사라집니다." contribution="Title·status·context·decision·consequences를 가진 작고 독립적인 ADR과 superseding history를 제안합니다." assumptions="한 ADR은 한 project의 significant decision을 다루고 significance는 팀이 판단합니다." scope="ADR의 목적, 기본 template, 상태와 history 보존 이유입니다." notClaim="Options section이나 profile별 파일 선택이 모든 project의 표준이라는 뜻은 아닙니다." /></CitationBlock></div>
    </section>
  </article>;
}
