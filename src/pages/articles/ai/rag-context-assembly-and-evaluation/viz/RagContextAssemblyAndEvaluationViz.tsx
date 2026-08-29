import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: rank된 candidate 가 예산 안에서 중복 제거·선택되고(0) → 남은 chunk 가
 * lost-in-the-middle 을 피하는 순서로 packing 되고(1) → 답변이 나오면 retrieval 지표와
 * generation 지표로 나눠 재고(2) → 낮은 지표가 가리키는 stage 로 실패가 귀속된다(3).
 * Stage 높이는 4 장면 중 가장 큰 scene 2(막대 4개) 기준으로 고정한다.
 */
const SCENES = ["예산·중복 제거", "Packing·ordering", "지표 분리", "실패 귀속"] as const;

const NOTES = [
  "Rerank top-8 후보 중 1·2위가 같은 내용을 반복합니다. Cosine 0.9 이상인 중복을 제거하면 같은 top-5 예산(2,500 token)으로 3·6·8위까지 채워 더 넓은 evidence를 확보합니다.",
  "선택된 4개 chunk를 그대로 순위대로 두면 가장 중요한 chunk가 가운데 배치돼 lost-in-the-middle로 무시될 위험이 있습니다. 중요도 1위·2위를 맨 앞·맨 끝으로 옮겨 배치합니다.",
  "같은 답변도 서로 다른 절반을 잽니다. Context precision·recall은 검색된 근거 자체가 relevant하고 빠짐없는지, groundedness·answer relevance는 생성된 답변이 그 근거를 지지받고 질문에 답하는지를 봅니다.",
  "네 지표 중 가장 먼저 무너진 지표가 실패 stage를 가리킵니다. Context recall이 낮으면 retrieval, context precision만 낮으면 ranking, precision·recall은 멀쩡한데 groundedness만 낮으면 generation failure입니다.",
] as const;

const CANDIDATES = [
  { rank: 1, dup: false, kept: true },
  { rank: 2, dup: true, kept: false },
  { rank: 3, dup: false, kept: true },
  { rank: 4, dup: false, kept: false },
  { rank: 5, dup: false, kept: false },
  { rank: 6, dup: false, kept: true },
  { rank: 7, dup: false, kept: false },
  { rank: 8, dup: false, kept: true },
] as const;

const PACKED_BEFORE = ["A(중요도 2)", "B(중요도 4)", "C(중요도 1)", "D(중요도 3)"] as const;
const PACKED_AFTER = ["C(중요도 1)", "B(중요도 4)", "D(중요도 3)", "A(중요도 2)"] as const;

const METRIC_BARS = [
  { name: "Context precision", value: 82, lane: "retrieval" as const },
  { name: "Context recall", value: 78, lane: "retrieval" as const },
  { name: "Groundedness", value: 45, lane: "generation" as const },
  { name: "Answer relevance", value: 88, lane: "generation" as const },
] as const;

const STAGES = ["Retrieval", "Ranking", "Generation"] as const;
const FAILED_STAGE_INDEX = 2; // Groundedness 만 낮으므로 generation failure 로 귀속

function BudgetScene() {
  return (
    <div className="mt-6 space-y-2">
      <div className="flex flex-wrap gap-2">
        {CANDIDATES.map((c) => (
          <div
            key={c.rank}
            className={`flex h-11 w-16 flex-col items-center justify-center border text-[11px] font-bold ${
              c.kept
                ? "border-primary/55 bg-primary/5 text-foreground"
                : c.dup
                  ? "border-border bg-muted/50 text-muted-foreground line-through"
                  : "border-border bg-muted/20 text-muted-foreground"
            }`}
          >
            <span>#{c.rank}</span>
            <span className="text-[9px] font-normal">{c.dup ? "중복" : c.kept ? "선택" : "탈락"}</span>
          </div>
        ))}
      </div>
      <p className="pt-1 text-[11px] font-bold text-muted-foreground">
        예산 top-5 자리에 중복(#2) 대신 #3·#6·#8을 채움 — 실질 정보량 증가
      </p>
    </div>
  );
}

function PackingScene() {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <p className="mb-1 text-[11px] font-bold text-muted-foreground">순위 그대로 배치</p>
        <div className="flex gap-2">
          {PACKED_BEFORE.map((label, i) => (
            <div
              key={label}
              className={`flex h-11 flex-1 items-center justify-center border px-1 text-center text-[10px] font-bold ${
                i === 1 ? "border-border bg-muted/20 text-muted-foreground" : "border-border bg-muted/40 text-foreground"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-bold text-muted-foreground">Ordering 적용 — 중요도 1·2위를 양끝에</p>
        <div className="flex gap-2">
          {PACKED_AFTER.map((label, i) => (
            <div
              key={label}
              className={`flex h-11 flex-1 items-center justify-center border px-1 text-center text-[10px] font-bold ${
                i === 0 || i === 3 ? "border-primary/55 bg-primary/5 text-foreground" : "border-border bg-muted/40 text-foreground"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricScene() {
  return (
    <div className="mt-6 space-y-2">
      {METRIC_BARS.map((m) => (
        <div key={m.name} className="flex items-center gap-3 text-xs">
          <span className="w-32 shrink-0 font-bold text-muted-foreground">{m.name}</span>
          <div className="relative h-5 flex-1 border border-border bg-muted/30">
            <div
              className={`h-full ${m.lane === "retrieval" ? "bg-primary/25" : "bg-foreground/25"}`}
              style={{ width: `${m.value}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right font-mono text-[11px] text-foreground">{m.value}</span>
        </div>
      ))}
      <p className="pt-1 text-[11px] font-bold text-muted-foreground">
        옅은 막대 = retrieval 측 지표, 진한 막대 = generation 측 지표
      </p>
    </div>
  );
}

function AttributionScene() {
  return (
    <div className="mt-6">
      <div className="flex gap-2">
        {STAGES.map((s, i) => (
          <div
            key={s}
            className={`flex h-16 flex-1 flex-col items-center justify-center border text-xs font-bold ${
              i === FAILED_STAGE_INDEX
                ? "border-primary/55 bg-primary/5 text-foreground"
                : "border-border bg-muted/30 text-muted-foreground"
            }`}
          >
            <span>{s}</span>
            <span className="text-[10px] font-normal">{i === FAILED_STAGE_INDEX ? "첫 실패" : "정상"}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] font-bold text-muted-foreground">
        Precision 82·recall 78로 retrieval·ranking은 정상, groundedness 45만 무너져 generation failure로 귀속
      </p>
    </div>
  );
}

export default function RagContextAssemblyAndEvaluationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  return (
    <VizFrame
      eyebrow="Context 조립과 평가"
      title="예산 안 선택부터 실패 stage 귀속까지 한 흐름으로 이어집니다"
      description="같은 candidate 집합이 선택·배치를 거쳐 답변이 되고, 그 답변은 다시 4개 지표로 쪼개져 실패 stage를 가리킵니다."
      note="지표 값과 candidate 개수는 예시이며, 실제 pipeline의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="RAG context 조립과 평가"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          {scenes.active === 0 && <BudgetScene />}
          {scenes.active === 1 && <PackingScene />}
          {scenes.active === 2 && <MetricScene />}
          {scenes.active === 3 && <AttributionScene />}
          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
