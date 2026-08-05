import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';
import { IsoFlopPilotLab, PretrainingBudgetLab, PretrainingRunGate } from './pretraining-scaling/viz/PretrainingScalingLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-[13px] sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function LlmPretrainingScalingArticle() {
  return (
    <>
      <BeginnerOpening
        title="Pre-training은 아주 많은 문장에서 '다음 조각 맞히기'를 반복하는 LLM의 첫 학습 단계입니다."
        description={<>LLM은 사용자와 대화하기 전에 먼저 대규모 글을 읽고, 앞의 글 조각을 보며 다음 조각을 예측하는 연습을 한다. 예측과 정답의 차이가 줄어들도록 내부 숫자를 조금씩 바꾸는 이 과정을 <strong className="text-foreground">사전학습(Pre-training)</strong>이라고 부른다.</>}
        familiarScene={<>"오늘 저녁에" 뒤에 올 말을 맞혀 보는 빈칸 문제를 생각해 보자. 학생은 여러 문장을 보고 "만나자", "비가", "밥을" 같은 후보 중 하나를 고른다. 정답을 확인한 뒤 다음 문제에서 더 나은 선택을 하도록 풀이 방법을 고친다. LLM의 첫 학습도 규모와 자동화 방식은 다르지만 이 반복 구조로 시작한다.</>}
        steps={[
          { label: '글을 작은 조각으로 나눈다', detail: '문장을 model이 다룰 수 있는 token이라는 단위로 바꾼다.' },
          { label: '다음 조각을 예측한다', detail: '앞에 본 token을 이용해 다음 token이 무엇일지 확률로 고른다.' },
          { label: '틀린 만큼 내부 숫자를 바꾼다', detail: '예측과 실제 다음 token을 비교하고, 다음 예측이 나아지도록 조정한다.' },
        ]}
      />

      <section id="deployment-first" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다음 조각 맞히기에서 학습 예산으로</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            학습 전의 model 내부에는 아주 많은 조절 숫자가 있지만 언어 규칙을 아직 배운 상태는 아니다.
            문장 뒤를 예측하고 틀린 정도를 확인한 뒤 이 숫자를 조금씩 바꾸는 일을 매우 많이 반복한다. 그 결과 model은 문법,
            단어의 관계, 일부 사실과 문장 연결 패턴을 내부 숫자에 분산해 담게 된다.
          </p>
          <p>
            이 단계는 아직 "친절한 대화형 답변"이나 "코딩 문제의 정답"을 직접 가르치는 과정은 아니다. 언어와 지식의 광범위한 바닥을 먼저 만들고,
            그 뒤에 instruction tuning이나 RL 같은 후속 학습이 사용자의 요청에 대답하는 방식을 더한다. 이 글은 그 첫 단계에서 필요한 학습량과 model 크기를 정하는 법을 다룬다.
          </p>
        </div>
        <ConceptPrimer title="이제 다섯 단어만 정확히 잡자" items={[
          { term: 'LLM · 대규모 언어 model', meaning: '앞의 글 조각을 받고 다음 조각의 확률을 만드는 신경망이다.', why: '긴 답변도 실제로는 다음 조각 예측을 여러 번 이어 붙여 만든다.' },
          { term: 'Pre-training · 사전학습', meaning: '대규모 글에서 다음 token 예측을 반복해 언어와 지식의 기반을 만드는 첫 학습 단계다.', why: '후속 학습이 답변 습관을 바꾸더라도 단어, 문법과 기본 지식은 주로 이 단계에서 시작한다.' },
          { term: 'Token · 글 조각', meaning: '문장을 model이 읽고 예측하는 작은 단위로 나눈 것이다.', why: '동일한 문서도 언어와 tokenizer에 따라 token 수가 달라져 실제 학습량과 비용이 바뀐다.' },
          { term: 'Parameter · 학습으로 바뀌는 숫자', meaning: 'Model 내부에서 예측 규칙을 담는 조절값이다. 4B는 약 40억 개, 9B는 약 90억 개를 뜻한다.', why: '많으면 표현 용량이 커질 수 있지만 token 하나를 학습하고 생성하는 비용도 커진다.' },
          { term: 'Training budget · 학습 예산', meaning: '한 번의 학습에 쓸 수 있는 계산, GPU 시간, data와 실험 횟수의 한도다.', why: '한정된 예산을 model 크기와 연습 token 수 중 어디에 쓸지 결정해야 한다.' },
        ]} />
        <QuestionLead
          label="이제 확인할 질문"
          question="약 40억 개의 조절 숫자를 가진 4B와 약 90억 개를 가진 9B가 같은 학습 예산을 쓴다면, 항상 9B가 더 좋은 선택일까?"
          answer="아니다. 9B는 한 문장 조각을 연습할 때 더 많은 계산을 써서, 같은 시간과 계산량 안에서는 4B보다 적은 문장만 볼 수 있다. 4B는 표현할 수 있는 양이 더 작을 수 있지만 더 많은 문장을 연습하고, 실제 서비스에서도 한 번 답할 때 드는 비용이 작다. 따라서 크기 하나만 보지 않고 학습에서 본 문장 수, 데이터의 다양성, 필요한 답변 품질과 앞으로 몇 번 사용할지를 함께 비교해야 한다."
        />
        <ConceptPrimer title="학습 규모를 비교할 때 쓰는 네 가지 기호" items={[
          { term: 'Model size · N', meaning: '학습으로 조정되는 parameter의 수다.', why: '표현 용량뿐 아니라 매 token의 학습·추론 계산과 weight memory를 함께 바꾼다.' },
          { term: 'Training tokens · D', meaning: 'Tokenizer를 지난 뒤 optimizer가 실제로 소비한 token 수다.', why: '문서 수와 다르며 같은 문서를 반복하면 D는 늘어도 새로운 정보는 늘지 않을 수 있다.' },
          { term: 'Training compute · C', meaning: '한 run에 쓴 총 부동소수점 연산량의 근사다.', why: '고정 C에서는 N을 키울수록 학습 가능한 D가 줄어드는 trade-off가 생긴다.' },
          { term: 'Inference demand · Q_prompt·Q_out·k', meaning: '배포에서 처리할 prompt token, 생성할 output token과 문제당 후보 수다.', why: '공유 prefix를 한 번만 prefill하는지, 후보마다 prompt까지 다시 계산하는지에 따라 생애 비용이 달라진다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Scaling law는 “크게 만들면 좋아진다”는 구호가 아니라 작은 pilot run의 loss 곡선으로 아직 돌리지 않은 큰 run의 후보를 줄이는 경험적 모델이다. 경험식이므로 architecture, tokenizer, data mixture와 optimizer가 바뀌면 계수를 다시 맞춰야 한다. 2020년 Kaplan의 결론과 2022년 Chinchilla의 결론이 달라진 이유도 실험 범위와 최적화 조건이 달랐기 때문이다.</p>
          <p>2026년의 현재 질문은 training만으로 끝나지 않는다. Reasoning model은 한 문제에서 여러 trajectory를 생성하고 verifier나 search로 고를 수 있다. 그러면 작은 모델을 더 오래 pre-train한 뒤 여러 번 호출하는 선택과 큰 모델을 짧게 학습해 한 번 호출하는 선택을 같은 예산에서 비교해야 한다.</p>
        </div>
        <PretrainingBudgetLab />
        <Misconception>“Chinchilla는 parameter당 20 token이므로 4B는 80B token이면 끝”은 잘못된 사용법이다. 20은 특정 모델군·데이터·optimizer·training-only 목적에서 얻은 대표적인 근사점이다. 배포량, architecture, data quality와 반복 여부가 바뀌면 최적점도 바뀐다.</Misconception>
      </section>

      <section id="three-budgets" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">모델 크기·연습량·계산량은 어떻게 연결될까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>조절 숫자가 많은 model은 token 하나를 볼 때 더 많은 숫자를 읽고 바꿔야 한다. 반대로 더 많은 token을 연습하려면 같은 계산을 더 많이 반복해야 한다. 그래서 model 크기 <strong>N</strong>, 실제로 본 token 수 <strong>D</strong>, 그 둘에 쓴 총 계산량 <strong>C</strong>를 따로 기록한 뒤 연결한다.</p>
          <p>Dense Transformer의 주 학습 연산은 대략 parameter마다 forward에서 두 번, backward까지 포함해 여섯 번 정도의 연산을 token마다 수행한다고 근사한다. 그래서 초기 예산표에서는 <strong>C ≈ 6ND</strong>를 쓴다. Attention의 sequence-length 비용, embedding, optimizer와 통신은 이 한 줄에 정확히 들어맞지 않지만, 여러 N·D 후보의 크기를 빠르게 비교하는 첫 단위로 유용하다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{C_{train}}_{\text{사전학습 총 연산}}&\approx 6ND\\[0.35em]
\underbrace{6N}_{\text{한 token을 학습하는 근사 비용}}&\times\underbrace{D}_{\text{소비한 token 수}}
\end{aligned}`}
          meaning="N을 두 배로 하고 D를 그대로 두면 training compute도 대략 두 배가 된다. C를 고정한 채 N을 두 배로 하면 D는 절반으로 줄여야 한다. 이 근사는 후보를 거르는 예산식이지 실제 GPU 시간 보증서가 아니다. 실제 wall-clock에는 utilization, communication, sequence length와 checkpointing이 들어간다."
          symbols={[[String.raw`C_{train}`, '사전학습에 사용한 총 연산량의 근사'], [String.raw`N`, 'embedding을 포함할지 명시한 parameter 수'], [String.raw`D`, '중복과 반복을 포함해 실제 소비한 token 수'], [String.raw`6`, 'dense forward·backward를 묶은 널리 쓰이는 근사 계수']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>FLOP</strong>은 덧셈이나 곱셈 같은 부동소수점 연산 한 번을 세는 단위다. <strong>zettaFLOPs</strong>는 <MathFormula>{String.raw`10^{21}`}</MathFormula> FLOPs이며, 아래 Viz의 <strong>ZF</strong>와 <strong>ZFLOPs</strong>도 같은 단위를 짧게 쓴 표기다.</p>
          <p>예를 들어 4B 모델을 160B token으로 학습하면 약 3.84 zettaFLOPs, 9B 모델을 같은 160B token으로 학습하면 약 8.64 zettaFLOPs다. 반대로 3.84 zettaFLOPs 안에서 9B를 선택하면 약 71B token만 볼 수 있다. 더 큰 모델이 매 token을 잘 흡수하더라도 data exposure가 줄어드는 손해와 비교해야 한다.</p>
          <p>또 D는 <em>고유 데이터 U</em>와 다르다. 120B 고유 token을 360B token 동안 소비했다면 약 3 epoch다. 같은 token을 다시 보아도 optimization 신호는 생길 수 있지만 새로운 사실과 표현이 3배 생긴 것은 아니다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{r_{data}}_{\text{고유 corpus 반복 횟수}}=\frac{\underbrace{D}_{\text{총 소비 token}}}{\underbrace{U}_{\text{중복 제거 후 고유 token}}}`}
          meaning="D/U는 같은 고유 corpus를 평균 몇 번 통과했는지 보여 준다. 실제 sampling은 domain별로 다르므로 전체 평균만 보지 말고 source별 반복 횟수와 held-out loss를 함께 기록해야 한다."
          symbols={[[String.raw`D`, '모든 epoch와 resampling을 포함한 총 학습 token'], [String.raw`U`, '현재 dedup·filter recipe 아래의 고유 token'], [String.raw`r_{data}`, '평균적인 corpus pass 수']]}
        />
      </section>

      <section id="compute-frontier" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 계산량에서 가장 좋은 조합은 어떻게 찾을까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>같은 총 계산량 안에서 model을 더 크게 만들지, 같은 model에 더 많은 문장을 보여 줄지 비교해 예측 오차가 가장 작은 조합을 찾는다. 이런 선택을 <strong>compute-optimal</strong>, 즉 주어진 계산 예산을 가장 효과적으로 나눈 선택이라고 부른다.</p>
          <p>Kaplan과 Chinchilla는 모두 validation cross-entropy가 규모에 따라 완만한 power law로 내려간다는 관찰에서 출발하지만 loss를 fit한 함수와 compute allocation exponent는 같지 않다. 이 글은 현재 pilot 의사결정에 필요한 <strong>모델 부족 항</strong>과 <strong>데이터 부족 항</strong>의 일반형을 쓴다. Chinchilla가 실제로 사용한 세 추정법, fitted constant와 Kaplan .73/.27 대비 결과는 <InternalLink slug="paper-chinchilla-2022">Chinchilla 2022 원문 재구성</InternalLink>에서 분리해 검산한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{L(N,D)}_{\text{검증 예측 손실}}&\approx \underbrace{E}_{\text{줄이기 어려운 바닥}}+\Delta_{model}+\Delta_{data}\\[0.45em]
\underbrace{\Delta_{model}}_{\text{모델 부족 손실}}&=\frac{A}{N^{\alpha}}\\[0.35em]
\underbrace{\Delta_{data}}_{\text{데이터 부족 손실}}&=\frac{B}{D^{\beta}}
\end{aligned}`}
          meaning="N을 키우면 모델 부족 항이, D를 늘리면 데이터 부족 항이 내려간다는 경험식이다. A, B, α, β, E는 논문에서 가져와 붙이는 상수가 아니라 자신의 pilot 결과로 추정해야 한다. Loss가 낮아도 목표 task가 좋아진다는 보장은 없으므로 downstream evaluation은 별도 gate다."
          symbols={[[String.raw`L(N,D)`, '고정된 validation distribution에서 측정한 next-token loss'], [String.raw`E`, '현재 데이터 분포와 모델 family가 만드는 irreducible term'], [String.raw`A,B`, 'model·data 부족 항의 크기'], [String.raw`\alpha,\beta`, '규모가 커질 때 손실이 줄어드는 경험적 기울기']]}
        />
        <Formula
          latex={String.raw`\underbrace{(N^*,D^*)}_{\text{고정 예산에서 선택할 후보}}=\underset{\underbrace{6ND\le C_{max}}_{\text{같은 training compute 안}}}{\operatorname{argmin}}\;\underbrace{L(N,D)}_{\text{pilot으로 맞춘 validation loss}}`}
          meaning="IsoFLOP 비교는 같은 C_max 안에서 N과 D를 바꾼 여러 run을 놓고 가장 낮은 예측 loss의 조합을 찾는다. 한 모델만 길게 돌린 curve로는 모델 부족과 데이터 부족을 분리할 수 없다."
          symbols={[[String.raw`N^*,D^*`, '현재 조건에서 선택된 model·token 후보'], [String.raw`C_{max}`, '허용된 training FLOPs'], [String.raw`\operatorname{argmin}`, '조건을 만족하는 후보 중 loss가 가장 낮은 조합']]}
        />
        <IsoFlopPilotLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>실전에서는 100M~1B proxy만으로 끝내지 않는다. 작은 모델에서 얻은 순위가 4B와 9B에서도 유지되는지 최소 두 scale에서 확인한다. Learning rate와 batch size가 scale마다 부적절하면 scaling law가 model/data 효과가 아니라 optimization 실패를 fit하게 된다. DeepSeek LLM이 model parameter 대신 non-embedding FLOPs/token을 쓰고 learning rate·batch scaling을 별도로 다시 맞춘 이유가 이 경계다.</p>
        </div>
      </section>

      <section id="inference-aware" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">학습 뒤에 많이 사용할수록 선택은 왜 달라질까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>학습이 끝난 model은 한 번만 쓰고 버리지 않는다. 같은 model이 수많은 사용자 요청에 답하고, 어려운 문제에서는 답 후보를 여러 개 만든 뒤 가장 나은 하나를 고르기도 한다. 학습이 끝난 뒤 답을 만드는 동안 계산을 더 쓰는 이 방법을 <strong>test-time scaling</strong>이라고 부른다.</p>
          <p>Chinchilla의 질문은 “고정된 <em>training</em> compute로 validation loss를 가장 낮추려면?”이었다. 제품의 질문은 다르다. 학습 뒤 수십억 번 호출된다면 parameter가 큰 모델은 매 요청에서 계속 비용을 낸다. 2024년 Beyond Chinchilla-Optimal은 inference demand가 클수록 더 작은 모델을 더 오래 학습하는 선택이 유리해질 수 있음을 보였다.</p>
          <p>Reasoning에서는 한 요청이 한 decode로 끝나지 않을 수 있다. 후보 k개를 생성해 verifier로 고르면 성능과 함께 생성량도 k배 가까이 늘어난다. 2026년 T² scaling 연구는 pre-training N·D와 test-time sample 수를 한 budget에서 함께 최적화해야 기존 training-only 최적점이 바뀐다고 보고한다. 이는 “항상 작은 모델”이라는 새 법칙이 아니라 <strong>Q와 k를 누락한 최적화가 제품 최적화가 아니다</strong>라는 뜻이다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{C_{life}}_{\text{전체 생애 연산}}&\approx C_{train}+C_{serve}\\[0.45em]
\underbrace{C_{train}}_{\text{한 번 지불하는 학습}}&\approx 6ND\\[0.35em]
	\underbrace{C_{serve}^{shared}}_{\text{prefix를 한 번 공유}}&\approx 2N(Q_{prompt}+kQ_{out})\\[0.35em]
	\underbrace{C_{serve}^{separate}}_{\text{후보마다 prompt 재계산}}&\approx 2Nk(Q_{prompt}+Q_{out})
	\end{aligned}`}
          meaning="Dense model의 forward를 token당 약 2N FLOPs로 잡은 생애 예산식이다. 후보 k개가 같은 prefix KV를 공유하면 prompt는 한 번, output은 k번 계산한다. 공유하지 못하면 prompt와 output이 모두 k번 반복된다. 실제 비교에서는 cache hit, batching, attention, MoE active parameter와 hardware 가격을 따로 측정한다."
          symbols={[[String.raw`C_{life}`, '학습과 예상 배포를 합친 전체 생애 compute'], [String.raw`Q_{prompt}`, '서비스 생애 동안 prefill할 prompt token 총량'], [String.raw`Q_{out}`, '후보 하나 기준으로 생성할 output token 총량'], [String.raw`k`, '같은 문제에서 생성·검증할 후보 수'], [String.raw`N`, 'dense model parameter 수를 사용한 token당 forward 비용의 근사 기준']]}
        />
        <Misconception>Test-time scaling이 pre-training을 대체하는 것은 아니다. 약한 base model이 탐색 공간에 정답 trajectory를 거의 만들지 못하면 k를 늘려도 실패만 반복한다. N·D는 후보 분포를 만들고, k와 search는 그 분포에서 더 많이 탐색한다.</Misconception>
      </section>

      <section id="data-constrained" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">고유 데이터가 모자라면 반복은 언제 멈출까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>데이터가 제한된 환경에서는 D를 늘릴 때 같은 U를 다시 볼 수밖에 없다. Muennighoff et al.은 9B까지의 실험에서 고정 compute 조건의 약 4회 반복까지는 고유 token을 추가한 경우와 loss 차이가 작았지만, 더 반복하면 추가 compute의 가치가 결국 0으로 가까워짐을 보였다. 이 숫자도 모든 corpus의 정지가 아니다. 중복도, model capacity, regularization과 domain mixture가 다르면 curve가 달라진다.</p>
          <p>2026년 data-constrained pretraining 연구는 model size와 data size가 독립적으로 더해진다는 고전적 식이 반복 데이터 구간에서는 맞지 않을 수 있다고 지적하고, interaction을 포함한 fit과 regularization을 연구한다. 아직 최신 preprint의 결론을 production 기본값으로 승격하면 안 되지만, <strong>고유 데이터가 고정된 다중 epoch에서는 Chinchilla 식을 그대로 외삽하지 말아야 한다</strong>는 감사 질문은 바로 적용할 수 있다.</p>
          <p>반복을 계속할지 판단하려면 training loss가 아니라 세 곡선을 본다. 첫째 clean held-out loss, 둘째 memorization과 contamination probe, 셋째 목표 capability slice의 점수다. Training loss만 내려가고 held-out loss가 평평해지거나 암기율이 오르면 추가 token은 새 신호가 아니다. 이 지점부터는 <InternalLink slug="llm-data-engine">LLM 데이터 엔진</InternalLink>에서 새로운 source, mixture, 합성·검증과 dedup 정책을 다시 설계한다.</p>
        </div>
        <StopRule>Scaling law의 모든 변형을 더 읽지 않는다. 고유 token U, 반복 횟수 D/U, clean validation, 암기 probe와 목표 task가 같은 방향으로 좋아지는 구간까지만 학습하고, 그 뒤는 데이터 recipe 문제로 넘긴다.</StopRule>
      </section>

      <section id="pilot-plan" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">큰 학습을 시작하기 전에 어떤 작은 실험을 할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Full run의 목적은 scaling law를 증명하는 것이 아니라 제품 결정을 내리는 것이다. 먼저 “9B가 4B보다 loss가 낮은가?”가 아니라 “정해진 memory·latency 안에서 post-training과 test-time sampling까지 거친 task 성공률이 더 높은가?”를 묻는다. 같은 tokenizer, data snapshot, optimizer family와 evaluation harness를 쓰지 않으면 N·D 차이를 해석할 수 없다.</p>
          <p>최소 pilot matrix는 작은 N 세 개 이상과 각 N의 D 두세 개를 포함한다. Run마다 실제 non-padding token, achieved FLOPs, wall-clock, utilization, clean loss, capability slice, memorization score와 checkpoint를 남긴다. 그 뒤 candidate 4B와 9B를 같은 total-cost 시나리오에서 비교하고, post-training이 순위를 뒤집는지 확인한다.</p>
        </div>
        <PretrainingRunGate />
        <CapabilityCheck items={[
          '4B·9B 선택을 parameter 수가 아니라 목표 품질, memory, training·inference budget으로 표현한다.',
          'C≈6ND로 같은 compute의 N·D 후보를 계산하고 이 근사의 누락 항을 설명한다.',
          'Chinchilla의 대표 비율과 자신의 empirical optimum을 구분한다.',
          'D와 고유 token U를 구분하고 source별 반복 횟수를 계산한다.',
          'Inference demand Q와 sample 수 k가 작은 모델을 오래 학습할 유인을 만드는 이유를 설명한다.',
          'Pilot fit, clean validation, memorization probe, post-training과 serving gate를 거쳐 full run을 승인한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Kaplan et al. · Scaling Laws for Neural Language Models', href: 'https://arxiv.org/abs/2001.08361', note: 'Model·data·compute와 cross-entropy 사이의 power-law 관계를 대규모로 정식화한 시작점.' },
          { label: 'Hoffmann et al. · Training Compute-Optimal Large Language Models', href: 'https://arxiv.org/abs/2203.15556', note: 'IsoFLOP 분석으로 고정 training compute에서 N과 D를 함께 늘리는 Chinchilla 기준을 세운 최소 anchor.' },
          { label: 'Sardana et al. · Beyond Chinchilla-Optimal', href: 'https://proceedings.mlr.press/v235/sardana24a.html', note: 'Training뿐 아니라 대규모 inference demand를 포함하면 더 작은 모델을 더 오래 학습할 수 있음을 분석한 ICML 2024 연구.' },
          { label: 'Muennighoff et al. · Scaling Data-Constrained Language Models', href: 'https://arxiv.org/abs/2305.16264', note: '고유 데이터가 제한될 때 반복 token의 가치가 어떻게 줄어드는지 9B까지 실험한 공개 기준.' },
          { label: 'Roberts et al. · Test-Time Scaling Makes Overtraining Compute-Optimal', href: 'https://arxiv.org/abs/2604.01411', note: 'Pre-training N·D와 반복 inference sample을 함께 최적화한 2026년 현재 연구. 최신 preprint로서 재현 범위를 확인해야 한다.' },
          { label: 'Xu et al. · Data-Constrained Language Model Pretraining', href: 'https://arxiv.org/abs/2606.06888', note: '반복 데이터에서 model·data interaction과 regularization을 다시 fit한 2026년 preprint. 확립된 보편 법칙으로 취급하지 않는다.' },
        ]} />
        <StopRule>역사 하향은 <InternalLink slug="paper-chinchilla-2022">Chinchilla 2022 원문</InternalLink>에서 멈춘다. Kaplan보다 이전의 모든 neural scaling 연구는 현재 pilot 설계를 바꿀 때만 연다. 다음 실행은 <InternalLink slug="llm-data-engine">데이터 신호를 만드는 과정</InternalLink>과 <InternalLink slug="llm-pretraining-run">Pretraining runtime</InternalLink>이다.</StopRule>
      </section>
    </>
  );
}
