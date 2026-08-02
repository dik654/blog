import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception, QuestionLead } from '@/components/learning/ArticleLearning';
import { useArticleTabs } from '@/components/learning/useArticleTabs';

type RouteKey = 'vae' | 'flow';

const routes: Record<RouteKey, { label: string; stages: Array<[string, string]>; strength: string; cost: string }> = {
  vae: {
    label: 'VAE · approximate likelihood',
    stages: [['x', '관측 데이터'], ['qφ(z|x)', '근사 posterior'], ['z', '확률적 code'], ['pθ(x|z)', 'decoder likelihood']],
    strength: '가벼운 encoder로 posterior를 한 번에 추론하고 latent interpolation이 쉽다.',
    cost: '진짜 posterior 대신 근사분포를 쓰므로 evidence의 lower bound를 최적화한다.',
  },
  flow: {
    label: 'Flow · exact likelihood',
    stages: [['z₀', '단순 base 분포'], ['f₁', '가역 변환'], ['f₂', '가역 변환'], ['x', '복잡한 데이터']],
    strength: 'change of variables로 exact likelihood와 정확한 역변환을 계산한다.',
    cost: '모든 변환이 가역이고 Jacobian determinant가 계산 가능해야 한다.',
  },
};

function LatentRouteExplorer() {
  const [route, setRoute] = useState<RouteKey>('vae');
  const selected = routes[route];
  const routeKeys = Object.keys(routes) as RouteKey[];
  const { getTabProps, panelProps } = useArticleTabs({ keys: routeKeys, value: route, onChange: setRoute });

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-2 border-b border-border bg-muted/20" role="tablist" aria-label="잠재 변수 모델 비교">
        {routeKeys.map((key, index) => (
          <button key={key} type="button" {...getTabProps(key, index)} className={`min-h-12 border-b-2 px-3 text-xs font-bold sm:text-sm ${route === key ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>
            {key === 'vae' ? 'VAE' : 'Normalizing Flow'}
          </button>
        ))}
      </div>
      <div {...panelProps} className="p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-6">
        <p className="mb-4 text-sm font-bold">{selected.label}</p>
        <div className="grid items-center gap-2 lg:grid-cols-[1fr_1.5rem_1fr_1.5rem_1fr_1.5rem_1fr]">
          {selected.stages.map(([symbol, description], index) => (
            <div key={`${route}-${symbol}`} className="contents">
              <div className={`min-w-0 rounded-md border p-3 text-center ${(route === 'vae' && index === 2) || (route === 'flow' && index > 0 && index < 3) ? 'border-blue-500/40 bg-blue-500/5' : 'border-border'}`}>
                <p className="break-words font-mono text-sm font-bold">{symbol}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
              {index < selected.stages.length - 1 && <div className="flex justify-center text-muted-foreground"><ArrowDown className="size-4 lg:hidden" aria-hidden="true" /><ArrowRight className="hidden size-4 lg:block" aria-hidden="true" /></div>}
            </div>
          ))}
        </div>
        <dl className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="bg-background p-4"><dt className="text-xs font-bold text-emerald-700 dark:text-emerald-300">얻는 것</dt><dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{selected.strength}</dd></div>
          <div className="bg-background p-4"><dt className="text-xs font-bold text-amber-700 dark:text-amber-300">지불하는 제약</dt><dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{selected.cost}</dd></div>
        </dl>
      </div>
    </div>
  );
}

export default function LatentRoute() {
  return (
    <section id="latent" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">관측되지 않은 latent variable은 왜 필요한가?</h2>
      <QuestionLead
        question="픽셀 분포가 너무 복잡하면 더 단순한 숨은 원인 z를 거쳐 x를 설명할 수 있을까?"
        answer="VAE는 숨은 원인 z를 둔 뒤 계산하기 어려운 posterior p(z|x)를 encoder로 근사한다. Flow는 같은 posterior를 근사하는 모델이 아니다. z와 x를 가역 변환으로 1:1 대응시켜 posterior 적분 자체가 필요 없는 구조를 택한다."
      />
      <LatentRouteExplorer />
      <div className="not-prose my-6 space-y-2">
        <h3 className="text-sm font-bold text-muted-foreground">VAE · 숨은 변수를 적분하고 posterior를 근사한다</h3>
        <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`p_\theta(x)=\int p(z)\,p_\theta(x\mid z)\,dz`}</MathFormula></div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
          <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\mathcal L_{rec}=\mathbb E_q[\log p_\theta(x\mid z)]`}</MathFormula></div>
          <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\mathcal L_{KL}=D_{KL}(q_\phi(z\mid x)\Vert p(z))`}</MathFormula></div>
        </div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\log p_\theta(x)\geq\mathcal L_{rec}-\mathcal L_{KL}`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="VAE는 어려운 posterior p(z|x)를 encoder qφ(z|x)로 근사한다. 첫 항은 z가 x를 복원하게 한다. KL divergence는 D_KL(q∥p)=E_q[log(q/p)]로, q에서 자주 나오는 위치가 p보다 얼마나 과하게 집중됐는지 q 기준으로 재는 0 이상의 비대칭 거리다. 그래서 code 분포가 공통 prior에서 너무 멀어지지 않게 해 빈 공간에서도 sampling할 수 있게 한다."
        symbols={[
          ['p(z)', '생성할 때 직접 sample할 수 있는 단순한 prior'],
          ['pθ(x|z)', 'latent에서 관측 데이터를 생성하는 decoder likelihood'],
          ['qφ(z|x)', 'x에서 latent posterior를 근사하는 encoder'],
          ['D_{KL}(q\Vert p)', 'q를 기준으로 log(q/p)를 평균한 비대칭 분포 차이; 같으면 0'],
          ['ELBO', '직접 계산하기 어려운 log evidence의 학습 가능한 lower bound'],
        ]}
      />
      <div className="not-prose my-6 space-y-2">
        <h3 className="text-sm font-bold text-muted-foreground">Flow · 가역 변환으로 정확한 밀도를 계산한다</h3>
        <div className="min-w-0 rounded-md border border-emerald-500/35 bg-emerald-500/5 p-3">
          <MathFormula display className="my-0 text-[11px] sm:text-base">
            {String.raw`\underbrace{\log p_\theta(x)}_{\text{데이터 로그밀도}}=
\underbrace{\log p(z)}_{\text{기준 분포}}+
\underbrace{\log\left|\det\frac{\partial f_\theta^{-1}(x)}{\partial x}\right|}_{\text{가역 변환의 부피 보정}}`}
          </MathFormula>
        </div>
      </div>
      <FormulaNote
        meaning="Flow는 x=fθ(z)를 되돌려 z=fθ⁻¹(x)를 정확히 찾는다. 변환이 공간을 늘리거나 줄인 만큼 Jacobian determinant로 밀도를 보정하므로, encoder로 posterior를 근사하지 않고도 log likelihood를 직접 계산할 수 있다."
        symbols={[
          [String.raw`f_\theta^{-1}(x)`, '관측 x를 기준 분포의 좌표 z로 되돌리는 정확한 역변환'],
          [String.raw`p(z)`, '밀도를 바로 계산할 수 있는 단순한 기준 분포'],
          ['Jacobian determinant', '변환이 국소 부피를 얼마나 늘리거나 줄였는지 나타내는 보정값'],
        ]}
      />
      <Misconception>
        Latent 차원이 작다고 자동으로 의미가 분리되지는 않는다. Objective와 데이터가 어떤 변화 요인을 구분하도록 만들지 결정하며, disentanglement에는 추가 가정이나 supervision이 필요하다.
      </Misconception>
    </section>
  );
}
