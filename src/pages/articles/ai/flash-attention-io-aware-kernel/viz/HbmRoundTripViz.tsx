import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 위치 4,096개 · 성분 64개 · 값 2바이트에서 큰 저장 공간(HBM)을 오가는 양을 칸으로 센다.
 * 1칸 = 512KiB. Q·K·V·O는 1칸씩, 점수 S와 가중치 P는 64칸(32MiB)씩이다.
 * 한 mechanism: 표준 구현은 S 쓰기·S 읽기·P 쓰기·P 읽기 네 번 64칸씩 왕복하고(128MiB),
 * 조각을 바로 소비하는 구현은 그 네 화살표가 0이 된다.
 */
const GRID = 64;

type Trip = {
  key: string;
  label: string;
  dir: "up" | "down";
  array: "S" | "P";
};
const TRIPS: readonly Trip[] = [
  { key: "sw", label: "S 쓰기", dir: "up", array: "S" },
  { key: "sr", label: "S 읽기", dir: "down", array: "S" },
  { key: "pw", label: "P 쓰기", dir: "up", array: "P" },
  { key: "pr", label: "P 읽기", dir: "down", array: "P" },
];

interface Scene {
  label: string;
  done: number;
  active: number | null;
  sFilled: boolean;
  pFilled: boolean;
  oWritten: boolean;
  flash?: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "입력 Q·K·V 3칸",
    done: 0,
    active: null,
    sFilled: false,
    pFilled: false,
    oWritten: false,
    note: "Q·K·V는 각각 4,096위치 × 64값 × 2바이트 = 512KiB라 1칸씩, 합 1.5MiB입니다. 아직 점수 배열 S와 가중치 배열 P는 비어 있습니다.",
  },
  {
    label: "① S 쓰기 · 64칸",
    done: 1,
    active: 0,
    sFilled: true,
    pFilled: false,
    oWritten: false,
    note: "Q·K로 만든 점수 4,096²개를 값마다 2바이트로 쓰면 32MiB, 곧 64칸입니다. 입력 세 배열을 합친 3칸보다 한 배열이 훨씬 큽니다.",
  },
  {
    label: "② S 읽기 · softmax",
    done: 2,
    active: 1,
    sFilled: true,
    pFilled: false,
    oWritten: false,
    note: "정규화하려면 방금 쓴 64칸을 다시 읽습니다. 같은 32MiB가 한 번 더 이동해 누적은 64MiB입니다.",
  },
  {
    label: "③ P 쓰기 · 64칸",
    done: 3,
    active: 2,
    sFilled: true,
    pFilled: true,
    oWritten: false,
    note: "정규화한 가중치 P도 4,096²개라 다시 64칸을 씁니다. 누적 96MiB입니다.",
  },
  {
    label: "④ P 읽기 · O 1칸",
    done: 4,
    active: 3,
    sFilled: true,
    pFilled: true,
    oWritten: true,
    note: "P를 읽어 V와 곱하면 출력 O 1칸이 나옵니다. 화살표 네 개 × 32MiB = 128MiB이고 입력 1.5MiB의 약 85.33배입니다.",
  },
  {
    label: "조각을 바로 소비",
    done: 0,
    active: null,
    sFilled: false,
    pFilled: false,
    oWritten: true,
    flash: true,
    note: "점수 두 조각을 작은 작업 공간에서 계산하고 곧바로 가중합에 반영하면 S·P 128칸이 생기지 않고 네 화살표도 0입니다. K·V를 조각마다 다시 읽는 양은 6절의 접근량 모형에서 따로 셉니다.",
  },
];

function Grid({
  filled,
  ghost,
  color,
  delayBase,
  reduced,
}: {
  filled: boolean;
  ghost: boolean;
  color: string;
  delayBase: number;
  reduced: boolean;
}) {
  return (
    <div className="grid w-max grid-cols-8 gap-[2px]">
      {Array.from({ length: GRID }, (_, i) => (
        <motion.span
          key={i}
          className={`size-2.5 rounded-[1px] border ${ghost ? "border-dashed" : ""}`}
          initial={false}
          animate={{
            backgroundColor: filled ? color : "rgba(0,0,0,0)",
            borderColor: filled ? color : ghost ? "#cbd5e1" : "#e2e8f0",
          }}
          transition={{
            duration: reduced ? 0 : 0.2,
            delay: reduced || !filled ? 0 : delayBase + i * 0.012,
          }}
        />
      ))}
    </div>
  );
}

function SmallCell({
  label,
  on,
  color,
}: {
  label: string;
  on: boolean;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="size-2.5 rounded-[1px] border"
        style={{
          backgroundColor: on ? color : "transparent",
          borderColor: on ? color : "#cbd5e1",
        }}
      />
      <span
        className={`font-mono text-[11px] font-bold ${on ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}

export default function HbmRoundTripViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const moved = scene.done * 32;

  return (
    <VizFrame
      eyebrow="HBM round trip"
      title="점수와 가중치를 큰 저장 공간에 남기면 64칸짜리 배열이 네 번 오갑니다"
      description="HBM은 큰 저장 공간, 작업 공간은 계산기 옆의 작은 공간입니다. 한 칸은 512KiB이고, 화살표 네 개가 S·P를 쓰고 읽는 왕복입니다."
      note="위치 4,096개 · 성분 64개 · 값 2바이트 가정은 본문 5절과 같습니다. 출력 O와 함께 저장하는 행 통계 L은 작아서 칸으로 그리지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="표준 attention과 조각 소비 방식의 HBM 왕복 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span
              className={`font-mono text-sm font-bold ${scene.flash ? "text-[#16a34a]" : "text-primary"}`}
            >
              S·P 이동 {moved}MiB
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-3">
            {/* HBM */}
            <div className="rounded-sm border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">
                HBM · 1칸 = 512KiB
              </p>
              <div className="mt-2 flex flex-wrap items-start gap-x-5 gap-y-3">
                <div className="flex flex-col gap-1.5">
                  <SmallCell label="Q" on color="#64748b" />
                  <SmallCell label="K" on color="#64748b" />
                  <SmallCell label="V" on color="#64748b" />
                  <SmallCell label="O" on={scene.oWritten} color="#16a34a" />
                </div>
                <div>
                  <p className="mb-1 font-mono text-[11px] font-bold text-[#2563eb]">
                    S {scene.flash ? "· 없음" : "· 64칸"}
                  </p>
                  <Grid
                    filled={scene.sFilled}
                    ghost={!!scene.flash}
                    color="#2563eb"
                    delayBase={0.2}
                    reduced={reduced}
                  />
                </div>
                <div>
                  <p className="mb-1 font-mono text-[11px] font-bold text-[#d97706]">
                    P {scene.flash ? "· 없음" : "· 64칸"}
                  </p>
                  <Grid
                    filled={scene.pFilled}
                    ghost={!!scene.flash}
                    color="#d97706"
                    delayBase={0.2}
                    reduced={reduced}
                  />
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              {/* 왕복 화살표 4개 */}
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-2">
                {TRIPS.map((t, i) => {
                  const isDone = i < scene.done;
                  const isActive = scene.active === i;
                  const color = t.array === "S" ? "#2563eb" : "#d97706";
                  return (
                    <motion.div
                      key={t.key}
                      className={`flex min-w-0 flex-col items-center rounded-sm border px-1 py-1 text-center font-mono text-[10px] font-bold sm:flex-row sm:justify-center sm:gap-1.5 sm:text-[11px] ${
                        scene.flash
                          ? "border-dashed border-border text-muted-foreground line-through"
                          : isDone
                            ? ""
                            : "border-dashed border-border text-muted-foreground"
                      }`}
                      style={
                        !scene.flash && isDone
                          ? { borderColor: color, color }
                          : undefined
                      }
                      initial={false}
                      animate={{
                        opacity: isActive && !reduced ? [0.35, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <span aria-hidden className="text-sm leading-4">
                        {t.dir === "up" ? "↑" : "↓"}
                      </span>
                      <span>{t.label}</span>
                      <span className="font-normal">
                        {scene.flash ? "0" : "32MiB"}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* 작은 작업 공간 */}
              <div
                className={`rounded-sm border p-3 ${scene.flash ? "border-[#16a34a]" : "border-primary/50"}`}
              >
                <p
                  className={`text-[11px] font-bold ${scene.flash ? "text-[#16a34a]" : "text-primary"}`}
                >
                  작은 작업 공간 · 계산
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {scene.flash
                    ? "점수 두 조각 → 기준·두 합만 남기고 버림"
                    : scene.active === null
                      ? "Q·K·V 읽기 대기"
                      : `${TRIPS[scene.active].label} 진행`}
                </p>
              </div>
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">입력 Q·K·V</dt>
              <dd className="font-bold">3칸 · 1.5MiB</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">S·P 왕복</dt>
              <dd
                className={`font-bold ${scene.flash ? "text-[#16a34a]" : "text-primary"}`}
              >
                {scene.done}회 × 32 = {moved}MiB
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">입력 대비</dt>
              <dd className="font-bold">
                {moved === 128
                  ? "≈85.33배"
                  : moved === 0
                    ? "0배"
                    : `≈${(moved / 1.5).toFixed(2)}배`}
              </dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES.map((s) => s.label)}
        />
      </div>
    </VizFrame>
  );
}
