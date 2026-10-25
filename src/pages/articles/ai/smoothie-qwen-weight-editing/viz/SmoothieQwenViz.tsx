import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["Token 후보", "Risk 추정", "행 배율", "다음 token 경쟁", "원본과 비교"] as const;
const NOTES = [
  "고정 tokenizer로 목표 문자에 직접 닿는 token과 여러 조각이 합쳐져야 문자가 되는 후보를 찾습니다.",
  "선택한 Unicode 범위와 n-gram 표본에서 token별 위험도 r을 추정합니다. r은 언어 판정이나 실제 생성 확률이 아닙니다.",
  "r=0.5, min_scale=0.5, smoothness=10이면 예시 배율은 약 0.630입니다. 선택된 lm_head 행에만 이 값을 곱합니다.",
  "바뀐 행과 현재 hidden state의 내적이 새 logit을 만들고, softmax가 vocabulary 전체 후보를 다시 정규화합니다.",
  "원본과 변환본에 같은 질문·생성 설정을 넣어 원치 않은 전환, 정답 3,200원과 정상 번역 ‘首尔’을 함께 확인합니다.",
] as const;

const STAGES = [
  ["Tokenizer", "candidate IDs"],
  ["Risk r", "Unicode · n-gram"],
  ["lm_head", "W′t=S(r)Wt"],
  ["Softmax", "vocabulary 전체"],
  ["짝지은 평가", "개선·회귀"],
] as const;

export default function SmoothieQwenViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  return (
    <VizFrame
      eyebrow="출력층 보정 · 한 token의 이동"
      title="위험도를 확률에 곧바로 곱하지 않고, 출력 행과 logit을 거쳐 전체 후보를 다시 비교합니다"
      description="목표 token 후보를 찾는 단계부터 원본 checkpoint와 결과를 비교하는 단계까지 같은 경로를 추적합니다."
      note="논문과 공개 구현이 설명하는 계산 경로입니다. 공개 실험의 억제율을 다른 checkpoint·언어·서비스에 그대로 적용하지 않습니다."
      canvasClassName="p-2 sm:p-7"
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="smoothie-qwen-weight-path"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Smoothie-Qwen이 token 위험도를 출력층 행과 logit 변화로 바꾸는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-auto min-h-0 min-w-0 flex-col overflow-visible outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(36rem,calc(100svh-8rem))] sm:min-h-[31rem] sm:overflow-y-auto"
      >
        <div data-viz-live-only className="flex flex-none flex-col justify-center">
          <p className="text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 break-keep text-lg font-bold">{SCENES[scenes.active]}</h4>
          <ol className="mt-4 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5">
            {STAGES.map(([title, artifact], index) => (
              <li key={title} className={`min-w-0 bg-background px-3 py-4 ${index === scenes.active ? "border-b-2 border-primary bg-primary/5" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}>
                <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-2 block break-keep text-xs leading-5">{title}</strong>
                <span className="mt-1 block break-keep font-mono text-[9px] leading-4">{artifact}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="border border-border p-3 text-center">
              <p className="text-[10px] font-bold text-muted-foreground">고정 예시</p>
              <p className="mt-1 font-mono text-sm font-bold">r=0.5 · m=0.5 · s=10</p>
            </div>
            <span className="hidden text-primary sm:block" aria-hidden>→</span>
            <div className={`border p-3 text-center ${scenes.active >= 2 ? "border-primary bg-primary/5" : "border-border"}`}>
              <p className="text-[10px] font-bold text-muted-foreground">계산 결과</p>
              <p className="mt-1 font-mono text-sm font-bold">S(r)≈0.630</p>
            </div>
          </div>
          <p data-scene-note className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{NOTES[scenes.active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="출력층 계산 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((label, index) => <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>)}
        </ol>
      </div>
    </VizFrame>
  );
}
