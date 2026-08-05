import { Link } from 'react-router-dom';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, Misconception, SourceNotes } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

const decisions = [
  ['큰 vision 분류·충분한 tuning', 'SGD + momentum도 강한 기준선', 'generalization과 training budget을 함께 비교'],
  ['많은 Transformer·LLM fine-tuning recipe', '논문·모델이 쓴 AdamW부터 재현', 'warmup, schedule, gradient clipping까지 함께 확인'],
  ['희소하거나 scale이 다른 gradient', 'adaptive optimizer가 편리', 'ε와 state memory 비용 확인'],
  ['재현 실험', '논문 설정부터 복제', 'optimizer 이름뿐 아니라 모든 hyperparameter 기록'],
];

export default function AdamWPractice() {
  return (
    <section id="adamw" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">AdamW는 L2와 무엇을 분리했을까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          SGD에서는 loss에 L2 penalty를 더한 gradient와 파라미터를 일정 비율 줄이는 weight decay가 같은 update가 된다.
          Adam에서는 penalty gradient도 좌표별 v로 나뉘어 파라미터마다 decay 강도가 달라진다. AdamW는 loss gradient의
          adaptive update와 파라미터 축소를 분리한다.
        </p>
      </div>
      <div className="not-prose my-6 grid min-w-0 gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-md border border-rose-500/40 p-4">
          <p className="text-xs font-bold text-rose-700 dark:text-rose-300">L2 gradient를 Adam에 섞기</p>
          <div className="mt-4 min-w-0"><Math display className="my-0 text-xs sm:text-sm">{String.raw`g_t\leftarrow\underbrace{\nabla L(\theta_t)}_{\text{loss 기울기}}+\underbrace{\lambda\theta_t}_{\text{L2 항도 함께 변환}}`}</Math></div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">λθ도 adaptive denominator의 영향을 받아 좌표별 축소율이 달라진다.</p>
        </div>
        <div className="min-w-0 rounded-md border border-emerald-500/40 p-4">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">AdamW의 decoupled decay</p>
          <div className="mt-4 min-w-0"><Math display className="my-0 text-xs sm:text-sm">{String.raw`\theta_{t+1}=\theta_t+\underbrace{\Delta\theta_t}_{\text{adaptive update}}-\underbrace{\eta\lambda\theta_t}_{\text{분리된 weight decay}}`}</Math></div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">loss update와 별도로 현재 weight를 일정 비율 줄인다.</p>
        </div>
      </div>
      <FormulaNote
        meaning="AdamW의 W는 weight decay를 adaptive gradient 변환 밖으로 분리했다는 뜻이다. 보통 bias와 normalization scale에는 decay를 적용하지 않는 parameter group을 별도로 만든다."
        symbols={[
          [String.raw`\lambda`, 'weight decay 강도'],
          [String.raw`\eta\lambda`, '한 step에서 파라미터가 추가로 줄어드는 비율'],
          [String.raw`\Delta\theta_t`, 'Adam이 loss gradient로 계산한 adaptive update'],
          ['parameter group', '서로 다른 learning rate나 decay를 적용할 파라미터 묶음'],
        ]}
      />

      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {decisions.map(([context, baseline, check]) => (
          <div key={context} className="grid min-w-0 gap-2 border-b border-border p-4 last:border-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-4">
            <p className="text-sm font-bold">{context}</p><p className="text-xs font-semibold leading-relaxed">{baseline}</p><p className="text-xs leading-relaxed text-muted-foreground">{check}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Warmup과 decay schedule은 왜 optimizer와 함께 보나?</h3>
        <p>
          초기에는 표현과 optimizer state가 모두 안정되지 않아 큰 learning rate가 update를 망가뜨릴 수 있다. Warmup은
          초반 learning rate를 서서히 올리고, 이후 cosine이나 linear schedule은 학습 후반의 진동을 줄인다. 모델·batch·총
          step이 바뀌면 peak learning rate, warmup 비율, weight decay를 묶어서 다시 검증해야 한다.
        </p>
      </div>
      <Misconception>
        AdamW가 Transformer에서 흔하다는 사실은 모든 문제에서 SGD보다 우월하다는 뜻이 아니다. 같은 compute budget에서 training 속도와 validation 성능을 측정하고, scheduler와 regularization까지 포함한 조합으로 비교해야 한다.
      </Misconception>
      <CapabilityCheck
        items={[
          'gradient와 optimizer update를 서로 다른 벡터로 설명할 수 있다.',
          'mini-batch gradient의 noise가 어디서 생기며 batch size와 어떻게 변하는지 설명할 수 있다.',
          '좁은 loss valley에서 SGD와 momentum의 trajectory 차이를 설명할 수 있다.',
          'Adam의 m, v, bias correction, ε가 각각 필요한 이유를 말할 수 있다.',
          'Adam의 L2 penalty와 AdamW의 decoupled weight decay 차이를 수식과 코드 관점에서 구분할 수 있다.',
        ]}
      />
      <Link
        to={articlePath('ai', 'foundation-training-step')}
        className="not-prose my-8 flex min-w-0 items-center justify-between gap-4 rounded-md border border-border p-4 transition-colors hover:bg-muted/20"
      >
        <span className="min-w-0">
          <span className="block text-xs font-semibold text-muted-foreground">다음 · 한 숫자로 통합</span>
          <span className="mt-1 block text-sm font-bold">Forward, BCE, gradient와 SGD update를 한 원장으로 재검산</span>
        </span>
        <span aria-hidden="true" className="shrink-0 text-lg">→</span>
      </Link>
      <SourceNotes
        sources={[
          { label: 'Adam', href: 'https://arxiv.org/abs/1412.6980', note: 'adaptive first/second moment와 bias correction의 원 논문' },
          { label: 'Decoupled Weight Decay Regularization', href: 'https://openreview.net/forum?id=Bkg6RiCqY7', note: 'AdamW가 L2 regularization과 weight decay를 분리한 이유' },
          { label: 'PyTorch · Optimizer', href: 'https://docs.pytorch.org/docs/stable/optim.html', note: 'optimizer state, parameter group, scheduler의 공식 API' },
        ]}
      />
    </section>
  );
}
