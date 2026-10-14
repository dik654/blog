import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 아무도 쓰지 않는 재사용 block 다섯 개가 GPU에 남아 있을 때 새 빈칸이 필요하면 무엇을 먼저 꺼내는지 따라간다.
 * TensorRT-LLM: 우선순위별 queue(0~100), 낮은 queue부터, 같은 queue 안은 오래된 것부터.
 * 꺼낸 block의 우선순위가 offload 하한(C++ 기본 30) 이상이면 호스트로 내려 계속 재사용 후보로 남긴다.
 */
const SCENES = ["남아 있는 block", "첫 빈칸 요청", "둘째 빈칸 요청", "vLLM 한 줄 LRU"] as const;

type Fate = "gpu" | "dropped" | "host";
interface Block {
  name: string;
  priority: number;
  age: number; // 작을수록 오래전에 마지막 사용
}

const BLOCKS: Block[] = [
  { name: "system A", priority: 90, age: 1 },
  { name: "대화 B", priority: 35, age: 2 },
  { name: "대화 C", priority: 35, age: 4 },
  { name: "생성 D", priority: 10, age: 3 },
  { name: "생성 E", priority: 10, age: 5 },
];

const FATES: Record<number, Record<string, Fate>> = {
  0: {},
  1: { "생성 D": "dropped" },
  2: { "생성 D": "dropped", "생성 E": "dropped" },
};

const QUEUES = [10, 35, 90] as const;

const NOTES = [
  "block 다섯 개가 아무 요청에도 묶이지 않은 채 GPU에 남아 있습니다. 숫자 1이 가장 오래전에 쓴 block입니다. system prompt A는 가장 오래됐지만 우선순위 90입니다.",
  "빈칸 하나가 필요하면 가장 낮은 우선순위 10의 queue부터 봅니다. 그 안에서 더 오래된 D를 꺼냅니다. 10은 offload 하한 30보다 낮아 호스트로 내리지 않고 그대로 지웁니다.",
  "하나 더 필요하면 우선순위 10의 E를 지웁니다. 우선순위 35인 B·C는 그다음이고, 꺼낼 때 30 이상이므로 호스트로 내려 재사용 후보로 남습니다. A는 끝까지 남습니다.",
  "vLLM free queue에는 우선순위 칸이 없습니다. 가장 오래된 A부터 꺼내므로 같은 두 칸 요청에서 A와 B가 사라집니다. 오래 묵은 system prompt를 지키려면 다른 장치가 필요합니다.",
] as const;

const FATE_STYLE: Record<Fate, string> = {
  gpu: "border-primary/60 bg-primary/10 text-foreground",
  dropped: "border-dashed border-rose-500/70 text-rose-600 line-through dark:text-rose-400",
  host: "border-dashed border-amber-500/70 text-amber-700 dark:text-amber-400",
};

export default function RetentionQueueViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const fates = FATES[scene] ?? {};
  const vllmGone = scene === 3 ? new Set(["system A", "대화 B"]) : new Set<string>();

  return (
    <VizFrame
      eyebrow="Priority retention"
      title="재사용 block을 지울 때 우선순위가 오래된 순서보다 먼저입니다"
      description="TensorRT-LLM은 우선순위마다 줄을 따로 둡니다. 각 칸의 숫자는 마지막 사용 순서이며 1이 가장 오래됐습니다."
      note="우선순위 90과 10은 요청이 retention 설정으로 붙였다고 가정한 값입니다. 35는 문서의 기본값입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="우선순위별 재사용 block 제거 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          {scene < 3 ? (
            <div className="mt-4 grid min-h-[10rem] content-start gap-3">
              {QUEUES.map((priority) => (
                <div key={priority} className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
                  <p className="font-mono text-xs text-muted-foreground">우선순위 {priority}</p>
                  <div className="flex min-h-[2.5rem] flex-wrap gap-2">
                    {BLOCKS.filter((block) => block.priority === priority)
                      .sort((a, b) => a.age - b.age)
                      .map((block) => {
                        const fate = fates[block.name] ?? "gpu";
                        return (
                          <span key={block.name} className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-bold ${FATE_STYLE[fate]}`}>
                            <span className="font-mono">{block.age}</span> {block.name}
                          </span>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 grid min-h-[10rem] content-start gap-3">
              <p className="font-mono text-xs text-muted-foreground">free queue 앞(먼저 꺼냄) → 뒤</p>
              <div className="flex min-h-[2.5rem] flex-wrap gap-2">
                {[...BLOCKS]
                  .sort((a, b) => a.age - b.age)
                  .map((block) => (
                    <span
                      key={block.name}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-bold ${
                        vllmGone.has(block.name) ? FATE_STYLE.dropped : FATE_STYLE.gpu
                      }`}
                    >
                      <span className="font-mono">{block.age}</span> {block.name}
                    </span>
                  ))}
              </div>
              <p className="min-h-[2.5rem] text-xs text-muted-foreground">우선순위 칸 없음</p>
            </div>
          )}

          <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">지운 block</dt>
              <dd className="font-bold text-foreground">{["없음", "D", "D, E", "A, B"][scene]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">offload 하한</dt>
              <dd className="font-bold text-foreground">{scene === 3 ? "—" : "30 이상"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">A의 상태</dt>
              <dd className="font-bold text-foreground">{scene === 3 ? "지워짐" : "GPU에 남음"}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[12rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[5.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
