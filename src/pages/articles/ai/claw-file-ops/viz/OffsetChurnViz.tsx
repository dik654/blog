import SceneShell from "./SceneShell";

/**
 * 본문 대응: #search "Offset은 cursor가 아니며 repository 변경을 감지하지 않는다".
 * head_limit 3(가정). 1차 요청 offset 0 → 결과 vector [A,B,C,D,E]의 앞 3개.
 * 그 사이 새 file N이 vector 앞쪽에 생기면(가정) 2차 offset 3 → [C,D,E] → C 중복.
 * 대신 A가 삭제되면 2차 vector [B,C,D,E]에서 offset 3 → [E] → D 누락.
 */
type Slot = { name: string; mark: "none" | "new" | "gone" };

const FIRST: readonly Slot[] = ["A", "B", "C", "D", "E"].map((name) => ({ name, mark: "none" as const }));

const SCENES = [
  {
    label: "1차 · offset 0",
    summary: "받은 결과 A B C",
    second: null,
    received: ["A", "B", "C"],
    dup: [] as readonly string[],
    missing: [] as readonly string[],
    note: "처음 만든 결과 vector에서 offset 0부터 head_limit 3개를 잘라 A·B·C를 받습니다. 순서와 개수는 설명을 위한 가정입니다.",
  },
  {
    label: "그 사이 file 추가",
    summary: "vector가 N A B C D E로 바뀜",
    second: [{ name: "N", mark: "new" }, ...FIRST] as readonly Slot[],
    received: ["A", "B", "C"],
    dup: [] as readonly string[],
    missing: [] as readonly string[],
    note: "다음 요청 전에 새 file N이 생겨 결과 vector의 앞쪽에 들어갔다고 가정합니다. offset은 이 변화를 모릅니다. query digest나 snapshot identity가 offset에 들어 있지 않기 때문입니다.",
  },
  {
    label: "2차 · offset 3 (추가 뒤)",
    summary: "C가 두 번 · 중복",
    second: [{ name: "N", mark: "new" }, ...FIRST] as readonly Slot[],
    received: ["A", "B", "C", "C", "D", "E"],
    dup: ["C"] as readonly string[],
    missing: ["N"] as readonly string[],
    note: "2차 요청은 새로 만든 vector에 skip 3을 적용해 C·D·E를 받습니다. C는 이미 받은 결과이고, 앞에 끼어든 N은 어느 page에도 없습니다.",
  },
  {
    label: "2차 · offset 3 (삭제 뒤)",
    summary: "D를 못 받음 · 누락",
    second: [{ name: "A", mark: "gone" }, ...FIRST.slice(1)] as readonly Slot[],
    received: ["A", "B", "C", "E"],
    dup: [] as readonly string[],
    missing: ["D"] as readonly string[],
    note: "반대로 A가 지워지면 vector는 B·C·D·E가 되고, skip 3 뒤에는 E만 남습니다. D는 한 번도 받지 못합니다. 그래서 본문은 offset 대신 새 glob·path·regex 조건으로 좁히라고 권합니다.",
  },
] as const;

const SLOTS = 6;

function SlotRow({ title, slots, windowStart }: { title: string; slots: readonly Slot[] | null; windowStart: number }) {
  const live = (slots ?? []).filter((slot) => slot.mark !== "gone");
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-muted-foreground">{title}</p>
      <div className="mt-1 grid grid-cols-6 gap-1">
        {Array.from({ length: SLOTS }, (_, i) => {
          const slot = slots?.[i];
          const liveIndex = slot && slot.mark !== "gone" ? live.indexOf(slot) : -1;
          const inWindow = liveIndex >= windowStart && liveIndex < windowStart + 3;
          const base = !slot
            ? "border-dashed border-border/40 text-transparent"
            : slot.mark === "gone"
              ? "border-dashed border-[#dc2626] text-[#dc2626] line-through"
              : inWindow
                ? "border-[#2563eb] bg-[#dbeafe] font-bold text-[#1e3a8a] dark:bg-[#172554] dark:text-[#bfdbfe]"
                : "border-border text-foreground";
          return (
            <span key={i} className={`flex h-8 items-center justify-center rounded border font-mono text-xs ${base}`}>
              {slot ? slot.name : "·"}
              {slot?.mark === "new" ? <sup className="ml-0.5 text-[9px] text-[#059669]">new</sup> : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function OffsetChurnViz() {
  return (
    <SceneShell
      eyebrow="Offset paging"
      title="offset은 위치만 기억하고 무엇을 봤는지는 모른다"
      description="파란 칸이 그 요청에서 잘라 받은 page입니다. head_limit 3과 결과 순서 A~E는 가정이며, offset은 만들어진 vector에 skip을 적용합니다."
      note="hardening된 pagination은 stable ordering·query digest·snapshot version을 cursor에 묶어야 한다는 것이 본문의 방향입니다."
      ariaLabel="file 추가와 삭제 뒤 같은 offset이 중복과 누락을 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        const secondWindow = active >= 2 ? 3 : -10;
        return (
          <div className="min-w-0 space-y-3">
            <SlotRow title="1차 요청 때 결과 vector" slots={FIRST} windowStart={0} />
            <SlotRow title="2차 요청 때 결과 vector" slots={scene.second} windowStart={secondWindow} />
            <div className="rounded border border-border px-2 py-2 text-xs leading-6">
              <span className="font-bold text-muted-foreground">agent가 받은 것 </span>
              <span className="font-mono">
                {scene.received.map((name, i) => (
                  <span
                    key={`${name}-${i}`}
                    className={`mr-1 inline-block rounded px-1 ${
                      scene.dup.includes(name) && i >= 3 ? "bg-[#fef3c7] font-bold text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]" : ""
                    }`}
                  >
                    {name}
                  </span>
                ))}
              </span>
              <span className="block text-muted-foreground">
                {scene.missing.length > 0 ? `한 번도 못 받은 file: ${scene.missing.join(", ")}` : "아직 비교할 2차 page 없음"}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
