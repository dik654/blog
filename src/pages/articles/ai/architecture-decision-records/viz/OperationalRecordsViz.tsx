import { StoryShell } from "../../kimi-k3-shared";
import { useStory } from "../../useKimiStory";

type Step = { short: string; title: string; detail: string; artifact: string };

function FlowStory({ title, subtitle, steps, outcome }: { title: string; subtitle: string; steps: readonly Step[]; outcome: string }) {
  const story = useStory(steps.length, 3000);
  return (
    <StoryShell title={title} subtitle={subtitle} labels={steps.map((item) => item.short)} {...story}>
      <div className="grid min-w-0 items-stretch gap-2 grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))]">
        {steps.map((item, index) => (
          <div key={item.short} className="contents">
            <article className={`min-w-0 border p-4 transition-all duration-500 ${index === story.step ? "border-primary bg-primary/10" : index < story.step ? "border-emerald-500/50 bg-emerald-500/5" : "border-border bg-muted/10 opacity-55"}`}>
              <div className="flex items-center gap-3">
                <span className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-black ${index <= story.step ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>{index + 1}</span>
                <p className="break-words text-sm font-black">{item.title}</p>
              </div>
              <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">{item.detail}</p>
              <p className="mt-3 border-t border-border pt-2 font-mono text-[11px] leading-5 text-foreground/80 [overflow-wrap:anywhere]">{item.artifact}</p>
            </article>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-2 border-t border-border pt-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
        <p className="text-xs font-black text-primary">현재 장면</p>
        <p className="min-h-[5.25rem] break-words text-sm leading-6 text-foreground"><strong>{steps[story.step].title}</strong> — {steps[story.step].detail}</p>
        <p className="text-xs font-black text-primary">조합 결과</p>
        <p className="break-words text-sm leading-6 text-muted-foreground">{outcome}</p>
      </div>
    </StoryShell>
  );
}

export function ChangelogEvidenceViz() {
  return <FlowStory title="관찰 가능한 변화가 Changelog entry가 되는 네 관문" subtitle="12개 기록을 보존하는 수정에서 검사와 공개 상태를 같은 실행에 연결합니다. (가정)" steps={[
    { short: "Audience", title: "독자와 영향", detail: "빈 결과가 기존 12개 기록을 지우지 않도록 수정합니다.", artifact: "existing=12 → preserved=12" },
    { short: "Verify", title: "완료 검증", detail: "0·5·12개 결과와 명시적 삭제의 4가지 검사를 확인합니다.", artifact: "run-1842 · 4/4 PASS" },
    { short: "Publish", title: "공개 상태", detail: "미배포는 Unreleased, 반영 확인 뒤 dated release로 구분합니다.", artifact: "Unreleased → 2026-04-16" },
    { short: "Trace", title: "근거 연결", detail: "짧은 결과에서 run·commit·test·ADR로 되돌아가게 합니다.", artifact: "run-1842 ↔ 고정 revision ↔ 검사 4개" },
  ]} outcome="변경 항목에서 실제 영향·검사·공개 버전과 근거를 함께 찾습니다." />;
}

export function DecisionRecordViz() {
  return <FlowStory title="결론보다 먼저 같은 선택 기준으로 대안을 비교합니다" subtitle="200개 프로필 중 A만 복구하려는 조건에서 세 대안을 비교합니다. (가정)" steps={[
    { short: "Context", title: "문제와 제약", detail: "A만 복구할 요구, 프로필 200개와 작업자 1개를 기록합니다.", artifact: "profiles=200 · affected=1 · writers=1" },
    { short: "Options", title: "같은 driver 비교", detail: "파일 1개·파일 200개·DB를 복구·쓰기·운영 기준으로 비교합니다.", artifact: "A / B / C × same drivers" },
    { short: "Decision", title: "채택된 선택", detail: "B를 고른 이유와 적용 범위를 적되 구현 완료로 표시하지 않습니다.", artifact: "status: accepted ≠ deployed" },
    { short: "History", title: "결과와 대체", detail: "작업자가 4개로 늘면 다시 비교하고 대체 이유를 남깁니다.", artifact: "ADR-006 supersedes ADR-005" },
  ]} outcome="코드는 현재 선택을 보여 주지만 ADR은 그 선택이 합리적이던 조건과 언제 다시 봐야 하는지를 보존합니다." />;
}

export function LessonsLedgerViz() {
  return <FlowStory title="사건이 현재 행동 규칙으로 승격되는 과정" subtitle="사건 요약을 복사하지 않고 적용 범위·정상 예외·검증법을 붙여 다음 작업에서 실행 가능한 규칙으로 만듭니다." steps={[
    { short: "Observe", title: "근거 사건", detail: "12개가 0개가 된 경로와 복구 결과를 보존합니다.", artifact: "run-1842 · postmortem-021" },
    { short: "Narrow", title: "좁은 규칙", detail: "강한 한 사건이면 provisional로 시작하고 범위를 넓히지 않습니다.", artifact: "state replace path only" },
    { short: "Test", title: "예외와 검증", detail: "실패 0·부분 5·전체 12·허용 삭제 0을 구분합니다.", artifact: "0 / 5 / 12 / 0 → 서로 다른 기대 상태" },
    { short: "Maintain", title: "현재 정본", detail: "반례·새 storage가 생기면 복사본 대신 같은 규칙을 갱신합니다.", artifact: "owner · revisit · superseded rule" },
  ]} outcome="사건의 과거 사실과 현재 적용할 규칙을 링크로 연결합니다." />;
}
