import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: GatedResidual.tsx — 네 갈래 stream의 mix와 주입
 * 한 mechanism: 게이트는 갈래 × 차원마다 0~1 값을 하나씩 만들고, 블록 입력의 한 차원은
 * 네 갈래 값에 그 게이트를 곱해 4로 나눈 평균입니다(Qwen4ExpTextGatedResidual.forward의 .mean(dim=-2)).
 */
const SCENES = ["네 갈래 통로", "게이트 만들기", "한 차원에서 섞기", "블록 계산", "갈래마다 다른 세기로 주입"] as const;

const NOTES = [
  "토큰 하나가 층 사이로 들고 가는 상태는 2,560차원 네 벌, 합쳐서 10,240차원입니다. 막대 하나가 한 갈래입니다.",
  "정규화한 10,240차원을 320차원으로 줄였다가 다시 10,240으로 펼치고 sigmoid로 눌러 0과 1 사이 게이트를 만듭니다. 이 10,240개를 2,560씩 네 갈래로 다시 나눕니다.",
  "블록 입력의 d번째 차원 하나만 떼어 봅니다. 네 갈래의 d번째 값에 각자의 게이트를 곱하고 넷을 더해 4로 나눕니다. 게이트가 0.1인 갈래 3은 값이 커도 거의 들어가지 않습니다.",
  "이렇게 2,560차원 전부를 섞은 벡터 하나가 블록 입력입니다. attention이든 MoE든 블록 내부는 평소처럼 2,560차원 하나만 받습니다.",
  "출력에 갈래별 계수를 곱해 되돌립니다. 계수는 2 × sigmoid라 0과 2 사이이고, 1보다 크면 증폭, 0에 가까우면 그 갈래에는 거의 남지 않습니다.",
] as const;

const STREAM = "#6366f1";
const GATE = "#8b5cf6";
const BLOCK = "#10b981";
const LANES = [0, 1, 2, 3] as const;
/** 한 차원 d에서 네 갈래가 가진 값과 게이트. 설명용 예시 값입니다. */
const X = [0.8, -0.4, 1.2, 0.2] as const;
const G = [0.9, 0.5, 0.1, 0.7] as const;
const PRODUCT = X.map((x, i) => x * G[i]);
const SUM = PRODUCT.reduce((a, b) => a + b, 0);
const MEAN = SUM / 4;
const INJECT = [1.6, 0.9, 0.2, 1.1] as const;

const fmt = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));

function LaneBars({ highlight }: { highlight?: number }) {
  return (
    <div className="space-y-1.5">
      {LANES.map((lane) => (
        <div key={lane} className="grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2">
          <span className="font-mono text-[11px] font-bold" style={{ color: STREAM }}>
            갈래 {lane + 1}
          </span>
          <div className="relative h-5 rounded-sm border" style={{ borderColor: STREAM, backgroundColor: "#eef2ff" }}>
            {highlight !== undefined ? (
              <span className="absolute inset-y-0 w-[3px]" style={{ left: `${highlight}%`, backgroundColor: "#f59e0b" }} />
            ) : null}
            <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[10px] text-[#3730a3]">2,560</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SceneStreams() {
  return (
    <div>
      <LaneBars />
      <p className="mt-3 font-mono text-xs font-bold text-foreground">4 × 2,560 = 10,240차원</p>
    </div>
  );
}

function SceneGate({ reduced }: { reduced: boolean }) {
  const widths = [
    { label: "정규화한 입력", n: "10,240", w: 100, color: STREAM },
    { label: "down", n: "320", w: (320 / 10240) * 100, color: GATE },
    { label: "up · sigmoid", n: "10,240", w: 100, color: GATE },
  ];
  return (
    <div>
      <div className="space-y-2">
        {widths.map((row, i) => (
          <div key={row.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground">{row.label}</span>
            <div className="flex items-center gap-2">
              <motion.div
                className="h-4 rounded-sm border"
                style={{ borderColor: row.color, backgroundColor: i === 0 ? "#eef2ff" : "#f3e8ff" }}
                initial={{ width: 0 }}
                animate={{ width: `calc(${row.w}% - ${i === 1 ? 0 : 3.5}rem)` }}
                transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : i * 0.35 }}
              />
              <span className="shrink-0 font-mono text-[10px] font-bold" style={{ color: row.color }}>
                {row.n}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] font-bold text-muted-foreground">게이트 10,240개를 갈래마다 2,560개로 나눔</p>
      <div className="mt-1 grid grid-cols-4 gap-1.5">
        {LANES.map((lane) => (
          <motion.div
            key={lane}
            className="flex h-8 items-center justify-center rounded-sm border font-mono text-[10px] font-bold"
            style={{ borderColor: GATE, color: "#6b21a8", backgroundColor: "#faf5ff" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 1.1 + lane * 0.12 }}
          >
            g{lane + 1} · 2,560
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SceneMix({ reduced }: { reduced: boolean }) {
  const head = "grid grid-cols-[3.75rem_repeat(3,minmax(0,1fr))] items-center gap-1.5";
  return (
    <div>
      <div className={`${head} text-[10px] font-bold text-muted-foreground`}>
        <span>d번째</span>
        <span className="text-center">값 x</span>
        <span className="text-center">게이트 g</span>
        <span className="text-center">g × x</span>
      </div>
      <div className="mt-1 space-y-1">
        {LANES.map((lane) => (
          <div key={lane} className={head}>
            <span className="font-mono text-[11px] font-bold" style={{ color: STREAM }}>
              갈래 {lane + 1}
            </span>
            <span className="rounded-sm border py-1 text-center font-mono text-[11px]" style={{ borderColor: STREAM, backgroundColor: "#eef2ff" }}>
              {fmt(X[lane])}
            </span>
            <span className="relative overflow-hidden rounded-sm border py-1 text-center font-mono text-[11px]" style={{ borderColor: GATE }}>
              <span className="absolute inset-y-0 left-0" style={{ width: `${G[lane] * 100}%`, backgroundColor: "#ede9fe" }} />
              <span className="relative">{G[lane].toFixed(1)}</span>
            </span>
            <motion.span
              className="rounded-sm border py-1 text-center font-mono text-[11px] font-bold"
              style={{ borderColor: BLOCK, color: "#065f46" }}
              initial={{ opacity: 0, backgroundColor: "rgba(16,185,129,0)" }}
              animate={{ opacity: 1, backgroundColor: "rgba(16,185,129,0.12)" }}
              transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.3 + lane * 0.3 }}
            >
              {fmt(PRODUCT[lane])}
            </motion.span>
          </div>
        ))}
      </div>
      <motion.div
        className="mt-2 flex flex-wrap items-baseline justify-end gap-x-2 border-t border-border pt-2 font-mono text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 1.6 }}
      >
        <span className="text-muted-foreground">합 {fmt(SUM)} ÷ 4 =</span>
        <span className="rounded-sm border px-2 py-0.5 font-bold" style={{ borderColor: BLOCK, color: "#065f46", backgroundColor: "#d1fae5" }}>
          블록 입력 d = {MEAN.toFixed(3)}
        </span>
      </motion.div>
    </div>
  );
}

function SceneBlock() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
      <div className="rounded-sm border px-2 py-3 text-center font-mono text-[11px] font-bold" style={{ borderColor: BLOCK, color: "#065f46", backgroundColor: "#ecfdf5" }}>
        섞은 입력
        <br />
        2,560
      </div>
      <div className="rounded-sm border-2 px-3 py-5 text-center text-xs font-bold" style={{ borderColor: BLOCK, color: "#065f46" }}>
        attention
        <br />· MoE
      </div>
      <div className="rounded-sm border px-2 py-3 text-center font-mono text-[11px] font-bold" style={{ borderColor: BLOCK, color: "#065f46", backgroundColor: "#ecfdf5" }}>
        블록 출력
        <br />
        2,560
      </div>
    </div>
  );
}

function SceneInject({ reduced }: { reduced: boolean }) {
  return (
    <div className="space-y-1.5">
      {LANES.map((lane) => (
        <div key={lane} className="grid grid-cols-[4.25rem_minmax(0,1fr)_3rem] items-center gap-2">
          <span className="font-mono text-[11px] font-bold" style={{ color: STREAM }}>
            갈래 {lane + 1}
          </span>
          <div className="relative h-5 rounded-sm border border-border">
            {/* 눈금: 0 · 1 · 2 */}
            <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
            <motion.span
              className="absolute inset-y-0 left-0 rounded-sm"
              style={{ backgroundColor: "#a7f3d0" }}
              initial={{ width: 0 }}
              animate={{ width: `${(INJECT[lane] / 2) * 100}%` }}
              transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : lane * 0.15 }}
            />
          </div>
          <span className="font-mono text-[11px] font-bold" style={{ color: "#065f46" }}>
            × {INJECT[lane].toFixed(1)}
          </span>
        </div>
      ))}
      <div className="grid grid-cols-[4.25rem_minmax(0,1fr)_3rem] gap-2 font-mono text-[10px] text-muted-foreground">
        <span />
        <span className="flex justify-between">
          <span>0</span>
          <span>1</span>
          <span>2</span>
        </span>
        <span />
      </div>
    </div>
  );
}

export default function GatedResidualViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const step = scenes.active;
  const reduced = scenes.reducedMotion;
  const nodes = [
    <SceneStreams key="s" />,
    <SceneGate key={`g${step}`} reduced={reduced || step !== 1} />,
    <SceneMix key={`m${step}`} reduced={reduced || step !== 2} />,
    <SceneBlock key="b" />,
    <SceneInject key={`i${step}`} reduced={reduced || step !== 4} />,
  ];
  return (
    <VizFrame
      eyebrow="gated residual"
      title="게이트는 갈래마다 값을 걸러 평균 하나를 만들고, 출력은 넷에 되돌립니다"
      description="한 층에서 attention 앞과 MoE 앞에 각각 한 번씩, 같은 절차가 두 번 반복됩니다."
      note="x·g·주입 계수는 범위를 보여 주기 위한 예시 값입니다. 실제 게이트는 토큰과 차원마다 다시 계산됩니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="gated residual의 mix와 주입"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-1 text-base font-bold">{SCENES[step]}</h4>
          <StableSceneStack active={step} scenes={nodes} className="mt-4 max-w-2xl" />
          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
