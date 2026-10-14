import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 4096 token pool 하나에 같은 요청(입력 200, 상한 1,000, 실제 출력 300)을 넣을 때
 * 엔진마다 처음에 몇 개를 받고 각 요청이 얼마를 떼어 가는지 같은 막대 위에 그린다.
 * 한 mechanism: 받는 수 = floor(pool ÷ 요청당 처음 떼는 양). 진한 칸은 끝까지 실제로 쓴 500 token이다.
 */
const POOL = 4096;
const SCENES = ["TensorRT-LLM 기본", "SGLang 첫 판정", "vLLM 받을 때", "vLLM 500 token 때", "llama.cpp 4 slot"] as const;

interface Scene {
  perRequest: number;
  written: number;
  count: number;
  waiting: string;
  note: string;
}

const STATES: readonly Scene[] = [
  {
    perRequest: 1216,
    written: 500,
    count: 3,
    waiting: "넷째는 대기",
    note: "200+1,000=1,200 token을 32칸 block 38개로 미리 떼어 1,216칸씩 잡습니다. 3개가 3,648칸을 잡고 끝까지 실제로 쓰는 것은 1,500칸입니다.",
  },
  {
    perRequest: 1201,
    written: 500,
    count: 3,
    waiting: "넷째는 대기",
    note: "새 요청은 입력 200과 상한 1,000에 page 1칸을 더한 1,201칸으로 셉니다. 실행 중 요청의 남은 출력에만 비율을 곱하므로 몇 step 뒤 넷째가 들어옵니다.",
  },
  {
    perRequest: 208,
    written: 200,
    count: 19,
    waiting: "20번째는 대기",
    note: "입력 200만 16칸 block 13개(208칸)로 받습니다. 출력 몫은 떼지 않으므로 19개가 한꺼번에 들어갑니다.",
  },
  {
    perRequest: 512,
    written: 500,
    count: 8,
    waiting: "11개 선점",
    note: "모두 500 token까지 자라면 요청마다 block 32개가 필요해 8개만 남습니다. 나머지 11개는 KV를 비우고 대기열로 돌아가 나중에 다시 계산합니다.",
  },
  {
    perRequest: 1024,
    written: 500,
    count: 4,
    waiting: "다섯째는 slot 대기",
    note: "-np 4로 나눈 slot마다 1,024칸을 고정으로 갖습니다. 요청은 slot 안에서만 자라므로 4개가 돌고 나머지는 빈 slot을 기다립니다.",
  },
];

export default function InferenceEngineDesignAxesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const state = STATES[scene];
  const used = state.count * state.perRequest;
  const written = state.count * state.written;
  const segments = Array.from({ length: state.count }, (_, index) => index);

  return (
    <VizFrame
      eyebrow="Admission reservation"
      title="같은 요청이라도 처음에 떼는 양이 받는 수를 정합니다"
      description="막대 하나가 4,096 token짜리 KV pool입니다. 칸 하나가 요청 하나가 잡은 몫이고, 그 안의 진한 부분이 실제로 써 넣은 token입니다."
      note="pool 4,096과 요청 모양은 설명용 가정입니다. SGLang은 첫 판정만 그렸고 llama.cpp는 unified KV를 끈 경우입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="엔진별 KV pool 예약량과 받는 요청 수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 flex h-12 w-full overflow-hidden rounded-sm border border-border bg-muted/40">
            {segments.map((index) => (
              <div
                key={index}
                className="relative h-full shrink-0 border-r border-background transition-[width] duration-500"
                style={{ width: `${(state.perRequest / POOL) * 100}%`, backgroundColor: "#93c5fd66" }}
              >
                <div
                  className="absolute inset-y-0 left-0 transition-[width] duration-500"
                  style={{ width: `${(state.written / state.perRequest) * 100}%`, backgroundColor: "#2563eb" }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>0</span>
            <span>4,096</span>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">받은 요청</dt>
              <dd className="font-bold text-foreground">{state.count}개</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">요청당 몫</dt>
              <dd className="font-bold text-foreground">{state.perRequest.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">잡은 칸 · 쓴 칸</dt>
              <dd className="font-bold text-foreground">
                {used.toLocaleString()} · {written.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">나머지</dt>
              <dd className="font-bold text-foreground">{state.waiting}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
