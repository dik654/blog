import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 500 token까지 자란 요청 하나가 엔진별 저장 단위로 몇 칸을 차지하고 attention이 몇 칸을 읽는지 보여 준다.
 * 한 mechanism: 할당 = ceil(500 ÷ 단위) × 단위, 빈칸 = 할당 − 500. llama.cpp는 할당 대신 읽는 범위가 256 단위로 올라간다.
 */
const TOKENS = 500;
const SCALE = 544;
const SCENES = ["vLLM 16칸", "TensorRT-LLM 32칸", "SGLang 1칸", "llama.cpp cell"] as const;

interface Scene {
  unit: number;
  allocated: number;
  read: number;
  layers: string;
  note: string;
}

const STATES: readonly Scene[] = [
  {
    unit: 16,
    allocated: 512,
    read: 500,
    layers: "층마다 block 32개",
    note: "500 ÷ 16을 올리면 block 32개, 512칸입니다. 마지막 block에 12칸이 빕니다. block 번호는 32개 층이 함께 쓰지만 저장은 층마다 따로 된 tensor에 있습니다.",
  },
  {
    unit: 32,
    allocated: 512,
    read: 500,
    layers: "block 하나에 32개 층",
    note: "500 ÷ 32를 올리면 block 16개, 역시 512칸이고 12칸이 빕니다. block 하나가 32개 층의 K·V를 모두 담아 한 번에 옮길 수 있습니다.",
  },
  {
    unit: 1,
    allocated: 500,
    read: 500,
    layers: "층마다 칸 500개",
    note: "칸이 token 하나라 빈칸이 없습니다. 대신 요청마다 위치→칸 번호 표 한 줄을 들고 다니고, 칸 번호는 흩어져 있을 수 있습니다.",
  },
  {
    unit: 1,
    allocated: 500,
    read: 512,
    layers: "칸에 대화 표시",
    note: "cell 500개를 쓰지만 attention은 앞에서부터 256 단위로 올린 512칸을 읽고, 이 요청 것이 아닌 12칸을 −∞로 지웁니다. 빈칸이 읽기 쪽으로 옮겨 갑니다.",
  },
];

export default function KvUnitTailViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const state = STATES[scene];
  const boundaries =
    state.unit >= 16 ? Array.from({ length: Math.floor(state.allocated / state.unit) }, (_, i) => (i + 1) * state.unit) : [];

  return (
    <VizFrame
      eyebrow="KV storage unit"
      title="저장 단위가 커질수록 마지막 칸이 비고, 단위를 없애면 읽는 쪽이 넓어집니다"
      description="가로 막대는 요청 하나의 KV 자리입니다. 진한 부분은 실제 500 token, 옅은 부분은 잡았지만 비어 있는 칸, 붉은 테두리는 attention이 읽는 범위입니다."
      note="요청 길이 500은 3절의 입력 200과 실제 출력 300을 더한 값입니다. 세로선은 block 경계입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="엔진별 KV 저장 단위와 빈칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="relative mt-4 h-12 w-full rounded-sm border border-border bg-muted/30">
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-500"
              style={{ width: `${(state.allocated / SCALE) * 100}%`, backgroundColor: "#93c5fd66" }}
            />
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-500"
              style={{ width: `${(TOKENS / SCALE) * 100}%`, backgroundColor: "#2563eb" }}
            />
            {boundaries.map((b) => (
              <div
                key={b}
                className="absolute inset-y-0 w-px bg-background/80"
                style={{ left: `${(b / SCALE) * 100}%` }}
              />
            ))}
            <div
              className="absolute -inset-y-1 left-0 rounded-sm border transition-[width] duration-500"
              style={{ width: `${(state.read / SCALE) * 100}%`, borderColor: "#dc2626" }}
            />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>0</span>
            <span>500</span>
            <span>544</span>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">저장 단위</dt>
              <dd className="font-bold text-foreground">{state.unit} token</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">잡은 칸</dt>
              <dd className="font-bold text-foreground">{state.allocated}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">빈칸 · 읽는 칸</dt>
              <dd className="font-bold text-foreground">
                {state.allocated - TOKENS} · {state.read}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">층 배치</dt>
              <dd className="font-bold text-foreground">{state.layers}</dd>
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
