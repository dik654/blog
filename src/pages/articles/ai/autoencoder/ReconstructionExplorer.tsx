import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

function sigmoid(value: number) {
  return 1 / (1 + globalThis.Math.exp(-value));
}

function ValueBar({ label, value, tone = 'bg-teal-700' }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-semibold">{label}</span><span className="font-mono font-bold">{value.toFixed(3)}</span></div>
      <div className="h-2 overflow-hidden rounded-sm bg-muted"><div className={`h-full transition-[width] duration-300 ${tone}`} style={{ width: `${value * 100}%` }} /></div>
    </div>
  );
}

function Explorer() {
  const [x1, setX1] = useState(0.8);
  const [x2, setX2] = useState(0.4);
  const latent = sigmoid(0.5 * x1 + 0.3 * x2);
  const reconstructed1 = sigmoid(0.6 * latent);
  const reconstructed2 = sigmoid(0.7 * latent);
  const mse = ((x1 - reconstructed1) ** 2 + (x2 - reconstructed2) ** 2) / 2;

  const stages = [
    <div key="input" className="min-w-0 rounded-md border border-teal-600/35 bg-teal-500/[0.055] p-4"><p className="mb-4 text-sm font-bold text-teal-800 dark:text-teal-300">01 · 입력 x</p><div className="space-y-4"><ValueBar label="x₁" value={x1} /><ValueBar label="x₂" value={x2} /></div></div>,
    <div key="latent" className="min-w-0 rounded-md border border-violet-500/40 bg-violet-500/[0.065] p-4"><p className="mb-4 text-sm font-bold text-violet-800 dark:text-violet-300">02 · latent z</p><ValueBar label="z" value={latent} tone="bg-violet-600" /><p className="mt-4 text-xs leading-relaxed text-muted-foreground">2개 값을 1개 code로 압축</p></div>,
    <div key="output" className="min-w-0 rounded-md border border-sky-500/40 bg-sky-500/[0.055] p-4"><p className="mb-4 text-sm font-bold text-sky-800 dark:text-sky-300">03 · 복원 x̂</p><div className="space-y-4"><ValueBar label="x̂₁" value={reconstructed1} tone="bg-sky-600" /><ValueBar label="x̂₂" value={reconstructed2} tone="bg-sky-600" /></div></div>,
  ];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6">
        <label className="block text-xs font-semibold text-muted-foreground" htmlFor="ae-x1">입력 x₁ · {x1.toFixed(2)}<input id="ae-x1" type="range" min="0" max="1" step="0.01" value={x1} onChange={(event) => setX1(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
        <label className="block text-xs font-semibold text-muted-foreground" htmlFor="ae-x2">입력 x₂ · {x2.toFixed(2)}<input id="ae-x2" type="range" min="0" max="1" step="0.01" value={x2} onChange={(event) => setX2(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)]">
          {stages.map((stage, index) => (
            <div key={stage.key} className="contents">{stage}{index < stages.length - 1 && <div className="flex justify-center text-muted-foreground"><ArrowDown className="size-4 lg:hidden" aria-hidden="true" /><ArrowRight className="hidden size-4 lg:block" aria-hidden="true" /></div>}</div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 rounded-md border border-rose-500/30 bg-rose-500/[0.045] p-4 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center">
          <p className="text-xs leading-relaxed text-muted-foreground">현재 weight는 고정되어 있다. 학습 전에는 입력이 달라져도 reconstruction이 0.5 근처에 모이며 오차가 남는다.</p>
          <div><p className="text-xs font-semibold text-muted-foreground">MSE</p><p className="mt-1 font-mono text-2xl font-bold">{mse.toFixed(4)}</p></div>
        </div>
      </div>
    </div>
  );
}

export default function ReconstructionExplorer() {
  return (
    <section id="forward-example" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2차원 입력을 1차원 code로 복원해 보면?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          가장 작은 오토인코더에서 입력 두 개를 latent 값 하나로 압축한다. Encoder weight는 [0.5, 0.3], decoder weight는
          [0.6, 0.7]로 고정했다. 입력 slider를 움직이면 같은 code 하나가 두 출력으로 다시 펼쳐질 때 어떤 정보가
          손실되는지 볼 수 있다.
        </p>
      </div>
      <Explorer />
      <div className="not-prose my-6 space-y-2">
        <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`z=\underbrace{\sigma\!\left(0.5x_1+0.3x_2\right)}_{\text{두 입력을 하나의 code로 압축}}`}</MathFormula></div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
          <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\hat x_1=\underbrace{\sigma(0.6z)}_{\text{code에서 첫 좌표 복원}}`}</MathFormula></div>
          <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\hat x_2=\underbrace{\sigma(0.7z)}_{\text{code에서 둘째 좌표 복원}}`}</MathFormula></div>
        </div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal{L}_{MSE}=\underbrace{\frac{(x_1-\hat x_1)^2+(x_2-\hat x_2)^2}{2}}_{\text{좌표별 복원 오차를 제곱해 평균}}`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="한 샘플의 forward는 신경망 글에서 배운 affine transform과 activation의 반복이다. 차이는 중간층 z를 의도적으로 좁히고 마지막 target을 입력 x로 둔다는 점이다."
        symbols={[
          [String.raw`\sigma`, '0~1 범위 출력을 만드는 sigmoid activation'],
          [String.raw`z`, '두 입력을 요약한 1차원 latent code'],
          [String.raw`\hat x`, 'decoder가 만든 두 차원의 reconstruction'],
          [String.raw`\mathcal{L}_{MSE}`, '각 차원의 제곱 오차를 평균한 reconstruction loss'],
        ]}
      />
    </section>
  );
}
