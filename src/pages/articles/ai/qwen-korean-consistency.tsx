import { Link } from 'react-router-dom';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CitationBlock } from '@/components/ui/citation';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

const diagnosticSteps: StepDef[] = [
  {
    label: '1. 관찰 단위를 분리한다',
    body: '최종 답변, 노출된 <think> trace, token 후보 분포는 같은 것이 아니다. 어느 층에서 언어가 바뀌는지 먼저 기록한다.',
  },
  {
    label: '2. 재현 prompt를 고정한다',
    body: '일상 대화, 코드, 수학, 번역, 고유명사를 분리하고 model·template·thinking mode·seed·sampling 설정을 고정한다.',
  },
  {
    label: '3. 실패를 계수한다',
    body: '원치 않는 script 비율, 완전한 언어 전환, task 정답률을 따로 측정한다. 한자를 무조건 오류로 세면 정상적인 고유명사와 번역까지 오탐한다.',
  },
  {
    label: '4. 가장 얕은 개입부터 검증한다',
    body: 'Prompt → decoding/runtime guard → lm_head smoothing → SFT·RL 순서로 비용과 부작용을 함께 비교한다.',
  },
];

const layers = [
  ['요청', 'prompt · chat template', '출력 언어를 지시하지만 확률분포를 보장하지는 않는다.'],
  ['생성', 'logits · softmax · sampling', '실제로 다음 token이 선택되는 지점이다.'],
  ['학습', 'SFT · preference/RL', '어떤 reasoning trace와 응답 습관이 높은 보상을 받는지 바꾼다.'],
  ['운영', 'detect · accept · retry', '모델 밖에서 배포 계약을 검사하고 실패를 처리한다.'],
] as const;

function DiagnosticWorkflowViz() {
  return (
    <StepViz steps={diagnosticSteps}>
      {(step) => (
        <div className="w-full" aria-label="한국어 일관성 문제의 진단과 개입 층">
          <ol className="grid gap-3 md:grid-cols-4">
            {layers.map(([title, mechanism, note], index) => {
              const active = index === step;
              return (
                <li
                  key={title}
                  className={`relative min-w-0 border-t-2 px-3 py-4 transition-colors md:min-h-40 ${active ? 'border-foreground bg-muted/35' : 'border-border bg-background'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-muted-foreground">0{index + 1}</span>
                    {active && <span className="text-[10px] font-bold text-foreground">현재 층</span>}
                  </div>
                  <strong className="mt-4 block text-base">{title}</strong>
                  <code className="mt-2 block break-words text-xs text-foreground">{mechanism}</code>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{note}</p>
                  {index < layers.length - 1 && (
                    <span className="absolute -bottom-3 left-1/2 text-muted-foreground md:-right-2 md:bottom-auto md:left-auto md:top-1/2" aria-hidden="true">↓</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </StepViz>
  );
}

const interventionRows = [
  {
    title: 'Prompt와 template',
    access: 'API만 있어도 가능',
    target: '요청 해석과 응답 형식',
    use: '실패율이 낮고 재시도 비용이 작을 때 첫 기준선',
    risk: '길어진 추론이나 domain shift에서 다시 언어가 바뀔 수 있다.',
  },
  {
    title: 'Runtime guard',
    access: '서빙 코드 제어 필요',
    target: '사용자에게 나가기 직전의 출력',
    use: '언어 계약을 반드시 지켜야 하고 fallback 모델이 있을 때',
    risk: '검출·재시도 latency와 비용, 오탐 정책을 운영해야 한다.',
  },
  {
    title: 'Smoothie-Qwen',
    access: 'Open weight 필요',
    target: 'lm_head의 특정 token row',
    use: '원치 않는 중국어 token이 반복적으로 선택되는 좁은 문제',
    risk: '중국어 번역처럼 정상 요청도 억제하는 정적 개입이다.',
  },
  {
    title: 'SFT + RL',
    access: '학습 data·GPU·평가기 필요',
    target: '응답과 reasoning trace의 장기 행동',
    use: '한국어 reasoning 자체가 제품 품질과 평가의 핵심일 때',
    risk: '보상 해킹, policy collapse, 일반 능력 저하를 감시해야 한다.',
  },
] as const;

export default function QwenKoreanConsistencyArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한국어 답이 흔들릴 때 어디서부터 확인할까?</h2>
        <BeginnerOpening
          title="다른 언어가 섞인 위치에 따라 고치는 방법이 달라진다"
          description={<>모델은 문장을 통째로 쓰지 않고 작은 글자 조각인 <strong>token</strong>을 하나씩 고른다. 사용자가 보는 최종 답, 밖으로 드러난 중간 풀이, 다음 token 후보의 점수는 서로 다른 관찰 지점이다. <strong>RL fine-tuning</strong>은 채점 결과를 이용해 모델의 선택 습관을 다시 학습하는 큰 개입이다.</>}
          familiarScene={<>한국어 상담원이 최종 안내문 한 줄에 중국어 표현을 섞은 경우와, 내부 업무 메모만 영어로 쓴 경우를 생각해 보자. 첫 문제는 고객에게 나가기 직전 검사와 재작성으로 막을 수 있지만, 두 번째 문제까지 같은 방식으로 고치려 하면 필요 없는 재학습 비용이 든다.</>}
          steps={[
            { label: '어디에 섞였는지 나눈다', detail: '최종 답, 전체 언어 전환, 노출된 중간 풀이를 따로 센다.' },
            { label: '같은 조건으로 되풀이한다', detail: '질문 형식과 생성 설정을 고정해 재현되는 실패인지 본다.' },
            { label: '가장 작은 층부터 고친다', detail: '지시문과 출력 검사부터 시작해 필요할 때만 가중치 학습으로 간다.' },
          ]}
        />
        <QuestionLead
          question="한국어 질문에 중국어가 섞였다면, 바로 모델 전체를 다시 학습해야 할까?"
          answer="아니다. 원치 않는 중국어 token이 최종 출력에 섞이는 문제, 답변 전체가 다른 언어로 전환되는 문제, 노출된 reasoning trace가 영어로 진행되는 문제는 관찰 지점과 해결 층이 다르다. 먼저 같은 평가 세트에서 어느 실패인지 분리해야 가장 작은 개입으로 고칠 수 있다."
        />
        <ConceptPrimer
          items={[
            { term: 'Token row', meaning: 'lm_head가 vocabulary의 각 token에 대응해 logit을 만드는 가중치 행이다.', why: 'Smoothie가 모델 전체가 아니라 마지막 출력층 일부를 바꾼다는 뜻을 읽는다.' },
            { term: 'Language confusion', meaning: 'Prompt 언어와 다른 지배적 언어로 응답이 섞이거나 전환되는 현상이다.', why: '사실 오류와 언어 선택 오류를 별도 지표로 측정한다.' },
            { term: 'Reasoning trace', meaning: '모델이 <think> 같은 형식으로 외부에 출력한 중간 텍스트다.', why: 'Hidden state 전체를 직접 관찰했다는 주장과 구분한다.' },
            { term: 'Deployment contract', meaning: '사용자에게 내보낼 언어·형식·안전 조건을 서빙 계층이 검사하는 규칙이다.', why: '모델 정확도와 제품 신뢰성을 한 층에 맡기지 않는다.' },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Qwen3는 공식적으로 한국어를 포함한 119개 언어·방언을 지원하고 약 36조 token으로 사전학습됐다고 공개했다.
            그러나 언어별 token 비율은 공개하지 않았다. 따라서 “한국어가 1~3%라서 그렇다” 같은 수치를 원인처럼 쓰면 안 된다.
            관찰 가능한 사실은 특정 prompt·template·sampling 조건에서 어떤 script와 언어가 출력됐는지뿐이다.
          </p>
          <p>
            이 글의 목표는 하나의 만능 처방을 고르는 것이 아니다. 실패가 나타난 층과 우리가 통제할 수 있는 층을 맞추는 것이다.
            API만 쓰는 팀과 weight를 직접 서빙하는 팀, reasoning model을 다시 학습할 수 있는 팀의 선택지는 서로 다르다.
          </p>
          <CitationBlock source="Qwen Team · Qwen3" citeKey={1} href="https://qwenlm.github.io/blog/qwen3/">
            <p>공식 글은 Qwen3의 119개 언어 지원과 약 36조 token 규모를 밝히지만 언어별 학습 비율은 제시하지 않는다.</p>
          </CitationBlock>
        </div>
        <DiagnosticWorkflowViz />
      </section>

      <section id="prompt-level" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">해법보다 먼저 측정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 평가 세트는 최소 다섯 갈래로 나눈다. 한국어 일상 대화, 수학 reasoning, code 설명, 한자·중국어가 정답에 필요한 번역,
            한국·중국 고유명사가 섞인 검색형 질문이다. 각 case에 <code>model revision</code>, chat template, thinking mode,
            temperature, top-p, seed를 함께 저장해야 모델 변화와 sampling 변화를 구분할 수 있다.
          </p>
          <p>
            단순 Unicode 범위 검사는 출발점일 뿐이다. CJK Unified Ideographs는 중국어·일본어·한국어 한자 사용이 겹친다.
            따라서 “한자 한 글자 발견”과 “원치 않는 중국어 문장으로 전환”을 같은 실패로 세면 안 된다. 문장 단위 language ID,
            script 비율, 사람이 정의한 허용 목록, task 정답률을 함께 본다.
          </p>
          <p>
            System prompt에 “최종 답변은 한국어로 작성”을 명시하는 것은 가장 싼 기준선이다. 하지만 prompt는 logit을 조건화할 뿐
            특정 언어 token의 확률을 0으로 만들지 않는다. 그래서 평균 실패율이 낮더라도 “절대 노출 금지” 계약에는 runtime 검사가 별도로 필요하다.
          </p>
        </div>
        <Misconception>
          Temperature를 낮추면 자동으로 한국어가 된다는 보장은 없다. 현재 가장 높은 logit이 중국어 token이라면 낮은 temperature는 오히려 그 선택을 더 확정적으로 만든다.
        </Misconception>
      </section>

      <section id="smoothie-qwen" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Smoothie-Qwen: 출력 확률층 개입</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Smoothie-Qwen은 재학습 없이 <code>lm_head</code>의 고위험 token row를 줄이는 post-hoc 방법이다. 논문은 먼저 중국어 Unicode
            범위와 BPE의 깨진 조각 token을 찾고, 각 token에 위험도 <M>{String.raw`r_i\in[0,1]`}</M>를 준다. 그다음 위험도가 클수록 더 작은
            scale을 적용하되 row를 완전히 0으로 만들지는 않는다.
          </p>
          <div data-formula-pair>
            <M display>{String.raw`\underbrace{S_i}_{\text{token i의 배율}}=1-(1-\underbrace{s_{\min}}_{\text{최소 배율}})\underbrace{f_\gamma(r_i)}_{\text{위험도를 배율로 변환}}`}</M>
            <M display>{String.raw`f_\gamma(r_i)=\frac{\log(1+(\underbrace{\gamma}_{\text{억제 곡선 기울기}}-1)\underbrace{r_i}_{\text{token 위험도}})}{\log(\gamma)}`}</M>
            <FormulaNote
              meaning="위험도가 0이면 원래 row를 유지하고, 위험도가 1에 가까울수록 lm_head row를 s_min까지 줄인다. 완전 차단이 아니라 확률적 억제다."
              symbols={[
                ['S_i', 'token i의 lm_head row에 곱하는 배율'],
                ['r_i', 'Unicode·subword 분석으로 얻은 token 위험도'],
                ['s_{\\min}', '가장 강하게 억제해도 남겨 둘 최소 비율'],
                ['\\gamma', '중간 위험도 token을 얼마나 빠르게 억제할지 정하는 smoothness'],
              ]}
            />
          </div>
          <p>
            논문의 Qwen2.5-Coder-14B-Instruct 실험에서 <M>{String.raw`s_{\min}=0.5`}</M>, <M>{String.raw`\gamma=10`}</M>은 저자들이 만든
            중국어 유도 prompt 세트의 suppression 지표를 0.19에서 0.95로 높였고, 보고된 두 KMMLU subset 정확도는 거의 유지됐다.
            이 수치는 “모든 한국어 작업에서 95% 해결”이 아니라 해당 모델·데이터·지표에 한정된 결과다.
          </p>
          <p>
            더 중요한 한계는 정적이라는 점이다. 사용자가 중국어 번역을 정상적으로 요청해도 같은 token row가 억제된다. 논문 자체도
            context-insensitive 적용, heuristic risk score, 모델별 hyperparameter 재조정을 한계로 적는다. 따라서 다국어 제품이라면 요청 의도에 따라
            원본 weight와 smoothed weight를 route하거나 runtime 정책과 결합해야 한다.
          </p>
          <CitationBlock source="Ji et al. · Smoothie-Qwen" citeKey={2} href="https://arxiv.org/abs/2507.05686">
            <p>Token 위험도 산정, 비선형 lm_head scaling, Qwen2.5-Coder-14B-Instruct 실험과 정적 억제의 한계를 확인할 수 있다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="rl-approach" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">SFT와 RL: reasoning trace 개입</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한국어 reasoning을 학습한 후속 별도 연구는 다른 문제를 다룬다. 앞 절의 수치는 Qwen2.5-Coder-14B-Instruct 실험이고,
            이 연구의 출발 model은 Smoothie-Qwen3-14B다. 저자들은 이 Qwen3 계열의 노출된 reasoning trace가 주로 영어로
            진행되는 것을 출발점으로 삼았다. 1단계 SFT에서 3만 개 한국어 reasoning data로 형식과 언어의 기준선을 만들고, 2단계에서
            Oracle-Guided Dr.GRPO로 정답·형식·한국어 사용을 함께 보상했다.
          </p>
          <div data-formula-pair>
            <M display>{String.raw`\underbrace{r}_{\text{rollout 총보상}}=\underbrace{r_{\mathrm{acc}}}_{\text{정답}}+\underbrace{r_{\mathrm{len}}}_{\text{길이 완화}}+\underbrace{r_{\mathrm{aux}}}_{\text{보조 보상}}`}</M>
            <M display>{String.raw`\underbrace{r_{\mathrm{aux}}}_{\text{보조 보상}}=0.2\underbrace{r_{\mathrm{fmt}}}_{\text{출력 형식}}+0.2\underbrace{r_{\mathrm{ko}}}_{\text{한국어 사용}}`}</M>
            <FormulaNote
              meaning="한국어만 많이 쓰게 하는 보상이 아니다. 정답을 중심에 두고 형식과 언어 보상을 보조로 결합하며, oracle judge가 모호한 정답 보상을 보정한다."
              symbols={[
                ['r_{\\mathrm{acc}}', '문제 해결의 정확성 보상, 가장 큰 비중'],
                ['r_{\\mathrm{fmt}}', '요구된 reasoning/answer 형식을 지켰는지'],
                ['r_{\\mathrm{ko}}', '출력된 reasoning trace와 답변의 한국어 일관성'],
                ['r_{\\mathrm{len}}', '문맥 길이를 넘기는 rollout을 부드럽게 억제'],
              ]}
            />
          </div>
          <p>
            논문에서 SFT 뒤 language·format 지표는 이미 높은 수준에 도달했고, RL은 어려운 reasoning benchmark를 더 끌어올리는 역할을 했다.
            예를 들어 저자 표의 AIME 2025는 base와 SFT가 동일한 66.66으로 보고되고 RL이 73.3으로 올랐다. HumanEval은 56.09/60.36/66.46이었다.
            반면 모든 benchmark가 오른 것은 아니다. MMLU는 78.86/78.49/78.41이었다. 그래서 “한국어 보상 = 전 능력 향상”으로 읽으면 안 된다.
          </p>
        </div>
        <Misconception>
          논문에서 “한국어로 생각한다”는 말은 모델이 외부로 낸 reasoning trace를 뜻한다. Hidden activation의 모든 계산이 인간 언어인 한국어로 이루어진다는 것을 직접 증명한 것은 아니다.
        </Misconception>
        <CitationBlock source="Lee et al. · Making Qwen3 Think in Korean with Reinforcement Learning" citeKey={3} href="https://arxiv.org/abs/2508.10355">
          <p>30,000개 SFT data, Oracle-Guided Dr.GRPO, reward 구성과 benchmark별 trade-off를 제시한 원 논문이다.</p>
        </CitationBlock>
      </section>

      <section id="runtime-guard" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">런타임 검증과 재시도</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Weight를 바꿀 수 없거나 오류를 사용자에게 절대 노출하면 안 된다면 모델 밖에서 계약을 닫는다. 생성 뒤에 script·language·format을 검사하고,
            통과하면 반환한다. 실패하면 같은 모델에 더 강한 지시로 한 번 재시도하거나 한국어에 강한 fallback 모델로 route한다.
            끝없이 retry하지 말고 횟수와 timeout을 고정해야 한다.
          </p>
        </div>
        <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-4">
          {[
            ['01', 'Generate', '고정된 model·template로 후보 생성'],
            ['02', 'Detect', '언어·script·형식·정답 조건 검사'],
            ['03', 'Decide', 'accept / rewrite / fallback 분기'],
            ['04', 'Log', '실패 prompt와 설정을 평가 세트로 환류'],
          ].map(([number, title, body]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <span className="font-mono text-xs font-bold text-muted-foreground">{number}</span>
              <strong className="mt-5 block text-sm">{title}</strong>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Judge도 틀릴 수 있으므로 detector 정확도와 end-to-end 계약 성공률을 분리해 본다. 한국어 문장에 정상적으로 들어간 한자, code block의 Unicode 예제,
            인용된 중국어를 허용할지 정책이 필요하다. 운영 metric은 단순 “중국어 문자 수”가 아니라 최초 통과율, 재시도 성공률, 오탐률,
            p95 latency, 추가 token 비용, task accuracy다.
          </p>
        </div>
      </section>

      <section id="decision-matrix" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">권한과 실패 지점으로 선택하기</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {interventionRows.map((row, index) => (
            <article key={row.title} className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-5">
              <span className="font-mono text-sm font-bold text-muted-foreground">0{index + 1}</span>
              <div className="min-w-0">
                <h3 className="font-bold">{row.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{row.access}</p>
                <p className="mt-2 font-mono text-xs text-foreground">{row.target}</p>
              </div>
              <div className="min-w-0 text-sm leading-relaxed">
                <p><strong>맞는 때:</strong> <span className="text-muted-foreground">{row.use}</span></p>
                <p className="mt-2"><strong>치르는 비용:</strong> <span className="text-muted-foreground">{row.risk}</span></p>
              </div>
            </article>
          ))}
        </div>
        <CapabilityCheck items={[
          '원치 않는 중국어 출력과 한국어 reasoning trace 문제를 다른 평가로 설계할 수 있다.',
          'Smoothie의 scaling 식에서 risk, minimum scale, smoothness의 역할과 정적 억제 한계를 설명할 수 있다.',
          'SFT와 RL이 각각 언어 형식의 기준선과 어려운 reasoning 성능에서 맡은 역할을 논문 수치로 구분할 수 있다.',
          'Weight 접근권한과 배포 계약에 따라 prompt, guard, smoothing, 학습 중 가장 작은 개입을 선택할 수 있다.',
        ]} />
        <div className="not-prose grid gap-3 sm:grid-cols-3">
          <Link to={articlePath('ai', 'tokenizer')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">더 아래 기반</span><strong className="mt-2 block text-sm">Tokenizer와 Unicode 경계</strong></Link>
          <Link to={articlePath('ai', 'probability-information-theory')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">수식 기반</span><strong className="mt-2 block text-sm">Logit, softmax와 확률</strong></Link>
          <Link to={articlePath('ai', 'post-training-rlvr')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">다음 구현</span><strong className="mt-2 block text-sm">Post-training과 검증 보상</strong></Link>
        </div>
        <SourceNotes sources={[
          { label: 'Qwen3 공식 공개 글', href: 'https://qwenlm.github.io/blog/qwen3/', note: '지원 언어, pretraining 규모와 hybrid thinking의 공식 범위.' },
          { label: 'Smoothie-Qwen', href: 'https://arxiv.org/abs/2507.05686', note: 'lm_head token row smoothing의 식, 실험과 한계.' },
          { label: 'Making Qwen3 Think in Korean', href: 'https://arxiv.org/abs/2508.10355', note: 'SFT에서 Oracle-Guided Dr.GRPO로 이어지는 한국어 reasoning adaptation.' },
        ]} />
      </section>
    </div>
  );
}
