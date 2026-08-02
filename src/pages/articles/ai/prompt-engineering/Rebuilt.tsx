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
import { NlpSection, Takeaway } from '../nlp-shared';
import { PromptContractLab } from './viz/PromptContractLab';

const learningPathId = 'ai-agent-instruction-contract';

function ContractRow({
  index,
  owner,
  question,
  artifact,
}: {
  index: string;
  owner: string;
  question: string;
  artifact: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.5rem_9rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <strong className="text-sm">{owner}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        <p>{question}</p>
        <p className="mt-1.5 text-xs text-foreground"><strong>남는 것:</strong> {artifact}</p>
      </div>
    </div>
  );
}

export default function PromptEngineeringRebuilt() {
  return (
    <>
      <NlpSection
        id="contract"
        marker="01"
        tone="teal"
        question="마법의 문구보다 성공을 판정할 계약을 먼저 쓴다"
        title="프롬프트는 모델에게 건네는 시험 가능한 요청 계약이다"
      >
        <BeginnerBridge title="사람에게 일을 맡길 때도 ‘잘해 줘’만으로는 부족하다">
          지난달 청구서를 처리해 달라고 부탁하려면 어느 폴더를 보고, 합계가 맞는지 어떻게 검사하며, 고객에게 보내기 전에는 누구에게 확인받을지 알려 줘야 한다. Prompt는 멋진 문구가 아니라 <strong>이번 작업의 목표, 경계와 완료 조건을 모델에게 건네는 작업 지시서</strong>다.
        </BeginnerBridge>
        <QuestionLead
          question="“지난달 청구서를 정확히 처리해 줘”라고 자세하고 공손하게 쓰면 프로덕션 프롬프트가 완성될까?"
          answer="아니다. 어떤 문서를 읽는지, 처리의 끝이 어디인지, 어떤 오류를 막아야 하는지, 외부 전송 전에 누가 승인하는지, 성공을 무엇으로 증명할지가 빠져 있다. 좋은 프롬프트는 문장이 긴 프롬프트가 아니라 실행 뒤 성공과 실패를 판정할 수 있는 프롬프트다."
        />
        <ConceptPrimer items={[
          { term: 'Prompt', meaning: '한 번의 model call에 들어가는 지시, 작업 자료, 예시와 출력 요구다.', why: '모델이 지금 어떤 문제를 풀지 정하지만 실제 시스템 권한까지 만들지는 않는다.' },
          { term: 'Success criterion', meaning: '필수 필드가 채워졌는지, 계산이 맞는지처럼 관찰 가능한 완료 조건이다.', why: '“좋은 답”을 회귀 테스트할 수 있는 판정으로 바꾼다.' },
          { term: 'Authority', meaning: '어떤 source가 목표·정책·승인을 정할 자격이 있는지의 순서다.', why: 'PDF나 웹페이지 속 문장이 애플리케이션 지시를 덮어쓰지 못하게 한다.' },
          { term: 'Evidence', meaning: '원문 좌표, 검산 결과, approval ID와 effect receipt처럼 결론을 되짚을 기록이다.', why: '그럴듯한 응답과 검증된 완료를 구분한다.' },
        ]} />
        <PromptContractLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            프롬프트 엔지니어링은 모델의 성격을 주문하는 기술이 아니다. 작업 목표, 입력 경계, 성공 조건,
            허용 행동, 출력과 증거를 <strong>모델이 해석할 수 있는 요청</strong>으로 번역하고, 고정된
            사례에서 그 요청이 실제로 작동하는지 측정하는 과정이다. 모델은 확률적으로 생성하므로
            계약을 잘 썼다고 결정성이 생기지는 않는다. 대신 실패했을 때 무엇을 고칠지 알 수 있다.
          </p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ContractRow index="01" owner="목표" question="이번 호출 뒤 무엇이 달라져야 하는가?" artifact="한 문장으로 쓴 task outcome" />
          <ContractRow index="02" owner="성공 조건" question="어떤 필드·검산·중단 상태를 관찰하면 완료인가?" artifact="acceptance checklist" />
          <ContractRow index="03" owner="입력 경계" question="무엇이 지시이고 무엇이 신뢰하지 않는 자료인가?" artifact="source와 trust label" />
          <ContractRow index="04" owner="행동 경계" question="읽기, 쓰기, 전송 중 무엇을 제안하고 무엇은 승인받는가?" artifact="allowed action과 approval rule" />
          <ContractRow index="05" owner="출력·증거" question="후속 코드가 무엇을 파싱하고 어떤 근거로 검증하는가?" artifact="schema, citation과 effect evidence" />
        </div>
        <Misconception>
          “500 token보다 짧아야 한다” 같은 보편 길이 규칙은 없다. 필요한 계약은 한 번씩 명확히 쓰고,
          서로 충돌하거나 반복되는 지시는 줄인다. 길이의 정답은 모델·도구·작업별 held-out 평가에서
          비용과 성공률을 함께 비교해 정한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="reasoning"
        marker="02"
        tone="blue"
        question="생각을 길게 출력시키는 것과 문제를 잘 푸는 것을 구분한다"
        title="추론 품질은 비공개 생각의 길이가 아니라 검증 가능한 결과로 본다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            2020년 GPT-3의 in-context learning은 가중치를 다시 학습하지 않고도 입력 안의 설명과 예시로
            새 작업을 수행할 수 있음을 크게 보여 주었다. 2022년의 Chain-of-Thought prompting 연구는
            일부 큰 언어 모델의 수학·상식 문제에서 중간 추론 예시가 도움이 될 수 있음을 보였고,
            zero-shot 연구는 “단계적으로 생각하라”는 짧은 지시도 특정 benchmark에서 효과가 있음을 보였다.
            이것은 중요한 역사적 기준점이지만 모든 모델에 같은 문구와 같은 향상 폭이 적용된다는 법칙은 아니다.
          </p>
          <p>
            현재 reasoning model은 학습과 추론 시점의 compute 배분을 내부적으로 처리할 수 있다.
            이때 사용자가 손으로 긴 사고 경로를 지정하면 모델이 더 나은 경로를 찾는 대신 그 경로를
            흉내 내는 데 묶일 수 있다. 먼저 문제, 제약, 성공 조건과 사용할 증거를 분명히 주고,
            제품이 검증할 수 있는 <strong>결론·근거·검산·불확실성</strong>을 요청한다. 원시 내부
            chain-of-thought의 공개 여부와 신뢰성은 모델과 제품 표면마다 다르며, 공개된 긴 설명이 실제
            내부 계산을 충실하게 재현한다고 가정해서도 안 된다.
          </p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            ['문제 계약', '목표, 입력, 제약과 완료 조건을 준다.', '모델이 풀 문제를 고정한다.'],
            ['추론 자원', '지원되는 reasoning effort나 모델 설정을 실험한다.', '더 많은 compute가 항상 더 낫다고 가정하지 않는다.'],
            ['공개 증거', '짧은 근거, 인용, 계산 결과와 검산 상태를 받는다.', '내부 생각 대신 외부에서 검사할 artifact를 남긴다.'],
          ].map(([title, body, note]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <p className="mt-2 text-xs leading-relaxed"><strong>판정:</strong> {note}</p>
            </div>
          ))}
        </div>
        <Takeaway>
          “생각을 모두 보여 줘”보다 “결론마다 근거 source를 붙이고, 합계를 다시 계산하고, 확신할 수 없으면
          어떤 값이 부족한지 표시하라”가 프로덕션 검증에 더 직접적이다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="structured-output"
        marker="03"
        tone="violet"
        question="읽기 쉬운 경계, parse 가능한 모양, 올바른 의미와 실행 권한을 나눈다"
        title="XML, Schema, Validator와 Policy는 서로 다른 실패를 막는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            긴 입력에서 <code>&lt;task&gt;</code>, <code>&lt;documents&gt;</code>,
            <code>&lt;examples&gt;</code>처럼 이름을 붙이면 사람과 모델이 의미 구역을 찾기 쉬워진다.
            이것이 <InternalLink slug="xml-prompting" learningPathId={learningPathId}>XML 프롬프팅</InternalLink>의
            역할이다. 하지만 태그는 표시일 뿐 authorization도, 타입 검사도 아니다.
          </p>
          <p>
            기계가 출력을 소비한다면 JSON Schema 같은 constrained structured output으로 필드 이름,
            타입, enum과 필수 여부를 고정한다. 그래도 <code>total: 120000</code>이 원문과 맞는지,
            vendor ID가 실제 거래처인지, 같은 invoice가 이미 처리됐는지는 schema가 모른다.
            원문 대조와 계산은 semantic validator가 맡고, 외부 전송 가능 여부는 policy와 approval이 맡는다.
            마지막으로 executor는 허용된 action만 실제 시스템에 적용하고 결과와 effect receipt를 기록한다.
          </p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ContractRow index="01" owner="Delimiter" question="지시·자료·예시의 의미 구역이 눈에 보이는가?" artifact="XML 또는 Markdown boundary" />
          <ContractRow index="02" owner="Schema" question="응답이 필수 필드와 타입을 지키며 parse되는가?" artifact="typed object 또는 명시적 refusal" />
          <ContractRow index="03" owner="Validator" question="필드 값이 원문, 계산과 업무 invariant에 맞는가?" artifact="field별 validation report" />
          <ContractRow index="04" owner="Policy" question="이 사용자·대상·금액에 이 action이 허용되는가?" artifact="allow·deny·approval-needed 결정" />
          <ContractRow index="05" owner="Executor" question="외부 상태가 실제로 한 번 바뀌었는가?" artifact="effect receipt와 idempotency key" />
        </div>
        <Misconception>
          Schema를 통과한 JSON은 “구조적으로 유효하다”는 뜻이지 “사실이고 안전하다”는 뜻이 아니다.
          Refusal, 잘린 출력과 provider 오류도 정상 object와 별도 상태로 처리해야 한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="few-shot"
        marker="04"
        tone="amber"
        question="예시 개수를 외우지 않고 모호한 결정을 드러내는 사례를 고른다"
        title="Few-shot은 규칙을 대신하는 샘플이 아니라 판정 경계를 보여 주는 자료다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Few-shot example은 자연어 규칙만으로 전달하기 어려운 mapping, 문체, label 경계와 예외를
            실제 입력·출력 쌍으로 보여 준다. 예를 들어 세금이 line item에 포함된 문서, 통화가 누락된
            문서, credit note와 중복 invoice는 “정상 청구서” 하나보다 판정 경계를 더 잘 가르친다.
          </p>
          <p>
            몇 개가 필요한지는 작업, 모델, 예시 길이와 context budget에 따라 달라진다. 먼저 zero-shot
            기준선을 측정하고, 반복되는 실패 유형을 대표하는 예시를 하나씩 추가한다. 정상 사례만 복제하지
            말고 서로 다른 형식과 edge case를 포함한다. 예시 순서를 바꿔도 결과가 유지되는지, 예시에 없는
            발행사와 layout의 held-out 문서에서도 통하는지를 확인한다.
          </p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['대표성', '실제 배포 입력에서 자주 만나는 서로 다른 형식을 담는다.'],
            ['경계성', '승인 필요/불필요, invoice/credit note처럼 헷갈리는 양쪽 사례를 둔다.'],
            ['일관성', '설명과 출력 schema가 서로 모순되지 않게 같은 annotation 원칙을 쓴다.'],
            ['독립 평가', '예시에 쓰지 않은 문서와 순서 변형으로 암기·위치 민감성을 검사한다.'],
          ].map(([title, body]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <StopRule>
          새 예시가 새로운 실패 유형을 줄이지 않고 token과 지연만 늘리면 더 넣지 않는다. 예시가 계속
          늘어나야만 작동한다면 작업을 분리하거나 retrieval로 현재 입력과 가까운 검증된 예시를 고르는
          편이 맞는지 평가한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="failure-ownership"
        marker="05"
        tone="green"
        question="실패를 모두 프롬프트 탓으로 돌리지 않고 올바른 계층을 고친다"
        title="회귀 집합과 Failure owner가 프롬프트를 시스템으로 만든다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            프롬프트 변경은 코드 변경처럼 고정된 평가 집합에서 비교한다. 정상 문서뿐 아니라 필드 누락,
            서로 모순되는 합계, 문서 안의 지시문, 승인 거부, tool timeout과 이미 반영된 외부 effect를
            넣는다. 각 사례에서 parse 성공, semantic correctness, policy violation, 실제 end state와
            비용·지연을 따로 기록한다. 하나의 평균 점수로 합치면 안전 실패가 문체 개선에 가려질 수 있다.
          </p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ContractRow index="01" owner="Prompt" question="목표·제약·완료 조건을 잘못 이해했는가?" artifact="prompt version별 task success" />
          <ContractRow index="02" owner="Context" question="필요한 최신 원문이나 state가 packet에 없었는가?" artifact="retrieval·freshness·source trace" />
          <ContractRow index="03" owner="Model·Schema" question="충분한 정보가 있는데 추론 또는 출력 구조가 실패했는가?" artifact="model·effort·schema별 paired result" />
          <ContractRow index="04" owner="Tool·Policy" question="허용하지 않은 capability가 노출되거나 action이 승인됐는가?" artifact="tool visibility와 policy decision" />
          <ContractRow index="05" owner="Harness" question="timeout 뒤 effect를 확인하지 않고 중복 실행했는가?" artifact="checkpoint, idempotency와 effect receipt" />
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          문서와 tool result를 다음 turn의 판단 packet으로 조립하는 문제는
          {' '}<InternalLink slug="context-engineering">Context Engineering</InternalLink>에서,
          신뢰하지 않는 문자열이 privileged action으로 흐르는 문제는
          {' '}<InternalLink slug="prompt-injection-defense">Prompt Injection 방어</InternalLink>에서,
          timeout·retry·checkpoint의 실행 소유권은
          {' '}<InternalLink slug="llm-harness">LLM Harness</InternalLink>에서 이어서 다룬다.
        </p>
        <CapabilityCheck items={[
          '모호한 요청을 목표·성공 조건·입력 경계·행동 경계·증거로 분해할 수 있다.',
          '공개 근거와 검산을 요청하면서 비공개 raw chain-of-thought를 성공 조건으로 삼지 않을 수 있다.',
          'XML delimiter, JSON Schema, semantic validator와 policy가 막는 실패를 구분할 수 있다.',
          '보편 shot 수를 외우지 않고 edge case와 held-out 평가로 예시를 선택할 수 있다.',
          '문서 인젝션과 ambiguous timeout이 함께 있는 작업에서 failure owner를 올바르게 배정할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'OpenAI · 최신 모델 사용 가이드', href: 'https://developers.openai.com/api/docs/guides/latest-model', note: '목표·제약·성공 기준·도구 경계와 대표 task 기반 eval을 현재 모델에 맞추는 공식 지침.' },
          { label: 'Anthropic · Prompt engineering overview', href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview', note: '프롬프트 수정 전에 성공 기준과 경험적 평가를 먼저 정의하는 공식 입문.' },
          { label: 'Anthropic · Prompting best practices', href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices', note: '명확한 지시, 예시, XML 구역과 현재 reasoning model별 유의점을 다루는 공식 문서.' },
          { label: 'OpenAI · Structured Outputs', href: 'https://openai.com/index/introducing-structured-outputs-in-the-api/', note: 'JSON Schema 제약의 범위와 여전히 남는 value 오류·refusal·truncation 처리.' },
          { label: 'Anthropic · Structured outputs', href: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs', note: 'Schema-constrained output과 semantic validation을 구분하는 공식 문서.' },
          { label: 'Brown et al. · Language Models are Few-Shot Learners (2020)', href: 'https://arxiv.org/abs/2005.14165', note: 'In-context learning의 현대적 기준점을 제공한 GPT-3 원문.' },
          { label: 'Wei et al. · Chain-of-Thought Prompting (2022)', href: 'https://arxiv.org/abs/2201.11903', note: '일부 큰 모델·benchmark에서 중간 추론 예시의 효과를 측정한 역사적 원문.' },
          { label: 'Kojima et al. · Large Language Models are Zero-Shot Reasoners (2022)', href: 'https://arxiv.org/abs/2205.11916', note: 'Zero-shot reasoning cue의 효과와 실험 범위를 확인할 원문.' },
        ]} />
      </NlpSection>
    </>
  );
}
