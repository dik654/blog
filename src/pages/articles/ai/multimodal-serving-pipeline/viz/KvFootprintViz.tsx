import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 사진 자리 하나가 text token 하나와 같은 KV를 쓴다는 사실을 16토큰 block 수로 센다.
 * 한 mechanism: block 수 × 896KiB. 막대 길이는 모든 장면에서 352 block을 100%로 둔 같은 눈금이다.
 */
const SCENES = ["문장 30 token", "사진 한 장", "같은 사진 요청 4개", "앞 86 block 공유"] as const;

const BLOCK_KIB = 896;
const FULL = 352;

interface Bar {
  label: string;
  blocks: number;
  color: string;
}

const BARS: readonly (readonly Bar[])[] = [
  [{ label: "문장", blocks: 2, color: "#9ca3af" }],
  [
    { label: "문장", blocks: 2, color: "#9ca3af" },
    { label: "사진 포함 요청", blocks: 88, color: "#d97706" },
  ],
  [
    { label: "R1", blocks: 88, color: "#d97706" },
    { label: "R2", blocks: 88, color: "#d97706" },
    { label: "R3", blocks: 88, color: "#d97706" },
    { label: "R4", blocks: 88, color: "#d97706" },
  ],
  [
    { label: "공유 앞부분", blocks: 86, color: "#2563eb" },
    { label: "R1~R4 꼬리", blocks: 8, color: "#d97706" },
  ],
];

/** 장면마다 비교의 결론이 되는 KV 양. 막대 합계가 아니라 그 장면이 묻는 대상의 block 수다. */
const SUMMARY: readonly (readonly [string, number])[] = [
  ["문장 하나", 2],
  ["사진 포함 요청 하나", 88],
  ["네 요청 합계", 352],
  ["네 요청 합계", 94],
];

const NOTES = [
  "30 token 문장은 16 token block 두 개에 들어갑니다. block 하나가 896KiB이므로 1.75MiB입니다.",
  "텍스트 15, 표시 token 2, 사진 1,369, 질문 20을 합친 1,406 token은 88 block, 77MiB입니다. 사진이 그중 1,369 자리입니다.",
  "같은 사진을 묻는 요청 네 개가 앞부분을 나눠 쓰지 못하면 88×4=352 block, 308MiB가 필요합니다.",
  "질문이 갈리기 전의 1,376 token인 86 block을 함께 쓰고 요청마다 꼬리 2 block만 가지면 94 block, 82.25MiB입니다.",
] as const;

function mib(blocks: number) {
  const value = (blocks * BLOCK_KIB) / 1024;
  return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2);
}

export default function KvFootprintViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const bars = BARS[scene];
  const [summaryLabel, total] = SUMMARY[scene];

  return (
    <VizFrame
      eyebrow="Image-token KV footprint"
      title="사진 자리도 text token과 같은 KV를 차지합니다"
      description="막대 하나가 요청 또는 공유 구간의 KV block 수입니다. 모든 장면에서 352 block을 100%로 둔 같은 눈금입니다."
      note="Qwen2.5-VL-7B의 28층·KV head 4·head 차원 128·BF16과 16 token block을 가정했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사진 요청의 KV block 수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <ol className="mt-4 min-h-[11.5rem] space-y-3">
            {bars.map((bar, index) => (
              <li key={`${bar.label}-${index}`} className="min-w-0">
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="font-bold" style={{ color: bar.color }}>{bar.label}</span>
                  <span className="font-mono text-muted-foreground">{bar.blocks} block</span>
                </div>
                <div className="mt-1 flex h-4 min-w-0 items-center rounded-sm bg-muted/60">
                  <div
                    className="h-full rounded-sm transition-[width] duration-500"
                    style={{ width: `${Math.max((bar.blocks / FULL) * 100, 0.8)}%`, backgroundColor: bar.color }}
                  />
                </div>
              </li>
            ))}
          </ol>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">{summaryLabel}</dt>
              <dd className="font-bold text-foreground">{total} block</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">KV 크기</dt>
              <dd className="font-bold text-foreground">{mib(total)} MiB</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[8.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
