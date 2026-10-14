import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 같은 104 MiB를 고정 슬롯 넷으로 나눌 때와 8 KiB page로 나눌 때 남는 자리를 비교한다.
 * 한 mechanism: 고정 슬롯은 max_lora_rank 크기를 잡고, page pool은 실제 rank만큼만 잡아 나머지를 KV에 준다.
 */
const SCENES = ["슬롯 넷을 미리 잡음", "rank 8 둘과 rank 16 둘", "같은 104 MiB를 page로", "rank 16 하나가 내려감"] as const;

const TOTAL = 104;

interface Segment {
  label: string;
  mib: number;
  kind: "adapter" | "idle" | "kv";
}

const SLOT_EMPTY: Segment[] = [0, 1, 2, 3].map((index) => ({ label: `슬롯 ${index}`, mib: 26, kind: "idle" }));

const STATES: readonly { segments: Segment[]; note: string; kvTokens: number; idle: number }[] = [
  {
    segments: SLOT_EMPTY,
    idle: 104,
    kvTokens: 0,
    note: "max_loras=4, max_lora_rank=16이면 시작할 때 adapter 네 개 분량 4×26 MiB=104 MiB를 잡습니다. 이 자리는 adapter가 없어도 KV로 넘어가지 않습니다.",
  },
  {
    segments: [
      { label: "r8", mib: 13, kind: "adapter" },
      { label: "빈칸", mib: 13, kind: "idle" },
      { label: "r8", mib: 13, kind: "adapter" },
      { label: "빈칸", mib: 13, kind: "idle" },
      { label: "r16", mib: 26, kind: "adapter" },
      { label: "r16", mib: 26, kind: "adapter" },
    ],
    idle: 26,
    kvTokens: 0,
    note: "rank 8 adapter는 13 MiB이지만 rank 16 크기의 슬롯에 들어갑니다. 실제 사용 78 MiB, 슬롯 안에 묶인 빈칸 26 MiB입니다.",
  },
  {
    segments: [
      { label: "r8", mib: 13, kind: "adapter" },
      { label: "r8", mib: 13, kind: "adapter" },
      { label: "r16", mib: 26, kind: "adapter" },
      { label: "r16", mib: 26, kind: "adapter" },
      { label: "KV", mib: 26, kind: "kv" },
    ],
    idle: 0,
    kvTokens: 208,
    note: "8 KiB page로 나누면 adapter는 1,664·1,664·3,328·3,328 page만 씁니다. 남은 3,328 page, 26 MiB는 KV 208 token 자리가 됩니다.",
  },
  {
    segments: [
      { label: "r8", mib: 13, kind: "adapter" },
      { label: "r8", mib: 13, kind: "adapter" },
      { label: "r16", mib: 26, kind: "adapter" },
      { label: "KV", mib: 52, kind: "kv" },
    ],
    idle: 0,
    kvTokens: 416,
    note: "다음 batch에 필요 없는 rank 16 adapter를 내리면 그 3,328 page가 곧바로 KV 쪽으로 돌아갑니다. KV 자리는 416 token이 됩니다.",
  },
];

const KIND_COLOR = {
  adapter: "#0d9488",
  idle: "#cbd5e1",
  kv: "#2563eb",
} as const;

export default function AdapterMemoryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const state = STATES[scene];
  const used = state.segments.filter((segment) => segment.kind === "adapter").reduce((sum, segment) => sum + segment.mib, 0);

  return (
    <VizFrame
      eyebrow="Adapter memory"
      title="고정 슬롯은 최대 rank만큼, page pool은 실제 rank만큼 자리를 잡습니다"
      description="가로 막대 하나가 104 MiB입니다. 청록은 adapter, 회색은 묶인 빈칸, 파랑은 KV가 쓸 수 있는 자리입니다."
      note="한 token의 KV는 128 KiB, page 하나는 hidden 4,096개 BF16인 8 KiB로 둔 가정입니다. 두 방식의 GPU 총량은 같게 맞췄습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="adapter 메모리 배치 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <p className="mt-4 text-xs font-semibold text-muted-foreground">
            {scene < 2 ? "고정 슬롯 (vLLM stacked buffer)" : "공용 page pool (S-LoRA Unified Paging)"}
          </p>
          <div className="mt-2 flex h-12 w-full overflow-hidden rounded-sm border border-border">
            {state.segments.map((segment, index) => (
              <div
                key={`${segment.label}-${index}`}
                className="flex items-center justify-center border-r border-background text-[11px] font-bold transition-[width] duration-500 last:border-r-0"
                style={{
                  width: `${(segment.mib / TOTAL) * 100}%`,
                  backgroundColor: KIND_COLOR[segment.kind],
                  color: segment.kind === "idle" ? "#334155" : "#ffffff",
                }}
              >
                {segment.label}
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>0</span>
            <span>104 MiB</span>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">adapter</dt>
              <dd className="font-bold text-foreground">{used} MiB</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">묶인 빈칸</dt>
              <dd className="font-bold text-foreground">{state.idle} MiB</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">KV 자리</dt>
              <dd className="font-bold text-foreground">{state.kvTokens} token</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
