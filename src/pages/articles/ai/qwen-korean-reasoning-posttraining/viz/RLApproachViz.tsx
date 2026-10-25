import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["SFT 출발점", "12개 후보", "항목별 채점", "Judge 보정", "상대 점수", "단계별 평가"] as const;
const NOTES = [
  "고정된 한국어 풀이 예시로 response token의 loss를 줄여 따라 쓸 수 있는 출발 checkpoint를 만듭니다.",
  "현재 policy가 같은 질문에서 12개 후보를 새로 생성합니다. 이 후보는 SFT의 고정 정답과 다른 학습 데이터입니다.",
  "정확도·형식·언어·길이를 따로 채점하고 원시 점수와 checker version을 한 기록에 남깁니다.",
  "논문은 frozen judge로 accuracy reward를 보정했다고 보고합니다. 교체·결합 범위는 구현에서 다시 확인해야 하며 Judge도 오류가 가능한 측정기입니다.",
  "같은 질문의 평균 reward를 빼서 평균보다 나은 후보는 양수, 나쁜 후보는 음수인 advantage를 만듭니다.",
  "Base→SFT→RL checkpoint를 같은 독립 평가셋에서 비교해 언어 일관성과 정답 품질, 회귀를 단계별로 분리합니다.",
] as const;

const STAGES = [
  ["SFT", "fixed examples"],
  ["Rollout", "current policy"],
  ["Reward", "four components"],
  ["Oracle", "frozen review"],
  ["Dr.GRPO", "group advantage"],
  ["Evaluation", "base · SFT · RL"],
] as const;

export default function RLApproachViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  return (
    <VizFrame
      eyebrow="두 단계 학습 · 데이터가 바뀌는 지점"
      title="SFT의 고정 예시와 RL의 현재-policy 후보는 서로 다른 학습 신호입니다"
      description="한 질문이 SFT checkpoint, rollout, checker·judge, group-relative update와 단계별 평가를 지나는 순서를 봅니다."
      note="논문의 단일 실험 구성을 설명합니다. 30,000개 예시·12개 rollout·8×H100은 보편적인 최소 조건이 아니라 해당 실험의 범위입니다."
      canvasClassName="p-2 sm:p-7"
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="qwen-korean-posttraining-path"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Qwen 한국어 SFT와 oracle-guided Dr.GRPO 학습 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-auto min-h-0 min-w-0 flex-col overflow-visible outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(37rem,calc(100svh-8rem))] sm:min-h-[32rem] sm:overflow-y-auto"
      >
        <div data-viz-live-only className="flex flex-none flex-col justify-center">
          <p className="text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 break-keep text-lg font-bold">{SCENES[scenes.active]}</h4>
          <ol className="mt-4 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6">
            {STAGES.map(([title, artifact], index) => (
              <li key={title} className={`min-w-0 bg-background px-3 py-4 ${index === scenes.active ? "border-b-2 border-primary bg-primary/5" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}>
                <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-2 block break-keep text-xs leading-5">{title}</strong>
                <span className="mt-1 block break-keep font-mono text-[9px] leading-4">{artifact}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[["Base", "기준"], ["SFT", "모방 효과"], ["RL", "보상 효과"]].map(([label, detail], index) => (
              <div key={label} className={`border p-3 text-center ${scenes.active === 5 || (scenes.active === 0 && index <= 1) || (scenes.active > 0 && index === 1) ? "border-primary/70 bg-primary/5" : "border-border"}`}>
                <strong className="text-sm">{label}</strong>
                <span className="mt-1 block text-[10px] text-muted-foreground">{detail}</span>
              </div>
            ))}
          </div>
          <p data-scene-note className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{NOTES[scenes.active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="학습 흐름 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((label, index) => <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>)}
        </ol>
      </div>
    </VizFrame>
  );
}
