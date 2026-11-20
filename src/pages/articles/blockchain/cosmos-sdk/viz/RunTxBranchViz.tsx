import BranchSceneShell from "./BranchSceneShell";

/**
 * 본문 대응: #runtx-pipeline — ante 전용 cache → 성공 시 parent에 합침 → message 전용 cache.
 * 세 결과: ANTE 실패(fee·sequence 0), MESSAGE 실패(ante만 남음), 전체 성공(ante + message).
 * 수치: Alice 100 · Bob 20 · seq 7, fee 1, 송금 10 (본문 첫 그림).
 * gas: 본문 설명용 수치 ante 30 + message 50 + post 5 = 85 > limit 80.
 */
type Slot = { state: string; tag: string; tone: "idle" | "work" | "merged" | "dropped" };

const SCENES = [
  {
    label: "parent에서 출발",
    summary: "A 100 · B 20 · seq 7",
    note: "FinalizeBlock의 parent branch가 이 transaction 직전 상태를 들고 있습니다. 아직 어떤 child cache도 만들지 않았습니다.",
    parent: "Alice 100 · Bob 20 · seq 7",
    ante: { state: "—", tag: "아직 없음", tone: "idle" },
    msg: { state: "—", tag: "아직 없음", tone: "idle" },
    gas: null,
  },
  {
    label: "ante child에서 계산",
    summary: "child: A 99 · seq 8",
    note: "RunTx는 먼저 ante 전용 cache를 만듭니다. fee 1 차감과 sequence 증가는 이 child 안에서만 계산되고 parent는 아직 그대로입니다.",
    parent: "Alice 100 · Bob 20 · seq 7",
    ante: { state: "Alice 99 · seq 8", tag: "계산 중", tone: "work" },
    msg: { state: "—", tag: "아직 없음", tone: "idle" },
    gas: null,
  },
  {
    label: "ante를 parent에 합침",
    summary: "parent: A 99 · seq 8",
    note: "Ante가 성공하면 fee 차감과 sequence 증가를 parent에 합칩니다. 이 시점부터 뒤의 message가 실패해도 이 변경은 parent에 남습니다.",
    parent: "Alice 99 · Bob 20 · seq 8",
    ante: { state: "Alice 99 · seq 8", tag: "parent에 합침", tone: "merged" },
    msg: { state: "—", tag: "아직 없음", tone: "idle" },
    gas: null,
  },
  {
    label: "message child에서 송금",
    summary: "child: A 89 · B 30",
    note: "합친 parent 위에 message 전용 cache를 새로 만들고 MsgSend가 Alice −10, Bob +10을 계산합니다. parent는 아직 A 99 · B 20입니다.",
    parent: "Alice 99 · Bob 20 · seq 8",
    ante: { state: "Alice 99 · seq 8", tag: "parent에 합침", tone: "merged" },
    msg: { state: "Alice 89 · Bob 30", tag: "계산 중", tone: "work" },
    gas: null,
  },
  {
    label: "결과 A · 전체 성공",
    summary: "ante + message",
    note: "MsgSend와 뒤따르는 후처리(post-handler)가 성공하면 message child도 parent에 합칩니다. 두 branch가 순서대로 합쳐져 parent는 A 89 · B 30 · seq 8입니다.",
    parent: "Alice 89 · Bob 30 · seq 8",
    ante: { state: "Alice 99 · seq 8", tag: "parent에 합침", tone: "merged" },
    msg: { state: "Alice 89 · Bob 30", tag: "parent에 합침", tone: "merged" },
    gas: null,
  },
  {
    label: "결과 B · post에서 gas 초과",
    summary: "30 + 50 + 5 = 85 > 80",
    note: "설명용 gas 가정값으로 ante 30 + message 50 = 80까지는 limit 안이고, post-handler 5를 더한 85에서 limit 80을 넘습니다. post-handler도 message child 안에서 돌므로 message child를 버리고, ante 단계에서 이미 parent에 합친 fee 1 · seq 8만 parent에 남습니다.",
    parent: "Alice 99 · Bob 20 · seq 8",
    ante: { state: "Alice 99 · seq 8", tag: "parent에 합침", tone: "merged" },
    msg: { state: "Alice 89 · Bob 30", tag: "버림", tone: "dropped" },
    gas: [30, 50, 5] as const,
  },
  {
    label: "결과 C · ante 실패",
    summary: "fee · sequence 0",
    note: "Ante가 실패하면 첫 child를 parent에 합치기 전에 반환합니다. message child는 만들어지지도 않고 parent는 출발점 A 100 · B 20 · seq 7 그대로입니다.",
    parent: "Alice 100 · Bob 20 · seq 7",
    ante: { state: "ante child의 변경", tag: "버림", tone: "dropped" },
    msg: { state: "—", tag: "만들지 않음", tone: "idle" },
    gas: null,
  },
] as const;

const TONE: Record<Slot["tone"], string> = {
  idle: "border-dashed border-border bg-background text-muted-foreground",
  work: "border-primary bg-primary/10",
  merged: "border-emerald-600 bg-background",
  dropped: "border-dashed border-red-600 bg-background",
};

const TAG: Record<Slot["tone"], string> = {
  idle: "text-muted-foreground",
  work: "text-primary",
  merged: "text-emerald-700 dark:text-emerald-400",
  dropped: "text-red-700 dark:text-red-400",
};

function Child({ title, slot }: { title: string; slot: Slot }) {
  return (
    <div className={`min-w-0 rounded-lg border p-3 ${TONE[slot.tone]}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="font-mono text-[10px] font-bold">{title}</span>
        <span className={`text-[11px] font-bold ${TAG[slot.tone]}`}>{slot.tag}</span>
      </div>
      <strong className={`mt-2 block break-keep font-mono text-xs leading-5 ${slot.tone === "dropped" ? "line-through decoration-red-600" : ""}`}>{slot.state}</strong>
    </div>
  );
}

const GAS_SCALE = 100;
const GAS_LIMIT = 80;
const GAS_COLORS: readonly string[] = ["#64748b", "#2563eb", "#d97706"];
const GAS_NAMES: readonly string[] = ["ante", "message", "post"];

function GasMeter({ parts }: { parts: readonly number[] | null }) {
  if (!parts) {
    return (
      <p className="flex min-h-[3.75rem] items-center break-keep text-xs leading-5 text-muted-foreground">
        Gas meter: 이 장면은 limit 안에서 끝난다고 가정합니다.
      </p>
    );
  }
  const total = parts.reduce<number>((sum, value) => sum + value, 0);
  const starts = parts.map((_, index) => parts.slice(0, index).reduce<number>((sum, value) => sum + value, 0));
  return (
    <div className="min-h-[3.75rem]">
      <div className="flex flex-wrap justify-between gap-x-2 text-[11px] leading-5">
        <span className="text-muted-foreground">Gas meter (설명용 가정값)</span>
        <strong className="font-mono text-red-700 dark:text-red-400">누적 {total} &gt; limit {GAS_LIMIT}</strong>
      </div>
      <div className="relative mt-1 h-5 rounded-sm bg-muted/40">
        {parts.map((value, index) => (
          <div
            key={GAS_NAMES[index]}
            className="absolute top-0 h-full"
            style={{ left: `${(starts[index] / GAS_SCALE) * 100}%`, width: `${(value / GAS_SCALE) * 100}%`, backgroundColor: GAS_COLORS[index] }}
          />
        ))}
        <div className="absolute -top-1 h-7 w-px bg-red-600" style={{ left: `${(GAS_LIMIT / GAS_SCALE) * 100}%` }} />
      </div>
      <div className="mt-1 flex flex-wrap gap-x-3 text-[10px] leading-4 text-muted-foreground">
        {parts.map((value, index) => (
          <span key={GAS_NAMES[index]}>
            <span className="mr-1 inline-block h-2 w-2 align-middle" style={{ backgroundColor: GAS_COLORS[index] }} />
            {GAS_NAMES[index]} {value}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RunTxBranchViz() {
  return (
    <BranchSceneShell
      eyebrow="RunTx의 두 child cache"
      title="Ante를 먼저 parent에 합치기 때문에 message가 실패해도 fee와 sequence는 남습니다"
      description="바깥 상자는 FinalizeBlock의 parent branch, 안쪽 두 칸은 RunTx가 차례로 만드는 ante child와 message child입니다. 수치는 본문 첫 그림의 고정 예시(Alice 100 · Bob 20 · fee 1 · 송금 10)입니다."
      ariaLabel="RunTx가 ante child와 message child를 차례로 만들고 세 결과에서 parent에 남는 상태를 비교하는 일곱 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 rounded-xl border border-border bg-background/60 p-3 sm:p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="font-mono text-[10px] font-bold text-primary">FINALIZE PARENT</span>
              <strong className="break-keep font-mono text-xs sm:text-sm">{scene.parent}</strong>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Child title="① ANTE CHILD" slot={scene.ante} />
              <Child title="② MESSAGE CHILD" slot={scene.msg} />
            </div>
            <div className="mt-3 border-t border-border pt-3">
              <GasMeter parts={scene.gas} />
            </div>
          </div>
        );
      }}
    />
  );
}
