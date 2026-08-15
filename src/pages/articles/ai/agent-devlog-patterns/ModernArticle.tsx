import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { RecordRoutingViz } from "../devlog-learning-viz";

export default function ModernArticle() {
  return <article className="space-y-16">
    <section id="overview" className="scroll-mt-20 space-y-7">
      <LessonHeader number="01" eyebrow="출발점" title="기록부터 고르지 말고, 관찰 원문과 해석을 먼저 나눕니다">Support agent가 빈 compaction 결과로 기존 profile을 덮어쓴 한 사건을 따라갑니다. 먼저 무엇이 실제로 관찰됐는지 고정한 뒤에만 문서가 생깁니다.</LessonHeader>
      <ContentBoundary article="agent-devlog-patterns" />
      <TermLesson name="Raw evidence" oneLine="실행 당시의 입력·명령·log·before/after state·test 결과를 해석하지 않은 채 다시 검사할 수 있게 묶은 원문입니다." shape="run ID → input/config → output/log → before/after → verifier receipt" example="run-1842에 empty output, 기존 profile checksum, model·prompt version, failing test를 함께 둡니다." boundary="Evidence가 있다는 사실만으로 원인이 증명되지는 않으며 고객 원문·secret은 공개 문서에 복사하지 않습니다." />
      <TermLesson name="Claim" oneLine="Evidence를 근거로 사람이 말하는 원인·결과·완료 상태입니다. Claim의 강도는 원문이 실제로 지지하는 범위를 넘을 수 없습니다." shape="artifact link + 해석 + verification status" example="‘empty output이 overwrite path를 통과했다’는 재현 전후 비교가 있을 때만 씁니다." boundary="‘같은 시점에 보였다’를 ‘유일한 원인이다’로 확대하지 않습니다." />
    </section>
    <section id="question-owner" className="scroll-mt-20 space-y-7">
      <LessonHeader number="02" eyebrow="정본" title="질문 하나마다 답을 소유하는 문서 하나를 둡니다">같은 사건을 네 번 복사하는 대신 독자가 무엇을 묻는지 보고 진입점을 고릅니다.</LessonHeader>
      <TermLesson name="Question ownership" oneLine="‘무엇을 관찰했나·언제 바뀌었나·왜 골랐나·지금 무엇을 적용하나’라는 질문별로 artifact·Changelog·ADR·Lessons 중 정본 하나를 정하는 규칙입니다." shape="observation→artifact · when/what→Changelog · why→ADR · now→Lessons" example="Changelog는 ADR의 context를 다시 쓰지 않고 ADR-005 링크만 남깁니다." boundary="기존 release note·RFC·runbook이 같은 질문을 이미 소유하면 새 문서 이름을 만들지 않습니다." />
      <RecordRoutingViz />
    </section>
    <section id="promotion" className="scroll-mt-20 space-y-7">
      <LessonHeader number="03" eyebrow="조건부 조합" title="모든 작업을 모든 문서로 승격하지 않습니다">대부분의 작은 수정은 검증된 Changelog에서 끝납니다. 장기 선택과 재사용 규칙이 실제로 생겼을 때만 다음 정본을 만듭니다.</LessonHeader>
      <TermLesson name="Promotion threshold" oneLine="관찰은 artifact로, 검증된 notable change는 Changelog로, 장기 제약을 만드는 선택은 ADR로, scope·exception·test를 가진 현재 원칙은 Lessons로 올리는 조건입니다." shape="capture → verify → publish change → decision? → reusable rule?" example="Guard 수정만이면 Changelog에서 끝나고 storage layout 전환이 있을 때만 ADR-005가 생깁니다." boundary="문서가 중요해 보인다는 이유나 template checklist만으로 승격하지 않습니다." />
    </section>
    <section id="agent-review" className="scroll-mt-20 space-y-7">
      <LessonHeader number="04" eyebrow="자동화 경계" title="Agent는 초안을 만들지만 evidence와 공개 범위를 결정하지 않습니다">Diff·log·test에서 후보 문장을 만들 수 있어도, 원문에 없는 수치와 인과를 채우거나 접근 권한을 넘어선 내용을 공개해서는 안 됩니다.</LessonHeader>
      <TermLesson name="Agent-drafted evidence boundary" oneLine="초안의 모든 claim이 존재하는 citation과 verifier receipt로 돌아가고 permission·PII·secret redaction·owner review를 통과해야 publish되는 경계입니다." shape="draft → link existence → permission → redaction → verification → owner approval" example="삭제된 log를 근거로 ‘세 번 반복됐다’고 쓰지 않고 확인 가능한 세 artifact가 있을 때만 횟수를 말합니다." boundary="문장 생성 능력은 causal review나 공개 승인 권한을 대신하지 않습니다." />
      <div id="paper-w3c-prov" className="not-prose scroll-mt-24 border-l border-primary pl-4"><CitationBlock source="W3C PROV Overview" citeKey={1} type="paper" href="https://www.w3.org/TR/prov-overview/"><EvidenceGrid problem="결과가 어떤 entity·activity·agent에서 왔는지 추적하지 못하면 claim을 재검증하기 어렵습니다." contribution="Entity·activity·agent와 생성·사용·귀속 관계로 provenance를 표현하는 공통 모델을 제공합니다." assumptions="도메인별 artifact schema와 접근 통제는 별도로 설계해야 합니다." scope="관찰 원문과 해석을 stable relation으로 연결하는 provenance 원칙입니다." notClaim="W3C PROV만 적용하면 causal claim·보안·보존 정책이 자동 해결된다는 뜻은 아닙니다." /></CitationBlock></div>
    </section>
  </article>;
}
