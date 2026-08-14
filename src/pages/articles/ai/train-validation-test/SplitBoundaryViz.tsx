import VizFrame from "@/components/viz/VizFrame";
import {
  LearningSceneControls,
  useLearningScenes,
} from "../deep-learning-overview/viz/LearningSceneControls";

const SCENES = ["train", "validation", "test", "재사용 경계"] as const;
const partitions = [
  { label: "TRAIN", width: "60%", color: "bg-sky-500", purpose: "parameter를 학습" },
  { label: "VALIDATION", width: "22%", color: "bg-violet-500", purpose: "후보를 선택" },
  { label: "TEST", width: "18%", color: "bg-emerald-500", purpose: "마지막 보고" },
] as const;

export default function SplitBoundaryViz() {
  const scenes = useLearningScenes(SCENES.length);
  return (
    <VizFrame
      eyebrow="Animated evaluation boundary"
      title="세 split은 비율 이름이 아니라 서로 다른 결정을 소유한다"
      description="같은 dataset에서 출발하지만 train은 weight, validation은 선택, test는 최종 보고만 바꿀 수 있습니다."
      note="60·22·18은 역할을 보여주는 예시 비율입니다. 실제 비율과 group·time 경계는 배포 단위에 맞춰야 합니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="Train validation test split 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex h-14 w-full overflow-hidden border border-border bg-background">
          {partitions.map((part, index) => (
            <div key={part.label} style={{ width: part.width }} className={`relative border-r border-background/70 last:border-r-0 ${part.color} ${scenes.active === index ? "opacity-100" : "opacity-30"}`}>
              <span className="absolute inset-0 flex items-center justify-center px-1 text-[9px] font-black text-white sm:text-xs">{part.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {partitions.map((part, index) => (
            <div key={part.label} className={`border p-4 transition-all ${scenes.active === index ? "border-primary bg-primary/10" : "border-border opacity-55"}`}>
              <p className="font-mono text-xs font-black">{part.label}</p>
              <p className="mt-2 text-sm font-bold">{part.purpose}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{index === 0 ? "gradient가 weight에 반영됨" : index === 1 ? "score를 보고 hyperparameter·checkpoint 선택" : "선택 종료 뒤 한 번 열어 generalization 보고"}</p>
            </div>
          ))}
        </div>
        <div className={`mt-5 grid gap-3 border p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center ${scenes.active === 3 ? "border-amber-500 bg-amber-500/10" : "border-border opacity-55"}`}>
          <div><p className="text-xs font-black text-amber-700 dark:text-amber-400">TEST를 보고 설정 변경</p><p className="mt-1 text-xs text-muted-foreground">결과가 선택 feedback으로 돌아감</p></div>
          <span aria-hidden className="hidden text-xl font-black text-amber-600 sm:block">↺</span>
          <div><p className="text-xs font-black">test → validation으로 역할 변경</p><p className="mt-1 text-xs text-muted-foreground">새 final holdout 없이는 독립 보고 불가</p></div>
        </div>
        <LearningSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
