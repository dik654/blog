import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 task 열이 kernel 경계를 가질 때와 megakernel 하나 안에서
 * 흐를 때 SM 4개의 시간축이 어떻게 달라지는지. 장면마다 launch·tail → 채움 →
 * counter 대기 → register 상한 → 결과 순서로 원인과 상태 변화를 보여 준다.
 * 시간 축(µs)과 register 수는 본문의 가정값이다.
 */
const SCENES = [
  "kernel 경계 · launch 와 tail",
  "megakernel · tail 을 다음 task 로 채움",
  "counter 대기 · intra-kernel sync",
  "register 상한 · warp 수가 줄어듦",
  "결과 · 같은 일, 다른 길이",
] as const;

const NOTES = [
  "Operator A 의 task 6개가 SM 4개 위에서 두 wave 로 돕니다. 둘째 wave 에서 SM2·SM3 은 비어 있고(tail), A 가 다 끝나야 B 의 launch 가 시작됩니다. 두 kernel 이 끝나는 시각은 43 µs 입니다.",
  "같은 task 를 kernel 하나 안에 넣으면 scheduler 가 A 의 tail 자리에 B 의 task 를 바로 놓습니다. B_k 는 A_k 의 chunk 만 기다리므로 12 µs 에 시작할 수 있고 전체는 32 µs 로 끝납니다.",
  "20 µs 에 SM2 가 비어 B4 를 받았지만 B4 가 기다리는 A4 는 24 µs 에 끝납니다. SM2 는 counter 가 1 이 될 때까지 spin 하며 issue slot 을 씁니다. 이 4 µs 가 식의 t_sync 입니다.",
  "Kernel 의 register 는 task type 의 최대값 128 로 고정됩니다. Thread 당 40 이면 충분한 B task 도 128 을 잡아 SM 당 warp 가 51개에서 16개로 줄고, latency 를 덜 숨겨 B task 하나가 8 µs 에서 11 µs 로 늘어납니다.",
  "같은 계산을 세 방식으로 끝낸 시각입니다. Kernel 경계 43 µs, 이상적 megakernel 32 µs, counter 대기와 register 상한을 반영한 megakernel 36 µs. 이득은 launch·tail 의 합에서 sync·자원 손실을 뺀 만큼입니다.",
] as const;

type Kind = "A" | "B" | "idle" | "wait" | "launch";
type Bar = { sm: number; t0: number; t1: number; kind: Kind; label: string };

// 시간 축: 0~48 µs. SM 4개. 모든 장면이 같은 viewBox 를 써서 stage 가 흔들리지 않는다.
const T_MAX = 48;
const X0 = 44;
const X1 = 596;
const ROW_Y = 30;
const ROW_H = 26;
const ROW_GAP = 8;

const x = (t: number) => X0 + ((X1 - X0) * t) / T_MAX;
const y = (sm: number) => ROW_Y + sm * (ROW_H + ROW_GAP);

const A_TASKS: Bar[] = [
  { sm: 0, t0: 0, t1: 12, kind: "A", label: "A0" },
  { sm: 1, t0: 0, t1: 12, kind: "A", label: "A1" },
  { sm: 2, t0: 0, t1: 12, kind: "A", label: "A2" },
  { sm: 3, t0: 0, t1: 12, kind: "A", label: "A3" },
  { sm: 0, t0: 12, t1: 24, kind: "A", label: "A4" },
  { sm: 1, t0: 12, t1: 24, kind: "A", label: "A5" },
];

const SCENE_BARS: readonly (readonly Bar[])[] = [
  [
    ...A_TASKS,
    { sm: 2, t0: 12, t1: 24, kind: "idle", label: "tail" },
    { sm: 3, t0: 12, t1: 24, kind: "idle", label: "tail" },
    { sm: 0, t0: 24, t1: 27, kind: "launch", label: "" },
    { sm: 1, t0: 24, t1: 27, kind: "launch", label: "" },
    { sm: 2, t0: 24, t1: 27, kind: "launch", label: "launch" },
    { sm: 3, t0: 24, t1: 27, kind: "launch", label: "" },
    { sm: 0, t0: 27, t1: 35, kind: "B", label: "B0" },
    { sm: 1, t0: 27, t1: 35, kind: "B", label: "B1" },
    { sm: 2, t0: 27, t1: 35, kind: "B", label: "B2" },
    { sm: 3, t0: 27, t1: 35, kind: "B", label: "B3" },
    { sm: 0, t0: 35, t1: 43, kind: "B", label: "B4" },
    { sm: 1, t0: 35, t1: 43, kind: "B", label: "B5" },
    { sm: 2, t0: 35, t1: 43, kind: "idle", label: "tail" },
    { sm: 3, t0: 35, t1: 43, kind: "idle", label: "tail" },
  ],
  [
    ...A_TASKS,
    { sm: 2, t0: 12, t1: 20, kind: "B", label: "B0" },
    { sm: 3, t0: 12, t1: 20, kind: "B", label: "B1" },
    { sm: 2, t0: 20, t1: 28, kind: "B", label: "B2" },
    { sm: 3, t0: 20, t1: 28, kind: "B", label: "B3" },
    { sm: 0, t0: 24, t1: 32, kind: "B", label: "B4" },
    { sm: 1, t0: 24, t1: 32, kind: "B", label: "B5" },
  ],
  [
    ...A_TASKS,
    { sm: 2, t0: 12, t1: 20, kind: "B", label: "B0" },
    { sm: 3, t0: 12, t1: 20, kind: "B", label: "B1" },
    { sm: 2, t0: 20, t1: 24, kind: "wait", label: "A4 대기" },
    { sm: 2, t0: 24, t1: 32, kind: "B", label: "B4" },
    { sm: 3, t0: 20, t1: 28, kind: "B", label: "B3" },
    { sm: 0, t0: 24, t1: 32, kind: "B", label: "B2" },
    { sm: 1, t0: 24, t1: 32, kind: "B", label: "B5" },
  ],
  [
    ...A_TASKS,
    { sm: 2, t0: 12, t1: 23, kind: "B", label: "B0 · warp 16" },
    { sm: 3, t0: 12, t1: 23, kind: "B", label: "B1 · warp 16" },
    { sm: 2, t0: 23, t1: 34, kind: "B", label: "B2" },
    { sm: 3, t0: 23, t1: 34, kind: "B", label: "B3" },
    { sm: 0, t0: 24, t1: 35, kind: "B", label: "B4" },
    { sm: 1, t0: 24, t1: 35, kind: "B", label: "B5" },
  ],
  [],
];

const END_TIME = [43, 32, 32, 35, 0] as const;

const RESULT_BARS = [
  { label: "kernel 경계", t: 43 },
  { label: "megakernel (이상)", t: 32 },
  { label: "megakernel (sync+reg)", t: 36 },
] as const;

function barClass(kind: Kind) {
  if (kind === "A") return "fill-primary/25 stroke-primary";
  if (kind === "B") return "fill-emerald-500/20 stroke-emerald-600";
  if (kind === "wait") return "fill-amber-500/15 stroke-amber-600";
  if (kind === "launch") return "fill-muted/60 stroke-border";
  return "fill-transparent stroke-border";
}

export default function MegakernelDesignTradeoffsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const bars = SCENE_BARS[scenes.active];
  const endTime = END_TIME[scenes.active];
  const isResult = scenes.active === 4;
  const showCounter = scenes.active === 2;
  const showRegister = scenes.active === 3;

  return (
    <VizFrame
      eyebrow="Megakernel · global scheduling"
      title="Kernel 경계를 지우면 tail 이 채워지고, 대신 counter 대기와 register 상한이 생깁니다"
      description="SM 4개의 시간축입니다. Operator A 의 task 6개(각 12 µs)와 그 결과를 chunk 단위로 받는 operator B 의 task 6개(각 8 µs)를 kernel 두 개로 돌릴 때와 megakernel 하나로 돌릴 때를 비교합니다."
      note="시간(µs)·launch 3 µs·register 128 과 40·warp 51 과 16 은 본문의 계산 예를 그대로 옮긴 가정값입니다. Scheduler SM 과 shared memory page 는 그리지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Kernel 경계가 있을 때와 megakernel 하나 안에서 SM 4개 위로 task 가 흐르는 시간축 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-4 min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 640 236"
              className="h-auto w-full max-w-full"
              role="img"
              aria-label={SCENES[scenes.active]}
            >
              {/* 시간 축 */}
              <line x1={X0} y1={16} x2={X1} y2={16} className="stroke-border" strokeWidth={1} />
              {[0, 12, 24, 36, 48].map((t) => (
                <g key={t}>
                  <line x1={x(t)} y1={12} x2={x(t)} y2={20} className="stroke-border" strokeWidth={1} />
                  <text x={x(t)} y={9} textAnchor="middle" className="fill-muted-foreground font-mono text-[9px]">
                    {t} µs
                  </text>
                </g>
              ))}

              {isResult ? (
                RESULT_BARS.map((row, index) => (
                  <g key={row.label}>
                    <text x={X0 - 4} y={y(index) + 17} textAnchor="end" className="fill-foreground font-mono text-[9px]">
                      {index + 1}
                    </text>
                    <rect
                      x={X0}
                      y={y(index)}
                      width={x(row.t) - X0}
                      height={ROW_H}
                      className={index === 0 ? "fill-muted/60 stroke-border" : "fill-emerald-500/20 stroke-emerald-600"}
                      strokeWidth={1}
                    />
                    <text x={X0 + 6} y={y(index) + 17} className="fill-foreground font-mono text-[10px]">
                      {row.label}
                    </text>
                    <text x={x(row.t) + 5} y={y(index) + 17} className="fill-foreground font-mono text-[10px] font-bold">
                      {row.t} µs
                    </text>
                  </g>
                ))
              ) : (
                <>
                  {[0, 1, 2, 3].map((sm) => (
                    <g key={sm}>
                      <text x={X0 - 4} y={y(sm) + 17} textAnchor="end" className="fill-muted-foreground font-mono text-[9px]">
                        SM{sm}
                      </text>
                      <rect x={X0} y={y(sm)} width={X1 - X0} height={ROW_H} className="fill-transparent stroke-border/60" strokeWidth={1} strokeDasharray="2 3" />
                    </g>
                  ))}
                  {bars.map((bar, index) => (
                    <g key={`${scenes.active}-${index}`}>
                      <rect
                        x={x(bar.t0)}
                        y={y(bar.sm) + 2}
                        width={x(bar.t1) - x(bar.t0)}
                        height={ROW_H - 4}
                        className={barClass(bar.kind)}
                        strokeWidth={1}
                        strokeDasharray={bar.kind === "idle" || bar.kind === "wait" ? "3 2" : undefined}
                      />
                      {bar.label && (
                        <text
                          x={(x(bar.t0) + x(bar.t1)) / 2}
                          y={y(bar.sm) + 17}
                          textAnchor="middle"
                          className={`font-mono text-[9px] ${bar.kind === "idle" || bar.kind === "launch" ? "fill-muted-foreground" : "fill-foreground"}`}
                        >
                          {bar.label}
                        </text>
                      )}
                    </g>
                  ))}
                  {endTime > 0 && (
                    <g>
                      <line x1={x(endTime)} y1={ROW_Y - 4} x2={x(endTime)} y2={y(3) + ROW_H + 4} className="stroke-foreground" strokeWidth={1} strokeDasharray="4 2" />
                      <text x={x(endTime) + 4} y={y(3) + ROW_H + 2} className="fill-foreground font-mono text-[10px] font-bold">
                        끝 {endTime} µs
                      </text>
                    </g>
                  )}
                </>
              )}

              {/* 아래 패널: 장면별 상태 */}
              <g>
                <rect x={X0} y={170} width={X1 - X0} height={58} className="fill-transparent stroke-border" strokeWidth={1} />
                {showCounter && (
                  <>
                    <text x={X0 + 10} y={190} className="fill-foreground font-mono text-[10px] font-bold">
                      counter[A4]
                    </text>
                    <rect x={X0 + 100} y={180} width={60} height={14} className="fill-amber-500/15 stroke-amber-600" strokeWidth={1} />
                    <text x={X0 + 130} y={191} textAnchor="middle" className="fill-foreground font-mono text-[9px]">
                      0 / 1
                    </text>
                    <text x={X0 + 170} y={190} className="fill-muted-foreground font-mono text-[9px]">
                      20~24 µs · SM2 spin
                    </text>
                    <rect x={X0 + 100} y={204} width={60} height={14} className="fill-emerald-500/20 stroke-emerald-600" strokeWidth={1} />
                    <text x={X0 + 130} y={215} textAnchor="middle" className="fill-foreground font-mono text-[9px]">
                      1 / 1
                    </text>
                    <text x={X0 + 170} y={214} className="fill-muted-foreground font-mono text-[9px]">
                      24 µs · A4 trigger → B4 시작
                    </text>
                  </>
                )}
                {showRegister && (
                  <>
                    <text x={X0 + 10} y={190} className="fill-foreground font-mono text-[10px] font-bold">
                      reg/thread
                    </text>
                    <rect x={X0 + 100} y={180} width={256} height={12} className="fill-primary/25 stroke-primary" strokeWidth={1} />
                    <text x={X0 + 362} y={190} className="fill-foreground font-mono text-[9px]">
                      A 128 → warp 16/SM
                    </text>
                    <rect x={X0 + 100} y={200} width={80} height={12} className="fill-emerald-500/20 stroke-emerald-600" strokeWidth={1} />
                    <rect x={X0 + 180} y={200} width={176} height={12} className="fill-transparent stroke-emerald-600" strokeWidth={1} strokeDasharray="3 2" />
                    <text x={X0 + 362} y={210} className="fill-foreground font-mono text-[9px]">
                      B 40 → 51 가능, 128 로 고정
                    </text>
                    <text x={X0 + 100} y={224} className="fill-muted-foreground font-mono text-[9px]">
                      kernel = max(128, 40) = 128
                    </text>
                  </>
                )}
                {!showCounter && !showRegister && !isResult && (
                  <>
                    <text x={X0 + 10} y={190} className="fill-foreground font-mono text-[10px] font-bold">
                      {scenes.active === 0 ? "kernel 경계" : "megakernel"}
                    </text>
                    <text x={X0 + 10} y={208} className="fill-muted-foreground font-mono text-[9px]">
                      {scenes.active === 0
                        ? "launch 2회 · tail 2회 · B 는 A 전체가 끝난 뒤 시작"
                        : "launch 1회 · A_k 가 끝나면 B_k 가 빈 SM 에 바로 시작"}
                    </text>
                    <text x={X0 + 10} y={222} className="fill-muted-foreground font-mono text-[9px]">
                      {scenes.active === 0 ? "SM 시간 4×43 = 172 중 일한 시간 120" : "SM 시간 4×32 = 128 중 일한 시간 120"}
                    </text>
                  </>
                )}
                {isResult && (
                  <>
                    <text x={X0 + 10} y={190} className="fill-foreground font-mono text-[10px] font-bold">
                      ΔT = (launch + tail) − sync − res
                    </text>
                    <text x={X0 + 10} y={208} className="fill-muted-foreground font-mono text-[9px]">
                      이상: 43 − 32 = 11 µs 이득
                    </text>
                    <text x={X0 + 10} y={222} className="fill-muted-foreground font-mono text-[9px]">
                      sync 1 + reg 3 을 빼면 43 − 36 = 7 µs 이득
                    </text>
                  </>
                )}
              </g>
            </svg>
          </div>

          <div className="mt-2 flex flex-wrap gap-4 font-mono text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 border border-primary bg-primary/25" /> operator A task
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 border border-emerald-600 bg-emerald-500/20" /> operator B task
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 border border-dashed border-amber-600" /> counter 대기
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 border border-dashed border-border" /> tail · launch
            </span>
          </div>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
