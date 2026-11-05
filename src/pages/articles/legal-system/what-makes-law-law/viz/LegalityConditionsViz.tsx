import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "운전 전에 규칙을 보고 선택할 수 있습니다",
  "규칙을 숨기면 미리 피할 수 없습니다",
  "나중에 만든 규칙을 과거 운전에 적용합니다",
  "뜻이 흐리면 같은 행동도 다르게 읽힙니다",
  "적힌 규칙과 단속이 다르면 관행을 눈치 봅니다",
] as const;

const NOTES = [
  "1월 1일 공개, 2월 1일 시행, 시속 50km라는 분명한 기준, 적힌 대로 단속이라는 조건이 모이면 민은 2월 10일의 행동을 미리 정할 수 있습니다.",
  "공개되지 않은 규칙은 행동의 기준이 될 수 없습니다. 법적 효력의 근거가 남더라도 사전에 행동을 안내하는 능력은 약해집니다.",
  "2월에 만든 규칙으로 1월 운전을 벌하면 당시에는 피할 방법이 없었습니다. 소급 적용이 법치의 핵심 문제인 이유입니다.",
  "“적당히 빠르면”처럼 기준이 지나치게 흐리면 운전자와 단속자가 서로 다른 선을 그립니다. 모든 회색 지대를 없앨 수는 없지만, 핵심 행동을 예측할 수 있어야 합니다.",
  "문서에는 50km라고 적고 실제로는 담당자의 기분에 따라 단속하면 사람들은 법문이 아니라 단속자의 습관을 읽게 됩니다. 집행 일치는 나머지 조건을 현실로 만드는 마지막 연결입니다.",
] as const;

const CONDITIONS = [
  ["일반성", "같은 조건에는 같은 기준"],
  ["공개성", "찾아보고 알 수 있음"],
  ["장래성", "행동하기 전에 존재"],
  ["명확성", "무엇이 위반인지 이해"],
  ["무모순", "동시에 지킬 수 있음"],
  ["이행 가능성", "실제로 할 수 있는 요구"],
  ["안정성", "맞출 시간을 줄 만큼 유지"],
  ["집행 일치", "적힌 기준대로 집행"],
] as const;

const BROKEN = [-1, 1, 2, 3, 7] as const;

export default function LegalityConditionsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000);
  const step = scenes.active;
  const broken = BROKEN[step];

  return (
    <VizFrame
      documentFlow
      eyebrow="법치의 작동 조건"
      title="같은 속도 규칙에서 조건 하나를 바꾸면 무엇이 달라질까요?"
      description="여덟 항목은 순서대로 실행하는 알고리즘이 아니라, 같은 규칙을 여덟 방향에서 보는 점검표입니다."
      note="풀러의 영향력 있는 이론을 가상 과속 규칙에 적용한 그림입니다. 항목 하나의 작은 결함이 곧바로 모든 법적 효력을 없앤다는 보편 공식은 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="과속 규칙에서 공개성, 장래성, 명확성, 집행 일치 조건이 달라질 때의 결과"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-[49rem] min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:min-h-[40rem] lg:min-h-[34rem]"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="text-[11px] font-black text-primary">
            비교 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 min-h-12 text-base font-bold sm:min-h-0">
            {SCENES[step]}
          </h4>

          <div className="mt-5 grid flex-1 gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="grid grid-cols-2 content-center gap-2 sm:grid-cols-4 lg:grid-cols-2">
              {CONDITIONS.map(([title, detail], index) => {
                const isBroken = index === broken;
                return (
                  <div
                    key={title}
                    className={
                      "min-w-0 rounded-xl border p-3 transition-colors " +
                      (isBroken
                        ? "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30"
                        : "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20")
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold">{title}</p>
                      <span
                        className={
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black " +
                          (isBroken
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100")
                        }
                        aria-label={isBroken ? "조건이 깨짐" : "조건을 충족함"}
                      >
                        {isBroken ? "×" : "✓"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {detail}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col justify-center gap-3">
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/30">
                <p className="text-xs font-black text-sky-700 dark:text-sky-300">
                  운전하기 전 · 2월 10일
                </p>
                <p className="mt-2 text-sm font-bold">
                  {step === 0 &&
                    "“50km 아래로 달리면 10만 원을 피할 수 있겠군.”"}
                  {step === 1 && "“어떤 규칙이 있는지 알 수 없다.”"}
                  {step === 2 && "“당시에는 그 규칙이 없었다.”"}
                  {step === 3 && "“‘적당히 빠른 속도’가 몇 km인지 모르겠다.”"}
                  {step === 4 && "“문서보다 단속자의 기분을 알아야 한다.”"}
                </p>
              </div>

              <div
                className={
                  "rounded-xl border p-4 " +
                  (step === 0
                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                    : "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30")
                }
              >
                <p className="text-xs font-black">행동 안내 결과</p>
                <p className="mt-2 text-sm font-bold">
                  {step === 0
                    ? "규칙을 읽고 행동을 맞출 수 있음"
                    : "규칙을 읽어도 행동을 미리 맞추기 어려움"}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {step === 0
                    ? "규칙이 사후 처벌 근거이면서 동시에 사전 안내로 작동합니다."
                    : "법적 효력과 별개로, 규칙을 통한 통치의 질이 훼손됩니다."}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 min-h-40 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-28 lg:min-h-0">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={[
            "모두 충족",
            "비공개",
            "소급",
            "불명확",
            "집행 불일치",
          ]}
        />
      </div>
    </VizFrame>
  );
}
