import { useState } from 'react';
import StepViz from '@/components/ui/step-viz';

const ACTIVATIONS = [0.78, 0.46, 0.21, 0.12, 0.06, 0.03];

export function ReconstructionSparsityExplorer() {
  const [topK, setTopK] = useState(2);
  const kept = ACTIVATIONS.slice(0, topK);
  const totalEnergy = ACTIVATIONS.reduce((sum, value) => sum + value ** 2, 0);
  const keptEnergy = kept.reduce((sum, value) => sum + value ** 2, 0);
  const relativeError = Math.sqrt(Math.max(0, totalEnergy - keptEnergy) / totalEnergy);

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border" data-sae-reconstruction>
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase text-muted-foreground">Reconstruction–sparsity tradeoff</p>
          <p className="mt-2 text-base font-bold">적은 feature만 남기면 읽기 쉬워지지만 정보가 사라진다</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">이 값은 Top-K 직관을 위한 개념 예시다. 실제 SAE는 learned decoder direction의 합으로 activation을 복원한다.</p>
        </div>
        <label htmlFor="sae-top-k" className="grid grid-cols-[1fr_auto] gap-2 text-xs font-bold text-muted-foreground">
          <span>남길 feature 수</span><code className="text-foreground">K = {topK}</code>
          <input id="sae-top-k" type="range" min="1" max="6" value={topK} onChange={(event) => setTopK(Number(event.target.value))} className="col-span-2 h-11 w-full accent-emerald-600" />
        </label>
      </div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ACTIVATIONS.map((value, index) => (
            <div key={index} className={`flex h-32 min-w-0 flex-col justify-end overflow-hidden rounded-md border p-2 ${index < topK ? 'border-emerald-500/40' : 'border-border opacity-45'}`}>
              <span className="mx-auto block w-full rounded-sm bg-emerald-600/70" style={{ height: `${value * 90}px` }} />
              <p className="mt-2 text-center font-mono text-xs font-black">f{index + 1}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <output
            htmlFor="sae-top-k"
            aria-live="polite"
            aria-atomic="true"
            className="block"
            data-sae-relative-error
          >
            <span className="block font-mono text-2xl font-black">{Math.round(relativeError * 100)}%</span>
            <span className="mt-1 block text-xs font-bold text-muted-foreground">남은 상대 복원 오차</span>
          </output>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">K를 늘리면 reconstruction은 좋아진다. 그러나 더 많은 feature가 동시에 켜져 설명은 복잡해진다. “가장 희소”와 “가장 충실”은 같은 목표가 아니다.</p>
        </div>
      </div>
    </div>
  );
}

const FEATURE_STEPS = [
  { label: '1. Top activation을 모은다', body: 'Feature가 크게 켜진 token과 문맥을 모은다. 이 단계는 상관 패턴 관찰이다.' },
  { label: '2. 잠정 label을 붙인다', body: '사람이나 LLM이 공통점을 요약한다. Label은 feature의 이름이 아니라 검증할 가설이다.' },
  { label: '3. 대조 예시를 찾는다', body: '비슷한 문맥인데 feature가 꺼지거나, 다른 의미인데 켜지는 false positive를 찾는다.' },
  { label: '4. Steering과 ablation을 실행한다', body: 'Feature direction을 더하거나 제거해 output이 바뀌는지 본다. 과도한 개입은 off-distribution behavior를 만들 수 있다.' },
  { label: '5. Specificity를 확인한다', body: '목표 행동만 변했는지, unrelated task와 fluency가 함께 망가지지 않았는지 control suite로 검사한다.' },
];

export function FeatureEvidenceViz() {
  return (
    <StepViz steps={FEATURE_STEPS}>
      {(step) => {
        const labels = ['관찰', '가설', '반례', '개입', '통제'];
        return (
          <div className="w-full px-2 py-3 sm:px-4" data-sae-evidence-stage={step}>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Feature 검증 단계">
              {labels.map((label, index) => (
                <li
                  key={label}
                  aria-current={index === step ? 'step' : undefined}
                  className={`min-w-0 rounded-md border px-2 py-3 text-center ${index === step ? 'border-emerald-500/55 bg-emerald-500/[0.07]' : index < step ? 'border-foreground/25 bg-muted/20' : 'border-border'}`}
                >
                  <p className="font-mono text-xs font-black text-muted-foreground">0{index + 1}</p>
                  <p className="mt-1 text-xs font-bold">{label}</p>
                </li>
              ))}
            </ol>
            <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-live="polite" aria-atomic="true">
              <div className="rounded-md border border-border p-4"><p className="text-xs font-black text-muted-foreground">현재 얻은 것</p><p className="mt-2 text-sm font-bold">{step < 2 ? 'Feature 의미의 후보' : step < 4 ? '반례를 견딘 feature 가설' : '행동에 영향을 준다는 제한된 인과 증거'}</p></div>
              <div className="rounded-md border border-border p-4"><p className="text-xs font-black text-muted-foreground">아직 필요한 것</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step < 3 ? '개입과 negative control' : step < 4 ? '원 모델 output 변화' : '다른 prompt·task에서의 specificity와 재현'}</p></div>
            </div>
          </div>
        );
      }}
    </StepViz>
  );
}
