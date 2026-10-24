import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["입력 한 쌍", "대상만 오염", "한 문맥으로 결합", "대상 오차로 학습"] as const;
const NOTES = [
  "완성된 참조와 같은 인물의 생성 대상을 한 학습 쌍으로 준비합니다.",
  "참조는 깨끗하게 유지하고 생성 대상에만 시점 t의 노이즈를 섞습니다.",
  "두 latent를 한 sequence로 이어붙여 기존 self-attention이 구간 사이 대응을 찾게 합니다.",
  "참조 위치는 조건으로만 쓰고 대상 위치의 velocity 오차만 LoRA A·B에 반영합니다.",
] as const;

const ITEMS = [
  { label: "참조", detail: "깨끗한 latent", tone: "border-emerald-500 text-emerald-700 dark:text-emerald-300" },
  { label: "생성 대상", detail: "학습할 latent", tone: "border-violet-500 text-violet-700 dark:text-violet-300" },
  { label: "같은 문맥", detail: "self-attention", tone: "border-sky-500 text-sky-700 dark:text-sky-300" },
  { label: "LoRA 갱신", detail: "대상 오차만", tone: "border-amber-500 text-amber-700 dark:text-amber-300" },
] as const;

export default function InContextLoraViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400, { loop: false });
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="학습 과정"
      title="참조는 조건으로 남기고 생성 대상만 복원합니다"
      description="별도 cross-attention을 더하지 않고 입력 배열과 loss 위치만 바꿉니다."
      note="이 구조는 self-attention 기반 DiT와 같은 latent space를 쓰는 reference·target을 전제로 합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-scene="in-context-lora-training-viz"
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="참조와 생성 대상을 한 문맥으로 학습하는 네 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(30rem,calc(100svh-15rem))] sm:min-h-[23rem]"
      >
        <div key={step} data-viz-live-only className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">장면 {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-4 sm:gap-3 sm:items-stretch">
            {ITEMS.map((item, index) => {
              const visible = step >= index;
              const current = step === index;
              return (
                <div key={item.label} className="relative min-w-0">
                  <div
                    className={`h-full border-l-2 bg-card px-3 py-2.5 transition-colors sm:py-3 ${
                      visible ? item.tone : "border-border text-muted-foreground"
                    } ${current ? "bg-muted/60" : ""}`}
                  >
                    <span className="block text-[10px] font-black">{String(index + 1).padStart(2, "0")}</span>
                    <strong className="mt-1 block break-keep text-sm">{item.label}</strong>
                    <span className="mt-1 block break-keep text-xs leading-5 text-muted-foreground">
                      {index === 0 && "zref · noise 없음"}
                      {index === 1 && (step >= 1 ? "ztgt=(1−t)x0+tε" : item.detail)}
                      {index === 2 && (step >= 2 ? "[zref | ztgt]" : item.detail)}
                      {index === 3 && (step >= 3 ? "loss mask [0 | 1]" : item.detail)}
                    </span>
                  </div>
                  {index < ITEMS.length - 1 && (
                    <span aria-hidden className={`absolute -right-3 top-1/2 hidden -translate-y-1/2 text-xs sm:block ${step > index ? "text-primary" : "text-border"}`}>→</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 sm:mt-5 sm:gap-3 sm:pt-4">
            <p className="break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
              <strong className="block text-foreground">기반 모델</strong>
              모든 가중치는 고정합니다.
            </p>
            <p className="break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
              <strong className="block text-foreground">self-attention</strong>
              참조와 대상 token을 함께 비교합니다.
            </p>
            <p className="break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
              <strong className="block text-foreground">LoRA A·B</strong>
              {step === 3 ? "대상 위치의 오차로만 갱신됩니다." : "마지막 장면에서만 갱신 경로가 열립니다."}
            </p>
          </div>

          <p className="mt-4 border-l border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:mt-5 sm:pl-4 sm:text-sm sm:leading-7">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}>
              <strong>{label}</strong>
              <span className="mt-1 block text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
