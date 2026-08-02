import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  AutogradTapeLab,
  DirectionalDerivativeLab,
  GradcheckPathLab,
  GradientFlowLab,
  JacobianProductLab,
  LocalLinearizationLab,
} from './calculus-computational-graphs/viz/CalculusLabs';

const raw = String.raw;

function WhySensitivity() {
  return (
    <NlpSection
      id="why-sensitivity"
      marker="01"
      tone="teal"
      question="LLM, diffusion, RL, robot은 왜 같은 미분을 쓸까?"
      title="결과의 변화량을 원인의 책임으로 되돌린다"
    >
      <BeginnerOpening
        title="미분은 값을 하나 더 계산하는 공식이 아니라, 원인을 조금 바꿨을 때 결과가 얼마나 달라지는지 재는 도구입니다."
        description={<>온도 조절 손잡이, 자동차 가속 페달, 신경망의 weight처럼 입력을 조금 움직였을 때 출력이 민감하게 변할 수도 있고 거의 그대로일 수도 있다. 이 <strong className="text-foreground">작은 원인 변화와 결과 변화의 비율</strong>을 먼저 이해하면 gradient와 역전파가 같은 이야기로 이어진다.</>}
        familiarScene={<>산길에서 지금 서 있는 곳의 경사를 생각해 보자. 오른쪽으로 한 걸음 갔을 때 높이가 얼마나 오르는지 알면 어느 쪽이 오르막인지 판단할 수 있다. 지형 전체를 한 번에 외우지 않아도 현재 주변의 작은 변화를 이용해 다음 걸음을 정할 수 있다.</>}
        steps={[
          { label: '입력과 결과를 정한다', detail: '무엇을 원인으로 조금 바꾸고 어느 최종 값을 관찰할지 함수로 적는다.' },
          { label: '현재 위치의 변화율을 잰다', detail: 'Derivative와 gradient로 작은 입력 변화가 출력에 전달되는 방향과 크기를 구한다.' },
          { label: '여러 계산의 책임을 거꾸로 잇는다', detail: 'Chain rule과 계산 그래프로 마지막 결과의 변화를 앞쪽 원인까지 전달한다.' },
        ]}
      />
      <QuestionLead
        question="입력 하나를 아주 조금 바꾸면 최종 결과는 어느 방향으로 얼마나 움직일까?"
        answer="미분은 이 질문에 답하는 local sensitivity다. 모델 종류가 달라도 현재 실행을 작은 선형 map으로 바꾸고, 여러 map을 계산 그래프로 연결해 원인별 책임을 되돌리는 구조는 같다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          LLM에서는 한 weight가 다음 token loss를 얼마나 바꾸는지 묻는다. Diffusion
          model에서는 denoiser의 한 parameter가 noise prediction error를 얼마나 바꾸는지
          묻는다. Reinforcement learning에서는 policy parameter가 기대 reward를 어느
          방향으로 바꾸는지 묻는다. Robot에서는 joint angle의 작은 변화가 hand velocity를
          어떻게 바꾸는지 묻는다.
        </p>
        <p>
          네 문제의 겉모습은 다르지만 계산은 세 단계다. 먼저 현재 값을 forward로
          계산한다. 다음으로 각 연산의 작은 변화 규칙을 찾는다. 마지막으로 그 규칙을
          합성해 최종 결과의 sensitivity를 필요한 입력까지 전달한다. 이 글은 이 공통
          뼈대를 derivative, gradient, Jacobian, JVP, VJP와 autodiff runtime까지
          끊김 없이 만든다.
        </p>
      </div>

      <ConceptPrimer
        items={[
          {
            term: 'Function',
            meaning: '입력을 정해진 규칙으로 출력에 대응시키는 map이다.',
            why: 'layer, loss, robot kinematics를 같은 입력-출력 언어로 표현한다.',
          },
          {
            term: 'Sensitivity',
            meaning: '입력의 작은 변화에 출력이 얼마나 반응하는지 나타내는 비율이다.',
            why: '현재 parameter의 책임과 작은 perturbation의 효과를 구분한다.',
          },
          {
            term: 'Scalar objective',
            meaning: 'loss나 expected reward처럼 비교하고 최적화할 최종 값 하나다.',
            why: '많은 중간 출력의 책임을 마지막 scalar에서부터 역으로 모은다.',
          },
          {
            term: 'Computational graph',
            meaning: '실행한 연산과 값의 의존 관계를 node와 edge로 기록한 구조다.',
            why: '전체 식을 한 번에 미분하지 않고 local rule을 재사용한다.',
          },
        ]}
      />

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
        {[
          ['LLM', 'weight', 'token loss', '학습 책임'],
          ['Diffusion', 'denoiser parameter', 'noise error', '복원 책임'],
          ['RL', 'policy parameter', 'expected reward', '행동 책임'],
          ['Robot', 'joint coordinate', 'hand motion', '운동 민감도'],
        ].map(([system, cause, result, question]) => (
          <div key={system} className="min-w-0 bg-background p-4">
            <p className="text-xs font-semibold text-muted-foreground">{system}</p>
            <p className="mt-2 text-sm font-bold">{cause}</p>
            <p className="mt-1 text-xs text-muted-foreground">작은 변화</p>
            <p className="my-2 text-center text-muted-foreground" aria-hidden="true">↓</p>
            <p className="text-sm font-bold">{result}</p>
            <p className="mt-2 text-xs font-semibold text-teal-700 dark:text-teal-300">{question}</p>
          </div>
        ))}
      </div>

      <Takeaway>
        미분은 “답을 바로 찾는 공식”이 아니다. 현재 위치 근처에서 원인을 조금 바꿨을 때
        결과가 어떻게 반응할지 예측하는 작은 map이다. 이 local map을 정확히 연결해야
        gradient descent, backpropagation, policy gradient와 robot Jacobian이 작동한다.
      </Takeaway>
    </NlpSection>
  );
}

function DerivativeLinearization() {
  return (
    <NlpSection
      id="derivative-linearization"
      marker="02"
      tone="blue"
      question="접선의 slope가 왜 작은 변화 예측기가 될까?"
      title="Derivative를 local linear map으로 읽는다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          두 점 사이의 평균 변화율은 입력 간격 동안 출력이 평균적으로 얼마나 변했는지
          말한다. 간격을 줄여 한 점에 가까워지면 그 점에서의 derivative가 된다. 그러나
          derivative를 단지 그래프의 접선 slope로만 기억하면 vector 함수와 autodiff에서
          다시 막힌다. 더 일반적인 뜻은 <strong>작은 입력 변화량을 작은 출력 변화량으로
          보내는 가장 좋은 선형 map</strong>이다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{f'(x)}_{\text{현재 점의 변화율}}=\lim_{h\to0}\underbrace{\frac{f(x+h)-f(x)}{h}}_{\text{간격 h에서의 평균 변화율}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="분자는 입력을 h만큼 옮겼을 때 생긴 출력 변화량이다. 이를 h로 나누면 입력 1단위당 출력 변화량이 되고, h를 0에 가깝게 보내면 한 점의 local sensitivity를 얻는다. 실제 컴퓨터는 h=0을 대입하는 것이 아니라 뒤에서 analytic rule이나 finite difference를 사용한다."
        symbols={[
          [raw`h`, '두 입력 위치 사이의 작은 간격'],
          [raw`f(x+h)-f(x)`, '그 간격에서 생긴 출력 변화량'],
          [raw`\frac{\Delta f}{h}`, '입력 1단위당 평균 출력 변화'],
          [raw`\lim_{h\to0}`, '두 점의 평균을 한 점의 local rule로 좁히는 과정'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          함수값과 derivative는 다른 종류의 양이다. 자동차 위치가 30 km라는 말과 속도가
          50 km/h라는 말이 다른 것과 같다. 출력 단위가 섭씨이고 입력 단위가 volt라면
          derivative의 단위는 섭씨/volt다. 이 단위가 맞지 않으면 작은 변화 예측도
          물리적으로 해석할 수 없다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-blue-500/30 bg-blue-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{f(x+\Delta x)}_{\text{실제 새 출력}}=\underbrace{f(x)+f'(x)\Delta x}_{\text{현재 점의 선형 예측}}+\underbrace{R(\Delta x)}_{\text{곡선이라서 남는 오차}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="현재 출력 f(x)에 derivative와 입력 변화량을 곱한 예측을 더한다. 곱셈이 필요한 이유는 f′(x)가 입력 1단위당 변화율이기 때문이다. R은 곡률 때문에 선형 접선이 놓친 항이며, 매끄러운 함수에서는 Δx가 작아질수록 1차 항보다 더 빠르게 작아진다."
        symbols={[
          [raw`\Delta x`, '현재 입력에서 실제로 움직일 작은 양'],
          [raw`f'(x)\Delta x`, '단위 변화율에 실제 이동량을 곱한 출력 변화 예측'],
          [raw`R(\Delta x)`, '직선이 곡선을 완전히 대신하지 못해 남는 residual'],
          ['local', '현재 점 근처에서만 예측이 정확하다는 경계'],
        ]}
      />

      <LocalLinearizationLab />

      <Misconception>
        derivative가 0이라는 사실만으로 함수가 minimum이라고 결론 낼 수 없다. maximum,
        평평한 변곡점, 또는 여러 방향 중 한 방향만 평평한 점일 수도 있다. 여기서는 local
        linear map까지만 확정하고 곡률과 최적점 판정은 뒤의 최적화 글로 넘긴다.
      </Misconception>
    </NlpSection>
  );
}

function GradientDirection() {
  return (
    <NlpSection
      id="gradient-direction"
      marker="03"
      tone="green"
      question="입력이 여러 개면 slope는 vector일까, scalar일까?"
      title="Partial, gradient와 directional derivative를 분리한다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          입력이 여러 개면 “어느 방향으로 움직였는가”를 먼저 말해야 변화율이 정해진다.
          Partial derivative는 다른 coordinate를 고정하고 한 coordinate axis로만 움직인
          directional derivative다. Gradient는 이 coordinate별 partial을 한 vector로
          모은다. Directional derivative는 gradient를 실제 이동 direction에 투영한
          scalar다.
        </p>
        <p>
          따라서 gradient와 directional derivative는 같은 것이 아니다. Gradient는 가능한
          모든 작은 방향 변화에 답할 수 있도록 준비한 coefficient vector다. Direction을
          하나 고른 뒤에야 그 방향으로 loss가 늘지 줄지 나타내는 숫자 하나가 나온다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{\nabla L(x)}_{\text{gradient vector}}=\begin{bmatrix}\frac{\partial L}{\partial x_1}\\ \vdots\\ \frac{\partial L}{\partial x_n}\end{bmatrix}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="Gradient는 각 coordinate axis로 움직였을 때의 partial derivative를 입력 coordinate와 같은 순서로 세워 둔 vector다. 이 순서를 보존해야 뒤에서 실제 이동 direction과 같은 coordinate끼리 비교할 수 있다."
        symbols={[
          [raw`\frac{\partial L}{\partial x_i}`, '다른 coordinate를 고정하고 xᵢ만 늘릴 때의 변화율'],
          [raw`\nabla L`, '모든 coordinate sensitivity를 모은 vector'],
          ['세로로 쌓기', '입력 vector x와 같은 n차원 shape를 만드는 연산'],
        ]}
      />

      <div className="not-prose my-6 min-w-0 rounded-md border border-green-500/30 bg-green-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{D_vL(x)}_{\text{v 방향 변화율}}=\underbrace{\nabla L(x)^\top v}_{\text{gradient의 direction 투영}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="실제 unit direction v가 주어지면 dot product로 각 coordinate의 이동 비중과 민감도를 곱해 더한다. 그래서 gradient vector는 방향 하나에 대한 scalar directional derivative로 압축된다."
        symbols={[
          [raw`v`, '실제로 움직여 볼 unit direction'],
          [raw`\nabla L^\top v`, 'direction별 이동량으로 gradient contribution을 가중해 합한 값'],
          [raw`D_vL`, 'v 방향으로 작은 양의 step을 갈 때의 scalar 변화율'],
        ]}
      />

      <DirectionalDerivativeLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Unit direction을 쓰는 이유는 방향과 step 크기를 분리하기 위해서다. 길이가 10인
          vector와 길이가 1인 vector를 그대로 비교하면 같은 방향이어도 전자가 열 배 큰
          변화율을 만든다. 방향만 비교할 때는 먼저 길이를 1로 맞추고, 실제 이동량은 별도
          learning rate나 step으로 붙인다.
        </p>
      </div>

      <StopRule>
        이 글은 gradient가 현재 점의 가장 빠른 증가 direction이라는 local 사실까지만
        사용한다. 실제 step 크기, curvature, momentum, constraint와 KKT는{' '}
        <InternalLink slug="optimization-geometry">최적화의 기하</InternalLink>가 책임진다.
      </StopRule>
    </NlpSection>
  );
}

function ChainProductGraph() {
  return (
    <NlpSection
      id="chain-product-graph"
      marker="04"
      tone="amber"
      question="계산이 길어지거나 갈라지면 책임을 어떻게 합칠까?"
      title="경로 안에서는 곱하고 같은 원인으로 돌아오면 더한다"
    >
      <QuestionLead
        question="한 값이 여러 연산에 동시에 쓰이면 backward에서 마지막 경로만 남겨도 될까?"
        answer="안 된다. 합성된 한 경로 안에서는 local derivative를 곱하고, 같은 원인으로 돌아오는 서로 다른 경로의 contribution은 더한다. Broadcast도 같은 값을 여러 위치에 복제한 분기이므로 원래 shape로 돌아올 때 합산한다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Chain rule은 함수가 합성될 때 작은 변화가 연속해서 전달되는 규칙이다. 입력
          변화가 중간값을 바꾸고, 그 중간값 변화가 출력을 바꾸므로 “출력/중간”과
          “중간/입력”을 곱한다. Product rule은 두 factor가 모두 같은 입력에 의존할 때
          어느 한쪽만 바뀌는 두 1차 contribution을 더한다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{\frac{d\,f(g(x))}{dx}}_{\text{전체 민감도}}=\underbrace{f'(g(x))}_{\text{출력←중간}}\underbrace{g'(x)}_{\text{중간←입력}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="합성에서는 작은 변화가 입력에서 중간값, 중간값에서 출력으로 같은 경로를 차례로 통과하므로 local scale들을 곱한다. 단위도 출력/중간과 중간/입력이 곱해져 출력/입력으로 연결된다."
        symbols={[
          [raw`g'(x)`, '입력 변화가 중간값 변화로 바뀌는 첫 local scale'],
          [raw`f'(g(x))`, '중간값 변화가 최종 출력 변화로 바뀌는 다음 local scale'],
          ['곱', '같은 perturbation이 연속된 두 local map을 모두 지나기 때문에 필요한 연산'],
        ]}
      />

      <div className="not-prose my-6 min-w-0 rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{\frac{d(uv)}{dx}}_{\text{product의 변화}}=\underbrace{u'v}_{\text{u가 변한 기여}}+\underbrace{uv'}_{\text{v가 변한 기여}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="곱 u·v에서는 u와 v가 모두 x에 의존하므로 각각 한쪽이 변하는 1차 contribution을 만든 뒤 더한다. 두 값이 동시에 변한 u′v′(Δx)² 항은 1차 derivative보다 더 빠르게 작아져 남지 않는다."
        symbols={[
          [raw`u'v`, 'u의 변화만 1차로 반영한 contribution'],
          [raw`uv'`, 'v의 변화만 1차로 반영한 contribution'],
          ['더하기', '같은 product output을 바꾸는 두 독립 1차 원인을 합치는 연산'],
        ]}
      />

      <div className="not-prose my-6 min-w-0 rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{\frac{\partial L}{\partial u}}_{\text{공유 node 책임}}=\underbrace{\sum_{p:u\to L}\left.\frac{\partial L}{\partial u}\right|_{p}}_{\text{모든 경로의 기여 합}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="한 node가 여러 downstream 연산에 쓰이면 각 edge가 독립적인 1차 contribution을 만든다. 최종 loss는 이 변화들의 합에 반응하므로 같은 원인 u로 돌아온 값도 합한다."
        symbols={[
          [raw`p`, '공유 node에서 loss까지 이어진 한 계산 경로'],
          [raw`\sum_p`, '서로 다른 경로가 만든 책임을 누락 없이 합치는 연산'],
          [raw`\left.\partial L/\partial u\right|_p`, '경로 p 하나만 따라 돌아온 gradient contribution'],
        ]}
      />

      <div className="not-prose my-6 min-w-0 rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{\frac{\partial L}{\partial b_d}}_{\text{원래 bias 책임}}=\underbrace{\sum_{i=1}^{B}\frac{\partial L}{\partial y_{id}}}_{\text{batch 사용처의 기여 합}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="Bias b는 forward에서 B개 sample에 같은 값으로 보였으므로 backward에서는 그 B개 사용처의 gradient를 batch 축으로 sum-reduce해 원래 feature shape로 되돌린다."
        symbols={[
          [raw`B`, 'bias가 forward에서 복제되어 사용된 batch 크기'],
          [raw`d`, 'bias가 원래 가지고 있던 feature coordinate'],
          [raw`\sum_i`, '복제된 batch axis를 없애고 원래 bias shape를 복원하는 연산'],
        ]}
      />

      <GradientFlowLab />

      <Misconception>
        Detach는 forward 값을 0으로 만들지 않는다. 같은 숫자는 downstream 계산에 그대로
        쓰되 backward edge만 끊는다. 따라서 loss 값이 같아도 parameter gradient는 달라질
        수 있다. “값이 보인다”와 “gradient 책임이 돌아온다”를 분리해야 한다.
      </Misconception>
    </NlpSection>
  );
}

function JacobianProducts() {
  return (
    <NlpSection
      id="jacobian-products"
      marker="05"
      tone="violet"
      question="Vector 함수의 모든 편미분을 정말 행렬로 만들어야 할까?"
      title="Jacobian은 개념으로 두고 필요한 product만 계산한다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          입력이 n차원이고 출력이 m차원이면 derivative는 scalar slope 하나가 아니라
          m×n linear map이다. 이 map을 coordinate로 적은 것이 Jacobian이다. Row i는
          출력 i가 모든 입력에 보이는 sensitivity이고, column j는 입력 j를 움직였을 때
          모든 출력이 움직이는 direction이다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{J_f(x)}_{\text{local linear map}}\in\mathbb{R}^{m\times n},\qquad \underbrace{[J_f(x)]_{ij}}_{\text{원소 하나}}=\frac{\partial f_i}{\partial x_j}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="입력 perturbation은 n개 coordinate를 가지며 출력 perturbation은 m개 coordinate를 가진다. 따라서 이를 보내는 Jacobian은 m개 row와 n개 column을 갖는다. 각 원소는 출력 coordinate i가 입력 coordinate j에 얼마나 민감한지 기록한다."
        symbols={[
          [raw`n`, '입력 vector의 coordinate 수'],
          [raw`m`, '출력 vector의 coordinate 수'],
          [raw`J_f(x)`, '현재 x에서 f를 대신하는 m×n local linear map'],
          [raw`\partial f_i/\partial x_j`, '입력 j를 바꿀 때 출력 i가 보이는 partial derivative'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          대부분의 계산은 Jacobian 전체가 아니라 특정 vector에 작용한 결과만 필요하다.
          JVP는 입력 쪽 tangent를 출력 쪽으로 밀어 작은 input perturbation의 결과를
          계산한다. VJP는 출력 쪽 cotangent, 즉 downstream objective가 출력에 부여한
          책임을 입력 쪽으로 당긴다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-violet-500/30 bg-violet-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{J_f(x)v}_{\text{JVP · 앞으로 밀기}}\in\mathbb{R}^{m}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="JVP는 n차원 input direction v를 Jacobian column들의 가중합으로 바꿔 m차원 output change를 만든다. 입력 perturbation의 실제 효과를 forward 방향으로 묻는 계산이다."
        symbols={[
          [raw`v\in\mathbb{R}^n`, '입력에서 출발하는 tangent direction'],
          [raw`Jv`, '그 input perturbation이 만드는 output perturbation'],
          ['column 가중합', 'v의 coordinate별 이동량으로 각 입력 column의 output effect를 합치는 연산'],
        ]}
      />

      <div className="not-prose my-6 min-w-0 rounded-md border border-violet-500/30 bg-violet-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{J_f(x)^\top c}_{\text{VJP · 뒤로 당기기}}\in\mathbb{R}^{n}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="VJP는 m차원 output responsibility c를 Jacobian row들의 가중합으로 바꿔 n차원 input responsibility를 만든다. Transpose는 output coordinate의 책임을 input coordinate 순서로 모으기 위해 필요하다."
        symbols={[
          [raw`c\in\mathbb{R}^m`, '출력에서 출발하는 cotangent 또는 upstream gradient'],
          [raw`J^\top c`, 'upstream responsibility를 입력 coordinate별로 모은 VJP'],
          ['transpose', 'Jacobian의 output row를 input별 responsibility column으로 읽는 방향 전환'],
        ]}
      />

      <JacobianProductLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          입력 수가 적고 출력 수가 많아 full Jacobian column을 얻고 싶다면 forward-mode
          JVP를 input basis마다 실행하는 편이 유리하다. 출력 수가 적고 입력 수가 많다면
          reverse-mode VJP를 output basis마다 실행하는 편이 유리하다. Deep learning은
          보통 parameter가 매우 많고 최종 loss가 scalar 하나이므로 VJP 한 번으로 모든
          parameter gradient를 얻는 reverse mode가 잘 맞는다.
        </p>
        <p>
          반대로 robot velocity kinematics의 joint rate에서 hand velocity로 가는 계산은
          Jacobian과 joint-rate vector의 곱, 즉 JVP다. 같은 Jacobian을 보더라도 질문이
          “perturbation을 앞으로 보낼까”인지 “책임을 뒤로 당길까”인지에 따라 mode가
          달라진다.
        </p>
      </div>
    </NlpSection>
  );
}

function AutogradRuntime() {
  return (
    <NlpSection
      id="autograd-runtime"
      marker="06"
      tone="amber"
      question="수학식이 맞아도 runtime에서 gradient가 달라질 수 있을까?"
      title="Graph, saved value와 leaf accumulation을 따로 추적한다"
    >
      <QuestionLead
        question="Autograd는 미분 공식을 저장해 두고 매번 같은 graph를 재생할까?"
        answer="PyTorch의 eager autograd는 실제로 실행한 연산에서 graph를 매 iteration 새로 만든다. 각 backward node는 local derivative에 필요한 값을 저장하고, 결과는 leaf tensor의 .grad에 누적한다. Graph의 수명과 .grad buffer의 수명은 서로 다르다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Forward에서는 값과 연산 의존 관계를 기록한다. Square backward가 입력 값을
          알아야 한다면 그 값을 saved tensor로 보존한다. Backward에서는 최종 scalar에서
          시작한 VJP를 graph의 반대 순서로 실행한다. 중간 non-leaf gradient는 다음 node로
          전달되고, 사용자가 최적화할 leaf parameter의 gradient는 <code>.grad</code>
          buffer에 더해진다.
        </p>
        <p>
          다음 iteration에서 새로운 데이터와 control flow를 실행하면 graph도 새로
          만들어진다. 하지만 leaf <code>.grad</code>는 자동으로 0이 되지 않는다. 그래서
          두 번째 backward 전에 <code>zero_grad</code>를 하지 않으면 두 pass의
          contribution이 더해진다. 이 accumulation은 여러 micro-batch를 의도적으로
          합칠 때는 기능이고, 모르고 방치하면 버그다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{g_{\mathrm{leaf}}^{(k)}}_{\text{k번째 backward 뒤 .grad}}=\underbrace{g_{\mathrm{leaf}}^{(k-1)}}_{\text{기존 buffer}}+\underbrace{\left.\frac{\partial L_k}{\partial\theta}\right|_{\text{이번 graph}}}_{\text{새 pass가 만든 contribution}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="Leaf .grad는 대입이 아니라 기본적으로 더하기로 갱신된다. 이 설계 덕분에 여러 loss나 micro-batch의 gradient를 모을 수 있다. 독립 step을 원하면 이전 buffer를 0 또는 None으로 초기화해야 하며, graph를 새로 만드는 것만으로 기존 .grad가 지워지지는 않는다."
        symbols={[
          [raw`g_{\mathrm{leaf}}^{(k-1)}`, '이전 backward까지 leaf buffer에 누적된 gradient'],
          [raw`L_k`, '현재 iteration 또는 micro-batch의 scalar loss'],
          [raw`\partial L_k/\partial\theta`, '이번 graph가 leaf parameter에 돌려준 contribution'],
          ['더하기', '여러 독립 contribution을 명시적으로 합칠 수 있게 하는 buffer contract'],
        ]}
      />

      <AutogradTapeLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>detach</code>는 새 tensor가 같은 storage 값을 보게 하되 그 지점 이전으로
          gradient가 가지 않게 한다. <code>no_grad</code>는 그 context 안의 연산을
          backward graph에 기록하지 않는다. Optimizer update처럼 미분할 필요가 없는
          mutation에 적합하다. In-place 연산은 backward가 필요로 하는 saved value를
          바꿀 수 있으므로 version check와 오류가 생길 수 있다.
        </p>
      </div>

      <Misconception>
        “메모리를 아끼려고 in-place로 바꿨다”는 이유만으로 안전하지 않다. Backward가
        local derivative를 계산할 때 원래 값이 필요한지 먼저 확인해야 한다. 값의 storage,
        graph edge, leaf gradient buffer는 서로 다른 세 상태다.
      </Misconception>
    </NlpSection>
  );
}

function GradientCheck() {
  return (
    <NlpSection
      id="gradient-check"
      marker="07"
      tone="blue"
      question="Autograd가 낸 숫자를 독립적으로 어떻게 검산할까?"
      title="Finite difference의 오차가 가장 작아지는 구간을 찾는다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Symbolic differentiation은 식을 다른 식으로 변환하고, automatic differentiation은
          실행한 elementary operation의 exact local rule을 chain rule로 합성한다. Numerical
          differentiation은 함수값만 여러 번 평가해 slope를 근사한다. 세 방법의 역할은
          다르다. Training에는 reverse-mode AD를 쓰고, 작은 toy case의 backward 구현은
          finite difference로 독립 검산한다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{\frac{\partial L}{\partial\theta_i}}_{\text{검사 gradient}}\approx\underbrace{\frac{L(\theta_i+\varepsilon)-L(\theta_i-\varepsilon)}{2\varepsilon}}_{\text{양쪽 함수값 기울기}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="θᵢ를 양쪽으로 같은 ε만큼 움직여 비대칭 오차를 상쇄하고, 두 함수값 차이를 전체 간격 2ε로 나눈다. ε가 크면 곡률 때문에 접선 근사가 거칠고, 너무 작으면 거의 같은 floating-point 수를 빼면서 cancellation과 roundoff가 커진다."
        symbols={[
          [raw`\theta_i`, '한 번에 검사할 parameter 원소 하나'],
          [raw`\varepsilon`, '양쪽 함수 평가에 사용할 perturbation 크기'],
          [raw`2\varepsilon`, '두 평가 지점 사이의 실제 전체 간격'],
          ['central', '현재 점의 왼쪽과 오른쪽을 대칭으로 사용해 1차 truncation error를 줄이는 선택'],
        ]}
      />

      <div className="not-prose my-6 min-w-0 rounded-md border border-blue-500/30 bg-blue-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\begin{aligned}
s_{\text{기준 크기}}&=\max(1,|g_{\mathrm{AD}}|,|g_{\mathrm{num}}|)\\
e_{\mathrm{rel}}&=\frac{|g_{\mathrm{AD}}-g_{\mathrm{num}}|}{s_{\text{기준 크기}}}
\end{aligned}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="절대 차이만 보면 gradient scale이 큰 항이 항상 나빠 보인다. 분모로 두 gradient의 대표 크기를 나누면 scale을 고려한 비교가 된다. max에 1을 포함하면 둘 다 0에 가까울 때 작은 roundoff를 과도하게 확대하지 않는다. 실제 library의 tolerance 식은 dtype과 nondeterminism 정책에 따라 더 세분화된다."
        symbols={[
          [raw`g_{\mathrm{AD}}`, 'automatic differentiation이 계산한 gradient'],
          [raw`g_{\mathrm{num}}`, 'finite difference로 근사한 gradient'],
          [raw`|\cdot|`, '부호가 아니라 불일치 크기만 비교하는 절댓값'],
          [raw`\max(1,\ldots)`, '큰 값에는 상대 오차, 매우 작은 값에는 안정된 절대 오차처럼 작동하는 scale'],
        ]}
      />

      <GradcheckPathLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Kink처럼 derivative가 존재하지 않거나 좌우 derivative가 다른 점에서는 두
          올바른 구현도 다른 subgradient를 선택할 수 있다. Random operation, overlapping
          memory, low precision도 검산을 흐린다. 따라서 작은 double-precision input,
          smooth한 지점, 여러 epsilon과 고정된 random state로 먼저 검사한 뒤 실제 dtype과
          boundary case로 넓힌다.
        </p>
      </div>
    </NlpSection>
  );
}

function PathSecondChain() {
  return (
    <NlpSection
      id="path-second-chain"
      marker="08"
      tone="green"
      question="정해진 path에 시간이 붙으면 acceleration은 왜 두 항일까?"
      title="두 번째 chain rule에서 path 곡률과 clock 가속을 분리한다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Robot path를 <code>q(s)</code>라고 쓰면 s는 path 위의 위치를 나타내는 scalar다.
          아직 “언제” 그 위치를 지나는지는 정하지 않았다. 여기에 시간에 따라 움직이는
          <code>s(t)</code>를 넣으면 실제 trajectory는 <code>q(s(t))</code>가 된다.
          첫 derivative는 path direction과 path를 따라가는 속도의 곱이다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{\dot q}_{\text{joint 속도}}=\underbrace{q_s}_{\text{path tangent}}\underbrace{\dot s}_{\text{clock 속도}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="qₛ는 s가 1단위 변할 때 joint vector가 움직이는 direction과 scale이다. 여기에 실제로 초당 얼마나 s가 변하는지인 s-dot을 곱해야 초당 joint 변화량이 된다. 이는 input tangent s-dot을 q의 Jacobian으로 보내는 1차원 JVP다."
        symbols={[
          [raw`q_s=dq/ds`, 'geometric path가 가진 tangent vector'],
          [raw`\dot s=ds/dt`, 'path coordinate의 시간당 변화량'],
          [raw`\dot q=dq/dt`, '각 joint coordinate의 시간당 변화량'],
          ['곱', 'path 단위당 변화량을 초당 path 이동량으로 환산하는 chain rule'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Acceleration을 얻으려면 위의 두 factor를 다시 시간으로 미분한다. 이때
          <code>q_s</code>도 s가 움직이면 달라지고, <code>s-dot</code>도 clock이
          가속하면 달라진다. 그래서 product rule이 두 원인을 따로 만든다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-green-500/30 bg-green-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\underbrace{\ddot q}_{\text{joint 가속도}}=\underbrace{q_{ss}\dot s^{\,2}}_{\text{path 곡률 효과}}+\underbrace{q_s\ddot s}_{\text{clock 가속 효과}}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="qₛ를 시간 미분하면 chain rule로 qₛₛ·s-dot이 되고, 원래 곱해져 있던 s-dot까지 있어 s-dot 제곱이 된다. 두 번째 항은 path tangent qₛ를 유지한 채 clock speed가 s-double-dot만큼 변하는 contribution이다. 같은 joint acceleration이라도 path shape와 time scaling이라는 서로 다른 원인이 합쳐진다."
        symbols={[
          [raw`q_{ss}`, 'path tangent가 s에 따라 얼마나 휘는지 나타내는 두 번째 derivative'],
          [raw`\dot s^{\,2}`, '같은 곡률을 더 빠르게 지날수록 제곱으로 커지는 효과'],
          [raw`\ddot s`, 'path coordinate clock의 acceleration'],
          [raw`q_s\ddot s`, '현재 path tangent 방향으로 speed를 바꾼 contribution'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          위의 “수치 검산 · Path 2차 chain” Viz에서 path 탭으로 바꾸면 두 항을 따로
          조작할 수 있다. Path speed만 늘리면 곡률 항이 제곱으로 커지고, path
          acceleration을 바꾸면 clock 항만 바뀐다. 이 분리가 되어야 actuator limit를
          path acceleration의 upper/lower bound로 바꾸는 다음 글을 읽을 수 있다.
        </p>
      </div>

      <StopRule>
        여기서는 <code>q(s(t))</code>를 두 번 미분하는 데서 멈춘다. 이 값을 시간에 따라
        적분해 궤적을 만드는 법은{' '}
        <InternalLink slug="differential-equations-phase-plane-numerical-integration">
          미분방정식과 Phase Plane
        </InternalLink>
        , actuator bound와 time scaling은{' '}
        <InternalLink slug="robot-trajectory-generation">Robot Trajectory Generation</InternalLink>
        이 책임진다.
      </StopRule>
    </NlpSection>
  );
}

function ReturnUp() {
  return (
    <NlpSection
      id="return-up"
      marker="09"
      tone="violet"
      question="이제 최신 모델과 robot 글에서 무엇을 직접 읽을 수 있을까?"
      title="같은 sensitivity 뼈대로 상위 시스템에 돌아간다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이제 상위 글의 수식을 만나면 먼저 최종 scalar objective를 찾는다. 그다음 어떤
          parameter와 intermediate가 graph에 연결되어 있는지, branch contribution이 어디서
          더해지는지, forward perturbation을 묻는 JVP인지 backward responsibility를 묻는
          VJP인지 확인한다. 마지막으로 dtype, detach, accumulation과 numerical check가
          그 수학을 실제 runtime에서 보존하는지 검사한다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 rounded-md border border-violet-500/30 bg-violet-500/[0.04] p-3">
        <MathFormula display className="my-0 text-sm sm:text-base">
          {raw`\begin{aligned}\underbrace{\nabla_\theta L_{\mathrm{total}}}_{\text{최종 책임}}&=\underbrace{\nabla_\theta L_{\mathrm{token}}}_{\text{언어 기여}}+\underbrace{\nabla_\theta L_{\mathrm{denoise}}}_{\text{복원 기여}}\\&\quad+\underbrace{\nabla_\theta L_{\mathrm{policy}}}_{\text{행동 기여}}\end{aligned}`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="같은 parameter θ가 여러 scalar loss에 연결되어 있으면 미분의 선형성 때문에 loss별 gradient contribution을 더한다. 실제 model이 세 objective를 항상 함께 쓴다는 뜻은 아니다. 여러 objective가 shared parameter에서 만날 때 책임이 합산된다는 계산 그래프 원리를 보여 주는 식이다."
        symbols={[
          [raw`\theta`, '여러 objective가 공유할 수 있는 model parameter'],
          [raw`L_{\mathrm{token}}`, 'next-token prediction처럼 언어 쪽에서 온 예시 loss'],
          [raw`L_{\mathrm{denoise}}`, 'noise 또는 corrupted input 복원에서 온 예시 loss'],
          [raw`L_{\mathrm{policy}}`, 'policy 행동 확률과 reward signal에서 온 예시 objective'],
        ]}
      />

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {[
          {
            title: 'LLM과 neural network',
            body: <>Layer별 VJP, residual branch 합산과 parameter update는 <InternalLink slug="backprop-optimization">역전파와 최적화</InternalLink>에서 실제 network shape로 확장한다. Dense Transformer의 실행 구조는 <InternalLink slug="llm-architecture-dense-transformers">Dense Transformer 기준점</InternalLink>에서 읽는다.</>,
          },
          {
            title: 'Diffusion과 생성 모델',
            body: <>Noise prediction objective와 여러 denoising step의 역할은 <InternalLink slug="diffusion-models">Diffusion Model</InternalLink>에서 forward corruption과 reverse generation 흐름으로 연결한다.</>,
          },
          {
            title: 'RL과 reasoning',
            body: <>Log-probability gradient, return, baseline과 actor-critic의 책임 분리는 <InternalLink slug="rl-policy-gradient-actor-critic">Policy Gradient 실행 계약</InternalLink>에서 이어 간다.</>,
          },
          {
            title: 'Robot motion',
            body: <>Joint rate를 hand velocity로 보내는 Jacobian은 <InternalLink slug="robot-kinematics-coordinate-frames">Robot Kinematics</InternalLink>, path에 실행 가능한 시간을 붙이는 문제는 <InternalLink slug="robot-trajectory-generation">Trajectory Generation</InternalLink>에서 이어 간다.</>,
          },
        ].map((item) => (
          <div key={item.title} className="min-w-0 bg-background p-4">
            <h3 className="text-sm font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>

      <CapabilityCheck
        title="이 글만으로 확인할 수 있어야 한다"
        items={[
          '함수값과 derivative의 단위가 왜 다른지 설명하고 local prediction을 계산한다.',
          'Gradient vector와 특정 direction의 scalar directional derivative를 구분한다.',
          '합성 경로에서는 곱하고 공유 node와 broadcast 사용처에서는 더하는 이유를 설명한다.',
          'Jacobian shape를 정하고 JVP와 VJP의 seed·출력 shape를 계산한다.',
          'Dynamic graph, saved tensor, detach와 leaf .grad accumulation을 서로 다른 상태로 추적한다.',
          '여러 epsilon으로 finite-difference 검산을 하고 nonsmooth point의 경계를 말한다.',
          'q(s(t))를 두 번 미분해 path curvature 항과 clock acceleration 항을 분리한다.',
          'LLM, diffusion, RL과 robot 사례를 같은 sensitivity graph로 다시 읽는다.',
        ]}
      />

      <StopRule title="역사 하향의 최소선.">
        Newton과 Leibniz의 역사, epsilon-delta 증명, measure theory와 differential
        geometry까지 내려가지 않는다. 현재 상위 글을 읽는 데 필요한 첫 충분 조건은 local
        linearization, multivariable chain rule, JVP/VJP, runtime graph 경계와
        finite-difference 검산이다. 공간 적분과 conservation은 이 글이 다룬 척하지 않고
        별도 기초 글로 분리한다.
      </StopRule>

      <SourceNotes
        sources={[
          {
            label: 'MIT 18.S096 · Matrix Calculus for Machine Learning and Beyond',
            href: 'https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/',
            note: 'derivative를 local linear operator로 읽고 directional derivative, Jacobian chain, forward/reverse mode와 finite difference 경계를 연결한 강의 노트',
          },
          {
            label: 'Baydin et al. · Automatic Differentiation in Machine Learning: a Survey',
            href: 'https://www.jmlr.org/papers/v18/17-468.html',
            note: 'symbolic·numerical·automatic differentiation, forward/reverse accumulation과 intermediate trace의 원전 survey',
          },
          {
            label: 'PyTorch 2.13 · Autograd mechanics',
            href: 'https://docs.pytorch.org/docs/stable/notes/autograd.html',
            note: 'dynamic graph 재생성, saved tensor, no-grad/inference mode와 in-place correctness의 공식 runtime 계약',
          },
          {
            label: 'PyTorch 2.13 · torch.func API',
            href: 'https://docs.pytorch.org/docs/stable/func.api.html',
            note: 'jvp, vjp, jacrev와 jacfwd가 제공하는 실제 Jacobian product API',
          },
          {
            label: 'PyTorch 2.13 · Gradcheck mechanics',
            href: 'https://docs.pytorch.org/docs/stable/notes/gradcheck.html',
            note: 'central difference, Wirtinger derivative와 tolerance를 포함한 공식 gradient 검산 설명',
          },
          {
            label: 'PyTorch · Broadcasting semantics',
            href: 'https://docs.pytorch.org/docs/stable/notes/broadcasting.html',
            note: 'singleton·trailing axis가 forward에서 확장되는 공식 규칙. Broadcast backward의 원래 shape 합산은 이 사용 횟수와 chain rule에서 유도한다.',
          },
          {
            label: 'Modern Robotics · Velocity Kinematics and Statics',
            href: 'https://modernrobotics.northwestern.edu/nu-gm-book-resource/5-1-1-space-jacobian/',
            note: 'joint velocity를 end-effector velocity로 보내는 robot Jacobian의 물리적 의미',
          },
          {
            label: 'Sutton et al. · Policy Gradient Theorem',
            href: 'https://proceedings.neurips.cc/paper_files/paper/1999/hash/464d828b85b0bed98e80ade0a5c43b0f-Abstract.html',
            note: 'expected reward gradient와 value approximation을 policy parameter update로 연결한 원전',
          },
        ]}
      />
    </NlpSection>
  );
}

export default function CalculusComputationalGraphsArticle() {
  return (
    <>
      <WhySensitivity />
      <DerivativeLinearization />
      <GradientDirection />
      <ChainProductGraph />
      <JacobianProducts />
      <AutogradRuntime />
      <GradientCheck />
      <PathSecondChain />
      <ReturnUp />
    </>
  );
}
