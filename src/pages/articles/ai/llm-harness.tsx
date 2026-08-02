import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import { HarnessControlLab } from './agent-system-core/viz/AgentSystemLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: Array<[string, string]>;
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-[13px] sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function RuntimeRow({
  index,
  component,
  owns,
  evidence,
}: {
  index: string;
  component: string;
  owns: string;
  evidence: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.25rem_8.5rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <strong className="text-sm">{component}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        <p>{owns}</p>
        <p className="mt-1.5 text-xs text-foreground"><strong>남길 증거:</strong> {evidence}</p>
      </div>
    </div>
  );
}

const runState = `type AgentRunState = {
  runId: string;
  task: TaskContract;
  status: "ready" | "running" | "waiting" | "blocked" | "completed";
  contextRevision: string;
  allowedCapabilities: CapabilityGrant[];
  remainingBudget: { turns: number; toolCalls: number; costUsd: number };
  pendingAction?: ActionProposal;
  artifacts: ArtifactRef[];
  checkpoint?: CheckpointRef;
};`;

export default function LlmHarnessArticle() {
  return (
    <>
      <NlpSection
        id="overview"
        marker="01"
        tone="teal"
        question="Loop, context와 MCP를 실제 제품 실행으로 묶는다"
        title="Harness는 모델을 감싼 prompt 묶음이 아니라 replay 가능한 runtime이다"
      >
        <BeginnerBridge title="유능한 작업자에게 도구만 건네도 공정은 저절로 운영되지 않는다">
          누가 일을 시작하고, 중간 결과를 어디에 적고, 실패하면 몇 번 다시 하며, 위험한 작업은 누구의 승인을 받을지 정해야 한다. Harness는 모델의 지능을 더하는 장치가 아니라 이 <strong>실행 순서와 책임을 코드로 붙잡는 운영 틀</strong>이다.
        </BeginnerBridge>
        <QuestionLead
          question="좋은 system prompt, MCP tool과 강한 model을 연결하면 production agent가 완성될까?"
          answer="아니다. 누가 다음 turn을 시작하는지, 어떤 state를 저장하는지, tool 오류를 몇 번 재시도하는지, 고위험 행동을 어디서 막는지, context window가 바뀌어도 어떻게 이어 가는지와 무엇을 trace로 남길지가 아직 없다. Harness는 이 실행 상태와 deterministic gate를 소유한다."
        />
        <ConceptPrimer items={[
          { term: 'Run', meaning: '하나의 task contract를 시작 상태에서 terminal state까지 처리하는 실행 단위다.', why: '대화 thread와 실제 업무 실행을 분리한다.' },
          { term: 'Reducer', meaning: '현재 state와 event를 받아 다음 state를 만드는 결정적 전이 함수다.', why: '자연어 transcript를 다시 읽어 runtime 상태를 추측하지 않게 한다.' },
          { term: 'Gate', meaning: 'Schema, 권한, budget, invariant와 approval을 코드로 검사하는 제어점이다.', why: '모델이 제안한 action과 실제 commit을 분리한다.' },
          { term: 'Checkpoint', meaning: '다음 process·session이 재개할 최소 state와 artifact pointer다.', why: 'Context compaction과 process restart 뒤에도 진행 증거를 보존한다.' },
          { term: 'Trace', meaning: 'Model turn, tool, gate, state diff, error, latency와 version을 잇는 실행 증거다.', why: '마지막 실패 문장보다 최초로 깨진 계약을 찾는다.' },
        ]} />
        <HarnessControlLab />
        <Misconception>
          Harness는 특정 framework 이름이나 거대한 prompt file이 아니다. 같은 model과 tool을 써도 state transition, permission, retry, checkpoint와 evidence contract가 다르면 전혀 다른 시스템이다. 반대로 짧은 workflow에는 무거운 agent framework가 필요하지 않을 수 있다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="composition"
        marker="02"
        tone="blue"
        question="Model이 아닌 구성 요소마다 소유 state와 실패를 배정한다"
        title="Admission에서 commit과 checkpoint까지 한 실행 state machine을 만든다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Harness의 시작은 prompt template이 아니라 <strong>task admission</strong>이다. 사용자 목표, 성공 조건, 초기 environment, 허용 capability, 시간·비용·행동 budget과 고위험 commit 조건을 고정한다. 이 정보는 자연어 instruction과 runtime state로 나뉘며 version을 가진다.</p>
          <p>Model turn은 다음 action을 <em>제안</em>한다. Dispatcher는 tool schema를 검증하고 policy gate는 사용자·task·resource 범위를 검사한다. Executor는 격리된 환경에서 호출하고 result envelope와 state diff를 만든다. Reducer가 이 event를 반영해 다음 state를 만들며, terminal condition이 아니면 새 context packet으로 다음 turn을 시작한다.</p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <RuntimeRow index="01" component="Admission" owns="Task, initial state, 성공·금지 조건과 resource budget을 고정한다." evidence="task ID, policy·environment version, capability grant" />
          <RuntimeRow index="02" component="Context builder" owns="현재 state와 필요한 근거만 다음 model turn의 packet으로 조립한다." evidence="source lineage, 포함·제외 이유, token count" />
          <RuntimeRow index="03" component="Dispatcher" owns="Model proposal을 typed action으로 parse하고 tool·handoff target을 찾는다." evidence="raw proposal hash, parsed argument, schema result" />
          <RuntimeRow index="04" component="Policy gate" owns="사용자 identity, task scope, 누적 data flow, budget과 approval을 판정한다." evidence="allow·deny, rule ID, grant와 approval hash" />
          <RuntimeRow index="05" component="Executor" owns="Timeout, cancellation, idempotency와 sandbox 경계 안에서 side effect를 실행한다." evidence="tool span, response, state diff, retry class" />
          <RuntimeRow index="06" component="State manager" owns="Event를 다음 state로 줄이고 checkpoint와 artifact pointer를 저장한다." evidence="before·after revision, terminal reason, checkpoint" />
        </div>
        <pre className="not-prose my-7 min-w-0 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 font-mono text-xs leading-6 sm:text-sm"><code>{runState}</code></pre>
        <Formula
          latex={String.raw`\underbrace{x_{t+1}}_{\text{다음 상태}}=\underbrace{\operatorname{reduce}}_{\text{결정적 전이}}\!\left(\underbrace{x_t}_{\text{현재 상태}},\underbrace{e_t}_{\text{실행 사건}}\right)`}
          meaning="대화 전체를 다시 해석해 진행 상태를 추측하지 않고, 현재 versioned state와 한 event를 reducer에 넣어 다음 state를 만든다. Model output은 event의 한 종류이며 직접 state를 덮어쓰지 않는다. 같은 state와 event로 같은 전이가 재현되어야 trace replay와 회귀 검증이 가능하다."
          symbols={[
            [String.raw`x_t`, 'turn t의 task status, budget, capability, artifact와 pending action'],
            [String.raw`e_t`, 'model proposal, tool result, policy decision, timeout, approval 또는 cancel event'],
            [String.raw`\operatorname{reduce}`, '허용된 state transition과 invariant를 구현한 runtime 함수'],
            [String.raw`x_{t+1}`, 'event 적용 뒤 저장되는 새 revision의 runtime state'],
          ]}
        />
      </NlpSection>

      <NlpSection
        id="evaluation"
        marker="03"
        tone="violet"
        question="Eval이 재실행할 수 있도록 Harness는 어떤 실행 증거를 발행해야 할까?"
        title="Harness는 trace를 발행하고 Eval은 배포 여부를 판정한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Harness는 모든 text를 무제한 저장하거나 스스로 “배포 가능” 판정을 내리지 않는다. Run과 parent span, model·prompt·tool·policy version, event 전후 state revision, tool·gate result, 최초 error owner, token·latency·cost를 재실행 가능한 trace로 발행한다. Credential과 개인정보는 수집 전에 redact하고 접근·retention을 정한다.</p>
          <p>초기 state, expected final state, forbidden invariant, 반복 reliability와 baseline/candidate release gate는 Eval 글이 소유한다. Harness의 책임은 그 판정기가 같은 fixture에서 실행을 복원할 수 있도록 versioned state와 event evidence를 빠짐없이 제공하는 데서 끝난다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
E_{\text{계보}}&=(id_{run},id_{parent},v_h)\\
E_{\text{상태}}&=(rev_t,e_t,rev_{t+1})\\
E_{\text{결과}}&=(r_{tool},r_{gate})\\
E_{\text{실패}}&=owner_{first}\\
E_{\text{자원}}&=(n_{tok},t_{lat},cost)\\
E_{\text{실행}}&=E_{\text{결과}}\oplus E_{\text{실패}}\oplus E_{\text{자원}}\\
E_h&=E_{\text{계보}}\oplus E_{\text{상태}}\oplus E_{\text{실행}}
\end{aligned}`}
          meaning="이 식은 Harness가 배포 점수를 계산하는 대신 Eval이 재실행·판정할 최소 evidence packet을 발행한다는 소유권을 나타낸다. 결합 기호는 문자열을 한 줄로 붙인다는 뜻이 아니라, 계보·상태·결과·실패·자원의 다섯 leaf 증거 묶음을 같은 run lineage 아래 함께 보존한다는 뜻이다."
          symbols={[
            [String.raw`id_{run},id_{parent}`, '한 실행과 parent span을 연결하는 trace identity'],
            [String.raw`v_h`, 'Model, prompt, tool, policy와 runtime을 함께 pin한 harness version'],
            [String.raw`rev_t,e_t,rev_{t+1}`, 'Event 적용 전 state revision, 관측 event, 적용 후 revision'],
            [String.raw`r_{tool},r_{gate}`, '실제 tool effect와 authorization·safety gate 결과'],
            [String.raw`owner_{first}`, 'Trace에서 최초로 contract를 깬 component owner'],
            [String.raw`n_{tok},t_{lat},cost`, '해당 turn에서 사용한 token 수, 응답 latency와 실행 비용으로 이루어진 자원 사용량'],
            [String.raw`\oplus`, '서로 다른 evidence field를 같은 run packet에 함께 묶는 표기'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 packet을 어떤 grader와 반복 지표로 읽고 배포를 막을지는 <InternalLink slug="agent-evaluation-trace">Agent Evaluation & Trace</InternalLink>에서 다룬다. 판정된 evidence를 release record와 ADR로 얼마나 오래 보존할지는 그다음 운영 증거 경로가 맡는다.</p>
        </div>
        <Misconception>
          Trace가 많으면 원인이 자동으로 보이는 것은 아니다. 같은 의미를 여러 span에 복제하거나 raw prompt 전체를 남기면 비용과 민감정보 위험만 커진다. 최초로 깨진 contract와 그 이전 state를 되짚을 수 있는 최소 증거가 필요하다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="iteration"
        marker="04"
        tone="amber"
        question="실패를 prompt 한 줄이 아니라 올바른 소유 component의 regression으로 바꾼다"
        title="Measure → classify → change one boundary → paired rerun"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Model이 틀렸다는 결론부터 내리면 context miss, tool timeout, policy fail-open, stale environment와 grader 오류를 모두 prompt로 고치게 된다. 먼저 trace에서 최초로 기대 state와 달라진 event를 찾고 owner를 분류한다. 그다음 한 boundary만 바꾸고 같은 task snapshot에서 baseline과 candidate를 paired run한다.</p>
          <p>긴 작업은 context window 하나에 완료되지 않는다. Anthropic의 long-running harness 연구는 initializer와 incremental worker, feature list, progress artifact, git history 같은 외부 상태로 session 간 진행을 이어 가는 접근을 설명한다. 핵심은 compaction을 기억으로 오인하지 않고 매 session이 완료 가능한 작은 단위를 수행한 뒤 다음 worker가 검증할 artifact를 남기는 것이다.</p>
          <p>OpenAI의 2026 harness engineering 사례도 사람이 코드를 직접 쓰지 않는 제약 아래 repository legibility, isolated worktree, browser·observability 도구, repository-local 지침과 반복 review loop를 강화했다. 이 사례는 모든 팀이 같은 속도 향상을 얻는다는 보편 법칙이 아니라, agent가 환경을 직접 관찰·검증할 수 있게 만들면 긴 작업의 bottleneck이 달라진다는 제품 증거다.</p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border sm:grid-cols-2">
          {[
            ['Model', '근거와 허용 행동이 있는데도 잘못 선택했다.', 'Prompt·model·post-training 가설을 eval한다.'],
            ['Context', '필요 evidence가 없거나 stale·저권위 source가 우세했다.', 'Packet selection과 lineage regression을 만든다.'],
            ['Tool', 'Timeout, schema drift, 잘못된 result 또는 side effect가 났다.', 'Contract test, fault injection과 idempotency를 고친다.'],
            ['Policy', '허용하면 안 되는 action을 commit하거나 정상 action을 막았다.', 'Rule·grant·approval fixture를 추가한다.'],
            ['State', 'Retry, checkpoint, cancellation 또는 resume가 진행을 잃었다.', 'Reducer transition과 restart replay를 검사한다.'],
            ['Grader', '정답 실행을 실패로 보거나 위험 실행을 통과시켰다.', 'Deterministic evidence와 사람 표본으로 재교정한다.'],
          ].map(([owner, symptom, action]) => (
            <div key={owner} className="min-w-0 bg-background p-4">
              <h3 className="text-sm font-bold">{owner}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{symptom}</p>
              <p className="mt-2 text-xs leading-relaxed"><strong>수정:</strong> {action}</p>
            </div>
          ))}
        </div>
        <Takeaway>
          실패를 다음 run의 instruction에만 추가하지 않는다. 재발하면 안 되는 contract는 schema, test, policy, reducer와 environment check처럼 기계적으로 검증되는 위치로 옮긴다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="patterns"
        marker="05"
        tone="green"
        question="Pattern catalog 대신 현재 실패에 필요한 최소 control을 고른다"
        title="짧은 run에서 long-running·고위험 run까지 점진적으로 확장한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>모든 harness에 RAG, multi-agent, critic, consensus와 human approval을 한꺼번에 넣지 않는다. 짧고 read-only인 task는 typed output과 timeout만으로 충분할 수 있다. 외부 data가 필요하면 retrieval과 citation을, side effect가 있으면 task capability와 commit gate를, 긴 작업이면 checkpoint와 restart test를, 고위험 행동이면 구체적 approval과 사람이 개입할 terminal state를 추가한다.</p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <RuntimeRow index="01" component="짧은 read-only" owns="한두 model turn, typed output, deadline과 source citation" evidence="input·output, model version, schema result" />
          <RuntimeRow index="02" component="Tool-using" owns="Capability selection, schema, timeout, retry class와 observation packet" evidence="tool span, argument, result·error, state diff" />
          <RuntimeRow index="03" component="Long-running" owns="작은 task queue, checkpoint, artifact registry와 restart" evidence="progress revision, completed test, next owner" />
          <RuntimeRow index="04" component="High-impact" owns="Least privilege, prepare–commit 분리, concrete approval과 rollback" evidence="grant, approval hash, commit result, recovery" />
        </div>
        <StopRule>
          새 abstraction은 관측된 failure family를 제거하고 같은 eval에서 개선을 증명할 때만 추가한다. 짧은 workflow에 agent loop를, 한 agent가 충분한 task에 multi-agent를, read-only task에 복잡한 approval state를 넣지 않는다.
        </StopRule>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>다음은 위험과 증거를 닫는 두 글이다. <InternalLink slug="prompt-injection-defense">Prompt Injection 방어</InternalLink>는 untrusted source가 privileged sink에 닿지 못하게 하고, <InternalLink slug="agent-evaluation-trace">Agent Evaluation & Trace</InternalLink>는 수정 전후의 실제 개선을 반복 trial로 검증한다.</p>
          <p>이 공통 state machine을 실제 crate ownership과 parity harness에 대입하려면 <InternalLink slug="claw-overview" learningPathId="ai-claw-core">Claw Code 전체 구조</InternalLink>로 내려간다. 공통 설계 원칙과 특정 Rust 구현의 사실을 섞지 않고, 대응되는 component를 하나씩 비교한다.</p>
        </div>
        <CapabilityCheck items={[
          'Agent loop, context packet, MCP exchange와 harness runtime의 책임을 겹치지 않게 설명할 수 있다.',
          'Task admission에서 model proposal, policy, tool, reducer와 checkpoint까지 state machine을 설계할 수 있다.',
          'Model output을 event로 취급하고 결정적 reducer로 versioned state를 갱신할 수 있다.',
          'Trace와 eval case를 구분하고 forbidden invariant, task success와 운영 budget으로 release할 수 있다.',
          '실패를 model, context, tool, policy, state와 grader owner로 분류해 paired rerun할 수 있다.',
          'Task 위험과 길이에 따라 최소 harness control만 추가할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Anthropic · Effective harnesses for long-running agents (2025)', href: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents', note: '여러 context window를 잇는 initializer, incremental progress와 external artifact 접근.' },
          { label: 'Anthropic · Harness design for long-running application development (2026)', href: 'https://www.anthropic.com/engineering/harness-design-long-running-apps', note: 'Frontend와 장기 application task에서 prompt·harness ceiling을 넘기 위한 현재 연구.' },
          { label: 'OpenAI · Harness engineering: leveraging Codex in an agent-first world (2026)', href: 'https://openai.com/index/harness-engineering/', note: 'Repository legibility, isolated environment, feedback loop와 agent-written product 사례의 실제 범위.' },
          { label: 'OpenAI Agents SDK · Tracing', href: 'https://openai.github.io/openai-agents-python/tracing/', note: 'Run, turn, model, function, guardrail과 handoff span의 현재 구현 사례와 sensitive-data 경계.' },
          { label: 'OpenAI · A practical guide to building agents', href: 'https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/', note: 'Tool, orchestration, layered guardrail, retry threshold와 human intervention 기준.' },
        ]} />
      </NlpSection>
    </>
  );
}
