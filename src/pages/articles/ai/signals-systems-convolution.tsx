import type { ReactNode } from 'react';
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
import {
  ConvolutionWorkbench,
  RecurrenceKernelLab,
  SamplingExplorer,
  SystemPropertyLab,
} from './signals-systems-convolution/viz/SignalSystemLabs';

function SectionTitle({
  number,
  kicker,
  children,
  promise,
}: {
  number: string;
  kicker: string;
  children: ReactNode;
  promise: string;
}) {
  return (
    <header className="not-prose mb-7 border-t border-border pt-5">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-mono text-2xl font-bold text-muted-foreground/60">{number}</span>
        <span className="text-xs font-semibold uppercase text-violet-700 dark:text-violet-300">{kicker}</span>
      </div>
      <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{children}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{promise}</p>
    </header>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="prose prose-neutral max-w-none dark:prose-invert">{children}</div>;
}

function FormulaFrame({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'focus' | 'warning' }) {
  const style = tone === 'focus'
    ? 'border-violet-500/35 bg-violet-500/[0.045]'
    : tone === 'warning'
      ? 'border-amber-600/35 bg-amber-500/[0.045]'
      : 'border-border bg-background';
  return <div className={`not-prose my-5 min-w-0 rounded-md border px-2 py-3 sm:px-4 ${style}`}>{children}</div>;
}

function SignalContract() {
  return (
    <section id="signal-contract" className="mb-20 scroll-mt-20">
      <SectionTitle
        number="01"
        kicker="시간축 계약"
        promise="숫자를 처리하기 전에 index, 단위, 현재 시각과 사용할 수 있는 정보의 범위를 먼저 고정합니다."
      >
        배열을 보기 전에 “언제 측정한 값인가”부터 묻는다
      </SectionTitle>

      <BeginnerOpening
        title="신호는 시간에 따라 달라지는 값을 순서와 함께 적은 기록입니다."
        description={<>방 온도, microphone의 공기 떨림, robot 관절 각도처럼 현실의 값은 계속 달라진다. Computer는 이 변화를 매 순간 모두 저장하지 않고, 정한 시각마다 값을 하나씩 적는다. 이렇게 얻은 각 측정값을 <strong className="text-foreground">sample</strong>, 시간 순서로 모은 기록을 <strong className="text-foreground">signal</strong>이라고 부른다.</>}
        familiarScene={<>온도계를 1초마다 읽어 <strong>20, 21, 21</strong>이라고 적었다고 해 보자. 숫자만 보면 세 번 측정했는지, 세 방의 온도인지 알 수 없다. “1초마다 같은 방을 측정했다”는 시간축을 함께 알아야 온도가 언제 변했고 얼마나 빨리 변했는지 말할 수 있다.</>}
        steps={[
          { label: '무엇을 관측할지 정한다', detail: '온도, 소리의 압력, 관절 각도처럼 시간에 따라 달라지는 값을 하나 고른다.' },
          { label: '측정한 시각을 붙인다', detail: '1초마다 또는 1밀리초마다처럼 측정 간격과 실제 측정 시각을 기록한다.' },
          { label: '기록을 바꾸는 규칙을 적용한다', detail: '최근 값을 평균내거나 과거를 기억해 다음 출력으로 만드는 규칙을 system이라고 부른다.' },
        ]}
      />

      <Prose>
        <p>
          예를 들어 최근 세 온도의 평균을 내면 순간적인 흔들림은 줄어든다. 대신 새 온도가 들어와도 이전 두 값이 함께 섞이므로
          변화가 조금 늦게 보인다. 이처럼 어떤 값을 골라 섞고 얼마나 오래 기억하는지가 filter와 system의 성질을 만든다.
          이제 이 일상적인 기록에 정확한 이름을 붙여 보자.
        </p>
      </Prose>

      <QuestionLead
        label="이제 확인할 질문"
        question="똑같은 [1, 2, 1]이라는 세 숫자가 어떤 곳에서는 측정 기록이고, 다른 곳에서는 이웃 값을 섞는 규칙이 되는 이유는 무엇일까?"
        answer="숫자만으로는 각 위치가 무엇을 뜻하는지 알 수 없기 때문이다. 먼저 값이 시간·공간·문장 순서 중 어느 축에 놓였는지, 위치 사이 간격이 얼마인지, 세 숫자가 관측값인지 섞는 가중치인지 정해야 한다. 그 계약을 붙인 뒤에야 같은 배열을 올바르게 계산할 수 있다."
      />

      <ConceptPrimer
        items={[
          { term: 'Signal', meaning: '독립 변수 t 또는 n에 따라 관측한 값 x다.', why: '값의 순서를 시간·공간·token 위치 중 어느 축으로 해석할지 고정한다.' },
          { term: 'System', meaning: '입력 신호 전체를 출력 신호로 바꾸는 규칙 T다.', why: 'filter, sensor pipeline, convolution layer와 recurrent state를 같은 입력-출력 언어로 비교한다.' },
          { term: 'Sample interval', meaning: '연속 측정 사이의 시간 Tₛ이며 sampling rate는 1/Tₛ다.', why: '같은 10개 sample이라도 10 ms와 10 s는 전혀 다른 주파수와 지연을 뜻한다.' },
          { term: 'Acquisition time', meaning: '값이 실제 세계에서 측정된 시각이다.', why: '처리 완료 시각과 혼동하면 늦게 도착한 sensor 값을 현재 상태처럼 사용하게 된다.' },
          { term: 'Memory', meaning: '현재 출력이 현재 입력 외의 sample 또는 state에도 의존하는 성질이다.', why: '필요한 buffer 길이와 state cache를 결정한다.' },
          { term: 'Causality', meaning: '현재 출력이 미래 입력을 요구하지 않는 성질이다.', why: 'offline smoothing과 실시간 inference를 가르는 실행 가능성 조건이다.' },
        ]}
      />

      <Prose>
        <p>
          연속 신호 <MathFormula>{String.raw`x(t)`}</MathFormula>는 모든 실수 시각에 값을 갖는 이상화다.
          컴퓨터가 받는 <MathFormula>{String.raw`x[n]`}</MathFormula>은 보통
          <MathFormula>{String.raw`t_n=nT_s`}</MathFormula>에서 측정한 이산 sample이다. 이때
          <MathFormula>{String.raw`n`}</MathFormula>은 단순한 배열 offset이 아니다. 센서가 실제로 값을
          잡은 시각, 전송 중 생긴 지연, 누락된 sample을 함께 관리해야 하는 시간 좌표다.
        </p>
        <p>
          시스템의 성질은 이름으로 판정하지 않는다. 입력을 scale하고 더해 보는 <strong>선형성 test</strong>,
          입력을 미뤄 보는 <strong>시불변 test</strong>, 미래 sample을 지워 보는 <strong>인과성 test</strong>,
          bounded input을 오래 넣어 보는 <strong>안정성 test</strong>처럼 깨지는 witness를 찾는다.
        </p>
      </Prose>

      <SystemPropertyLab />

      <FormulaFrame>
        <MathFormula display>{String.raw`
          \underbrace{T\{a x_1+b x_2\}}_{\text{섞은 뒤 처리}}
          =
          \underbrace{aT\{x_1\}+bT\{x_2\}}_{\text{따로 처리해 합침}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="선형성은 입력 조각을 따로 계산한 뒤 같은 계수로 합쳐도 결과가 같다는 계약이다. 한 입력을 두 배로 했을 때 출력도 정확히 두 배인지, 두 입력을 더한 출력이 개별 출력의 합인지 모두 확인해야 한다."
        symbols={[
          [String.raw`T`, '신호 전체를 출력 신호로 바꾸는 system'],
          [String.raw`a,b`, '입력 조각의 크기를 정하는 scalar'],
          [String.raw`x_1,x_2`, '서로 다른 두 입력 신호'],
          ['선형성', 'scale 보존과 덧셈 보존을 함께 요구하는 성질'],
        ]}
      />

      <FormulaFrame tone="focus">
        <MathFormula display>{String.raw`
          \underbrace{T\{x[n]\}=y[n]}_{\text{원래 입력과 출력}}
        `}</MathFormula>
        <MathFormula display>{String.raw`
          T\{x[n-k]\}
          =
          \underbrace{y[n-k]}_{\text{모양은 그대로, 위치만 이동}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="시불변성은 같은 입력 모양을 다른 시각에 넣어도 같은 출력 모양이 같은 만큼 이동한다는 계약이다. 가중치가 절대 시각 n에 따라 달라지면 선형일 수는 있어도 시불변은 아니다."
        symbols={[
          [String.raw`k`, '입력과 출력을 함께 옮기는 index 수'],
          [String.raw`x[n-k]`, '원래 입력을 k만큼 지연한 신호'],
          [String.raw`y[n-k]`, '원래 출력도 같은 k만큼 지연한 신호'],
          ['LTI', 'linear와 time-invariant를 동시에 만족하는 system'],
        ]}
      />

      <Misconception>
        인과적이면 안정적이라는 뜻이 아니다. 누적합은 미래를 보지 않으므로 인과적이지만, 항상 1인 bounded input을
        계속 더하면 출력이 끝없이 커져 BIBO 안정성은 실패한다. 성질마다 별도의 witness가 필요하다.
      </Misconception>
    </section>
  );
}

function ImpulseConvolution() {
  return (
    <section id="impulse-convolution" className="mb-20 scroll-mt-20">
      <SectionTitle
        number="02"
        kicker="분해와 재사용"
        promise="입력을 한 점짜리 조각으로 분해하고, LTI가 같은 응답을 모든 위치에서 재사용하게 만드는 과정을 직접 계산합니다."
      >
        Impulse 하나의 응답이 전체 convolution이 된다
      </SectionTitle>

      <QuestionLead
        question="새로운 길이의 입력이 올 때마다 시스템 전체를 다시 분석하지 않고 출력을 만들 수 있을까?"
        answer="가능하다. 모든 sample을 위치별 impulse의 가중합으로 쪼갠 뒤, impulse 하나에 대한 응답 h를 이동해 재사용한다. 선형성이 응답을 합치고 시불변성이 같은 h를 모든 위치에 쓸 수 있게 한다."
      />

      <Prose>
        <p>
          이산 impulse <MathFormula>{String.raw`\delta[n]`}</MathFormula>는
          <MathFormula>{String.raw`n=0`}</MathFormula>에서만 1이고 나머지는 0이다.
          <MathFormula>{String.raw`\delta[n-k]`}</MathFormula>는 그 한 점을 k 위치로 옮긴다. 각 위치의
          impulse에 실제 sample 값 <MathFormula>{String.raw`x[k]`}</MathFormula>를 곱해 모두 더하면 원래
          입력을 정확히 복원한다. 이것은 근사가 아니라 이산 sequence의 항등식이다.
        </p>
      </Prose>

      <FormulaFrame>
        <MathFormula display>{String.raw`
          x[n]
          =
          \sum_k
          \underbrace{x[k]}_{\text{k 위치의 크기}}
          \underbrace{\delta[n-k]}_{\text{k 위치만 남김}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="입력은 위치마다 하나씩 놓인 impulse 조각의 합이다. 이 분해 덕분에 복잡한 입력 대신 impulse 하나에 system이 어떻게 반응하는지만 먼저 알면 된다."
        symbols={[
          [String.raw`\delta[n-k]`, 'k 위치에서만 1인 shifted impulse'],
          [String.raw`x[k]`, 'k 위치 impulse의 높이'],
          [String.raw`\sum_k`, '모든 위치의 impulse 조각을 다시 합치는 연산'],
          ['분해', '전체 입력을 system이 재사용하기 쉬운 기본 조각으로 바꾸는 단계'],
        ]}
      />

      <Prose>
        <p>
          impulse를 넣었을 때의 출력을 <MathFormula>{String.raw`h[n]=T\{\delta[n]\}`}</MathFormula>이라고
          부른다. 시불변성이 있으면 k 위치 impulse의 응답은 새 함수를 만들 필요 없이
          <MathFormula>{String.raw`h[n-k]`}</MathFormula>다. 선형성은 여기에
          <MathFormula>{String.raw`x[k]`}</MathFormula>를 곱하고 모든 k의 응답을 합칠 수 있게 한다.
          여기서 flip, shift, multiply, sum이라는 계산 절차가 나온다.
        </p>
      </Prose>

      <ConvolutionWorkbench />

      <FormulaFrame tone="focus">
        <MathFormula display>{String.raw`
          y[n]
          =
          \underbrace{(x*h)[n]}_{\text{LTI 출력}}
          =
          \sum_k
          \underbrace{x[k]}_{\text{입력 조각}}
          \underbrace{h[n-k]}_{\text{뒤집어 n에 맞춘 응답}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="출력 n을 고정하면 h[n-k]는 k에 대해 뒤집힌 뒤 n 위치로 이동한 모양이 된다. 입력 x[k]와 겹친 항을 곱해 모두 더한 값이 y[n] 한 점이다. n을 이동하며 반복하면 출력 전체가 된다."
        symbols={[
          [String.raw`h[n]`, 'impulse 하나를 넣었을 때의 system 응답'],
          [String.raw`h[n-k]`, '출력 위치 n에서 입력 위치 k가 받는 shifted response'],
          [String.raw`x*h`, 'x와 h의 linear convolution'],
          [String.raw`y[n]`, 'n 위치에서 겹친 모든 원인의 합'],
        ]}
      />

      <FormulaFrame>
        <MathFormula display>{String.raw`
          \underbrace{L_{\mathrm{full}}}_{\text{겹침이 한 항이라도 있는 구간}}
          =
          \underbrace{N}_{\text{입력 길이}}
          +
          \underbrace{M}_{\text{kernel 길이}}
          -1
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="길이 N 입력과 길이 M kernel의 full linear convolution은 첫 점이 닿기 시작한 때부터 마지막 점이 떨어질 때까지 N+M-1개다. same과 valid는 이 full 결과에서 어느 경계 구간을 남기는지에 대한 별도 계약이다."
        symbols={[
          [String.raw`N`, '입력 sequence의 sample 수'],
          [String.raw`M`, 'impulse response 또는 kernel의 sample 수'],
          [String.raw`L_{\mathrm{full}}`, 'zero가 아닌 overlap 가능성을 모두 보존한 출력 길이'],
          ['경계 조건', '배열 밖 값을 zero, reflect, circular 중 무엇으로 읽을지 정하는 규칙'],
        ]}
      />
    </section>
  );
}

function CausalityStability() {
  return (
    <section id="causality-stability" className="mb-20 scroll-mt-20">
      <SectionTitle
        number="03"
        kicker="실행 가능성"
        promise="Impulse response의 위치와 절대합만으로 실시간 실행 가능성과 bounded-input 안정성을 판정합니다."
      >
        좋은 filter인지 묻기 전에 causal하고 stable한지 검사한다
      </SectionTitle>

      <Prose>
        <p>
          LTI에서는 과거 입력 <MathFormula>{String.raw`x[k]`}</MathFormula>이 현재 출력
          <MathFormula>{String.raw`y[n]`}</MathFormula>에 기여하는 정도가
          <MathFormula>{String.raw`h[n-k]`}</MathFormula> 하나에 모인다. 그래서 system 전체를 모든 입력으로
          시험하지 않아도 impulse response의 support를 보면 인과성과 memory를 읽을 수 있다.
        </p>
        <p>
          <MathFormula>{String.raw`h[r]`}</MathFormula>가 음수 시간 r에서 0이 아니면 현재 출력이 미래 입력을
          요구한다. 중앙 정렬 3점 평균은 offline denoising에는 자연스럽지만, 현재 sample을 받는 즉시 출력해야
          하는 streaming system에서는 한 sample을 더 기다리거나 causal filter로 바꿔야 한다. “같은 smoothing”
          이라는 이름보다 <strong>언제 출력이 확정되는가</strong>가 더 중요한 계약이다.
        </p>
      </Prose>

      <FormulaFrame tone="focus">
        <MathFormula display>{String.raw`
          \underbrace{h[r]=0\quad(r<0)}_{\text{미래 입력의 영향이 없음}}
          \quad\Longleftrightarrow\quad
          \underbrace{\text{causal LTI}}_{\text{현재 시각에 실행 가능}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="현재 출력 y[n]에서 r=n-k가 음수라는 것은 k가 n보다 커 미래 입력을 참조한다는 뜻이다. 이산 LTI system은 음수 index의 impulse response가 모두 0일 때 그리고 그때에만 causal하다."
        symbols={[
          [String.raw`r=n-k`, '현재 출력과 입력 sample 사이의 상대 시간'],
          [String.raw`r<0`, '아직 도착하지 않은 미래 입력 위치'],
          [String.raw`h[r]=0`, '그 미래 입력이 현재 출력에 영향을 주지 않음'],
          ['causal', '출력 시각까지 도착한 정보만 사용하는 실행 계약'],
        ]}
      />

      <Prose>
        <p>
          안정성은 출력이 작다는 인상으로 판정하지 않는다. BIBO는 모든 bounded input에 대해 output도 bounded여야
          한다는 worst-case 계약이다. 입력의 크기가 B 이하라면 convolution의 절댓값에 triangle inequality를
          적용해 <MathFormula>{String.raw`|y[n]|\le B\sum_k|h[k]|`}</MathFormula>을 얻는다. 따라서
          impulse response의 절대합이 유한하면 어떤 부호 조합의 bounded input도 출력을 무한히 키울 수 없다.
        </p>
      </Prose>

      <FormulaFrame>
        <MathFormula display>{String.raw`
          \underbrace{\sum_{k=-\infty}^{\infty}|h[k]|<\infty}_{\text{모든 영향의 절대 크기가 유한}}
          \quad\Longleftrightarrow\quad
          \underbrace{\text{BIBO stable LTI}}_{\text{bounded 입력은 bounded 출력}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="이 식은 이산 LTI 범위에서 단순한 충분조건이 아니라 필요충분 조건이다. 부호가 서로 지워질 것이라고 기대하지 않고 절대 크기를 합해야 worst-case input까지 막을 수 있다."
        symbols={[
          [String.raw`h[k]`, 'k만큼 떨어진 입력이 현재 출력에 남기는 영향'],
          [String.raw`|h[k]|`, '상쇄를 허용하지 않은 영향의 크기'],
          [String.raw`\sum_k|h[k]|`, '과거와 미래 모든 영향의 총 absolute gain'],
          ['BIBO', 'bounded input, bounded output의 약자'],
        ]}
      />

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        {[
          ['한 칸 지연', 'h[1]=1', 'causal · stable', '미래를 보지 않고 절대합은 1이다.'],
          ['3점 중앙 평균', 'h[-1]=h[0]=h[1]=1/3', 'non-causal · stable', '미래 한 점이 필요하지만 절대합은 1이다.'],
          ['누적합', 'h[k]=1, k≥0', 'causal · unstable', '과거 영향이 감쇠하지 않아 절대합이 발산한다.'],
        ].map(([name, kernel, verdict, reason]) => (
          <div key={name} className="min-w-0 bg-background p-4">
            <p className="text-sm font-bold">{name}</p>
            <p className="mt-2 break-words font-mono text-xs text-violet-700 dark:text-violet-300">{kernel}</p>
            <p className="mt-3 text-xs font-bold">{verdict}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{reason}</p>
          </div>
        ))}
      </div>

      <Misconception>
        finite-length FIR은 coefficient가 유한하면 절대합도 유한해 BIBO stable이다. 하지만 FIR이라는 사실만으로
        causal한 것은 아니다. negative index tap을 쓰는 centered FIR은 안정적이어도 실시간 현재 출력에는
        look-ahead 또는 명시적 delay가 필요하다.
      </Misconception>
    </section>
  );
}

function DifferenceEquationState() {
  return (
    <section id="difference-equation-state" className="mb-20 scroll-mt-20">
      <SectionTitle
        number="04"
        kicker="State와 kernel"
        promise="한 칸씩 갱신하는 recurrence를 과거 입력의 합으로 펼쳐, scan과 convolution이 같은 system의 두 실행 형태가 되는 조건을 확인합니다."
      >
        Difference equation을 펼치면 긴 impulse response가 보인다
      </SectionTitle>

      <QuestionLead
        question="매 시각 state 하나만 갱신하는 recurrence가 어떻게 긴 convolution kernel과 같은 출력을 낼까?"
        answer="이전 state를 식에 반복 대입하면 과거 입력마다 a의 거듭제곱이 붙는다. initial state를 0으로 두면 이 계수열이 바로 impulse response다."
      />

      <Prose>
        <p>
          difference equation은 현재 출력 또는 state를 이전 시각의 값과 현재 입력으로 정의한다. 계산은 짧지만
          state 안에는 과거가 압축돼 있다. 아래 scalar system은 매 step마다 이전 state의 a배와 현재 입력의
          b배를 더한 뒤 c배를 출력한다. 실제 구현에서는 initial state를 반드시 정해야 한다. 식만 있고 auxiliary
          condition이 없으면 같은 입력에도 여러 출력이 가능하다. Linear constant-coefficient difference equation은
          auxiliary condition이 0일 때 linear system이 되며, 입력이 시작되기 전 state와 output이 0인
          <strong>initial rest</strong>를 두면 causal LTI solution을 고정할 수 있다. 아래의
          <MathFormula>{String.raw`s[-1]=0`}</MathFormula>은 그 계약을 유한 index로 쓴 사례다.
        </p>
      </Prose>

      <FormulaFrame tone="focus">
        <MathFormula display>{String.raw`
          \underbrace{s[n]}_{\text{새 state}}
          =
          \underbrace{a\,s[n-1]}_{\text{남겨 둔 기억}}
          +
          \underbrace{b\,x[n]}_{\text{새 입력}}
          ,\qquad
          \underbrace{y[n]=c\,s[n]}_{\text{읽어 낸 출력}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="a는 이전 기억을 얼마나 남길지, b는 현재 입력을 state에 얼마나 쓸지, c는 state를 output으로 어떻게 읽을지 정한다. 같은 recurrence라도 initial state가 다르면 zero-input response가 달라진다."
        symbols={[
          [String.raw`s[n]`, 'n 시각까지의 과거를 압축한 state'],
          [String.raw`a`, '한 step 뒤에도 남는 state 비율'],
          [String.raw`b`, '현재 입력을 state에 쓰는 gain'],
          [String.raw`c`, 'state에서 output을 읽는 gain'],
        ]}
      />

      <Prose>
        <p>
          <MathFormula>{String.raw`s[-1]=0`}</MathFormula>으로 두고 반복 대입하면
          <MathFormula>{String.raw`s[n]=b x[n]+abx[n-1]+a^2b x[n-2]+\cdots`}</MathFormula>가 된다.
          즉 현재 입력에는 b, 한 칸 과거에는 ab, 두 칸 과거에는
          <MathFormula>{String.raw`a^2b`}</MathFormula>가 붙는다. output gain c까지 포함한 계수열이 impulse
          response다. 이 geometric coefficient는 판독이 어려운 강의 OCR 문장을 옮긴 것이 아니라 recurrence에
          이전 식을 직접 대입해 얻은 유도이며, 뒤의 S4 matrix recurrence-to-kernel 식과 다시 대조한다.
        </p>
      </Prose>

      <FormulaFrame>
        <MathFormula display>{String.raw`
          y[n]
          =
          \sum_{k=0}^{n}
          \underbrace{c\,a^k b}_{\text{k칸 과거의 영향 }h[k]}
          x[n-k]
          =
          \underbrace{(h*x)[n]}_{\text{펼친 convolution}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="고정된 a, b, c를 모든 시각에 재사용하고 initial state를 0으로 두면 recurrence를 하나의 LTI convolution kernel로 펼칠 수 있다. impulse를 넣었을 때 나오는 caᵏb가 h[k]다."
        symbols={[
          [String.raw`a^k`, 'k step 동안 남은 기억의 크기'],
          [String.raw`c\,a^k b`, 'k칸 과거 입력이 현재 output에 미치는 gain'],
          [String.raw`h[k]`, 'recurrence를 펼쳐 얻은 impulse response'],
          ['scan', 'state를 시간 순서대로 한 칸씩 갱신하는 실행 방식'],
        ]}
      />

      <RecurrenceKernelLab />

      <Prose>
        <p>
          scalar에서는 <MathFormula>{String.raw`|a|<1`}</MathFormula>이면
          <MathFormula>{String.raw`a^k`}</MathFormula>가 0으로 감쇠하고 impulse response의 절대합이 유한해진다.
          <MathFormula>{String.raw`|a|=1`}</MathFormula>이면 기억이 사라지지 않으며,
          <MathFormula>{String.raw`|a|>1`}</MathFormula>이면 작은 입력도 지수적으로 증폭될 수 있다. 다차원
          state에서는 a 하나 대신 행렬의 eigenvalue와 mode를 봐야 한다.
        </p>
        <p>
          연속 미분방정식에서 discrete recurrence로 넘어가는 discretization과 수치 적분은
          {' '}<InternalLink slug="differential-equations-phase-plane-numerical-integration">미분방정식과 Phase Plane</InternalLink>에서
          이어서 다룬다. 여기서는 고정된 discrete system을 펼치는 데 필요한 바닥까지만 사용한다.
        </p>
      </Prose>
    </section>
  );
}

function FrequencyExecution() {
  return (
    <section id="frequency-execution" className="mb-20 scroll-mt-20">
      <SectionTitle
        number="05"
        kicker="주파수 표현"
        promise="왜 complex exponential은 LTI를 통과해도 주파수 모양을 유지하는지 유도하고, convolution을 주파수별 곱으로 실행할 때 생기는 circular boundary를 구분합니다."
      >
        Convolution을 주파수별 독립 gain으로 바꿔 읽는다
      </SectionTitle>

      <Prose>
        <p>
          임의의 신호를 바로 넣으면 많은 shift가 섞여 보인다. 대신 complex exponential
          <MathFormula>{String.raw`e^{j\omega n}`}</MathFormula>을 convolution 식에 넣어 보자.
          <MathFormula>{String.raw`e^{j\omega(n-k)}=e^{j\omega n}e^{-j\omega k}`}</MathFormula>이므로
          출력 시각 n에 따른 파동은 합 밖으로 빠지고, system에 따른 합만 계수로 남는다.
          MIT 6.003 원 강의는 이 생각을 continuous-time <MathFormula>{String.raw`e^{st}`}</MathFormula>와
          Laplace 적분으로 전개한다. 아래 discrete-time 합은 원문을 그대로 옮긴 것이 아니라 같은 convolution
          구조에 이산 complex exponential을 직접 대입해 얻는다.
        </p>
      </Prose>

      <FormulaFrame tone="focus">
        <MathFormula display>{String.raw`
          T\{e^{j\omega n}\}
          =
          \underbrace{e^{j\omega n}}_{\text{입력과 같은 주파수}}
          \underbrace{\sum_k h[k]e^{-j\omega k}}_{H(e^{j\omega})\; \text{크기·위상만 변경}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="Complex exponential은 LTI를 통과해도 같은 주파수 모양을 유지하고 복소수 H만 곱해진다. 그래서 LTI의 eigenfunction이라고 부른다. |H|는 해당 주파수의 증폭·감쇠, arg H는 phase 이동을 나타낸다."
        symbols={[
          [String.raw`\omega`, '한 sample당 radian 단위의 angular frequency'],
          [String.raw`e^{j\omega n}`, '회전하는 complex exponential basis'],
          [String.raw`H(e^{j\omega})`, 'impulse response의 frequency response'],
          [String.raw`\arg H`, '해당 주파수 성분의 phase 변화'],
        ]}
      />

      <Prose>
        <p>
          일반 신호를 이런 주파수 basis의 합으로 표현하면 각 basis가 서로 섞이지 않고 자기 gain H만 받는다.
          시간 영역의 shift 합은 주파수 영역에서 elementwise multiplication으로 대각화된다. 의미가 바뀐 것이
          아니라 같은 LTI system을 계산하기 좋은 좌표계로 옮긴 것이다. impulse response가 real-valued이면
          <MathFormula>{String.raw`H(e^{-j\omega})=H(e^{j\omega})^*`}</MathFormula>인 conjugate symmetry가 성립해
          양·음 주파수 항이 하나의 실수 sinusoid로 결합된다. 이 전제 아래 magnitude와 phase를 실수 신호의
          증폭과 위상 이동으로 읽는다.
        </p>
      </Prose>

      <FormulaFrame>
        <MathFormula display>{String.raw`
          \begin{aligned}
          \underbrace{y}_{\text{시간축 출력}}&=x*h\\
          \underbrace{Y(e^{j\omega})}_{\text{출력 spectrum}}
          &=\underbrace{H(e^{j\omega})X(e^{j\omega})}_{\text{주파수마다 독립적으로 곱함}}
          \end{aligned}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="Fourier transform은 convolution을 주파수별 곱으로 바꾼다. 긴 kernel에서는 FFT로 transform과 inverse transform을 빠르게 실행할 수 있지만, 작은 배열에서는 transform overhead 때문에 direct convolution이 더 빠를 수 있다."
        symbols={[
          [String.raw`X`, '입력 x의 frequency representation'],
          [String.raw`H`, 'kernel h의 frequency response'],
          [String.raw`Y`, '출력 y의 frequency representation'],
          ['direct convolution', '시간축에서 겹치는 항을 직접 곱해 더하는 실행'],
        ]}
      />

      <Prose>
        <p>
          한 가지 함정이 있다. 길이 L의 DFT는 index를 L 뒤에서 다시 0으로 이어지는 원처럼 본다. zero-padding 없이
          FFT에서 곱하면 tail이 앞쪽으로 감기는 <strong>circular convolution</strong>이 된다. 우리가 앞서 계산한
          full linear convolution을 원한다면 두 sequence가 모두 들어갈 만큼 FFT 길이를 늘려야 한다.
        </p>
      </Prose>

      <FormulaFrame tone="warning">
        <MathFormula display>{String.raw`
          \underbrace{L_{\mathrm{FFT}}\ge N+M-1}_{\text{tail이 앞쪽으로 감기지 않는 최소 길이}}
        `}</MathFormula>
        <MathFormula display>{String.raw`
          \underbrace{\mathrm{IFFT}(\mathrm{FFT}(x)\odot\mathrm{FFT}(h))}_{\text{linear convolution 복원}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="FFT 길이가 N+M-1보다 짧으면 full output을 담을 자리가 없어 뒤쪽 값이 앞쪽에 더해진다. zero-padding은 새로운 정보를 만드는 일이 아니라 linear boundary를 circular 계산 안에서 보존할 빈 공간을 마련하는 일이다."
        symbols={[
          [String.raw`L_{\mathrm{FFT}}`, 'FFT가 한 주기로 취급하는 전체 길이'],
          [String.raw`N+M-1`, 'full linear convolution의 필요한 sample 수'],
          [String.raw`\odot`, '같은 frequency bin끼리의 elementwise product'],
          ['zero-padding', 'wrap-around를 막기 위해 뒤에 0을 채우는 경계 처리'],
        ]}
      />

      <Prose>
        <p>
          DFT의 주기성, butterfly와 계산량은 <InternalLink slug="fft">FFT: AI 관점</InternalLink>에서 더 깊게
          이어진다. 이 글에서는 “convolution theorem이 맞다”와 “유한 배열을 어떤 boundary로 실행했다”를
          분리할 수 있으면 충분하다.
        </p>
      </Prose>
    </section>
  );
}

function SamplingInformation() {
  return (
    <section id="sampling-information" className="mb-20 scroll-mt-20">
      <SectionTitle
        number="06"
        kicker="정보 보존"
        promise="Sampling theorem의 bandlimited 가정을 먼저 밝히고, 서로 다른 연속 신호가 같은 sample을 만드는 alias와 anti-alias filter의 위치를 확인합니다."
      >
        Sampling rate는 저장량이 아니라 구별 가능한 세계를 정한다
      </SectionTitle>

      <QuestionLead
        question="점들을 더 부드럽게 잇기만 하면 낮은 sampling rate에서도 원래 파동을 복원할 수 있을까?"
        answer="아니다. sampling 뒤에 서로 다른 연속 파동이 같은 점들을 통과하면 어떤 interpolation도 원래 파동을 알아낼 수 없다. 먼저 입력을 bandlimit하고 최고 주파수의 두 배보다 큰 rate로 측정해야 한다."
      />

      <Prose>
        <p>
          sampling은 연속 신호의 spectrum을 sampling frequency 간격으로 반복 복제한다. 원 신호가 B Hz 아래에만
          존재하는 bandlimited signal이고 복제 간격이 2B보다 크면 이 복사본들이 겹치지 않는다. 이때 ideal
          low-pass filter로 한 복사본만 꺼내 원 신호를 복원할 수 있다. 현실 신호가 자동으로 bandlimited인 것은
          아니므로 이 가정이 핵심이다.
        </p>
      </Prose>

      <FormulaFrame tone="focus">
        <div className="grid min-w-0 gap-3">
          <MathFormula display>{String.raw`
            \underbrace{x(t)\text{가 }|f|\le B\text{에서만 존재}}_{\text{먼저 입력을 bandlimit}}
          `}</MathFormula>
          <MathFormula display>{String.raw`
            \underbrace{f_s>2B}_{\text{spectrum 복사본이 겹치지 않게 측정}}
          `}</MathFormula>
        </div>
      </FormulaFrame>
      <FormulaNote
        meaning="최고 주파수 B보다 sampling rate가 엄격히 두 배보다 커야 일반적인 phase의 bandlimited 신호를 안전하게 구분할 수 있다. fₛ/2를 Nyquist frequency라고 하며, 경계 등호를 무조건 안전하다고 쓰지 않는다."
        symbols={[
          [String.raw`B`, '보존하려는 연속 신호의 최고 frequency'],
          [String.raw`f_s`, '초당 측정하는 sample 수'],
          [String.raw`f_s/2`, 'sampled data가 고유하게 표현할 수 있는 Nyquist frequency'],
          ['bandlimited', '지정된 최고 주파수 밖의 energy가 0인 이상화된 조건'],
        ]}
      />

      <SamplingExplorer />

      <Prose>
        <p>
          위 실험기의 기본값처럼 24 Hz로 sampling하면 13 Hz sinusoid는 sample 위에서 11 Hz와 같은 패턴을 만든다.
          sample만 받은 뒤에는 어느 쪽이 원인이었는지 구분할 정보가 없다. 그래서 anti-alias low-pass filter는
          digital tensor를 만든 뒤가 아니라 <strong>ADC가 sample을 찍기 전 analog 경로</strong>에 있어야 한다.
          이 배치는 Lecture 16의 부품 배치 문장을 옮긴 것이 아니라, 그 강의가 보이는 “sampling 뒤 alias는
          reconstruction filter로 분리할 수 없다”는 결과에서 도출한 engineering inference다.
        </p>
      </Prose>

      <div className="not-prose my-8 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        {[
          ['연속 sensor', '원하는 신호와 고주파 간섭이 함께 존재'],
          ['Analog low-pass', 'Nyquist 밖 성분을 sampling 전에 감쇠'],
          ['ADC samples', '남은 대역을 timestamp와 함께 이산화'],
        ].map(([title, detail], index) => (
          <div key={title} className="contents">
            {index > 0 && <span className="text-center text-muted-foreground" aria-hidden="true">→</span>}
            <div className={`min-w-0 rounded-md border p-4 ${index === 1 ? 'border-amber-600/35 bg-amber-500/[0.045]' : 'border-border'}`}>
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <Misconception>
        digital low-pass filter는 이미 alias된 11 Hz와 원래 11 Hz를 구분할 수 없다. 둘은 같은 discrete frequency에
        겹쳐 있기 때문이다. digital filtering은 대역을 정리할 수 있지만 sampling 전에 사라진 원인 구분 정보를
        되살리지는 못한다.
      </Misconception>
    </section>
  );
}

function AiRuntimeBridge() {
  return (
    <section id="ai-runtime-bridge" className="mb-20 scroll-mt-20">
      <SectionTitle
        number="07"
        kicker="AI와 runtime"
        promise="신호처리 수식을 그대로 이름만 바꾸지 않고, PyTorch Conv1d의 실제 연산과 S4·Mamba가 LTI 경계를 사용하는 방식까지 연결합니다."
      >
        CNN과 SSM에서 무엇이 같고 어디서 달라지는가
      </SectionTitle>

      <Prose>
        <h3>PyTorch Conv1d는 이름과 달리 kernel을 뒤집지 않는다</h3>
        <p>
          수학적 convolution은 <MathFormula>{String.raw`h[n-k]`}</MathFormula> 때문에 kernel을 뒤집는다.
          PyTorch `Conv1d` 공식 문서의 연산은 weight index를 그대로 증가시키는
          <strong>valid cross-correlation</strong>이다. 학습 가능한 weight라면 표현 가능한 함수 집합은 kernel
          index를 다시 학습해 맞출 수 있지만, 손으로 만든 filter coefficient를 그대로 복사하거나 다른 library
          결과를 대조할 때는 값이 반대로 나올 수 있다. 길이 M의 신호처리 kernel h와 같은 수치를 원하면
          <MathFormula>{String.raw`w[k]=h[M-1-k]`}</MathFormula>처럼 index를 반전해 weight에 적재한다.
        </p>
      </Prose>

      <FormulaFrame tone="focus">
        <MathFormula display>{String.raw`
          r[c,n,k]
          =
          \underbrace{w[c,k]}_{\text{뒤집지 않은 weight}}
          \underbrace{x[c,n\,s+k\,d-p]}_{\text{선택된 입력}}
        `}</MathFormula>
        <MathFormula display>{String.raw`
          \underbrace{y[n]}_{\text{PyTorch 출력}}
          =
          b+\underbrace{\sum_{c,k}r[c,n,k]}_{\text{channel과 kernel 위치를 합침}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="PyTorch Conv1d는 channel c를 합하고 kernel index k를 그대로 증가시키는 cross-correlation을 계산한다. 신호처리의 h=[h₀,h₁,…]와 동일한 mathematical convolution 수치를 원하면 weight의 index 방향을 확인해 뒤집어 넣어야 한다."
        symbols={[
          [String.raw`s`, '출력 위치를 옮길 때 입력에서 건너뛰는 stride'],
          [String.raw`d`, 'kernel tap 사이를 벌리는 dilation'],
          [String.raw`p`, '입력 양쪽에 가정한 padding 크기'],
          [String.raw`c`, '입력 channel을 합치는 index'],
        ]}
      />

      <FormulaFrame>
        <MathFormula display>{String.raw`
          \begin{aligned}
          \underbrace{K_{\mathrm{eff}}}_{\text{kernel의 유효 폭}}
          &=d(K-1)+1\\
          \underbrace{u}_{\text{마지막 유효 시작점까지의 칸 수}}
          &=\frac{L_{\mathrm{in}}+2p-K_{\mathrm{eff}}}{s}+1\\
          L_{\mathrm{out}}&=\lfloor u\rfloor
          \end{aligned}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="출력 길이는 input length만으로 정해지지 않는다. dilation이 벌린 effective kernel 폭, 양쪽 padding, stride를 모두 넣고 마지막에 floor한다. 예를 들어 Lᵢₙ=16, K=3, d=2, p=2, s=2이면 출력 길이는 8이다."
        symbols={[
          [String.raw`L_{\mathrm{in}}`, '입력 sequence 길이'],
          [String.raw`K`, '저장된 kernel tap 수'],
          [String.raw`d(K-1)+1`, 'dilation을 반영한 effective receptive width'],
          [String.raw`K_{\mathrm{eff}}`, 'dilation을 반영해 실제로 입력에서 차지하는 kernel 폭'],
          [String.raw`u`, 'padding·effective kernel·stride를 반영한 floor 이전 출력 길이'],
          [String.raw`L_{\mathrm{out}}`, '실제로 생성되는 출력 위치 수'],
        ]}
      />

      <Prose>
        <p>
          stride는 output을 계산하는 시작 위치의 간격을 바꾸고, dilation은 같은 K개 tap 사이의 입력 간격을
          바꾼다. 둘 다 receptive field에 영향을 주지만 같은 연산이 아니다. PyTorch의 문자열
          <code>padding=&quot;same&quot;</code>은 output 길이를 input과 같게 맞추지만 공식 runtime 계약상 stride 1에서만 지원된다.
          stride가 더 크면 원하는 boundary와 output length를 계산해 padding을 직접 정해야 한다. 또 convolution
          뒤 ReLU나 gate가 들어가면 전체 network는 더 이상 linear하지 않다. 같은 kernel을 위치마다 쓰는 translation
          equivariance 일부는 남을 수 있어도 “CNN 전체가 LTI”라고 부르면 안 된다.
        </p>

        <h3>Fixed SSM은 scan과 convolution을 오갈 수 있다</h3>
        <p>
          S4는 연속 state-space model을 discrete recurrence로 바꾼 뒤, 고정된 coefficient를 반복 대입해 긴
          convolution kernel을 만든다. training에서는 긴 sequence를 병렬화하기 좋은 convolution 형태를 쓰고,
          autoregressive inference에서는 이전 state만 보관하는 recurrence 형태를 쓸 수 있다. 두 실행이 같은
          system을 나타내는 이유가 앞 절의 impulse response 유도다.
        </p>
      </Prose>

      <FormulaFrame tone="focus">
        <MathFormula display>{String.raw`
          \underbrace{x_k=\bar A x_{k-1}+\bar B u_k}_{\text{한 step씩 state scan}}
        `}</MathFormula>
        <MathFormula display>{String.raw`
          \underbrace{K=(C\bar B,\;C\bar A\bar B,\;C\bar A^2\bar B,\ldots)}_{\text{펼친 고정 convolution kernel}}
        `}</MathFormula>
      </FormulaFrame>
      <FormulaNote
        meaning="Ā, B̄, C가 모든 token 위치에서 고정이면 recurrence는 LTI이고, 과거 입력의 계수를 미리 모아 kernel K로 만들 수 있다. state scan과 convolution은 서로 다른 모델이 아니라 같은 fixed system의 두 실행 방식이다."
        symbols={[
          [String.raw`u_k`, 'k 위치의 새 입력'],
          [String.raw`x_k`, '과거를 압축한 state'],
          [String.raw`\bar A,\bar B`, 'discretization 뒤의 고정 state transition과 input map'],
          [String.raw`K`, '각 과거 입력이 현재 output에 미치는 계수열'],
        ]}
      />

      <Prose>
        <h3>Mamba의 selection은 fixed convolution 경계를 의도적으로 깬다</h3>
        <p>
          고정 LTI filter는 같은 input value가 어느 위치에 와도 같은 방식으로 처리된다. 이것은 효율적이지만
          token 내용에 따라 “기억할지 버릴지” 바꾸기 어렵다. Mamba는 input에 따라
          <MathFormula>{String.raw`\Delta,B,C`}</MathFormula> 등을 선택적으로 바꾼다. 그러면 한 번 만들어 모든
          위치에 재사용할 고정 kernel K가 없어지고 time-varying recurrence가 된다. Mamba가 hardware-aware
          parallel scan을 설계한 이유다.
        </p>
        <p>
          이 경계는 <InternalLink slug="llm-architecture-hybrid-linear">Hybrid·Linear LLM 아키텍처</InternalLink>에서
          attention, linear attention, SSM을 비교할 때 다시 사용한다. S4의 모든 성능을 단순한 scalar filter로
          설명하거나, Mamba를 “convolution의 빠른 버전”으로만 요약하면 selection이 해결하려는 내용 의존 기억을
          놓친다.
        </p>

        <h3>Audio와 robot sensor에서는 tensor 앞의 물리 계약이 먼저다</h3>
        <p>
          audio frontend는 waveform을 window와 filter bank로 바꾸기 전에 sampling rate와 anti-alias 조건을
          갖는다. codec token과 neural audio representation으로 올라가는 경로는
          {' '}<InternalLink slug="audio-representation-neural-codecs">오디오 표현과 Neural Codec</InternalLink>에서
          이어진다. robot control에서는 acquisition timestamp, filter delay, control period가 closed-loop
          phase margin에 들어가므로 <InternalLink slug="robot-dynamics-feedback-control">Robot Dynamics &amp; Feedback</InternalLink>와
          연결된다.
        </p>
      </Prose>

      <StopRule>
        이 글에서는 discrete LTI의 실행 계약까지 내려간다. z-transform pole 배치, Laplace transfer function,
        다차원 controllability·observability와 controller 설계는 별도 글의 바닥으로 넘긴다. 지금 필요한 최소
        능력은 낯선 sequence system을 보고 impulse, causality, stability, sampling, runtime convention을 검산하는
        것이다.
      </StopRule>

      <CapabilityCheck
        items={[
          'Signal value와 index·sample interval·acquisition time을 함께 정의한다.',
          '선형성, 시불변성, 인과성, 안정성을 서로 다른 witness로 검사한다.',
          'Impulse decomposition에서 convolution sum을 다시 유도한다.',
          '출력 한 위치의 flip·shift·multiply·sum을 손으로 계산한다.',
          'Impulse response support와 절대합으로 causality와 BIBO stability를 판정한다.',
          'Scalar recurrence를 펼쳐 impulse kernel과 scan 출력의 일치를 보인다.',
          'FFT circular wrap-around와 N+M-1 zero-padding 필요를 찾는다.',
          'Bandlimited 가정 아래 alias와 anti-alias filter의 위치를 설명한다.',
          'PyTorch Conv1d의 cross-correlation, stride, dilation, output length를 계산한다.',
          'Fixed SSM과 selective SSM에서 고정 convolution이 가능한 경계를 구분한다.',
        ]}
      />

      <SourceNotes
        sources={[
          {
            label: 'MIT OCW RES.6-007 · Lecture 4: Convolution',
            href: 'https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/27da9a018e92fc06d2cf1fbce5cd3e71_MITRES_6_007S11_lec04.pdf',
            note: 'Impulse decomposition에서 이산·연속 LTI convolution을 유도하는 1차 근거.',
          },
          {
            label: 'MIT OCW RES.6-007 · Lecture 5: LTI properties',
            href: 'https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/431b597316940ea786c72a16b8cd6371_MITRES_6_007S11_lec05.pdf',
            note: 'Impulse response로 memory, causality와 BIBO stability를 판정하는 기준.',
          },
          {
            label: 'MIT OCW RES.6-007 · Lecture 6: Difference equations',
            href: 'https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/c7ac1086bd3994495536c05eb68d9afb_MITRES_6_007S11_lec06.pdf',
            note: 'Difference equation, auxiliary condition과 recursive implementation의 근거.',
          },
          {
            label: 'MIT 6.003 · Lecture 9: Eigenfunctions',
            href: 'https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/ae0f6535cd4c67454ac3cf1a70c85934_MIT6_003F11_lec09.pdf',
            note: 'Complex exponential과 frequency response 연결의 1차 근거.',
          },
          {
            label: 'MIT OCW RES.6-007 · Lecture 16: Sampling',
            href: 'https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/8708ec068ebdea2c4ee2f38fad39fb83_MITRES_6_007S11_lec16.pdf',
            note: 'Bandlimited assumption, spectrum replication, Nyquist condition과 reconstruction의 근거.',
          },
          {
            label: 'PyTorch · Conv1d',
            href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv1d.html',
            note: 'Cross-correlation convention, stride, padding, dilation, groups와 output length의 runtime 계약.',
          },
          {
            label: 'SciPy · fftconvolve',
            href: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.fftconvolve.html',
            note: 'Full linear convolution mode, output shape와 FFT/direct tradeoff의 구현 근거.',
          },
          {
            label: 'S4 · Efficiently Modeling Long Sequences',
            href: 'https://arxiv.org/abs/2111.00396',
            note: 'Discretized state recurrence와 LTI convolution kernel의 dual execution을 제시한다.',
          },
          {
            label: 'Mamba · Linear-Time Sequence Modeling',
            href: 'https://arxiv.org/abs/2312.00752',
            note: 'Input-dependent selection이 fixed LTI convolution을 깨고 scan을 요구하는 경계를 제시한다.',
          },
          {
            label: '혁펜하임 · 퍼펙트 신호 및 시스템',
            href: 'https://www.youtube.com/playlist?list=PL_iJu012NOxcDuKgSjTKJZJd3bQtkAyZU',
            note: 'LTI에서 convolution, Fourier, sampling과 state-space로 이어지는 국내 공개 학습 순서를 보조 비교했다.',
          },
        ]}
      />
    </section>
  );
}

export default function SignalsSystemsConvolutionArticle() {
  return (
    <>
      <SignalContract />
      <ImpulseConvolution />
      <CausalityStability />
      <DifferenceEquationState />
      <FrequencyExecution />
      <SamplingInformation />
      <AiRuntimeBridge />
    </>
  );
}
