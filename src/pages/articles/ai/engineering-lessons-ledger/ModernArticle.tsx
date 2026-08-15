import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { LessonsLedgerViz } from "../devlog-learning-viz";

export default function ModernArticle() {
  return <article className="space-y-16">
    <section id="overview" className="scroll-mt-20 space-y-7">
      <LessonHeader number="01" eyebrow="정의" title="Lesson은 사건 요약이 아니라 지금 실행할 행동 규칙입니다">한 번 읽고 끝나는 회고 대신 다음 작업에서 판단과 test에 사용할 정본을 만듭니다.</LessonHeader>
      <ContentBoundary article="engineering-lessons-ledger" />
      <TermLesson name="Reusable Lesson" oneLine="현재 rule·적용 scope·정상 exception·evidence·verification·revisit condition을 한 정본에 유지하는 실행 가능한 지식입니다." shape="rule → scope/exception → evidence → test → revisit" example="기존 non-empty state를 derived empty output으로 자동 replace하지 않는다고 적습니다." boundary="‘Compaction은 위험하다’처럼 범위와 검증이 없는 구호는 Lesson이 아닙니다." />
    </section>
    <section id="scope-test" className="scroll-mt-20 space-y-7">
      <LessonHeader number="02" eyebrow="형태" title="Scope·exception·test를 한 묶음으로 봅니다">규칙은 어디에 적용하고 언제 적용하지 않는지까지 말해야 실제로 사용할 수 있습니다.</LessonHeader>
      <TermLesson name="Scope–exception–test triad" oneLine="규칙의 적용 경로, 정상적으로 깨도 되는 예외, 둘을 구별하는 검증 fixture를 함께 소유하는 형태입니다." shape="scope ∩ condition − explicit exception → expected test outcome" example="Profile compaction에는 적용하지만 명시적 삭제 intent는 예외이며 empty와 delete fixture를 따로 둡니다." boundary="length &gt; 0 같은 문법 검사만으로 domain의 정상 삭제와 실패를 구별할 수 없습니다." />
      <LessonsLedgerViz />
    </section>
    <section id="provisional" className="scroll-mt-20 space-y-7">
      <LessonHeader number="03" eyebrow="증거" title="강한 한 사건은 좁은 provisional lesson으로 시작합니다">반복 횟수만 세지 않고 severity와 일반화 범위를 함께 봅니다.</LessonHeader>
      <TermLesson name="Provisional lesson threshold" oneLine="반복 evidence가 부족해도 data loss·security처럼 예방 가치가 크면 적용 범위를 좁히고 provisional status·반례·revisit 조건을 붙여 시작하는 기준입니다." shape="severity × evidence strength → narrow provisional / accepted / reject" example="한 번의 profile 손실 뒤 모든 AI output을 금지하지 않고 destructive replace path에만 guard를 둡니다." boundary="한 사건의 우연한 조건을 전 system의 보편 법칙으로 확대하지 않습니다." />
    </section>
    <section id="postmortem" className="scroll-mt-20 space-y-7">
      <LessonHeader number="04" eyebrow="분리" title="Postmortem은 사건을, Lessons는 현재 규칙을 소유합니다">둘을 합치면 timeline도 잃고 재사용 가능한 rule도 흐려집니다.</LessonHeader>
      <TermLesson name="Postmortem–Lesson boundary" oneLine="Postmortem은 impact·timeline·detection·mitigation·contributing factors·owner가 있는 action을, Lessons는 여러 상황에서 재사용할 현재 rule과 test만 소유하는 분리입니다." shape="incident record → evidence links → reusable rule, not copy" example="Postmortem-021의 고객 영향과 복구 시각은 그대로 두고 Lesson에는 empty replace guard만 연결합니다." boundary="Blameless는 책임을 없애는 말이 아니라 개인 비난 대신 system condition과 검증 가능한 action을 찾는 원칙입니다." />
      <div id="paper-google-sre-postmortem" className="not-prose scroll-mt-24 border-l border-primary pl-4"><CitationBlock source="Google SRE — Postmortem Culture" citeKey={1} type="paper" href="https://sre.google/workbook/postmortem-culture/"><EvidenceGrid problem="Incident를 복구하고도 원인과 preventive action을 학습하지 않으면 비슷한 failure가 반복됩니다." contribution="Blameless analysis, complete incident data, measurable preventive action·owner·review로 system learning을 연결합니다." assumptions="대규모 production service 사례이며 팀별 trigger와 review process가 필요합니다." scope="Incident evidence와 action을 보존하고 반복 pattern을 운영 지식으로 바꾸는 원리입니다." notClaim="이 글의 Lesson 문서가 Google Postmortem과 같은 artifact이거나 accountability를 없앤다는 뜻은 아닙니다." /></CitationBlock></div>
    </section>
  </article>;
}
