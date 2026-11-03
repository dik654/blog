import StepViz, { type StepDef } from "@/components/ui/step-viz";

const STEPS: readonly StepDef[] = [
  {
    label: "긴 scalar를 작은 자리로 자른다",
    tabLabel: "자릿값으로 자르기",
    body: "설명용으로 가장 낮은 3비트 자리만 봅니다. 실제 구현은 같은 일을 모든 window에 반복하고 마지막 partial window를 따로 가립니다.",
  },
  {
    label: "같은 자릿값의 점을 한 줄로 모은다",
    tabLabel: "같은 값 모으기",
    body: "같은 bucket을 여러 thread가 동시에 덮어쓰지 않도록 digit과 원래 point index를 정렬합니다.",
  },
  {
    label: "한 owner가 bucket 하나를 더한다",
    tabLabel: "bucket owner",
    body: "B1에는 P0·P3·P7, B2에는 P1·P5, B3에는 P2·P6가 들어갑니다. 값이 0인 P4는 이 window에 기여하지 않습니다.",
  },
  {
    label: "뒤에서부터 누적해 1·2·3배를 만든다",
    tabLabel: "running sum",
    body: "B3, B3+B2, B3+B2+B1을 다시 더하면 B1+2B2+3B3가 됩니다. 비싼 point scalar multiplication 없이 덧셈으로 가중치를 복원합니다.",
  },
  {
    label: "높은 window부터 자리값을 복원한다",
    tabLabel: "window 결합",
    body: "3비트 window라면 이전 결과를 세 번 doubling한 뒤 다음 window 결과를 더합니다. 이는 기수 2³의 Horner 결합입니다.",
  },
  {
    label: "정답이 같을 때만 전체 시간을 비교한다",
    tabLabel: "release gate",
    body: "2ms kernel만 보고 5배라고 부르지 않습니다. 전송·검증 5ms를 더한 7ms와 같은 경계의 CPU 10ms를 비교하면 채택 speedup은 약 1.43배입니다.",
  },
] as const;

const PAIRS = [
  ["P0", "1"], ["P1", "2"], ["P2", "3"], ["P3", "1"],
  ["P4", "0"], ["P5", "2"], ["P6", "3"], ["P7", "1"],
] as const;

const buckets = [
  { name: "B1", points: ["P0", "P3", "P7"], tone: "border-sky-300 bg-sky-50 text-sky-950 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-100" },
  { name: "B2", points: ["P1", "P5"], tone: "border-violet-300 bg-violet-50 text-violet-950 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-100" },
  { name: "B3", points: ["P2", "P6"], tone: "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100" },
] as const;

function Pair({ point, digit }: { point: string; digit: string }) {
  return (
    <span className="grid h-12 w-12 flex-none place-items-center rounded-full border border-border bg-background text-center shadow-sm">
      <span className="text-[10px] font-bold leading-none">{point}</span>
      <span className="text-[10px] leading-none text-primary">digit {digit}</span>
    </span>
  );
}

function Arrow({ down = false }: { down?: boolean }) {
  return <span aria-hidden className="mx-auto grid h-8 w-8 flex-none place-items-center text-xl font-light text-primary/70">{down ? "↓" : "→"}</span>;
}

function BucketRow({ name, points, tone }: (typeof buckets)[number]) {
  return (
    <div className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 ${tone}`}>
      <strong className="w-7 flex-none text-sm">{name}</strong>
      <span className="min-w-0 text-xs font-semibold">{points.join(" + ")}</span>
    </div>
  );
}

function Scene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="w-full space-y-5 text-center">
        <p className="text-xs font-semibold text-primary">낮은 3비트 window 하나를 확대</p>
        <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-2">
          {PAIRS.map(([point, digit]) => <Pair key={point} point={point} digit={digit} />)}
        </div>
        <p className="text-xs leading-5 text-muted-foreground">긴 scalar 전체가 아니라, 같은 자리의 digit끼리 먼저 계산표를 만듭니다.</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex flex-wrap justify-center gap-2">
          {PAIRS.filter(([, digit]) => digit !== "0").map(([point, digit]) => <Pair key={point} point={point} digit={digit} />)}
        </div>
        <Arrow down />
        <div className="grid gap-2 sm:grid-cols-3">
          {buckets.map((bucket) => <BucketRow key={bucket.name} {...bucket} />)}
        </div>
        <p className="text-center text-xs text-muted-foreground">정렬 결과가 bucket별 연속 구간과 원래 point index를 만듭니다.</p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
        {buckets.map((bucket, index) => (
          <div key={bucket.name} className={`rounded-xl border p-4 text-center ${bucket.tone}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wide">owner {index + 1}</p>
            <p className="mt-2 text-lg font-black">{bucket.name}</p>
            <div className="my-2 h-px bg-current opacity-20" />
            <p className="text-xs font-semibold leading-5">{bucket.points.join(" + ")}</p>
          </div>
        ))}
        <p className="text-center text-xs leading-5 text-muted-foreground sm:col-span-3">서로 다른 owner는 병렬로 일하지만, bucket 하나 안의 point addition 순서는 그 owner가 책임집니다.</p>
      </div>
    );
  }

  if (step === 3) {
    const rows = ["S3 = B3", "S2 = B3 + B2", "S1 = B3 + B2 + B1"];
    return (
      <div className="w-full max-w-xl space-y-3 text-center">
        <p className="text-xs font-semibold text-primary">큰 번호에서 작은 번호로</p>
        {rows.map((row, index) => (
          <div key={row} className="mx-auto flex max-w-md items-center gap-3">
            <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
            <div className="min-w-0 flex-1 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm font-bold">{row}</div>
          </div>
        ))}
        <Arrow down />
        <div className="rounded-xl border-2 border-primary/40 bg-primary/5 px-4 py-3 text-sm font-black text-primary">S1 + S2 + S3 = B1 + 2B2 + 3B3</div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          <div className="rounded-xl border border-violet-300 bg-violet-50 px-5 py-4 text-center dark:border-violet-800 dark:bg-violet-950/30"><p className="text-[10px] text-muted-foreground">높은 window</p><strong>R₁</strong></div>
          <Arrow down={true} />
          <div className="rounded-xl border border-border bg-muted/20 px-5 py-4 text-center"><p className="text-[10px] text-muted-foreground">3번 doubling</p><strong>R₁ × 2³</strong></div>
          <Arrow down={true} />
          <div className="rounded-xl border border-sky-300 bg-sky-50 px-5 py-4 text-center dark:border-sky-800 dark:bg-sky-950/30"><p className="text-[10px] text-muted-foreground">낮은 window 더하기</p><strong>+ R₀</strong></div>
        </div>
        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">실제 scalar는 이 과정을 가장 높은 window부터 가장 낮은 window까지 반복합니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className="rounded-xl border border-border bg-muted/20 p-4 text-center"><p className="text-[10px] text-muted-foreground">CPU 같은 경계</p><strong className="text-lg">10ms</strong></div>
        <span className="text-xs font-bold text-muted-foreground">대비</span>
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950/30"><p className="text-[10px] text-muted-foreground">GPU 전체</p><strong className="text-lg">7ms</strong></div>
      </div>
      <div className="grid gap-2 text-center text-xs sm:grid-cols-3">
        <div className="rounded-lg border border-border p-3"><strong>kernel 2ms</strong><span className="mt-1 block text-muted-foreground">digit→reduction</span></div>
        <div className="rounded-lg border border-border p-3"><strong>전송 3ms</strong><span className="mt-1 block text-muted-foreground">host↔device</span></div>
        <div className="rounded-lg border border-border p-3"><strong>검증 2ms</strong><span className="mt-1 block text-muted-foreground">정답·직렬화</span></div>
      </div>
      <p className="rounded-lg border border-dashed border-primary/40 p-3 text-center text-sm font-bold text-primary">채택 speedup = 10 ÷ 7 ≈ 1.43배</p>
    </div>
  );
}

export function ModernMsmGpuViz() {
  return <StepViz steps={STEPS}>{(step) => <Scene step={step} />}</StepViz>;
}
