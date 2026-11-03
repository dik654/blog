import StepViz, { type StepDef } from "@/components/ui/step-viz";

const STEPS: readonly StepDef[] = [
  {
    label: "같은 입력도 상수와 행렬이 다르면 다른 해시가 된다",
    tabLabel: "계산 영수증",
    body: "장난감 field F17에서 state (1,2,3), round constants (1,2,3), exponent 5와 mix 행렬을 한 묶음으로 고정합니다. 실제 보안용 Poseidon profile이 아니라 한 round의 동작만 보는 예입니다.",
  },
  {
    label: "먼저 각 칸에 이 round의 상수를 더한다",
    tabLabel: "ARK",
    body: "입력 (1,2,3)에 constants (1,2,3)을 같은 위치끼리 더하면 (2,4,6)이 됩니다. 상수 하나가 달라지면 이후 모든 값과 최종 root가 달라집니다.",
  },
  {
    label: "그다음 S-box가 값을 비선형으로 꺾는다",
    tabLabel: "S-box",
    body: "이 장난감 full round에서는 세 칸 모두 x⁵ mod 17을 적용합니다. (2,4,6)은 (15,4,7)이 됩니다. Partial round라면 profile이 지정한 칸에만 적용합니다.",
  },
  {
    label: "마지막으로 행렬이 세 칸을 서로 섞는다",
    tabLabel: "mix",
    body: "각 output은 S-box 결과 전체를 한 행의 계수로 합친 값입니다. 예제 행렬에서는 (15,4,7)이 (9,10,7)이 됩니다. 여러 thread가 칸을 나눴다면 이 전에 동기화가 필요합니다.",
  },
  {
    label: "독립 해시는 함께 돌리고 부모 level은 기다린다",
    tabLabel: "batch와 tree",
    body: "8개 leaf hash는 병렬 batch가 되지만 다음 level의 parent는 두 child가 모두 끝난 뒤 시작합니다. Binary tree의 frontier는 8→4→2→1로 줄어 root 가까이에서 병렬성이 작아집니다.",
  },
  {
    label: "정답이 맞은 state만 처리량에 센다",
    tabLabel: "release gate",
    body: "1,024개 중 reference parity를 통과한 값이 1,020개이고 전체가 2ms라면 510,000 verified states/s입니다. 4개 실패를 숨긴 512,000 states/s를 발표하면 안 됩니다.",
  },
] as const;

const COLORS = [
  "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30",
  "border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30",
  "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
] as const;

function Values({ values, labels }: { values: readonly string[]; labels?: readonly string[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} className={`rounded-xl border p-3 text-center ${COLORS[index]}`}>
          {labels ? <span className="block text-[10px] text-muted-foreground">{labels[index]}</span> : null}
          <strong className="text-base">{value}</strong>
        </div>
      ))}
    </div>
  );
}

function DownArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1 text-primary/75">
      {label ? <span className="text-[10px] font-semibold">{label}</span> : null}
      <span aria-hidden className="text-xl">↓</span>
    </div>
  );
}

function Scene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="w-full max-w-2xl space-y-4 text-center">
        <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
          동작 확인용 F17 한 round · 실제 보안용 profile 아님
        </div>
        <Values values={["1", "2", "3"]} labels={["state 0", "state 1", "state 2"]} />
        <DownArrow label="이 정보까지 같아야 같은 계산" />
        <div className="flex flex-wrap justify-center gap-2">
          {["field F17", "width 3", "α=5", "constants (1,2,3)", "matrix digest", "revision"].map((item) => (
            <span key={item} className="rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-semibold">{item}</span>
          ))}
        </div>
        <p className="text-xs leading-5 text-muted-foreground">이 묶음의 digest가 다르면 같은 이름의 Poseidon이라도 별도 instance입니다.</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="w-full max-w-xl space-y-3 text-center">
        <Values values={["1", "2", "3"]} labels={["x₀", "x₁", "x₂"]} />
        <div className="grid grid-cols-3 gap-2 text-xs font-bold text-primary">
          <span>+ 1</span><span>+ 2</span><span>+ 3</span>
        </div>
        <DownArrow label="mod 17" />
        <Values values={["2", "4", "6"]} labels={["x₀+C₀", "x₁+C₁", "x₂+C₂"]} />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="w-full max-w-2xl space-y-4 text-center">
        <Values values={["2", "4", "6"]} />
        <DownArrow label="각 칸에 x⁵ mod 17" />
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["2⁵=32", "32 mod 17 = 15"],
            ["4⁵=1,024", "1,024 mod 17 = 4"],
            ["6⁵=7,776", "7,776 mod 17 = 7"],
          ].map(([power, reduced], index) => (
            <div key={power} className={`rounded-xl border p-3 ${COLORS[index]}`}>
              <strong className="block text-sm">{power}</strong>
              <span className="mt-1 block text-xs text-muted-foreground">{reduced}</span>
            </div>
          ))}
        </div>
        <Values values={["15", "4", "7"]} labels={["s₀", "s₁", "s₂"]} />
      </div>
    );
  }

  if (step === 3) {
    const rows = [
      ["1·15 + 1·4 + 1·7", "26 mod 17", "9"],
      ["1·15 + 2·4 + 3·7", "44 mod 17", "10"],
      ["1·15 + 3·4 + 2·7", "41 mod 17", "7"],
    ] as const;
    return (
      <div className="w-full max-w-2xl space-y-3">
        <p className="text-center text-xs font-semibold text-primary">M × (15, 4, 7)ᵀ mod 17</p>
        {rows.map(([sum, reduced, output], index) => (
          <div key={sum} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-border bg-muted/15 p-3">
            <div className="min-w-0 text-left">
              <strong className="block break-words text-xs sm:text-sm">{sum}</strong>
              <span className="text-[11px] text-muted-foreground">{reduced}</span>
            </div>
            <span className={`grid h-11 w-11 place-items-center rounded-lg border font-black ${COLORS[index]}`}>{output}</span>
          </div>
        ))}
        <p className="text-center text-xs text-muted-foreground">다음 state = (9, 10, 7)</p>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="w-full max-w-2xl space-y-4 text-center">
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 8 }, (_, index) => <span key={index} className="grid h-10 min-w-0 place-items-center rounded-md border border-sky-300 bg-sky-50 text-[10px] font-bold dark:border-sky-800 dark:bg-sky-950/30">L{index}</span>)}
        </div>
        <DownArrow label="8개 leaf hash는 같은 batch" />
        <div className="flex items-center justify-center gap-2 text-xs font-black sm:text-sm">
          {["8", "4", "2", "1 root"].map((value, index) => (
            <div key={value} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-muted/20 px-3 py-2">{value}</span>
              {index < 3 ? <span aria-hidden className="text-primary">→</span> : null}
            </div>
          ))}
        </div>
        <div className="grid gap-2 text-left text-xs sm:grid-cols-2">
          <p className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30"><strong>같은 level</strong><span className="mt-1 block text-muted-foreground">서로 독립이면 병렬 실행</span></p>
          <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30"><strong>다음 level</strong><span className="mt-1 block text-muted-foreground">두 child 완료 뒤 시작</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4 text-center">
      <div className="grid grid-cols-3 gap-2">
        {[["시도", "1,024"], ["parity 실패", "4"], ["전체 시간", "2ms"]].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-muted/15 p-3">
            <strong className="block text-lg">{value}</strong>
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-sm font-semibold text-muted-foreground">검증 통과 = 1,024 − 4 = 1,020 states</p>
      <p className="rounded-xl border-2 border-primary/30 bg-primary/5 px-3 py-4 text-lg font-black text-primary">1,020 ÷ 0.002 = 510,000 states/s</p>
      <div className="grid gap-2 text-left text-xs sm:grid-cols-3">
        {[
          ["parameter", "field·constants digest"],
          ["parity", "CPU·circuit·tree root"],
          ["end-to-end", "transfer·kernel·sync"],
        ].map(([title, detail]) => (
          <p key={title} className="rounded-lg border border-border p-3"><strong>{title}</strong><span className="mt-1 block text-muted-foreground">{detail}</span></p>
        ))}
      </div>
    </div>
  );
}

export function PoseidonKernelViz() {
  return <StepViz steps={STEPS}>{(step) => <Scene step={step} />}</StepViz>;
}
