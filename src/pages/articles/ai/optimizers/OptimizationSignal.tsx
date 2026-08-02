import { ArrowDown, ArrowRight } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, ConceptPrimer, QuestionLead } from '@/components/learning/ArticleLearning';

const pipeline = [
  { index: '01', title: 'Forward', body: '예측과 loss를 측정', tone: 'border-blue-600 bg-blue-500/[0.05] text-blue-700 dark:text-blue-300' },
  { index: '02', title: 'Backward', body: '현재 gradient를 계산', tone: 'border-cyan-600 bg-cyan-500/[0.05] text-cyan-700 dark:text-cyan-300' },
  { index: '03', title: 'Optimizer', body: 'state와 결합해 update 생성', tone: 'border-orange-600 bg-orange-500/[0.05] text-orange-700 dark:text-orange-300' },
  { index: '04', title: 'Step', body: '새 파라미터에 적용', tone: 'border-emerald-600 bg-emerald-500/[0.05] text-emerald-700 dark:text-emerald-300' },
];

export default function OptimizationSignal() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Gradient가 있는데 왜 optimizer가 따로 필요할까?</h2>
      <BeginnerBridge title="내리막 방향을 알아도 보폭과 관성을 정하지 않으면 목적지에 잘 도착할 수 없습니다.">
        산비탈에서 지금 가장 가파르게 내려가는 방향은 알 수 있어도, 너무 크게 뛰면 골짜기를 건너뛰고 너무 작게 걸으면 거의 움직이지 못한다. 앞에서 구한 gradient는 방향을 알려 주고, optimizer는 보폭과 과거 움직임을 이용해 실제 한 걸음을 정한다.
      </BeginnerBridge>
      <QuestionLead
        question="backward가 기울기를 구했다면 그대로 반대 방향으로 움직이면 끝 아닐까?"
        answer="gradient는 현재 위치의 국소적인 오르막 방향만 말한다. optimizer는 step 크기, 과거 방향, 좌표별 gradient 규모, regularization을 결합해 실제 파라미터 update를 만든다."
      />
      <ConceptPrimer
        items={[
          { term: 'gradient', meaning: '각 파라미터를 아주 조금 늘렸을 때 loss가 얼마나 변하는지 모은 벡터다.', why: '현재 위치에서 loss를 줄일 국소 방향을 제공한다.' },
          { term: 'learning rate', meaning: 'gradient 신호를 실제 이동량으로 바꾸는 전역 배율이다.', why: '너무 큰 발산과 너무 작은 정체 사이의 step 규모를 정한다.' },
          { term: 'optimizer state', meaning: 'Momentum과 Adam이 step 사이에 기억하는 이동 평균이다.', why: '현재 gradient만으로 알 수 없는 과거 방향과 좌표별 규모를 반영한다.' },
        ]}
      />

      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5"><p className="text-sm font-semibold">Gradient가 실제 이동량이 되는 지점</p><p className="font-mono text-[10px] font-bold text-orange-700 dark:text-orange-300">gₜ ≠ Δθₜ</p></div>
        <div className="grid items-stretch p-4 lg:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] lg:p-5">
          {pipeline.map((item, index) => (
            <div key={item.index} className="contents">
              <div className={`min-w-0 rounded-md border border-l-4 p-4 ${item.tone}`}><p className="font-mono text-xs font-bold opacity-75">{item.index}</p><p className="mt-3 text-sm font-bold text-foreground">{item.title}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.body}</p></div>
              {index < pipeline.length - 1 && <div className="flex h-7 items-center justify-center text-muted-foreground lg:h-auto" aria-hidden="true"><ArrowDown className="h-4 w-4 lg:hidden" /><ArrowRight className="hidden h-4 w-4 lg:block" /></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{g_t}_{\text{역전파 출력}}=\underbrace{\nabla_\theta L(\theta_t)}_{\text{현재 위치의 기울기}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{\theta_{t+1}}_{\text{다음 파라미터}}=\theta_t+\underbrace{\Delta\theta_t}_{\text{optimizer 이동량}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="backward의 출력은 gradient gt이고 optimizer의 출력은 update Δθt다. SGD에서는 -ηgt로 같아 보이지만 Momentum과 Adam에서는 과거 state까지 사용하므로 둘을 구분해야 한다."
        symbols={[
          [String.raw`\theta_t`, 'step t에서 학습 중인 모든 파라미터'],
          [String.raw`L`, '현재 mini-batch에서 계산한 loss'],
          [String.raw`g_t`, 'backward가 만든 현재 gradient'],
          [String.raw`\Delta\theta_t`, 'optimizer가 결정한 실제 파라미터 이동 벡터'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Loss가 작아지는 방향과 최적의 경로는 다르다</h3>
        <p>
          음의 gradient는 충분히 작은 한 걸음에서는 loss를 줄인다. 그러나 loss surface의 축마다 굽은 정도가 다르면 한
          learning rate가 어떤 축에는 너무 크고 다른 축에는 너무 작다. 그 결과 좁은 골짜기를 좌우로 진동하거나 평평한
          방향에서 거의 전진하지 못한다. 이후 optimizer들은 이 조건 차이를 다루기 위해 상태를 추가한다.
        </p>
      </div>
    </section>
  );
}
