import SceneShell from "./SceneShell";

/**
 * 본문 대응: #prepare-process "Candidate state는 block hash로 격리한 cache입니다".
 * 한 height에 round와 proposal이 여럿 생길 수 있어 후보를 block hash별로 따로 두고,
 * 결정된 block과 같은 후보만 FinalizeBlock에서 ExecuteTxState로 승격, 버렸다면 다시 실행한다.
 * 다른 proposal B41ʹ, round 번호, cache 칸 수는 설명용 가정이다.
 */
type Slot = { name: string; tag: string; state: "empty" | "cached" | "promoted" | "dropped" };

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  slots: readonly [Slot, Slot];
  execute: string;
  executeOn: boolean;
}[] = [
  {
    label: "round 0의 후보",
    summary: "hash(B41ʹ) 칸에 미리 실행",
    note: "Prepare나 Process에서 proposal B41ʹ(가정)을 미리 실행해 둘 수 있습니다. 결과는 그 block hash로 이름 붙인 칸에만 들어가고 durable S40은 그대로입니다.",
    slots: [
      { name: "hash(B41ʹ)", tag: "C(B41ʹ) 보관", state: "cached" },
      { name: "빈 칸", tag: "", state: "empty" },
    ],
    execute: "S40 유지",
    executeOn: false,
  },
  {
    label: "round 1의 다른 후보",
    summary: "hash(B41) 칸을 따로 둠",
    note: "같은 높이에서 다음 round의 proposal B41이 오면 다른 hash로 또 한 칸을 씁니다. 두 후보는 서로를 덮어쓰지 않으며, 칸 수에는 메모리 상한을 둬야 합니다.",
    slots: [
      { name: "hash(B41ʹ)", tag: "C(B41ʹ) 보관", state: "cached" },
      { name: "hash(B41)", tag: "C(B41) 보관", state: "cached" },
    ],
    execute: "S40 유지",
    executeOn: false,
  },
  {
    label: "B41 결정 → 승격",
    summary: "hash가 같은 칸만 ExecuteTxState로",
    note: "합의가 B41을 결정하면 FinalizeBlock은 hash가 일치하는 C(B41)만 ExecuteTxState로 승격합니다. 결정되지 않은 C(B41ʹ)은 버립니다.",
    slots: [
      { name: "hash(B41ʹ)", tag: "결정 안 됨 · 버림", state: "dropped" },
      { name: "hash(B41)", tag: "승격", state: "promoted" },
    ],
    execute: "S41 · A41 (memory)",
    executeOn: true,
  },
  {
    label: "이미 버렸다면",
    summary: "FinalizeBlock이 B41을 다시 실행",
    note: "C(B41)을 이미 버렸다면 승격할 칸이 없습니다. 이때는 FinalizeBlock이 S40에서 B41을 다시 실행하며, 실행이 결정적이므로 같은 S41에 도착합니다. 어느 경우든 durable state는 Commit 전까지 h40입니다.",
    slots: [
      { name: "hash(B41ʹ)", tag: "버림", state: "dropped" },
      { name: "hash(B41)", tag: "이미 버림", state: "dropped" },
    ],
    execute: "S40 + B41 재실행 → S41",
    executeOn: true,
  },
];

const SLOT_CLASS: Record<Slot["state"], string> = {
  empty: "border-dashed border-border text-muted-foreground",
  cached: "border-border bg-background",
  promoted: "border-primary bg-primary/10 text-primary",
  dropped: "border-dashed border-border text-muted-foreground line-through decoration-1",
};

export default function CandidateCacheViz() {
  return (
    <SceneShell
      eyebrow="Candidate state · block hash별 격리"
      title="한 높이의 여러 후보가 어떻게 섞이지 않을까요?"
      description="Candidate는 Prepare·Process가 proposal을 미리 실행해 둔 결과입니다. 위는 hash별 후보 cache, 아래는 FinalizeBlock이 쓰는 ExecuteTxState와 디스크의 durable state입니다."
      note="B41ʹ, round 번호, 칸 두 개는 설명용 가정입니다. 미리 실행은 선택 사항이며 candidate path는 외부 side effect를 실행하면 안 됩니다."
      ariaLabel="block hash로 격리한 candidate cache에서 결정된 block의 후보만 승격되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid gap-3 text-xs sm:text-sm">
            <div className="rounded-lg border border-border p-3">
              <span className="text-[10px] font-black text-muted-foreground">CANDIDATE CACHE · 상한 있음</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {scene.slots.map((slot, index) => (
                  <div key={index} className={`min-w-0 rounded-md border p-2.5 ${SLOT_CLASS[slot.state]}`}>
                    <span className="block font-mono text-[11px] font-bold">{slot.name}</span>
                    <span className="mt-1 block min-h-5 break-keep font-semibold">{slot.tag}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-muted-foreground" aria-hidden>
              ↓ {scene.executeOn ? "FinalizeBlock(B41)" : "아직 결정 전"}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className={`min-w-0 rounded-md border p-2.5 ${scene.executeOn ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                <span className="block text-[10px] font-black text-muted-foreground">EXECUTE TX STATE</span>
                <span className="mt-1 block break-keep font-semibold">{scene.execute}</span>
              </div>
              <div className="min-w-0 rounded-md border border-border bg-background p-2.5">
                <span className="block text-[10px] font-black text-muted-foreground">DURABLE</span>
                <span className="mt-1 block font-semibold">h40 · S40</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
