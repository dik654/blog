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
import { ContextPacketLab } from './agent-system-core/viz/AgentSystemLabs';

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

function ContextLane({
  index,
  owner,
  content,
  gate,
}: {
  index: string;
  owner: string;
  content: string;
  gate: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.25rem_8.5rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <strong className="text-sm">{owner}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        <p>{content}</p>
        <p className="mt-1.5 text-xs text-foreground"><strong>포함 gate:</strong> {gate}</p>
      </div>
    </div>
  );
}

export default function ContextEngineeringArticle() {
  return (
    <>
      <NlpSection
        id="overview"
        marker="01"
        tone="teal"
        question="Agent loop가 다음 행동을 정하기 직전의 입력 상태를 설계한다"
        title="Context는 대화 기록이 아니라 이번 판단에 필요한 증거 packet이다"
      >
        <BeginnerBridge title="출장 가방에는 집 안의 모든 물건을 넣지 않는다">
          어디로 가서 무엇을 할지에 맞춰 옷, 표와 신분증만 골라 넣는다. AI에게 주는 context도 같다. 저장해 둔 자료 전체가 아니라 <strong>이번 한 번의 판단에 필요한 지시, 현재 상태와 근거</strong>를 골라 담은 작업 가방이라고 생각하면 된다.
        </BeginnerBridge>
        <QuestionLead
          question="Context window가 100만 token이면 관련 문서와 과거 log를 전부 넣는 것이 가장 안전할까?"
          answer="아니다. 용량이 커져도 모델의 attention과 비용은 유한하고, 오래됐거나 권한이 다른 정보가 함께 들어오면 판단 근거가 오염된다. 매 turn마다 목표, 현재 state, 허용 도구, 최신 관찰과 필요한 근거를 선별하고, 제외·압축한 정보의 원본 좌표를 남겨야 한다."
        />
        <ConceptPrimer items={[
          { term: 'Context window', meaning: '한 model call에서 입력과 생성이 함께 사용하는 token 용량이다.', why: '저장소 전체가 아니라 이번 호출의 물리적 상한을 뜻한다.' },
          { term: 'Context packet', meaning: '다음 판단을 위해 실제로 선택된 instruction, state, evidence와 tool result다.', why: '가능한 정보 전체와 모델이 지금 읽는 정보를 분리한다.' },
          { term: 'State', meaning: '완료된 작업, 남은 작업, resource ID와 검증 결과처럼 turn 밖에도 보존할 구조화 상태다.', why: '자연어 대화만으로 진행을 복원하지 않게 한다.' },
          { term: 'Lineage', meaning: '각 정보가 어느 source와 version에서 왔고 어떤 변환을 거쳤는지의 계보다.', why: '요약 뒤에도 authority, freshness와 citation을 잃지 않는다.' },
        ]} />
        <ContextPacketLab />
        <Misconception>
          긴 context는 memory database가 아니다. Window 안의 token은 한 호출 뒤 자동으로 영구 보존되지 않고, 많이 넣었다고 모든 위치가 같은 정확도로 사용되는 것도 아니다. 저장, 검색, 선별과 호출 packet 조립은 서로 다른 단계다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="system-prompt"
        marker="02"
        tone="blue"
        question="Instruction, task state와 외부 content의 authority를 섞지 않는다"
        title="System prompt는 전체 context의 한 층이며 보안 경계는 아니다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>System instruction은 역할 소개문보다 실행 계약에 가깝다. 사용자가 무엇을 원하는지, 어떤 resource와 tool을 사용할 수 있는지, 어떤 형식과 invariant를 지켜야 하는지, 언제 질문하거나 멈출지를 적는다. 반면 tool result, 이메일, 웹페이지와 검색 문서는 판단할 <strong>데이터</strong>이지 목표와 권한을 바꿀 instruction이 아니다.</p>
          <p>좋은 packet은 정보의 owner를 보존한다. 정책은 policy service의 versioned record에서, task 상태는 state store에서, tool schema는 registry에서, 사용자 승인은 approval record에서 가져온다. XML이나 message role은 모델이 층을 구분하도록 돕지만 공격자가 조작할 수 없는 authorization을 만들지는 않는다.</p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ContextLane index="01" owner="Instruction" content="목표, 금지 조건, 출력 contract와 중단 조건" gate="현재 task와 제품 정책에 항상 적용되는가?" />
          <ContextLane index="02" owner="Task state" content="완료 artifact, 남은 step, resource와 checkpoint ID" gate="외부 store의 현재 revision과 일치하는가?" />
          <ContextLane index="03" owner="Tool contract" content="이번 turn에 허용된 tool 이름, schema와 capability" gate="사용자·task·만료 범위가 현재 grant 안인가?" />
          <ContextLane index="04" owner="Evidence" content="원문 span, source 좌표, 날짜와 retrieval score" gate="현재 질문을 판정하는 데 직접 필요한가?" />
          <ContextLane index="05" owner="Observation" content="직전 tool result, error type와 state diff" gate="성공·실패 envelope와 provenance가 보존됐는가?" />
        </div>
        <Takeaway>
          System prompt는 모델 행동을 유도한다. 권한, side effect와 resource 접근은 다음의 MCP schema와 harness policy가 코드로 다시 검사해야 한다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="rag"
        marker="03"
        tone="violet"
        question="검색 결과를 많이 넣는 대신 현재 주장을 입증할 evidence set을 만든다"
        title="RAG는 recall 뒤에 근거 조립과 출처 보존이 남는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Agent context에서 retrieval의 목적은 비슷한 문장을 모으는 것이 아니라 다음 행동을 정당화할 근거를 찾는 것이다. 질문을 검색 단위로 바꾸고, lexical·dense retrieval로 후보를 모은 뒤, 날짜·제품·권한·source type을 확인하고 rerank한다. 최종 packet에는 원문 일부뿐 아니라 source ID, section, timestamp와 선택 이유가 함께 들어간다.</p>
          <p>Chunk 크기에 보편적인 정답은 없다. API contract는 함수·parameter 경계를 지켜야 하고, 논문 수식은 정의와 가정을 함께 가져와야 하며, 사건 기록은 시간 순서를 보존해야 한다. 따라서 chunking은 글자 수보다 downstream claim을 독립적으로 검증할 수 있는 단위에 맞춘다.</p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['Recall', '필요한 근거가 후보 안에 들어왔는가?', 'Query 변형, lexical+dense와 metadata filter를 진단한다.'],
            ['Selection', '후보가 현재 질문·제품·날짜와 맞는가?', 'Reranker와 source scope를 검사한다.'],
            ['Packaging', '서로 보완하는 최소 evidence set인가?', '중복을 제거하고 반례·제약을 함께 넣는다.'],
            ['Attribution', '최종 claim을 원문 좌표로 되짚을 수 있는가?', 'Citation과 transform lineage를 packet 밖 metadata에도 남긴다.'],
          ].map(([title, question, action]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{question}</p>
              <p className="mt-2 text-xs leading-relaxed"><strong>실패 시:</strong> {action}</p>
            </div>
          ))}
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          검색 자체의 index·reranking·citation 설계가 필요하면 <InternalLink slug="rag-pipeline">RAG Pipeline</InternalLink>으로 내려간다. 이 글은 retrieval 결과를 agent의 다음 turn에 어떤 계약으로 넣을지만 소유한다.
        </p>
      </NlpSection>

      <NlpSection
        id="memory"
        marker="04"
        tone="amber"
        question="대화가 길다는 이유로 모든 것을 memory에 승격하지 않는다"
        title="Memory는 읽기보다 쓰기 gate와 무효화 규칙이 먼저다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Memory는 모델의 숨은 기억이 아니라 외부 저장과 재조회 정책이다. Working state는 지금 task에서 곧 필요한 사실, episodic record는 특정 실행과 결과, semantic memory는 검증된 장기 사실, procedural memory는 재사용할 절차다. 네 종류는 lifetime과 authority가 다르므로 하나의 vector store에 같은 label로 섞지 않는다.</p>
          <p>쓰기 전에 source, 사실성, 민감도, 만료와 충돌 해결 owner를 확인한다. 모델이 한 번 추론한 “사용자는 admin이다” 같은 문장은 장기 사실로 바로 저장할 수 없다. 읽을 때도 query similarity만 보지 않고 user·task scope, source authority, freshness와 현재 policy version을 함께 검사한다.</p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ContextLane index="01" owner="Working" content="이번 task의 변수, TODO와 임시 artifact" gate="task 종료 뒤 폐기하거나 명시적으로 인계한다." />
          <ContextLane index="02" owner="Episodic" content="누가 언제 어떤 행동을 했고 결과가 무엇이었는지" gate="trace ID와 environment version으로 재현할 수 있다." />
          <ContextLane index="03" owner="Semantic" content="검증된 사용자 선호, 정책과 도메인 사실" gate="authority source, 유효 기간과 수정 owner가 있다." />
          <ContextLane index="04" owner="Procedural" content="검증된 실행 순서, skill과 실패 복구 절차" gate="적용 조건, version과 regression evidence가 있다." />
        </div>
        <Misconception>
          요약은 원문을 대체하는 진실 저장소가 아니다. 요약은 token을 줄이는 파생 artifact이므로 source pointer와 누락 가능성을 보존하고, 결정적인 정책·수치·승인은 원 authoritative record에서 다시 읽어야 한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="optimization"
        marker="05"
        tone="green"
        question="Token 절약이 아니라 판단 효용과 생성 여유를 함께 최적화한다"
        title="Admission, compaction과 cache를 서로 다른 문제로 다룬다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Context admission은 model call 전에 일어난다. 각 source의 token 수를 세고, 생성과 tool call에 남길 reserve를 뺀 뒤 packet이 들어오는지 검사한다. 넘치면 낮은 효용의 source를 제외하고, 긴 관찰은 구조화 state와 source pointer로 압축한다. 단순히 앞부분을 잘라내면 현재 목표나 오류 원인을 잃을 수 있다.</p>
          <p>Prompt cache는 반복 prefix의 계산 비용을 줄일 수 있지만 어떤 정보가 필요한지 판단해 주지 않는다. Cache hit가 높아도 오래된 policy가 고정 prefix에 남으면 정확성은 악화될 수 있다. Context quality, token admission과 provider별 cache 동작을 따로 측정한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{N_t}_{\text{선택한 token 합}}&=\underbrace{\sum_{i\in S_t}n_i}_{\text{항목별 token을 더함}}\\[0.45em]\underbrace{N_t}_{\text{이번 입력 크기}}&\le\underbrace{C}_{\text{context 상한}}-\underbrace{R_{\mathrm{out}}}_{\text{응답 생성 여유}}-\underbrace{R_{\mathrm{sys}}}_{\text{runtime 여유}}\end{aligned}`}
          meaning="선택한 source token의 합이 모델 상한보다 작다는 것만으로는 부족하다. 답변과 tool argument를 생성할 여유, provider·tokenizer 차이와 예외를 감당할 안전 여유를 먼저 뺀다. 부등식을 넘으면 모델 호출 뒤 잘리기를 기다리지 않고 admission 단계에서 제외·압축한다."
          symbols={[
            [String.raw`S_t`, 'turn t에서 실제로 선택한 instruction, state, evidence와 observation 집합'],
            [String.raw`n_i`, '선택 항목 i의 tokenizer 기준 token 수'],
            [String.raw`N_t`, 'turn t에 선택한 모든 항목의 token 수를 더한 실제 입력 크기'],
            [String.raw`C`, '사용하는 model·endpoint의 context token 상한'],
            [String.raw`R_{\mathrm{out}}`, '최종 답변, reasoning과 tool call을 생성하도록 남긴 budget'],
            [String.raw`R_{\mathrm{sys}}`, 'tokenizer 차이, wrapper와 예외를 위한 안전 reserve'],
            [String.raw`\le`, 'packet이 호출 전에 만족해야 하는 admission 조건'],
          ]}
        />
        <StopRule>
          더 긴 문서를 넣기 전에 현재 실패가 evidence 누락, stale state, 잘못된 authority, retrieval miss 또는 단순 token overflow 중 무엇인지 trace로 구분한다. 필요한 claim과 다음 행동을 검증할 최소 packet이 만들어지면 context를 더 늘리지 않는다.
        </StopRule>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>다음 글인 <InternalLink slug="mcp-protocol">MCP</InternalLink>에서는 이 packet 안의 tool contract와 observation이 host–server 경계를 어떻게 왕복하는지 본다. Context engineering은 어떤 정보를 모델이 읽을지 정하지만 transport, capability negotiation과 tool execution error를 정의하지는 않는다.</p>
        </div>
        <CapabilityCheck items={[
          '가능한 정보 전체와 한 turn의 context packet을 구분할 수 있다.',
          'Instruction, task state, tool contract, evidence와 observation의 owner를 분리할 수 있다.',
          'RAG 결과를 source 좌표와 선택 이유가 있는 evidence set으로 조립할 수 있다.',
          'Working, episodic, semantic, procedural memory의 write·read·expiry gate를 설계할 수 있다.',
          '생성 reserve와 안전 여유를 포함한 context admission 부등식을 계산할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Anthropic · Effective context engineering for AI agents (2025)', href: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents', note: 'Agent loop에서 유한한 context를 high-signal token으로 선별·유지하는 현재 engineering 기준.' },
          { label: 'Liu et al. · Lost in the Middle (TACL 2024)', href: 'https://aclanthology.org/2024.tacl-1.9/', note: '긴 input에서 관련 정보 위치에 따른 성능 변화를 측정한 실험과 범위.' },
          { label: 'Anthropic · Contextual Retrieval (2024)', href: 'https://www.anthropic.com/news/contextual-retrieval', note: 'Chunk에 문서 맥락을 보존해 lexical·embedding retrieval을 개선하는 회사 연구 사례.' },
        ]} />
      </NlpSection>
    </>
  );
}
