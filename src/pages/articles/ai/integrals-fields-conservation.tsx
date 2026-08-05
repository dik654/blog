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
  ConservativeGridLab,
  ControlVolumeLedgerLab,
  DivergenceFieldLab,
  DomainMeasureLab,
  FluxOrientationLab,
  IntegralFieldLabLegend,
  InternalFaceCancellationLab,
  PartitionRefinementLab,
  ResultantLineOfActionLab,
} from './integrals-fields-conservation/viz/IntegralFieldLabs';

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
        <MathFormula display className="my-0 text-xs sm:text-base">{latex}</MathFormula>
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

function WhyAccumulation() {
  return (
    <NlpSection
      id="why-accumulation"
      marker="01"
      tone="teal"
      question="한 점의 값은 어떻게 beam 전체의 힘이나 tank 전체의 질량이 될까?"
      title="Point value가 아니라 작은 조각의 기여를 모은다"
    >
      <QuestionLead
        question="3 kg/m인 줄의 질량은 3 kg일까?"
        answer="아니다. 3 kg/m는 위치 한 구간의 선밀도다. 실제 질량을 얻으려면 각 작은 길이와 곱한 뒤 줄 전체에서 더해야 한다. 분포하중, 표면 압력, 열과 유량도 같은 방식으로 density를 total로 바꾼다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Robot link의 한 지점에 <code>4 kN/m</code>라는 distributed load가
          적혀 있어도 그것은 아직 force가 아니다. Bearing surface의
          <code>20 MPa</code>도 아직 total normal load가 아니다. Tank 입구의
          <code>5 kg/s</code>도 tank 안에 저장된 mass가 아니다. 이 값들은 각각
          길이당 힘, 면적당 힘, 시간당 이동량을 말한다.
        </p>
        <p>
          시스템 질문에 답하려면 먼저 <strong>무엇이 어디에 분포했는가</strong>를
          정한다. 그다음 작은 조각 하나가 가진 양을 계산하고 모든 조각을 더한다.
          경계를 통과하는 양이라면 방향까지 정해야 한다. 마지막으로 들어온 양,
          나간 양, 내부에서 생긴 양과 저장량 변화가 같은 ledger를 이루는지 검사한다.
        </p>
      </div>

      <ConceptPrimer
        items={[
          {
            term: 'Density',
            meaning: '길이·면적·부피 한 단위에 얼마나 들어 있는지를 나타내는 값이다.',
            why: 'point value를 그대로 더하지 않고 domain 크기와 곱해야 함을 알려 준다.',
          },
          {
            term: 'Measure',
            meaning: '더하는 조각의 길이, 면적 또는 부피다.',
            why: 'dx, ds, dA, dV가 어떤 geometry와 단위를 선택하는지 고정한다.',
          },
          {
            term: 'Field',
            meaning: '공간의 각 위치에 scalar나 vector 값을 배정한 map이다.',
            why: '온도처럼 크기만 있는 값과 속도처럼 방향이 있는 값을 구분한다.',
          },
          {
            term: 'Balance',
            meaning: '저장량 변화와 경계 이동, 내부 생성·소멸을 맞추는 장부다.',
            why: 'inflow와 outflow가 다른 상황을 보존 위반으로 오해하지 않게 한다.',
          },
        ]}
      />

      <IntegralFieldLabLegend />

      <Takeaway>
        적분은 “그래프 아래 색칠한 면적”이 본질이 아니다. 위치마다 다른
        density에 그 위치의 작은 measure를 곱하고, 단위와 방향을 보존한 채
        시스템 전체로 합치는 연산이다.
      </Takeaway>
    </NlpSection>
  );
}

function SumToIntegral() {
  return (
    <NlpSection
      id="sum-to-integral"
      marker="02"
      tone="blue"
      question="조각을 잘게 나누면 왜 전체량에 가까워질까?"
      title="Density × measure의 합을 연속 적분으로 좁힌다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          길이 <code>L</code>인 줄을 여러 구간으로 나눈다. 각 구간 안에서
          density를 대표할 sample point를 하나 고르고, 그 값에 구간 길이를
          곱한다. 이렇게 얻은 작은 질량들을 더하면 전체 질량의 근사가 된다.
          Density가 구간 안에서 변한다면 큰 구간 하나는 그 변화를 놓친다.
          Partition을 더 잘게 나누면 한 sample이 대표해야 하는 범위가 줄어든다.
        </p>
      </div>

      <FormulaBlock
        tone="border-cyan-500/30 bg-cyan-500/[0.035]"
        latex={raw`\begin{aligned}\underbrace{Q_N}_{\text{N개 조각의 근사}}&=\sum_{i=1}^{N}\underbrace{\rho(x_i^*)}_{\text{i번째 밀도}}\underbrace{\Delta \mu_i}_{\text{i번째 조각 크기}}\\[4pt]\underbrace{Q}_{\text{연속 영역의 총량}}&=\lim_{\max\Delta\mu_i\to0}Q_N=\int_{\Omega}\rho\,d\mu\end{aligned}`}
        meaning="각 조각의 density는 아직 단위 measure당 값이다. 실제 조각이 가진 양으로 바꾸기 위해 Δμ를 곱하고, 모든 조각을 더한다. 가장 큰 조각의 크기가 0에 가까워지도록 partition을 refine했을 때 합이 한 값으로 수렴하면 그 값을 적분으로 정의한다."
        symbols={[
          [raw`\Omega`, '양이 분포한 전체 선·면·부피 domain'],
          [raw`x_i^*`, 'i번째 조각 안에서 density를 읽은 sample point'],
          [raw`\Delta\mu_i`, 'i번째 조각의 길이·면적·부피'],
          [raw`d\mu`, 'domain 종류에 따라 ds, dA 또는 dV가 되는 작은 measure'],
        ]}
      />

      <FormulaBlock
        latex={raw`\underbrace{[\lambda]}_{\text{선밀도 단위}}\underbrace{[ds]}_{\text{길이 단위}}=\underbrace{\frac{\mathrm{kg}}{\mathrm m}\,\mathrm m}_{\text{길이가 약분됨}}=\underbrace{\mathrm{kg}}_{\text{전체 질량 단위}}`}
        meaning="단위 검산은 어떤 measure를 곱해야 하는지 알려 주는 가장 빠른 오류 탐지다. kg/m인 선밀도를 그대로 합하면 kg/m에 머문다. 작은 길이 ds를 곱해야 각 조각의 kg이 되고, 그 조각들을 더해도 결과는 kg이다."
        symbols={[
          [raw`\lambda`, '위치에 따른 선밀도 [kg/m]'],
          [raw`ds`, '곡선을 따라 잰 작은 길이 [m]'],
          [raw`\lambda\,ds`, '작은 선분 하나가 가진 질량 [kg]'],
        ]}
      />

      <PartitionRefinementLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          조각 수만 늘린다고 모든 문제가 자동으로 해결되는 것은 아니다.
          무한대로 튀는 singularity, 빠른 oscillation, 불연속 경계와 나쁜 sample
          rule은 별도 분석이 필요하다. 이 글에서는 bounded piecewise-smooth
          density를 사용해 적분의 공통 뼈대에 집중한다.
        </p>
      </div>

      <Misconception>
        적분 기호가 보이면 무조건 미분의 역연산부터 찾을 필요는 없다. 공학
        모델에서는 먼저 integrand의 단위, domain과 measure를 정해야 한다.
        Antiderivative는 그 적분값을 계산하는 한 방법이다.
      </Misconception>
    </NlpSection>
  );
}

function DomainAndFields() {
  return (
    <NlpSection
      id="domain-and-fields"
      marker="03"
      tone="violet"
      question="dx, ds, dA와 dV는 왜 서로 바꿔 쓸 수 없을까?"
      title="Domain geometry와 field의 output shape를 먼저 고른다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Straight x축 위의 작은 간격은 <code>dx</code>, 휘어진 cable을 따라 잰
          작은 길이는 <code>ds</code>다. Surface patch는 <code>dA</code>, volume
          cell은 <code>dV</code>다. 모두 “아주 작은 조각”이지만 차원과 단위가
          다르다. Integrand의 density 단위도 이 denominator와 짝을 이뤄야 한다.
        </p>
        <p>
          Field의 output도 정해야 한다. Temperature와 mass density는 위치마다
          숫자 하나를 주는 scalar field다. Velocity와 heat flux는 위치마다 방향이
          있는 vector를 준다. Vector field를 component별로 그냥 적분하면 vector
          total이 남는다. 경계를 통과하는 scalar flux를 원하면 뒤에서 normal과
          dot product를 사용해야 한다.
        </p>
      </div>

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{m}_{\text{선 전체량}}&=\int_C\underbrace{\lambda(s)}_{\text{길이당 밀도}}\,\underbrace{ds}_{\text{작은 길이}}\\[3pt]\underbrace{Q_A}_{\text{면 전체량}}&=\int_A\underbrace{q_A(\mathbf x)}_{\text{면적당 밀도}}\,\underbrace{dA}_{\text{작은 면적}}\\[3pt]\underbrace{Q_V}_{\text{부피 전체량}}&=\int_V\underbrace{\rho(\mathbf x)}_{\text{부피당 밀도}}\,\underbrace{dV}_{\text{작은 부피}}\end{aligned}`}
        meaning="세 식의 더하기 원리는 같지만 domain measure가 다르다. 선에서는 길이당 양에 ds, 면에서는 면적당 양에 dA, 부피에서는 부피당 양에 dV를 곱한다. 결과 기호를 다르게 둔 이유는 mass, charge, heat처럼 실제로 누적하는 물리량이 문제마다 다르기 때문이다."
        symbols={[
          [raw`C,A,V`, '각각 curve, surface, volume domain'],
          [raw`\lambda,q_A,\rho`, '각 domain measure 한 단위당 density'],
          [raw`ds,dA,dV`, '선·면·부피의 미소 measure'],
          [raw`m,Q_A,Q_V`, 'domain 전체에 누적된 total quantity'],
        ]}
      />

      <DomainMeasureLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Curve를 따라 vector field가 한 일처럼 방향이 중요한 line integral도
          있다. Curve의 작은 displacement <code>d r</code>는 unit tangent
          <code>T</code> 방향으로 길이 <code>ds</code>만큼 움직인 vector다. 따라서
          force 중 실제 이동 방향 component만 일을 만든다.
        </p>
      </div>

      <FormulaBlock
        tone="border-violet-500/30 bg-violet-500/[0.035]"
        latex={raw`\begin{aligned}\underbrace{d\mathbf r}_{\text{작은 이동 벡터}}&=\underbrace{\mathbf T}_{\text{단위 접선}}\underbrace{ds}_{\text{호의 작은 길이}}\\[4pt]\underbrace{\int_C\mathbf F\cdot d\mathbf r}_{\text{경로를 따라 한 일}}&=\int_C\underbrace{\mathbf F\cdot\mathbf T}_{\text{접선 방향 힘}}\,ds\end{aligned}`}
        meaning="d r를 T ds로 나누면 이동의 방향과 길이가 분리된다. Dot product를 쓰는 이유는 경로에 수직인 force component가 이동 방향의 일을 하지 않기 때문이다. Curve 방향을 뒤집으면 T와 d r의 부호가 바뀌어 vector line integral의 부호도 바뀐다."
        symbols={[
          [raw`\mathbf T`, 'curve 진행 방향의 unit tangent vector'],
          [raw`ds`, '항상 0 이상인 작은 arc length'],
          [raw`\mathbf F\cdot\mathbf T`, 'F를 이동 방향에 투영한 signed scalar'],
          [raw`d\mathbf r`, '진행 방향을 포함한 작은 displacement vector'],
        ]}
      />

      <StopRule>
        이 글은 scalar density 적분과 vector field의 tangent·normal projection을
        구분하는 데서 멈춘다. Conservative potential, curl과 Stokes theorem은
        hidden transfer 문제에 필요하지 않으므로 더 내려가지 않는다.
      </StopRule>
    </NlpSection>
  );
}

function ResultantMoment() {
  return (
    <NlpSection
      id="resultant-moment"
      marker="04"
      tone="amber"
      question="분포하중을 점 하나의 힘으로 바꿀 때 무엇을 보존해야 할까?"
      title="합력과 기준점 모멘트를 함께 맞춘다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Beam 위의 distributed load <code>w(x)</code>는 길이당 force다. 작은
          구간 <code>dx</code>가 받는 force는 <code>w(x)dx</code>이고, 이를 span
          전체에서 더하면 resultant force가 된다. 그러나 같은 크기의 force를
          아무 위치에 놓으면 회전 효과가 달라진다.
        </p>
      </div>

      <FormulaBlock
        latex={raw`\underbrace{dF}_{\text{작은 구간의 힘}}=\underbrace{w(x)}_{\text{길이당 하중}}\underbrace{dx}_{\text{작은 길이}},\qquad \underbrace{R}_{\text{전체 합력}}=\int_0^L w(x)\,dx`}
        meaning="Distributed load를 작은 force 조각으로 바꾸기 위해 길이당 load에 dx를 곱한다. 모든 조각의 signed force를 더한 값 R은 원래 분포와 같은 translational effect를 만드는 resultant다."
        symbols={[
          [raw`w(x)`, 'beam 위치 x의 distributed load [N/m 또는 kN/m]'],
          [raw`dF`, '작은 구간 dx에 작용하는 force [N 또는 kN]'],
          [raw`L`, 'load가 분포한 span length'],
          [raw`R`, '분포하중의 signed resultant force'],
        ]}
      />

      <FormulaBlock
        tone="border-amber-500/30 bg-amber-500/[0.035]"
        latex={raw`\begin{aligned}\underbrace{M_O}_{\text{O점 기준 모멘트}}&=\int_0^L\underbrace{x}_{\text{O점까지 거리}}\underbrace{w(x)\,dx}_{\text{작은 힘}}\\[4pt]\underbrace{M_O}_{\text{분포가 만든 회전 효과}}&=\underbrace{R\,x_R}_{\text{등가 점힘의 회전 효과}}\end{aligned}`}
        meaning="각 작은 force에 같은 기준점 O에서 잰 lever arm x를 곱해 moment contribution을 만들고 더한다. Equivalent point force는 크기 R뿐 아니라 O점 모멘트도 같아야 하므로 작용선 x_R=M_O/R이 정해진다."
        symbols={[
          [raw`O`, '모든 moment를 비교하는 동일한 reference origin'],
          [raw`M_O`, '분포하중 전체가 O에 만드는 signed moment [N·m]'],
          [raw`x_R`, 'O에서 equivalent resultant line까지의 거리 [m]'],
          [raw`R x_R`, '점힘 R이 같은 origin에 만드는 moment'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}
\underbrace{w(x)}_{\text{공개 삼각형 하중}}
&=2x\;\mathrm{kN/m},\quad 0\le x\le3\;\mathrm m\\[4pt]
\underbrace{R}_{\text{전체 힘}}
&=\int_0^3 2x\,dx=9\;\mathrm{kN}
\end{aligned}`}
        meaning="Load density 2x에 작은 길이 dx를 곱한 force를 0 m부터 3 m까지 더하면 전체 힘 R이 된다. 이 경우 적분값은 삼각형 면적 9 kN과 같지만, 적분 절차를 쓰면 임의의 비균일 분포에도 그대로 적용할 수 있다."
        symbols={[
          [raw`2x`, 'x가 1 m 늘 때 2 kN/m씩 증가하는 load density'],
          [raw`9\;\mathrm{kN}`, '분포하중의 total force'],
          [raw`dx`, 'load density를 작은 force로 바꾸는 길이 조각'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}
\underbrace{M_O}_{\text{O점 기준 1차 모멘트}}
&=\int_0^3 2x^2\,dx=18\;\mathrm{kN\,m}\\[4pt]
\underbrace{x_R}_{\text{등가 힘의 작용선}}
&=\frac{M_O}{R}=2\;\mathrm m
\end{aligned}`}
        meaning="작은 force 2x dx마다 origin까지 거리 x를 한 번 더 곱해 moment를 더한다. 같은 전체 힘 R이 같은 moment를 만들 위치는 x_R=M_O/R이므로, 넓은 쪽에서 span의 1/3 떨어진 2 m가 된다."
        symbols={[
          [raw`18\;\mathrm{kN\,m}`, '왼쪽 origin에 대한 total moment'],
          [raw`M_O/R`, '전체 moment를 전체 force로 나누어 line of action을 찾는 비율'],
          [raw`2\;\mathrm m`, 'force와 moment를 모두 맞추는 line of action'],
        ]}
      />

      <ResultantLineOfActionLab />

      <Misconception>
        Resultant의 크기가 같다는 사실만으로 두 load system이 statically
        equivalent하지 않다. 같은 기준점에 대한 moment까지 맞아야 하며, 3D에서는
        force vector와 moment vector를 함께 보존해야 한다.
      </Misconception>
    </NlpSection>
  );
}

function OrientedFlux() {
  return (
    <NlpSection
      id="oriented-flux"
      marker="05"
      tone="blue"
      question="경계 옆으로 흐르는 vector까지 통과량으로 세면 왜 틀릴까?"
      title="Normal projection과 orientation으로 signed flux를 만든다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          문을 가로지르는 공기의 양을 센다고 생각하자. 공기가 문과 나란히
          흐르면 속도가 커도 문을 통과하지 않는다. 문을 정면으로 뚫고 나갈 때
          가장 크게 센다. Surface의 unit normal <code>n</code>은 어느 방향을
          “나감”으로 셀지 정하고, dot product는 field의 normal component만 남긴다.
        </p>
      </div>

      <FormulaBlock
        tone="border-blue-500/30 bg-blue-500/[0.035]"
        latex={raw`\underbrace{d\Phi}_{\text{작은 면의 부호 있는 통과량}}=\underbrace{\mathbf F\cdot\mathbf n}_{\text{법선 방향 성분}}\,\underbrace{dA}_{\text{작은 면적}}=\underbrace{\lVert\mathbf F\rVert\cos\theta}_{\text{법선 투영}}\,dA`}
        meaning="Dot product를 쓰면 surface tangent 방향의 field component가 제거되고 normal 방향 component만 남는다. cos θ는 field와 선택한 normal이 같은 방향이면 양수, 반대면 음수, 직각이면 0을 만든다. 여기에 작은 면적 dA를 곱해야 실제 patch 통과량이 된다."
        symbols={[
          [raw`\mathbf F`, '단위 면적당 이동량을 담은 vector field'],
          [raw`\mathbf n`, 'surface의 선택된 unit normal'],
          [raw`\theta`, 'F와 n 사이의 angle'],
          [raw`d\Phi`, '작은 surface patch를 지나는 signed contribution'],
        ]}
      />

      <FluxOrientationLab />

      <FormulaBlock
        latex={raw`\underbrace{\Phi_S}_{\text{면 전체 통과량}}=\int_S\mathbf F\cdot\mathbf n\,dA,\qquad \underbrace{\mathbf n}_{\text{닫힌 경계의 방향 약속}}=\mathbf n_{\mathrm{out}}`}
        meaning="각 patch의 signed normal contribution을 surface 전체에서 더한다. 닫힌 surface에서는 outward normal을 convention으로 고정해야 서로 다른 위치의 부호를 같은 언어로 비교할 수 있다. Inward normal을 쓰면 모든 contribution과 total flux의 부호가 함께 뒤집힌다."
        symbols={[
          [raw`S`, 'flux를 세는 oriented surface'],
          [raw`\Phi_S`, 'S를 통과하는 net signed flux'],
          [raw`\mathbf n_{\mathrm{out}}`, '닫힌 volume에서 바깥을 향하는 unit normal'],
        ]}
      />

      <Takeaway>
        Flux의 부호는 field가 좋거나 나쁘다는 평가가 아니다. 선택한 surface
        orientation에 대해 나가는지 들어오는지를 기록한 방향 계약이다.
      </Takeaway>
    </NlpSection>
  );
}

function DivergenceLocalGlobal() {
  return (
    <NlpSection
      id="divergence-local-global"
      marker="06"
      tone="green"
      question="작은 box마다 센 net outflow를 더하면 왜 내부 벽이 사라질까?"
      title="Divergence의 local ledger를 바깥 경계 flux로 합친다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Divergence는 한 점 근처의 아주 작은 volume에서 field가 얼마나 더
          나가려는지를 volume당 값으로 나타낸다. x, y, z 방향 component가 해당
          방향으로 얼마나 증가하는지를 더한다. Field vector 자체의 크기나 특정
          방향의 부호와는 다른 양이다.
        </p>
      </div>

      <FormulaBlock
        latex={raw`\underbrace{\nabla\cdot\mathbf F}_{\text{단위 부피당 순유출}}=\underbrace{\frac{\partial F_x}{\partial x}}_{\text{x 방향 변화}}+\underbrace{\frac{\partial F_y}{\partial y}}_{\text{y 방향 변화}}+\underbrace{\frac{\partial F_z}{\partial z}}_{\text{z 방향 변화}}`}
        meaning="각 component가 자기 coordinate 방향으로 얼마나 변하는지 더하면 작은 volume의 net outward flux를 volume으로 나눈 극한이 된다. Cross component를 더하지 않는 이유는 각 face normal과 같은 방향 component만 그 face를 통과하기 때문이다."
        symbols={[
          [raw`F_x,F_y,F_z`, 'vector field의 coordinate component'],
          [raw`\partial F_x/\partial x`, '서로 마주 보는 x-normal face의 flux 차이를 만드는 local rate'],
          [raw`\nabla\cdot\mathbf F`, 'scalar divergence field'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          좌표 미분이 실제 경계 통과량과 어떻게 연결되는지 숫자로 확인해 보자.
          가로 <code>2.5</code>, 세로 <code>1.5</code>인 rectangle에서
          <code>F=(x, 0.5y)</code>를 쓴다. 오른쪽으로 갈수록 x방향 화살표가
          길어지고, 위로 갈수록 y방향 화살표가 길어진다. 따라서 오른쪽 face와
          위쪽 face에서만 outward flux가 남는다.
        </p>
      </div>

      <FormulaBlock
        tone="border-emerald-500/30 bg-emerald-500/[0.035]"
        latex={raw`\begin{aligned}
\mathbf F(x,y)&=\left(x,\frac12y\right)\\[3pt]
V&=\left[0,\frac52\right]\times\left[0,\frac32\right]\\[3pt]
\underbrace{\nabla\cdot\mathbf F}_{\text{local 순유출 밀도}}
&=\partial_xx+\partial_y\!\left(\frac12y\right)=\frac32
\end{aligned}`}
        meaning="x방향 component는 x에 따라 rate 1로, y방향 component는 y에 따라 rate 1/2로 커진다. 자기 coordinate 방향 변화율을 더하면 rectangle 내부 어디서나 divergence가 3/2가 된다."
        symbols={[
          [raw`V`, '가로 5/2, 세로 3/2인 rectangle domain'],
          [raw`\partial_xx`, 'x-normal faces의 차이를 만드는 x component 변화율 1'],
          [raw`\partial_y(\frac12y)`, 'y-normal faces의 차이를 만드는 y component 변화율 1/2'],
        ]}
      />

      <FormulaBlock
        tone="border-emerald-500/30 bg-emerald-500/[0.035]"
        latex={raw`\begin{aligned}
\underbrace{\Phi_{\partial V}}_{\text{네 경계의 순유출}}
&=(\Phi_L+\Phi_R)+(\Phi_B+\Phi_T)\\[3pt]
&=\left(0+\frac{15}{4}\right)
+\left(0+\frac{15}{8}\right)=\frac{45}{8}
\end{aligned}`}
        meaning="각 face에서는 field의 outward-normal component를 face 길이에 걸쳐 더한다. 왼쪽과 아래쪽에서는 해당 component가 0이고, 오른쪽 flux 15/4와 위쪽 flux 15/8만 남아 전체 경계 flux가 45/8이 된다."
        symbols={[
          [raw`\Phi_L,\Phi_R`, '왼쪽·오른쪽 vertical face의 signed outward flux'],
          [raw`\Phi_B,\Phi_T`, '아래·위 horizontal face의 signed outward flux'],
          [raw`15/4`, '오른쪽 face에서 F_x=5/2에 높이 3/2를 곱한 flux'],
          [raw`15/8`, '위쪽 face에서 F_y=3/4에 폭 5/2를 곱한 flux'],
        ]}
      />

      <FormulaBlock
        tone="border-emerald-500/30 bg-emerald-500/[0.035]"
        latex={raw`\underbrace{\int_V\nabla\cdot\mathbf F\,dV}_{\text{내부 순유출의 합}}
=\underbrace{\frac32}_{\text{divergence}}
\times\underbrace{\frac{15}{4}}_{\text{rectangle 넓이}}
=\underbrace{\frac{45}{8}}_{\text{경계 flux와 일치}}`}
        meaning="Constant divergence 3/2를 rectangle area 15/4에 걸쳐 적분하면 45/8이다. 내부 cell face들이 서로 상쇄되므로 이 volume 합이 바로 앞에서 계산한 external boundary flux와 같아진다."
        symbols={[
          [raw`3/2`, '단위 면적마다 생성되는 local net outflow'],
          [raw`15/4`, '5/2×3/2로 계산한 rectangle area'],
          [raw`45/8`, 'local divergence integral과 boundary flux가 공유하는 결과'],
        ]}
      />

      <DivergenceFieldLab />

      <FormulaBlock
        tone="border-emerald-500/30 bg-emerald-500/[0.035]"
        latex={raw`\underbrace{\int_V\nabla\cdot\mathbf F\,dV}_{\text{모든 작은 칸의 순유출}}=\underbrace{\oint_{\partial V}\mathbf F\cdot\mathbf n_{\mathrm{out}}\,dA}_{\text{바깥 경계에 남은 통과량}}`}
        meaning="Volume을 작은 cell로 나누고 cell별 net outflow를 더하면 shared internal face가 두 번 나타난다. 이웃 cell의 outward normal은 반대이므로 같은 physical flux가 +와 -로 상쇄된다. 따라서 전체 합에는 외부 boundary contribution만 남는다."
        symbols={[
          [raw`V`, '관심 있는 closed volume'],
          [raw`\partial V`, 'V를 둘러싼 external boundary'],
          [raw`\oint`, '닫힌 surface 전체에서의 integral'],
          ['내부 face 상쇄', '같은 flux 값과 반대 outward normal이 만드는 +/− pair'],
        ]}
      />

      <InternalFaceCancellationLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 equality는 내부에 무언가를 새로 만든다는 뜻이 아니다. 같은 transport
          ledger를 local volume 관점과 outer boundary 관점으로 읽은 것이다. 실제
          생성과 소멸은 다음 절의 source term으로 따로 기록한다.
        </p>
        <p>
          Cell마다 폭이 다르면 <strong>divergence average 자체를 더하면 안 된다.</strong>
          각 cell에서 <code>net outflow ÷ cell width</code>로 average를 만든 뒤,
          global check에서는 다시 <code>divergence average × cell width</code>를
          더해야 volume-integrated divergence가 된다. 위 Viz의 cell 폭을 함께
          표시한 이유가 이 가중을 눈으로 검산하기 위해서다.
        </p>
      </div>

      <Misconception>
        Divergence가 양수라고 field의 모든 component가 양수인 것은 아니다.
        어떤 방향으로 들어와도 다른 방향으로 더 많이 나가면 net divergence는
        양수가 될 수 있다.
      </Misconception>
    </NlpSection>
  );
}

function ControlVolumeLedger() {
  return (
    <NlpSection
      id="control-volume-ledger"
      marker="07"
      tone="teal"
      question="유입과 유출이 다르면 conservation이 깨진 것일까?"
      title="Storage, boundary flux와 source를 한 식에 둔다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Control volume은 실제 벽일 수도 있고 분석자가 그은 가상의 닫힌
          boundary일 수도 있다. 이 글에서는 움직이지 않는 fixed control volume을
          사용한다. 그 안의 quantity density를 <code>q</code>, outward transport
          flux를 <code>F</code>, volume 내부의 생성률 density를 <code>s</code>라고
          하자.
        </p>
      </div>

      <FormulaBlock
        tone="border-teal-500/30 bg-teal-500/[0.035]"
        latex={raw`\begin{aligned}\underbrace{\frac{d}{dt}\int_V q\,dV}_{\text{검사 부피 안 저장 변화}}+\underbrace{\oint_{\partial V}\mathbf F\cdot\mathbf n_{\mathrm{out}}\,dA}_{\text{경계의 순유출}}=\underbrace{\int_V s\,dV}_{\text{내부 생성·소멸}}\end{aligned}`}
        meaning="왼쪽 첫 항은 volume 안에 저장된 total이 시간에 따라 변하는 속도다. 둘째 항은 outward normal convention으로 센 net outflow다. Boundary를 통하지 않고 내부에서 생기거나 사라지는 양은 오른쪽 source에 둔다. 세 항의 단위는 모두 quantity/time으로 같아야 한다."
        symbols={[
          [raw`q(\mathbf x,t)`, 'control volume 안의 quantity per volume'],
          [raw`\mathbf F`, 'boundary를 통과하는 quantity flux vector'],
          [raw`s`, 'volume 내부의 source density; 음수면 sink'],
          [raw`d/dt`, 'fixed spatial volume 안 total의 time rate'],
        ]}
      />

      <FormulaBlock
        latex={raw`\underbrace{\dot Q_{\mathrm{stored}}}_{\text{저장량 변화율}}=\underbrace{\dot Q_{\mathrm{in}}}_{\text{들어옴}}-\underbrace{\dot Q_{\mathrm{out}}}_{\text{나감}}+\underbrace{\dot Q_{\mathrm{source}}}_{\text{내부 생성·소멸}}`}
        meaning="초심자용 inflow/outflow 언어로 같은 식을 재배열했다. Outward-normal flux에서는 inflow가 음수 contribution이므로 오른쪽으로 옮기면 plus inflow가 된다. Source가 음수면 reaction이나 loss에 의한 내부 소모를 뜻한다."
        symbols={[
          [raw`\dot Q_{\mathrm{stored}}`, 'control volume total의 시간 변화율'],
          [raw`\dot Q_{\mathrm{in}}`, '모든 inlet contribution의 양의 크기 합'],
          [raw`\dot Q_{\mathrm{out}}`, '모든 outlet contribution의 양의 크기 합'],
          [raw`\dot Q_{\mathrm{source}}`, 'volume 안에서 생기는 signed rate'],
        ]}
      />

      <FormulaBlock
        latex={raw`\begin{aligned}\underbrace{\Delta Q}_{\text{누적 변화량}}&=\underbrace{\dot Q_{\mathrm{stored}}}_{\text{일정한 변화율}}\underbrace{\Delta t}_{\text{경과 시간}}\\[4pt]\underbrace{Q(t_0+\Delta t)}_{\text{나중 저장량}}&=\underbrace{Q(t_0)}_{\text{현재 저장량}}+\Delta Q\end{aligned}`}
        meaning="변화율의 단위는 quantity/time이므로 경과 시간 Δt를 곱해야 실제 누적 변화량이 된다. 이 곱셈은 density × measure가 total을 만든 앞 절과 같은 구조다. 변화율이 구간 안에서 일정할 때만 단순 곱을 쓰며, 시간에 따라 달라지면 변화율을 시간에 대해 적분해야 한다."
        symbols={[
          [raw`\Delta Q`, '선택한 시간 구간 동안 늘거나 줄어든 quantity'],
          [raw`\dot Q_{\mathrm{stored}}`, '유입−유출+source로 얻은 signed storage rate'],
          [raw`\Delta t`, 'rate가 일정하다고 가정한 경과 시간'],
          [raw`Q(t_0+\Delta t)`, '현재 저장량에 누적 변화량을 더한 예측 저장량'],
        ]}
      />

      <ControlVolumeLedgerLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Steady state는 storage rate가 0이라는 추가 조건이다. System을 오래
          기다렸다는 이유만으로 자동으로 steady가 되지 않는다. Boundary condition,
          source와 material state가 시간에 따라 바뀌지 않고 실제 total이 더 이상
          변하지 않는다는 evidence가 필요하다.
        </p>
      </div>

      <Misconception>
        Inflow와 outflow를 먼저 같게 놓고 계산을 시작하면 startup, charging,
        heating과 reaction transient를 지운다. Storage term은 “작아서 버릴 항”이
        아니라 정상상태를 검증한 뒤 0으로 둘 수 있는 상태 변수다.
      </Misconception>
    </NlpSection>
  );
}

function DiscreteConservation() {
  return (
    <NlpSection
      id="discrete-conservation"
      marker="08"
      tone="violet"
      question="컴퓨터 grid에서도 local balance를 더하면 global balance가 남을까?"
      title="Cell measure와 shared numerical flux로 보존을 유지한다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Finite-volume method는 differential equation의 각 점 값을 바로
          근사하기 전에 cell 하나의 integral balance를 쓴다. Cell 안 평균 density는
          cell volume과 곱해야 stored total이 된다. Source density도 cell volume과
          곱해야 actual source rate가 된다. Nonuniform grid에서 이 measure를 빼면
          큰 cell과 작은 cell을 같은 양으로 센다.
        </p>
      </div>

      <FormulaBlock
        tone="border-violet-500/30 bg-violet-500/[0.035]"
        latex={raw`\begin{aligned}\underbrace{\Delta V_i\frac{dq_i}{dt}}_{\text{i번 칸의 저장 변화율}}+\underbrace{\sum_{f\in\partial V_i}\widehat F_f A_f}_{\text{칸 경계의 순유출 합}}=\underbrace{s_i\Delta V_i}_{\text{칸 내부 생성률}}\end{aligned}`}
        meaning="Cell-average density q_i에 cell volume ΔV_i를 곱하면 그 cell에 저장된 total quantity가 된다. Fixed cell에서는 이 total을 시간 미분한 값이 ΔV_i dq_i/dt이며, 이것이 storage rate다. Face에서는 하나의 numerical flux F-hat을 근사하고 같은 shared face에는 이웃 두 cell이 같은 값을 써야 한다. Source density도 cell volume과 곱해 quantity/time 단위의 source rate로 맞춘다."
        symbols={[
          [raw`\Delta V_i`, 'i번째 cell의 길이·면적·부피 measure'],
          [raw`q_i`, 'i번째 cell의 average quantity density'],
          [raw`\widehat F_f`, 'face f에서 한 번 계산해 공유할 numerical flux'],
          [raw`A_f`, 'face measure; 1D unit-area 예에서는 1'],
        ]}
      />

      <FormulaBlock
        latex={raw`\underbrace{(+\widehat F_f A_f)}_{\text{왼쪽 칸에서 나감}}+\underbrace{(-\widehat F_f A_f)}_{\text{오른쪽 칸에서 들어옴}}=\underbrace{0}_{\text{내부 경계 상쇄}}`}
        meaning="한 physical face flux 값을 두 cell이 공유하고 각 cell의 outward normal만 반대로 적용한다. 그래서 local cell equation을 더할 때 internal transport는 사라진다. 양쪽이 서로 다른 flux를 쓰면 차이가 남아 외부 boundary나 physical source로 설명할 수 없는 ghost source가 된다."
        symbols={[
          [raw`\widehat F_f`, 'left-to-right처럼 하나의 orientation으로 저장한 shared face flux'],
          ['+ / −', '두 cell의 outward normal이 반대여서 생기는 contribution sign'],
          ['ghost source', '서로 다른 face 값을 사용해 global sum에 남은 인공 residual'],
        ]}
      />

      <ConservativeGridLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          보존적이라고 해서 해가 자동으로 정확하거나 stable한 것은 아니다.
          Reconstruction, time integrator, limiter와 boundary model이 별도로
          필요하다. 여기서 확보한 것은 더 기본적인 조건이다. Cell 식을 모두 더했을
          때 discretization이 스스로 mass나 energy를 만들거나 지우지 않는다는
          algebraic invariant다.
        </p>
      </div>

      <StopRule>
        이 글은 1D scalar ledger와 shared-face cancellation에서 멈춘다. PDE별
        advective·diffusive flux, high-order reconstruction, limiter, Riemann
        solver와 Navier–Stokes discretization은 이후 conservative simulation 글의
        책임이다.
      </StopRule>
    </NlpSection>
  );
}

function ReturnUp() {
  return (
    <NlpSection
      id="return-up"
      marker="09"
      tone="amber"
      question="이제 상위 공학식에서 무엇부터 읽어야 할까?"
      title="분포량의 domain, direction과 balance를 고정하고 위로 돌아간다"
    >
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          상위 글의 긴 수식을 만나면 적분 기호부터 계산하지 않는다. 먼저 integrand가
          어떤 density인지, 어디에 분포했는지, measure를 곱한 결과 단위가 무엇인지
          확인한다. Vector field라면 tangent 또는 normal 중 어느 projection을 쓰는지,
          closed boundary라면 outward convention인지 확인한다. 마지막으로 local
          contribution을 더한 값이 force·moment나 storage·flux global ledger를
          만족하는지 검산한다.
        </p>
      </div>

      <HandoffGrid
        items={[
          {
            title: 'Robot structural mechanics',
            body: <>Distributed load를 equivalent force와 moment로 바꾸고, stress distribution을 section resultant와 geometry integral로 연결하는 다음 단계는 <InternalLink slug="robot-structural-mechanics-materials-fatigue-thermal">Robot Structural Mechanics</InternalLink>에서 이어 간다.</>,
          },
          {
            title: 'Fracture and damage tolerance',
            body: <>Potential energy가 crack area에 따라 변하는 energy ledger와 growth rate를 crack path에서 누적하는 문제는 <InternalLink slug="robot-fracture-mechanics-damage-tolerance">Fracture Mechanics</InternalLink>에서 읽는다.</>,
          },
          {
            title: 'Contact, lubrication and heat',
            body: <>Pressure distribution을 normal load로 합치고 heat storage·loss와 lubricant transport를 구분하는 문제는 <InternalLink slug="robot-contact-tribology-lubrication-wear">Tribology and Lubrication</InternalLink>에서 확장한다.</>,
          },
          {
            title: 'Time evolution',
            body: <>이 글이 계산한 storage rate를 시간에 따라 실제 state trajectory로 적분하는 solver와 step error는 <InternalLink slug="differential-equations-phase-plane-numerical-integration">미분방정식과 수치 적분</InternalLink>에서 다룬다.</>,
          },
        ]}
      />

      <CapabilityCheck
        title="이 글만으로 확인할 수 있어야 한다"
        items={[
          'Density의 단위와 domain measure를 곱해 total quantity의 단위를 복원한다.',
          'Riemann sum의 각 contribution과 partition refinement가 줄이는 오차를 설명한다.',
          'ds, dA, dV와 scalar/vector field의 결과 shape를 구분한다.',
          'Distributed load의 합력과 같은 기준점 모멘트로 line of action을 계산한다.',
          'Surface normal을 먼저 정하고 F·n의 signed flux를 계산한다.',
          'Cell별 divergence를 volume-weighted total로 합해 outer boundary flux와 맞춘다.',
          'Storage, inflow, outflow와 signed source가 있는 unsteady ledger를 닫는다.',
          'Nonuniform cell measure와 shared face flux로 ghost source를 검출한다.',
        ]}
      />

      <StopRule title="역사 하향의 최소선.">
        Newton·Leibniz의 역사, measure theory, differential forms와 tensor
        calculus 전체로 내려가지 않는다. 분포량을 total로 바꾸고 orientation과
        local/global conservation을 검산할 수 있는 이 지점이 구조역학·열·유체
        문헌으로 다시 올라가기 위한 첫 충분 조건이다.
      </StopRule>

      <SourceNotes
        sources={[
          {
            label: 'MIT 18.01 · Riemann Integral notes',
            href: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/',
            note: 'rectangle contribution의 합과 partition refinement에서 definite integral로 가는 출발 자료',
          },
          {
            label: 'MIT 18.02 · Multivariable Calculus supplementary notes',
            href: 'https://ocw.mit.edu/courses/18-02-multivariable-calculus-spring-2006/pages/readings/supp_notes/',
            note: 'line·surface integral, oriented flux와 divergence theorem을 연결한 공식 강의 자료',
          },
          {
            label: 'David Roylance · Statics of Bending',
            href: 'https://ocw.mit.edu/courses/3-91-mechanical-behavior-of-plastics-spring-2007/2644ca19e120e81589473d2d2d36a772_12_statics.pdf',
            note: 'MIT OCW에 호스팅된 distributed beam load의 resultant, first moment와 centroid line-of-action notes',
          },
          {
            label: 'MIT 1.050 · Solid Mechanics',
            href: 'https://ocw.mit.edu/courses/1-050-solid-mechanics-fall-2004/',
            note: '정역학 resultant·moment와 분포 pressure contribution을 force로 합하는 보조 사례',
          },
          {
            label: 'MIT 2.25 · Advanced Fluid Mechanics',
            href: 'https://ocw.mit.edu/courses/2-25-advanced-fluid-mechanics-fall-2013/',
            note: 'outward normal을 사용한 control-volume laws와 storage·transport balance의 공식 자료',
          },
          {
            label: 'MIT 2.29 · Numerical Fluid Mechanics',
            href: 'https://ocw.mit.edu/courses/2-29-numerical-fluid-mechanics-spring-2015/',
            note: 'contiguous control volume, surface flux approximation과 local/global discrete conservation 자료',
          },
        ]}
      />
    </NlpSection>
  );
}

export default function IntegralsFieldsConservationArticle() {
  return (
    <>
      <WhyAccumulation />
      <SumToIntegral />
      <DomainAndFields />
      <ResultantMoment />
      <OrientedFlux />
      <DivergenceLocalGlobal />
      <ControlVolumeLedger />
      <DiscreteConservation />
      <ReturnUp />
    </>
  );
}
