import SceneShell from "./SceneShell";

/**
 * 본문 대응: #experiment 02(Nonce dependency)·05(Commit과 reorg).
 * Alice 계정의 다음 nonce는 7에서 시작한다(05의 "T7 mined 뒤 nonce 8로 갱신"에서 역산).
 * reorg의 새 branch에는 T7이 없다(old-only의 뜻).
 */
type Slot = { tx: "T7" | "T8"; tag?: string; warn?: boolean };

const SCENES = [
  {
    label: "T8이 먼저 도착",
    short: "T8 먼저",
    summary: "실험 02 · 7이 비어 T8은 Queued",
    nonce: 7,
    queued: [{ tx: "T8", tag: "앞 nonce 7 없음" }] as Slot[],
    pending: [] as Slot[],
    block: null as null | { old: boolean },
    note: "Alice의 다음 nonce는 7입니다. T8(nonce 8)이 먼저 오면 앞의 7이 비어 실행할 수 없으므로 Queued에서 기다립니다.",
  },
  {
    label: "T7 도착",
    short: "T7 도착",
    summary: "실험 02 · T7 Pending, T8 승격",
    nonce: 7,
    queued: [] as Slot[],
    pending: [{ tx: "T7" }, { tx: "T8", tag: "승격" }] as Slot[],
    block: null as null | { old: boolean },
    note: "T7이 빈 nonce 7을 채우면 T7은 Pending에 들어가고 기다리던 T8도 Pending으로 올라갑니다. builder는 T7, T8 순서로 꺼내야 합니다.",
  },
  {
    label: "T7 블록 포함",
    short: "블록 포함",
    summary: "실험 05 · T7 제거, nonce 8",
    nonce: 8,
    queued: [] as Slot[],
    pending: [{ tx: "T8" }] as Slot[],
    block: { old: false } as null | { old: boolean },
    note: "T7이 canonical 블록에 들어가면 pool에서 빠지고 Alice의 다음 nonce는 8이 됩니다. 이제 T8이 맨 앞입니다.",
  },
  {
    label: "reorg",
    short: "reorg",
    summary: "실험 05 · T7 재주입, T7 → T8",
    nonce: 7,
    queued: [] as Slot[],
    pending: [{ tx: "T7", tag: "새 state로 재검증", warn: true }, { tx: "T8" }] as Slot[],
    block: { old: true } as null | { old: boolean },
    note: "T7이 든 블록이 reorg로 빠지고 새 branch에 T7이 없으면(old-only), Alice의 다른 거래도 없다고 할 때(가정) 다음 nonce는 다시 7입니다. T7을 새 state로 재검증해 T8 앞에 되돌립니다.",
  },
] as const;

function Chip({ slot }: { slot: Slot }) {
  return (
    <span className="inline-flex min-w-0 flex-col items-center">
      <span className={`inline-flex min-w-10 items-center justify-center rounded border px-2 py-1 font-mono text-xs font-bold ${slot.warn ? "border-[#d97706] text-[#d97706]" : "border-primary text-primary"}`}>{slot.tx}</span>
      {slot.tag ? <span className="mt-0.5 whitespace-nowrap text-[10px] text-muted-foreground">{slot.tag}</span> : null}
    </span>
  );
}

function Lane({ name, hint, slots, ordered }: { name: string; hint: string; slots: readonly Slot[]; ordered?: boolean }) {
  return (
    <div className="grid min-h-[3.5rem] grid-cols-[5.25rem_minmax(0,1fr)] items-center gap-2 border-t border-border/70 py-1.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
      <span className="min-w-0">
        <strong className="block font-mono text-xs">{name}</strong>
        <span className="block break-keep text-[10px] leading-4 text-muted-foreground">{hint}</span>
      </span>
      <span className="flex min-w-0 flex-wrap items-start gap-1.5">
        {slots.length === 0 ? <span className="text-[11px] text-muted-foreground">비어 있음</span> : null}
        {slots.map((slot, index) => (
          <span key={slot.tx} className="flex items-start gap-1.5">
            {ordered && index > 0 ? <span className="pt-1 font-mono text-xs text-muted-foreground">→</span> : null}
            <Chip slot={slot} />
          </span>
        ))}
      </span>
    </div>
  );
}

export default function NonceLifecycleViz() {
  return (
    <SceneShell
      eyebrow="실험 02·05 · Alice의 두 거래"
      title="T7·T8이 도착 순서와 블록·reorg에 따라 칸을 옮깁니다"
      description="nonce는 한 계정이 보내는 거래의 순번이라 7이 처리돼야 8을 실행할 수 있습니다. T7은 Alice의 nonce 7, T8은 nonce 8 거래입니다."
      ariaLabel="Alice의 T7과 T8이 Queued, Pending, canonical 블록 사이를 옮기는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 rounded-md border border-border bg-background px-2.5 pb-1 pt-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2">
              <span className="text-xs text-muted-foreground">Alice 계정이 다음에 쓸 nonce</span>
              <span className={`font-mono text-sm font-bold ${active === 3 ? "text-[#d97706]" : "text-foreground"}`}>{scene.nonce}</span>
            </div>
            <Lane name="Queued" hint="앞 nonce 대기" slots={scene.queued} />
            <Lane name="Pending" hint="builder가 꺼냄" slots={scene.pending} ordered />
            <div className="grid min-h-[3.5rem] grid-cols-[5.25rem_minmax(0,1fr)] items-center gap-2 border-t border-border/70 py-1.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <span className="min-w-0">
                <strong className="block font-mono text-xs">블록</strong>
                <span className="block text-[10px] leading-4 text-muted-foreground">canonical chain</span>
              </span>
              <span className="flex min-w-0 flex-wrap items-center gap-2 text-[11px]">
                {scene.block === null ? <span className="text-muted-foreground">T7 포함 블록 없음</span> : null}
                {scene.block !== null && !scene.block.old ? <span className="rounded border border-border px-2 py-1">블록 · <b className="font-mono">T7</b> 포함</span> : null}
                {scene.block !== null && scene.block.old ? (
                  <>
                    <span className="rounded border border-dashed border-[#dc2626] px-2 py-1 text-muted-foreground line-through">옛 블록 · T7</span>
                    <span className="font-mono text-muted-foreground">→</span>
                    <span className="rounded border border-border px-2 py-1">새 branch · T7 없음</span>
                  </>
                ) : null}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
