import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import { AgentLoopLab } from './agent-system-core/viz/AgentSystemLabs';

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

function ContractRow({
  index,
  title,
  input,
  output,
  failure,
}: {
  index: string;
  title: string;
  input: string;
  output: string;
  failure: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.25rem_8rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <strong className="text-sm">{title}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        <p><strong className="text-foreground">입력:</strong> {input}</p>
        <p className="mt-1"><strong className="text-foreground">산출물:</strong> {output}</p>
        <p className="mt-1 text-xs"><strong className="text-foreground">실패:</strong> {failure}</p>
      </div>
    </div>
  );
}

export default function AgenticPatternsArticle() {
  return (
    <>
      <NlpSection
        id="overview"
        marker="01"
        tone="teal"
        question="모든 LLM 호출을 agent라고 부르기 전에 제어 구조부터 고른다"
        title="정답을 한 번 생성하는가, 결과를 보고 다음 행동을 바꾸는가?"
      >
        <QuestionLead
          question="회사 정책을 찾아 답하는 기능에 곧바로 자율 agent와 multi-agent team이 필요할까?"
          answer="아니다. 실행 순서가 미리 정해져 있으면 workflow가 더 단순하고 검증하기 쉽다. Agent가 필요한 경계는 외부 결과를 관찰한 뒤 모델이 다음 행동과 종료 시점을 스스로 바꿔야 할 때다. 긴 작업에서는 이 loop에 상태, 권한, 예산과 검증 하네스가 더 붙는다."
        />
        <ConceptPrimer items={[
          { term: 'Workflow', meaning: '코드가 실행 경로를 미리 정하고 모델은 그 안의 한 단계를 수행한다.', why: '예측 가능한 순서와 실패 처리가 필요한 업무의 기본값이다.' },
          { term: 'Agent', meaning: '모델이 현재 상태를 읽고 다음 행동, 도구와 종료 여부를 선택하는 loop다.', why: '관찰 결과마다 경로가 달라지는 task를 처리한다.' },
          { term: 'Environment', meaning: '도구, 파일, DB, 브라우저처럼 agent 행동 뒤 상태가 달라지는 외부 세계다.', why: '답변 문장만이 아니라 실제 side effect를 검증해야 한다.' },
          { term: 'Harness', meaning: 'Loop의 권한, retry, checkpoint, trace와 release gate를 강제하는 runtime이다.', why: '모델의 제안과 제품의 실제 실행을 분리한다.' },
        ]} />
        <AgentLoopLab />
        <Misconception>
          Tool call이 하나 있다고 자동으로 agent가 되는 것은 아니다. 고정된 retrieve → generate pipeline도 도구를 쓰지만 다음 경로는 코드가 정한다. 반대로 agent는 매 step의 관찰을 바탕으로 경로를 다시 고르므로 더 큰 실패 공간과 종료 계약이 필요하다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="react"
        marker="02"
        tone="blue"
        question="ReAct를 생각 문구가 아니라 상태를 갱신하는 실행 loop로 읽는다"
        title="관찰 없는 추론과 검증 없는 행동을 분리한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>ReAct의 핵심은 화면에 긴 생각을 출력하는 형식이 아니다. 모델이 현재 task와 관찰 기록에서 행동을 제안하고, 환경이 돌려준 새 사실을 다음 turn의 근거로 넣어 계획을 갱신하는 구조다. 원 논문은 reasoning trace와 task-specific action을 번갈아 생성해 외부 정보와 상호작용하는 방식을 연구했다. 제품에서는 내부 추론을 공개해야 한다는 뜻으로 옮기지 않는다.</p>
          <p>한 step은 최소 네 계약을 가진다. <strong>state</strong>는 현재 목표와 이미 확인한 사실, <strong>proposal</strong>은 다음 tool과 typed argument, <strong>observation</strong>은 tool이 반환한 결과와 오류, <strong>transition</strong>은 이 결과를 반영한 새 state다. Tool result를 단순 문자열로 이어 붙이면 출처, 오류 여부와 권한 경계가 사라진다.</p>
          <p>이 절은 production 실행 계약만 소유한다. ReAct 2022의 action-space 정의, Wikipedia API, QA failure와 ALFWorld·WebShop 수치는 <InternalLink slug="paper-react-2022">ReAct 원문 재구성</InternalLink>에서 먼저 검산한다.</p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ContractRow index="01" title="Observe" input="사용자 목표, 현재 state, 직전 tool result" output="새 사실, 미해결 질문, 위험 신호" failure="오래된 결과나 오류를 사실로 승격한다." />
          <ContractRow index="02" title="Decide" input="허용된 도구와 남은 budget" output="typed action proposal 또는 종료 제안" failure="존재하지 않는 tool, 넓은 인자, 무한 반복을 만든다." />
          <ContractRow index="03" title="Act" input="정책 gate를 통과한 proposal" output="외부 상태 변화 또는 read result" failure="모델 confidence를 authorization으로 오해한다." />
          <ContractRow index="04" title="Verify" input="result, expected invariant, task state" output="완료·수정·이관 중 하나" failure="도구가 200을 반환했다는 이유로 task 완료를 선언한다." />
        </div>
        <Takeaway>
          다음 글에서 설계할 context는 이 loop의 매 turn에 들어가는 <strong>판단 packet</strong>이다. 대화 전체를 보관하는 일이 아니라 다음 행동에 필요한 상태와 근거를 다시 조립하는 일이다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="plan-execute"
        marker="03"
        tone="violet"
        question="계획은 미래를 확정하는 문서가 아니라 검증 가능한 다음 단위다"
        title="Plan-and-Execute, reflection과 종료 조건을 한 state machine으로 묶는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>복잡한 task에서 계획을 먼저 쓰면 누락과 의존성을 볼 수 있다. 하지만 첫 계획을 끝까지 강제하면 tool 결과와 환경 변화가 반영되지 않는다. 실전 계획은 작업 ID, 선행 조건, 예상 산출물, 검증 방법과 상태를 가진 작은 DAG 또는 queue에 가깝다. 실행 후 관찰이 달라지면 남은 계획만 다시 계산한다.</p>
          <p>Reflection도 “더 잘 생각해”라는 두 번째 prompt가 아니다. 예상 산출물과 실제 증거를 비교해 차이를 구조화하고, 그 차이가 model 판단, tool, context, 권한 또는 test 중 어디에서 시작됐는지 분류해야 한다. 같은 모델에게 근거 없이 자가 비평을 반복시키면 비용만 늘고 같은 오류를 확신할 수 있다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\operatorname{stop}_t}_{\text{현재 loop 종료}}&=\underbrace{\mathbf 1[D_t=1]}_{\text{완료 증거}}\lor\underbrace{\mathbf 1[B_t\le 0]}_{\text{예산 소진}}\\[0.45em]&\quad\lor\underbrace{\mathbf 1[R_t>\tau_R]}_{\text{위험 한계 초과}}\lor\underbrace{\mathbf 1[H_t=1]}_{\text{사람 판단 필요}}\end{aligned}`}
          meaning="종료는 모델이 ‘완료했다’고 말하는 한 조건이 아니다. 요구 산출물과 test가 확인된 완료, 자원 예산 소진, 위험 한계 초과, 사람 승인이 필요한 상태 중 하나가 참이면 loop를 멈춘다. 완료 외 조건에서는 성공이 아니라 중단·이관 상태를 남긴다."
          symbols={[
            [String.raw`D_t`, '요구 artifact와 검증이 모두 통과했는지 나타내는 완료 상태'],
            [String.raw`B_t`, '남은 tool call, 시간, token 또는 비용 budget'],
            [String.raw`R_t`, '현재 action과 누적 이력에서 계산한 위험'],
            [String.raw`\tau_R`, '자동 실행을 멈추도록 미리 정한 위험 상한'],
            [String.raw`H_t`, '모호한 정책이나 고위험 commit 때문에 사람이 필요한 상태'],
            [String.raw`\lor`, '어느 한 조건만 참이어도 종료한다는 논리 OR'],
          ]}
        />
        <StopRule>
          고정 workflow로 성공 조건을 재현할 수 있으면 agent loop를 추가하지 않는다. Agent를 쓰더라도 완료 증거, retry·비용 budget, 위험 gate와 사람 이관 중 하나라도 정의하지 못하면 자율 범위를 넓히지 않는다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="multi-agent"
        marker="04"
        tone="amber"
        question="역할 수가 아니라 분리 가능한 상태와 검증 경계를 본다"
        title="Multi-agent는 더 똑똑한 답이 아니라 병렬성과 격리를 사는 비용이다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>한 agent의 context가 복잡하다는 이유만으로 여러 agent를 만들면 문제가 사라지지 않는다. 각 worker에 전달할 task contract, 공유 state, 충돌 해결, 중복 작업, 결과 검증과 권한 위임이 새로 생긴다. 같은 모호한 목표를 여러 모델에 복제하면 모호함과 비용도 복제된다.</p>
          <p>분할이 유리한 경우는 세 가지다. 작업이 서로 독립적으로 병렬 실행될 수 있고, 각 결과에 독립적인 verifier가 있으며, worker가 필요한 최소 권한만 받아도 될 때다. 예를 들어 서로 다른 자료를 조사하는 작업은 병렬화하기 쉽다. 하나의 DB migration을 여러 agent가 동시에 수정하는 일은 공유 write state 때문에 조정 비용이 크다.</p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            ['분리 가능성', '입력과 산출물이 겹치지 않는가?', '겹치면 한 owner와 순차 handoff가 낫다.'],
            ['독립 검증', '각 worker 결과를 코드·원문·test로 확인할 수 있는가?', '검증할 수 없으면 합의가 정확성을 보장하지 않는다.'],
            ['권한 격리', 'worker마다 read/write 범위를 줄일 수 있는가?', '전체 권한 복제는 실패 반경을 키운다.'],
          ].map(([title, question, decision]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{question}</p>
              <p className="mt-2 text-xs leading-relaxed"><strong>판정:</strong> {decision}</p>
            </div>
          ))}
        </div>
        <Misconception>
          여러 agent의 다수결은 독립된 증거가 아니다. 같은 모델, prompt, context와 source를 공유하면 오류도 상관된다. 역할 분담의 이점은 이름이 다른 persona가 아니라 context·권한·산출물과 verifier가 실제로 분리될 때 생긴다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="hooks-skills"
        marker="05"
        tone="green"
        question="Loop가 결정한 행동을 다음 세 글의 계약으로 넘긴다"
        title="Context, protocol과 harness가 agent를 제품 시스템으로 만든다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Skill</strong>은 특정 task를 수행하는 지침·도구·자료의 재사용 단위다. 모든 skill 내용을 매 turn에 넣지 않고, 이름과 적용 조건만 먼저 보여 준 뒤 선택된 skill의 세부 contract를 로드한다. <strong>Hook</strong>은 모델이 선택하는 도구가 아니라 특정 lifecycle event에서 코드가 실행하는 제어점이다. Pre-tool hook은 인자를 검증하고, post-tool hook은 result를 기록하며, stop hook은 완료 증거를 확인할 수 있다.</p>
          <p>두 기능 모두 특정 제품의 명칭을 보편 표준으로 만들 필요는 없다. 핵심은 model-selected capability와 runtime-enforced event를 분리하는 것이다. 이 글은 loop까지만 소유한다. 다음 글들은 loop가 매 turn 사용할 context packet, tool 교환 protocol, state·retry·trace를 묶는 harness를 각각 소유한다.</p>
          <ol>
            <li><InternalLink slug="context-engineering">Context Engineering</InternalLink>: 현재 목표, state, 근거와 tool result를 다음 turn의 제한된 token packet으로 조립한다.</li>
            <li><InternalLink slug="mcp-protocol">MCP</InternalLink>: tool discovery, typed arguments, result와 오류를 host–server 경계에서 교환한다.</li>
            <li><InternalLink slug="llm-harness">Harness Engineering</InternalLink>: loop, policy, retry, checkpoint, trace와 eval을 실행 가능한 runtime으로 묶는다.</li>
          </ol>
        </div>
        <CapabilityCheck items={[
          '고정 prompt, workflow, agent loop와 long-running harness를 다음 행동의 소유자로 구분할 수 있다.',
          'ReAct를 공개 thought 형식이 아니라 state → proposal → observation → transition의 실행 계약으로 설명할 수 있다.',
          '완료, budget, 위험, 사람 이관을 포함한 종료 조건을 쓸 수 있다.',
          'Multi-agent가 유리한 조건을 분리 가능성, 독립 검증과 권한 격리로 판단할 수 있다.',
          'Skill의 점진적 로딩과 hook의 deterministic lifecycle gate를 구분할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Yao et al. · ReAct (ICLR 2023)', href: 'https://arxiv.org/abs/2210.03629', note: 'Reasoning trace와 task-specific action을 교차시키는 원 연구와 실험 범위.' },
          { label: 'Anthropic · Building effective agents (2024)', href: 'https://www.anthropic.com/engineering/building-effective-agents', note: 'Workflow와 agent의 구분, 단순한 구성에서 시작하는 현재 engineering 기준.' },
          { label: 'OpenAI · A practical guide to building agents', href: 'https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/', note: 'Agent loop, tool, orchestration, guardrail과 사람 이관의 제품 경계.' },
          { label: 'Anthropic · Trustworthy agents in practice (2026)', href: 'https://www.anthropic.com/research/trustworthy-agents', note: 'Self-directed loop와 human control, transparency, security의 현재 연구 관점.' },
        ]} />
      </NlpSection>
    </>
  );
}
