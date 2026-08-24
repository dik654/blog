import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { PluginExecutionViz, PluginRegistryViz } from "./viz/ModernPluginViz";

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-lg leading-8 text-foreground/90">{children}</p>;
}

export default function ModernPluginArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">Plugin을 package부터 실행까지</p><h2 className="text-3xl font-bold tracking-tight">Plugin은 기능 묶음이면서 host 권한으로 process를 시작하는 공급망 경계다</h2></header>
        <Lead>
          Claw plugin은 manifest에 metadata, hook, lifecycle command, tool과 command를 적어 host 기능을 확장합니다. “설치했다”는 한 상태만으로는 부족합니다. 어떤 source에서 어떤 version을 가져왔는지, manifest가 유효한지, registry에서 enabled인지, initialize가 끝났는지, tool 실행이 어떤 권한과 process 환경을 쓰는지를 따로 봐야 합니다.
        </Lead>
        <p>
          고정 예시는 외부 plugin <code>acme/auth-lint@1.2.0</code>입니다. 이 plugin은 로그인 401 수정 뒤 <code>auth_lint</code> tool을 실행하며 <code>workspace-write</code> 권한을 선언하고, init·shutdown command와 PreToolUse hook 하나를 포함합니다. 설치부터 tool result까지 같은 identity가 유지되는지 따라가겠습니다.
        </p>
        <PluginRegistryViz />
        <ContentBoundary article="claw-plugin" />
      </section>

      <section id="manifest-registry" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Manifest와 registry</p><h2 className="mt-2 text-2xl font-bold">Builtin·bundled·external은 출처가 다르지만 enabled tool name은 함께 충돌 검사한다</h2></header>
        <p>
          Pinned 구현은 Builtin, Bundled, External 세 종류를 구분합니다. External manifest는 <code>.claude-plugin/plugin.json</code>에서 name·version·description·permissions·defaultEnabled·hooks·lifecycle·tools·commands를 읽습니다. 필수 문자열, 중복 permission·entry, tool input schema, command path를 검증하지만 package signature나 publisher 신뢰까지 확인한다는 뜻은 아닙니다.
        </p>
        <p>
          Registry는 plugin ID로 정렬하고 enabled plugin의 hook과 tool만 모읍니다. Tool은 plugin별 namespace를 붙이지 않고 definition name으로 합치므로 두 enabled plugin이 <code>auth_lint</code>를 정의하면 aggregation이 오류로 끝납니다. 조용한 last-wins가 아니라 충돌을 드러내는 점은 좋지만, duplicate plugin ID와 설치 source 우선순위가 모든 경로에서 하나의 generation으로 고정되는지는 별도 확인이 필요합니다.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[740px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">단계</th><th className="p-3">auth-lint 예시</th><th className="p-3">통과했다는 뜻</th><th className="p-3">아직 보장하지 않는 것</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3">Discover</td><td className="p-3">External path 발견</td><td className="p-3">후보 root가 있음</td><td className="p-3">신뢰된 publisher</td></tr><tr><td className="p-3">Validate</td><td className="p-3">schema·path 유효</td><td className="p-3">manifest 형식 통과</td><td className="p-3">command의 실제 effect</td></tr><tr><td className="p-3">Enable</td><td className="p-3">settings true</td><td className="p-3">aggregation 대상</td><td className="p-3">init 성공·ready</td></tr><tr><td className="p-3">Register</td><td className="p-3">auth_lint unique</td><td className="p-3">model 목록에 합류 가능</td><td className="p-3">권한 enforcement·격리</td></tr></tbody></table></div>
        <div id="paper-claw-plugin-source"><CitationBlock type="code" source="Claw Code · pinned plugins crate" citeKey={1} href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/plugins/src/lib.rs">
          <p><strong>문제:</strong> Plugin 종류·manifest·설치 registry·tool execution·lifecycle의 실제 구현 범위를 확인해야 합니다.</p>
          <p><strong>기여:</strong> PluginKind, manifest validation, enabled aggregation, tool name collision, process 실행과 init/shutdown 순서를 한 pinned source로 제공합니다.</p>
          <p><strong>전제와 근거 범위:</strong> commit b71afdd…의 source와 test에 한정합니다. Package signature, sandbox, permission enforcement, atomic install·rollback을 인증하지 않습니다.</p>
        </CitationBlock></div>
      </section>

      <section id="tool-execution" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Tool execution</p><h2 className="mt-2 text-2xl font-bold">requiredPermission은 선언이고, 실제 차단은 executor 앞 enforcement가 맡아야 한다</h2></header>
        <p>
          Tool manifest는 <code>read-only</code>, <code>workspace-write</code>, <code>danger-full-access</code> 중 하나를 요구합니다. 값을 생략하면 pinned parser의 default는 가장 강한 <code>danger-full-access</code>입니다. 그러나 <code>PluginTool.execute</code> 자체는 이 label을 검사하는 permission enforcer를 호출하지 않고 command와 args로 process를 시작합니다. 따라서 label이 있다는 사실과 unauthorized execution이 불가능하다는 주장을 분리해야 합니다.
        </p>
        <PluginExecutionViz />
        <p>
          Input JSON은 stdin으로 쓰고 <code>CLAWD_PLUGIN_ID</code>, <code>CLAWD_PLUGIN_NAME</code>, <code>CLAWD_TOOL_NAME</code>, <code>CLAWD_TOOL_INPUT</code> environment를 추가합니다. Plugin root가 있으면 current directory와 <code>CLAWD_PLUGIN_ROOT</code>도 설정합니다. 부모 environment는 기본적으로 상속되고 stdout·stderr를 모아 process 종료까지 기다리며, 이 함수에서는 timeout·output limit·process group·sandbox가 보이지 않습니다.
        </p>
        <p>
          Auth-lint가 workspace-write를 선언했다면 host는 canonical input, plugin ID·version·tool schema digest, policy generation과 approval을 묶어 실행 직전에 다시 검사해야 합니다. Plugin command가 다른 executable을 시작하거나 symlink target을 바꾸는 경우까지 label 하나가 의미를 설명하지 못하므로 실제 effect receipt도 필요합니다.
        </p>
      </section>

      <section id="lifecycle" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Lifecycle과 degraded</p><h2 className="mt-2 text-2xl font-bold">Initialize는 정방향, shutdown은 역방향이지만 rollback transaction은 아니다</h2></header>
        <p>
          Registry initialize는 enabled plugin을 정렬된 순서대로 validate하고 init command를 실행합니다. Shutdown은 반대 순서로 실행합니다. Dependency를 쌓은 역순으로 내리는 기본 원칙에는 맞지만, 세 번째 plugin init이 실패했을 때 앞의 두 plugin을 자동으로 rollback했다는 근거는 별도로 확인해야 합니다. Lifecycle command도 shell process와 외부 effect를 만들 수 있기 때문입니다.
        </p>
        <ExplainedFormula
          question="세 plugin 가운데 두 개만 ready라면 registry 가용 비율은 얼마인가?"
          idea={<>Expected plugin 세 개 중 tool을 안전하게 제공할 수 있는 ready plugin이 두 개라면 2/3입니다. 이 값은 degraded 정도를 보여 주는 진단일 뿐, 남은 두 plugin의 기능이 충분하다는 안전 보장은 아닙니다.</>}
          formula={String.raw`A_{plugin}=\frac{N_{ready}}{N_{expected}}=\frac{2}{3}\approx 0.667`}
          annotatedFormula={String.raw`A_{plugin}=\underbrace{\frac{N_{ready}}{N_{expected}}=\frac{2}{3}\approx 0.667}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\frac{N_{ready}}{N_{expected}}=\frac{2}{3}\approx 0.667`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Expected plugin 세 개 중 tool을 안전하게","제공할 수 있는 ready plugin이 두 개라면","2/3입니다."] },
          ]}
          terms={[
            { symbol: "N_{ready}", name: "Ready plugin 수", description: "Validation과 initialize를 통과하고 현재 generation에서 tool을 제공할 수 있는 plugin 수입니다." },
            { symbol: "N_{expected}", name: "Expected plugin 수", description: "고정한 배포 manifest에서 활성화되어야 하는 전체 plugin 수입니다." },
            { symbol: "A_{plugin}", name: "Plugin availability ratio", description: "현재 registry가 기대한 plugin 집합을 얼마나 제공하는지 나타내는 진단 비율입니다." },
          ]}
          assumptions={["Expected 집합과 version이 deployment manifest에 고정되어 있습니다.", "Ready는 단순 enabled가 아니라 validation·init·health를 통과한 상태입니다.", "Plugin별 중요도와 기능 대체 가능성은 이 단순 비율에 반영하지 않습니다."]}
          interpretation="0.667만 보고 서비스를 열면 필수 auth-lint가 빠진 상태를 놓칠 수 있습니다. 필수 capability별 readiness와 degraded 허용 정책을 함께 기록해야 합니다."
        />
        <p>
          별도 lifecycle module의 healthcheck·degraded type도 active registry와 실제로 연결되는지 확인해야 합니다. “타입이 있다”와 “모든 plugin call 전에 health generation을 검사한다”는 다른 주장입니다. Reload할 때는 model이 본 old schema와 새 executor가 섞이지 않도록 old generation을 drain하거나 stale call을 거부해야 합니다.
        </p>
        <div id="paper-slsa"><CitationBlock source="SLSA · Supply-chain levels and provenance" citeKey={2} href="https://slsa.dev/spec/v1.2/levels">
          <p><strong>문제:</strong> 외부 package가 어디서 어떤 build를 거쳐 나왔는지와 변조 위험을 줄여야 합니다.</p>
          <p><strong>기여:</strong> Build provenance와 공급망 보증 수준을 점진적으로 높이는 공통 vocabulary를 제공합니다.</p>
          <p><strong>전제와 근거 범위:</strong> 일반 supply-chain 설계 근거입니다. Claw external plugin이 SLSA 수준을 충족하거나 manifest validation이 provenance 검증을 대신한다는 뜻은 아닙니다.</p>
        </CitationBlock></div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · 역검사와 배포</p><h2 className="mt-2 text-2xl font-bold">Package·registry·process·lifecycle을 같은 identity로 묶어 검증한다</h2></header>
        <p>
          기초 여섯 문제는 세 PluginKind, manifest path와 핵심 field, enabled aggregation, duplicate tool name, permission default, stdin·environment·exit result를 묻습니다. 심화 네 문제는 공급망 provenance, missing enforcer, partial init rollback, reload generation을 다룹니다. 위 auth-lint 예시와 2/3 계산만으로 답할 수 있어야 합니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Release gate:</strong> Plugin archive digest·publisher/provenance·manifest·host full SHA를 고정하고 malformed schema, missing path, duplicate tool, omitted permission, init 2/3 실패, shutdown 실패, timeout, oversized output, child descendant, reload 중 stale call을 주입합니다. Base/candidate의 registry generation·실행 승인·process identity·effect receipt·cleanup을 비교하며 권한 label만 있고 enforcement receipt가 없으면 배포하지 않습니다.</aside>
      </section>
    </article>
  );
}
