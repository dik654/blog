import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { GreenContractViz, PolicyEvaluationViz } from "./viz/ModernPolicyViz";

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-lg leading-8 text-foreground/90">{children}</p>;
}

export default function ModernPolicyArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">Policy engine을 판정 자료부터</p><h2 className="text-3xl font-bold tracking-tight">Policy engine은 현재 lane을 rule에 대입해 action 후보를 만드는 결정 함수다</h2></header>
        <Lead>
          Policy engine은 “안전하게 알아서 처리하는 AI”가 아니라, 구조화된 <strong>LaneContext</strong>를 여러 rule의 condition에 대입하고 일치한 action을 반환하는 코드입니다. 정확성을 판단하려면 입력 snapshot, condition의 논리, priority 순서, action 충돌 처리, 결과를 실제 실행하는 enforcer를 나눠 봐야 합니다.
        </Lead>
        <p>
          고정 예시는 로그인 401 수정 작업인 <code>lane-17</code>입니다. Green level은 2, scoped diff와 review approved, base branch fresh, retry count는 0이고 green contract도 충족했다고 하겠습니다. Priority 10의 retry rule, 20의 merge rule, 20의 notify rule을 넣었을 때 어떤 action이 어떤 순서로 나오는지 끝까지 추적합니다.
        </p>
        <PolicyEvaluationViz />
        <ContentBoundary article="claw-policy-engine" />
      </section>

      <section id="rules" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Rule evaluation</p><h2 className="mt-2 text-2xl font-bold">Pinned condition은 true·false이고 matching action을 모두 반환한다</h2></header>
        <p>
          <code>PolicyRule</code>은 name, condition, action, priority를 가집니다. Engine은 priority가 작은 rule부터 stable하게 정렬한 뒤 각 condition을 boolean으로 평가합니다. And·Or·Not, green level, stale branch, blocker, review, scoped diff, retry, approval token 같은 조건이 있지만 <strong>Unknown</strong>이라는 세 번째 값은 없습니다. 필요한 field가 없을 때 fail-closed인지, false로 취급되는지는 각 condition 코드를 확인해야 합니다.
        </p>
        <p>
          Match한 rule의 action은 모두 결과에 들어가며 <code>Chain</code>은 안쪽 action을 평평하게 펼칩니다. Priority는 실행 순서를 정할 뿐 허용·거부의 우선순위를 자동 중재하지 않습니다. 같은 context에서 MergeToDev와 Block이 모두 match하면 현재 evaluator만으로 둘 중 하나가 사라지지 않습니다. 충돌 matrix와 최종 enforcer가 별도로 필요합니다.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[740px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Priority</th><th className="p-3">lane-17 condition</th><th className="p-3">결과</th><th className="p-3">주의할 점</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3">10</td><td className="p-3">retry_count &lt; retry_limit</td><td className="p-3">Retry</td><td className="p-3">뒤 Merge를 자동 취소하지 않음</td></tr><tr><td className="p-3">20</td><td className="p-3">green ∧ scoped ∧ reviewed</td><td className="p-3">MergeToDev</td><td className="p-3">green provenance는 별도 flag에 의존</td></tr><tr><td className="p-3">20</td><td className="p-3">항상 true</td><td className="p-3">Notify</td><td className="p-3">같은 priority에서는 입력 순서가 유지됨</td></tr></tbody></table></div>
        <div id="paper-claw-policy-source"><CitationBlock type="code" source="Claw Code · pinned policy_engine.rs" citeKey={1} href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/policy_engine.rs">
          <p><strong>문제:</strong> Lane context가 어떤 condition·priority·action 규칙으로 decision event가 되는지 확인해야 합니다.</p>
          <p><strong>기여:</strong> Boolean condition, stable priority order, matching action 수집, Chain expansion과 event projection의 pinned 구현을 제공합니다.</p>
          <p><strong>전제와 근거 범위:</strong> commit b71afdd…의 source와 test에 한정합니다. Conflict arbitration, durable snapshot, 실제 side-effect enforcement가 완성됐다는 뜻은 아닙니다.</p>
        </CitationBlock></div>
      </section>

      <section id="lane-context" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · LaneContext</p><h2 className="mt-2 text-2xl font-bold">구조체에 값이 있다는 사실과 provenance가 검증됐다는 사실은 다르다</h2></header>
        <p>
          LaneContext에는 lane ID, green level, green contract 충족 여부, branch age, blocker, review, diff scope, completion·reconciliation, retry와 approval token 같은 값이 들어갑니다. Evaluator가 같은 값을 받으면 같은 action을 내는 것은 가능하지만, 이 구조체 자체가 immutable event snapshot이거나 각 field에 source artifact·revision·timestamp가 붙어 있다는 뜻은 아닙니다.
        </p>
        <p>
          예를 들어 <code>green_contract_satisfied=true</code>만 전달되면 누가 어느 commit에서 어떤 test command를 실행했는지 evaluator는 알 수 없습니다. Review approved도 현재 diff revision과 결속되지 않으면 review 뒤 변경된 code를 merge할 수 있습니다. Context를 만들 때 repository SHA, policy generation, evidence digest와 각 producer identity를 묶고, action executor가 같은 snapshot을 소비하는지 확인해야 합니다.
        </p>
        <div className="grid gap-4 md:grid-cols-3"><div className="rounded-lg border border-border bg-card p-4"><h3 className="text-sm font-semibold">State</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">green level, retry count처럼 판정에 직접 쓰는 현재 값</p></div><div className="rounded-lg border border-border bg-card p-4"><h3 className="text-sm font-semibold">Provenance</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">어느 commit·runner·command·review가 값을 만들었는지 보여 주는 근거</p></div><div className="rounded-lg border border-border bg-card p-4"><h3 className="text-sm font-semibold">Generation</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">판정과 실행 사이 reload·새 diff로 stale decision이 되지 않게 묶는 identity</p></div></div>
      </section>

      <section id="green-contract" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Green contract</p><h2 className="mt-2 text-2xl font-bold">Test가 통과했다는 말에 level·command·base·recovery·flake 근거를 붙인다</h2></header>
        <p>
          별도 <code>green_contract.rs</code>는 TargetedTests, Package, Workspace, MergeReady level과 evidence를 정의합니다. Merge-ready contract는 요구 level뿐 아니라 exit 0인 비어 있지 않은 test command, fresh base branch, recovery attempt context를 요구하고 blocking known flake가 없어야 만족합니다. Test command string과 exit code가 있다는 사실은 유용하지만 runner identity·artifact digest·commit SHA까지 포함한 완전한 provenance는 아닙니다.
        </p>
        <GreenContractViz />
        <ExplainedFormula
          question="lane-17이 merge-ready green contract를 만족하려면 어떤 조건이 모두 참이어야 하는가?"
          idea={<>Green은 점수를 평균내는 방식이 아니라 conjunction입니다. 관측 level이 충분하고 test·base·recovery 근거가 있으며 blocking flake가 없어야 합니다. 앞 네 값이 1이어도 blocking flake가 1이면 전체는 0입니다.</>}
          formula={String.raw`\begin{aligned}G&=Q\land P\land F\\&\quad\land C\land\neg B\\Q=P=F=C&=1\\B=1&\Rightarrow G=0\end{aligned}`}
          terms={[
            { symbol: "Q", name: "Level 충족", description: "관측한 test level이 contract가 요구한 최소 level 이상인지를 나타냅니다." },
            { symbol: "P", name: "Test command provenance", description: "비어 있지 않은 command 가운데 exit code 0인 항목이 있음을 뜻합니다." },
            { symbol: "F", name: "Base freshness", description: "검증한 branch가 요구한 base를 기준으로 fresh하다는 boolean입니다." },
            { symbol: "C", name: "Recovery context", description: "복구 시도 맥락이 기록됐다는 조건입니다." },
            { symbol: "B", name: "Blocking flake", description: "Green을 막도록 표시된 known flake가 존재하는지 나타냅니다." },
          ]}
          assumptions={["각 boolean을 만드는 producer와 revision이 신뢰할 수 있게 고정되어 있습니다.", "GreenLevel enum의 순서가 실제 test coverage의 포함 관계와 일치합니다.", "식은 pinned evaluate_evidence의 논리를 설명하며 전체 release 안전성을 대표하지 않습니다."]}
          interpretation="Blocking flake를 제거하면 마지막 항이 1이 되어 다른 조건이 모두 참일 때 G=1이 됩니다. 하지만 G=1만으로 review freshness나 permission·deployment readiness까지 증명되지는 않습니다."
        />
        <div id="paper-claw-green-contract"><CitationBlock type="code" source="Claw Code · pinned green_contract.rs" citeKey={2} href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/green_contract.rs">
          <p><strong>문제:</strong> 단일 green 숫자보다 merge 전 필요한 test·branch·recovery evidence를 명시해야 합니다.</p>
          <p><strong>기여:</strong> Ordered GreenLevel, merge-ready requirements, passing command와 blocking flake를 평가하는 구현을 제공합니다.</p>
          <p><strong>전제와 근거 범위:</strong> Pinned field와 boolean evaluation의 근거입니다. Command가 올바른 commit에서 격리 실행됐거나 flake 분류가 항상 정확하다는 뜻은 아닙니다.</p>
        </CitationBlock></div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · 역검사와 배포</p><h2 className="mt-2 text-2xl font-bold">Rule unit test와 실제 action enforcement를 같은 fixture로 연결한다</h2></header>
        <p>
          기초 여섯 문제는 rule 구성, boolean condition, stable priority, Chain expansion, lane context와 provenance, green conjunction 계산을 묻습니다. 심화 네 문제는 Merge·Block 충돌, stale review·policy generation, blocking flake 조작, evaluator-to-executor binding을 다룹니다. 위 lane-17의 값과 표·수식만으로 답할 수 있어야 합니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Release gate:</strong> Lane input·repository SHA·policy generation·rule order·green evidence를 고정하고 missing field, stable tie, Chain, Merge+Block 충돌, stale base, changed diff after review, forged exit 0, blocking flake, approval expiry를 주입합니다. Base/candidate의 matching rules·ordered actions·decision events와 실제 executor effect를 비교하고 conflict가 미해결이거나 stale snapshot으로 effect가 실행되면 배포하지 않습니다.</aside>
      </section>
    </article>
  );
}
