import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { QuestionLead } from '@/components/learning/ArticleLearning';

const clean = Array.from({ length: 64 }, (_, index) => {
  const row = globalThis.Math.floor(index / 8);
  const column = index % 8;
  const inside = (row >= 2 && row <= 5 && column >= 2 && column <= 5) || row === column || row + column === 7;
  return inside ? 0.9 : -0.75;
});
const fixedNoise = Array.from({ length: 64 }, (_, index) => globalThis.Math.sin(index * 12.9898 + 3.7));

function PixelGrid({ values, label }: { values: number[]; label: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-center text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="mx-auto grid aspect-square w-full max-w-56 grid-cols-8 overflow-hidden rounded-md border border-border bg-white dark:bg-black">
        {values.map((value, index) => {
          const normalized = globalThis.Math.max(0, globalThis.Math.min(1, (value + 1.5) / 3));
          const channel = globalThis.Math.round(normalized * 255);
          return <span key={index} style={{ backgroundColor: `rgb(${channel},${channel},${channel})` }} />;
        })}
      </div>
    </div>
  );
}

function ForwardExplorer() {
  const [timestep, setTimestep] = useState(260);
  const alphaBar = globalThis.Math.exp(-4.6 * timestep / 1000);
  const signal = globalThis.Math.sqrt(alphaBar);
  const noise = globalThis.Math.sqrt(1 - alphaBar);
  const noisy = clean.map((value, index) => signal * value + noise * fixedNoise[index]);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <label htmlFor="diffusion-timestep" className="block text-xs font-semibold text-muted-foreground">timestep t · {timestep}/1000<input id="diffusion-timestep" type="range" min="0" max="1000" step="10" value={timestep} onChange={(event) => setTimestep(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <PixelGrid values={clean} label="clean x₀" />
          <PixelGrid values={noisy} label={`noisy xₜ · t=${timestep}`} />
        </div>
        <div className="mt-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[['누적 signal ᾱt', alphaBar.toFixed(3)], ['signal coefficient', signal.toFixed(3)], ['noise coefficient', noise.toFixed(3)]].map(([term, value]) => <div key={term} className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">{term}</p><p className="mt-1 font-mono text-xl font-bold">{value}</p></div>)}
        </div>
      </div>
    </div>
  );
}

export default function ForwardNoising() {
  return (
    <section id="forward" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Forward는 임의 timestep의 noisy sample을 한 번에 만든다</h2>
      <QuestionLead
        question="xₜ를 만들기 위해 x₁, x₂, …, xₜ₋₁을 실제로 모두 계산해야 할까?"
        answer="Gaussian transition의 누적곱 ᾱt를 사용하면 x₀와 하나의 noise ε만으로 임의 timestep xₜ를 직접 sample할 수 있다. 그래서 학습 batch마다 random t를 뽑아 한 번의 network forward로 학습한다."
      />
      <ForwardExplorer />
      <div className="not-prose my-6 space-y-2">
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
          <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\alpha_t=1-\beta_t`}</MathFormula></div>
          <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\bar\alpha_t=\prod_{s=1}^{t}\alpha_s`}</MathFormula></div>
        </div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\,\epsilon`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="xₜ는 clean signal과 standard Gaussian noise의 선형 결합이다. ᾱt가 1에 가까우면 원본이 대부분 남고 0에 가까우면 noise가 지배한다. 두 coefficient의 제곱합은 1이라 scale이 통제된다."
        symbols={[
          ['βt', '한 forward step에서 새로 추가할 작은 noise variance'],
          ['αt', '한 step 뒤 유지되는 signal 비율'],
          ['α-bar-t', '0부터 t까지 누적해서 남은 signal 비율'],
          ['ε', '학습 코드가 직접 sample하므로 정답으로 알고 있는 standard Gaussian noise'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Schedule은 timestep 번호가 아니라 SNR을 설계한다</h3>
        <p>
          Linear beta, cosine schedule 같은 이름보다 각 t에서 signal-to-noise ratio가 어떻게 변하는지 보는 편이 정확하다. 특정
          구간에 학습 예제가 몰리거나 signal이 너무 빨리 사라지면 모델이 쉬운 noise level만 잘 맞힐 수 있다. 현대 구현은
          log-SNR이나 sigma 좌표로 schedule과 sampling weight를 표현하기도 한다.
        </p>
      </div>
    </section>
  );
}
