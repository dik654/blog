import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { QuestionLead } from '@/components/learning/ArticleLearning';

const coordinates = [
  { name: 'θ₁', gradient: '0.02', square: '0.0004', normalized: '≈ 1.00' },
  { name: 'θ₂', gradient: '2.00', square: '4.0000', normalized: '≈ 1.00' },
];

export default function AdamState() {
  return (
    <section id="adam" data-formula-pair className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Adam은 왜 좌표마다 다른 learning rate처럼 동작할까?</h2>
      <QuestionLead
        question="gradient 크기가 100배 다른 두 파라미터를 같은 learning rate로 안정적으로 움직일 수 있을까?"
        answer="Adam은 gradient의 이동 평균 m과 제곱 gradient의 이동 평균 v를 따로 저장한다. 방향 신호 m을 최근 규모 √v로 나누어 좌표별 update를 정규화한다."
      />
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{m_t}_{\text{방향 기억}}=\beta_1m_{t-1}+(1-\beta_1)g_t`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{v_t}_{\text{크기 기억}}=\beta_2v_{t-1}+(1-\beta_2)g_t^2`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\hat m_t,\hat v_t}_{\text{초기 편향 보정}}=\frac{m_t}{1-\beta_1^t},\frac{v_t}{1-\beta_2^t}`}</Math></div>
        <div className="min-w-0 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\Delta\theta_t}_{\text{좌표별 이동량}}=-\eta\underbrace{\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}}_{\text{방향을 최근 크기로 정규화}}`}</Math></div>
      </div>

      <figure className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <figcaption className="border-b border-border bg-muted/20 px-4 py-3 text-sm font-bold">첫 step에서 gradient 규모 정규화의 직관</figcaption>
        <div className="grid grid-cols-4 gap-2 border-b border-border px-4 py-2 text-[11px] font-bold text-muted-foreground"><span>좌표</span><span className="text-right">g</span><span className="text-right">g²</span><span className="text-right">g/√g²</span></div>
        {coordinates.map((row) => (
          <div key={row.name} className="grid grid-cols-4 gap-2 border-b border-border px-4 py-3 text-xs last:border-0"><span className="font-bold">{row.name}</span><span className="text-right font-mono">{row.gradient}</span><span className="text-right font-mono">{row.square}</span><span className="text-right font-mono font-bold text-emerald-700 dark:text-emerald-300">{row.normalized}</span></div>
        ))}
      </figure>
      <FormulaNote
        meaning="초기 state가 0이라 이동 평균은 처음에 작게 치우친다. bias correction은 이 시작 편향을 보정한다. v_t는 gradient 제곱의 평균인 2차 raw moment다. 평균 gradient를 먼저 빼서 구하는 statistical variance와는 다르다. ε는 0으로 나누는 것을 막고 gradient가 매우 작은 좌표의 최대 유효 step도 제한한다."
        symbols={[
          [String.raw`m_t`, 'gradient 방향을 추적하는 1차 moment state'],
          [String.raw`v_t`, 'gradient 규모를 추적하는 2차 raw moment state'],
          [String.raw`\beta_1,\beta_2`, '두 state의 기억 길이를 따로 정하는 계수'],
          [String.raw`\epsilon`, '분모의 수치 안정성과 작은 gradient의 update 규모를 조절하는 값'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Adam이 해결하지 않는 것</h3>
        <p>
          좌표별 정규화는 scale 차이에 강하지만 최적 learning rate, scheduler, batch size를 자동으로 찾는 것은 아니다.
          빠른 training loss 감소가 더 좋은 validation 성능을 보장하지도 않는다. Adam은 매 파라미터마다 m과 v를 저장하므로
          파라미터 외에 대략 두 배의 optimizer state 메모리도 필요하다.
        </p>
      </div>
    </section>
  );
}
