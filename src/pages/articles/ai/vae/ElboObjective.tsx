import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { QuestionLead } from '@/components/learning/ArticleLearning';

function ElboBalance() {
  const [beta, setBeta] = useState(1);
  const reconstruction = 0.24;
  const kl = 0.38;
  const total = reconstruction + beta * kl;
  const recShare = reconstruction / globalThis.Math.max(total, 0.001);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <label htmlFor="vae-beta" className="block text-xs font-semibold text-muted-foreground">KL weight β · {beta.toFixed(2)}<input id="vae-beta" type="range" min="0" max="2" step="0.05" value={beta} onChange={(event) => setBeta(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex h-8 overflow-hidden rounded-sm border border-border" aria-label="전체 loss에서 reconstruction과 KL 항의 비율">
          <div className="flex min-w-0 items-center justify-center bg-blue-600 px-2 text-[10px] font-bold text-white" style={{ width: `${recShare * 100}%` }}>{recShare > 0.25 ? 'reconstruction' : ''}</div>
          <div className="flex min-w-0 items-center justify-center bg-amber-500 px-2 text-[10px] font-bold text-black" style={{ width: `${(1 - recShare) * 100}%` }}>{1 - recShare > 0.25 ? 'β · KL' : ''}</div>
        </div>
        <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[['reconstruction', reconstruction.toFixed(3)], ['β · KL', (beta * kl).toFixed(3)], ['total loss', total.toFixed(3)]].map(([label, value]) => <div key={label} className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-1 font-mono text-xl font-bold">{value}</p></div>)}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">β가 0이면 일반 stochastic autoencoder에 가까워지고 prior의 빈 공간을 제어하지 못한다. 너무 크면 모든 posterior가 prior에 붙으며 decoder가 x의 정보를 받지 못할 수 있다.</p>
      </div>
    </div>
  );
}

export default function ElboObjective() {
  return (
    <section id="elbo" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ELBO는 복원과 분포 정렬을 왜 함께 묶을까?</h2>
      <QuestionLead
        question="계산할 수 없는 log pθ(x)를 직접 최대화하지 않고도 likelihood 모델을 학습할 수 있을까?"
        answer="근사 posterior qφ를 도입하면 log evidence를 ELBO와 음이 아닌 posterior gap으로 분해할 수 있다. ELBO를 높이면 evidence의 lower bound가 올라가고 qφ도 진짜 posterior에 가까워진다."
      />
      <div className="not-prose my-6 space-y-2">
        <div className="min-w-0 rounded-md border border-border p-3">
          <p className="mb-2 text-xs font-bold text-muted-foreground">Evidence decomposition</p>
          <MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\log p_\theta(x)=\mathrm{ELBO}(x)+\mathcal G(x)`}</MathFormula>
          <MathFormula display className="my-2 text-xs sm:text-sm">{String.raw`\mathcal G(x)=D_{KL}(q_\phi(z\mid x)\Vert p_\theta(z\mid x))`}</MathFormula>
        </div>
        <div className="min-w-0 rounded-md border border-border p-3">
          <p className="mb-2 text-xs font-bold text-muted-foreground">Lower bound</p>
          <MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathrm{ELBO}=\mathcal R(x)-\mathcal K(x)`}</MathFormula>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\mathcal R(x)=\mathbb E_q[\log p_\theta(x\mid z)]`}</MathFormula>
            <MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\mathcal K(x)=D_{KL}(q_\phi(z\mid x)\Vert p(z))`}</MathFormula>
          </div>
        </div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><p className="mb-2 text-xs font-bold text-muted-foreground">Minimization form</p><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal L_{VAE}=\mathcal L_{rec}+\beta\,D_{KL}(q_\phi(z\mid x)\Vert p(z))`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="Expected decoder log-likelihood를 최대화하는 것은 선택한 관측 분포에 맞는 reconstruction loss를 줄이는 것과 같다. KL은 입력별 posterior를 sample 가능한 prior에 정렬한다. β는 두 목표 사이의 실용적 trade-off를 조정한다."
        symbols={[
          ['ELBO', 'log evidence보다 작거나 같은 계산 가능한 목적'],
          ['reconstruction', 'Bernoulli likelihood면 BCE, Gaussian likelihood면 scale을 포함한 MSE 형태'],
          ['posterior gap', 'qφ가 진짜 pθ(z|x)와 다른 정도로, 항상 0 이상'],
          ['β', '표현 용량과 prior 정렬 강도를 조절하는 가중치'],
        ]}
      />
      <ElboBalance />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>왜 Gaussian decoder가 흐린 평균을 만들 수 있을까?</h3>
        <p>
          하나의 z에서 여러 타당한 x가 가능하지만 decoder likelihood를 고정 분산 Gaussian으로 두면 최적 평균은 가능한 결과의
          픽셀 평균이 된다. 서로 다른 경계가 평균되면 흐리게 보인다. 이는 “VAE라는 이름의 필연”이 아니라 posterior 근사,
          decoder 표현력, likelihood 가정이 함께 만든 결과다.
        </p>
      </div>
    </section>
  );
}
