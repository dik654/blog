import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { HookLifecycleViz, HookProtocolViz } from "./viz/ModernHooksViz";

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-lg leading-8 text-foreground/90">{children}</p>;
}

export default function ModernHooksArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Claw Code를 실행 경계부터</p>
          <h2 className="text-3xl font-bold tracking-tight">Hook은 알림 callback이 아니라 tool 실행에 개입하는 subprocess다</h2>
        </header>
        <Lead>
          Hook은 정해진 event가 생겼을 때 외부 command를 실행하는 확장 지점입니다. Claw의 pinned 구현에서는 <strong>PreToolUse</strong>, <strong>PostToolUse</strong>, <strong>PostToolUseFailure</strong> 세 event만 확인됩니다. 특히 pre-hook은 이유를 덧붙이는 데 그치지 않고 tool 입력을 바꾸거나 allow·ask·deny 결정을 반환할 수 있으므로, 단순 로깅 기능으로 보면 권한 경계를 놓치게 됩니다.
        </Lead>
        <p>
          이 글은 로그인 401을 고치는 작업을 끝까지 같은 예시로 사용합니다. Agent가 <code>Bash</code> tool로 <code>git push origin main</code>을 요청했고 기본 permission 결과는 Ask라고 하겠습니다. 첫 hook은 변경 티켓이 있는지 확인해 Ask와 이유를 반환하고, 두 번째 hook은 main branch 직접 push를 막아 Deny를 반환합니다. 이때 무엇이 subprocess로 전달되고, 어느 결과가 최종 판정이 되며, 취소 뒤 무엇을 더 검증해야 하는지를 순서대로 살펴봅니다.
        </p>
        <HookLifecycleViz />
        <ContentBoundary article="claw-hooks" />
      </section>

      <section id="event-protocol" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Event와 protocol</p><h2 className="mt-2 text-2xl font-bold">Matcher를 통과한 command가 JSON을 받아 순서대로 실행된다</h2></header>
        <p>
          각 hook command에는 선택적인 matcher가 있으며, 현재 tool name과 맞는 command만 실행됩니다. Matching command는 병렬이 아니라 등록 순서대로 실행되므로 앞 hook의 지연이 뒤 hook과 tool 실행을 그대로 늦춥니다. Unix 계열에서는 pinned runner가 command 문자열을 <code>sh -lc</code>로 넘깁니다. 따라서 executable과 argv가 분리된 호출이 아니며 quote, expansion, redirection 같은 shell 의미가 개입합니다.
        </p>
        <p>
          표준 입력에는 event·tool name·input·오류 여부를 담은 JSON payload가 들어갑니다. 부모 environment를 그대로 물려받고 <code>HOOK_EVENT</code>, <code>HOOK_TOOL_NAME</code>, <code>HOOK_TOOL_INPUT</code> 같은 변수를 추가합니다. 이는 최소 secret allowlist나 격리된 sandbox가 확인됐다는 뜻이 아닙니다. Hook command를 신뢰 경계 밖에서 가져온다면 inherited credential과 작업 디렉터리부터 별도로 제한해야 합니다.
        </p>
        <HookProtocolViz />
        <ExplainedFormula
          question="Matching hook 세 개를 순차 실행하면 tool이 시작되기 전 최소 지연은 얼마인가?"
          idea={<>순차 실행에서는 각 hook의 시간이 겹치지 않으므로 더합니다. 40 ms, 70 ms, 25 ms가 걸렸다면 hook 자체 지연만 135 ms이며 process spawn과 scheduler 지연은 여기에 더해집니다.</>}
          formula={String.raw`\begin{aligned}T_{pre}&=\sum_{i=1}^{m}t_i\\&=40+70+25=135\ \mathrm{ms}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}T_{pre}&=\underbrace{\sum_{i=1}^{m}t_i}_{\text{Pre-hook 지연 계산}}\\&=\underbrace{40+70+25=135\ \mathrm{ms}}_{\text{오른쪽 항으로 결과 계산}}\end{aligned}`}
          operations={[
            { expression: String.raw`\sum_{i=1}^{m}t_i`, annotation: ["Pre-hook 지연이(가) 식의 결과에 기여하는 방식을","계산합니다.","순차 실행에서는 각 hook의 시간이 겹치지 않으므로","더합니다."] },
            { expression: String.raw`40+70+25=135\ \mathrm{ms}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","순차 실행에서는 각 hook의 시간이 겹치지 않으므로","더합니다."] },
          ]}
          terms={[
            { symbol: "m", name: "Matching hook 수", description: "현재 event와 tool matcher를 통과해 실제로 실행되는 command 개수입니다." },
            { symbol: "t_i", name: "개별 hook 시간", description: "i번째 subprocess가 시작해 결과를 반환할 때까지 걸린 시간입니다." },
            { symbol: "T_{pre}", name: "Pre-hook 지연", description: "Tool executor에 도달하기 전에 hook 순서 때문에 추가되는 시간입니다." },
          ]}
          assumptions={["Hook이 실제 pinned 경로처럼 순차 실행됩니다.", "첫 Deny·Failed·Cancelled가 나오지 않아 m개가 모두 실행됩니다.", "Process spawn·queueing·후속 permission 평가 시간은 합계 밖에 둡니다."]}
          interpretation="Hook을 하나 더 붙일 때마다 worst-case latency budget도 늘어납니다. 안전 검사를 빼라는 뜻이 아니라 각 hook에 관찰 가능한 deadline과 실패 정책을 정해야 한다는 뜻입니다."
        />
        <div id="paper-claw-hooks-source">
          <CitationBlock type="code" source="Claw Code · pinned runtime hooks.rs" citeKey={1} href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/hooks.rs">
            <p><strong>문제:</strong> Tool 전후 외부 command를 어떤 event·입출력·종료 규칙으로 실행하는지 확인해야 합니다.</p>
            <p><strong>기여:</strong> 세 HookEvent, matcher, 순차 runner, shell 호출, JSON stdin·environment, stdout parser와 exit status를 고정한 구현을 제공합니다.</p>
            <p><strong>전제와 근거 범위:</strong> commit b71afdd…의 독립 공개 재구현 artifact에 한정합니다. Production isolation·timeout·descendant cleanup·모든 caller의 revalidation을 증명하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="result-composition" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · 결과 합성</p><h2 className="mt-2 text-2xl font-bold">“가장 엄격한 판정이 이긴다”가 아니라 덮어쓰기와 조기 중단을 구분한다</h2></header>
        <p>
          Exit 0의 stdout이 비어 있으면 기본 결과로 계속 진행합니다. JSON object라면 <code>decision: "block"</code>, <code>continue: false</code>, <code>permissionDecision</code>, <code>permissionDecisionReason</code>, <code>updatedInput</code> 등을 읽습니다. 일반 text는 message로 보존하며, JSON처럼 보이지만 parsing에 실패한 출력은 diagnostic으로 다뤄집니다. “형식이 틀리면 자동 deny”라는 fail-closed 규칙은 이 source에서 확인되지 않습니다.
        </p>
        <p>
          여러 결과를 합칠 때 message와 diagnostic은 모으지만 permission override·이유·updated input은 뒤의 값이 앞의 값을 덮습니다. 다만 어느 hook이 Deny·Failed·Cancelled를 반환하면 즉시 멈추므로 그 뒤 hook은 실행되지 않습니다. 따라서 <strong>Deny &gt; Ask &gt; Allow</strong>라는 격자 병합도, 모든 hook을 실행한 뒤 가장 제한적인 값을 택하는 방식도 아닙니다.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[720px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">순서</th><th className="p-3">반환</th><th className="p-3">실제 합성</th><th className="p-3">로그인 예시 결과</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3">1</td><td className="p-3">Ask + 티켓 필요</td><td className="p-3">override·reason 저장</td><td className="p-3">아직 다음 hook 실행</td></tr><tr><td className="p-3">2</td><td className="p-3">Deny + main push 금지</td><td className="p-3">값을 갱신하고 즉시 중단</td><td className="p-3">Bash executor 호출 안 함</td></tr><tr><td className="p-3">3</td><td className="p-3">Allow 예정</td><td className="p-3">도달하지 않음</td><td className="p-3">판정에 영향 없음</td></tr></tbody></table></div>
        <p>
          <code>updatedInput</code>은 tool argument를 바꿀 수 있으므로 원래 입력에 내린 permission 결정을 그대로 재사용하면 안 됩니다. 새 command·path·URL을 canonicalize하고 tool schema와 permission policy를 다시 적용한 뒤 executor로 넘기는 것이 필요한 hardening입니다. Pinned hook parser가 값을 만들었다는 사실만으로 모든 caller가 이 재검사를 수행한다고 확대해서는 안 됩니다.
        </p>
      </section>

      <section id="cancellation" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 취소와 격리</p><h2 className="mt-2 text-2xl font-bold">Child를 kill하고 wait해도 process tree와 외부 effect가 사라졌다고 단정할 수 없다</h2></header>
        <p>
          Runner는 abort signal을 주기적으로 확인하고 취소되면 direct child에 kill을 요청한 뒤 wait합니다. 이것은 zombie child를 줄이는 중요한 절차지만, shell이 이미 만든 descendant가 같은 process group으로 묶였는지, file·network effect가 완료됐는지, stdout 일부가 남았는지는 별도 문제입니다. 특히 <code>sh -lc</code> 안에서 background process를 시작하면 direct child 종료와 전체 job 종료가 같지 않을 수 있습니다.
        </p>
        <ul className="space-y-3 text-sm leading-6">
          <li><strong>Deadline:</strong> Hook마다 최대 실행 시간과 timeout outcome을 정하고, 무제한 stdout·stderr도 함께 제한합니다.</li>
          <li><strong>Process identity:</strong> Unix process group 또는 platform별 job object로 descendant 범위를 묶고 TERM→KILL→wait 결과를 receipt로 남깁니다.</li>
          <li><strong>Environment:</strong> 필요한 변수만 허용하고 credential·socket·workspace mount를 최소화합니다.</li>
          <li><strong>Effect reconciliation:</strong> 취소 시점에 외부 변경이 있었는지 조회하고 retry가 같은 effect를 반복하지 않게 operation identity를 사용합니다.</li>
        </ul>
        <div id="paper-openai-guardrails">
          <CitationBlock source="OpenAI Agents · Guardrails and approvals" citeKey={2} href="https://developers.openai.com/api/docs/guides/agents/guardrails-approvals">
            <p><strong>문제:</strong> Model이 제안한 tool call의 입력·출력과 side effect를 runtime에서 통제해야 합니다.</p>
            <p><strong>기여:</strong> Tool guardrail과 실행 전 human approval을 model 응답과 분리된 host control로 설명합니다.</p>
            <p><strong>전제와 근거 범위:</strong> 일반적인 control boundary의 근거입니다. Claw hook이 OpenAI Agents SDK와 같거나 pinned 구현의 isolation을 인증한다는 주장은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · 역검사와 배포</p><h2 className="mt-2 text-2xl font-bold">정상 출력보다 충돌·형식 오류·취소를 먼저 고정한다</h2></header>
        <p>
          이 글만으로 기초 여섯 문제를 풀 수 있어야 합니다. 세 event와 실행 순서, matcher, JSON stdin과 environment, exit 0·2·기타 결과, 순차 지연 135 ms, Ask→Deny→미실행 예시를 각각 설명할 수 있어야 합니다. 심화 네 문제는 updatedInput 재승인, malformed JSON 정책, descendant cancellation, base/candidate release gate를 설계하는 문제입니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Release gate:</strong> 같은 hook 목록·tool input·environment와 full commit SHA에서 base/candidate를 실행합니다. No match, plain text, valid JSON, malformed JSON, exit 2, later override, updatedInput, timeout·cancel, descendant linger를 주입하고 executor 호출 수 0/1, 최종 decision·reason·input, process cleanup, stdout/stderr digest를 비교합니다. Unauthorized executor call이 하나라도 있거나 terminal receipt가 모호하면 배포하지 않습니다.
        </aside>
      </section>
    </article>
  );
}
