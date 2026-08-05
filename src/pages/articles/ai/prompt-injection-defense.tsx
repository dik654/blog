import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { PromptInjectionContainmentViz } from './prompt-injection-defense/viz/PromptInjectionContainmentViz';

const policySketch = `type ActionProposal = {
  taskId: string;
  tool: string;
  arguments: unknown;
  sourceIds: string[];
  parentActionIds: string[];
  dataLabels: Array<'public' | 'internal' | 'confidential'>;
  destination?: string;
};

function authorize(action: ActionProposal, grant: TaskGrant, history: ActionLog): Decision {
  if (!grant.allowedTools.includes(action.tool)) return deny('tool_scope');
  if (!matchesUserIntent(action, grant.intent)) return deny('intent_drift');
  if (!flowPolicy.allows(history, action)) return deny('composed_data_flow');
  if (isHighImpact(action) && !hasSpecificApproval(action)) return ask('approval');
  return allow({ expiresAt: grant.expiresAt, sourceIds: action.sourceIds });
}

function commit(prepared: ActionProposal, grant: TaskGrant, history: ActionLog) {
  const current = resolveCurrentResources(prepared);
  const decision = authorize(current, grant, history);
  if (!decision.allowed || hash(current) !== approvedHash(prepared)) return deny('commit_recheck');
  return execute(current);
}`;

export default function PromptInjectionDefenseArticle() {
  return (
    <>
      <section id="threat-model" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">악성 문장을 찾기 전에 무엇이 피해를 만들 수 있는지 찾는다</h2>
        <QuestionLead
          question="메일 요약 agent가 악성 이메일의 지시를 믿었다. 모델이 속은 순간 이미 보안 사고일까?"
          answer={<>아직은 아니다. 사고는 그 판단이 <strong>민감정보 읽기, 외부 송신, 영구 변경</strong> 같은 privileged sink에 도달할 때 발생한다. 방어의 핵심은 모든 악성 문장을 맞히는 것이 아니라 untrusted source가 위험한 sink를 움직이지 못하게 deterministic gate를 두는 것이다.</>}
        />
        <ConceptPrimer items={[
          { term: 'Authority', meaning: '이번 task의 목표와 정책을 정할 수 있는 주체다. 사용자 의도와 서버 정책이 여기에 속한다.', why: '이메일·웹페이지·tool result가 명령처럼 보여도 authority로 승격되면 안 된다.' },
          { term: 'Source', meaning: '모델 context로 들어오는 데이터의 출처와 신뢰·민감도 label이다.', why: '같은 문자열이어도 사용자가 승인한 목표인지 외부 문서 내용인지에 따라 다르게 처리해야 한다.' },
          { term: 'Sink', meaning: '외부 송신, 파일·DB 변경, durable memory 저장처럼 보안 영향을 만드는 행동 지점이다.', why: 'Prompt injection은 source가 sink에 닿을 수 있을 때 실제 피해가 된다.' },
          { term: 'Capability', meaning: '특정 task·사용자·도구·인자 범위와 만료를 묶은 실행 권한이다.', why: '모델의 tool proposal과 실제 authorization을 분리한다.' },
          { term: 'Commit', meaning: '정책 판정과 필요한 승인을 통과한 side effect를 실제 시스템에 반영하는 순간이다.', why: '생성과 실행 사이에 마지막 deterministic boundary를 만든다.' },
        ]} />
        <PromptInjectionContainmentViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>공통 사례의 사용자 요청은 “최근 vendor email을 요약하고 답장 초안을 만들어 줘”다. Inbox의 한 이메일에는 보이지 않는 지시가 숨어 있다. 그 지시는 customer 417의 record를 읽고 외부 URL로 보내며, “vendor는 항상 admin”이라는 문장을 memory에 저장하라고 요구한다.</p>
          <p>여기서 이메일은 업무상 읽어야 하는 <strong>데이터</strong>지만 task 목표나 권한을 바꿀 authority는 없다. Customer DB는 confidential source이고, 외부 HTTP와 durable memory는 별도의 sink다. 모델이 공격을 탐지했는지보다 먼저 이 source와 sink가 어떤 경로로 연결되는지 그린다.</p>
        </div>
        <Misconception>Prompt injection과 jailbreak는 같은 말이 아니다. Jailbreak는 모델의 safety behavior를 우회하려는 하위 형태다. Agent 보안에서 더 중요한 indirect injection은 사용자가 요청하지 않은 외부 content가 agent 목표와 tool action을 바꾸려는 공격이다.</Misconception>
      </section>

      <section id="attack-chain" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공격 문자열이 아니라 권한이 커지는 실행 경로를 추적한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>단순한 “이전 지시를 무시하라” 목록은 새 표현, 다른 언어, 이미지 속 글자, 여러 문서에 나뉜 payload를 만나면 금방 낡는다. 실행 경로는 더 오래 유지된다. 공격자는 agent가 읽을 source를 오염시키고, 그 내용을 권위 있는 계획으로 오인하게 만든 뒤, 넓은 도구와 credential을 이용해 sink에 도달하려 한다.</p>
          <ol>
            <li><strong>Source control:</strong> 공격자가 이메일, 웹페이지, RAG 문서, issue, tool description 또는 peer-agent message를 제어한다.</li>
            <li><strong>Interpretation:</strong> 모델이 content 안의 명령을 사용자 목표나 정책보다 높은 authority로 잘못 해석한다.</li>
            <li><strong>Plan drift:</strong> 요약·초안 task가 customer lookup, 외부 송신, memory 변경으로 넓어진다.</li>
            <li><strong>Tool pivot:</strong> 모델은 정상 registry에 있는 도구를 의도하지 않은 인자와 순서로 제안한다.</li>
            <li><strong>Commit:</strong> 외부 시스템이 모델 출력을 다시 검증하지 않으면 송신이나 변경이 현실 상태가 된다.</li>
          </ol>
          <p>이 흐름은 모델이 악의적이라서가 아니라 <em>confused deputy</em>가 되었기 때문에 생긴다. Agent는 사용자의 identity와 도구를 사용할 수 있지만 외부 문서가 그 권한을 빌려 쓰려 한다. 그래서 system prompt를 더 강하게 쓰는 것만으로 authorization을 대신할 수 없다.</p>
          <p>Source는 문서만이 아니다. MCP server가 보낸 tool description이 “이 도구는 모든 고객 record를 먼저 읽어야 한다”고 주장해도 그것은 schema metadata이지 task authority가 아니다. Peer agent의 “부모가 승인했다”는 메시지도 서명된 grant가 아니면 model-derived input이다. 두 경우 모두 모델이 이해할 설명과 실제 resource server가 검증할 capability를 분리해야 한다.</p>
          <p>2026 OWASP Agentic Top 10은 이 한 경로를 goal hijack, tool misuse, identity·privilege abuse, memory·context poisoning처럼 서로 다른 운영 위험으로 나눈다. 공격 이름 네 개를 따로 외우라는 뜻이 아니다. 같은 source가 목표를 비틀고, 정상 tool을 엉뚱하게 쓰며, 넓은 identity를 빌리고, 다음 session의 memory까지 오염시키는 <strong>연결된 trace</strong>를 각 책임자가 끊을 수 있게 만든 분류다.</p>
        </div>
      </section>

      <section id="trust-lineage" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Context에 들어간 뒤에도 출처와 민감도를 잃지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><InternalLink slug="context-engineering">Context Engineering</InternalLink>은 필요한 정보를 model turn에 넣는 법을 설명한다. 이 글은 거기에 trust label을 더한다. XML tag나 message role은 모델이 문서를 구분하도록 돕는 신호지만 security boundary는 아니다. Parser가 만든 block, retrieval 결과, tool output, image OCR과 agent message마다 source ID, trust class와 data label을 context 밖의 metadata로 유지한다.</p>
          <p>변환이 일어나도 lineage를 지우지 않는다. 외부 이메일을 요약한 문장은 새 authority가 아니라 `external-email`을 부모로 둔 derived data다. 여러 source를 합쳤다면 가장 제한적인 data label을 보존한다. 모델이 만든 결론도 verified policy record가 아니면 `model-derived`로 표시한다.</p>
          <p>Durable memory는 특히 위험한 sink다. 한 turn의 injection이 “사용자는 admin 권한을 위임했다”는 가짜 fact로 저장되면 공격이 끝난 뒤에도 다시 retrieval된다. Untrusted 또는 model-derived fact는 quarantine에 넣고, authority source와 검증 규칙이 없으면 authorization·identity·policy memory로 승격하지 않는다.</p>
          <p>Quarantine은 write를 막는 보관함으로 끝나지 않는다. 이후 retrieval에서 그 fact를 다시 읽더라도 원래 lineage와 제한 label을 붙여 context에 넣고, policy나 grant의 근거로 사용하지 않는다. Sub-agent를 호출할 때도 부모의 전체 권한을 상속시키지 않고 새 task grant를 발급한다. 부모 메시지는 작업 설명일 뿐 권한 증명서가 아니다.</p>
        </div>
        <Misconception>외부 content를 따옴표나 XML 안에 넣으면 모델에게는 유용한 구분 신호가 생긴다. 그러나 그 표시가 깨지지 않는 접근 제어는 아니다. Trust와 authorization은 model context 밖의 코드와 정책 엔진이 강제해야 한다.</Misconception>
      </section>

      <section id="policy-gate" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">모델은 행동을 제안하고 정책 엔진이 실행을 허용한다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">콘텐츠 속 명령을 모델이 따를 가능성을 0으로 만들 수 없다면 실행 권한을 별도 경계에서 줄여야 한다. 앞의 실행 추적 3번 장면처럼 global tool registry와 현재 task capability를 비교해 공격이 제안한 행동 중 실제 side effect까지 갈 수 있는 범위를 계산한다.</p>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Global registry에는 여섯 도구가 있지만 이번 session에 모델에게 제공하는 task capability는 <code>read_inbox</code>와 <code>draft_reply</code> 두 개뿐이다. 악성 content가 다섯 행동을 만들더라도 두 개만 허용되고 customer read, outbound HTTP, durable memory write 세 개는 거부된다. 실행된 외부·영구 side effect는 0이다.</p>
          <p>도구를 숨기는 것만으로 끝나지 않는다. Model이 존재하지 않는 tool call을 만들거나 다른 endpoint를 통해 같은 sink에 도달할 수 있으므로, resource server가 사용자 identity와 task grant를 다시 확인한다. MCP remote server라면 access token의 audience와 scope를 검증하고 token passthrough를 허용하지 않는다. Session ID는 authorization 근거가 아니다.</p>
        </div>
        <div className="not-prose my-6 min-w-0">
          <div className="min-w-0 overflow-hidden rounded-md border border-border p-3 sm:p-4">
            <MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\begin{aligned}
\underbrace{G(a_t\mid h_{<t})}_{\text{현재 행동과 이전 이력의 gate}}
&=\underbrace{I(a_t)}_{\text{사용자 목표}}\land\underbrace{C(a_t)}_{\text{task 권한}}\\[-1pt]
&\quad\land\underbrace{F(h_{<t},a_t)}_{\text{누적 데이터 흐름}}\land\underbrace{A(a_t)}_{\text{구체적 승인}}\\[3pt]
\underbrace{\operatorname{commit}(a_t)}_{\text{실제 side effect}}
&=\underbrace{\mathbf 1[G_{\mathrm{prepare}}\land G_{\mathrm{commit}}]}_{\text{준비 때와 실행 직전 모두 재검증}}
\end{aligned}`}</MathFormula>
          </div>
          <FormulaNote
            meaning="현재 action을 고립해서 보지 않는다. 이전 action이 만든 data와 destination까지 함께 추적하고, prepare 뒤 resource·redirect·policy·grant가 달라졌다면 commit gate를 닫는다. 모델 confidence나 injection classifier 점수는 이 두 번의 deterministic 검사를 대신하지 않는다."
            symbols={[[String.raw`a_t`, '지금 실행하려는 tool action'], [String.raw`h_{<t}`, '그 전에 실행되거나 준비된 action과 data-flow 이력'], [String.raw`I(a_t)`, '원래 사용자 목표에 포함된 행동인지 검사'], [String.raw`C(a_t)`, '도구·resource·인자·사용자·만료 범위가 현재 grant 안인지 검사'], [String.raw`F(h_{<t},a_t)`, '이전 결과가 이번 입력이 된 누적 흐름까지 허용되는지 검사'], [String.raw`A(a_t)`, '정확한 대상·인자·영향을 사용자가 승인했는지 검사'], [String.raw`G_{\mathrm{prepare}}`, '실행 후보를 만들 때의 첫 정책 판정'], [String.raw`G_{\mathrm{commit}}`, '실제 resource와 destination을 다시 해석한 실행 직전 판정'], [String.raw`\mathbf 1`, '두 gate가 모두 참일 때만 1을 반환하는 지시 함수']]}
          />
        </div>
        <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-xs leading-6 sm:text-sm"><code>{policySketch}</code></pre>
      </section>

      <section id="approval-commit" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Approval은 경고창이 아니라 한 commit에 묶인 서명이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>“이 agent를 신뢰하시겠습니까?” 같은 blanket consent는 이후 모든 action을 정당화하지 못한다. 승인은 <strong>도구, 대상, 핵심 인자, 외부로 나가는 data, 예상 side effect</strong>를 보여 주고 그 action hash에 묶는다. 인자나 destination이 바뀌면 다시 판정한다.</p>
          <p>Prepare와 commit 사이에는 시간이 흐른다. 그동안 URL redirect, customer record, credential, policy version 또는 grant가 바뀔 수 있다. 따라서 commit 직전에 destination과 resource를 다시 resolve하고 현재 label·policy·grant로 재판정한다. 승인된 action hash와 달라졌다면 자동 실행하지 않는다.</p>
          <p>모든 호출을 묻는 것도 안전하지 않다. Approval fatigue가 생기면 사용자는 내용을 읽지 않고 누른다. Read-only이고 task scope 안인 작업은 자동 허용하되, 외부 송신·금전·publish·삭제·권한 변경·credential 사용처럼 irreversible하거나 영향이 큰 sink만 구체적으로 확인한다.</p>
          <p>가능하면 prepare와 commit을 나눈다. Agent는 이메일을 draft로 만들 수 있지만 send는 별도 endpoint와 승인으로 실행한다. 파일 변경은 isolated workspace에 patch를 만들고 review 뒤 적용한다. 결제는 cart 구성과 purchase commit을 분리한다. 이 분리는 모델이 속여도 즉시 현실 상태가 바뀌는 것을 막는다.</p>
          <p>행동 조합도 검사해야 한다. <code>draft_reply</code>는 허용된 artifact지만 공격자의 tracking URL을 보존할 수 있고, 다음 renderer의 자동 fetch도 따로 보면 허용될 수 있다. 두 행동을 합치면 confidential data가 외부로 흐른다. 그래서 artifact가 다음 action의 source가 되는 순간 lineage를 이어 붙이고 <code>F(history, action)</code>으로 누적 경로를 다시 판정한다.</p>
        </div>
      </section>

      <section id="detection-recovery" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">탐지는 gate를 대신하지 않고 새 실패를 찾는 sensor가 된다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">차단했다는 결과만 남기면 어떤 입력과 policy가 작동했고 같은 공격을 다시 막는지 재현할 수 없다. 앞의 실행 추적 5번 장면처럼 untrusted source, 미실행 proposal, policy decision, committed side effect와 replay fixture를 한 incident evidence chain으로 연결한다.</p>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Classifier, keyword filter, spotlighting과 model training은 공격 성공률을 낮출 수 있지만 완전한 판별기가 아니다. 2026년 OpenAI는 실제 공격이 단순 문자열보다 social engineering에 가까워져 input firewall만으로는 충분하지 않다고 설명한다. Anthropic도 adaptive attacker 평가에서 낮은 공격 성공률이 남아 있으면 여전히 의미 있는 위험이라고 명시했다.</p>
          <p>따라서 sensor의 출력은 <code>allow</code>가 아니라 risk signal이다. 의심 content는 quarantine하거나 read-only lane으로 보내고, plan drift와 tool-chain 변화, confidential-to-external flow, 새로운 destination, denial burst를 trace에 남긴다. Prompt와 customer data 전체를 무조건 로그로 복제하지 않고 source hash, label, policy version, proposal, decision reason과 commit state를 최소 증거로 보존한다.</p>
          <p>차단된 incident도 끝이 아니다. 같은 source fixture, task grant, policy version과 sink를 eval case로 만들고 <InternalLink slug="agent-evaluation-trace">Agent Evaluation & Trace</InternalLink>에서 baseline과 수정본을 반복 실행한다. Fixture에는 악성 tool metadata, peer-agent의 가짜 승인, 다음 session에서 다시 읽힌 quarantine fact, prepare 뒤 바뀐 redirect, 따로는 허용되지만 함께 유출을 만드는 두 action도 포함한다. Attack detector score보다 중요한 release invariant는 <code>forbidden side effect = 0</code>과 <code>legitimate task still succeeds</code>를 함께 만족하는지다.</p>
        </div>
        <Misconception>“공격을 탐지했는가?”만 측정하면 false positive를 줄이는 과정에서 위험한 sink가 다시 열릴 수 있다. Red team은 탐지율뿐 아니라 unauthorized commit, confidential egress, durable poisoning과 정상 task completion을 함께 재실행해야 한다.</Misconception>
      </section>

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">앞뒤 글과 책임을 겹치지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ul>
            <li><InternalLink slug="mcp-protocol">MCP</InternalLink>는 tool discovery, schema, transport와 result envelope를 소유한다. Tool description과 server metadata가 안전하다는 보장은 이 글의 trust·authorization gate가 맡는다.</li>
            <li><InternalLink slug="llm-harness">Harness Engineering</InternalLink>은 loop, state, retry, timeout과 trace plumbing을 소유한다. 어떤 source가 어떤 sink로 갈 수 있는지는 이 글의 policy가 결정한다.</li>
            <li><InternalLink slug="agent-evaluation-trace">Agent Evaluation & Trace</InternalLink>는 incident fixture를 반복 실행하고 regression release를 판정한다. 이 글은 그 eval이 검사할 forbidden commit과 evidence schema를 만든다.</li>
            <li>더 구체적인 filesystem·shell 강제 경계가 필요하면 <InternalLink slug="claw-permissions">Claw permission model</InternalLink>, <InternalLink slug="claw-file-ops">file boundary</InternalLink>, <InternalLink slug="claw-bash">shell boundary</InternalLink>로 내려간다.</li>
          </ul>
        </div>
        <CapabilityCheck items={[
          'Agent가 읽는 source와 영향을 만드는 sink를 그려 prompt injection의 실제 피해 경로를 찾을 수 있다.',
          'Model proposal과 deterministic authorization, approval과 commit을 서로 다른 상태로 설명할 수 있다.',
          'Tool metadata와 peer-agent message를 권한으로 오인하지 않고, 재발급된 task grant와 누적 data-flow 이력으로 판정할 수 있다.',
          '6개 global tool 중 task에 필요한 2개만 제공하고, 다섯 proposal에서 2 allow·3 deny·0 side effect가 되는 이유를 검산할 수 있다.',
          'Prepare 이후 destination·resource·policy가 바뀌는 TOCTOU를 commit-time re-check로 차단할 수 있다.',
          'Classifier가 공격을 놓쳐도 confidential egress와 durable memory poisoning을 막는 policy를 작성할 수 있다.',
          '차단 incident를 eval fixture로 바꾸고 정상 task 성공과 forbidden commit 0을 함께 검증할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'OpenAI · Designing AI agents to resist prompt injection (2026)', href: 'https://openai.com/index/designing-agents-to-resist-prompt-injection/', note: 'Input firewall만으로는 부족하며 source-sink와 constrained impact로 문제를 보는 현재 보안 관점.' },
          { label: 'Anthropic · Mitigating prompt injection in browser use (2025)', href: 'https://www.anthropic.com/research/prompt-injection-defenses', note: 'Training, classifier, adaptive red team의 역할과 공격 성공률이 0이 아닌 한 위험이 남는다는 경계.' },
          { label: 'OWASP LLM01:2025 Prompt Injection', href: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/', note: 'Direct·indirect·multimodal·obfuscated injection과 privilege control, 외부 content 분리, adversarial test의 기준.' },
          { label: 'OWASP LLM06:2025 Excessive Agency', href: 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/', note: '최소 tool functionality, downstream permission, 사용자 context와 high-impact approval의 근거.' },
          { label: 'OWASP · Top 10 for Agentic Applications 2026', href: 'https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/', note: 'Goal hijack, tool misuse, identity·privilege abuse와 memory·context poisoning을 agent 실행 경로의 별도 운영 위험으로 나누는 최신 분류.' },
          { label: 'MCP Authorization', href: 'https://modelcontextprotocol.io/docs/tutorials/security/authorization', note: 'Resource server의 token validation, least-privilege scope, session ID와 authorization 분리의 현재 안내.' },
          { label: 'MCP Security Best Practices', href: 'https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices', note: 'Confused deputy, token passthrough, SSRF, session hijack와 scope minimization의 protocol 경계.' },
          { label: 'Microsoft · Defend against indirect prompt injection', href: 'https://learn.microsoft.com/en-us/security/zero-trust/sfi/defend-indirect-prompt-injection', note: 'Spotlighting, plan drift, tool-chain analysis, information-flow control와 short-lived privilege를 함께 쓰는 defense-in-depth pattern.' },
        ]} />
      </section>
    </>
  );
}
