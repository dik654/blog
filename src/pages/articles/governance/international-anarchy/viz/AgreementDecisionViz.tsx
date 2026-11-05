import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "1. 위반을 볼 수 있는지 확인합니다",
  "2. 위반 뒤 대응할 수 있는지 확인합니다",
  "3. 협력에 필요한 문턱을 계산합니다",
  "4. 실제 미래 가치와 문턱을 비교합니다",
] as const;

const CODE = [
  'if (!observable) return "검증 절차부터 설계"',
  'if (!response) return "대응 절차부터 설계"',
  "threshold = (T - R) / (T - P)",
  'if (delta < threshold) return "합의 조건 재설계"',
  'return "강제 없이 유지 가능한 후보"',
] as const;

const NOTES = [
  "공동 위치 기록이 있어 몰래 늘린 순찰선을 확인할 수 있습니다. 국제 제도는 먼저 보이지 않던 행동을 보이게 만듭니다.",
  "위반이 확인되면 항만 공동 사용을 멈추고 자체 순찰을 늘릴 수 있습니다. 조사기구가 직접 처벌하지 않아도 국가의 대응이 믿을 만하면 다음 계산으로 갈 수 있습니다.",
  "가상 값 T=5, R=3, P=1을 넣으면 문턱은 (5−3)÷(5−1)=0.5입니다. 수식은 네 번째 단계에서 실제 관계의 미래 가치와 비교할 기준을 만듭니다.",
  "연례 갱신과 여러 사안의 연계로 다음 만남의 가치를 0.8로 본다면 0.8≥0.5입니다. 이 조건 아래에서는 제한을 지키는 편이 유리하지만, 집행을 대신해 주는 세계 정부가 생긴 것은 아닙니다.",
] as const;

const STEP_STATE = [
  { label: "위반 관측", value: "가능", detail: "공동 위치 기록", pass: true },
  { label: "대응 수단", value: "있음", detail: "항만 협력 중단", pass: true },
  { label: "계산 문턱", value: "0.5", detail: "(5−3)÷(5−1)", pass: true },
  { label: "미래 가치", value: "0.8", detail: "연례 갱신·사안 연계", pass: true },
] as const;

export default function AgreementDecisionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4700);
  const step = scenes.active;
  const activeLine = step < 3 ? step : 3;

  return (
    <VizFrame
      documentFlow
      eyebrow="절차와 의사코드를 함께 보기"
      title="이 합의가 스스로 설 수 있는지 어떤 순서로 판단할까요?"
      description="왼쪽 절차가 한 칸 움직일 때 오른쪽 의사코드의 같은 줄도 함께 강조됩니다."
      note="이 화면은 학습용 판정 절차입니다. 실제 조약 분석에서는 탐지 오류, 대응 비용, 국내 비준, 힘의 격차를 추가로 조사해야 합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="국제 합의의 유지 조건을 판정하는 절차와 의사코드"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-[39rem] min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary md:min-h-[31rem]"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="text-[11px] font-black text-primary">
            판정 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 min-h-12 text-base font-bold md:min-h-0">{SCENES[step]}</h4>

          <div className="mt-5 grid flex-1 gap-4 md:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground">같은 해협 사례의 상태</p>
              {STEP_STATE.map((item, index) => {
                const reached = index <= step;
                const current = index === step;
                return (
                  <div
                    key={item.label}
                    className={
                      "rounded-xl border p-3 transition-colors " +
                      (current
                        ? "border-primary bg-primary/10"
                        : reached
                          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                          : "border-border bg-muted/30 opacity-55")
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold">
                        {index + 1}. {item.label}
                      </span>
                      <span className={"rounded-full px-2 py-0.5 text-xs font-black " + (reached ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100" : "bg-muted text-muted-foreground")}>
                        {reached ? item.value : "아직 확인 전"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {reached ? item.detail : "앞 조건을 통과한 뒤 확인합니다."}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-muted-foreground">화면과 함께 실행되는 의사코드</p>
              <div className="mt-2 overflow-hidden rounded-xl border bg-slate-950 p-3 font-mono text-[11px] leading-6 text-slate-300 sm:text-xs">
                {CODE.map((line, index) => {
                  const highlight = index === activeLine || (step === 3 && index === 4);
                  return (
                    <div
                      key={line}
                      className={
                        "grid grid-cols-[1.5rem_1fr] rounded px-2 py-1 transition-colors " +
                        (highlight ? "bg-emerald-400/20 text-emerald-100" : "")
                      }
                    >
                      <span className="select-none text-slate-600">{index + 1}</span>
                      <code className="min-w-0 whitespace-pre-wrap break-words">{line}</code>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm leading-6 text-sky-950 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-100">
                <p className="text-xs font-black">이 단계에서 제도가 바꾸는 것</p>
                <p className="mt-1">
                  {step === 0 && "공동 기록과 검증이 observable을 거짓에서 참으로 바꿉니다."}
                  {step === 1 && "사전에 합의한 대응 절차가 response를 믿을 만하게 만듭니다."}
                  {step === 2 && "수치 장부가 막연한 신뢰를 0.5라는 비교 기준으로 바꿉니다."}
                  {step === 3 && "정기 갱신과 사안 연계가 미래에 잃을 가치를 키워 0.8이 문턱을 넘게 합니다."}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 min-h-36 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground md:min-h-0">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
