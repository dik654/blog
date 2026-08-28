import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["원본 request", "Fork", "A1 쓰기 · CoW", "A2 쓰기 · 제자리", "A1 종료"] as const;

type Block = { id: string; ref: number; tokens: string; note?: string };

const PHYSICAL: readonly (readonly Block[])[] = [
  [
    { id: "P7", ref: 1, tokens: "16/16" },
    { id: "P2", ref: 1, tokens: "16/16" },
    { id: "P9", ref: 1, tokens: "3/16" },
    { id: "P3", ref: 0, tokens: "free" },
  ],
  [
    { id: "P7", ref: 2, tokens: "16/16" },
    { id: "P2", ref: 2, tokens: "16/16" },
    { id: "P9", ref: 2, tokens: "3/16" },
    { id: "P3", ref: 0, tokens: "free" },
  ],
  [
    { id: "P7", ref: 2, tokens: "16/16" },
    { id: "P2", ref: 2, tokens: "16/16" },
    { id: "P9", ref: 1, tokens: "3/16" },
    { id: "P3", ref: 1, tokens: "4/16", note: "P9 복사 + A1 token" },
  ],
  [
    { id: "P7", ref: 2, tokens: "16/16" },
    { id: "P2", ref: 2, tokens: "16/16" },
    { id: "P9", ref: 1, tokens: "4/16", note: "A2 token 제자리" },
    { id: "P3", ref: 1, tokens: "4/16" },
  ],
  [
    { id: "P7", ref: 1, tokens: "16/16" },
    { id: "P2", ref: 1, tokens: "16/16" },
    { id: "P9", ref: 1, tokens: "4/16" },
    { id: "P3", ref: 0, tokens: "free queue", note: "ref 0 → 반환" },
  ],
];

const TABLES: readonly (readonly { name: string; entries: readonly string[] }[])[] = [
  [{ name: "A", entries: ["P7", "P2", "P9"] }],
  [
    { name: "A1", entries: ["P7", "P2", "P9"] },
    { name: "A2", entries: ["P7", "P2", "P9"] },
  ],
  [
    { name: "A1", entries: ["P7", "P2", "P3"] },
    { name: "A2", entries: ["P7", "P2", "P9"] },
  ],
  [
    { name: "A1", entries: ["P7", "P2", "P3"] },
    { name: "A2", entries: ["P7", "P2", "P9"] },
  ],
  [{ name: "A2", entries: ["P7", "P2", "P9"] }],
];

const NOTES = [
  "35-token prompt는 B=16에서 3 block을 씁니다. P9에는 3 token만 있고 13 slot이 비어 있습니다.",
  "Fork는 block table을 복사하고 세 block의 reference count를 2로 올립니다. 새 block은 하나도 잡지 않습니다.",
  "A1이 첫 output token을 P9에 쓰려 하지만 ref(P9)=2입니다. P3를 받아 P9를 복사하고 자기 table만 P3로 바꿉니다. ref(P9)는 1이 됩니다.",
  "A2가 같은 자리에 쓸 때는 ref(P9)=1이므로 복사 없이 제자리에 씁니다. 복사된 block은 전체에서 하나뿐입니다.",
  "A1이 끝나면 P7·P2는 ref 1로 남고 P3는 ref 0이 되어 free queue로 돌아갑니다. A2의 KV는 손상되지 않습니다.",
] as const;

export default function ForkCopyOnWriteViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const physical = PHYSICAL[scenes.active];
  const tables = TABLES[scenes.active];
  return (
    <VizFrame
      eyebrow="Sequence fork · copy-on-write"
      title="Fork는 block table을 복사하고, 쓰기가 일어나는 block 하나만 물리적으로 복사합니다"
      description="장면마다 두 sample의 block table과 physical block의 reference count가 어떻게 바뀌는지 봅니다. 색이 있는 block은 이번 장면에서 상태가 바뀐 block입니다."
      note="논문 Fig. 8의 절차를 B=16, 35-token prompt에 맞춰 옮긴 그림입니다. 현재 V1은 fork API 대신 prefix cache로 앞부분 block을 공유하므로 복사가 일어나는 지점은 구현마다 다를 수 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Sequence fork와 copy-on-write의 reference count 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {tables.map((table) => (
              <div key={table.name} className="min-w-0 border border-border bg-background px-3 py-3">
                <p className="text-[11px] font-bold text-muted-foreground">Block table · {table.name}</p>
                <div className="mt-2 flex gap-2">
                  {table.entries.map((entry, index) => (
                    <div
                      key={`${table.name}-${index}`}
                      className="flex min-w-0 flex-1 items-center justify-center border border-border/70 py-2 font-mono text-xs font-bold"
                    >
                      {index}:{entry}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[11px] font-bold text-muted-foreground">Physical block · ref count</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {physical.map((block) => {
              const free = block.ref === 0;
              const changed = Boolean(block.note);
              return (
                <div
                  key={block.id}
                  className={`min-h-[5.5rem] min-w-0 border px-3 py-3 ${
                    changed
                      ? "border-primary/60 bg-primary/5"
                      : free
                        ? "border-dashed border-border bg-muted/30 text-muted-foreground"
                        : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-sm font-bold">{block.id}</span>
                    <span className="font-mono text-xs">ref {block.ref}</span>
                  </div>
                  <p className="mt-2 font-mono text-xs">{block.tokens}</p>
                  {block.note && <p className="mt-1 text-[11px] leading-4 text-primary">{block.note}</p>}
                </div>
              );
            })}
          </div>

          <p className="mt-6 min-h-[4.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
