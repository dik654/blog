import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { ChangelogEvidenceViz } from "../devlog-learning-viz";

export default function ModernArticle() {
  return <article className="space-y-16">
    <section id="overview" className="scroll-mt-20 space-y-7">
      <LessonHeader number="01" eyebrow="정의" title="Changelog는 작업일지가 아니라 검증된 변화의 시간순 index입니다">먼저 entry 하나가 소유하는 모양부터 고정합니다.</LessonHeader>
      <ContentBoundary article="agent-changelog-evidence" />
      <TermLesson name="Curated Changelog entry" oneLine="특정 날짜·version에 독자가 알아야 할 변화의 결과, 영향, verification, stable evidence link를 짧게 묶은 항목입니다." shape="date/version → result → impact → verification → evidence links" example="2026-04-16 · empty overwrite 차단 · empty/partial/full tests · run-1842" boundary="Commit dump·debugging transcript·아직 검증되지 않은 완료 주장을 섞지 않습니다." />
    </section>
    <section id="notability" className="scroll-mt-20 space-y-7">
      <LessonHeader number="02" eyebrow="선택" title="누가 읽고 무엇이 달라졌는지를 먼저 묻습니다">글자 수가 아니라 audience와 observable impact가 notable 여부를 정합니다.</LessonHeader>
      <TermLesson name="Notability–audience boundary" oneLine="사용자·운영자·다음 개발자 중 누가 이 변화를 알아야 하는지와 behavior·format·policy·security 영향이 있는지를 함께 판정하는 경계입니다." shape="audience × observable impact → include / omit" example="Formatting만 바꾼 commit은 빼고 profile overwrite behavior가 달라진 guard는 Fixed에 넣습니다." boundary="내부 entry가 공개 release note보다 작을 수 있지만 모든 command를 notable로 만들지는 않습니다." />
    </section>
    <section id="publication" className="scroll-mt-20 space-y-7">
      <LessonHeader number="03" eyebrow="상태" title="검증과 배포를 서로 다른 상태로 보존합니다">코드가 merge됐다는 사실과 독자가 실제로 사용할 수 있다는 사실은 같지 않습니다.</LessonHeader>
      <TermLesson name="Verification–publication state" oneLine="구현·검증·merge·배포 상태를 구분하고, 아직 반영되지 않은 변화는 Unreleased나 pending으로 표시하는 lifecycle입니다." shape="draft → verified → merged → deployed/published" example="회귀 test를 통과했지만 운영 반영 전이면 dated release가 아니라 Unreleased에 둡니다." boundary="검증 성공이 곧 모든 환경의 배포 완료나 장기 안정성을 보장하지 않습니다." />
      <ChangelogEvidenceViz />
    </section>
    <section id="links" className="scroll-mt-20 space-y-7">
      <LessonHeader number="04" eyebrow="추적" title="짧게 쓰되 상세 근거로 돌아갈 길을 끊지 않습니다">Changelog가 길어지면 근거를 지우는 대신 소유 문서로 옮기고 stable link를 남깁니다.</LessonHeader>
      <TermLesson name="Stable evidence link" oneLine="Entry의 결과를 고정 run·commit·test·ADR 식별자로 연결해 파일 위치가 달라져도 같은 근거를 찾게 하는 참조입니다." shape="entry → run ID / commit / verifier receipt / ADR" example="run-1842 ↔ c8f… ↔ test-guard-empty-03 ↔ ADR-005" boundary="고객 원문과 secret은 공개 entry에 복사하지 않고 접근 통제된 artifact와 redacted summary를 사용합니다." />
      <div id="paper-keep-a-changelog" className="not-prose scroll-mt-24 border-l border-primary pl-4"><CitationBlock source="Keep a Changelog 1.1.0" citeKey={1} type="paper" href="https://keepachangelog.com/en/1.1.0/"><EvidenceGrid problem="Raw commit log만으로는 release마다 사람이 알아야 할 변화를 찾기 어렵습니다." contribution="사람이 읽는 curated chronological list, Unreleased 영역, 일관된 category와 linkable section을 제안합니다." assumptions="Release 또는 version이 있는 software가 중심이며 audience와 notable 기준은 project가 정합니다." scope="Commit dump와 Changelog를 나누는 목적·구조·유지 convention입니다." notClaim="이 글의 내부 entry 형식이나 모든 commit 기록을 의무화하는 표준은 아닙니다." /></CitationBlock></div>
    </section>
  </article>;
}
