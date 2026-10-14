import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 가상 token 20개짜리 soft prompt가 요청 수에 따라 쓰는 KV를 LoRA adapter 하나의 무게와 비교한다.
 * 한 mechanism: soft prompt의 비용은 표(160 KiB)보다 요청마다 생기는 KV(20 × 128 KiB)에서 커진다.
 */
const SCENES = ["요청 하나", "같은 task 100개", "앞부분 KV를 공유", "LoRA 하나와 비교"] as const;

const SCALE = 260;

interface Bar {
  label: string;
  mib: number;
  color: string;
}

const STATES: readonly { bars: Bar[]; note: string }[] = [
  {
    bars: [
      { label: "embedding 표 20행", mib: 0.15625, color: "#64748b" },
      { label: "요청 1개의 가상 token KV", mib: 2.5, color: "#d97706" },
    ],
    note: "표는 20×4,096×2 byte=160 KiB뿐입니다. 하지만 가상 token 20개는 진짜 입력처럼 32층 전부의 K·V를 남겨 요청 하나에 2.5 MiB를 씁니다.",
  },
  {
    bars: [
      { label: "embedding 표 20행", mib: 0.15625, color: "#64748b" },
      { label: "요청 100개, 공유 없음", mib: 250, color: "#d97706" },
    ],
    note: "같은 soft prompt를 쓰는 요청 100개가 동시에 돌고 앞부분을 공유하지 않으면 2.5 MiB×100=250 MiB입니다. 표는 한 벌이어도 KV는 요청 수만큼 늘어납니다.",
  },
  {
    bars: [
      { label: "embedding 표 20행", mib: 0.15625, color: "#64748b" },
      { label: "요청 100개, 앞 20칸 공유", mib: 2.5, color: "#d97706" },
    ],
    note: "soft prompt가 입력 맨 앞에 있고 prefix cache가 같은 표를 같은 key로 알아보면 앞 20칸의 KV는 한 벌만 남깁니다. key 조건은 13절에서 봅니다.",
  },
  {
    bars: [
      { label: "LoRA rank 16 adapter 1개", mib: 26, color: "#0d9488" },
      { label: "soft prompt KV, 요청 10개", mib: 25, color: "#d97706" },
      { label: "soft prompt KV, 요청 11개", mib: 27.5, color: "#d97706" },
    ],
    note: "공유하지 않을 때 26÷2.5=10.4이므로 같은 task 요청이 11개 이상 동시에 돌면 soft prompt 쪽 KV가 LoRA 가중치보다 커집니다.",
  },
];

export default function SoftPromptKvViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const state = STATES[scene];
  const scale = scene === 3 ? 30 : SCALE;

  return (
    <VizFrame
      eyebrow="Soft prompt cost"
      title="soft prompt는 표가 작아도 요청마다 KV를 씁니다"
      description="막대는 MiB입니다. 1~3장면은 260 MiB, 4장면은 30 MiB를 가득 찬 길이로 둡니다."
      note="한 token의 KV 128 KiB는 32층·KV head 8·head 128·BF16 가정에서 나옵니다. text 입력의 KV는 두 방식에 같으므로 빼고 셉니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="soft prompt가 쓰는 KV"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <ol className="mt-4 min-h-[10rem] space-y-4">
            {state.bars.map((bar) => (
              <li key={bar.label} className="min-w-0">
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="font-bold" style={{ color: bar.color }}>
                    {bar.label}
                  </span>
                  <span className="shrink-0 font-mono text-muted-foreground">
                    {bar.mib < 1 ? `${Math.round(bar.mib * 1024)} KiB` : `${bar.mib} MiB`}
                  </span>
                </div>
                <div className="mt-1 h-5 rounded-sm bg-muted/60">
                  <div
                    className="h-full rounded-sm transition-[width] duration-500"
                    style={{
                      width: `${Math.max(Math.min((bar.mib / scale) * 100, 100), 0.8)}%`,
                      backgroundColor: bar.color,
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
