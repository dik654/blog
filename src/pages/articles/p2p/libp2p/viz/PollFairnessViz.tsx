import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #swarm-loop "공정성은 고정 poll 순서만으로 보장되지 않습니다".
 * v0.57.1 Swarm은 한 loop에서 Behaviour → connection pool → listener 순으로 poll하고,
 * Behaviour가 Ready면 action을 처리한 뒤 loop를 계속한다(위 AlgorithmBlock 3단계).
 * 모두 막히면 waker를 등록하고 Pending을 반환한다. pass 수 3은 설명용 가정이다.
 */
type Cell = "pending" | "ready" | "skipped" | "waiting" | "served";

const CELL_TEXT: Record<Cell, string> = {
  pending: "Pending",
  ready: "Ready → 처리 후 처음으로",
  skipped: "이번 pass 차례 없음",
  waiting: "event 대기 중",
  served: "Ready → event 처리",
};

const CELL_CLASS: Record<Cell, string> = {
  pending: "border-border bg-background text-muted-foreground",
  ready: "border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb]",
  skipped: "border-dashed border-border bg-background text-muted-foreground/70",
  waiting: "border-dashed border-[#d97706] bg-[#d97706]/10 text-[#b45309] dark:text-[#f59e0b]",
  served: "border-[#059669] bg-[#059669]/10 text-[#059669]",
};

const COMPONENTS = ["Behaviour", "connection pool", "listener"] as const;

const SCENES = [
  {
    label: "모두 막힌 pass",
    summary: "3곳 모두 Pending → waker 등록",
    passes: [["pending", "pending", "pending"]] as Cell[][],
    result: "Poll::Pending 반환 · 다음 I/O 준비 때 다시 깨움",
    note: "세 곳을 순서대로 poll했는데 진행할 일이 없으면 waker(다음 I/O가 준비되면 다시 깨워 달라는 등록)를 남기고 Pending을 반환합니다. Pending은 실패가 아니라 CPU를 양보한 상태입니다.",
  },
  {
    label: "Behaviour가 Ready",
    summary: "action 처리 → loop 처음으로",
    passes: [["ready", "skipped", "skipped"]] as Cell[][],
    result: "Dial·NotifyHandler 처리 후 Behaviour부터 다시",
    note: "Behaviour가 Ready를 내면 Swarm은 그 action을 처리하고 loop를 계속합니다. 그 pass에서는 connection pool과 listener까지 차례가 내려가지 않습니다.",
  },
  {
    label: "Ready가 계속되면",
    summary: "pool·listener 쪽 event가 기다림",
    passes: [
      ["ready", "waiting", "waiting"],
      ["ready", "waiting", "waiting"],
      ["ready", "waiting", "waiting"],
    ] as Cell[][],
    result: "다른 component의 event delay가 쌓일 수 있음",
    note: "Behaviour나 Handler가 계속 Ready를 내는 workload에서는 순서가 고정돼 있어도 다른 component의 event가 늦어질 수 있습니다. 그래서 실제 binary에서 그 delay를 측정해야 합니다.",
  },
  {
    label: "한 번에 조금만",
    summary: "bounded queue + cooperative yielding",
    passes: [
      ["ready", "skipped", "skipped"],
      ["pending", "served", "pending"],
    ] as Cell[][],
    result: "Behaviour가 양보하면 pool·listener 차례가 옴",
    note: "사용자 protocol이 한 poll에서 무한 작업하지 않고 bounded queue와 cooperative yielding을 두면, Behaviour가 Pending을 내는 pass에서 pool과 listener가 poll됩니다. 효과는 queue depth와 p95 event delay로 확인합니다.",
  },
] as const;

const MAX_PASSES = 3;

export default function PollFairnessViz() {
  return (
    <StepSceneShell
      eyebrow="poll 순서와 공정성"
      title="앞 순서가 계속 Ready면 뒤 순서는 기다립니다"
      description="가로줄 하나가 Swarm loop의 한 pass이고, 칸은 v0.57.1의 poll 순서(Behaviour → connection pool → listener)입니다. pass 개수는 설명용 가정입니다."
      ariaLabel="Swarm poll loop에서 Behaviour가 계속 Ready일 때 pool과 listener의 차례가 밀리는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rows = Array.from({ length: MAX_PASSES }, (_, index) => scene.passes[index] ?? null);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[2.5rem_repeat(3,minmax(0,1fr))] gap-1.5 text-center text-[11px] font-bold text-muted-foreground sm:grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] sm:gap-2 sm:text-xs">
              <span />
              {COMPONENTS.map((name, index) => (
                <span key={name} className="break-keep">
                  {index + 1}. {name}
                </span>
              ))}
            </div>
            <div className="mt-2 space-y-1.5 sm:space-y-2">
              {rows.map((row, passIndex) => (
                <div key={passIndex} className="grid grid-cols-[2.5rem_repeat(3,minmax(0,1fr))] gap-1.5 sm:grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] sm:gap-2">
                  <span className="self-center text-[11px] font-bold text-muted-foreground sm:text-xs">{row ? `pass ${passIndex + 1}` : ""}</span>
                  {row
                    ? row.map((cell, index) => (
                        <span
                          key={index}
                          className={`flex min-h-[2.75rem] items-center justify-center break-keep rounded-md border px-1 py-1 text-center text-[11px] font-semibold leading-4 sm:text-xs ${CELL_CLASS[cell]}`}
                        >
                          {CELL_TEXT[cell]}
                        </span>
                      ))
                    : COMPONENTS.map((name) => <span key={name} className="min-h-[2.75rem]" aria-hidden />)}
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg border border-border bg-background px-3 py-2 text-center text-xs font-semibold leading-5 sm:text-sm">{scene.result}</p>
          </div>
        );
      }}
    />
  );
}
