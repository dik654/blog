import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { K25_EXPERTS, K25_TOPK, expectedExperts } from "../data";

/**
 * 한 mechanism: Kimi K2.5 한 MoE 층의 routed expert 384칸 가운데 한 step에서 적어도 한 번 불린 칸.
 * batch B가 커지면 켜지는 칸 수는 E·(1−(1−k/E)^B)로 늘고, token 하나가 나눠 갖는 몫은 줄어든다.
 * 켜지는 칸의 위치는 고정된 의사난수 순서다. 실제 router 분포가 아니라 기대값의 크기만 보인다.
 */
const BATCHES = [1, 16, 64, 128] as const;
const SCENES = BATCHES.map((b) => `동시 ${b}`) as readonly string[];
const COLS = 24;
const ROWS = 16;
const CELL = 11;
const GAP = 1.5;
const LEFT = 8;
const TOP = 8;

/** 같은 화면을 다시 그려도 같은 칸이 켜지도록 고정 seed의 섞기 순서를 쓴다. */
const ORDER = (() => {
  const order = Array.from({ length: K25_EXPERTS }, (_, i) => i);
  let seed = 20261103;
  for (let i = order.length - 1; i > 0; i -= 1) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
})();

const LIT = BATCHES.map((b) => Math.round(expectedExperts(K25_EXPERTS, K25_TOPK, b)));

const NOTES = BATCHES.map((b, index) => {
  const lit = LIT[index];
  const pct = Math.round((lit / K25_EXPERTS) * 100);
  const share = (lit / b).toFixed(1);
  if (b === 1) return `요청 하나는 층마다 384개 중 8개만 읽습니다(2%). 이 경우에만 1T 모델이 활성 32B처럼 가볍게 읽힙니다.`;
  return `동시 ${b}개면 서로 다른 expert가 약 ${lit}개(${pct}%) 불립니다. step 하나가 읽는 양은 늘었고, token 하나가 나눠 갖는 몫은 expert 약 ${share}개 분량으로 줄었습니다.`;
});

export default function ExpertUnionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200, { loop: false });
  const scene = scenes.active;
  const litSet = new Set(ORDER.slice(0, LIT[scene]));

  return (
    <VizFrame
      eyebrow="Expert union per step"
      title="요청이 늘면 MoE 한 층이 읽는 expert가 전체에 가까워집니다"
      description="칸 하나는 Kimi K2.5 한 MoE 층의 routed expert 하나입니다. 색칠한 칸은 현재 step의 요청 가운데 적어도 하나가 고른 expert입니다."
      note="켜지는 칸 수는 router가 고르게 고른다는 가정의 기대값입니다. 실제로는 인기 expert가 겹쳐 조금 적게 켜집니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="batch 크기에 따른 expert 합집합"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")} · <span className="text-sm text-foreground">{SCENES[scene]}</span></p>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center lg:gap-6">
        <svg viewBox="0 0 360 230" className="w-full" role="img" aria-label={`동시 ${BATCHES[scene]}에서 384개 중 ${LIT[scene]}개 expert를 읽습니다`}>
          {Array.from({ length: K25_EXPERTS }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const on = litSet.has(i);
            return (
              <rect
                key={i}
                x={LEFT + col * (CELL + GAP)}
                y={TOP + row * (CELL + GAP)}
                width={CELL}
                height={CELL}
                fill={on ? "#7c3aed" : "#94a3b8"}
                fillOpacity={on ? 0.85 : 0.14}
                style={{ transition: "fill-opacity 300ms" }}
              />
            );
          })}
          <text x={LEFT} y={TOP + ROWS * (CELL + GAP) + 16} fontSize={12} fontWeight={700} fill="currentColor">
            읽는 expert {LIT[scene]} / 384 · token당 몫 {(LIT[scene] / BATCHES[scene]).toFixed(1)}개
          </text>
        </svg>
        <StableSceneStack
          active={scene}
          scenes={NOTES.map((note) => (
            <p key={note} className="border-l border-primary/50 pl-3 text-[13px] leading-6 text-muted-foreground sm:text-sm">{note}</p>
          ))}
        />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
