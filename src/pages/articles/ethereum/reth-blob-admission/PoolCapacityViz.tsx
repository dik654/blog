import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #pool-insertion — validator의 Valid 뒤에도 Pool 규칙과 capacity가 남는다.
 * 칸 = Pool에 들어 있는 후보. 상한 4칸은 설명용 가정이다(실제 size limit은 node 설정).
 * A~D = 이미 Pool에 있던 다른 후보(가정). 어느 후보가 worst인지는 가정으로 정한다.
 */

type SlotState = "kept" | "new" | "worst" | "gone";

interface Slot {
  name: string;
  state: SlotState;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  count: string;
  slots: readonly Slot[];
  sidecar: readonly [string, string];
}

const BASE: readonly Slot[] = [
  { name: "A", state: "kept" },
  { name: "B", state: "kept" },
  { name: "C", state: "kept" },
  { name: "D", state: "kept" },
];

const SCENES: readonly Scene[] = [
  {
    label: "Valid 도착",
    summary: "삽입 시도 자격만 얻음",
    count: "4 / 4",
    slots: [...BASE, { name: "T₀", state: "gone" }],
    sidecar: ["Sidecar", "아직 BlobStore에 넘기지 않음"],
    note: "T₀는 validator에서 ValidWithSidecar를 받았습니다. Reth는 transaction과 sidecar를 다시 나누고 transaction만 Pool에 넣으려 합니다. 이 그림의 Pool은 이미 상한까지 찼다고 가정합니다.",
  },
  {
    label: "Insert",
    summary: "Pool 규칙 통과 · 5 / 4",
    count: "5 / 4",
    slots: [...BASE, { name: "T₀", state: "new" }],
    sidecar: ["Sidecar", "아직 BlobStore에 넘기지 않음"],
    note: "pool.add_transaction은 sender nonce graph, duplicate, replacement 같은 Pool 자체 규칙을 다시 적용합니다. 여기서 거부될 수도 있습니다. 통과하면 T₀가 들어가 상한을 한 칸 넘습니다.",
  },
  {
    label: "Capacity A: 다른 후보 탈락",
    summary: "discard_worst → C 제거",
    count: "5 → 4",
    slots: [
      { name: "A", state: "kept" },
      { name: "B", state: "kept" },
      { name: "C", state: "worst" },
      { name: "D", state: "kept" },
      { name: "T₀", state: "new" },
    ],
    sidecar: ["Sidecar", "T₀는 남음 · 다음 단계에서 전달"],
    note: "Batch를 넣은 뒤 size limit을 넘었으므로 discard_worst가 Pool 기준으로 가장 나쁜 후보를 지웁니다. 이 경우에는 C가 골라졌다고 가정합니다. T₀는 Pool에 남습니다.",
  },
  {
    label: "Capacity B: T₀ 탈락",
    summary: "discard_worst → T₀ 제거",
    count: "5 → 4",
    slots: [...BASE, { name: "T₀", state: "worst" }],
    sidecar: ["Sidecar", "T₀ = DiscardedOnInsert"],
    note: "같은 단계에서 방금 넣은 T₀가 골라질 수도 있습니다. 이때 T₀의 결과는 DiscardedOnInsert입니다. Validator에서 Valid였다는 사실은 바뀌지 않지만 Pool에는 남지 않습니다.",
  },
  {
    label: "Lock 해제 뒤 sidecar",
    summary: "저장 → 탈락 후보 Blob 정리",
    count: "4 / 4",
    slots: [
      { name: "A", state: "kept" },
      { name: "B", state: "kept" },
      { name: "T₀", state: "kept" },
      { name: "D", state: "kept" },
      { name: "빈칸", state: "gone" },
    ],
    sidecar: ["BlobStore", "새 삽입 sidecar 전달 → 탈락 후보 Blob 삭제"],
    note: "Pool write lock(Pool을 바꾸는 동안 다른 작업이 Pool을 못 바꾸게 잡는 잠금)을 놓은 뒤, 새 삽입 metadata의 sidecar를 BlobStore와 listener에 넘깁니다. 이어서 capacity에서 탈락한 후보의 Blob을 지웁니다. 그림은 Capacity A 경우(C 탈락)를 이어 그렸고, 남은 T₀를 상한 안 칸에 옮겨 그렸습니다.",
  },
];

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);

function SlotBox({ slot }: { slot: Slot }) {
  const tone =
    slot.state === "new"
      ? "border-primary bg-primary/10 text-foreground"
      : slot.state === "worst"
        ? "border-dashed border-rose-600 text-rose-700 dark:text-rose-400"
        : slot.state === "gone"
          ? "border-dashed border-border/60 text-muted-foreground/40"
          : "border-border bg-background text-foreground";
  const tag =
    slot.state === "new" ? "방금 삽입" : slot.state === "worst" ? "worst · 제거" : slot.state === "gone" ? "비어 있음" : "보유";
  return (
    <div className={`flex min-w-0 flex-col items-center justify-center rounded-lg border px-1 py-2 text-center ${tone}`}>
      <strong className={`font-mono text-sm ${slot.state === "worst" ? "line-through" : ""}`}>{slot.state === "gone" ? "·" : slot.name}</strong>
      <span className="mt-1 block break-keep text-[10px] leading-4">{tag}</span>
    </div>
  );
}

export default function PoolCapacityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Pool 삽입 · capacity"
      title="Valid였던 T₀도 Pool 상한에서 밀려날 수 있습니다"
      description="칸 하나가 Pool에 든 후보 하나입니다. 점선 세로줄이 size limit이며 그 오른쪽 칸에 후보가 남아 있으면 상한을 넘은 상태입니다. A~D는 이미 있던 다른 후보입니다."
      note="상한 4칸, 후보 A~D, 어느 후보가 worst로 골라지는지는 모두 설명용 가정입니다. 실제 limit은 node 설정이며 worst를 고르는 기준은 이 글의 범위 밖입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Valid transaction T0가 Pool에 삽입된 뒤 capacity 판정과 sidecar 저장을 거치는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />

        <div className="mt-4 min-w-0">
          <div className="flex items-baseline justify-between text-xs text-muted-foreground">
            <span>Transaction Pool</span>
            <span className="font-mono font-bold text-foreground">{scene.count}</span>
          </div>
          <div className="mt-2 grid grid-cols-[repeat(4,minmax(0,1fr))_0.25rem_minmax(0,1fr)] items-stretch gap-1.5 sm:gap-2">
            {scene.slots.slice(0, 4).map((slot) => (
              <SlotBox key={slot.name} slot={slot} />
            ))}
            <div className="flex justify-center" aria-hidden>
              <span className="h-full border-l border-dashed border-rose-600" />
            </div>
            <SlotBox slot={scene.slots[4]} />
          </div>
          <div className="mt-1 grid grid-cols-[repeat(4,minmax(0,1fr))_0.25rem_minmax(0,1fr)] gap-1.5 text-[10px] text-muted-foreground sm:gap-2">
            <span className="col-span-4 text-center">상한 4칸 (가정)</span>
            <span />
            <span className="text-center">5번째 칸</span>
          </div>

          <div className="mt-4 grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)]">
            <span className="font-bold text-primary">{scene.sidecar[0]}</span>
            <span className="break-keep text-muted-foreground">{scene.sidecar[1]}</span>
          </div>
        </div>

        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
