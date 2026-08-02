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
import { NlpSection, Takeaway } from './nlp-shared';
import {
  BoundaryEnvelopeLab,
  DrivenStateLab,
  ErrorConvergenceLab,
  EulerStepLab,
  EventDetectionLab,
  PhasePortraitLab,
  RateLedgerLab,
  StabilityStiffnessLab,
} from './differential-equations-phase-plane-numerical-integration/viz/OdeTrajectoryLabs';

const raw = String.raw;

function FormulaBlock({
  latex,
  meaning,
  symbols,
  tone = 'border-border',
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
  tone?: string;
}) {
  return (
    <div className="mb-8">
      <div className={`not-prose min-w-0 rounded-md border p-3 sm:p-4 ${tone}`}>
        <MathFormula display minScale={0.9} className="my-0 text-sm sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function HandoffGrid({
  items,
}: {
  items: Array<{ title: string; body: ReactNode }>;
}) {
  return (
    <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="min-w-0 bg-background p-4">
          <h3 className="text-sm font-bold">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function StateRateLedger() {
  return (
    <NlpSection
      id="state-rate-ledger"
      marker="01"
      tone="teal"
      question="한순간의 변화율은 어떻게 시간에 따른 trajectory가 될까?"
      title="State에 rate를 시간 순서대로 누적한다"
    >
      <QuestionLead
        question="지금 tank에 10 kg이 들어 있다는 사실만으로 5초 뒤 양을 알 수 있을까?"
        answer="알 수 없다. 지금 들어오고 나가는 rate, 그 규칙이 바뀌는 시간, 시작 state가 함께 필요하다. 미분방정식은 미래 곡선을 외워 둔 식이 아니라 현재 state에서 다음 방향을 다시 계산하는 규칙이다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          앞의 <InternalLink slug="integrals-fields-conservation">적분·field·보존</InternalLink> 글에서는
          <code>rate × interval</code>이 저장량 변화가 된다고 배웠다. 여기서는 그 장부를 한 번만
          계산하지 않고 시간 순서대로 반복한다. 그래서 결과가 숫자 하나가 아니라 시간에 따라 이어진
          <strong> trajectory</strong>, 즉 상태의 경로가 된다.
        </p>
        <p>
          먼저 무엇을 기억해야 미래가 정해지는지 고른다. 그 기억 묶음이 <strong>state</strong>다.
          다음으로 현재 state와 외부 입력을 넣으면 초당 얼마나 변하는지 주는 <strong>rate rule</strong>을
          적는다. 마지막으로 시작 state를 고정한다. 같은 rule이라도 시작점이 다르면 다른 trajectory가 나온다.
        </p>
      </div>

      <ConceptPrimer
        items={[
          { term: 'State', meaning: '다음 순간을 계산하기 위해 현재 기억해야 하는 최소 값 묶음이다.', why: '위치만 필요한지, 위치와 속도를 함께 기억해야 하는지 모델의 차원을 정한다.' },
          { term: 'Rate rule', meaning: '현재 시간·state·입력에서 state가 초당 얼마나 변하는지 주는 함수다.', why: '완성된 미래를 저장하지 않고 매 순간의 방향을 다시 계산한다.' },
          { term: 'Initial condition', meaning: '시간 전개를 시작할 때의 state다.', why: '같은 변화 법칙이 여러 가능한 trajectory 중 어느 하나를 가리키게 한다.' },
          { term: 'Trajectory', meaning: 'state가 시간에 따라 지나간 값의 순서다.', why: '끝점뿐 아니라 중간의 최대값, 경계 통과와 안정성을 검사할 수 있다.' },
        ]}
      />

      <FormulaBlock
        tone="border-cyan-500/30 bg-cyan-500/[0.035]"
        latex={raw`\begin{aligned}\underbrace{\frac{d\mathbf x}{dt}}_{\text{state의 초당 변화}}&=\underbrace{\mathbf f(t,\mathbf x,\mathbf u)}_{\text{시간·state·입력으로 rate 계산}}\\[3pt]\underbrace{\mathbf x(t_0)}_{\text{출발 시각의 state}}&=\underbrace{\mathbf x_0}_{\text{출발 state 고정}}\end{aligned}`}
        meaning="왼쪽은 아직 미래 state가 아니라 현재의 변화율이다. 오른쪽 함수는 그 변화율을 결정하는 원인을 모은다. 초기조건을 붙여야 가능한 여러 trajectory 중 실제로 따라갈 하나가 정해진다."
        symbols={[
          [raw`\mathbf x`, '미래를 계산하는 데 필요한 state vector'],
          [raw`t`, '시간 또는 독립 변수'],
          [raw`\mathbf u`, '외부에서 주어지는 입력이나 schedule'],
          [raw`\mathbf x_0`, '시간 t₀에서 출발하는 state'],
        ]}
      />

      <FormulaBlock
        latex={raw`\underbrace{[\dot m]}_{\text{질량 rate}}\underbrace{[\Delta t]}_{\text{시간 간격}}=\underbrace{\frac{\mathrm{kg}}{\mathrm s}\,\mathrm s}_{\text{초가 약분됨}}=\underbrace{\mathrm{kg}}_{\text{state와 더할 변화량}}`}
        meaning="Rate를 state에 바로 더하면 단위가 맞지 않는다. 초당 질량에 지속 시간을 곱해야 kg 단위의 변화량이 되고, 그때 초기 질량과 더할 수 있다. 이 단위 장부는 복잡한 ODE에서도 가장 먼저 할 검산이다."
        symbols={[
          [raw`\dot m`, '유입에서 유출을 뺀 순 질량 rate [kg/s]'],
          [raw`\Delta t`, '그 rate를 적용한 시간 [s]'],
          [raw`\dot m\,\Delta t`, '해당 구간에 누적된 질량 변화 [kg]'],
        ]}
      />

      <RateLedgerLab />

      <Takeaway>
        ODE를 보면 먼저 state, rate의 단위, 초기조건을 찾는다. 그다음 rate를 시간에 누적해 state를 갱신한다.
        “미분방정식을 푼다”는 말의 공통 뼈대는 이 반복이다.
      </Takeaway>
    </NlpSection>
  );
}

function DrivenState() {
  return (
    <NlpSection
      id="driven-state"
      marker="02"
      tone="blue"
      question="현재 state가 같으면 다음 방향도 항상 같을까?"
      title="내부 법칙과 외부 schedule을 분리한다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          물이 빠지는 tank처럼 rate가 현재 state만으로 정해지는 모델을 <strong>autonomous system</strong>이라
          부른다. 하지만 heater command, motor torque, diffusion noise schedule처럼 시간이 지나며 외부 입력이
          바뀌면 같은 state에서도 rate가 달라질 수 있다. 이때 시간을 지워 버리면 원인을 잃는다.
        </p>
      </div>

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{\dot x=f(x)}_{\text{state만으로 rate 결정}}&\quad \text{autonomous}\\[3pt]\underbrace{\dot x=f(t,x,u(t))}_{\text{시간·state·입력으로 rate}}&\quad \text{driven}\end{aligned}`}
        meaning="두 식은 x가 같을 때 다음 rate가 하나로 정해지는지 구분한다. 외부 입력 u(t)가 있으면 같은 x라도 switch 전후의 rate가 다르다. 시간을 인자로 남기는 이유는 schedule의 소유권을 state 내부 법칙과 섞지 않기 위해서다."
        symbols={[
          [raw`f(x)`, '현재 state만 보고 rate를 정하는 법칙'],
          [raw`u(t)`, '시간에 따라 외부에서 정해지는 command나 source'],
          ['autonomous', '시간을 직접 보지 않아도 state가 다음 방향을 결정하는 경우'],
          ['driven', '외부 입력이나 시간 schedule이 trajectory를 밀어 가는 경우'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{\dot x}_{\text{state rate}}&=\underbrace{-kx}_{\text{state를 줄이는 복원}}+\underbrace{u(t)}_{\text{외부 입력}}\\[3pt]\underbrace{u(t)}_{\text{시간 schedule}}&=\underbrace{\begin{cases}u_1,&t<t_s\\u_2,&t\ge t_s\end{cases}}_{\text{전환 시각에서 값이 바뀜}}\end{aligned}`}
        meaning="복원항은 x가 커질수록 반대 방향으로 당기고, 입력항은 외부에서 state를 민다. Piecewise 입력을 쓴 이유는 scheduled event가 state crossing과 다른 종류의 사건임을 보이기 위해서다."
        symbols={[
          [raw`k`, '현재 state를 0 쪽으로 되돌리는 세기'],
          [raw`t_s`, '입력표에서 미리 알려진 switch 시간'],
          [raw`u_1,u_2`, 'switch 전후의 외부 입력'],
          [raw`-kx+u`, '내부 복원과 외부 구동을 합친 실제 rate'],
        ]}
      />

      <DrivenStateLab />

      <Misconception>
        입력이 바뀐 시각과 state가 문턱을 넘은 시각은 같은 개념이 아니다. 전자는 schedule에서 이미 알고,
        후자는 실제 trajectory를 적분하면서 찾아야 한다.
      </Misconception>
    </NlpSection>
  );
}

function EulerStep() {
  return (
    <NlpSection
      id="euler-step"
      marker="03"
      tone="violet"
      question="컴퓨터는 연속적인 rate rule을 어떻게 유한한 숫자 목록으로 바꿀까?"
      title="현재 기울기를 짧은 시간 동안 유지해 한 칸 전진한다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          수학적으로는 rate를 시간에 적분하면 state 변화가 된다. 하지만 대부분의 nonlinear model은 그 적분을
          한 줄의 해석식으로 계산할 수 없다. 컴퓨터는 시간을 작은 step으로 나누고 각 step에서 rate를 평가해
          다음 state를 만든다.
        </p>
      </div>

      <FormulaBlock
        latex={raw`\underbrace{x(t+h)}_{\text{다음의 정확한 state}}=\underbrace{x(t)}_{\text{현재 state}}+\underbrace{\int_t^{t+h}f(\tau,x(\tau))\,d\tau}_{\text{구간 안에서 실제로 누적된 변화}}`}
        meaning="이 식은 정확한 적분 identity다. 구간 안에서 state와 rate가 계속 변하므로 적분항 전체를 알아야 정확한 다음 값이 나온다. 수치 방법은 이 적분항을 계산 가능한 표본으로 근사한다."
        symbols={[
          [raw`h`, '한 번에 전진하는 시간 간격'],
          [raw`\tau`, '현재와 다음 시간 사이를 훑는 적분 변수'],
          [raw`f(\tau,x(\tau))`, '구간 내부에서 계속 달라지는 실제 rate'],
          [raw`\int_t^{t+h}`, 'rate를 구간 변화량으로 누적하는 연산'],
        ]}
      />

      <FormulaBlock
        tone="border-blue-500/30 bg-blue-500/[0.035]"
        latex={raw`\underbrace{x_{n+1}}_{\text{다음 근사 state}}=\underbrace{x_n}_{\text{현재 state}}+\underbrace{h}_{\text{짧은 시간}}\underbrace{f(t_n,x_n)}_{\text{현재에서 고정한 rate}}`}
        meaning="Explicit Euler는 구간 전체의 rate 대신 시작점 rate 하나를 사용한다. 곱셈 h·f는 rate를 state 변화량으로 바꾸고, 그 변화량을 현재 state에 더한다. 등식 오른쪽은 exact dynamics가 아니라 numerical approximation이다."
        symbols={[
          [raw`x_n`, 'n번째 grid time에서의 수치 state'],
          [raw`f(t_n,x_n)`, 'step 시작점에서 한 번 계산한 rate'],
          [raw`h f(t_n,x_n)`, '그 rate가 h 동안 유지된다고 본 누적 변화'],
          [raw`x_{n+1}`, 'Euler가 만든 다음 grid state'],
        ]}
      />

      <EulerStepLab />

      <Takeaway>
        Euler는 곡선을 직선 한 조각으로 바꾸는 가장 단순한 적분법이다. 핵심은 공식을 외우는 것이 아니라
        “어느 시점의 rate를 얼마 동안 고정했는가”를 읽는 것이다.
      </Takeaway>
    </NlpSection>
  );
}

function ErrorConvergence() {
  return (
    <NlpSection
      id="error-convergence"
      marker="04"
      tone="amber"
      question="한 step의 작은 오차와 긴 trajectory 끝의 오차는 왜 다를까?"
      title="Local error가 다음 step의 입력이 되어 전파된다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          한 step에서 만든 값은 다음 step의 시작값이 된다. 따라서 첫 오차는 사라지지 않고 다음 rate 계산에
          다시 들어간다. <strong>Local truncation error</strong>는 정확한 시작값에서 한 step만 비교한 오차다.
          <strong>Global error</strong>는 앞 step들의 오차가 전파된 끝점 차이다.
        </p>
      </div>

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{e_{n+1}}_{\text{다음 global error}}&\approx\underbrace{\left(1+h\,f_x\right)e_n}_{\substack{\text{이전 오차를}\\\text{dynamics가 전파}}}\\[-1pt]&\quad+\underbrace{\tau_{n+1}}_{\substack{\text{이번 step의}\\\text{local error}}}\end{aligned}`}
        meaning="끝점 오차는 매 step의 local error를 단순히 하나만 보는 값이 아니다. 이전 오차 eₙ이 dynamics의 민감도에 의해 증폭되거나 감쇠된 뒤 새 local error가 더해진다. 안정성 절에서 이 증폭계수를 다시 사용한다."
        symbols={[
          [raw`e_n`, 'n번째 시점까지 누적·전파된 global error'],
          [raw`f_x`, 'state가 달라질 때 rate가 얼마나 민감하게 달라지는지'],
          [raw`\tau_{n+1}`, '정확한 시작값을 가정했을 때 이번 step만의 오차'],
          [raw`1+h f_x`, '기존 오차를 다음 step으로 운반하는 근사 계수'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{E(h)}_{\text{step h의 global error}}&\approx\underbrace{C h^p}_{\text{차수 p가 정하는 감소}}\\[3pt]\underbrace{\frac{E(h)}{E(h/2)}}_{\text{step 절반 검산}}&\approx\underbrace{2^p}_{\text{예상 error ratio}}\end{aligned}`}
        meaning="Step-halving은 정답을 몰라도 수렴 패턴을 보는 방법이다. Smooth nonstiff 구간에서 Euler는 보통 p=1, classical RK4는 p=4라서 ratio가 각각 2와 16에 접근한다. 아직 asymptotic 구간이 아니거나 roundoff가 지배하면 이 비율에서 벗어날 수 있다."
        symbols={[
          [raw`E(h)`, '같은 종료 시각에서 step h로 계산한 global error'],
          [raw`C`, '문제·시간 구간·방법에 따라 달라지는 계수'],
          [raw`p`, '수치 적분법의 global convergence order'],
          [raw`2^p`, 'h를 절반으로 줄였을 때 기대하는 오차 감소 비'],
        ]}
      />

      <ErrorConvergenceLab />

      <Misconception>
        RK4가 항상 정확하거나 Euler가 항상 쓸모없는 것은 아니다. Order는 smooth한 문제에서 step이 충분히 작을 때
        나타나는 경향이다. 불연속 입력, stiff mode, event miss와 잘못된 모델은 높은 order만으로 해결되지 않는다.
      </Misconception>
    </NlpSection>
  );
}

function StabilityAndStiffness() {
  return (
    <NlpSection
      id="stability-stiffness"
      marker="05"
      tone="violet"
      question="정확한 해는 0으로 줄어드는데 수치해만 커질 수 있을까?"
      title="정확도보다 먼저 오차가 증폭되는지 확인한다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          가능하다. 빠르게 감쇠하는 가장 단순한 식에 Euler를 적용하면 매 step 같은 multiplier를 곱하는 수열이 된다.
          Exact solution이 줄어든다는 물리 사실과 numerical update가 줄어든다는 계산 사실은 별도로 검사해야 한다.
        </p>
      </div>

      <FormulaBlock
        tone="border-rose-500/30 bg-rose-500/[0.03]"
        latex={raw`\begin{aligned}\underbrace{y'=\lambda y}_{\text{음의 λ면 정확한 감쇠}}&\quad\Longrightarrow\quad\underbrace{g=1+h\lambda}_{\text{Euler multiplier}}\\[3pt]\underbrace{y_{n+1}}_{\text{다음 수치값}}&=\underbrace{g\,y_n}_{\text{현재 값과 오차에 g를 곱함}}\end{aligned}`}
        meaning="Test equation은 복잡한 dynamics의 한 mode를 떼어 본 최소 모델이다. Euler update에서 g가 state뿐 아니라 이미 섞인 error에도 반복해서 곱해진다. 그래서 exact λ가 음수라는 사실만으로 numerical decay가 보장되지 않는다."
        symbols={[
          [raw`\lambda<0`, '시간이 지나면 exact mode가 감쇠하는 조건'],
          [raw`h`, 'explicit Euler의 고정 step'],
          [raw`g=1+h\lambda`, '한 step마다 state와 error에 곱해지는 수치 multiplier'],
          [raw`y_n=g^n y_0`, 'multiplier가 반복된 numerical sequence'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{gathered}\underbrace{|g|<1}_{\text{반복할수록 오차가 줄어듦}}\\[-1pt]\Updownarrow\\[-1pt]\underbrace{-2<h\lambda<0}_{\text{음의 mode에서 Euler가 안정}}\end{gathered}`}
        meaning="절댓값을 쓰는 이유는 부호가 바뀌어도 크기가 커지면 불안정하기 때문이다. g가 0과 1 사이면 단조 감쇠하고, -1과 0 사이면 부호를 바꾸며 감쇠한다. |g|가 1보다 크면 exact solution과 반대로 numerical error가 커진다."
        symbols={[
          [raw`|g|`, '부호를 무시하고 한 step 뒤 크기 증폭만 보는 값'],
          [raw`-2<h\lambda<0`, 'negative λ에서 허용되는 step과 mode의 곱'],
          [raw`g<0`, '수치값이 step마다 부호를 바꾸는 영역'],
          [raw`|g|>1`, '반복할수록 numerical magnitude가 자라는 영역'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{\dot{\mathbf z}}_{\text{두 mode의 rate}}&=\underbrace{\begin{bmatrix}-1&0\\0&-\kappa\end{bmatrix}}_{\text{느림·빠름}}\underbrace{\mathbf z}_{\text{현재 크기}}\\[3pt]\underbrace{\kappa\gg1}_{\text{큰 time-scale 비}}&\quad\Longrightarrow\quad\underbrace{\tau_{\mathrm{fast}}=\frac1\kappa}_{\text{작은 explicit step 필요}}\end{aligned}`}
        meaning="Stiffness는 단순히 rate가 크다는 말이 아니다. 관심 있는 slow mode는 천천히 변하지만 함께 존재하는 fast stable mode 때문에 explicit method가 매우 작은 step을 써야 하는 time-scale separation이다. 이 글에서는 implicit solver 계보 대신 이 선택 원리까지만 다룬다."
        symbols={[
          [raw`z_1`, '시간상수 약 1인 느린 감쇠 mode'],
          [raw`z_2`, '시간상수 약 1/κ인 빠른 감쇠 mode'],
          [raw`\kappa`, '느린 것과 빠른 것의 time-scale 비를 만드는 큰 수'],
          ['stiff', '정확도보다 explicit stability 때문에 step이 지나치게 작아지는 상태'],
        ]}
      />

      <StabilityStiffnessLab />

      <Takeaway>
        Step을 줄이는 이유는 둘이다. 곡률을 더 잘 따라 정확도를 높이기 위해서일 수 있고, 불안정 multiplier가 오차를
        키우지 못하게 하기 위해서일 수 있다. Solver log를 읽을 때 둘을 구분해야 한다.
      </Takeaway>
    </NlpSection>
  );
}

function PhasePortrait() {
  return (
    <NlpSection
      id="phase-portrait"
      marker="06"
      tone="green"
      question="현재 위치만 알면 움직이는 물체의 다음 위치를 정할 수 있을까?"
      title="2차 운동을 위치·속도의 1차 state로 펼친다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          같은 위치를 오른쪽으로 지나가는 물체와 왼쪽으로 돌아오는 물체는 다음 순간이 다르다. 위치 하나는 완전한
          state가 아니다. 속도를 함께 기억하면 acceleration rule을 이용해 두 값을 동시에 갱신할 수 있다.
        </p>
      </div>

      <FormulaBlock
        tone="border-emerald-500/30 bg-emerald-500/[0.03]"
        latex={raw`\begin{aligned}\underbrace{v=\dot q}_{\text{속도를 state로 추가}},\qquad&\underbrace{\dot v=a(t,q,v)}_{\text{가속도가 속도 rate}}\\[3pt]\underbrace{\frac{d}{dt}\begin{bmatrix}q\\v\end{bmatrix}}_{\text{위치·속도 state의 rate}}&=\underbrace{\begin{bmatrix}v\\a(t,q,v)\end{bmatrix}}_{\text{두 state를 함께 갱신}}\end{aligned}`}
        meaning="새 변수 v= q̇를 도입해 2차 식을 두 개의 1차 식으로 바꾼다. 위치 rate가 속도이고 속도 rate가 가속도인 원인을 그대로 보존한다. 대부분의 범용 ODE solver가 first-order state vector를 받기 때문에 이 변환이 공통 입구가 된다."
        symbols={[
          [raw`q`, '물체나 경로의 위치 coordinate'],
          [raw`v=\dot q`, '위치가 초당 변하는 속도'],
          [raw`a=\dot v`, '속도가 초당 변하는 가속도'],
          [raw`[q,v]^\top`, '다음 운동을 정하는 최소 2차원 state'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{\mathbf x_{\mathrm p}}_{\text{phase state point}}&=\underbrace{[q,v]^\top}_{\text{위치와 속도}}\\[3pt]\underbrace{\dot{\mathbf x}_{\mathrm p}}_{\text{그 점의 rate arrow}}&=\underbrace{[v,a]^\top}_{\text{state의 이동 방향}}\\[3pt]\underbrace{\text{arrow를 시간에 누적}}_{\text{field를 따라 전진}}&\Longrightarrow\underbrace{\text{phase trajectory}}_{\text{state가 남긴 경로}}\end{aligned}`}
        meaning="Phase plane은 시간을 없앤 정적 그림이 아니다. 가로축 위치와 세로축 속도의 점마다 rate arrow가 있고, 초기 state가 그 field를 따라 움직인 흔적이 trajectory다. 같은 위치라도 속도가 다르면 다른 점과 다른 다음 방향을 갖는다."
        symbols={[
          [raw`(q,v)`, 'phase plane의 한 state point'],
          [raw`[v,a]^\top`, '그 점에서 state가 움직이는 방향과 빠르기'],
          ['vector field', '모든 state point에 rate arrow를 놓은 지도'],
          ['trajectory', '초기점 하나가 vector field를 따라간 시간 순서'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{E}_{\text{운동·탄성 energy}}&=\underbrace{\frac12v^2}_{\text{움직임}}+\underbrace{\frac12kq^2}_{\text{변형 저장}}\\[3pt]\underbrace{\frac{dE}{dt}}_{\text{energy rate}}&=\underbrace{-c v^2}_{\text{감쇠가 제거하는 양}}\le0\end{aligned}`}
        meaning="Energy는 phase trajectory의 모양을 해석하는 보조 ledger다. Damping c가 양수면 v²에 비례해 energy가 줄어 궤적이 원점 안쪽으로 들어간다. c=0이면 이 이상적 모델에서 energy가 보존되어 닫힌 궤도에 가까워진다."
        symbols={[
          [raw`\tfrac12v^2`, '질량을 1로 둔 kinetic energy'],
          [raw`\tfrac12kq^2`, '선형 spring에 저장된 potential energy'],
          [raw`c`, '속도에 비례해 energy를 소산시키는 damping'],
          [raw`-cv^2`, '방향과 무관하게 0 이하가 되는 dissipation rate'],
        ]}
      />

      <PhasePortraitLab />

      <Misconception>
        Phase portrait의 안쪽 나선이 “solver가 안정적”이라는 뜻은 아니다. 그것은 선택한 physical model의 state가
        감쇠하는 모양이다. Numerical stability는 같은 궤적을 step이 망가뜨리지 않는지 별도로 검사한다.
      </Misconception>
    </NlpSection>
  );
}

function TwoBoundaryEnvelope() {
  return (
    <NlpSection
      id="two-boundary-envelope"
      marker="07"
      tone="blue"
      question="출발에서 가장 빠르게 가속하면 도착할 때도 원하는 속도로 멈출 수 있을까?"
      title="출발의 forward 경계와 도착의 backward 경계를 함께 계산한다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          시작 state 하나를 주고 앞으로 푸는 것은 <strong>initial-value problem</strong>이다. 하지만 로봇 경로는
          시작 속도와 도착 속도를 모두 요구할 수 있다. 출발에서 fastest choice만 반복하면 goal 앞에서 제동 거리가
          부족할 수 있다. 도착 조건에서 시간을 거꾸로 보며 “여기까지는 이 속도 이하여야 멈출 수 있다”는 경계를
          계산해야 한다.
        </p>
      </div>

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{\dot{\mathbf x}=\mathbf f(t,\mathbf x)}_{\text{한쪽에서 앞으로 전개}}&,\quad \underbrace{\mathbf x(t_0)=\mathbf x_0}_{\text{initial condition}}\\[3pt]\underbrace{\dot{\mathbf x}=\mathbf f(t,\mathbf x)}_{\text{같은 dynamics}}&,\quad \underbrace{\mathbf B(\mathbf x(t_0),\mathbf x(t_f))=0}_{\text{양끝을 함께 묶는 boundary condition}}\end{aligned}`}
        meaning="첫 줄은 IVP, 둘째 줄은 BVP의 책임을 보여 준다. Dynamics가 같아도 주어진 정보가 한쪽 끝인지 양쪽 끝인지에 따라 계산 전략이 달라진다. Boundary condition은 중간 trajectory 전체가 아니라 양끝이 만족해야 할 관계다."
        symbols={[
          [raw`\mathbf x(t_0)`, '출발 시각의 state'],
          [raw`\mathbf x(t_f)`, '도착 시각의 state'],
          [raw`\mathbf B`, '출발과 도착 state가 함께 만족해야 하는 관계'],
          ['IVP / BVP', '한쪽 초기값 문제와 양끝 경계값 문제의 구분'],
        ]}
      />

      <FormulaBlock
        tone="border-violet-500/30 bg-violet-500/[0.03]"
        latex={raw`\begin{aligned}\underbrace{L(s,\dot s)}_{\text{최소 허용 가속}}&\le\underbrace{\ddot s}_{\text{선택할 path acceleration}}\\[-1pt]\underbrace{\ddot s}_{\text{같은 현재 선택}}&\le\underbrace{U(s,\dot s)}_{\text{최대 허용 가속}}\end{aligned}`}
        meaning="Robot joint path를 q=q(s)로 고정하면 actuator bounds가 path acceleration의 아래·위 한계로 바뀐다. Forward rollout은 보통 U를, goal에서 역적분하는 braking envelope는 L 쪽을 사용한다. L과 U는 상수가 아니라 현재 path position과 speed에 따라 달라질 수 있다."
        symbols={[
          [raw`s`, '기하학적 path를 따라가는 scalar 위치'],
          [raw`\dot s`, 'path 위에서 전진하는 속도'],
          [raw`\ddot s`, 'path speed를 바꾸는 acceleration'],
          [raw`L,U`, 'actuator·contact·기타 제약이 만든 feasible acceleration interval'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{v_{\mathrm f}(s)}_{\text{출발 forward envelope}}&=\underbrace{\sqrt{2a_+s}}_{\text{최대 가속을 누적}}\\[3pt]\underbrace{v_{\mathrm b}(s)}_{\text{도착 backward envelope}}&=\underbrace{\sqrt{2a_-(S-s)}}_{\text{남은 거리에서 멈출 제동 속도}}\\[3pt]\underbrace{v(s)}_{\text{실행할 속도}}&=\underbrace{\min(v_{\mathrm f},v_{\max},v_{\mathrm b})}_{\text{세 경계 중 가장 낮은 것 선택}}\end{aligned}`}
        meaning="상수 acceleration인 최소 예에서 forward와 backward 속도 경계를 닫힌 식으로 썼다. Min을 쓰는 이유는 출발 가능성, 속도 상한, 도착 제동 가능성을 동시에 넘지 않기 위해서다. Speed cap이 낮으면 한 교점 대신 두 switch와 cruise가 생긴다."
        symbols={[
          [raw`a_+`, '앞으로 밀 수 있는 최대 acceleration'],
          [raw`a_-`, '멈추는 데 쓸 수 있는 braking magnitude'],
          [raw`S`, '전체 path length'],
          [raw`v_{\max}`, '별도로 주어진 velocity limit curve의 상수형 예'],
        ]}
      />

      <BoundaryEnvelopeLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          위 실험은 상수 bound라서 구조가 선명하다. 실제 <InternalLink slug="robot-trajectory-generation">로봇 궤적 생성</InternalLink>에서는
          torque, velocity, contact와 curvature가 state마다 L과 U를 바꾼다. Forward와 backward curve가 단순히 한 번
          만난다고 가정하면 안 된다. Velocity limit curve의 tangent point나 여러 switching event가 생길 수 있다.
        </p>
      </div>

      <Takeaway>
        “앞으로 최대 가속, 뒤로 최대 감속”은 두 곡선을 그리는 장식이 아니다. 출발 가능성과 도착 가능성을 같은
        phase plane에 놓고 그 교집합 안에서 실행할 trajectory를 선택하는 경계 계산이다.
      </Takeaway>
    </NlpSection>
  );
}

function EventsAndTolerance() {
  return (
    <NlpSection
      id="events-tolerance"
      marker="08"
      tone="amber"
      question="한 step의 시작과 끝이 안전하면 그 사이도 안전하다고 말할 수 있을까?"
      title="Grid 사이의 event와 local tolerance를 다른 책임으로 다룬다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Solver는 모든 시간을 계산하지 않는다. 선택한 step의 endpoint와 내부 stage만 본다. Constraint function이
          한 step 안에서 경계를 넘었다가 다시 돌아오면 양 endpoint의 부호가 같을 수 있다. Endpoint sign change만
          찾는 event detector는 이 두 crossing을 모두 놓친다.
        </p>
      </div>

      <FormulaBlock
        tone="border-amber-500/30 bg-amber-500/[0.035]"
        latex={raw`\begin{aligned}\underbrace{g(t,\mathbf x(t))=0}_{\text{찾아야 할 state event}}\\[3pt]\underbrace{g_n g_{n+1}<0}_{\text{endpoint 부호가 다름}}&\quad\Longrightarrow\quad\underbrace{\text{root가 사이에 있음}}_{\text{단일 crossing 검출}}\end{aligned}`}
        meaning="Event function은 goal 도착, 속도 한계, 충돌 경계처럼 정확한 시각을 찾아야 하는 조건을 scalar root로 바꾼다. Endpoint 곱이 음수면 적어도 한 root가 있지만, 곱이 양수라고 root가 없다는 뜻은 아니다. 짝수 번 crossing하면 부호가 원래대로 돌아온다."
        symbols={[
          [raw`g(t,\mathbf x(t))`, '경계 안팎을 부호로 구분하는 event function'],
          [raw`g_n,g_{n+1}`, '현재와 다음 solver endpoint에서 평가한 event 값'],
          [raw`g_n g_{n+1}<0`, '부호 변화로 bracket을 얻는 충분한 검출 신호'],
          ['짝수 crossing', '한 step 안에서 나갔다가 다시 들어와 endpoint 부호가 같은 경우'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{|e_i|}_{\text{local error 추정}}&\le\underbrace{T_i}_{\text{i번째 state의 허용치}}\\[3pt]\underbrace{T_i}_{\text{절대·상대 기준 결합}}&=\underbrace{\mathrm{atol}_i}_{\text{0 근처 기준}}+\underbrace{\mathrm{rtol}\,|x_i|}_{\text{state 크기 비례 기준}}\end{aligned}`}
        meaning="Absolute와 relative tolerance를 더하는 이유는 state가 0 근처일 때 relative 기준이 사라지고, 큰 state에서는 고정 absolute 기준만으로 scale을 맞추기 어렵기 때문이다. 이 부등식은 solver의 local error controller이지 true global error나 model validity 보증이 아니다."
        symbols={[
          [raw`e_i`, 'embedded method 등이 추정한 한 step의 i번째 state error'],
          [raw`\mathrm{atol}_i`, '작은 state에서도 유지할 absolute error scale'],
          [raw`\mathrm{rtol}`, 'state magnitude에 비례해 허용할 relative fraction'],
          [raw`|x_i|`, 'component마다 다른 state scale을 반영하는 크기'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{\Delta t_{\mathrm{step}}\le h_{\max}}_{\text{넓은 event 공백을 막음}}\\[3pt]\underbrace{\tilde{\mathbf x}(t)}_{\text{step 내부 dense output}}&\approx\underbrace{\mathbf x(t)}_{\text{grid 사이 state}}\end{aligned}`}
        meaning="max_step은 solver가 event-rich interval을 한 번에 건너뛰지 못하게 한다. Dense output은 이미 계산한 stage에서 step 내부 state를 보간해 root를 좁힌다. 둘 다 tolerance와 다른 도구이며, event가 매우 빠르게 왕복하면 문제에 맞는 추가 분할이나 event 설계가 필요하다."
        symbols={[
          [raw`h_{\max}`, 'solver가 넘지 못하게 한 최대 step width'],
          [raw`\tilde{\mathbf x}(t)`, 'grid 사이를 평가하기 위한 numerical interpolant'],
          ['scheduled break', '입력이 바뀌는 시간을 알 때 그 시각에서 step을 강제로 나누는 방법'],
          ['dense output', '모든 작은 step을 다시 풀지 않고 내부 trajectory를 평가하는 기능'],
        ]}
      />

      <EventDetectionLab />

      <Misconception>
        Tolerance를 매우 작게 잡아도 event function 자체가 없거나 한 step 안의 여러 crossing을 보지 못하면 경계를
        놓칠 수 있다. 반대로 event를 정확히 찾았어도 dynamics와 단위가 틀리면 물리적으로 옳은 결과가 아니다.
      </Misconception>
    </NlpSection>
  );
}

function ReturnToUpperQuestions() {
  return (
    <NlpSection
      id="return-to-upper-questions"
      marker="09"
      tone="teal"
      question="Solver가 성공했다고 나오면 모델까지 맞았다고 말해도 될까?"
      title="수치 성공과 물리·학습 모델의 타당성을 분리한다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          ODE 계산에는 서로 다른 실패 층이 있다. Discretization error는 step과 method를 바꿔 비교한다. Stability는
          error multiplier가 커지는지 본다. Event miss는 grid 사이의 crossing을 검사한다. Model error는 dynamics,
          parameter, unit와 boundary가 실제 시스템을 나타내는지 실험과 source로 확인한다. 한 층의 PASS가 다른 층을
          대신하지 않는다.
        </p>
      </div>

      <FormulaBlock
        tone="border-slate-500/30 bg-slate-500/[0.03]"
        latex={raw`\begin{aligned}\underbrace{\text{관측 차이}}_{\text{현실과 예측의 간격}}&=\underbrace{\text{수치 오차}}_{\text{step·method·event}}\\[-1pt]&+\underbrace{\text{모델 오차}}_{\text{식·단위·parameter}}\\[-1pt]&+\underbrace{\text{측정 불확실성}}_{\text{sensor·sampling·noise}}\end{aligned}`}
        meaning="이 식은 exact algebraic identity가 아니라 검증 책임을 빠뜨리지 않기 위한 error ledger다. Solver 설정을 정교하게 만들면 numerical part는 줄일 수 있지만, 잘못된 dynamics나 sensor bias가 자동으로 고쳐지지는 않는다."
        symbols={[
          ['수치 오차', '같은 mathematical model을 유한 step으로 계산하며 생기는 차이'],
          ['모델 오차', '선택한 방정식과 parameter가 실제 mechanism을 놓친 차이'],
          ['측정 불확실성', 'sensor 위치·noise·sampling과 calibration이 만든 범위'],
          ['관측 차이', '세 층이 섞여 test와 prediction 사이에 나타난 residual'],
        ]}
      />

      <HandoffGrid
        items={[
          {
            title: 'Diffusion · reverse trajectory',
            body: <>Noise state에서 data 쪽으로 돌아오는 ODE/SDE의 방향, schedule과 solver step을 읽으려면 <InternalLink slug="diffusion-models">Diffusion 모델</InternalLink>로 돌아간다.</>,
          },
          {
            title: 'Robot · path time scaling',
            body: <>Torque-derived acceleration interval과 velocity limit curve에서 forward/backward envelope를 만들려면 <InternalLink slug="robot-trajectory-generation">로봇 궤적 생성</InternalLink>으로 돌아간다.</>,
          },
          {
            title: 'Thermal · friction feedback',
            body: <>Loss power가 temperature를 바꾸고 temperature가 다시 viscosity와 loss를 바꾸는 state loop는 <InternalLink slug="robot-contact-tribology-lubrication-wear">접촉·윤활·마모</InternalLink>에서 확인한다.</>,
          },
          {
            title: 'SSM · continuous to discrete',
            body: <>Continuous state equation을 token-by-token recurrence로 바꿀 때의 step과 memory는 <InternalLink slug="llm-architecture-hybrid-linear">Hybrid·Linear LLM</InternalLink>으로 올라간다.</>,
          },
        ]}
      />

      <CapabilityCheck
        items={[
          'State, rate, input, initial condition과 단위를 먼저 식별한다.',
          'Autonomous rule과 time-scheduled input을 분리한다.',
          'Euler 한 step을 rate × interval의 누적으로 직접 설명한다.',
          'Local/global error, convergence order와 stability를 구분한다.',
          'Exact decay인데 explicit Euler가 발산하는 조건을 multiplier로 판단한다.',
          '2차 운동을 위치·속도의 first-order state로 바꾼다.',
          'Phase plane에서 vector field와 한 trajectory를 구분한다.',
          'IVP와 BVP, forward/backward envelope와 speed cap을 함께 읽는다.',
          'Tolerance, max step, dense output과 event miss의 책임을 분리한다.',
          'Solver PASS가 unit·dynamics·boundary의 물리 검증을 대신하지 못함을 설명한다.',
        ]}
      />

      <StopRule title="이 기반은 여기서 끊는다.">
        상위 네 경로를 읽는 데 ODE 해석해의 역사, 존재·유일성 정리의 증명, PDE나 모든 stiff solver 계보까지 먼저
        내려갈 필요는 없다. 새 상위 글이 symplectic integration, adjoint sensitivity 또는 PDE를 실제 first-need로
        요구할 때만 별도 기반을 추가한다.
      </StopRule>

      <Takeaway>
        ODE의 핵심은 어려운 기호가 아니다. 현재 state에서 rate를 계산하고, 작은 시간을 누적하며, 오차가 증폭되지
        않는지 보고, grid 사이의 사건과 양끝 경계를 놓치지 않는 것이다. 이 원장으로 최신 모델의 solver 선택을
        다시 읽을 수 있다.
      </Takeaway>

      <SourceNotes
        sources={[
          {
            label: 'MIT ES.1803 · Numerical Methods (2024)',
            href: 'https://ocw.mit.edu/courses/es-1803-differential-equations-spring-2024/resources/mit18_03s24_lec10/',
            note: 'Euler step, 누적 error, step refinement와 numerical trajectory가 phase boundary를 잘못 넘을 수 있는 교육 근거.',
          },
          {
            label: 'MIT 18.086 · Stiff ODEs',
            href: 'https://ocw.mit.edu/courses/18-086-mathematical-methods-for-engineers-ii-spring-2006/resources/am63/',
            note: 'Exact decay와 explicit Euler stability multiplier, multiple time scale과 stiffness의 1차 강의 자료.',
          },
          {
            label: 'SciPy · solve_ivp',
            href: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html',
            note: '현재 IVP API의 method boundary, rtol·atol, dense_output, events와 max_step 계약.',
          },
          {
            label: 'SciPy · solve_bvp',
            href: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_bvp.html',
            note: '한쪽 초기값과 양끝 boundary condition이 다른 문제임을 확인하는 현재 구현 자료.',
          },
          {
            label: 'Modern Robotics · Chapter 9.4, Part 3',
            href: 'https://modernrobotics.northwestern.edu/nu-gm-book-resource/9-4-time-optimal-time-scaling-part-3-of-3/',
            note: 'Path acceleration interval, forward/backward integration, velocity limit curve와 switching logic의 상위 적용 근거.',
          },
        ]}
      />
    </NlpSection>
  );
}

export default function DifferentialEquationsPhasePlaneArticle() {
  return (
    <>
      <StateRateLedger />
      <DrivenState />
      <EulerStep />
      <ErrorConvergence />
      <StabilityAndStiffness />
      <PhasePortrait />
      <TwoBoundaryEnvelope />
      <EventsAndTolerance />
      <ReturnToUpperQuestions />
    </>
  );
}
