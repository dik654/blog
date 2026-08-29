import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 원본 CommonCrawl 문서 100%가 언어 식별(1) → 품질 필터(2) → dedup(3)을
 * 지나며 좁아지는 깔때기. 수치는 RefinedWeb 논문 Figure 2의 근사치(저자 자기보고, 정확한
 * 표가 아니라 그림에서 읽은 값)이며 다른 코퍼스·파이프라인에서는 달라질 수 있습니다.
 * Stage 높이는 4 장면 중 막대 4개가 모두 보이는 마지막 장면 기준으로 고정한다.
 */
const SCENES = ["원본 CommonCrawl", "언어 식별 후", "품질 필터 후", "Dedup 완료"] as const;

const NOTES = [
  "RefinedWeb 파이프라인은 CommonCrawl에서 뽑은 원본 문서 전체를 100%로 두고 시작합니다.",
  "영어가 아니거나 언어 판별 confidence가 낮은 문서를 걷어내면 남는 문서는 약 48%입니다.",
  "줄 단위·문서 단위 품질 휴리스틱을 적용하면 그중 다시 약 23%만 최종 후보로 남습니다.",
  "MinHash 기반 near-duplicate 제거와 exact substring dedup까지 마치면 원본의 10% 미만만 학습 corpus로 남습니다.",
] as const;

const STAGES = [
  { label: "원본 CommonCrawl", pct: 100, detail: "45TB 압축 텍스트 (필터링 전)" },
  { label: "언어 식별 후", pct: 48, detail: "영어 판별 confidence 미달 제거" },
  { label: "품질 필터 후", pct: 23, detail: "line·document 휴리스틱 통과분만" },
  { label: "Dedup 완료", pct: 9, detail: "MinHash near-dup + exact substring 제거" },
] as const;

function FunnelScene({ upTo }: { upTo: number }) {
  return (
    <div className="mt-6 space-y-2.5">
      {STAGES.map((stage, index) => {
        const shown = index <= upTo;
        return (
          <div key={stage.label} className={shown ? "opacity-100" : "opacity-35"}>
            <div className="flex items-baseline justify-between gap-2 text-[11px]">
              <span className="font-bold text-foreground">{stage.label}</span>
              <span className="font-mono font-bold text-primary">{shown ? `${stage.pct}%` : "—"}</span>
            </div>
            <div className="mt-1 h-5 w-full border border-border bg-muted/30">
              <div
                className={`h-full ${shown ? "bg-primary/45" : "bg-transparent"}`}
                style={{ width: `${shown ? stage.pct : 0}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{stage.detail}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function LlmDatasetEngineeringAndCleaningViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  return (
    <VizFrame
      eyebrow="Filtering → dedup 깔때기"
      title="원본 문서는 필터·dedup 단계를 지날 때마다 줄어듭니다"
      description="CommonCrawl 원본 문서 비율을 100%로 두고, 언어 식별·품질 필터·dedup을 지나며 남는 비율이 어떻게 좁아지는지 보여 줍니다."
      note="수치는 RefinedWeb 논문 Figure 2에서 읽은 근사치이며, 이 글이 새로 측정한 값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="원본 데이터가 필터링과 dedup을 거치며 줄어드는 깔때기"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[26rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <FunnelScene upTo={scenes.active} />

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
