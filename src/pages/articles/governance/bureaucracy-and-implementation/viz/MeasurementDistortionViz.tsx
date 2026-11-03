import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const GAMMA = 0.5;
const MU = 10;
const BETAS = [5, 10, 15, 20] as const;

const effortMeasured = (beta: number) =>
  (beta - GAMMA * MU) / (1 - GAMMA * GAMMA);
const effortUnmeasured = (beta: number) =>
  (MU - GAMMA * beta) / (1 - GAMMA * GAMMA);
const socialValue = (beta: number) =>
  effortMeasured(beta) + 3 * effortUnmeasured(beta);
const fmt = (value: number) =>
  Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);

const SCENES = [
  "보상 5: 정밀 조사에 노력이 남는다",
  "보상 10: 두 노력이 같아진다",
  "보상 15: 빠른 점검 쪽으로 기운다",
  "보상 20: 정밀 조사 노력이 0이 된다",
] as const;

const CONTROL_LABELS = ["β=5", "β=10", "β=15", "β=20"] as const;

const NOTES = [
  "β=5에서는 빠른 점검 0, 정밀 조사 10입니다. 설명용 전체 가치는 30입니다.",
  "β=10에서는 두 노력이 6.67로 같지만 전체 가치는 26.67로 줄어듭니다.",
  "β=15에서는 빠른 점검 13.33, 정밀 조사 3.33이고 전체 가치는 23.33입니다.",
  "β=20에서는 정밀 조사 노력이 0입니다. 완료 숫자는 가장 크지만 전체 가치는 20입니다.",
] as const;

function EffortBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: string;
}) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <span>{label}</span>
        <strong className="tabular-nums">{fmt(value)}</strong>
      </div>
      <div className="mt-1 h-5 border border-border bg-background p-1">
        <div
          className={`h-full ${tone}`}
          style={{ width: `${width}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function MeasurementDistortionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200, { loop: false });
  const step = scenes.active;
  const beta = BETAS[step];
  const quick = effortMeasured(beta);
  const deep = effortUnmeasured(beta);
  const total = socialValue(beta);

  return (
    <VizFrame
      className="mobile-viz-stable-height"
      eyebrow="같은 검사관의 시간 배분"
      title="완료 보상을 올리면 빠른 점검과 정밀 조사의 비율이 바뀝니다"
      description="β만 5→10→15→20으로 바꾸고 나머지 조건은 그대로 둡니다."
      note="γ=0.5, μ=10인 설명용 모형입니다. 실제 검사관의 생산성이나 안전 효과를 측정한 값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="완료 건수 보상에 따라 빠른 점검과 정밀 조사 노력이 달라지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-full min-w-0 flex-col overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <p className="text-[11px] font-black text-primary">
            장면 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-1 break-keep text-base font-bold leading-6">
            {SCENES[step]}
          </h4>

          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <div className="border border-sky-400/70 bg-sky-500/10 p-1 text-center">
              <p className="text-[10px] leading-4 text-muted-foreground">
                완료 보상 β
              </p>
              <p className="text-lg font-black tabular-nums">{beta}</p>
            </div>
            <div className="border border-border p-1 text-center">
              <p className="text-[10px] leading-4 text-muted-foreground">
                시간 경쟁 γ
              </p>
              <p className="text-lg font-black tabular-nums">0.5</p>
            </div>
            <div className="border border-border p-1 text-center">
              <p className="text-[10px] leading-4 text-muted-foreground">
                직업의식 μ
              </p>
              <p className="text-lg font-black tabular-nums">10</p>
            </div>
          </div>

          <div className="mt-2 space-y-2">
            <EffortBar
              label="빠른 점검 노력 e₁"
              value={quick}
              max={20}
              tone="bg-emerald-500/60"
            />
            <EffortBar
              label="정밀 조사 노력 e₂"
              value={deep}
              max={10}
              tone="bg-rose-500/60"
            />
            <EffortBar
              label="설명용 전체 가치 e₁+3e₂"
              value={total}
              max={30}
              tone="bg-slate-500/45"
            />
          </div>

          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-y border-border py-1.5 text-center">
            <div>
              <p className="text-[10px] text-muted-foreground">관리 화면</p>
              <p className="font-black">{fmt(quick)} ↑</p>
            </div>
            <span aria-hidden="true" className="text-muted-foreground">
              ≠
            </span>
            <div>
              <p className="text-[10px] text-muted-foreground">전체 가치</p>
              <p className="font-black">{fmt(total)} ↓</p>
            </div>
          </div>

          <p className="mt-1 border-l border-primary/50 pl-3 text-xs leading-5 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={CONTROL_LABELS}
          playLabel="노력 배분 재생"
        />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
