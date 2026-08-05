import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import ToolRuntimeContractLab from './claw-tool-system/viz/ToolRuntimeContractLab';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

const origins = [
  {
    name: 'built-in',
    definition: 'Rust의 mvp_tool_specs()',
    permission: 'ToolSpec.required_permission, bash·PowerShell은 command별 동적 분류',
    executor: 'execute_tool_with_enforcer()의 이름별 match',
  },
  {
    name: 'plugin',
    definition: 'plugin manifest의 tool definition',
    permission: 'plugin required_permission을 runtime PermissionMode로 변환',
    executor: 'PluginTool::execute()',
  },
  {
    name: 'runtime',
    definition: 'MCP 등 runtime discovery 결과',
    permission: 'RuntimeToolDefinition.required_permission',
    executor: '상위 runtime이 연결한 protocol executor',
  },
] as const;

export default function ClawToolSystemArticle() {
  return (
    <>
      <QuestionLead
        question="모델에게 tool schema가 보이면 그 tool은 반드시 안전하게 실행될까?"
        answer={<>아니다. schema 노출, permission 판정, executor dispatch, effect observation은 서로 다른 경계다. 하나라도 빠지면 모델은 보이지만 실행할 수 없는 도구를 고르거나, 실행 결과를 확인하지 않고 다음 상태로 넘어갈 수 있다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'definition surface', meaning: 'name, description, input schema로 된 model-facing capability 목록.', why: '모델이 어떤 action을 어떤 JSON으로 제안할 수 있는지 제한한다.' },
          { term: 'allowlist', meaning: '이번 request에 실제로 노출할 definition의 부분집합.', why: '모든 tool을 항상 보여 주지 않고 작업에 필요한 surface만 연다.' },
          { term: 'permission requirement', meaning: '호출이 요구하는 최소 실행 권한.', why: 'schema가 유효해도 현재 session 권한이 부족하면 effect를 막는다.' },
          { term: 'observation', meaning: 'executor가 돌려준 성공·오류·receipt를 다음 turn context에 기록한 것.', why: '모델의 추측이 아니라 실제 환경 결과로 loop를 닫는다.' },
        ]}
      />
      <Misconception>
        <code>GlobalToolRegistry::definitions()</code>에 들어간 것과
        <code>GlobalToolRegistry::execute()</code>가 직접 실행할 수 있는 것은 같은 집합이 아니다.
        특히 runtime-discovered tool은 higher-level runtime의 별도 executor 배선이 필요하다.
      </Misconception>

      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>하나의 tool call은 네 개의 독립 계약을 통과한다</h2>
          <p>
            ReAct에서 environment action은 외부 상태를 바꾼다. production runtime에서는 action 문자열 하나로
            끝낼 수 없다. 먼저 model request에 definition을 싣고, JSON input을 검증하고, 권한을 판정하고,
            올바른 executor가 effect를 수행한 뒤, 반환값을 observation으로 기록해야 한다.
          </p>
          <p>
            아래 lab에서 같은 tool이라도 allowlist와 active mode를 바꿔 보자. “보이지 않음”,
            “사용자 결정 대기”, “권한 부족”, “실행 후 관찰”은 전혀 다른 상태다.
          </p>
        </div>
        <ToolRuntimeContractLab />
      </section>

      <section id="registry-projections" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Registry는 세 출처를 합치지만 결과를 두 번 투영한다</h2>
          <p>
            Claw의 definition은 built-in, plugin, runtime discovery 세 출처에서 온다. 등록 시 이름 충돌을
            거부한다. 같은 이름이 두 실행 경로를 가리키면 model은 어느 schema와 effect를 믿어야 할지
            결정할 수 없기 때문이다.
          </p>
        </div>
        <div className="not-prose my-6 border-y border-border">
          <div className="hidden grid-cols-[7rem_10rem_minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b border-border bg-muted/30 px-3 py-2 text-xs font-bold lg:grid">
            <div>출처</div>
            <div>definition</div>
            <div>permission</div>
            <div>executor owner</div>
          </div>
          <div className="divide-y divide-border">
            {origins.map((origin) => (
              <div
                key={origin.name}
                className="grid min-w-0 gap-4 py-4 text-sm lg:grid-cols-[7rem_10rem_minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:px-3"
              >
                <strong className="text-base lg:text-sm">{origin.name}</strong>
                <div className="min-w-0">
                  <span className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground lg:hidden">definition</span>
                  <span className="block break-words leading-6 text-muted-foreground [overflow-wrap:anywhere]">{origin.definition}</span>
                </div>
                <div className="min-w-0">
                  <span className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground lg:hidden">permission</span>
                  <span className="block break-words leading-6 text-muted-foreground [overflow-wrap:anywhere]">{origin.permission}</span>
                </div>
                <div className="min-w-0">
                  <span className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground lg:hidden">executor owner</span>
                  <span className="block break-words leading-6 text-muted-foreground [overflow-wrap:anywhere]">{origin.executor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>definitions()</code>는 model-facing schema를 만들고, <code>permission_specs()</code>는
            같은 allowed set을 name과 required mode 쌍으로 만든다. 둘을 따로 만든 이유는 API payload와
            authorization policy가 다른 소비자를 갖기 때문이다. 그러나 allowed set을 서로 다르게 넘기면
            보이는 tool과 권한을 검사하는 tool이 달라질 수 있으므로 caller가 같은 집합을 공유해야 한다.
          </p>
          <h3>allowlist normalization은 편의 기능이면서 보안 경계다</h3>
          <p>
            <code>read</code>, <code>write</code>, <code>edit</code>, <code>glob</code>,
            <code>grep</code> alias를 canonical name으로 바꾸고, 쉼표·공백으로 나뉜 입력을 하나의 set으로
            만든다. 알 수 없는 이름은 조용히 버리지 않고 오류를 낸다. typo가 “allow all”로 확대되는 것을
            막는 fail-closed 동작이다.
          </p>
        </div>
      </section>

      <section id="dispatch" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Definition이 아니라 executor return이 외부 효과의 증거다</h2>
          <p>
            built-in 호출은 이름별 <code>match</code>에서 typed input으로 역직렬화된 뒤 구현 함수로 간다.
            알 수 없는 이름은 <code>unsupported tool</code> 오류를 반환한다. 모델이 tool 이름을 환각했다고
            executor가 임의의 비슷한 함수를 실행하지 않는다.
          </p>
          <p>
            plugin은 <code>PluginTool::execute</code>가 맡고, runtime-discovered tool은 MCP 같은
            higher-level executor가 맡는다. 여기서 중요한 source boundary가 하나 있다.
            <code>GlobalToolRegistry::execute</code> 자체는 built-in과 plugin branch를 처리하지만 runtime
            definition을 직접 dispatch하지 않는다. 따라서 runtime definition을 request에 싣는 caller는
            protocol executor도 함께 배선해야 한다.
            그 구체적인 discovery, qualified name, manager dispatch는
            {' '}<InternalLink slug="claw-mcp" learningPathId="ai-claw-infra">Claw MCP 런타임</InternalLink>에서
            이어서 검산한다.
          </p>
          <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
            {[
              ['proposal', 'model이 name과 JSON input을 제안'],
              ['validation', 'schema·typed parser가 input을 확인'],
              ['effect', 'origin에 맞는 executor가 외부 작업 수행'],
              ['observation', 'return·error·receipt를 session에 기록'],
            ].map(([label, description], index) => (
              <div key={label} className="bg-background p-4">
                <span className="text-xs font-bold text-muted-foreground">0{index + 1}</span>
                <strong className="mt-2 block text-sm">{label}</strong>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
          <h3>timeout은 실패가 아니라 결과를 모르는 상태일 수 있다</h3>
          <p>
            network나 remote tool에서 timeout이 나도 effect가 이미 commit됐을 수 있다. 같은 요청을 즉시
            다시 보내면 중복 생성·중복 결제가 생긴다. action에는 correlation·idempotency key가 필요하고,
            timeout 뒤에는 receipt 또는 실제 환경 상태를 먼저 조회해야 한다. 이 요구는 tool schema만으로
            해결되지 않는다. 이것은 현재 Claw 구현의 보장이 아니라 production hardening 요구이며,
            <InternalLink slug="llm-harness">Durable Harness</InternalLink>가 소유한다.
          </p>
        </div>
      </section>

      <section id="permission-boundary" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Permission은 tool 이름만이 아니라 invocation 내용까지 봐야 한다</h2>
          <p>
            일반 tool은 registry의 required mode를 읽을 수 있다. 반면 <code>bash</code>와
            <code>PowerShell</code>은 같은 tool 이름 안에서도 명령 내용이 다르므로 command classifier가
            invocation별 required mode를 다시 정한다. 읽기 명령과 삭제 명령을 같은 권한으로 다루면
            least privilege가 무너진다.
          </p>
          <p>
            production turn은 <code>ConversationRuntime</code>에서
            <code>PermissionPolicy::authorize_with_context</code>를 호출한다. plain requirement는 mode
            순서 비교로 먼저 허용될 수 있으므로 active mode가 <code>Prompt</code>라는 이유만으로 매번
            질문하지 않는다. ask rule이나 hook의 Ask가 있을 때 prompter가 개입한다. 한편 registry의
            <code>PermissionEnforcer</code>는 Prompt mode를 Allowed로 돌려 상위 흐름과 책임이 다르다.
            실제 interactive authorization의 전체 우선순위는
            <InternalLink slug="claw-permissions">Permission 구현</InternalLink>에서 이어서 읽는다.
          </p>
          <div className="not-prose my-6 border-l-2 border-amber-600 bg-amber-500/[0.04] px-4 py-3 text-sm leading-6">
            <strong>검토 포인트:</strong> definition projection, permission projection, concrete executor가
            같은 canonical tool name과 같은 allowed set을 사용하는지 통합 테스트로 묶어야 한다.
          </div>
        </div>
      </section>

      <section id="observation-closure" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>도구 결과는 session에 들어가야 다음 판단의 observation이 된다</h2>
          <p>
            ConversationRuntime은 assistant response의 tool use를 실행하고 반환 결과를 tool result content로
            기록한다. 성공 문자열뿐 아니라 validation 오류와 permission denial도 observation이다. 모델은
            이 결과를 보고 input을 고치거나, 권한 변경을 요청하거나, 다른 행동을 선택한다.
          </p>
          <p>
            따라서 tool system의 완료 조건은 “함수를 호출했다”가 아니다. 올바른 executor가 반환했고,
            결과가 올바른 <code>tool_use_id</code>와 연결되어 다음 context에 들어갔으며, side effect가
            필요한 경우 독립 receipt까지 확인됐을 때 닫힌다. 이 trace는
            <InternalLink slug="claw-telemetry">Telemetry</InternalLink>에서 회귀 분석 가능한 event로 남겨야 한다.
          </p>
          <h3>definition, policy requirement와 executor allowlist는 같은 집합이 아니다</h3>
          <p>
            CLI는 model request의 definition을 allowed set으로 줄이지만 permission policy는 전체 registry의
            requirement에서 만들어지고, concrete executor는 allowed set을 다시 검사한다. 숨겼다는 사실은
            정상 model 선택을 막을 뿐 강제로 주입된 ToolUse의 authorization 결과를 대신하지 않는다.
            반대로 definition이 보여도 executor allowlist가 거부할 수 있다. 세 projection의 canonical
            name과 revision을 함께 test해야 “보임=실행 가능”이라는 착각을 막을 수 있다.
          </p>
        </div>
        <StopRule>
          모든 built-in tool 구현을 목록처럼 외우지 않는다. definition, permission, executor,
          observation 네 경계를 임의의 새 tool에 적용할 수 있으면 현재 최소 기반에서 멈춘다.
        </StopRule>
      </section>

      <CapabilityCheck
        items={[
          'definition 노출과 실제 executor dispatch가 다른 계약인 이유를 설명한다.',
          'built-in, plugin, runtime tool의 definition·permission·executor owner를 구분한다.',
          'allowlist alias와 unknown-name fail-closed 동작을 설명한다.',
          'bash 명령 내용이 required permission을 바꾸는 이유를 설명한다.',
          'Prompt mode, ask rule·hook Ask와 PermissionEnforcer의 서로 다른 분기를 구분한다.',
          'model definition set, permission requirement set과 executor allowlist를 독립적으로 판정한다.',
          'timeout 뒤 같은 action을 재시도하기 전에 receipt를 조회해야 하는 이유를 설명한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="claw-compaction" learningPathId="ai-claw-core">요청 전에 context를 줄이는 법</InternalLink></span>
        <span>다음: <InternalLink slug="claw-permissions" learningPathId="ai-claw-security">도구 효과를 허용하는 정책</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw tools/src/lib.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/tools/src/lib.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. ToolSpec, registry projection, allowlist normalization, built-in dispatch, plugin·runtime 경계의 원문.` },
          { label: 'Claw permissions.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/permissions.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 다섯 permission mode, rule, prompter와 최종 authorization 계약.` },
          { label: 'Claw permission_enforcer.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/permission_enforcer.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. Allowed/Denied 결과, Prompt 위임과 command별 required mode 판정.` },
          { label: 'Claw conversation.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/conversation.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. tool use 실행과 반환 결과를 다음 session observation으로 연결하는 loop.` },
          { label: 'Claw CLI main.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/rusty-claude-cli/src/main.rs`, note: 'model definition filter, 전체 permission projection과 executor allowlist의 production wiring.' },
        ]}
      />
    </>
  );
}
