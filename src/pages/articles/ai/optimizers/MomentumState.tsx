import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const gradients = [
  { step: 't-3', vertical: '+2.8', horizontal: '+0.4' },
  { step: 't-2', vertical: '-2.5', horizontal: '+0.4' },
  { step: 't-1', vertical: '+2.2', horizontal: '+0.4' },
  { step: 't', vertical: '-2.0', horizontal: '+0.4' },
];

export default function MomentumState() {
  return (
    <section id="momentum" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Momentum은 무엇을 기억하고 무엇을 지울까?</h2>
      <QuestionLead
        question="과거 gradient를 더하면 오래된 잘못된 방향도 쌓이지 않을까?"
        answer="지수 이동 평균은 오래된 신호를 β의 거듭제곱만큼 감쇠한다. 부호가 번갈아 바뀌는 방향은 상쇄되고, 계속 같은 부호인 방향은 누적되어 좁은 골짜기의 진동을 줄인다."
      />
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <div className="grid grid-cols-3 border-b border-border bg-muted/30 px-4 py-2 text-xs font-bold text-muted-foreground"><span>step</span><span className="text-right">가파른 축</span><span className="text-right">평평한 축</span></div>
        {gradients.map((row) => (
          <div key={row.step} className="grid grid-cols-3 border-b border-border px-4 py-3 text-xs last:border-0"><span className="font-mono font-bold">{row.step}</span><span className="text-right font-mono">{row.vertical}</span><span className="text-right font-mono font-bold text-blue-600">{row.horizontal}</span></div>
        ))}
      </div>
      <div className="not-prose my-6 space-y-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{v_t}_{\text{평활한 방향}}=\underbrace{\beta v_{t-1}}_{\text{과거 기억}}+\underbrace{(1-\beta)g_t}_{\text{새 기울기}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\theta_{t+1}}_{\text{다음 위치}}=\theta_t-\underbrace{\eta v_t}_{\text{평활한 이동량}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="β가 1에 가까울수록 긴 과거를 부드럽게 평균한다. β=0.9의 유효 기억 길이는 대략 1/(1-β)=10 step이지만, 빠른 방향 변화에는 늦게 반응할 수 있다."
        symbols={[
          [String.raw`v_t`, '과거와 현재 gradient의 지수 이동 평균'],
          [String.raw`\beta`, '과거 state를 얼마나 유지할지 정하는 momentum 계수'],
          [String.raw`1-\beta`, '새 gradient가 평균에 들어가는 비율'],
          [String.raw`\eta`, '평균 gradient를 실제 이동량으로 바꾸는 learning rate'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Nesterov momentum은 어디를 보고 gradient를 잴까?</h3>
        <p>
          일반 momentum은 현재 위치에서 gradient를 측정한 뒤 과거 속도와 합친다. Nesterov 방식은 momentum으로 이동할
          지점을 미리 고려해 gradient를 평가하여 과도한 진행을 조금 더 일찍 교정한다. 라이브러리마다 velocity의 부호와
          (1-β) 포함 여부가 다르므로 수식 형태보다 실제 update 계약을 확인해야 한다.
        </p>
      </div>
      <Misconception>
        momentum은 물리적 속도를 정확히 모사하는 장치가 아니다. gradient의 저주파 방향을 강조하고 step 간 noise를 완화하는 optimizer state로 이해하는 편이 구현과 tuning에 더 정확하다.
      </Misconception>
    </section>
  );
}
