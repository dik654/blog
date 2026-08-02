import FormulaNote from '@/components/ui/formula-note';
import MathFormula from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  ReActEvidenceLab,
  ReActFailureLab,
  ReActTransitionLab,
  WikipediaActionTrace,
} from './paper-react-2022/viz/ReActSourceLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <MathFormula display className="my-0 text-[13px] sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function PaperReact2022Article() {
  return (
    <>
      <section id="action-space" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ReAct의 핵심은 생각을 길게 쓰는 것이 아니라 action space를 둘로 나누는 데 있다</h2>
        <QuestionLead
          question="모델이 “검색해야겠다”라고 쓴 순간, 외부 세계에서도 검색이 일어난 것일까?"
          answer="아니다. ReAct에서 language thought는 다음 token 생성에 보일 context만 바꾼다. Search, lookup, finish 같은 environment action만 외부 상태를 바꾸고 observation을 돌려준다. 두 종류를 같은 trajectory 안에서 번갈아 선택하는 것이 논문의 핵심이다."
        />
        <ConceptPrimer items={[
          { term: 'Policy π', meaning: '지금까지의 context를 보고 다음 action의 확률을 만드는 규칙이다.', why: 'ReAct를 문장 양식이 아니라 순차 의사결정 문제로 읽는다.' },
          { term: 'Language action L', meaning: '분해, 상식, 다음 검색 계획처럼 context에만 추가되는 thought다.', why: 'Environment를 건드리지 않고 다음 action을 준비한다.' },
          { term: 'Environment action A', meaning: 'Search API나 simulator command처럼 실제 observation을 만드는 호출이다.', why: '모델 내부 지식과 외부 근거·상태 변화를 구분한다.' },
          { term: 'Observation o', meaning: 'Environment가 action 뒤에 반환한 page 문장이나 새 world state다.', why: '다음 판단을 실제 실행 결과에 조건화한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            시간 t의 context는 지금까지 본 observation과 선택한 action의 history다. 논문은 기존 environment action 집합 <strong>A</strong>에
            언어 공간 <strong>L</strong>을 합쳐 확장된 action space를 만든다. 같은 policy가 thought를 고르면 context만 길어지고,
            tool action을 고르면 environment가 실행된 뒤 새 observation이 context 끝에 붙는다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
c_t&=(o_1,a_1,o_2,a_2,\ldots,o_t)\\
\widehat{\mathcal A}&=\mathcal A\cup\mathcal L\\
a_t&\sim\pi(\,\cdot\mid c_t)
\end{aligned}`}
          meaning="History를 context로 이어야 이전 tool result가 다음 action 선택에 영향을 준다. Environment action A와 language action L의 합집합은 한 policy가 외부 실행과 내부 계획을 같은 다음-token interface에서 고르게 한다. Sampled action이 thought면 context만 갱신되고, tool action이면 observation이 돌아온 뒤 context가 갱신된다."
          symbols={[
            [String.raw`c_t`, 't번째 선택 직전에 model이 보는 observation/action history'],
            [String.raw`\mathcal A`, 'Environment를 바꾸거나 조회하는 task-specific action 집합'],
            [String.raw`\mathcal L`, 'Context에 reasoning trace를 추가하는 language action 집합'],
            [String.raw`\widehat{\mathcal A}`, 'Policy가 고를 수 있도록 두 종류를 합친 확장 action space'],
            [String.raw`\pi(\cdot\mid c_t)`, '현재 context에서 다음 thought 또는 action에 주는 확률분포'],
          ]}
        />
        <ReActTransitionLab />
        <Misconception>
          이 논문의 공개 thought 형식을 오늘날 model의 비공개 reasoning trace와 동일시하면 안 된다. ReAct가 필요로 하는 실행 계약은
          context에 남길 짧은 reasoning action과 environment action의 구분이다. 숨은 chain-of-thought를 사용자에게 전부 노출해야 한다는 주장이 아니다.
        </Misconception>
      </section>

      <section id="wikipedia-actions" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">HotpotQA와 FEVER에서는 세 개의 Wikipedia action만 허용했다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            QA 실험의 environment는 일반 browser가 아니다. <code>search[entity]</code>는 Wikipedia 검색 결과의 첫 page에서 앞 다섯 문장을 돌려준다.
            <code>lookup[string]</code>은 현재 page에서 해당 문자열이 포함된 다음 문장을 순서대로 돌려준다.
            <code>finish[answer]</code>는 answer를 제출하고 episode를 끝낸다. 그래서 결과는 이 제한된 API와 prompt 안에서 해석해야 한다.
          </p>
          <p>
            HotpotQA prompt에는 사람이 쓴 trajectory 6개, FEVER에는 3개를 few-shot demonstration으로 넣었다. Interaction step은 각각
            최대 7회와 5회로 잘랐다. 정답 trajectory 가운데 상한까지 정확히 7 step을 쓴 HotpotQA 사례는 0.84%, 5 step을 쓴 FEVER 사례는
            1.33%였다. Step cap은 단순 UI 제한이 아니라 반복 search가 비용을 무한히 쓰지 못하게 하고, 답이 없으면 hybrid fallback으로 넘기는 termination contract다.
          </p>
        </div>
        <WikipediaActionTrace />
        <Misconception>
          <code>lookup</code>은 전체 web 검색이나 vector retrieval이 아니다. 이미 연 page 안에서 다음 matching sentence를 가져오는 좁은 action이다.
          현대 browser agent의 DOM, click, form submit과 permission 문제는 이 실험에 포함되지 않았다.
        </Misconception>
      </section>

      <section id="qa-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ReAct 단독이 언제나 CoT보다 높았던 것은 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Table 1의 핵심은 한 method의 전승이 아니다. HotpotQA에서 ReAct 단독 EM은 27.4로 CoT-SC의 33.4보다 낮았다.
            FEVER에서는 ReAct 60.9가 CoT-SC 60.4를 조금 넘었다. 가장 높은 prompting 결과는 HotpotQA의 ReAct→CoT-SC 35.1과
            FEVER의 CoT-SC→ReAct 64.6처럼 fallback을 붙였을 때 나왔다.
          </p>
          <p>
            왜 차이가 났는지는 저자들이 <strong>HotpotQA에서만</strong> 성공·실패 trajectory를 각각 50개씩 수작업 분류한 Table 2에서 더 좁게
            확인할 수 있다. CoT는 내부 기억으로만 답하다 사실을 만들어낼 수 있고, ReAct는 외부 근거를 보면서 hallucination을 낮추지만 잘못
            추론하거나 정보가 없는 query를 반복할 수 있었다. 평균 score만 보면 이 교환을 놓친다. 이 오류 분포를 FEVER에도 그대로 일반화할
            근거는 논문에 없다.
          </p>
        </div>
        <ReActEvidenceLab defaultTask="hotpot" />
        <ReActFailureLab />
        <Misconception>
          “도구를 쓰면 hallucination이 0”이라는 결론이 아니다. Table 2는 HotpotQA의 작은 trajectory 표본만 수동 분류한 분석이다.
          그 표본의 ReAct 실패에서는 hallucination이 관측되지 않았지만, 성공 trajectory에도 6%의 hallucination label이 있었다.
        </Misconception>
      </section>

      <section id="finetuning-decisions" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Prompt trajectory는 finetuning data가 되고, QA 밖에서는 실제 action policy가 된다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            저자들은 ReAct prompting으로 만든 trajectory 중 정답인 것을 bootstrap해 약 3,000개의 finetuning 예를 만들었다.
            Finetuned PaLM-8B ReAct는 모든 62B prompting baseline을 넘었고, finetuned 62B ReAct는 모든 540B prompting baseline을 넘었다.
            이 결과는 “parameter 수가 필요 없다”가 아니라, task 형식에 맞는 action/observation trajectory supervision이 scale만 키운 prompting과 다른 신호임을 보인다.
          </p>
          <p>
            ALFWorld에서는 text world의 household task를 수행하고 WebShop에서는 상품을 탐색해 조건에 맞는 item을 고른다. Thought는 매 step 필수가 아니라
            subgoal을 세우거나 예외를 처리할 때 sparse하게 나타났다. ALFWorld best-of-six ReAct success는 71%, action-only는 45%였다.
            WebShop ReAct는 task score 66.6, exact success 40.0%로 model baseline 중 가장 높았지만 human의 82.1/59.6에는 미치지 못했다.
          </p>
        </div>
        <ReActEvidenceLab defaultTask="alfworld" />
        <Misconception>
          ALFWorld의 71%는 여섯 prompt/run 중 best 결과이고 WebShop의 66.6은 partial task score다. 서로 다른 environment, selection 방식과 metric을
          한 “ReAct 성능” 숫자로 평균 내면 논문보다 강한 결론이 된다.
        </Misconception>
      </section>

      <section id="limits-handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원 논문은 pattern을 증명했고 production runtime은 남겨 두었다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            논문은 action space가 크고 task가 복잡해질수록 prompt에 더 많은 demonstrations가 필요하지만 context capacity가 제한된다고 적었다.
            Finetuning도 더 많은 사람이 쓴 data가 필요했고, ReAct와 reinforcement learning의 결합은 future work로 남겼다.
            QA environment에는 Wikipedia 수정 action이 없고 WebShop에는 실제 구매 commit이 없었다.
          </p>
          <p>
            따라서 현재 agent에 ReAct를 옮길 때는 세 층이 추가된다. <InternalLink slug="agentic-patterns">Agentic Patterns</InternalLink>는
            workflow와 open-ended loop, termination과 위험 gate를 정한다. <InternalLink slug="context-engineering">Context Engineering</InternalLink>은
            observation과 source lineage를 다음 turn packet으로 만든다. <InternalLink slug="llm-harness">LLM Harness</InternalLink>는
            retry, durable state, permission, checkpoint와 trace를 runtime으로 묶는다.
          </p>
        </div>
        <StopRule>
          Language action과 environment action, 세 Wikipedia API, task별 evidence와 failure boundary를 설명할 수 있으면 ReAct 원문 바닥은 끝이다.
          실제 side effect가 있는 agent는 논문을 더 과거로 내려가지 말고 agent loop·context·harness 경로로 올라간다.
        </StopRule>
        <CapabilityCheck items={[
          'Thought가 context만 바꾸고 environment action이 observation을 만드는 차이를 state transition으로 그린다.',
          'Search, lookup, finish의 입력·출력과 step cap의 종료 책임을 설명한다.',
          'HotpotQA와 FEVER에서 ReAct 단독과 hybrid 결과를 구분한다.',
          'Hallucination 감소와 reasoning/search failure 증가를 같은 evidence boundary 안에서 읽는다.',
          'ALFWorld success와 WebShop score/success를 섞지 않고 production handoff의 추가 계약을 말한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Yao et al. · ReAct', href: 'https://arxiv.org/abs/2210.03629', note: 'Action-space 정의, QA·decision-task 실험, finetuning과 limitation의 1차 출처.' },
          { label: 'ReAct project', href: 'https://react-lm.github.io/', note: '논문, prompt trajectory 예시, code와 task 결과를 연결하는 공식 project page.' },
          { label: 'ICLR 2023 · OpenReview', href: 'https://openreview.net/forum?id=WE_vluYUL-X', note: '출판 기록, revision과 reviewer discussion을 확인하는 고정 source.' },
        ]} />
      </section>
    </>
  );
}
