import StepViz from "@/components/ui/step-viz";
import { STEPS, CURVE } from "./crossEntropyData";

function point([probability, loss]: [number, number]) {
  return { x: 8 + probability * 284, y: 150 - (loss / 4.2) * 138 };
}

export default function CrossEntropyViz() {
  const curve = CURVE.map((entry) => {
    const { x, y } = point(entry);
    return `${x},${y}`;
  }).join(" ");
  const current = point([0.09, 2.41]);
  const perfect = point([1, 0]);

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="grid w-full max-w-4xl gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(14rem,0.65fr)] md:items-center">
          <section className="min-w-0">
            <div className="grid grid-cols-[1rem_minmax(0,1fr)] gap-3">
              <span className="self-center text-[10px] font-semibold text-muted-foreground [writing-mode:vertical-rl] rotate-180">−LOG(P)</span>
              <div className="min-w-0">
                <svg viewBox="0 0 300 158" className="block h-auto w-full" aria-label="정답 확률에 따른 negative log loss 곡선">
                  <line x1="8" y1="150" x2="296" y2="150" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8" />
                  <line x1="8" y1="8" x2="8" y2="150" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8" />
                  <polyline points={curve} fill="none" stroke="#8b5cf6" strokeWidth="1.2" />
                  {step >= 1 && <><line x1={current.x} y1={current.y} x2={current.x} y2="150" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 4" /><circle cx={current.x} cy={current.y} r="3.5" fill="var(--background)" stroke="#ef4444" strokeWidth="1.1" /></>}
                  {step >= 2 && <circle cx={perfect.x} cy={perfect.y} r="3.5" fill="var(--background)" stroke="#10b981" strokeWidth="1.1" />}
                </svg>
                <div className="mt-1 flex justify-between text-[9px] text-muted-foreground"><span>정답 확률 0</span><span>정답 확률 1</span></div>
              </div>
            </div>
          </section>

          <section className="min-w-0 border-t border-border/60 pt-6 md:border-l md:border-t-0 md:pl-7 md:pt-0">
            {step === 0 && <><p className="text-xs font-bold text-violet-600 dark:text-violet-300">곡선의 모양</p><p className="mt-3 text-sm font-semibold leading-6">확신 있게 틀릴수록 loss가 빠르게 커집니다.</p><p className="mt-2 text-xs leading-5 text-muted-foreground">−log(p)는 p=1에서 0이고 p가 0에 가까워질수록 발산합니다. 확률 0을 그대로 넣지 않도록 logits 기반 fused 구현을 사용합니다.</p></>}
            {step === 1 && <><p className="text-xs font-bold text-rose-600 dark:text-rose-300">현재 예측 · p=0.09</p><p className="mt-3 font-mono text-2xl font-bold">L ≈ 2.41</p><p className="mt-2 text-xs leading-5 text-muted-foreground">정답 class에 9%만 배정했으므로 큰 correction signal이 필요합니다.</p></>}
            {step === 2 && <><p className="text-xs font-bold text-emerald-600 dark:text-emerald-300">이상적인 예측 · p=1</p><p className="mt-3 font-mono text-2xl font-bold">L = 0</p><p className="mt-2 text-xs leading-5 text-muted-foreground">정답에 probability mass를 모두 배정하면 추가로 줄일 negative log-likelihood가 없습니다.</p></>}
          </section>
        </div>
      )}
    </StepViz>
  );
}
