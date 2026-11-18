import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 서버 한 대 초당 50건(가정), 평소 80건 → 2대, 점심 260건 → 6대.
 * 80 ÷ 50 = 1.6 → 올림 2대(용량 100, 여유 20). 260 ÷ 50 = 5.2 → 올림 6대(용량 300, 여유 40).
 * 6대를 직접 사 두면 평소에는 2대만 일하고 4대가 놀 수 있다. 자동 확장은 2대와 6대 사이를 오간다.
 */
const PER_SERVER = 50;
const SLOTS = [0, 1, 2, 3, 4, 5] as const;

type SlotState = "work" | "idle" | "none" | "added" | "later";

interface Row {
  label: string;
  demand: number | null;
  states: readonly SlotState[];
}

const fill = (work: number, rest: SlotState, extra?: { from: number; state: SlotState }) =>
  SLOTS.map((slot) => (slot < work ? "work" : extra && slot >= extra.from ? extra.state : rest));

const SCENES = [
  {
    label: "평소 초당 80건",
    summary: "80 ÷ 50 = 1.6 → 2대",
    note: "한 대가 초당 50건을 처리하므로 한 대로는 30건이 남습니다. 대수는 소수로 둘 수 없어 올림해 2대가 필요하고, 용량 100에서 20건이 남습니다.",
    rows: [
      { label: "평소 80건/초", demand: 80, states: fill(2, "none") },
      { label: "점심 260건/초", demand: null, states: fill(0, "later") },
    ],
  },
  {
    label: "점심 초당 260건",
    summary: "260 ÷ 50 = 5.2 → 6대",
    note: "5대면 용량이 250이라 10건이 넘칩니다. 올림해 6대가 필요하고, 용량 300에서 40건이 남습니다.",
    rows: [
      { label: "평소 80건/초", demand: 80, states: fill(2, "none") },
      { label: "점심 260건/초", demand: 260, states: fill(6, "none") },
    ],
  },
  {
    label: "6대를 직접 사 두면",
    summary: "평소 4대가 놀 수 있음",
    note: "점심에 맞춰 6대를 사 두면 점심이 아닌 시간, 곧 하루 대부분에는 2대만 일하고 4대가 놀 수 있습니다.",
    rows: [
      { label: "평소 80건/초", demand: 80, states: fill(2, "idle") },
      { label: "점심 260건/초", demand: 260, states: fill(6, "idle") },
    ],
  },
  {
    label: "자동으로 2대 ↔ 6대",
    summary: "점심에만 4대를 더 켬",
    note: "필요할 때만 4대를 더 켜면 용량 낭비를 줄일 수 있습니다. 다만 시작 시간, 최소·최대 수, 데이터베이스 연결 수와 예산 경보를 함께 정하지 않으면 확장이 새 병목을 만듭니다.",
    rows: [
      { label: "평소 80건/초", demand: 80, states: fill(2, "none") },
      { label: "점심 260건/초", demand: 260, states: fill(2, "none", { from: 2, state: "added" }) },
    ],
  },
] as const;

const SLOT_STYLE: Record<SlotState, { box: string; text: string; label: string }> = {
  work: { box: "border-blue-600 bg-blue-600/10", text: "text-blue-700 dark:text-blue-300", label: "일함" },
  added: { box: "border-blue-600 border-dashed bg-blue-600/10", text: "text-blue-700 dark:text-blue-300", label: "늘림" },
  idle: { box: "border-amber-600 bg-amber-500/10", text: "text-amber-800 dark:text-amber-300", label: "놂" },
  none: { box: "border-dashed border-border/60", text: "text-muted-foreground/60", label: "없음" },
  later: { box: "border-dashed border-border/40", text: "text-muted-foreground/40", label: "·" },
};

const MAX = 300;

function CapacityRow({ row }: { row: Row }) {
  const capacity = row.states.filter((state) => state !== "none" && state !== "later" && state !== "idle").length * PER_SERVER;
  const owned = row.states.filter((state) => state === "idle").length;
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="font-semibold">{row.label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {row.demand === null ? "다음 장면" : `일하는 용량 ${capacity} · 여유 ${capacity - row.demand}${owned ? ` · 노는 ${owned}대` : ""}`}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-6 gap-1.5">
        {row.states.map((state, index) => (
          <div key={index} className={`rounded-md border px-1 py-1.5 text-center text-[11px] leading-4 ${SLOT_STYLE[state].box}`}>
            <span className={`block font-semibold ${SLOT_STYLE[state].text}`}>{state === "later" ? "·" : `${index + 1}번`}</span>
            <span className={`block ${SLOT_STYLE[state].text}`}>{SLOT_STYLE[state].label}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-2 h-3 rounded-sm bg-muted/40" aria-hidden>
        {row.demand !== null && (
          <>
            <div className="absolute inset-y-0 left-0 rounded-sm" style={{ width: `${(capacity / MAX) * 100}%`, backgroundColor: "#bfdbfe" }} />
            <div className="absolute inset-y-0 left-0 rounded-sm" style={{ width: `${(row.demand / MAX) * 100}%`, backgroundColor: "#2563eb" }} />
          </>
        )}
      </div>
    </div>
  );
}

export default function CapacitySlotsViz() {
  return (
    <SceneShell
      eyebrow="필요 대수"
      title="평소 2대, 점심 6대를 칸으로 세어 봅니다"
      description="칸 하나가 서버 한 대이고 한 대는 초당 50건을 처리합니다(가정). 아래 띠의 진한 부분은 요청량, 옅은 부분은 일하는 서버의 용량이며 띠 전체 길이는 초당 300건입니다."
      ariaLabel="평소와 점심 요청량에 필요한 서버 수와 직접 보유, 자동 확장의 차이"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-5">
          {SCENES[active].rows.map((row) => (
            <CapacityRow key={row.label} row={row} />
          ))}
        </div>
      )}
    />
  );
}
