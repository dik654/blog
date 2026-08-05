import { useMemo, useState } from 'react';
import { InternalLink, Misconception, QuestionLead } from '@/components/learning/ArticleLearning';
import { useArticleTabs } from '@/components/learning/useArticleTabs';
import SourceFormula from './SourceFormula';
import { SamplerStepLab } from './viz/DDPMSourceLabs';

type SamplerMode = 'stochastic' | 'deterministic';

function ProgressTile({ progress }: { progress: number }) {
  const cells = useMemo(() => Array.from({ length: 36 }, (_, index) => {
    const row = globalThis.Math.floor(index / 6);
    const column = index % 6;
    const clean = (row >= 1 && row <= 4 && column >= 1 && column <= 4) || row === column;
    const signal = clean ? 0.86 : 0.18;
    const noise = (globalThis.Math.sin(index * 8.17 + 2.4) + 1) / 2;
    return noise * (1 - progress) + signal * progress;
  }), [progress]);
  return <div className="grid aspect-square w-full grid-cols-6 overflow-hidden rounded-sm border border-border bg-background">{cells.map((value, index) => { const c = globalThis.Math.round(value * 255); return <span key={index} style={{ backgroundColor: `rgb(${c},${c},${c})` }} />; })}</div>;
}

function SamplerExplorer() {
  const [mode, setMode] = useState<SamplerMode>('stochastic');
  const [steps, setSteps] = useState(20);
  const checkpoints = Array.from({ length: 6 }, (_, index) => index / 5);
  const estimatedCalls = steps;
  const risk = steps < 8 ? '큰 solver 오차' : steps < 20 ? '속도·품질 절충' : '작은 step, 높은 비용';
  const samplerModes: SamplerMode[] = ['stochastic', 'deterministic'];
  const { getTabProps, panelProps } = useArticleTabs({ keys: samplerModes, value: mode, onChange: setMode });

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-2 border-b border-border bg-muted/20" role="tablist" aria-label="Diffusion sampler 유형">
        <button type="button" {...getTabProps('stochastic', 0)} className={`min-h-12 border-b-2 px-2 text-xs font-bold sm:text-sm ${mode === 'stochastic' ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>Stochastic · DDPM</button>
        <button type="button" {...getTabProps('deterministic', 1)} className={`min-h-12 border-b-2 px-2 text-xs font-bold sm:text-sm ${mode === 'deterministic' ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>Deterministic · DDIM/ODE</button>
      </div>
      <div className="border-b border-border p-4 sm:p-6">
        <label htmlFor="sampler-steps" className="block text-xs font-semibold text-muted-foreground">network evaluation 수 · {steps} steps<input id="sampler-steps" type="range" min="4" max="50" step="1" value={steps} onChange={(event) => setSteps(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div {...panelProps} className="p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-6">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {checkpoints.map((progress, index) => <div key={progress} className="min-w-0"><ProgressTile progress={progress} /><p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">{index === 0 ? 'xT' : index === 5 ? 'x0' : `${globalThis.Math.round((1 - progress) * 100)}% noise`}</p></div>)}
        </div>
        <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">경로</p><p className="mt-1 text-sm font-bold">{mode === 'stochastic' ? '매 step 새 noise η' : '같은 초기값에서 고정 경로'}</p></div>
          <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">network calls</p><p className="mt-1 font-mono text-xl font-bold">{estimatedCalls}</p></div>
          <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">현재 해석</p><p className="mt-1 text-sm font-bold">{risk}</p></div>
        </div>
      </div>
    </div>
  );
}

export default function ReverseSampling() {
  return (
    <section id="sampling" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습된 network와 sampler는 서로 다른 부품이다</h2>
      <QuestionLead
        question="DDPM Algorithm 2는 noise 예측 하나를 어떻게 실제 xₜ₋₁ update로 바꿀까?"
        answer="예측 noise에 schedule coefficient를 곱해 현재 xₜ에서 빼고, 남은 signal scale로 다시 나눈 뒤 fixed reverse variance의 Gaussian noise를 더한다. 마지막 t=1에서는 z=0으로 두어 더는 noise를 넣지 않는다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          원 논문의 baseline부터 고정한다. Network가 <code>epsilon_theta</code>를 내면 첫 번째 괄호가 reverse mean을 만든다.
          <code>beta_t / sqrt(1-alpha-bar_t)</code>는 현재 noise scale에 맞춰 예측 noise를 빼는 coefficient이고,
          <code>1 / sqrt(alpha_t)</code>는 한 forward step에서 줄었던 signal scale을 되돌린다.
        </p>
      </div>
      <SourceFormula
        latex={String.raw`\begin{aligned}
\widehat\epsilon_t&=\epsilon_\theta(x_t,t)\\
\mu_\theta(x_t,t)&=\frac{1}{\sqrt{\alpha_t}}
\left(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\widehat\epsilon_t\right)\\
z&\sim\begin{cases}\mathcal N(0,I),&t>1\\0,&t=1\end{cases}\\
x_{t-1}&=\mu_\theta(x_t,t)+\sigma_t z
\end{aligned}`}
        meaning="먼저 예측 noise를 현재 noise scale만큼 제거하고, 1/√αₜ로 한 step의 signal 축소를 되돌려 reverse mean을 만든다. t>1에서는 σₜz를 더해 Gaussian reverse distribution에서 sample한다. t=1에서는 z=0으로 두어 마지막 결과에 새 noise를 주입하지 않는다. 2020 DDPM은 σₜ²를 βₜ 또는 β̃ₜ로 고정했고 학습하지 않았다."
        symbols={[
          [String.raw`\widehat\epsilon_t`, '현재 xₜ에 섞인 noise에 대한 network 예측'],
          [String.raw`\beta_t/\sqrt{1-\bar\alpha_t}`, '예측 noise를 현재 누적 noise scale의 mean correction으로 바꾸는 coefficient'],
          [String.raw`1/\sqrt{\alpha_t}`, '직전 forward step에서 줄인 signal scale을 되돌리는 rescale'],
          [String.raw`\sigma_t z`, 'Fixed reverse variance에서 뽑는 stochastic 변화량'],
          [String.raw`t=1`, '마지막 step이라 z를 0으로 두고 mean을 그대로 반환하는 branch'],
        ]}
      />
      <SamplerStepLab />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>그 다음에야 network와 sampler를 분리한다</h3>
        <p>
          Algorithm 2는 1,000개의 모든 timestep을 순서대로 밟는 stochastic DDPM sampler다. 이후 DDIM과 ODE/SDE solver는 같은
          learned field를 다른 timestep과 update rule로 적분한다. 따라서 “같은 network를 다른 sampler에 쓴다”는 현재 관점은
          먼저 원 논문의 one-step baseline을 정확히 복원한 뒤 비교해야 한다. 여기서 field, step, local/global error와
          stability의 구분이 막히면 <InternalLink slug="differential-equations-phase-plane-numerical-integration">미분방정식과
          수치 적분</InternalLink>의 driven state·error·stability 절로 내려간다.
        </p>
      </div>
      <SamplerExplorer />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Step 수를 줄이면 왜 항상 같은 비율로 빨라지지 않을까?</h3>
        <p>
          한 step마다 network forward가 가장 큰 비용이므로 NFE 감소는 대체로 빠르다. 하지만 CFG는 conditional과 unconditional
          prediction 두 번을 요구할 수 있고, 고차 solver는 한 step에서 여러 평가를 쓸 수 있다. VAE decode, text encoder,
          memory transfer도 고정 비용이다. 따라서 latency는 sampler step 이름보다 실제 NFE와 pipeline profile로 측정한다.
        </p>
      </div>
      <Misconception>
        DDPM의 t=1에서 z=0인 것과 DDIM 전체 경로가 deterministic인 것은 다른 주장이다. 원 DDPM도 마지막 step만 noise를 끄며,
        앞 step에서는 Gaussian noise를 더한다.
      </Misconception>
    </section>
  );
}
