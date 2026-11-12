import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cpu-stage-map — sparse coefficient record가 가리키는 slot에 witness×계수를 더한다.
 * 설명용 작은 예(가정, field 원소 대신 보통 정수): witness w = [1, 4, 2, 5]
 * A 레코드: (slot 0, s1, 2)→8 · (slot 2, s2, 1)→2 · (slot 2, s3, 3)→15 · (slot 3, s0, 7)→7 → a = [8, 0, 17, 7]
 * B 레코드: (slot 0, s0, 1)→1 · (slot 1, s2, 3)→6 · (slot 2, s0, 1)→1 · (slot 3, s1, 1)→4 → b = [1, 6, 1, 4]
 * a·b = [8, 0, 17, 28]
 */
const WITNESS = [1, 4, 2, 5] as const;
const A_RECORDS = [
  { slot: 0, s: 1, k: 2, thread: 1 },
  { slot: 2, s: 2, k: 1, thread: 1 },
  { slot: 2, s: 3, k: 3, thread: 2 },
  { slot: 3, s: 0, k: 7, thread: 2 },
] as const;
const B_RECORDS = [
  { slot: 0, s: 0, k: 1, thread: 1 },
  { slot: 1, s: 2, k: 3, thread: 1 },
  { slot: 2, s: 0, k: 1, thread: 2 },
  { slot: 3, s: 1, k: 1, thread: 2 },
] as const;
const A_VALUES = [8, 0, 17, 7] as const;
const B_VALUES = [1, 6, 1, 4] as const;
const PRODUCT = [8, 0, 17, 28] as const;
const SLOTS = [0, 1, 2, 3] as const;
const THREAD_COLOR: Record<number, string> = { 1: "#0284c7", 2: "#7c3aed" };

const SCENES = [
  { label: "레코드 한 장", summary: "w₃ × 3 = 15 → a[2]", note: "zkey의 계수 레코드 한 장은 '어느 slot(제약 c)에, 어느 signal s의 witness 값을, 어떤 계수로 곱해 더할지'를 적습니다. 대부분의 칸은 0이라 값이 있는 칸만 레코드로 둡니다(sparse). 숫자는 보통 정수로 바꾼 설명용 예입니다(가정)." },
  { label: "두 thread가 나눠 처리", summary: "slot 2에 두 thread가 동시에", note: "레코드를 thread 두 개(파랑·보라)에 나눠 주면 서로 다른 thread가 같은 slot 2를 갱신하게 됩니다. 두 덧셈 2와 15가 모두 남아야 a[2] = 17입니다. 보호 없이 동시에 읽고 쓰면 한쪽 덧셈이 덮여 사라질 수 있습니다." },
  { label: "누가 slot을 맡는지 정함", summary: "a = [8, 0, 17, 7]", note: "현재 source는 공유 slot에 striped mutex를 써서 한 번에 한 thread만 더하게 합니다. GPU로 옮길 때도 atomic, sort-reduce, segmented reduction 중 무엇으로 같은 slot의 덧셈을 모을지 명시해야 합니다." },
  { label: "B도 같은 방식, 그다음 곱", summary: "a·b = [8, 0, 17, 28]", note: "위 카드가 B 계수 레코드 네 장으로 바뀝니다. 같은 방식으로 b 배열에 모읍니다. 그다음 slot마다 a와 b를 곱해 c = a·b 배열을 만듭니다. 본문의 다음 단계(FFT quotient)가 이 세 배열을 입력으로 받습니다." },
] as const;

function Cell({ value, tone, sub }: { value: string; tone: "plain" | "hit" | "done" | "muted"; sub?: string }) {
  const cls =
    tone === "hit"
      ? "border-amber-600 bg-amber-50 text-amber-800 dark:border-amber-400 dark:bg-amber-950/40 dark:text-amber-200"
      : tone === "done"
        ? "border-emerald-600 text-emerald-800 dark:border-emerald-400 dark:text-emerald-200"
        : tone === "muted"
          ? "border-dashed border-border/50 text-muted-foreground/40"
          : "border-border";
  return (
    <div className={`flex h-11 flex-col items-center justify-center rounded-md border font-mono ${cls}`}>
      <span className="whitespace-nowrap text-sm font-bold">{value}</span>
      <span className="text-[10px] leading-3 text-muted-foreground">{sub ?? " "}</span>
    </div>
  );
}

export default function CoefficientAccumulateViz() {
  return (
    <SceneShell
      eyebrow="계수 누적"
      title="흩어진 계수 레코드가 같은 slot으로 모일 때 덧셈의 주인이 필요합니다"
      description="위는 계수 레코드 네 장(마지막 장면은 B 레코드), 아래 칸은 domain slot 0–3의 누적 배열입니다. witness w = [1, 4, 2, 5]와 계수는 보통 정수로 바꾼 설명용 가정이며, 실제 값은 scalar field 원소입니다."
      ariaLabel="A 계수 레코드 네 장이 slot 0부터 3에 witness 곱을 더하고, slot 2에서 두 thread가 충돌하며, 이후 b 배열과 곱 a·b를 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const finalA = active >= 2;
        const records: readonly { slot: number; s: number; k: number; thread: number }[] = active === 3 ? B_RECORDS : A_RECORDS;
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {records.map((record, index) => {
                const focus = active === 0 ? index === 2 : true;
                const color = active === 0 ? "#64748b" : THREAD_COLOR[record.thread];
                return (
                  <div
                    key={`${record.slot}-${record.s}`}
                    className={`rounded-lg border px-2 py-1.5 text-xs leading-5 ${focus ? "" : "opacity-35"}`}
                    style={{ borderColor: color }}
                  >
                    <span className="block font-semibold" style={{ color }}>{active === 0 ? "A 레코드" : active === 3 ? `B 레코드 · thread ${record.thread}` : `thread ${record.thread}`}</span>
                    <span className="block whitespace-nowrap font-mono">slot {record.slot} ← w{record.s}×{record.k}</span>
                    <span className="block whitespace-nowrap font-mono text-muted-foreground">
                      {WITNESS[record.s as 0 | 1 | 2 | 3]}×{record.k} = +{WITNESS[record.s as 0 | 1 | 2 | 3] * record.k}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-[3.5rem_repeat(4,minmax(0,1fr))] items-center gap-1.5 sm:gap-2">
              <span className="text-xs text-muted-foreground">slot</span>
              {SLOTS.map((slot) => (
                <span key={slot} className="text-center font-mono text-xs font-bold">{slot}</span>
              ))}
              <span className="text-xs font-semibold">a</span>
              {SLOTS.map((slot) => {
                if (active === 0) {
                  return slot === 2 ? <Cell key={slot} value="+15" tone="hit" sub="이 레코드" /> : <Cell key={slot} value="·" tone="muted" />;
                }
                if (active === 1) {
                  return slot === 2 ? <Cell key={slot} value="2+15" tone="hit" sub="동시 갱신" /> : <Cell key={slot} value={String(A_VALUES[slot])} tone="plain" />;
                }
                return <Cell key={slot} value={String(A_VALUES[slot])} tone={finalA && slot === 2 ? "done" : "plain"} sub={slot === 2 ? "한 번에 하나씩" : undefined} />;
              })}
              <span className="text-xs font-semibold">b</span>
              {SLOTS.map((slot) => (
                <Cell key={slot} value={active === 3 ? String(B_VALUES[slot]) : "·"} tone={active === 3 ? "plain" : "muted"} />
              ))}
              <span className="text-xs font-semibold">a·b</span>
              {SLOTS.map((slot) => (
                <Cell key={slot} value={active === 3 ? String(PRODUCT[slot]) : "·"} tone={active === 3 ? "done" : "muted"} sub={active === 3 ? `${A_VALUES[slot]}×${B_VALUES[slot]}` : undefined} />
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
