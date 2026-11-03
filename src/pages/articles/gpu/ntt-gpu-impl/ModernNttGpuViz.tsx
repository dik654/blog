import StepViz, { type StepDef } from "@/components/ui/step-viz";

const STEPS: readonly StepDef[] = [
  {
    label: "먼저 같은 transform인지 receipt를 고정한다",
    tabLabel: "입력 계약",
    body: "배열 길이만 같아서는 부족합니다. field·N·root/domain·direction·order·coset·normalization·backend SHA가 같아야 같은 계산입니다.",
  },
  {
    label: "Thread 하나가 겹치지 않는 pair 하나를 맡는다",
    tabLabel: "thread pair",
    body: "N=8, stage s=1에서 t=3이면 h=2, j=1, g=1이므로 indices (5,7)을 읽고 씁니다.",
  },
  {
    label: "Twiddle을 곱해 합과 차를 함께 만든다",
    tabLabel: "butterfly",
    body: "mod 17에서 u=3, v=2, twiddle=4라면 twiddle×v=8, 두 output은 11과 12입니다. 다음 stage는 이 output이 끝날 때까지 기다립니다.",
  },
  {
    label: "배열 순서를 output 계약에 맞춘다",
    tabLabel: "bit reversal",
    body: "N=8에서는 3비트 index를 뒤집습니다. 3=011₂는 110₂=6으로 갑니다. CT·GS 선택에 따라 별도 pass 위치가 달라져도 order tag는 남겨야 합니다.",
  },
  {
    label: "정답을 통과한 뒤 실제 traffic을 잰다",
    tabLabel: "release gate",
    body: "N=8, field element 32B, radix-2 세 global stages라면 요청 traffic 상한은 2×8×32×3=1,536B입니다. Fused tile은 이보다 줄 수 있어 profiler actual bytes를 따로 기록합니다.",
  },
] as const;

function DownArrow() {
  return <span aria-hidden className="mx-auto grid h-8 w-8 place-items-center text-xl text-primary/70">↓</span>;
}

function Scene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="w-full max-w-2xl space-y-4 text-center">
        <div className="flex flex-wrap justify-center gap-2">
          {["field F₁₇", "N=8", "forward", "natural input", "coset off", "SHA pinned"].map((tag) => <span key={tag} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold">{tag}</span>)}
        </div>
        <DownArrow />
        <div className="grid grid-cols-8 overflow-hidden rounded-xl border border-border bg-muted/20">
          {[0,1,2,3,4,5,6,7].map((n) => <span key={n} className="grid h-11 place-items-center border-r border-border text-xs font-bold last:border-r-0">x{n}</span>)}
        </div>
        <p className="text-xs leading-5 text-muted-foreground">이 receipt가 output의 의미와 비교 기준을 고정합니다.</p>
      </div>
    );
  }

  if (step === 1) {
    const pairs = [[0,2],[1,3],[4,6],[5,7]];
    return (
      <div className="w-full max-w-2xl space-y-4 text-center">
        <p className="text-xs font-semibold text-primary">stage s=1 · h=2 · N/2=4 threads</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {pairs.map(([a,b], t) => <div key={t} className={`rounded-xl border p-3 ${t===3 ? "border-primary bg-primary/5" : "border-border bg-muted/15"}`}><p className="text-[10px] text-muted-foreground">thread t={t}</p><strong className="mt-2 block text-sm">({a}, {b})</strong></div>)}
        </div>
        <div className="mx-auto max-w-sm rounded-xl border border-dashed border-primary/40 px-4 py-3 text-xs leading-5"><strong>t=3</strong><br />j=3 mod 2=1 · g=floor(3/2)=1<br />pair=(2·2·1+1, +2)=(5,7)</div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="w-full max-w-xl space-y-4 text-center">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <div className="rounded-xl border border-sky-300 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950/30"><p className="text-[10px] text-muted-foreground">첫 입력</p><strong>u = 3</strong></div>
          <span className="text-lg text-primary">±</span>
          <div className="rounded-xl border border-violet-300 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/30"><p className="text-[10px] text-muted-foreground">둘째×twiddle</p><strong>4×2 = 8</strong></div>
        </div>
        <DownArrow />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30"><p className="text-[10px] text-muted-foreground">합</p><strong>3+8 = 11</strong></div>
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30"><p className="text-[10px] text-muted-foreground">차 mod 17</p><strong>3−8 = 12</strong></div>
        </div>
        <p className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">stage output 완료 뒤 다음 stage</p>
      </div>
    );
  }

  if (step === 3) {
    const order = [0,4,2,6,1,5,3,7];
    return (
      <div className="w-full max-w-2xl space-y-5 text-center">
        <p className="text-xs font-semibold text-primary">3비트 index 뒤집기</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {order.map((to, from) => <div key={from} className={from===3 ? "rounded-lg border-2 border-primary bg-primary/5 p-2" : "rounded-lg border border-border bg-muted/15 p-2"}><span className="block text-[10px] text-muted-foreground">{from.toString(2).padStart(3,"0")}</span><span className="my-1 block text-xs text-primary">↓</span><strong className="text-xs">{to.toString(2).padStart(3,"0")}</strong></div>)}
        </div>
        <p className="text-sm font-bold">index 3: 011₂ → 110₂ = 6</p>
        <p className="text-xs leading-5 text-muted-foreground">Permutation pass를 fusion으로 없애더라도 output이 natural order인지 bit-reversed order인지는 API 계약에 남습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4 text-center">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[["read + write","2"],["elements","8"],["bytes","32"],["stages","3"]].map(([label,value]) => <div key={label} className="rounded-xl border border-border bg-muted/15 p-3"><strong className="block text-lg">{value}</strong><span className="whitespace-nowrap text-[10px] text-muted-foreground">{label}</span></div>)}
      </div>
      <p className="text-lg font-black text-primary">2 × 8 × 32 × 3 = 1,536B</p>
      <div className="grid gap-2 text-left text-xs sm:grid-cols-3">
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30"><strong>정답</strong><span className="mt-1 block text-muted-foreground">DFT·round trip·convolution</span></div>
        <div className="rounded-lg border border-sky-300 bg-sky-50 p-3 dark:border-sky-800 dark:bg-sky-950/30"><strong>traffic</strong><span className="mt-1 block text-muted-foreground">requested와 actual 분리</span></div>
        <div className="rounded-lg border border-violet-300 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-950/30"><strong>시간</strong><span className="mt-1 block text-muted-foreground">warm median·p95·E2E</span></div>
      </div>
    </div>
  );
}

export function ModernNttGpuViz() {
  return <StepViz steps={STEPS}>{(step) => <Scene step={step} />}</StepViz>;
}
