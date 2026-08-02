import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { InternalLink, QuestionLead } from '@/components/learning/ArticleLearning';

const rows = [
  { label: '고양이 · 정답', logit: '2.0', probability: '0.659', target: '1', gradient: '-0.341', action: 'logit 올리기', tone: 'text-blue-700 dark:text-blue-300' },
  { label: '개', logit: '1.0', probability: '0.242', target: '0', gradient: '+0.242', action: 'logit 내리기', tone: 'text-rose-700 dark:text-rose-300' },
  { label: '새', logit: '0.1', probability: '0.099', target: '0', gradient: '+0.099', action: 'logit 내리기', tone: 'text-rose-700 dark:text-rose-300' },
];

export default function SoftmaxGradient() {
  return (
    <section id="softmax-gradient" data-formula-pair className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Softmax와 합치면 gradient가 왜 p-y가 될까?</h2>
      <QuestionLead
        question="softmax의 class들이 서로 얽혀 있는데 backward 결과는 왜 이렇게 단순할까?"
        answer="정답 logit이 loss에 미치는 직접 효과와 softmax 정규화 항의 효과가 결합되면 각 class에서 예측 확률 p와 정답 y의 차이만 남는다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Logit은 아직 확률이 아닌 임의의 실수 점수다. Softmax는 지수함수로 양수 값을 만들고 전체 합으로 나눠 확률분포를
          만든다. Cross-entropy에 대입하면 정답 logit을 끌어올리는 항과 모든 logit을 정규화하는 log-sum-exp 항으로
          분리된다.
        </p>
      </div>
      <div className="not-prose my-6 space-y-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`p_j=\underbrace{\frac{e^{z_j}}{\sum_k e^{z_k}}}_{\text{점수를 합이 1인 확률로 변환}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\ell=\underbrace{-z_y}_{\text{정답 점수를 올리는 압력}}+\underbrace{\log\sum_k e^{z_k}}_{\text{모든 점수의 경쟁 비용}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><Math display className="my-0 text-sm sm:text-lg">{String.raw`\underbrace{\frac{\partial \ell}{\partial z_j}}_{\text{logit이 맡은 오차 책임}}=\underbrace{p_j-y_j}_{\text{예측 확률}-\text{정답 비율}}`}</Math></div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>같은 오답에서 CE와 MSE의 logit 신호는 왜 다를까?</h3>
        <p>
          정답 확률이 0.01이라고 하자. Cross-entropy는 softmax 미분과 결합한 뒤에도 거의 -1인 신호를 남긴다. 반면
          sigmoid 출력에 MSE를 바로 쓰면 같은 오차에 activation의 작은 기울기를 한 번 더 곱해 신호가 약 100배 작아진다.
          중요한 비교 대상은 loss를 확률로 미분한 값이 아니라, 두 경우 모두 실제 파라미터로 흘러가는 logit 기울기다.
        </p>
      </div>
      <div className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-teal-500/40 bg-teal-500/[0.055] p-4">
          <p className="text-xs font-bold text-teal-800 dark:text-teal-300">Cross-entropy + softmax</p>
          <Math display className="my-4 text-sm sm:text-base">{String.raw`g_{CE}=\underbrace{0.01-1}_{\text{포화되지 않은 수정 신호}}=-0.99`}</Math>
          <p className="text-xs leading-relaxed text-muted-foreground">확신한 오답에서도 bounded이지만 큰 방향 신호가 남는다.</p>
        </div>
        <div className="min-w-0 rounded-md border border-amber-500/40 bg-amber-500/[0.055] p-4">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300">MSE + sigmoid</p>
          <Math display className="my-4 text-sm sm:text-base">{String.raw`g_{MSE}=\underbrace{(-0.99)(0.01)(0.99)}_{\text{sigmoid 기울기가 다시 축소}}\approx-0.0098`}</Math>
          <p className="text-xs leading-relaxed text-muted-foreground">출력이 0 근처에서 포화되어 틀린 예측을 되돌리는 속도가 느려진다.</p>
        </div>
      </div>

      <figure className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <figcaption className="border-b border-border bg-muted/20 px-4 py-3 text-sm font-bold">logits [2.0, 1.0, 0.1]의 한 번의 backward</figcaption>
        <div className="hidden grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(4rem,0.7fr))] gap-3 border-b border-border px-4 py-2 text-xs font-bold text-muted-foreground sm:grid">
          <span>class</span><span>logit</span><span>p</span><span>y</span><span>p-y</span>
        </div>
        {rows.map((row) => (
          <div key={row.label} className="grid min-w-0 gap-3 border-b border-border p-4 last:border-0 sm:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(4rem,0.7fr))] sm:items-center">
            <div><p className="text-sm font-bold">{row.label}</p><p className={`mt-1 text-xs font-semibold ${row.tone}`}>{row.action}</p></div>
            <dl className="grid grid-cols-4 gap-2 sm:contents">
              <div><dt className="text-[10px] text-muted-foreground sm:hidden">logit</dt><dd className="font-mono text-xs">{row.logit}</dd></div>
              <div><dt className="text-[10px] text-muted-foreground sm:hidden">p</dt><dd className="font-mono text-xs">{row.probability}</dd></div>
              <div><dt className="text-[10px] text-muted-foreground sm:hidden">y</dt><dd className="font-mono text-xs">{row.target}</dd></div>
              <div><dt className="text-[10px] text-muted-foreground sm:hidden">p-y</dt><dd className="font-mono text-xs font-bold">{row.gradient}</dd></div>
            </dl>
          </div>
        ))}
      </figure>
      <FormulaNote
        meaning="gradient descent는 gradient의 반대 방향으로 움직인다. 정답 class는 p-1이 음수이므로 logit이 올라가고, 오답 class는 p가 양수이므로 logit이 내려간다. 세 gradient의 합은 0이라 상대적인 점수 차이를 조정한다."
        symbols={[
          [String.raw`z_j`, 'class j의 정규화 전 logit'],
          [String.raw`p_j`, 'softmax 뒤 class j의 예측 확률'],
          [String.raw`y_j`, '정답 class면 1, 아니면 0'],
          [String.raw`p-y`, '출력층에서 시작해 앞층으로 전달되는 error signal'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 <Math>{String.raw`p-y`}</Math>가 출력층의 시작 gradient다. 앞층의 weight와 activation까지 책임을 전달하는 계산은
          다음 <InternalLink slug="backprop-optimization">역전파 글</InternalLink>에서 같은 기호를 tensor shape와 함께 이어간다.
        </p>
      </div>
    </section>
  );
}
