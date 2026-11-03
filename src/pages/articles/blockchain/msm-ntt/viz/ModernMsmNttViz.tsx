import StepViz, { type StepDef } from "@/components/ui/step-viz";

const STEPS: readonly StepDef[] = [
  {
    label: "한 proof 안의 두 큰 계산을 갈라 본다",
    tabLabel: "두 작업으로 분기",
    body: "MSM은 points와 scalars를 하나의 curve point로 줄이고, NTT는 field coefficients를 다른 배열 표현으로 바꿉니다. 입력과 출력부터 다릅니다.",
  },
  {
    label: "MSM은 같은 bucket에 모일 때 기다린다",
    tabLabel: "MSM의 기다림",
    body: "point별 계산은 나눌 수 있지만 같은 digit의 points는 같은 bucket을 갱신합니다. owner를 정한 뒤 마지막 weighted reduction까지 끝내야 합니다.",
  },
  {
    label: "NTT는 한 stage가 끝나야 다음 stage로 간다",
    tabLabel: "NTT의 기다림",
    body: "한 stage의 butterfly pair는 독립이지만 다음 stage는 바로 앞 output을 다시 읽습니다. block 밖 경계에는 완료를 보장하는 barrier가 필요합니다.",
  },
  {
    label: "VRAM과 전송을 같은 timeline에서 본다",
    tabLabel: "resident와 overlap",
    body: "동시에 살아 있는 buffer만 더하고, H2D 4ms와 kernel 7ms가 실제로 겹칠 때만 max=7ms를 씁니다. barrier 1ms를 더하면 8ms입니다.",
  },
  {
    label: "정답·지원 범위·전체 시간이 route를 정한다",
    tabLabel: "routing gate",
    body: "CPU parity를 통과한 뒤 curve·domain·size별 end-to-end median과 p95를 비교합니다. OOM·unsupported root·backend mismatch는 CPU fallback으로 보냅니다.",
  },
] as const;

function DownArrow() {
  return <span aria-hidden className="mx-auto grid h-8 w-8 place-items-center text-xl text-primary/70">↓</span>;
}

function Scene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="w-full max-w-2xl space-y-3 text-center">
        <div className="mx-auto max-w-xs rounded-xl border-2 border-primary/40 bg-primary/5 px-4 py-3"><p className="text-[10px] text-muted-foreground">고정 proof workload</p><strong>같은 seed · SRS · backend revision</strong></div>
        <DownArrow />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-sky-300 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950/30"><strong>MSM</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">points + scalars<br />→ curve point Q</p></div>
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30"><strong>NTT</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">field coefficients<br />→ transformed array</p></div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">둘 다 크다는 이유만으로 같은 kernel·queue·SLO를 적용할 수 없습니다.</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="w-full max-w-2xl space-y-4 text-center">
        <div className="flex flex-wrap justify-center gap-2">
          {["P0 · d1", "P1 · d2", "P2 · d1", "P3 · d2"].map((item) => <span key={item} className="rounded-full border border-sky-300 bg-sky-50 px-3 py-2 text-xs font-bold dark:border-sky-800 dark:bg-sky-950/30">{item}</span>)}
        </div>
        <DownArrow />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-sky-300 p-4"><p className="text-[10px] text-muted-foreground">owner A</p><strong>B1 = P0 + P2</strong></div>
          <div className="rounded-xl border border-violet-300 p-4"><p className="text-[10px] text-muted-foreground">owner B</p><strong>B2 = P1 + P3</strong></div>
        </div>
        <div className="mx-auto h-6 w-px bg-border" />
        <div className="mx-auto max-w-sm rounded-xl border-2 border-dashed border-amber-400 px-4 py-3 text-sm font-bold">weighted reduction: B1 + 2B2</div>
        <p className="text-xs text-muted-foreground">충돌 소유권과 마지막 reduction이 MSM의 병렬 경계입니다.</p>
      </div>
    );
  }

  if (step === 2) {
    const stages = [
      ["stage 0", "(0↔1)  (2↔3)  (4↔5)  (6↔7)"],
      ["stage 1", "(0↔2)  (1↔3)  (4↔6)  (5↔7)"],
      ["stage 2", "(0↔4)  (1↔5)  (2↔6)  (3↔7)"],
    ];
    return (
      <div className="w-full max-w-2xl space-y-2 text-center">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">N=8 radix-2 예시 · log₂8 = 3 stages</p>
        {stages.map(([name, pairs], index) => (
          <div key={name}>
            <div className="grid grid-cols-[64px_minmax(0,1fr)] items-center overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50 text-left dark:border-emerald-800 dark:bg-emerald-950/30">
              <strong className="border-r border-current/15 px-3 py-3 text-xs">{name}</strong>
              <span className="min-w-0 break-words px-3 py-3 font-mono text-[11px]">{pairs}</span>
            </div>
            {index < stages.length - 1 ? <div className="mx-auto flex h-8 items-center justify-center"><span className="rounded-full border border-rose-300 bg-rose-50 px-3 py-0.5 text-[10px] font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">stage barrier</span></div> : null}
          </div>
        ))}
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="w-full max-w-2xl space-y-5">
        <div>
          <p className="mb-2 text-center text-xs font-semibold">같은 순간 VRAM에 살아 있는 것</p>
          <div className="flex h-12 overflow-hidden rounded-xl border border-border text-[10px] font-bold">
            <span className="grid basis-[28%] place-items-center bg-sky-100 dark:bg-sky-950/40">points</span>
            <span className="grid basis-[14%] place-items-center bg-violet-100 dark:bg-violet-950/40">scalars</span>
            <span className="grid basis-[24%] place-items-center bg-emerald-100 dark:bg-emerald-950/40">poly</span>
            <span className="grid basis-[16%] place-items-center bg-amber-100 dark:bg-amber-950/40">twiddle</span>
            <span className="grid basis-[18%] place-items-center bg-rose-100 dark:bg-rose-950/40">scratch</span>
          </div>
        </div>
        <div className="space-y-2 text-xs font-semibold">
          <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-2"><span>H2D</span><span className="w-[57%] rounded-md bg-sky-500/20 px-3 py-2">4ms</span></div>
          <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-2"><span>kernel</span><span className="w-full rounded-md bg-violet-500/20 px-3 py-2">7ms · transfer와 overlap</span></div>
          <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-2"><span>barrier</span><span className="w-[14%] min-w-12 rounded-md bg-rose-500/20 px-3 py-2">1ms</span></div>
        </div>
        <p className="text-center text-sm font-black text-primary">critical path ≈ max(4, 7) + 1 = 8ms</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-3">
      {[
        ["1", "같은 계산인가?", "curve · field · domain · representation"],
        ["2", "정답이 같은가?", "zero · identity · impulse · round trip"],
        ["3", "지원되는가?", "VRAM · root · backend · device"],
        ["4", "전체가 빠른가?", "H2D/D2H 포함 median · p95"],
      ].map(([n, question, detail]) => (
        <div key={n} className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border bg-muted/15 p-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{n}</span>
          <div className="min-w-0"><strong className="text-sm">{question}</strong><p className="mt-1 break-words text-xs text-muted-foreground">{detail}</p></div>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3 pt-2 text-center text-sm font-bold"><div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">통과 → GPU route</div><div className="rounded-xl border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">실패 → CPU fallback</div></div>
    </div>
  );
}

export function MsmNttWorkloadViz() {
  return <StepViz steps={STEPS}>{(step) => <Scene step={step} />}</StepViz>;
}
