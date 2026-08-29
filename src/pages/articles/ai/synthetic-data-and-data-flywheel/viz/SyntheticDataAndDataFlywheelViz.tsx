import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: seed pool(0) → teacher/self generation 으로 후보 N개 생성(1) →
 * verifier·quality threshold 로 상위만 필터링(2) → 남은 데이터로 학습(3) →
 * 갱신된 모델에서 실패·성공 trajectory 를 모아 다음 seed pool 로 되돌린다(4).
 * 5 단계 pipeline 을 한 행에 고정해 두고, 매 장면마다 현재 단계를 강조하며
 * 마지막 장면에서 되돌아가는 화살표를 그려 순환을 보여 준다. Stage 높이는
 * 5 장면 중 가장 콘텐츠가 많은 장면(2번, 필터링 상세) 기준으로 고정한다.
 */
const STAGES = ["Seed pool", "생성", "Verifier/품질 필터", "학습", "실패·성공 수집"] as const;

const SCENES = [
  "Seed pool",
  "생성 (teacher/self-generated)",
  "Verifier · quality threshold",
  "학습 반영",
  "실패·성공 수집 → 다음 seed",
] as const;

const NOTES = [
  "첫 라운드는 사람이 쓴 seed task pool에서 시작합니다(Self-Instruct 기준 175개). 두 번째 라운드부터는 이전 라운드가 모은 trajectory가 이 자리를 채웁니다.",
  "각 seed 문제마다 teacher-generated 또는 self-generated 방식으로 N개의 후보를 만듭니다(RFT 예시에서는 문제당 k=100개).",
  "Verifier·model이 채점한 점수의 상위 몇 퍼센트만 남기고(quality thresholding), 남은 후보 중 pass rate 0%·100%인 문제는 curriculum에서 제외합니다.",
  "남은 curriculum 데이터로 모델을 SFT/RL로 학습합니다. 이 단계까지는 한 라운드 안에서 끝나는 직선 절차입니다.",
  "갱신된 모델을 다시 채점해 hard-example·failure trajectory와 success trajectory를 나눠 모으고, 이 결과가 다음 라운드의 seed pool로 되돌아가 loop가 닫힙니다.",
] as const;

function PipelineRow({ active }: { active: number }) {
  return (
    <div className="relative mt-6">
      <div className="grid grid-cols-5 gap-1.5">
        {STAGES.map((stage, index) => (
          <div
            key={stage}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 border px-1 text-center text-[11px] font-bold leading-tight ${
              index === active
                ? "border-primary bg-primary/10 text-foreground"
                : index < active
                  ? "border-primary/40 bg-primary/5 text-muted-foreground"
                  : "border-border bg-muted/30 text-muted-foreground"
            }`}
          >
            <span className="text-[10px] font-black text-primary/70">{String(index).padStart(2, "0")}</span>
            <span>{stage}</span>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 400 40" className="mt-1 h-8 w-full overflow-visible" aria-hidden="true">
        <path
          d="M 380 4 C 380 34, 20 34, 20 4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeDasharray={active === 4 ? "0" : "4 3"}
          className={active === 4 ? "text-primary" : "text-muted-foreground/50"}
        />
        <path
          d="M 20 4 L 15 10 M 20 4 L 26 9"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          className={active === 4 ? "text-primary" : "text-muted-foreground/50"}
        />
      </svg>
      <p className="-mt-1 text-center text-[10px] text-muted-foreground">
        실패·성공 trajectory가 다음 seed pool로 돌아오는 경로
      </p>
    </div>
  );
}

function GenerationDetail() {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-1.5">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="flex h-8 w-10 items-center justify-center border border-primary/40 bg-primary/5 text-[10px] font-bold text-muted-foreground">
          c{index + 1}
        </div>
      ))}
      <div className="flex h-8 w-16 items-center justify-center text-[10px] text-muted-foreground">… N개</div>
    </div>
  );
}

function FilterDetail() {
  const kept = [1, 3, 4, 8, 10];
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-1.5">
      {Array.from({ length: 12 }).map((_, index) => {
        const isKept = kept.includes(index);
        return (
          <div
            key={index}
            className={`flex h-8 w-10 items-center justify-center border text-[10px] font-bold ${
              isKept ? "border-primary bg-primary/15 text-foreground" : "border-border/60 bg-muted/20 text-muted-foreground/50 line-through"
            }`}
          >
            c{index + 1}
          </div>
        );
      })}
    </div>
  );
}

function TrainDetail() {
  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-[11px] font-bold">
      <div className="border border-primary/50 bg-primary/5 px-3 py-2 text-muted-foreground">Curriculum 데이터</div>
      <span className="text-primary">→</span>
      <div className="border border-primary bg-primary/10 px-3 py-2 text-foreground">Model (라운드 t+1)</div>
    </div>
  );
}

function MiningDetail() {
  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-[11px] font-bold">
      <div className="border border-primary bg-primary/10 px-3 py-2 text-foreground">Model (라운드 t+1)</div>
      <span className="text-primary">→</span>
      <div className="flex flex-col gap-1.5">
        <div className="border border-primary/50 bg-primary/5 px-3 py-1.5 text-muted-foreground">실패·hard-example</div>
        <div className="border border-border bg-muted/30 px-3 py-1.5 text-muted-foreground">success trajectory</div>
      </div>
      <span className="text-primary">→</span>
      <div className="border border-primary/50 bg-primary/5 px-3 py-2 text-muted-foreground">다음 seed pool</div>
    </div>
  );
}

export default function SyntheticDataAndDataFlywheelViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  return (
    <VizFrame
      eyebrow="Data flywheel · 한 바퀴"
      title="Seed에서 시작한 데이터가 필터·학습을 거쳐 다시 seed로 돌아옵니다"
      description="같은 5단계 pipeline에서 현재 라운드가 어느 단계에 있는지, 그리고 마지막 단계가 어떻게 첫 단계로 되먹임되는지 보여 줍니다."
      note="c1…c12, 상위 5개 유지 같은 숫자는 절차를 보여 주기 위한 예시이며 특정 데이터셋의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Seed pool에서 생성·필터·학습·수집을 거쳐 다시 seed pool로 돌아오는 data flywheel 순환"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <PipelineRow active={scenes.active} />

          {scenes.active === 1 && <GenerationDetail />}
          {scenes.active === 2 && <FilterDetail />}
          {scenes.active === 3 && <TrainDetail />}
          {scenes.active === 4 && <MiningDetail />}

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
