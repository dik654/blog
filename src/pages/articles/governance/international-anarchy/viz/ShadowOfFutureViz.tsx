import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "δ=0.3이면 한 번 어기는 값이 큽니다",
  "δ=0.5에서 두 값이 같아집니다",
  "δ=0.8이면 계속 지키는 값이 큽니다",
  "배신 이익이 커지면 문턱도 올라갑니다",
] as const;

const T = 5;
const R = 3;
const P = 1;
const DELTAS = [0.3, 0.5, 0.8] as const;
const TEMPTATIONS = [4, 5, 7, 11] as const;

const keepCooperating = (delta: number) => R / (1 - delta);
const defectOnce = (delta: number, temptation = T) =>
  temptation + (delta * P) / (1 - delta);
const threshold = (temptation: number) =>
  (temptation - R) / (temptation - P);
const fmt = (value: number) =>
  Math.abs(value - Math.round(value)) < 1e-9
    ? String(Math.round(value))
    : value.toFixed(2);

export default function ShadowOfFutureViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const step = scenes.active;
  const delta = DELTAS[Math.min(step, DELTAS.length - 1)];
  const cooperate = keepCooperating(delta);
  const defect = defectOnce(delta);
  const maxValue = 16;

  const notes = [
    "다음 만남의 가치가 작으면 먼 미래의 손실보다 올해 5를 받는 일이 중요합니다. 이 조건에서는 약속을 지키라고 말하는 것만으로 선택이 바뀌지 않습니다.",
    "δ=0.5에서는 계속 지켜도 6, 한 번 어겨도 6입니다. (5−3)÷(5−1)=0.5가 협력의 경계라는 계산이 눈으로 확인됩니다.",
    "δ=0.8이면 계속 지킬 때 15, 한 번 어길 때 9입니다. 미래 협력을 잃는 비용이 올해의 추가 이익보다 커집니다.",
    "함께 지킬 때 3과 경쟁할 때 1을 고정하고, 혼자 어겨 얻는 값만 키웠습니다. 배신의 유혹이 커질수록 같은 관계를 유지하려면 미래를 더 크게 봐야 합니다.",
  ] as const;

  return (
    <VizFrame
      documentFlow
      eyebrow="수식을 눈으로 읽기"
      title="다음 만남의 가치를 바꾸면 어느 선택이 커질까요?"
      description="초록 막대는 매년 제한을 지킬 때의 합, 빨간 막대는 올해 어기고 다음 해부터 경쟁할 때의 합입니다."
      note="R=3, T=5, P=1인 가상 사례입니다. 위반을 발견하고 대응할 수 있으며, 발각 뒤 경쟁 상태가 계속된다고 가정합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="미래의 가치와 협력 문턱 계산"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-[32rem] min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary md:min-h-[27rem]"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="text-[11px] font-black text-primary">
            계산 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-5 flex flex-1 flex-col justify-center">
            {step < 3 ? (
              <div className="mx-auto w-full max-w-xl space-y-5">
                <div>
                  <div className="flex items-end justify-between gap-3 text-xs">
                    <span className="font-bold">다음 만남의 가치 δ</span>
                    <span className="font-black text-primary">{delta}</span>
                  </div>
                  <div className="relative mt-2 h-4 rounded-full bg-muted">
                    <div className="absolute inset-y-0 left-0 rounded-full bg-primary/60" style={{ width: String(delta * 100) + "%" }} />
                    <div className="absolute inset-y-[-4px] left-1/2 w-px bg-rose-500" />
                    <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-rose-600">
                      문턱 0.5
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div>
                    <div className="mb-1 flex justify-between gap-3 text-xs">
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">계속 지키기 · 3÷(1−{delta})</span>
                      <span className="font-black">{fmt(cooperate)}</span>
                    </div>
                    <div className="h-8 rounded-lg bg-muted">
                      <div className="flex h-full items-center rounded-lg bg-emerald-500/70 px-2 text-xs font-bold text-emerald-950" style={{ width: String(Math.max(16, (cooperate / maxValue) * 100)) + "%" }}>
                        협력
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between gap-3 text-xs">
                      <span className="font-bold text-rose-700 dark:text-rose-300">한 번 어기기 · 5+{delta}÷(1−{delta})</span>
                      <span className="font-black">{fmt(defect)}</span>
                    </div>
                    <div className="h-8 rounded-lg bg-muted">
                      <div className="flex h-full items-center rounded-lg bg-rose-400/75 px-2 text-xs font-bold text-rose-950" style={{ width: String(Math.max(16, (defect / maxValue) * 100)) + "%" }}>
                        배신
                      </div>
                    </div>
                  </div>
                </div>

                <p className={"rounded-xl p-3 text-center text-sm font-bold leading-6 " + (cooperate > defect ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100" : cooperate === defect ? "bg-muted" : "bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-100")}>
                  {cooperate > defect
                    ? fmt(cooperate) + " > " + fmt(defect) + " · 제한을 지키는 편이 유리합니다"
                    : cooperate === defect
                      ? fmt(cooperate) + " = " + fmt(defect) + " · 두 선택이 같은 경계입니다"
                      : fmt(cooperate) + " < " + fmt(defect) + " · 한 번 어기는 편이 유리합니다"}
                </p>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-xl space-y-3">
                <div className="grid grid-cols-[5rem_1fr_4.5rem] gap-2 text-[11px] font-bold text-muted-foreground">
                  <span>혼자 어길 때</span>
                  <span>필요한 미래의 가치</span>
                  <span className="text-right">문턱</span>
                </div>
                {TEMPTATIONS.map((temptation) => {
                  const value = threshold(temptation);
                  return (
                    <div key={temptation} className="grid grid-cols-[5rem_1fr_4.5rem] items-center gap-2">
                      <span className="text-sm font-bold">T={temptation}</span>
                      <div className="h-6 rounded-md bg-muted">
                        <div className="h-full rounded-md bg-rose-400/75" style={{ width: String(Math.min(value, 1) * 100) + "%" }} />
                      </div>
                      <span className="text-right text-sm font-black text-rose-700 dark:text-rose-300">
                        {fmt(value)}
                      </span>
                    </div>
                  );
                })}
                <p className="rounded-xl bg-muted/60 p-3 text-sm leading-6">
                  T=11이면 문턱이 1입니다. 다음 만남을 아무리 크게 봐도 이 단순한
                  대응 아래에서는 협력이 엄격하게 더 유리해지지 않습니다.
                </p>
              </div>
            )}
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {notes[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
