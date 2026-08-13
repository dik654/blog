import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "Cross-entropy: 정답 확률이 낮으면 loss가 빠르게 증가" },
  { label: "MSE: 정답과의 수치 차이를 제곱해 부드럽게 증가" },
  { label: "같은 예측 ŷ=0.09에서 두 objective의 gradient 신호 비교" },
] as const;

const probabilities = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

function pointsFor(values: number[], maximum: number) {
  return values.map((value, index) => {
    const x = 8 + (index / (values.length - 1)) * 284;
    const y = 150 - Math.min(value / maximum, 1) * 136;
    return `${x},${y}`;
  }).join(" ");
}

export default function LossViz() {
  const ce = probabilities.map((value) => -Math.log(value));
  const mse = probabilities.map((value) => (1 - value) ** 2);

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="grid w-full max-w-4xl gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(14rem,0.65fr)] md:items-center">
          <section className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
              <span className={`flex items-center gap-2 font-semibold ${step === 1 ? "opacity-25" : ""}`}><i className="h-1.5 w-5 rounded-sm bg-sky-500" />Cross-entropy</span>
              <span className={`flex items-center gap-2 font-semibold ${step === 0 ? "opacity-25" : ""}`}><i className="h-1.5 w-5 rounded-sm bg-emerald-500" />MSE</span>
            </div>
            <div className="grid grid-cols-[1rem_minmax(0,1fr)] gap-3">
              <span className="self-center text-[10px] font-semibold text-muted-foreground [writing-mode:vertical-rl] rotate-180">LOSS</span>
              <div className="min-w-0">
                <svg viewBox="0 0 300 158" className="block h-auto w-full" aria-label="정답 확률에 따른 cross-entropy와 MSE 곡선">
                  <line x1="8" y1="150" x2="296" y2="150" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8" />
                  <line x1="8" y1="8" x2="8" y2="150" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8" />
                  <polyline points={pointsFor(ce, 3)} fill="none" stroke="#0ea5e9" strokeWidth="1.2" opacity={step === 1 ? 0.16 : 0.9} />
                  <polyline points={pointsFor(mse, 1)} fill="none" stroke="#10b981" strokeWidth="1.2" opacity={step === 0 ? 0.16 : 0.9} />
                  {step === 2 && <line x1="20" y1="12" x2="20" y2="150" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="3 4" />}
                </svg>
                <div className="mt-1 flex justify-between text-[9px] text-muted-foreground"><span>정답 확률 0</span><span>정답 확률 1</span></div>
              </div>
            </div>
          </section>

          <section className="min-w-0 border-t border-border/60 pt-6 md:border-l md:border-t-0 md:pl-7 md:pt-0">
            {step === 0 && <><p className="text-xs font-bold text-sky-600 dark:text-sky-300">−log(ŷ)</p><p className="mt-3 text-sm font-semibold leading-6">낮은 정답 확률을 강하게 벌점합니다.</p><p className="mt-2 text-xs leading-5 text-muted-foreground">ŷ=0.09이면 loss는 약 2.41입니다. categorical probability model의 negative log-likelihood와 맞닿아 있습니다.</p></>}
            {step === 1 && <><p className="text-xs font-bold text-emerald-600 dark:text-emerald-300">(1−ŷ)²</p><p className="mt-3 text-sm font-semibold leading-6">수치 차이를 제곱해 대칭적으로 벌점합니다.</p><p className="mt-2 text-xs leading-5 text-muted-foreground">ŷ=0.09이면 loss는 약 0.83입니다. Gaussian noise를 둔 회귀 likelihood와 자연스럽게 연결됩니다.</p></>}
            {step === 2 && <><p className="text-xs font-bold text-primary">같은 숫자, 다른 objective</p><div className="mt-4 space-y-4"><div><div className="flex justify-between text-xs"><span>Cross-entropy</span><b className="font-mono">2.41</b></div><div className="mt-1 h-1.5 rounded-sm bg-sky-500/75" /></div><div><div className="flex justify-between text-xs"><span>MSE</span><b className="font-mono">0.83</b></div><div className="mt-1 h-1.5 w-[34%] rounded-sm bg-emerald-500/75" /></div></div><p className="mt-4 text-xs leading-5 text-muted-foreground">크기만 비교해 loss를 고르면 안 됩니다. 출력이 어떤 확률 모형을 나타내는지 먼저 정해야 합니다.</p></>}
          </section>
        </div>
      )}
    </StepViz>
  );
}
