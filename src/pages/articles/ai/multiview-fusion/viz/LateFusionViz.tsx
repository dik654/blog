import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MultiviewMobileStageFlow from "../MultiviewMobileStageFlow";

const SCENES = ["관측별 표현", "측면 제외", "가중치 다시 계산", "상품 판정"] as const;
const NOTES = [
  "정면·측면·밑창·위쪽 관측을 각 인코더가 같은 크기의 표현 h_v로 바꿉니다. RGB 관측끼리는 가중치를 공유할 수 있습니다.",
  "측면 관측의 mask가 0이면 빈 표현을 평균에 넣지 않습니다. 점수 a_side가 커도 softmax의 분자와 분모에서 모두 제외합니다.",
  "남은 세 관측의 점수 [0, 1, 0.5]만 정규화해 α≈[0.186, 0.506, 0.307]을 얻습니다. 세 값의 합은 1입니다.",
  "가중합 h=Σα_vh_v를 판정 head에 보내 shoe-017의 ‘검수 필요’ 확률을 냅니다. 가중치 자체를 원인 설명으로 단정하지 않습니다.",
] as const;
const STAGES = [
  { title: "각 관측을 표현으로", detail: "front·side·sole·top → h₁…h₄" },
  { title: "빠진 관측 제거", detail: "m_side=0이면 정규화에서도 제외" },
  { title: "남은 값 재정규화", detail: "α_front+α_sole+α_top=1" },
  { title: "묶음 하나를 판정", detail: "가중합 표현 → 검수 결과" },
] as const;
const VIEWS = [
  { name: "정면", mask: 1, score: "0", weight: "0.186" },
  { name: "측면", mask: 0, score: "5", weight: "0" },
  { name: "밑창", mask: 1, score: "1", weight: "0.506" },
  { name: "위쪽", mask: 1, score: "0.5", weight: "0.307" },
] as const;

export default function LateFusionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="표현 단계 결합"
      title="빠진 관측은 가중치의 분모에서부터 제외합니다"
      description="관측별 표현을 만든 뒤, 측면 카메라가 빠진 같은 상품 묶음에서 가중합을 계산합니다."
      note="점수와 가중치는 계산을 보여 주기 위한 가정입니다. 반올림 때문에 표시값의 합은 0.999입니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="multiview-masked-aggregation"
        tabIndex={0}
        role="group"
        aria-label="관측별 표현에서 누락 관측을 제외하고 하나의 판정을 만드는 네 단계"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[21rem] flex-col justify-center sm:min-h-[23rem]">
          <p className="text-[11px] font-black text-primary">장면 · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MultiviewMobileStageFlow items={STAGES} active={step} ariaLabel="표현 단계 결합의 네 단계" />
          <div className="mt-6 hidden border-y border-border sm:block">
            <div className="grid grid-cols-[6rem_4rem_minmax(0,1fr)_5rem] gap-4 border-b border-border py-2 text-[10px] font-bold text-muted-foreground">
              <span>관측</span><span>mask</span><span>현재 처리</span><span className="text-right">α</span>
            </div>
            {VIEWS.map((view) => {
              const absent = view.mask === 0 && step >= 1;
              return (
                <div key={view.name} className={`grid grid-cols-[6rem_4rem_minmax(0,1fr)_5rem] gap-4 border-b border-border py-3 text-xs last:border-b-0 ${absent ? "text-muted-foreground line-through" : ""}`}>
                  <strong>{view.name}</strong>
                  <span className="font-mono">{step >= 1 ? view.mask : "?"}</span>
                  <span>{step === 0 ? "인코더 → h" : step === 1 ? (absent ? "집계에서 제외" : "인코더 → h") : `a=${view.score}로 정규화`}</span>
                  <span className="text-right font-mono text-emerald-700 dark:text-emerald-300">{step >= 2 ? view.weight : "—"}</span>
                </div>
              );
            })}
          </div>
          <p className={`mt-4 text-xs font-semibold ${step === 3 ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}>
            {step === 3 ? "h = 0.186h_front + 0.506h_sole + 0.307h_top → 검수 필요" : "남은 관측만으로 하나의 상품 표현을 만듭니다"}
          </p>
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
