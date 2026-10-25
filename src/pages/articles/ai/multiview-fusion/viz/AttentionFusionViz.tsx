import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MultiviewMobileStageFlow from "../MultiviewMobileStageFlow";

const SCENES = ["패치에 주소 붙이기", "관측 사이 연결", "계산량 확인", "누락으로 검사"] as const;
const NOTES = [
  "각 패치는 보이는 내용 E(x)뿐 아니라 사진 안 위치 p, 카메라 q, pose·시각 r(c)를 함께 가져야 어느 관측의 어느 지점인지 구분됩니다.",
  "정면의 긁힘 패치가 밑창과 위쪽 관측의 관련 패치를 조회합니다. 주소표는 관계를 찾을 단서일 뿐 정확한 3차원 대응을 보장하지 않습니다.",
  "관측 4개가 각각 196개 토큰을 남기면 784개 토큰과 614,656개 query-key 쌍이 생깁니다. 측면이 빠지면 588개와 345,744쌍으로 줄어듭니다.",
  "같은 shoe-017에서 측면만 가리고 loss 변화를 잽니다. 전체·누락 조건의 표본을 같게 유지해야 관측 의존성을 짝지어 비교할 수 있습니다.",
] as const;
const STAGES = [
  { title: "패치 주소", detail: "내용 + 위치 + 카메라 + pose·시각" },
  { title: "관측 간 attention", detail: "다른 화면의 관련 패치를 조회" },
  { title: "토큰 쌍 예산", detail: "784²과 588²을 구분" },
  { title: "누락 개입", detail: "같은 상품에서 측면만 가려 loss 비교" },
] as const;

export default function AttentionFusionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600, { loop: false, autoPlay: false });
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="토큰 단계 결합"
      title="공간 관계를 오래 남기면 관측 사이 연결과 비용을 함께 봐야 합니다"
      description="패치의 주소, 관측 간 조회, 제곱으로 늘어나는 쌍, 누락 검사까지 같은 상품 묶음으로 추적합니다."
      note="토큰 수와 loss 비교는 설명용 가정이며 실제 지연·메모리는 대상 장비에서 측정해야 합니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="multiview-cross-view-attention"
        tabIndex={0}
        role="group"
        aria-label="멀티뷰 패치 주소에서 누락 관측 평가까지의 네 단계"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[21rem] flex-col justify-center sm:min-h-[23rem]">
          <p className="text-[11px] font-black text-primary">장면 · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MultiviewMobileStageFlow items={STAGES} active={step} ariaLabel="토큰 단계 결합의 네 단계" />
          <div className="mt-6 hidden gap-px bg-border p-px sm:grid sm:grid-cols-4">
            <div className={`min-w-0 border-t-2 px-3 py-4 ${step >= 0 ? "border-primary bg-background" : "border-border"}`}>
              <strong className="text-xs">패치 토큰</strong>
              <code className="mt-2 block break-words text-[10px] leading-5">E(x)+p+q+r(c)</code>
            </div>
            <div className={`min-w-0 border-t-2 px-3 py-4 ${step >= 1 ? "border-primary bg-primary/8" : "border-border bg-background text-muted-foreground"}`}>
              <strong className="text-xs">관측 간 조회</strong>
              <span className="mt-2 block text-[10px] leading-5">정면 query → 밑창·위쪽 key/value</span>
            </div>
            <div className={`min-w-0 border-t-2 px-3 py-4 ${step >= 2 ? "border-primary bg-primary/8" : "border-border bg-background text-muted-foreground"}`}>
              <strong className="text-xs">계산량</strong>
              <span className="mt-2 block font-mono text-[10px] leading-5">4×196=784<br />784²=614,656</span>
            </div>
            <div className={`min-w-0 border-t-2 px-3 py-4 ${step >= 3 ? "border-primary bg-primary/8" : "border-border bg-background text-muted-foreground"}`}>
              <strong className="text-xs">누락 검사</strong>
              <span className="mt-2 block text-[10px] leading-5">같은 상품의 full loss와 side-drop loss 비교</span>
            </div>
          </div>
          <div className="mt-4 grid gap-2 border-y border-border py-3 text-xs sm:grid-cols-2">
            <p><strong>전체 4관측</strong><span className="ml-2 font-mono text-muted-foreground">784 tokens · 614,656 pairs</span></p>
            <p><strong>측면 누락</strong><span className="ml-2 font-mono text-muted-foreground">588 tokens · 345,744 pairs</span></p>
          </div>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]"><strong>{index + 1}. {label}</strong><span className="text-muted-foreground">{NOTES[index]}</span></li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
