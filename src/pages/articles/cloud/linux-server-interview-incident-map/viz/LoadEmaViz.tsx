import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 유휴 서버에서 CPU를 계속 쓰는 스레드 하나가 5초 표본 12개 동안 1분 값을 얼마나 끌어올리는지,
 * 커널 정수 계산(calc_load, FIXED_1 = 2048) 그대로 막대 12개로 그린다.
 * 한 mechanism: 새 값 = 이전 값 × EXP + 지금 수 × (2048 − EXP), 2048로 나눔.
 */
const ONE_MIN = [164, 315, 454, 582, 700, 808, 908, 1000, 1084, 1162, 1233, 1299] as const;
const FIVE_MIN = [34, 68, 101, 134, 166, 198, 229, 260, 290, 320, 349, 378] as const;
const FIFTEEN_MIN = [11, 22, 33, 44, 55, 66, 77, 88, 99, 110, 121, 132] as const;
const DECAY = [1194, 1098, 1010, 929, 854, 785, 722, 664, 610, 561, 516, 474] as const;

const SCENES = ["5초 · 첫 표본", "20초 · 4번째", "60초 · 12번째", "5분 상수", "15분 상수", "스레드 종료 뒤 60초"] as const;

interface Scene {
  shown: number;
  series: readonly number[];
  label: string;
  display: string;
  note: string;
}

const STATES: readonly Scene[] = [
  { shown: 1, series: ONE_MIN, label: "1분 값", display: "164 → 0.08", note: "0 × 1884 + 2048 × 164 = 335,872에 올림용 2,047을 더해 2048로 나누면 164입니다. 실제로 1인 수요가 첫 5초에는 0.08로만 보입니다." },
  { shown: 4, series: ONE_MIN, label: "1분 값", display: "582 → 0.28", note: "표본마다 남은 거리(2048 − 이전 값)의 164/2048, 약 8%만 다가갑니다. 4번째 표본에서도 0.28입니다." },
  { shown: 12, series: ONE_MIN, label: "1분 값", display: "1,299 → 0.63", note: "60초 뒤 1분 값은 1,299/2048입니다. /proc/loadavg는 여기에 10을 더해 0.63으로 찍습니다. 1분 상수는 1분 만에 다 차는 창이 아닙니다." },
  { shown: 12, series: FIVE_MIN, label: "5분 값", display: "378 → 0.18", note: "같은 60초, 같은 입력에 EXP_5 2014를 쓰면 5분 값은 0.18입니다. 표본마다 남은 거리의 34/2048, 약 1.7%만 다가갑니다." },
  { shown: 12, series: FIFTEEN_MIN, label: "15분 값", display: "132 → 0.06", note: "EXP_15 2037이면 0.06입니다. 1분 0.63, 5분 0.18, 15분 0.06의 간격이 수요가 방금 생겼다는 사실을 알려 줍니다." },
  { shown: 12, series: DECAY, label: "1분 값 감쇠", display: "474 → 0.23", note: "스레드가 끝나도 1분 값은 60초 뒤 0.23으로 남고 15분 값 0.06보다 아직 큽니다. 약 155초가 지나야 1분 값이 15분 값 아래로 내려가 이미 지난 사건으로 보입니다." },
];

export default function LoadEmaViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  const state = STATES[scene];

  return (
    <VizFrame
      eyebrow="Fixed-point decay"
      title="5초 표본 12개가 1분 값을 0.63까지만 올립니다"
      description="막대 하나가 5초마다 한 번 계산하는 load 값입니다. 높이 기준선은 2048, 곧 load 1.0입니다."
      note="스레드가 표본 시각에 맞춰 시작하고 매 표본에 잡힌다고 가정했습니다. Gregg 글은 같은 실험을 측정 그래프에서 약 0.62로 읽습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="load average 고정소수점 감쇠"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="relative mt-4 h-36 w-full border-b border-l border-border">
            <div className="absolute inset-x-0 top-0 border-t border-dashed border-border" />
            <span className="absolute right-1 top-0.5 font-mono text-[10px] text-muted-foreground">2048 = 1.0</span>
            <div className="absolute inset-0 flex items-end gap-1 px-1">
              {state.series.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 transition-[height] duration-500"
                  style={{
                    height: `${(index < state.shown ? value / 2048 : 0) * 100}%`,
                    backgroundColor: index === state.shown - 1 ? "#2563eb" : "#93c5fd",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>5초</span>
            <span>60초</span>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">계열</dt>
              <dd className="font-bold text-foreground">{state.label}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">마지막 막대</dt>
              <dd className="font-bold text-foreground">{state.display}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
