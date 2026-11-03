import StepViz, { type StepDef } from "@/components/ui/step-viz";

const STEPS: readonly StepDef[] = [
  {
    label: "배열의 숫자보다 먼저 표현 이름을 확인한다",
    tabLabel: "typed artifact",
    body: "[1,2,3]이라는 bytes만으로는 coefficient인지 evaluation인지 알 수 없습니다. field·form·domain·order·generation을 함께 고정합니다.",
  },
  {
    label: "Coefficient를 twist해 coset 평가 입력으로 만든다",
    tabLabel: "coset twist",
    body: "f=1+2X, g=3이면 coefficient (1,2)에 g의 거듭제곱을 곱해 (1,6)을 만듭니다. 이 배열을 ω-domain에서 NTT하면 f(3ωʲ)가 됩니다.",
  },
  {
    label: "Evaluation form에서 pointwise 연산한다",
    tabLabel: "evaluation 작업",
    body: "같은 domain과 order의 evaluation끼리 곱하면 polynomial convolution에 대응합니다. 다른 domain·order의 배열을 섞으면 길이가 같아도 의미가 틀립니다.",
  },
  {
    label: "Coefficient로 돌아와 순차 recurrence를 지킨다",
    tabLabel: "Horner와 나눗셈",
    body: "f=1+2X+3X², z=2이면 Horner는 3→8→17 순서로 진행합니다. Synthetic division은 q=8+3X와 remainder 17을 만들며 앞 accumulator가 끝나야 다음 값을 계산할 수 있습니다.",
  },
  {
    label: "표현과 정답이 맞은 결과만 처리량에 센다",
    tabLabel: "release gate",
    body: "Batch 4, job당 1,024개, kernel 2ms이면 2,048,000 element/s입니다. 전송·sync·fallback을 포함한 end-to-end speedup은 별도로 계산합니다.",
  },
] as const;

function DownArrow() {
  return <span aria-hidden className="mx-auto grid h-8 w-8 place-items-center text-xl text-primary/70">↓</span>;
}

function Scene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="w-full max-w-2xl space-y-4 text-center">
        <div className="mx-auto flex max-w-sm justify-center gap-2 rounded-xl border-2 border-primary/30 bg-primary/5 p-4 text-lg font-black"><span>[1, 2, 3]</span><span className="text-muted-foreground">bytes</span></div>
        <p className="text-xs font-semibold text-rose-600 dark:text-rose-300">이것만으로는 의미를 모릅니다</p>
        <DownArrow />
        <div className="flex flex-wrap justify-center gap-2">
          {["field F", "form coefficient", "N=4", "domain Ω", "natural order", "generation 7"].map((tag) => <span key={tag} className="rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-semibold">{tag}</span>)}
        </div>
        <p className="text-xs leading-5 text-muted-foreground">Metadata와 payload digest를 묶은 identity가 kernel의 허용 입력을 정합니다.</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="w-full max-w-xl space-y-3 text-center">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-sky-300 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950/30"><p className="text-[10px] text-muted-foreground">f(X)=1+2X</p><strong>coeff (1, 2)</strong></div>
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30"><p className="text-[10px] text-muted-foreground">coset generator</p><strong>g = 3</strong></div>
        </div>
        <DownArrow />
        <div className="rounded-xl border-2 border-violet-300 bg-violet-50 px-4 py-3 dark:border-violet-800 dark:bg-violet-950/30"><p className="text-xs text-muted-foreground">aᵢ × gⁱ</p><strong className="text-lg">(1×1, 2×3) = (1, 6)</strong></div>
        <DownArrow />
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30"><strong>NTT on Ω</strong><p className="mt-1 text-xs text-muted-foreground">→ f(3ω⁰), f(3ω¹), …</p></div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="w-full max-w-2xl space-y-4 text-center">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <div className="rounded-xl border border-sky-300 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950/30"><p className="text-[10px] text-muted-foreground">f on gΩ</p><strong>[f₀ f₁ f₂ f₃]</strong></div>
          <span className="text-lg font-bold text-primary">×</span>
          <div className="rounded-xl border border-violet-300 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/30"><p className="text-[10px] text-muted-foreground">h on same gΩ</p><strong>[h₀ h₁ h₂ h₃]</strong></div>
        </div>
        <DownArrow />
        <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
          {[0,1,2,3].map((i) => <span key={i} className="grid h-12 place-items-center border-r border-current/15 text-xs font-bold last:border-r-0">f{i}h{i}</span>)}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <p className="rounded-lg border border-emerald-300 p-3"><strong>같은 domain·order</strong><span className="mt-1 block text-muted-foreground">INTT 뒤 convolution 의미</span></p>
          <p className="rounded-lg border border-rose-300 p-3"><strong>다른 domain·order</strong><span className="mt-1 block text-muted-foreground">길이 같아도 즉시 거부</span></p>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="w-full max-w-2xl space-y-4 text-center">
        <p className="text-xs font-semibold text-primary">f=1+2X+3X² · z=2</p>
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          {["h₂=3", "h₁=3×2+2=8", "h₀=8×2+1=17"].map((value, index) => <div key={value} className="flex flex-col items-center gap-2 sm:flex-row"><span className="rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm font-bold">{value}</span>{index<2 ? <><span aria-hidden className="text-primary sm:hidden">↓</span><span aria-hidden className="hidden text-primary sm:inline">→</span></> : null}</div>)}
        </div>
        <div className="mx-auto h-6 w-px bg-border" />
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-violet-300 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/30"><p className="text-[10px] text-muted-foreground">synthetic quotient</p><strong>q(X)=8+3X</strong></div>
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30"><p className="text-[10px] text-muted-foreground">remainder=f(2)</p><strong>r=17</strong></div>
        </div>
        <p className="text-xs text-muted-foreground">(X−2)(3X+8)+17 = f(X)로 다시 검산합니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4 text-center">
      <div className="grid grid-cols-3 gap-2">
        {[["batch","4"],["valid/job","1,024"],["kernel","2ms"]].map(([label,value]) => <div key={label} className="rounded-xl border border-border bg-muted/15 p-3"><strong className="block text-lg">{value}</strong><span className="text-[10px] text-muted-foreground">{label}</span></div>)}
      </div>
      <p className="text-lg font-black text-primary">4 × 1,024 ÷ 0.002 = 2,048,000 element/s</p>
      <div className="grid gap-2 text-left text-xs sm:grid-cols-3">
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30"><strong>form·domain</strong><span className="mt-1 block text-muted-foreground">wrong tag 거부</span></div>
        <div className="rounded-lg border border-sky-300 bg-sky-50 p-3 dark:border-sky-800 dark:bg-sky-950/30"><strong>identity</strong><span className="mt-1 block text-muted-foreground">round trip·remainder</span></div>
        <div className="rounded-lg border border-violet-300 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-950/30"><strong>end-to-end</strong><span className="mt-1 block text-muted-foreground">transfer·sync·fallback</span></div>
      </div>
    </div>
  );
}

export function ModernPolyOpsViz() {
  return <StepViz steps={STEPS}>{(step) => <Scene step={step} />}</StepViz>;
}
