import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #moe-vram-serving-tradeoff — batch 가 커질수록 한 층이 읽는 expert 합집합이 커진다.
 * 한 mechanism: Kimi K2.5 의 MoE 층 하나(routed expert E=384, top-k=8)에서 B 개 token 이 각자 8 개를 고르면
 * 적어도 한 token 이 고른 expert 수의 기대값은 E·(1−(1−k/E)^B) 이다.
 * B=1 → 8, 16 → 약 110(29%), 64 → 약 284(74%), 128 → 약 358(93%). 값은 균등·독립 routing 가정의 계산값이다.
 * 칸 배치는 결정적 의사난수 순서이며 실제 router 가 고른 번호가 아니다.
 */
const E = 384;
const K = 8;
const COLS = 24;
const ROWS = E / COLS;
const CELL = 12;
const GAP = 2;
const PITCH = CELL + GAP;

const expected = (b: number) => E * (1 - (1 - K / E) ** b);

/** 0..383 을 고정 seed 로 섞은 순서. 장면마다 앞에서 n 개를 켜므로 큰 B 의 칸은 작은 B 의 칸을 포함합니다. */
const ORDER: readonly number[] = (() => {
  const order = Array.from({ length: E }, (_, i) => i);
  let seed = 20261103;
  for (let i = E - 1; i > 0; i -= 1) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
})();

interface Scene {
  label: string;
  batch: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "B = 1 · 단일 스트림",
    batch: 1,
    note: "token 하나가 384개 중 8개를 고릅니다. 이 층이 읽는 routed expert weight는 2% 남짓이고, 이 순간에만 'MoE는 active parameter만 읽는다'가 그대로 맞습니다.",
  },
  {
    label: "B = 16",
    batch: 16,
    note: "16개 token이 각자 8개를 고르면 겹치는 선택이 있어도 합집합은 약 110개로 커집니다. 한 step이 읽는 routed weight가 단일 스트림의 열네 배쯤 됩니다.",
  },
  {
    label: "B = 64",
    batch: 64,
    note: "합집합이 약 284개, 전체의 74%입니다. step당 읽기는 이미 1T 쪽에 가깝고, 대신 그 읽기를 64개 token이 나눠 냅니다.",
  },
  {
    label: "B = 128",
    batch: 128,
    note: "약 358개, 93%가 켜집니다. 처리량을 정하는 것은 이제 거의 전체 weight 읽기와 expert GEMM이 얼마나 꽉 차는지입니다. token당 몫은 3개 아래로 내려갑니다.",
  },
];

function ExpertGrid({ lit }: { lit: number }) {
  const on = new Set(ORDER.slice(0, lit));
  return (
    <svg
      viewBox={`0 0 ${COLS * PITCH - GAP} ${ROWS * PITCH - GAP}`}
      className="h-auto w-full max-w-[22rem]"
      role="img"
      aria-label={`routed expert 384개 중 ${lit}개를 읽음`}
    >
      {Array.from({ length: E }, (_, id) => {
        const x = (id % COLS) * PITCH;
        const y = Math.floor(id / COLS) * PITCH;
        const active = on.has(id);
        return (
          <rect
            key={id}
            x={x}
            y={y}
            width={CELL}
            height={CELL}
            rx={2}
            fill={active ? "#2563eb" : "#ffffff"}
            stroke={active ? "#1d4ed8" : "#cbd5e1"}
            strokeWidth={1}
            className="transition-[fill] duration-300 motion-reduce:transition-none"
          />
        );
      })}
    </svg>
  );
}

function Ledger({ batch }: { batch: number }) {
  const union = expected(batch);
  const share = union / E;
  const perToken = union / batch;
  return (
    <dl className="grid min-w-0 gap-3 text-xs leading-5">
      <div>
        <dt className="font-bold text-foreground">한 층이 읽는 expert</dt>
        <dd className="font-mono text-base font-bold tabular-nums text-[#1d4ed8]">
          {Math.round(union)} / {E}
        </dd>
        <div className="mt-1 h-2 w-full rounded-[2px] border border-[#cbd5e1] bg-[#ffffff]">
          <div className="h-full rounded-[2px] bg-[#2563eb]" style={{ width: `${share * 100}%` }} />
        </div>
        <dd className="mt-1 text-muted-foreground">전체의 {Math.round(share * 100)}%</dd>
      </div>
      <div>
        <dt className="font-bold text-foreground">token 하나가 떠안는 몫</dt>
        <dd className="font-mono text-base font-bold tabular-nums text-[#0f766e]">
          {perToken.toFixed(1)} expert
        </dd>
        <dd className="text-muted-foreground">합집합 ÷ B</dd>
      </div>
    </dl>
  );
}

export default function ExpertUnionReadViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Batch와 expert 합집합"
      title="batch가 커지면 한 층이 읽는 expert가 전체 쪽으로 차오릅니다"
      description="Kimi K2.5의 MoE 층 하나(routed expert 384개, token당 8개)입니다. 파란 칸은 이번 step에 적어도 한 token이 고른 expert입니다."
      note="칸 수는 균등하고 독립인 routing을 가정한 기대값(계산)이고 칸의 위치는 임의입니다. 실제 router는 쏠림이 있어 합집합이 조금 작을 수 있습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="batch 크기별 expert 합집합"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3 grid items-start gap-5 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
            <ExpertGrid lit={Math.round(expected(scene.batch))} />
            <StableSceneStack
              active={scenes.active}
              scenes={SCENES.map((item) => (
                <Ledger key={item.batch} batch={item.batch} />
              ))}
            />
          </div>
          <StableSceneStack
            className="mt-4"
            active={scenes.active}
            scenes={SCENES.map((item) => (
              <p key={item.batch} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
                {item.note}
              </p>
            ))}
          />
        </div>
        <ol className="static-reading-only mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {SCENES.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>: {item.note}
            </li>
          ))}
        </ol>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
