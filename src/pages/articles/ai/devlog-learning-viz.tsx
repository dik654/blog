import { StoryShell, useStory } from "./kimi-k3-shared";

type Step = { short: string; title: string; detail: string; artifact: string };

function FlowStory({ title, subtitle, steps, outcome }: { title: string; subtitle: string; steps: readonly Step[]; outcome: string }) {
  const story = useStory(steps.length, 3000);
  return (
    <StoryShell title={title} subtitle={subtitle} labels={steps.map((item) => item.short)} {...story}>
      <div className="grid min-w-0 items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
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
            {index < steps.length - 1 && <div aria-hidden="true" className={`grid min-h-7 place-items-center text-lg transition-colors sm:min-h-0 ${index < story.step ? "text-emerald-600" : "text-muted-foreground/45"}`}><span className="rotate-90 sm:rotate-0">→</span></div>}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-2 border-t border-border pt-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
        <p className="text-xs font-black text-primary">현재 장면</p>
        <p className="break-words text-sm leading-6 text-foreground"><strong>{steps[story.step].title}</strong> — {steps[story.step].detail}</p>
        <p className="text-xs font-black text-primary">조합 결과</p>
        <p className="break-words text-sm leading-6 text-muted-foreground">{outcome}</p>
      </div>
    </StoryShell>
  );
}

export function RecordRoutingViz() {
  return <FlowStory title="하나의 사건이 질문에 따라 다른 정본으로 갈라지는 과정" subtitle="장면을 넘기면 raw observation에서 검증된 변화·결정·현재 규칙으로 필요한 만큼만 승격됩니다." steps={[
    { short: "Evidence", title: "관찰 원문", detail: "입력·log·before/after·test를 해석과 분리합니다.", artifact: "run-1842 · checksum · failing test" },
    { short: "Change", title: "검증된 변화", detail: "행동이 달라졌고 완료 조건을 통과했을 때만 공개합니다.", artifact: "Changelog · Fixed · verifier receipt" },
    { short: "Decision", title: "장기 선택", detail: "다른 선택을 제약하는 결정이 있으면 이유와 대가를 보존합니다.", artifact: "ADR-005 · options · consequences" },
    { short: "Rule", title: "재사용 규칙", detail: "다음 작업에도 적용할 scope·exception·test가 생겼을 때만 일반화합니다.", artifact: "Lesson · scope · counterexample" },
  ]} outcome="모든 사건이 네 문서를 만드는 것이 아닙니다. 작은 수정은 Evidence→Changelog에서 끝나고, 결정과 재사용 규칙은 조건을 만족할 때만 생깁니다." />;
}

export function ChangelogEvidenceViz() {
  return <FlowStory title="관찰 가능한 변화가 Changelog entry가 되는 네 관문" subtitle="Commit 수가 아니라 독자에게 중요한 변화인지, 검증됐는지, 공개 상태인지, 근거로 돌아갈 수 있는지를 순서대로 봅니다." steps={[
    { short: "Audience", title: "독자와 영향", detail: "사용자·운영자가 알아야 할 behavior·format·security 변화를 고릅니다.", artifact: "impact: empty overwrite blocked" },
    { short: "Verify", title: "완료 검증", detail: "empty·partial·full fixture와 기존 state 보존을 확인합니다.", artifact: "test-guard-empty-03 · PASS" },
    { short: "Publish", title: "공개 상태", detail: "미배포는 Unreleased, 반영 확인 뒤 dated release로 구분합니다.", artifact: "Unreleased → 2026-04-16" },
    { short: "Trace", title: "근거 연결", detail: "짧은 결과에서 run·commit·test·ADR로 되돌아가게 합니다.", artifact: "run-1842 ↔ c8f… ↔ ADR-005" },
  ]} outcome="Changelog는 debugging transcript가 아니라 ‘언제 무엇이 달라졌고 무엇으로 확인했는가’를 찾는 시간순 index가 됩니다." />;
}

export function DecisionRecordViz() {
  return <FlowStory title="결론보다 먼저 같은 선택 기준으로 대안을 비교합니다" subtitle="ADR은 인기 기술을 고르는 표가 아니라 당시의 제약·대안·선택·후속 비용을 다시 검토할 수 있게 하는 결정 영수증입니다." steps={[
    { short: "Context", title: "문제와 제약", detail: "복구 범위·동시성·migration·운영비를 먼저 고정합니다.", artifact: "blast radius · recovery · operations" },
    { short: "Options", title: "같은 driver 비교", detail: "JSON·분리 파일·DB를 동일 기준으로 비교합니다.", artifact: "A / B / C × same drivers" },
    { short: "Decision", title: "채택된 선택", detail: "B를 고른 이유와 적용 범위를 적되 구현 완료로 표시하지 않습니다.", artifact: "status: accepted ≠ deployed" },
    { short: "History", title: "결과와 대체", detail: "비용·재검토 조건을 남기고 바뀌면 새 ADR이 supersede합니다.", artifact: "ADR-006 supersedes ADR-005" },
  ]} outcome="코드는 현재 선택을 보여 주지만 ADR은 그 선택이 합리적이던 조건과 언제 다시 봐야 하는지를 보존합니다." />;
}

export function LessonsLedgerViz() {
  return <FlowStory title="사건이 현재 행동 규칙으로 승격되는 과정" subtitle="사건 요약을 복사하지 않고 적용 범위·정상 예외·검증법을 붙여 다음 작업에서 실행 가능한 규칙으로 만듭니다." steps={[
    { short: "Observe", title: "근거 사건", detail: "실패와 수정 결과를 stable artifact로 모읍니다.", artifact: "run-1842 · postmortem-021" },
    { short: "Narrow", title: "좁은 규칙", detail: "강한 한 사건이면 provisional로 시작하고 범위를 넓히지 않습니다.", artifact: "state replace path only" },
    { short: "Test", title: "예외와 검증", detail: "명시적 삭제는 정상 예외로 두고 fixture로 구별합니다.", artifact: "empty / partial / delete fixtures" },
    { short: "Maintain", title: "현재 정본", detail: "반례·새 storage가 생기면 복사본 대신 같은 규칙을 갱신합니다.", artifact: "owner · revisit · superseded rule" },
  ]} outcome="Postmortem은 사건의 timeline·impact·action을, Lessons는 여러 상황에서 지금 적용할 rule과 test만 소유합니다." />;
}
