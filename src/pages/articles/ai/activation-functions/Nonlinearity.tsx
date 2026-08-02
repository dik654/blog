import { ArrowRight } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, InternalLink, Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const probes = [
  { z: '-2.0', output: '0.0', slope: '0.0', note: '음수 신호와 gradient를 막음', tone: 'bg-muted/30' },
  { z: '+0.5', output: '+0.5', slope: '1.0', note: '값과 gradient를 그대로 통과', tone: 'bg-emerald-500/[0.05]' },
  { z: '+3.0', output: '+3.0', slope: '1.0', note: '큰 양수도 기울기 1로 통과', tone: 'bg-blue-500/[0.05]' },
];

function ActivationContractViz() {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <span className="text-sm font-semibold">같은 ReLU가 forward 값과 backward 신호를 함께 정한다</span>
        <span className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-300">LOCAL CONTRACT</span>
      </figcaption>
      <div className="grid gap-px bg-border sm:grid-cols-3">
        {probes.map((probe) => (
          <div key={probe.z} className={`min-w-0 bg-background p-4 ${probe.tone}`}>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 font-mono text-sm font-bold">
              <span className="rounded-sm border border-border bg-background px-2 py-2 text-center">z={probe.z}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <span className="rounded-sm border border-border bg-background px-2 py-2 text-center">a={probe.output}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3 text-xs">
              <span className="text-muted-foreground">local slope</span>
              <strong className="font-mono">φ′(z)={probe.slope}</strong>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{probe.note}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

export default function Nonlinearity() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">활성화 함수는 값과 gradient를 어떻게 함께 바꿀까?</h2>
      <BeginnerBridge title="같은 문이라도 들어오는 값에 따라 통과시키거나 막는 문지기를 떠올립니다.">
        앞 글의 신경망은 여러 층이 계산한 값을 다음 층으로 넘겼다. 이제 각 층 사이에 문지기 하나를 둔다. 문지기는 앞으로 갈 때 어떤 값을 통과시킬지 정하고, 학습 신호가 뒤로 돌아올 때도 얼마나 통과할지를 함께 정한다. 이 문지기가 활성화 함수다.
      </BeginnerBridge>
      <QuestionLead
        question="forward에서 출력만 바꾸는 함수를 backward에서도 신경 써야 하는 이유는 무엇일까?"
        answer="활성화 함수는 현재 위치의 출력값뿐 아니라 local slope도 정한다. 다음 층은 출력값으로 예측하고, 역전파는 그 slope를 통해 앞층이 얼마나 바뀔 수 있는지 계산한다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          앞 글에서 선형층만 이어 붙이면 하나의 선형층으로 접힌다는 것을 전개했다. 필요하면 <InternalLink slug="neural-network">신경망 글의 결합 가중치와 결합 편향</InternalLink>을 다시 확인하자.
          이 글은 그 증명을 반복하지 않고, 축약을 막는 함수가 각 입력에서 어떤 값과 기울기를 만드는지 추적한다.
        </p>
      </div>

      <ActivationContractViz />
      <Math display>{String.raw`
\underbrace{a}_{\text{다음 층이 받는 값}}
=
\underbrace{\phi(z)}_{\text{현재 위치의 비선형 변환}}
`}</Math>
      <FormulaNote
        meaning="같은 함수 φ를 쓰더라도 z가 놓인 위치에 따라 출력값과 local slope가 달라진다. 여기서는 forward 계약을 먼저 고정하고, 뒤에서 함수 곡선과 도함수를 나란히 비교한다."
        symbols={[
          [String.raw`z=Wx+b`, '활성화 전 pre-activation'],
          [String.raw`\phi`, 'ReLU, sigmoid, GELU 같은 비선형 활성화 함수'],
          [String.raw`a`, '다음 층으로 전달하는 activation'],
          [String.raw`\phi'(z)`, '현재 입력 위치에서 backward 신호가 통과하는 비율'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>계단 함수도 비선형인데 왜 훈련에 쓰지 않을까?</h3>
        <p>
          계단 함수는 결정을 만들 수 있지만 거의 모든 입력에서 도함수가 0이고 경계에서 미분되지 않는다. Gradient 기반
          학습에서는 앞층으로 전달할 변화 신호가 사라진다. 현대 활성화 함수는 비선형 표현력뿐 아니라 유용한 gradient를
          전달할 수 있는지도 함께 고려한다.
        </p>
      </div>
      <Misconception>
        활성화 함수는 “뉴런이 발화하는 생물학적 모사”만을 위한 장치가 아니다. 함수 합성의 표현력과 backward의 gradient 흐름을 동시에 설계하는 수학적 부품이다.
      </Misconception>
    </section>
  );
}
