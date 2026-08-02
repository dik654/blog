import type { ReactNode } from 'react';
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
import {
  BayesEvidenceLab,
  DistributionMomentLab,
  ScoreToLossLab,
} from './probability-information-theory/viz/ProbabilityLabs';

function SectionHeading({
  index,
  kicker,
  children,
}: {
  index: string;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose mb-6 border-t border-border pt-5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm font-black text-blue-800 dark:text-blue-200">{index}</span>
        <span className="text-xs font-bold text-muted-foreground">{kicker}</span>
      </div>
      <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">{children}</h2>
    </div>
  );
}

function FormulaFrame({ children, emphasis = false }: { children: ReactNode; emphasis?: boolean }) {
  return (
    <div className={`min-w-0 rounded-md border px-3 py-4 sm:px-4 ${
      emphasis ? 'border-blue-600/35 bg-blue-500/[0.04]' : 'border-border bg-background'
    }`}>
      {children}
    </div>
  );
}

function ScoreToDistribution() {
  return (
    <section id="score-distribution" className="mb-20 scroll-mt-20">
      <SectionHeading index="01" kicker="OBJECTS FIRST">
        점수 2, 1, -1에서 무엇을 더 정해야 확률이 될까?
      </SectionHeading>

      <QuestionLead
        question="모델이 A, B, C에 2, 1, -1을 냈다면 A의 확률은 2일까?"
        answer={(
          <>
            아니다. 이 세 숫자는 서로의 크기만 비교할 수 있는 <strong>raw score</strong>다.
            어떤 결과들이 가능한지 정하고, 음수가 없고 합이 1인 질량으로 정규화해야 확률분포가 된다.
            신경망에서는 뒤에서 softmax가 그 변환을 맡는다.
          </>
        )}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          확률을 처음 배울 때 가장 먼저 분리할 것은 <strong>가능한 세계</strong>와
          <strong> 실제로 관측한 하나</strong>다. 동전을 던지기 전에는 앞면과 뒷면이 모두
          가능하다. 던진 뒤 앞면이 나왔다면 그것은 가능한 세계 전체가 아니라 분포에서 나온
          sample 하나다. LLM도 같다. vocabulary 전체가 가능한 결과이고, 다음 token 하나는 그
          분포에서 선택된 관측이다.
        </p>
        <p>
          일반 확률론에서 <strong>sample space</strong>는 원시 결과 전체,
          <strong> random variable</strong>은 그 결과를 우리가 계산할 값으로 옮기는 함수,
          <strong> support</strong>는 실제로 양의 질량이나 밀도를 받을 수 있는 값의 범위다.
          인용한 Deep Learning Book은 가능한 상태 집합을 PMF/PDF의 <em>domain</em>이라고
          부른다. 이 글은 여러 분야의 표기를 연결하기 위해 sample space와 support라는 관용어를
          함께 쓴다.
        </p>
      </div>

      <ConceptPrimer
        title="실험 전과 후를 가르는 다섯 명사"
        items={[
          {
            term: 'Sample space Ω',
            meaning: '실험에서 나올 수 있는 원시 결과 전체다.',
            why: '무엇이 가능한지 먼저 고정해야 빠진 결과 없이 확률을 배정한다.',
          },
          {
            term: '확률변수 X',
            meaning: '원시 결과를 숫자나 class 값에 대응시키는 함수다.',
            why: '동전 앞면, token B 같은 사건을 계산 가능한 값으로 바꾼다.',
          },
          {
            term: 'Support',
            meaning: '분포가 실제 질량 또는 밀도를 둘 수 있는 값의 범위다.',
            why: '실제 사건 P>0인데 모델 Q=0인 치명적 누락을 찾는 기준이 된다.',
          },
          {
            term: '분포 P',
            meaning: '각 가능한 값이 얼마나 자주 나타날지를 배정한 규칙이다.',
            why: '한 번 나온 값이 아니라 반복 실험 전의 불확실성 전체를 표현한다.',
          },
          {
            term: '관측 sample x',
            meaning: '분포에서 실제로 한 번 또는 여러 번 얻은 값이다.',
            why: '모르는 분포와 parameter를 추정하는 증거가 된다.',
          },
        ]}
      />

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-3">
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">1 · 질량은 음수가 아니다</p>
          <MathFormula display>{String.raw`P(X=x)\ge 0`}</MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">2 · 가능한 값을 빠짐없이 합친다</p>
          <MathFormula display>{String.raw`\sum_{x\in\mathcal{X}} P(X=x)=1`}</MathFormula>
        </FormulaFrame>
        <FormulaFrame emphasis>
          <p className="mb-2 text-xs font-bold text-muted-foreground">3 · raw weight를 정규화한다</p>
          <MathFormula display>{String.raw`P_i=\frac{w_i}{\sum_j w_j}`}</MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="PMF는 가능한 이산 값마다 확률 질량을 둔다. 마지막 식은 양의 raw weight를 합계로 나눠 확률분포로 만드는 가장 단순한 정규화다."
        symbols={[
          [String.raw`\mathcal{X}`, '확률변수 X가 가질 수 있는 값의 집합'],
          [String.raw`w_i`, '아직 합이 1일 필요가 없는 양의 raw weight'],
          [String.raw`P_i`, '정규화 뒤 i번째 결과에 배정된 확률 질량'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          분포의 <strong>기대값</strong>은 가능한 값을 그 확률만큼 가중한 중심이다. 분산은 각
          값이 그 중심에서 떨어진 거리를 제곱해 평균낸다. 둘은 분포 전체의 서로 다른 요약이다.
          기대값이 같아도 양쪽 끝에 질량이 몰린 분포는 분산이 더 클 수 있다.
        </p>
        <p>
          아래 실험기의 <strong>평균 surprisal H</strong>는 결과 하나를 봤을 때의 놀라움
          <MathFormula>{String.raw`-\log_2 P(x)`}</MathFormula>을 확률만큼 평균낸 값이다.
          드문 결과일수록 더 놀랍고, 여기서는 단위를 bit로 표시한다. 이 양을 entropy라고
          부르는 이유와 cross-entropy·KL과의 관계는 05절에서 다시 쌓는다. 일반 기대값의 함수에
          <MathFormula>{String.raw`f(x)=-\log_2P(x)`}</MathFormula>를 넣은 것이 바로 이 평균 surprisal이다.
        </p>
      </div>
      <div className="not-prose my-6 grid min-w-0 gap-3 md:grid-cols-2">
        <FormulaFrame>
          <MathFormula display>
            {String.raw`\mathbb{E}_{X\sim P}[f(X)]=\sum_x \underbrace{f(x)}_{\text{값에 적용할 함수}}\underbrace{P(X=x)}_{\text{그 값의 질량}}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <MathFormula display>
            {String.raw`\operatorname{Var}(X)=\mathbb{E}\!\left[\underbrace{(X-\mu)^2}_{\text{중심에서의 제곱 거리}}\right]`}
          </MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="일반 기대값은 X에 적용한 함수 f(X)를 확률로 가중한 평균이다. f(x)=x이면 분포의 중심 E[X]가 되고, f(x)=(x-μ)²이면 양쪽 편차가 상쇄되지 않는 분산이 된다."
        symbols={[
          [String.raw`f(X)`, '확률변수의 값에 적용한 임의의 측정 함수'],
          [String.raw`\mu=\mathbb{E}[X]`, '분포의 가중 중심'],
          [String.raw`\operatorname{Var}(X)`, '중심 주변 퍼짐의 평균 제곱 크기'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          위 합은 이산형 분포의 계산이다. 연속형에서는 한 점의 density를 확률처럼 더하지 않고,
          아주 작은 구간의 질량을 적분한다. 가능한 값 전체를 가중한다는 뜻은 같고 계산 기호만
          합에서 적분으로 바뀐다.
        </p>
      </div>
      <div className="not-prose my-6 grid min-w-0 gap-3 md:grid-cols-2">
        <FormulaFrame>
          <MathFormula display>
            {String.raw`\mathbb{E}_{X\sim p}[f(X)]=\int \underbrace{f(x)}_{\text{값에 적용할 함수}}\underbrace{p(x)\,dx}_{\text{작은 구간의 질량}}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <MathFormula display>
            {String.raw`\operatorname{Var}(X)=\int \underbrace{(x-\mu)^2}_{\text{중심에서의 제곱 거리}}p(x)\,dx`}
          </MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="연속형 기대값과 분산은 density 높이 하나가 아니라 구간 질량 p(x)dx를 모든 x에 걸쳐 적분한다. 적분 구간은 distribution support 전체다."
        symbols={[
          [String.raw`p(x)\,dx`, 'x 주변의 아주 작은 구간에 배정된 probability mass'],
          [String.raw`\int`, '연속 support 전체의 작은 질량을 합치는 연산'],
          [String.raw`\mu`, '연속 분포에서도 동일한 기대값 중심'],
        ]}
      />

      <FormulaFrame>
        <MathFormula display>
          {String.raw`\mathbb{E}[aX+b]=\underbrace{a\,\mathbb{E}[X]}_{\text{scale을 밖으로 이동}}+\underbrace{b}_{\text{상수 이동 유지}}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="기대값은 linear하다. 확률변수를 scale하거나 상수만큼 옮긴 뒤 평균내는 것과, 먼저 평균낸 값을 같은 방식으로 바꾸는 것이 같다. 후속 절에서 sample별 loss를 평균해 empirical expectation으로 읽는 기본 대수다."
        symbols={[
          [String.raw`a`, '확률변수 전체에 공통으로 곱하는 scale'],
          [String.raw`b`, '모든 sample에 공통으로 더하는 상수'],
          [String.raw`\mathbb{E}`, '분포의 확률로 가중한 평균 연산'],
        ]}
      />

      <DistributionMomentLab />

      <Misconception>
        연속형 PDF의 높이 <MathFormula>{String.raw`p(x)`}</MathFormula>는 한 점의 확률이 아니다.
        밀도는 1보다 클 수도 있고, 실제 구간 확률은
        {' '}<MathFormula>{String.raw`P(a\le X\le b)=\int_a^b p(x)\,dx`}</MathFormula>처럼
        면적으로 구한다. 이산 PMF의 막대 높이와 연속 density의 높이를 같은 것으로 읽지 않는다.
      </Misconception>
    </section>
  );
}

function JointConditionalBayes() {
  return (
    <section id="joint-conditional-bayes" className="mb-20 scroll-mt-20">
      <SectionHeading index="02" kicker="EVIDENCE UPDATE">
        함께 일어날 확률에서, 알고 난 뒤의 확률을 어떻게 꺼낼까?
      </SectionHeading>

      <QuestionLead
        question="정확도 99%인 검사가 positive면 실제 상태일 확률도 99%일까?"
        answer={(
          <>
            일반적으로 아니다. <strong>P(+|D)</strong>는 상태 D를 이미 안다는 조건에서 검사가
            positive일 확률이고, 우리가 원하는 <strong>P(D|+)</strong>는 positive를 본 뒤
            상태 D일 확률이다. 두 방향을 바꾸려면 원래 D가 얼마나 드문지와 위양성 경로까지
            합쳐야 한다.
          </>
        )}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          두 변수를 동시에 기록한 표를 생각하자. 각 칸의
          <strong> joint probability</strong>는 두 사건이 함께 일어날 질량이다. 한 변수를
          잠시 잊고 행이나 열 전체를 더하면 <strong>marginal</strong>이 된다. 반대로 특정 열을
          이미 관측했다고 고정하고 그 열 안에서 다시 합이 1이 되도록 나누면
          <strong> conditional</strong>이 된다.
        </p>
        <p>
          이 “다시 정규화”가 핵심이다. 조건 사건의 확률이 0이면 나눌 질량 자체가 없으므로
          conditional은 정의되지 않는다. 뒤에서 모델 Q가 실제 사건에 0을 준 경우 정보 비용이
          무한대로 발산하는 것과 닮았지만, 여기서는 먼저 <strong>0으로 나눠 정의할 수 없는
          문제</strong>라는 점을 구분해야 한다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 lg:grid-cols-3">
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">JOINT · 함께</p>
          <MathFormula display>{String.raw`p(x,y)`}</MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">MARGINAL · y를 합쳐 지움</p>
          <MathFormula display>{String.raw`p(x)=\sum_y p(x,y)`}</MathFormula>
        </FormulaFrame>
        <FormulaFrame emphasis>
          <p className="mb-2 text-xs font-bold text-muted-foreground">CONDITIONAL · y 안에서 재정규화</p>
          <MathFormula display>{String.raw`p(x\mid y)=\frac{p(x,y)}{p(y)},\quad p(y)>0`}</MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="Marginalization은 관심 없는 가능한 경로를 모두 더한다. Conditioning은 관측한 경로만 남긴 뒤 그 안에서 다시 합이 1이 되게 나눈다."
        symbols={[
          [String.raw`p(x,y)`, 'x와 y가 함께 일어나는 joint 질량'],
          [String.raw`\sum_y`, '가능한 y 경로를 모두 합쳐 y를 지우는 연산'],
          [String.raw`p(y)>0`, 'conditional을 정의하기 위한 분모 조건'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Bayes rule은 조건부 방향을 뒤집는 암기 주문이 아니다. 관측 전 질량
          <strong> prior</strong>에, 그 상태에서 해당 관측이 나올
          <strong> likelihood</strong>를 곱한다. 그런 다음 관측이 생기는 모든 상태 경로를 더한
          <strong> evidence</strong>로 나누어 posterior를 만든다. 상태가 둘이 아니라 여러
          class라면 evidence의 합도 가능한 class 수만큼 늘어난다. 한 class의 base rate가
          바뀌면 그 prior 질량을 바꾼 뒤 모든 class 경로를 다시 합쳐 정규화해야 한다.
        </p>
      </div>
      <div className="not-prose my-7 grid min-w-0 gap-3">
        <FormulaFrame emphasis>
          <p className="mb-2 text-xs font-bold text-muted-foreground">POSTERIOR · 관측 뒤 다시 나눈 질량</p>
          <MathFormula display className="text-sm sm:text-base">
            {String.raw`P(D\mid +)=
              \frac{
                \underbrace{P(+\mid D)}_{\text{D일 때 양성}}
                \underbrace{P(D)}_{\text{관측 전 D}}
              }{
                \underbrace{P(+)}_{\text{양성 전체}}
              }`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">EVIDENCE · 양성이 생기는 모든 경로</p>
          <MathFormula display className="text-sm sm:text-base">
            {String.raw`\begin{aligned}
              P(+)={}&
              \underbrace{P(+\mid D)P(D)}_{\text{D 경로}}
              \\
              &+
              \underbrace{P(+\mid \neg D)P(\neg D)}_{\text{D가 아닌 경로}}
              \end{aligned}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">여러 class · 모든 상태 경로를 합친다</p>
          <MathFormula display className="text-sm sm:text-base">
            {String.raw`P(Y=y\mid +)=
              \frac{
                \underbrace{P(+\mid y)P(y)}_{\text{선택한 class 경로}}
              }{
                \underbrace{\sum_{y'\in\mathcal{Y}}P(+\mid y')P(y')}_{\text{가능한 모든 class 경로}}
              }`}
          </MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="분자는 선택한 상태 경로에서 positive가 된 질량이다. 분모는 가능한 모든 상태 경로에서 positive가 된 질량을 모은 evidence다. 이진이면 D와 ¬D 두 항이고, 여러 class면 y′에 대한 합으로 늘어난다. 그래서 prior가 바뀌면 likelihood가 같아도 posterior가 바뀐다."
        symbols={[
          ['prior', '관측 전 상태의 base rate'],
          ['likelihood', '상태를 고정했을 때 지금 관측이 나올 확률'],
          ['evidence', '상태를 모른 채 볼 때 지금 관측이 나올 전체 확률'],
          ['posterior', '관측을 반영해 다시 정규화한 상태 확률'],
        ]}
      />

      <BayesEvidenceLab />
    </section>
  );
}

function ProbabilityAndLikelihood() {
  return (
    <section id="probability-likelihood" className="mb-20 scroll-mt-20">
      <SectionHeading index="03" kicker="DATA FIXED">
        같은 식이 probability였다가 likelihood가 되는 순간
      </SectionHeading>

      <QuestionLead
        question="동전의 앞면 확률 θ와 앞면 8회라는 관측 중 무엇을 고정했는가?"
        answer={(
          <>
            <strong>Probability</strong>는 θ를 고정하고 앞으로 나올 data를 비교한다.
            <strong> Likelihood</strong>는 이미 본 data를 고정하고 어느 θ가 그것을 더 잘
            설명하는지 비교한다. 식의 숫자가 같아도 움직이는 축과 질문이 다르다.
          </>
        )}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          여기서 “앞면 8회”도 두 사건으로 나뉜다. <code>HHHTH...</code>처럼 열 번의
          <strong> 순서까지 고정한 한 sequence</strong>의 확률에는 그 순서를 만드는 경로가
          하나뿐이다. 반면 순서는 무시하고 <strong>앞면 개수만 8회</strong>라고 말하면,
          열 자리 중 앞면 자리를 고르는 모든 순서를 더해야 한다. 일반적으로 시행이 n번이고
          앞면이 k번이면 뒷면은 n-k번이다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 md:grid-cols-2">
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">순서가 고정된 한 관측</p>
          <MathFormula display>
            {String.raw`P(\text{고정 순서}\mid\theta)=
              \underbrace{\theta^k}_{\text{앞면 k번}}
              \underbrace{(1-\theta)^{n-k}}_{\text{뒷면 n-k번}}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame emphasis>
          <p className="mb-2 text-xs font-bold text-muted-foreground">순서를 무시한 count 사건</p>
          <MathFormula display>
            {String.raw`P(K=k\mid\theta)=
              \underbrace{\binom{n}{k}}_{\text{가능한 순서 수}}
              \theta^k(1-\theta)^{n-k}`}
          </MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="n=10, k=8을 넣으면 고정 순서는 θ⁸(1-θ)²이고 count 사건에는 C(10,8)=45가 더 붙는다. 조합계수는 θ와 무관한 상수라 사건 확률의 절대값은 바꾸지만 어느 θ가 최대인지에는 영향을 주지 않는다."
        symbols={[
          [String.raw`\binom{n}{k}`, 'n자리 중 앞면 k자리를 고르는 서로 다른 순서 수'],
          [String.raw`n`, '전체 독립 시행 수'],
          [String.raw`k`, '관측한 앞면 수'],
          [String.raw`\theta`, '비교하려는 동전의 앞면 parameter'],
          [String.raw`K`, 'n번 중 앞면이 나온 횟수라는 확률변수'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          N개 sample이 같은 θ 아래에서 서로 독립이라고 가정하면 각 관측 확률을 곱한다. 작은 확률을
          많이 곱하면 수치가 0에 가까워지고 미분도 불편하다. 자연로그는 단조 증가하므로 가장
          큰 θ의 위치를 바꾸지 않으면서 곱을 합으로 바꾼다. 이것이 log-likelihood를 쓰는
          수학적 이유다. Bernoulli에서는 n번 중 앞면 k번을 관측한 log-likelihood를 미분해
          0으로 두면 MLE가 k/n으로 나온다.
        </p>
        <p>
          여기서 <strong>미분</strong>은 θ를 아주 조금 움직였을 때 log-likelihood가 어느 방향으로 얼마나
          변하는지를 나타내는 순간 변화율이다. 그래프의 내부에서 가장 높은 점에 도달하면 오른쪽으로 조금
          가도, 왼쪽으로 조금 가도 더 높아지지 않으므로 그 순간의 기울기는 0이다. 그래서 먼저 기울기를
          0으로 만드는 θ 후보를 찾고, 0과 1 사이에서 실제 최대점인지 확인한다.
        </p>
      </div>

      <div className="not-prose my-6 grid min-w-0 gap-3">
        <FormulaFrame>
          <MathFormula display>
            {String.raw`\mathcal{L}(\theta;\mathcal{D})=
              \underbrace{\prod_{i=1}^{N}p(x^{(i)};\theta)}_{\text{독립 관측의 likelihood 곱}}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <MathFormula display>
            {String.raw`\log\mathcal{L}(\theta;\mathcal{D})=
              \underbrace{\sum_{i=1}^{N}\log p(x^{(i)};\theta)}_{\text{곱을 합으로 바꾼 같은 순위}}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <MathFormula display>
            {String.raw`\ell(\theta)=
              \underbrace{k\log\theta}_{\text{앞면 k번}}
              +
              \underbrace{(n-k)\log(1-\theta)}_{\text{뒷면 n-k번}}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame emphasis>
          <MathFormula display>
            {String.raw`0=\frac{d\ell}{d\theta}
              =\frac{k}{\theta}-\frac{n-k}{1-\theta}
              \quad\Longrightarrow\quad
              \hat{\theta}_{\mathrm{MLE}}=\frac{k}{n}`}
          </MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="MLE는 관측 data를 고정하고 그 data의 likelihood를 최대화하는 parameter를 고른다. log는 argmax를 보존하고 곱셈만 덧셈으로 바꾼다. 미분할 때 d log θ/dθ=1/θ이고, chain rule 때문에 d log(1-θ)/dθ=-1/(1-θ)가 된다. 두 변화율의 합을 0으로 두는 것은 앞면 k번이 θ를 올리려는 힘과 뒷면 n-k번이 θ를 내리려는 힘이 균형을 이루는 지점을 찾는 일이다. n=10, k=8이면 k/n=0.8이고, 처음 보는 다른 n과 k에도 같은 도출을 적용한다."
        symbols={[
          [String.raw`\mathcal{D}`, '이미 관측해 고정한 sample 집합'],
          [String.raw`N`, '일반 dataset에 들어 있는 독립 sample 수'],
          [String.raw`\mathcal{L}(\theta;\mathcal{D})`, 'θ 후보를 비교하는 함수이며 θ의 확률분포가 아님'],
          [String.raw`\ell(\theta)`, 'Bernoulli count를 k와 n-k로 묶은 log-likelihood'],
          [String.raw`\frac{d\ell}{d\theta}`, 'θ를 아주 조금 바꿀 때 log-likelihood가 변하는 순간 기울기'],
          [String.raw`\hat{\theta}_{\mathrm{MLE}}`, 'likelihood를 가장 크게 만든 parameter estimate'],
        ]}
      />

      <Misconception>
        likelihood를 θ에 대해 적분해 1로 만들 필요는 없다. θ 자체의 불확실성을 확률분포로
        말하려면 θ에 prior를 두고 Bayes rule로 posterior를 만드는 추가 단계가 필요하다.
      </Misconception>
    </section>
  );
}

function LogitToLoss() {
  return (
    <section id="logit-loss" className="mb-20 scroll-mt-20">
      <SectionHeading index="04" kicker="MODEL RUNTIME">
        Logit은 어떻게 probability가 되고, 정답은 어떻게 loss가 될까?
      </SectionHeading>

      <QuestionLead
        question="정답이 B인데 모델이 A에 더 큰 logit을 주었다면 학습 신호를 어떻게 숫자로 만들까?"
        answer={(
          <>
            softmax로 모든 class의 score를 하나의 분포 Q로 바꾼 뒤, 정답 B에 준 확률
            <strong> Q(B)</strong>의 negative log를 취한다. 정답 확률이 작을수록 loss가
            빠르게 커져 그 오류를 더 강하게 수정한다.
          </>
        )}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Softmax는 각 score를 지수화해 양수로 만들고 전체 합으로 나눈다. 그러나 큰 logit을
          그대로 지수화하면 overflow가 날 수 있다. 모든 logit에서 같은 최댓값을 빼도 class
          사이 차이는 같고 결과 분포도 같다. 이 항등식을 이용해 아래 교육용 Lab은 먼저 최댓값
          <MathFormula>{String.raw`m=\max_j z_j`}</MathFormula>을 빼는 stabilized form을 쓴다.
          이는 인용한 PyTorch 문서가 특정 내부 kernel을 보장한다는 뜻이 아니라, 같은 softmax를
          overflow에 더 강한 식으로 계산하는 이 글의 구현 선택이다.
        </p>
        <p>
          PyTorch의 <code>CrossEntropyLoss</code>는 normalized probability가 아니라
          <strong> unnormalized logits</strong>를 입력으로 받는다. class index 정답에서는
          그 loss 값이 log-softmax를 적용한 뒤 NLL을 계산한 것과 수학적으로 동치다.
          soft target을 쓸 때는 target이 input과 같은
          class shape를 갖고, 각 값이 0과 1 사이이며 class 합이 1이어야 한다. PyTorch가 이
          확률 제약을 강제로 검증하지 않으므로 target을 임의 숫자로 넣으면 오해를 부르는 loss
          값과 불안정한 gradient가 나올 수 있다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 md:grid-cols-2">
        <FormulaFrame emphasis>
          <p className="mb-2 text-xs font-bold text-muted-foreground">STABILIZED SOFTMAX</p>
          <MathFormula display>
            {String.raw`Q_i=
              \frac{\underbrace{\exp((z_i-m)/T)}_{\text{i의 양의 상대 질량}}}
              {\underbrace{\sum_j\exp((z_j-m)/T)}_{\text{모든 class 질량}}}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">한 정답의 NEGATIVE LOG-LIKELIHOOD</p>
          <MathFormula display>
            {String.raw`\ell_{\mathrm{NLL}}(z,y)=
              \underbrace{-\log Q_y}_{\text{정답에 준 확률의 비용}}`}
          </MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="Softmax는 absolute score가 아니라 class 사이 차이를 분포로 바꾼다. 공통 상수를 더하거나 빼도 Q는 같고, temperature T는 차이를 나누어 분포의 날카로움만 바꾼다."
        symbols={[
          [String.raw`z_i`, 'i번째 class의 unnormalized logit'],
          [String.raw`m=\max_j z_j`, 'overflow를 막기 위해 공통으로 빼는 최대 logit'],
          [String.raw`T`, 'logit 차이의 scale을 바꾸는 양의 temperature'],
          [String.raw`Q_y`, '모델 분포가 정답 y에 배정한 확률'],
        ]}
      />

      <ScoreToLossLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          한 sample의 정답이 one-hot이면 cross-entropy는 그 정답의 NLL과 같다. sample이 많이
          모이면 각 sample NLL의 평균은 empirical label distribution
          <MathFormula>{String.raw`\hat P`}</MathFormula> 아래에서 모델 Q를 읽는
          cross-entropy가 된다. 즉 loss는 갑자기 등장한 벌점 공식이 아니라
          <strong> 관측 data를 모델 분포가 얼마나 비싸게 설명하는가</strong>의 평균이다.
        </p>
      </div>
      <FormulaFrame>
        <MathFormula display>
          {String.raw`\widehat H(\hat P,Q)=
            \underbrace{-\frac{1}{N}\sum_{i=1}^{N}\log Q(y^{(i)}\mid x^{(i)})}_{\text{sample NLL의 empirical 평균}}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="Training loop가 minibatch loss를 평균내는 것은 empirical distribution에서 negative log-likelihood의 기대값을 근사하는 일이다."
        symbols={[
          [String.raw`N`, 'minibatch 또는 dataset의 sample 수'],
          [String.raw`Q(y^{(i)}\mid x^{(i)})`, 'i번째 입력에서 실제 정답에 준 조건부 확률'],
          [String.raw`\widehat H`, '유한 sample로 계산한 empirical cross-entropy'],
        ]}
      />
    </section>
  );
}

function InformationCosts() {
  return (
    <section id="information-costs" className="mb-20 scroll-mt-20">
      <SectionHeading index="05" kicker="CODE LENGTH">
        Surprisal, entropy, cross-entropy, KL은 서로 어떤 비용인가?
      </SectionHeading>

      <QuestionLead
        question="확률이 0.5에서 0.25로 절반이 되면 왜 정보 비용은 일정량만 늘어날까?"
        answer={(
          <>
            독립 사건의 확률은 곱해지지만, 메시지 비용은 더해지길 원한다. log가 곱을 합으로
            바꾸므로 한 사건의 surprisal을 <strong>-log probability</strong>로 정의한다.
            드문 사건일수록 더 긴 설명이 필요하다는 뜻이다.
          </>
        )}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>Surprisal</strong>은 실제로 나온 사건 하나의 비용이다. <strong>Entropy</strong>는
          P에서 사건을 계속 뽑을 때 P 자신의 surprisal 평균이다.
          <strong> Cross-entropy</strong>는 P에서 나온 사건을 다른 분포 Q가 준비한 code로
          표현할 때의 평균 비용이다. 마지막으로 <strong>KL divergence</strong>는 Q를 써서
          추가로 지불한 비용만 남긴다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 md:grid-cols-2">
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">한 사건</p>
          <MathFormula display>
            {String.raw`I_P(x)=\underbrace{-\log P(x)}_{\text{P가 본 사건 x의 surprisal}}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">P 자신의 평균 비용</p>
          <MathFormula display>
            {String.raw`H(P)=\underbrace{-\sum_x P(x)\log P(x)}_{\text{P 아래 평균 surprisal}}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">P의 사건을 Q로 읽는 평균 비용</p>
          <MathFormula display>
            {String.raw`H(P,Q)=\underbrace{-\sum_x P(x)\log Q(x)}_{\text{Q code의 평균 길이}}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame emphasis>
          <p className="mb-2 text-xs font-bold text-muted-foreground">Q 때문에 더 든 비용</p>
          <MathFormula display>
            {String.raw`D_{\mathrm{KL}}(P\Vert Q)=
              \underbrace{H(P,Q)}_{\text{Q로 읽은 비용}}-
              \underbrace{H(P)}_{\text{P 자체 비용}}`}
          </MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="P(x)=0인 entropy 항은 p→0+에서 p log p→0인 연속 극한에 따라 0·log 0:=0으로 둔다. 이는 P(x)>0인데 Q(x)=0일 때 Q code 비용이 발산하는 아래 support failure와 다른 규약이다. 같은 실제 P를 두고 모델 Q만 바꾸면 H(P)는 고정이므로 cross-entropy와 forward KL(P||Q)은 같은 Q 최적점을 갖는다."
        symbols={[
          [String.raw`I_P(x)`, 'P 아래에서 사건 x 하나가 주는 surprisal'],
          [String.raw`H(P)`, 'P 자체의 평균 불확실성'],
          [String.raw`H(P,Q)`, 'P의 사건을 Q code로 표현한 평균 비용'],
          [String.raw`D_{\mathrm{KL}}(P\Vert Q)`, 'Q를 사용해 추가로 든 비대칭 비용'],
        ]}
      />

      <div data-formula-pair className="not-prose my-7 min-w-0">
        <div className="grid min-w-0 gap-4 border-y border-border py-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">
            <p className="text-sm font-bold">Support가 어긋나면 평균이 아니라 한 항에서 이미 실패한다</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              실제 P가 사건 x에 양의 질량을 두는데 모델 Q가 0을 주었다고 하자. P 기준
              self-information -log P(x)는 유한하다. 무한대로 가는 것은 그 사건을
              <strong className="text-foreground"> Q 기준으로 읽는 -log Q(x)</strong>다.
              이 항에 P(x)&gt;0이 곱해지므로 cross-entropy와 forward KL도 무한대가 된다.
            </p>
          </div>
          <div className="min-w-0 rounded-md border border-amber-600/30 bg-amber-500/[0.05] p-4">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-200">SUPPORT FAILURE</p>
            <MathFormula display className="text-sm">
              {String.raw`P(x)>0,\ Q(x)=0`}
            </MathFormula>
            <MathFormula display className="text-sm">
              {String.raw`-\log Q(x)=+\infty`}
            </MathFormula>
          </div>
        </div>
        <FormulaNote
          meaning="왜 Q(x)=0에서 발산하나: 실제로 일어나는 사건 P(x)>0에 모델이 확률 0을 주면 그 사건을 표현할 Q code 길이 -log Q(x)가 무한대가 된다. 두 줄은 support 누락 조건과 그 즉시 생기는 비용을 한 쌍으로 읽는다."
          symbols={[
            [String.raw`P(x)>0`, '실제 분포에서 사건 x가 일어날 가능성이 양수'],
            [String.raw`Q(x)=0`, '모델이 같은 사건을 불가능하다고 선언한 support 누락'],
            [String.raw`-\log Q(x)`, '모델 Q로 사건 x를 표현할 때 필요한 정보 비용'],
          ]}
        />
      </div>

      <Misconception>
        KL은 대칭 distance가 아니다.
        {' '}<MathFormula>{String.raw`D_{\mathrm{KL}}(P\Vert Q)`}</MathFormula>와
        {' '}<MathFormula>{String.raw`D_{\mathrm{KL}}(Q\Vert P)`}</MathFormula>는 기대값을
        취하는 분포와 크게 벌주는 support 누락 방향이 달라 일반적으로 값이 다르다.
      </Misconception>

      <StopRule title="단위에서 멈춘다.">
        log base 2를 쓰면 단위는 bit, 자연로그를 쓰면 nat다. 둘은 상수 배만 다르지만 숫자를
        비교할 때 단위를 섞으면 안 된다. 딥러닝 loss 구현은 보통 자연로그를 사용한다.
      </StopRule>
    </section>
  );
}

function ProbabilityBoundaries() {
  return (
    <section id="probability-boundaries" className="mb-20 scroll-mt-20">
      <SectionHeading index="06" kicker="WHAT IT DOES NOT PROMISE">
        Softmax 0.9와 낮은 NLL이 보장하지 않는 것
      </SectionHeading>

      <QuestionLead
        question="모델이 0.9라고 말하면 실제로 열 번 중 아홉 번 맞는다고 믿어도 될까?"
        answer={(
          <>
            softmax는 class 축 합을 1로 만들 뿐, 그 숫자와 실제 장기 정확도가 일치하도록 보장하지
            않는다. 이 일치를 별도로 측정하는 개념이 <strong>calibration</strong>이다.
          </>
        )}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Guo et al.은 calibration을 같은 confidence를 낸 예측 집단의 실제 정확도로 정의한다.
          confidence 0.8인 예측 100개를 모았을 때 약 80개가 맞아야 잘 calibrated된 것이다.
          이 정의는 <strong>집단 조건부 빈도</strong>에 관한 것이지, 특정 sample 하나가 “80%
          만큼 참”이라는 뜻이 아니다.
        </p>
      </div>
      <FormulaFrame emphasis>
        <MathFormula display>
          {String.raw`\underbrace{P(\hat Y=Y\mid \hat P=p)}_{\text{confidence p 집단의 실제 정답률}}
            =\underbrace{p}_{\text{모델이 말한 confidence}}`}
        </MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="Perfect calibration은 같은 confidence를 가진 예측 집단에서 장기 정답 비율이 그 confidence와 맞는다는 조건이다. 개별 예측의 진실, 원인, 분포 밖 안전성을 보장하는 식이 아니다."
        symbols={[
          [String.raw`\hat Y`, '모델이 고른 class'],
          [String.raw`Y`, '실제 정답 class'],
          [String.raw`\hat P`, '모델이 예측 class에 붙인 confidence'],
          [String.raw`p`, '같은 confidence로 묶은 집단의 값'],
        ]}
      />

      <div className="not-prose my-7 grid min-w-0 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {[
          {
            title: 'Normalization',
            body: 'softmax 출력이 0과 1 사이이고 class 합이 1이라는 계산 계약',
            boundary: '실제 정답 빈도와 일치한다는 보장은 아님',
          },
          {
            title: 'Calibration',
            body: '같은 confidence 집단의 장기 정확도와 confidence가 맞는 성질',
            boundary: '개별 sample certainty나 원인 설명은 아님',
          },
          {
            title: 'Uncertainty',
            body: 'aleatoric uncertainty(데이터 자체 noise)와 epistemic uncertainty(모델·parameter가 몰라서 생기는 불확실성)를 구분하는 더 큰 문제',
            boundary: 'softmax entropy 하나만으로 모두 측정되지 않음',
          },
          {
            title: 'Deployment validity',
            body: '학습 때의 prior와 conditional 관계가 실제 배포에서도 유지되는지에 관한 증거',
            boundary: 'train NLL이 낮다는 사실만으로 이전되지 않음',
          },
        ].map((item) => (
          <div key={item.title} className="min-w-0 bg-background p-4 sm:p-5">
            <p className="text-sm font-bold">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            <p className="mt-3 border-t border-border pt-3 text-xs font-semibold leading-relaxed text-amber-800 dark:text-amber-200">
              경계 · {item.boundary}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Guo et al.의 2017년 실험은 당시 여러 vision/NLP 설정에서 현대 신경망이 잘
          calibrated되지 않았음을 보였고, validation NLL로 scalar temperature를 맞추는 방법이
          비교 설정에서 효과적임을 보고했다. Temperature scaling은 logit을 T로 나누되 argmax를
          바꾸지 않아 class prediction과 accuracy는 그대로 둔다. 다만 모든 dataset에서 언제나
          이긴다는 정리가 아니며, 원문에도 Reuters 예외와 binning·split 측정 한계가 있다.
        </p>
      </div>
      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        <FormulaFrame>
          <p className="mb-2 text-xs font-bold text-muted-foreground">TEMPERATURE · 확률의 날카로움</p>
          <MathFormula display>
            {String.raw`Q_i^{(T)}=
              \frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)}`}
          </MathFormula>
        </FormulaFrame>
        <FormulaFrame emphasis>
          <p className="mb-2 text-xs font-bold text-muted-foreground">ARGMAX · 예측 class는 그대로</p>
          <MathFormula display>
            {String.raw`\underbrace{\arg\max_i Q_i^{(T)}}_{\text{temperature 적용 뒤}}
              =
              \underbrace{\arg\max_i z_i}_{\text{원래 logit 순위}}`}
          </MathFormula>
        </FormulaFrame>
      </div>
      <FormulaNote
        meaning="양의 T는 모든 logit 차이의 scale만 바꾼다. T>1이면 더 평평하고 T<1이면 더 날카로워지지만 class 순위는 유지된다. T는 별도 validation data의 NLL로 맞춘다."
        symbols={[
          [String.raw`T>0`, 'calibration용으로 맞추는 하나의 양의 scalar'],
          [String.raw`Q_i^{(T)}`, 'temperature 적용 뒤 i번째 class 확률'],
          [String.raw`\arg\max`, '가장 큰 class의 위치이며 양의 T로 나누어도 불변'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          여기까지의 확률·정보 계산은 더 높은 글의 공통 바닥이다. 분류 loss를 실제 gradient로
          연결하려면 <InternalLink slug="cross-entropy">크로스 엔트로피</InternalLink>로,
          표본에서 얻은 수치가 배포로 얼마나 이전되는지 판단하려면
          {' '}<InternalLink slug="statistics-generalization">통계와 일반화</InternalLink>로
          올라간다. 시간에 따라 행동하고 보상을 받는 확률 과정은
          {' '}<InternalLink slug="rl-mdp-bellman">MDP와 Bellman</InternalLink>에서,
          확률분포로 data를 생성하는 모델 계보는
          {' '}<InternalLink slug="generative-theory">생성 모델 이론</InternalLink>에서 이어진다.
        </p>
      </div>

      <CapabilityCheck
        title="이 글만으로 확인할 수 있어야 하는 것"
        items={[
          'raw score, 분포, support, 관측 sample을 서로 다른 대상으로 설명한다.',
          'joint를 더해 marginal을 만들고, 양의 조건 질량 안에서 conditional을 다시 정규화한다.',
          'prior와 likelihood를 곱하고 모든 관측 경로로 나눠 posterior를 계산한다.',
          '순서 고정 sequence와 count 사건에서 조합계수의 유무를 구분한다.',
          'likelihood의 data와 parameter 중 무엇이 고정되는지 말하고 log-likelihood로 MLE를 구한다.',
          'logit에서 stabilized softmax, 정답 NLL, empirical cross-entropy로 계산을 추적한다.',
          'entropy, cross-entropy, forward KL을 평균 비용의 질문으로 구분한다.',
          'P가 놓친 사건과 Q가 놓친 사건의 surprisal·support failure를 구분한다.',
          'softmax normalization, calibration, individual certainty, deployment validity를 분리한다.',
          '자연로그의 nat와 밑 2 로그의 bit를 숫자와 함께 표시한다.',
        ]}
      />

      <SourceNotes
        sources={[
          {
            label: 'Deep Learning Book · Probability and Information Theory',
            href: 'https://www.deeplearningbook.org/contents/prob.html',
            note: 'PMF/PDF, joint·marginal·conditional, Bayes, expectation, entropy와 KL의 표준 정의',
          },
          {
            label: 'Deep Learning Book · Machine Learning Basics',
            href: 'https://www.deeplearningbook.org/contents/ml.html',
            note: 'maximum likelihood, log-likelihood, empirical distribution, NLL과 cross-entropy 연결',
          },
          {
            label: 'PyTorch · Softmax',
            href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.Softmax.html',
            note: '지정 차원에서 [0,1] 범위와 합 1을 만드는 runtime 계약',
          },
          {
            label: 'PyTorch · CrossEntropyLoss',
            href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html',
            note: 'unnormalized logits, class index와 soft-target 입력 계약',
          },
          {
            label: 'Guo et al. · On Calibration of Modern Neural Networks',
            href: 'https://proceedings.mlr.press/v70/guo17a.html',
            note: 'calibration의 집단 조건부 정의와 temperature scaling의 경험적 범위',
          },
          {
            label: 'Kendall & Gal · What Uncertainties Do We Need in Bayesian Deep Learning?',
            href: 'https://papers.neurips.cc/paper/7141-what-uncertainties-do-we-need-in-bayesian-deep-learning-for-computer-vision',
            note: 'aleatoric uncertainty를 관측 noise, epistemic uncertainty를 model parameter의 불확실성으로 구분하는 근거',
          },
          {
            label: 'Shannon · A Mathematical Theory of Communication',
            href: 'https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf',
            note: 'Section 6에서 choice, uncertainty와 entropy 식을 정의한 역사적 1차 문헌. 현대 neural loss 식의 근거는 위 교재·runtime 문서와 분리한다.',
          },
        ]}
      />
    </section>
  );
}

export default function ProbabilityInformationTheoryArticle() {
  return (
    <>
      <ScoreToDistribution />
      <JointConditionalBayes />
      <ProbabilityAndLikelihood />
      <LogitToLoss />
      <InformationCosts />
      <ProbabilityBoundaries />
    </>
  );
}
