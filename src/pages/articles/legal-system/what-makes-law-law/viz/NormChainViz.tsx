import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "고지서만 보아서는 근거를 알 수 없습니다",
  "각 문서는 위에서 권한을 받아야 합니다",
  "마지막에는 공직자의 공통 기준이 있습니다",
  "효력의 경로는 정당성까지 보증하지 않습니다",
] as const;

const NOTES = [
  "고지서에 시청 로고가 있다는 사실만으로는 충분하지 않습니다. 누가 어떤 규칙에 따라 이 결정을 내릴 수 있었는지 거꾸로 확인해야 합니다.",
  "고지서는 시 규칙을, 시 규칙은 법률을, 법률은 헌법과 입법 절차를 가리킵니다. 중간 어느 단계에서든 권한이나 절차가 끊기면 아래 결정의 효력도 흔들립니다.",
  "헌법 위의 비밀 문서를 하나 더 찾는 것이 아닙니다. 법원·의회·행정부가 헌법과 적법한 입법을 법의 기준으로 실제 사용하는 공통 관행에서 질문이 멈춥니다.",
  "이 경로가 모두 이어져도 10만 원이 공정한지, 그 규칙에 복종할 도덕적 이유가 있는지는 별도입니다. 효력 검사는 출처와 절차에 답할 뿐입니다.",
] as const;

const CHAIN = [
  ["10만 원 고지서", "민에게 내린 개별 결정"],
  ["시 규칙", "부과 조건과 담당 기관"],
  ["법률", "시가 정할 수 있는 범위"],
  ["헌법·입법 절차", "법률을 만드는 기준"],
] as const;

export default function NormChainViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const step = scenes.active;

  return (
    <VizFrame
      documentFlow
      eyebrow="효력의 경로"
      title="고지서의 근거를 위로 따라가면 어디에서 멈출까요?"
      description="각 칸은 아래 결정을 만들 권한과 절차를 제공합니다. 마지막 칸 뒤에는 또 다른 문서가 아니라 공통의 공직 관행이 있습니다."
      note="가상 사례를 단순화한 그림입니다. 실제 체계에는 조례·시행령·행정규칙·판례 등 더 많은 단계가 들어갈 수 있습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="고지서에서 승인 규칙까지 법적 효력의 근거를 따라가는 그림"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-[46rem] min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:min-h-[40rem] lg:min-h-[35rem]"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="text-[11px] font-black text-primary">
            확인 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 min-h-12 text-base font-bold sm:min-h-0">
            {SCENES[step]}
          </h4>

          <div className="mt-5 grid flex-1 gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center">
              {CHAIN.map(([title, detail], index) => {
                const reached = step >= 1 || index === 0;
                const current =
                  step === 0 ? index === 0 : index === CHAIN.length - 1;
                return (
                  <div key={title}>
                    <div
                      className={
                        "rounded-xl border p-3 transition-colors " +
                        (current
                          ? "border-primary bg-primary/10"
                          : reached
                            ? "border-sky-200 bg-sky-50/80 dark:border-sky-900 dark:bg-sky-950/30"
                            : "border-border bg-muted/20")
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-xs font-black text-primary ring-1 ring-border">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold">{title}</p>
                          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                            {detail}
                          </p>
                        </div>
                      </div>
                    </div>
                    {index < CHAIN.length - 1 && (
                      <div
                        className="flex h-7 items-center gap-2 pl-4 text-xs font-bold text-muted-foreground"
                        aria-hidden="true"
                      >
                        <span className="text-base leading-none">↓</span>
                        <span>누가 만들 권한을 주었나?</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col justify-center gap-3">
              <div
                className={
                  "rounded-xl border p-4 transition-colors " +
                  (step >= 2
                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                    : "border-dashed border-border bg-muted/20")
                }
              >
                <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                  문서 사슬이 멈추는 자리
                </p>
                <p className="mt-2 text-sm font-bold">
                  공직자들이 공통으로 쓰는 법 판별 기준
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  헌법과 적법한 입법을 실제 판결·입법·집행의 기준으로 받아들이는
                  관행
                </p>
                <p className="mt-3 rounded-lg bg-background/80 px-3 py-2 text-xs font-bold">
                  이름을 나중에 붙이면 · 승인의 규칙
                </p>
              </div>

              <div
                className={
                  "rounded-xl border p-4 transition-colors " +
                  (step === 3
                    ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                    : "border-border bg-muted/20")
                }
              >
                <p className="text-xs font-black text-amber-700 dark:text-amber-300">
                  이 경로가 답하지 않는 질문
                </p>
                <p className="mt-2 text-sm font-bold">
                  10만 원이 공정한가? 나는 왜 따라야 하는가?
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  법적 효력을 확인한 뒤에도 내용의 정당성과 복종 의무는 따로
                  남습니다.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 min-h-32 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-24 lg:min-h-0">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["고지서", "권한 경로", "멈추는 자리", "남는 질문"]}
        />
      </div>
    </VizFrame>
  );
}
