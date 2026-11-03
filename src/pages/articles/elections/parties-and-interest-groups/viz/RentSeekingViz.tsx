import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const V = 1000;
const COUNTS = [2, 4, 10] as const;

const spendEach = (n: number) => (V * (n - 1)) / (n * n);
const spendTotal = (n: number) => (V * (n - 1)) / n;
const format = (value: number) =>
  Number.isInteger(value) ? value.toLocaleString("ko-KR") : value.toFixed(1);

const SCENES = [
  "두 곳이면 각 250억·합계 500억",
  "네 곳이면 각 187.5억·합계 750억",
  "열 곳이면 각 90억·합계 900억",
  "한 곳은 덜 쓰고 전체는 더 쓴다",
] as const;

const CONTROL_LABELS = ["두 곳", "네 곳", "열 곳", "세 경우 비교"] as const;

const NOTES = [
  "두 곳이면 한 곳은 250억 원, 전체는 500억 원을 씁니다.",
  "네 곳이면 한 곳은 187.5억 원, 전체는 750억 원을 씁니다.",
  "열 곳이면 한 곳은 90억 원, 전체는 900억 원을 씁니다.",
  "기업 수↑: 한 곳 지출↓, 전체 지출↑. 실제 측정값은 아닙니다.",
] as const;

function ContestLedger({ count }: { count: number }) {
  const each = spendEach(count);
  const total = spendTotal(count);
  const share = (total / V) * 100;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        <div className="border border-border p-2 sm:p-4">
          <p className="text-xs text-muted-foreground">면허 가치</p>
          <p className="mt-2 text-base font-black tabular-nums sm:text-xl">
            1,000억
          </p>
        </div>
        <div className="border border-border p-2 sm:p-4">
          <p className="text-xs text-muted-foreground">
            기업 {count}곳 · 한 곳
          </p>
          <p className="mt-2 text-base font-black tabular-nums sm:text-xl">
            {format(each)}억
          </p>
        </div>
        <div className="border border-rose-400/70 bg-rose-500/10 p-2 sm:p-4">
          <p className="text-xs text-muted-foreground">전체 지출</p>
          <p className="mt-2 text-base font-black tabular-nums sm:text-xl">
            {format(total)}억
          </p>
        </div>
      </div>

      <div className="mt-3 sm:mt-5">
        <div className="flex items-center justify-between text-xs">
          <span>전체 지출</span>
          <strong className="tabular-nums">{format(share)}%</strong>
        </div>
        <div className="mt-2 h-6 border border-border bg-background p-1 sm:h-8">
          <div
            className="h-full bg-rose-500/55"
            style={{ width: `${share}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="mt-2 text-right text-xs text-muted-foreground">
          오른쪽 끝 = 면허 가치 100%
        </p>
      </div>

      <p className="mt-3 border-l border-border pl-3 text-sm leading-6 sm:mt-5 sm:pl-4 sm:leading-7">
        한 곳: 1,000×({count}−1)÷{count}² = {format(each)}억
        <br />
        전체: {count}×{format(each)} = {format(total)}억
      </p>
    </div>
  );
}

function Comparison() {
  return (
    <div className="space-y-2 sm:space-y-4">
      {COUNTS.map((count) => {
        const each = spendEach(count);
        const total = spendTotal(count);
        const share = (total / V) * 100;
        return (
          <div
            key={count}
            className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-3"
          >
            <div className="flex items-center justify-center border border-border text-sm font-bold">
              {count}곳
            </div>
            <div className="min-w-0">
              <div className="flex justify-between gap-3 text-xs">
                <span>한 곳 {format(each)}억</span>
                <strong>합계 {format(total)}억</strong>
              </div>
              <div className="mt-1 h-5 border border-border bg-background p-1 sm:mt-2 sm:h-7">
                <div
                  className="h-full bg-rose-500/55"
                  style={{ width: `${share}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        );
      })}
      <div className="grid grid-cols-2 gap-3 border-y border-border py-2 text-center sm:py-4">
        <div>
          <p className="text-xs text-muted-foreground">한 곳(억 원)</p>
          <p className="mt-1 text-sm font-bold">250→187.5→90</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">전체(억 원)</p>
          <p className="mt-1 text-sm font-bold">500→750→900</p>
        </div>
      </div>
    </div>
  );
}

export default function RentSeekingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200, { loop: false });
  const step = scenes.active;

  return (
    <VizFrame
      className="mobile-viz-stable-height"
      eyebrow="같은 면허의 경쟁 장부"
      title="기업 수가 늘면 한 곳은 덜 쓰지만 전체는 더 씁니다"
      description="면허 가치 1,000억 원을 같은 식으로 비교합니다."
      note="당첨 확률=자기 지출÷전체 지출이고 기업의 조건이 같다는 설명용 모형입니다. 실제 로비 지출이나 정책 효과의 측정값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="가치 천억 원의 면허 경쟁에서 기업 수별 한 곳과 전체 지출을 계산하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-full min-w-0 flex-col overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <p className="text-[11px] font-black text-primary">
            장면 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 break-keep text-lg font-bold">{SCENES[step]}</h4>

          <div className="mt-3 sm:mt-5">
            {step < 3 ? <ContestLedger count={COUNTS[step]} /> : <Comparison />}
          </div>

          <p className="mt-3 border-l border-primary/50 pl-3 text-sm leading-6 text-muted-foreground sm:mt-5 sm:pl-4 sm:leading-7">
            {NOTES[step]}
          </p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={CONTROL_LABELS}
          playLabel="경쟁 과정 재생"
        />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
