import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "틀렸다는 판단만으로는 끝나지 않습니다",
  "유지할 때 생기는 문제를 봅니다",
  "바꿀 때 흔들리는 것도 봅니다",
  "마지막 문턱은 법체계마다 다릅니다",
] as const;

const NOTES = [
  "현재 재판부가 다른 답을 선호한다는 사실만으로 기존 판례를 없애면, 재판부가 바뀔 때마다 법도 흔들립니다. 미국 연방대법원 자료도 단순한 의견 차이보다 더 강한 이유를 요구한다고 정리합니다.",
  "이유가 약한지, 실제 사건에 적용하기 너무 어려운지, 뒤의 판결들과 충돌하는지, 전제가 된 사실 이해가 달라졌는지를 확인합니다. 이 항목들은 판례를 유지할 비용을 보여 줍니다.",
  "사람과 기업이 기존 판단을 믿고 계약·투자·행정 절차를 꾸렸다면 변경 비용이 커집니다. 반대로 이미 예외가 너무 많아 누구도 믿기 어려운 판례라면 신뢰의 무게가 작아질 수 있습니다.",
  "미국의 요소 목록, 영국의 신중한 이탈 원칙, 한국의 전원합의체 절차는 같은 공식이 아닙니다. 어느 항목도 자동 점수가 아니며, 법원 위계와 사건 종류를 먼저 확인해야 합니다.",
] as const;

const keep = ["예측 가능성", "같은 사건의 같은 처리", "이미 형성된 신뢰"];
const change = ["이유의 결함", "적용 불가능성", "뒤 판결과 충돌", "사실 이해의 변화"];

export default function OverrulingThresholdViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const step = scenes.active;

  return (
    <VizFrame
      documentFlow
      eyebrow="판례를 바꿀 때의 장부"
      title="판례 변경은 정답 하나가 아니라 유지 비용과 변경 비용을 함께 보는 판단입니다"
      description="요소는 점수를 내는 공식이 아니라, 빠뜨리지 말아야 할 질문의 묶음입니다."
      note="미국 연방대법원의 헌법 판례 변경 요소를 중심으로 그린 개념도입니다. 영국과 한국은 변경 권한과 절차를 별도로 확인해야 합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="판례 유지와 변경에서 살펴볼 요소"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-[44rem] py-1 sm:min-h-[31rem]">
          <p className="text-[11px] font-black text-primary">장면 {step + 1} / {SCENES.length}</p>
          <h4 className="mt-2 text-base font-bold text-foreground">{SCENES[step]}</h4>

          <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
            <div className={`rounded-xl border p-4 ${step >= 2 ? "border-emerald-500/50 bg-emerald-500/[0.07]" : "border-border bg-muted/20"}`}>
              <p className="text-sm font-black text-foreground">그대로 둘 이유</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                {keep.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className={`rounded-xl border p-4 ${step >= 1 ? "border-rose-500/45 bg-rose-500/[0.06]" : "border-border bg-muted/20"}`}>
              <p className="text-sm font-black text-foreground">바꿀 이유</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                {change.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-primary/30 bg-primary/[0.05] p-4">
            <p className="text-xs font-bold text-muted-foreground">이 장면의 결론</p>
            <p className="mt-2 text-sm font-black leading-6 text-foreground">
              {step === 0 && "새 재판부의 선호와 판례를 바꿀 충분한 이유는 다릅니다."}
              {step === 1 && "유지할수록 법이 더 일관되지 않거나 작동하지 않는지도 봅니다."}
              {step === 2 && "바른 답으로 고치는 이익과 이미 쌓인 신뢰의 손실을 함께 봅니다."}
              {step === 3 && "누가 어떤 절차로 바꿀 수 있는지부터 해당 법체계에서 확인합니다."}
            </p>
          </div>

          <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
