import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: golden set 을 category·edge case 로 채우고(0) → slice 별로 나눠 보면
 * 전체 평균 뒤에 숨은 failure slice 가 드러나고(1) → harness 가 그 golden set 을
 * offline→shadow→A/B 게이트로 밀어 넣고(2) → shadow 와 A/B 가 서로 다른 방식으로
 * 배포 여부를 판정한다(3). Stage 높이는 4 장면 중 가장 큰 scene 2 기준으로 고정한다.
 */
const SCENES = ["표본 구성", "슬라이스 분석", "배포 관문", "관찰과 실험"] as const;

const NOTES = [
  "평가 표본 200개를 범주별로 채우고, 그중 20개는 경계·공격 사례로 둡니다.",
  "전체 평균은 90%지만 기타 언어만 72%입니다. 평균 하나로는 이 실패를 볼 수 없습니다.",
  "자동 채점 뒤 오프라인·그림자·A/B 관문을 차례로 통과한 후보만 배포합니다.",
  "그림자는 후보 응답을 버리고 지표만 봅니다. A/B는 사용자에게 후보 응답을 보여 준 뒤 차이를 판정합니다.",
] as const;

const CATEGORIES = [
  { name: "Fact QA", count: 60, edge: 6 },
  { name: "요약", count: 40, edge: 4 },
  { name: "Code", count: 50, edge: 5 },
  { name: "안전 거절", count: 30, edge: 3 },
  { name: "Multi-turn", count: 20, edge: 2 },
] as const;
const TOTAL = 200;

const SLICES = [
  { name: "전체 평균", value: 90, failure: false },
  { name: "영어", value: 95, failure: false },
  { name: "한국어", value: 88, failure: false },
  { name: "기타 언어", value: 72, failure: true },
] as const;

const STAGES = ["Golden set", "Coverage", "Harness", "Offline", "Shadow", "A/B", "Deploy"] as const;
const PASSED_UPTO = 3; // "Offline" 까지 통과, index 4(Shadow) 는 진행 중

function CategoryScene() {
  return (
    <div className="mt-6 space-y-2">
      {CATEGORIES.map((c) => (
        <div key={c.name} className="flex items-center gap-3 text-xs">
          <span className="w-20 shrink-0 font-bold text-muted-foreground">{c.name}</span>
          <div className="relative h-5 flex-1 border border-border bg-muted/30">
            <div className="h-full bg-primary/25" style={{ width: `${(c.count / TOTAL) * 100}%` }} />
            <div
              className="absolute inset-y-0 left-0 border-r border-foreground/50 bg-foreground/15"
              style={{ width: `${(c.edge / TOTAL) * 100}%` }}
            />
          </div>
          <span className="w-16 shrink-0 text-right font-mono text-[11px] text-foreground">{c.count}/200</span>
        </div>
      ))}
      <p className="pt-1 text-[11px] font-bold text-muted-foreground">
        어두운 구간 = edge case·adversarial (합계 20/200, 10 %)
      </p>
    </div>
  );
}

function SliceScene() {
  return (
    <div className="mt-6 space-y-2">
      {SLICES.map((s) => (
        <div key={s.name} className="flex items-center gap-3 text-xs">
          <span className="w-20 shrink-0 font-bold text-muted-foreground">{s.name}</span>
          <div className="relative h-5 flex-1 border border-border bg-muted/30">
            <div
              className={`h-full ${s.failure ? "bg-foreground/40" : "bg-primary/25"}`}
              style={{ width: `${s.value}%` }}
            />
          </div>
          <span
            className={`w-14 shrink-0 text-right font-mono text-[11px] ${s.failure ? "font-bold text-foreground" : "text-foreground"}`}
          >
            {s.value}%
          </span>
        </div>
      ))}
      <p className="pt-1 text-[11px] font-bold text-muted-foreground">
        기타 언어 slice 가 failure slice — 전체 평균이 가리는 −18%p 격차
      </p>
    </div>
  );
}

function PipelineScene() {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {STAGES.map((s, index) => {
          const passed = index < PASSED_UPTO;
          const current = index === PASSED_UPTO;
          return (
            <div
              key={s}
              className={`flex min-w-20 flex-1 items-center justify-center border px-2 py-3 text-center text-[11px] font-bold ${
                passed
                  ? "border-primary/55 bg-primary/10 text-foreground"
                  : current
                    ? "border-foreground/60 bg-foreground/10 text-foreground"
                    : "border-border bg-muted/30 text-muted-foreground"
              }`}
            >
              {passed ? "✓ " : ""}
              {s}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] font-bold text-muted-foreground">
        Golden set → Coverage → Harness → Offline 까지 통과, Shadow 는 관찰 중, A/B·Deploy 는 대기
      </p>
    </div>
  );
}

function ShadowAbScene() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
      <div className="border border-border p-3 text-xs">
        <p className="text-[11px] font-black text-primary">Shadow evaluation</p>
        <p className="mt-2 hidden leading-6 text-muted-foreground sm:block">
          트래픽 10 % 에 candidate 를 붙입니다. 사용자에게는 기존 model 응답을 보내고, candidate 응답은
          버리며 지표만 기록합니다.
        </p>
        <p className="mt-2 text-[10px] leading-5 text-muted-foreground sm:hidden">기존 응답 전달<br />후보 응답 폐기<br />지표만 기록</p>
        <p className="mt-2 font-mono text-[9px] text-foreground sm:text-[11px]">split 없음 · 관찰만</p>
      </div>
      <div className="border border-border p-3 text-xs">
        <p className="text-[11px] font-black text-primary">A/B testing</p>
        <p className="mt-2 hidden leading-6 text-muted-foreground sm:block">
          트래픽을 50/50 으로 나눠 사용자가 실제 candidate 응답을 받습니다. 지표 차이가 우연보다 큰지
          유의성 검정으로 판정합니다.
        </p>
        <p className="mt-2 text-[10px] leading-5 text-muted-foreground sm:hidden">트래픽 50/50<br />후보 응답 노출<br />차이 검정</p>
        <p className="mt-2 font-mono text-[9px] text-foreground sm:text-[11px]">split 50/50 · p &lt; 0.001</p>
      </div>
    </div>
  );
}

export default function EvaluationDatasetsAndPipelinesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  return (
    <VizFrame
      eyebrow="평가 데이터셋 → 파이프라인"
      title="Golden set 을 채우는 일과 배포 게이트를 통과하는 일은 같은 파이프라인의 앞뒤입니다"
      description="Category·edge case 로 채운 golden set 이 slice 분석과 harness 를 거쳐 offline·shadow·A/B 게이트를 차례로 통과하는 흐름입니다."
      note="수치는 파이프라인 구조를 보여 주기 위한 예시이며 특정 시스템의 실측값이 아닙니다. Slice 예의 −18%p 격차 패턴은 ML Test Score 논문이 보고한 실제 사례를 본뜬 것입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="evaluation-dataset-pipeline-viz"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Golden set 구축부터 A/B 배포까지의 평가 파이프라인"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100svh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          {scenes.active === 0 && <CategoryScene />}
          {scenes.active === 1 && <SliceScene />}
          {scenes.active === 2 && <PipelineScene />}
          {scenes.active === 3 && <ShadowAbScene />}

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}>
              <strong>{String(index + 1).padStart(2, "0")} · {label}</strong>
              <span className="mt-1 block text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
