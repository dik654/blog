import { useState } from 'react';
import { QuestionLead } from '@/components/learning/ArticleLearning';

const modeCenters = [70, 180, 290, 400];

function ModeCoverageExplorer() {
  const [coveredModes, setCoveredModes] = useState(1);
  const samples = Array.from({ length: 24 }, (_, index) => {
    const mode = index % coveredModes;
    const offset = ((index * 17) % 31) - 15;
    return { x: modeCenters[mode] + offset, y: 78 + ((index * 23) % 78) };
  });
  const precision = 0.94 - (coveredModes - 1) * 0.025;
  const recall = coveredModes / 4;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <label htmlFor="gan-modes" className="block text-xs font-semibold text-muted-foreground">Generator가 덮는 mode · {coveredModes}/4<input id="gan-modes" type="range" min="1" max="4" step="1" value={coveredModes} onChange={(event) => setCoveredModes(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="mb-2 grid grid-cols-4 gap-1 text-center text-xs text-muted-foreground" aria-hidden="true">
          {modeCenters.map((x, index) => <span key={x}>실제 {index + 1}</span>)}
        </div>
        <svg viewBox="0 0 470 200" role="img" aria-label={`실제 mode 4개 중 ${coveredModes}개를 덮는 generated sample`} className="block aspect-[470/200] w-full rounded-md border border-border bg-muted/10">
          {modeCenters.map((x) => <circle key={x} cx={x} cy="105" r="42" fill="#a1a1aa" opacity="0.16" />)}
          {samples.map((sample, index) => <circle key={index} cx={sample.x} cy={sample.y} r="5" fill="#2563eb" opacity="0.85" />)}
        </svg>
        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3" aria-live="polite">
          {[['precision', precision.toFixed(2)], ['recall / coverage', recall.toFixed(2)], ['missed modes', String(4 - coveredModes)]].map(([term, value]) => <div key={term} className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">{term}</p><p className="mt-1 font-mono text-xl font-bold">{value}</p></div>)}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          위 precision·recall 숫자는 mode coverage가 두 지표에 서로 다르게 나타나는 방향을 보여 주기 위한 교육용 fixture다. 실제 모델을 측정한 benchmark 결과가 아니다.
        </p>
      </div>
    </div>
  );
}

export default function FailureDiagnostics() {
  return (
    <section id="failures" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">선명한 sample 몇 개가 전체 분포를 대표하지 않는다</h2>
      <QuestionLead
        question="Generator가 한 종류의 매우 그럴듯한 이미지만 계속 만들면 loss는 낮아질 수 있을까?"
        answer="가능하다. G가 현재 D를 잘 속이는 일부 mode에 확률을 몰아도 개별 sample의 품질은 높아 보인다. 하지만 data distribution의 나머지 mode를 놓쳐 recall과 다양성이 무너진다."
      />
      <ModeCoverageExplorer />
      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {[
          ['Mode collapse', '서로 다른 z가 거의 같은 output으로 간다.', '고정 latent grid, feature-space pair distance, precision/recall을 추적한다.'],
          ['Discriminator saturation', 'D loss는 0에 가깝고 G gradient가 매우 작다.', 'Non-saturating loss, regularization, capacity·update ratio를 확인한다.'],
          ['Oscillation', 'Sample mode와 loss가 수렴하지 않고 순환한다.', 'Learning rate, TTUR, EMA generator, game dynamics를 시간축으로 본다.'],
          ['Artifact exploitation', '사람 눈에는 이상하지만 D의 특정 feature를 반복한다.', 'Data augmentation, receptive field, spectral norm, held-out critic으로 검사한다.'],
        ].map(([name, symptom, response]) => <article key={name} className="grid gap-2 py-4 sm:grid-cols-[10rem_1fr_1fr]"><h3 className="text-sm font-bold">{name}</h3><p className="text-sm leading-relaxed">{symptom}</p><p className="text-sm leading-relaxed text-muted-foreground">{response}</p></article>)}
      </div>
    </section>
  );
}
