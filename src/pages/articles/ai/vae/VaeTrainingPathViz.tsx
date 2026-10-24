import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["분포 추정", "난수 분리", "복원 확률", "두 비용으로 학습"] as const;
const NOTES = [
  "입력 x=[1,0]에서 encoder가 평균 μ=[1,−0.5]와 log σ²=[0,−1.386]을 냅니다.",
  "ε=[0.5,−1]을 외부에서 뽑고 σ=[1,0.5]로 바꿔 z=μ+σ⊙ε=[1.5,−1]을 만듭니다.",
  "decoder가 Bernoulli 확률 π=[0.8,0.3]을 내면 x=[1,0]의 복원 음의 로그우도는 약 0.58입니다.",
  "posterior와 N(0,I)의 KL 약 0.94를 더해 loss 약 1.52를 만들고 encoder와 decoder를 함께 갱신합니다.",
] as const;

const BLOCKS = [
  { label: "Encoder", value: "μ · log σ²", detail: "qφ(z|x)", tone: "border-sky-500" },
  { label: "Sampler", value: "μ + σ⊙ε", detail: "z=[1.5,−1]", tone: "border-violet-500" },
  { label: "Decoder", value: "π=[0.8,0.3]", detail: "pθ(x|z)", tone: "border-emerald-500" },
  { label: "ELBO loss", value: "0.58 + 0.94", detail: "약 1.52", tone: "border-amber-500" },
] as const;

export default function VaeTrainingPathViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800, { loop: false });
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="한 번의 학습"
      title="한 점을 압축하지 않고, 분포에서 뽑아 두 비용으로 학습합니다"
      description="같은 이진 관측 하나가 encoder·표본·decoder·ELBO를 지나는 과정을 먼저 봅니다."
      note="숫자는 메커니즘을 검산하기 위한 가정입니다. 실제 학습 결과나 특정 데이터셋의 측정값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-scene="vae-training-path-viz"
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="VAE가 분포를 추정하고 표본을 복원해 두 비용으로 학습하는 네 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(31rem,calc(100svh-15rem))] sm:min-h-[24rem]"
      >
        <div key={step} data-viz-live-only className="flex min-h-0 flex-1 flex-col justify-center">
          <div className="grid grid-cols-4 gap-1 sm:gap-3">
            {SCENES.map((label, index) => (
              <div key={label} className={`min-w-0 border-t-2 pt-2 ${step >= index ? "border-primary" : "border-border text-muted-foreground"}`}>
                <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-1 block break-keep text-[10px] leading-4 sm:text-xs sm:leading-5">{label}</strong>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {BLOCKS.map((block, index) => (
              <div key={block.label} className={`min-w-0 border-l-2 bg-card px-3 py-3 ${step >= index ? block.tone : "border-border text-muted-foreground"}`}>
                <span className="block text-[10px] font-bold">{block.label}</span>
                <strong className="mt-1 block break-keep font-mono text-sm">{step >= index ? block.value : "대기"}</strong>
                <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{block.detail}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 border-l border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">{NOTES[step]}</p>
          <div className="mt-3 hidden grid-cols-3 gap-2 border-t border-border pt-3 text-xs leading-5 text-muted-foreground sm:grid">
            <p><strong className="block text-foreground">고정한 관측</strong>x=[1,0]</p>
            <p><strong className="block text-foreground">외부 난수</strong>ε=[0.5,−1]</p>
            <p><strong className="block text-foreground">갱신 대상</strong>encoder φ · decoder θ</p>
          </div>
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
