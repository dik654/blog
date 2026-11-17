import SceneShell from "./SceneShell";

/**
 * 본문 대응: #checktx — 응답 callback의 두 번째 isFull 검사와 addTx가 원자적이지 않다.
 * 시작 pool 900B, T1·T2 각 80B, MaxTxsBytes 1,000.
 * 경쟁 순서: T1 읽음(900) → T2 읽음(900) → T1 addTx(980) → T2 addTx(1060).
 * 다른 순서: T1 읽음(900) → T1 addTx(980) → T2 읽음(980+80=1060>1000) → T2 거절.
 */
const CEILING = 1000;
const SCALE_MAX = 1100;

type Lane = "T1" | "T2";
interface Step {
  lane: Lane;
  action: string;
  detail: string;
  bad?: boolean;
}

const RACE: readonly Step[] = [
  { lane: "T1", action: "isFull 관찰", detail: "900 + 80 = 980 ≤ 1,000 통과" },
  { lane: "T2", action: "isFull 관찰", detail: "아직 900 · 980 ≤ 1,000 통과" },
  { lane: "T1", action: "addTx", detail: "counter 900 → 980" },
  { lane: "T2", action: "addTx", detail: "counter 980 → 1,060", bad: true },
];

const OTHER: readonly Step[] = [
  { lane: "T1", action: "isFull 관찰", detail: "900 + 80 = 980 ≤ 1,000 통과" },
  { lane: "T1", action: "addTx", detail: "counter 900 → 980" },
  { lane: "T2", action: "isFull 관찰", detail: "980 + 80 = 1,060 > 1,000" },
  { lane: "T2", action: "capacity 거절", detail: "pool에 넣지 않음" },
];

const SCENES = [
  { label: "두 callback 시작 전", summary: "pool 900 / 1,000 bytes", shown: 0, counter: 900, order: "race", note: "T1과 T2는 각자 application CheckTx 응답을 받아 callback을 시작합니다. isFull은 지금 pool에 쌓인 bytes에 내 크기를 더해 MaxTxsBytes를 넘는지 보는 검사이고, addTx는 실제로 pool 뒤에 붙이고 byte counter를 늘리는 단계입니다." },
  { label: "T1이 900을 관찰", summary: "980 ≤ 1,000 → 통과", shown: 1, counter: 900, order: "race", note: "T1 callback이 isFull에서 900을 읽고 80을 더해도 1,000 이하라고 판단합니다. 아직 addTx 전이므로 counter는 그대로 900입니다." },
  { label: "T2도 900을 관찰", summary: "T1 삽입을 아직 모름", shown: 2, counter: 900, order: "race", note: "T2 callback이 T1의 addTx보다 먼저 isFull을 실행하면 같은 900을 읽습니다. T2도 980 ≤ 1,000으로 통과합니다. 두 판단은 각각 참입니다." },
  { label: "T1 addTx", summary: "counter 980", shown: 3, counter: 980, order: "race", note: "T1이 pool에 들어가며 counter가 980이 됩니다. T2는 이미 검사를 끝냈으므로 이 변화를 다시 보지 않습니다." },
  { label: "T2 addTx", summary: "1,060 > 1,000", shown: 4, counter: 1060, order: "race", note: "T2도 들어가며 counter는 정확히 1,060이 됩니다. counter 덧셈 자체는 안전하지만, 검사와 삽입 사이가 묶여 있지 않아 설정 ceiling 1,000을 60 bytes 넘었습니다." },
  { label: "다른 순서라면", summary: "T2가 980을 보고 거절", shown: 4, counter: 980, order: "other", note: "T1의 addTx가 T2의 isFull보다 먼저 끝나면 T2는 980을 읽고 1,060 > 1,000으로 거절됩니다. 그래서 초과는 가능한 interleaving이지, 매번 일어나는 결과가 아닙니다." },
] as const;

const x = (bytes: number) => (bytes / SCALE_MAX) * 100;

export default function CallbackRaceViz() {
  return (
    <SceneShell
      eyebrow="두 번째 capacity 검사"
      title="두 callback이 같은 900을 읽으면 둘 다 통과하고 합은 1,060이 됩니다"
      description="왼쪽 줄이 T1 callback, 오른쪽 줄이 T2 callback이고 위에서 아래로 시간이 흐릅니다. 아래 막대는 pool raw bytes counter입니다. 시작 900, 각 80, MaxTxsBytes 1,000은 본문 예시 그대로입니다."
      ariaLabel="두 callback의 isFull 관찰과 addTx 순서에 따라 pool bytes가 1,060이 되거나 T2가 거절되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const steps = scene.order === "race" ? RACE : OTHER;
        const over = scene.counter > CEILING;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-px bg-border p-px text-[11px] leading-4 sm:text-xs sm:leading-5">
              <div className="bg-background p-2" />
              <div className="bg-background p-2 text-center font-bold">T1 callback</div>
              <div className="bg-background p-2 text-center font-bold">T2 callback</div>
              {steps.map((step, index) => {
                const visible = index < scene.shown;
                const cell = (
                  <div className={`min-h-[3.25rem] rounded-sm border px-1.5 py-1 sm:flex sm:min-h-0 sm:items-baseline sm:gap-2 ${step.bad ? "border-red-600" : "border-primary/60"} ${visible ? "" : "invisible"}`}>
                    <strong className={`block ${step.bad ? "text-red-700 dark:text-red-400" : "text-primary"}`}>{step.action}</strong>
                    <span className="block break-keep text-muted-foreground">{step.detail}</span>
                  </div>
                );
                return (
                  <div key={`${scene.order}-${index}`} className="contents">
                    <div className="flex items-center justify-center bg-background font-mono text-[10px] text-muted-foreground">{index + 1}</div>
                    <div className="min-w-0 bg-background p-1">{step.lane === "T1" ? cell : null}</div>
                    <div className="min-w-0 bg-background p-1">{step.lane === "T2" ? cell : null}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">pool raw bytes counter · 세로선 = MaxTxsBytes 1,000</span>
                <strong className={`font-mono ${over ? "text-red-700 dark:text-red-400" : ""}`}>{scene.counter.toLocaleString("en-US")} B</strong>
              </div>
              <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="mt-1 block h-5 w-full" aria-hidden>
                <rect x={0} y={2} width={100} height={10} fill="#e2e8f0" />
                <rect x={0} y={2} width={x(Math.min(scene.counter, CEILING))} height={10} fill="#2563eb" />
                {over && <rect x={x(CEILING)} y={2} width={x(scene.counter) - x(CEILING)} height={10} fill="#dc2626" />}
                <line x1={x(CEILING)} x2={x(CEILING)} y1={0} y2={14} stroke="#0f172a" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        );
      }}
    />
  );
}
