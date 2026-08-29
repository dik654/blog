import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 원 질문(0) 하나가 여러 변형 질의로 갈라지고(1),
 * 각 변형이 서로 다른 문서를 회수해 합집합 recall 이 오르며(2),
 * HyDE 는 변형 대신 가상의 답변 문서를 만들어 그 embedding 으로 검색한다(3).
 * Stage 높이는 4 장면 중 가장 큰 scene 2(질의 4개 + 문서 6개 grid) 기준으로 고정한다.
 */
const SCENES = ["원 질문", "여러 변형으로 분기", "결과를 합쳐 recall 상승", "HyDE: 가상 문서로 검색"] as const;

const NOTES = [
  "\"RAG 에서 chunk 는 왜 겹치게 자르나\" 라는 원 질문 하나입니다.",
  "LLM 이 표현이 다른 변형 질의 세 개를 더 만듭니다. 같은 뜻이지만 어휘가 달라 서로 다른 chunk 와 겹칠 수 있습니다.",
  "정답 근거 문서 6개 중 원 질의는 2개만 회수해 recall 33 % 입니다. 변형 세 개의 결과를 합치면 5개를 회수해 recall 이 83 % 로 오릅니다.",
  "HyDE 는 질의를 바꾸는 대신 질문에 대한 가상의 답변 문서를 LLM 으로 만들고, 그 문서를 embedding 해 검색합니다. 세부 사실이 틀려도 encoder 가 관련 방향으로 걸러냅니다.",
] as const;

const QUERIES: readonly { label: string; found: readonly number[] }[] = [
  { label: "원 질의", found: [1, 3] },
  { label: "변형 1", found: [1, 4] },
  { label: "변형 2", found: [2, 4] },
  { label: "변형 3", found: [3, 5] },
];
const TOTAL_RELEVANT = 6;

function QueryScene() {
  return (
    <div className="mt-6">
      <div className="border border-primary/55 bg-primary/5 p-4 text-sm font-bold text-foreground">
        "RAG 에서 chunk 는 왜 겹치게 자르나?"
      </div>
      <p className="mt-3 text-[11px] font-bold text-muted-foreground">
        Knowledge base 의 문서는 다른 어휘("overlap", "boundary loss")로 이 내용을 담고 있을 수 있습니다.
      </p>
    </div>
  );
}

function BranchScene() {
  return (
    <div className="mt-6 grid gap-2 sm:grid-cols-2">
      {QUERIES.map((q) => (
        <div
          key={q.label}
          className={`border px-3 py-2 text-xs font-bold ${
            q.label === "원 질의" ? "border-foreground/50 bg-foreground/5 text-foreground" : "border-primary/55 bg-primary/5 text-foreground"
          }`}
        >
          {q.label}
        </div>
      ))}
      <p className="col-span-2 pt-1 text-[11px] font-bold text-muted-foreground">
        원 질의 1개 + LLM 이 만든 변형 3개 = 4개의 서로 다른 질의
      </p>
    </div>
  );
}

function UnionScene() {
  const docs = Array.from({ length: TOTAL_RELEVANT }, (_, i) => i + 1);
  const singleFound = new Set(QUERIES[0].found);
  const unionFound = new Set(QUERIES.flatMap((q) => q.found));
  return (
    <div className="mt-6 space-y-3">
      <div>
        <p className="mb-1 text-[11px] font-bold text-muted-foreground">원 질의만 (recall {singleFound.size}/{TOTAL_RELEVANT} = 33%)</p>
        <div className="grid grid-cols-6 gap-1">
          {docs.map((d) => (
            <div
              key={d}
              className={`flex h-8 items-center justify-center border text-[11px] font-bold ${
                singleFound.has(d) ? "border-primary/55 bg-primary/20 text-foreground" : "border-border bg-muted/30 text-muted-foreground"
              }`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-bold text-muted-foreground">4개 질의 합집합 (recall {unionFound.size}/{TOTAL_RELEVANT} = 83%)</p>
        <div className="grid grid-cols-6 gap-1">
          {docs.map((d) => (
            <div
              key={d}
              className={`flex h-8 items-center justify-center border text-[11px] font-bold ${
                unionFound.has(d) ? "border-primary/55 bg-primary/20 text-foreground" : "border-border bg-muted/30 text-muted-foreground"
              }`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HydeScene() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="border border-border p-3 text-xs">
        <p className="text-[11px] font-black text-primary">1. 가상 문서 생성</p>
        <p className="mt-2 leading-6 text-muted-foreground">
          LLM 이 질문에 대한 그럴듯한 답변 문서를 만듭니다. 세부 사실은 틀려도 됩니다.
        </p>
      </div>
      <div className="border border-primary/55 bg-primary/5 p-3 text-xs">
        <p className="text-[11px] font-black text-primary">2. Embedding 으로 검색</p>
        <p className="mt-2 leading-6 text-muted-foreground">
          그 가상 문서를 encoder 로 embedding 해 검색 질의로 씁니다. 진짜 관련 문서와 비슷한
          방향에 놓입니다.
        </p>
      </div>
    </div>
  );
}

export default function QueryTransformationAndAdaptiveRetrievalViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  return (
    <VizFrame
      eyebrow="Query 변환"
      title="Query 는 여러 변형으로 갈라지고, 각 변형이 회수한 결과는 다시 합쳐집니다"
      description="원 질문이 multi-query 로 갈라져 서로 다른 문서를 회수하고, 그 합집합이 recall 을 끌어올리는 흐름과 HyDE 의 대안 경로를 보여 줍니다."
      note="Recall 33→83% 수치는 mechanism 을 보여 주는 계산된 예시이며 특정 시스템의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Query 변환과 적응형 검색"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          {scenes.active === 0 && <QueryScene />}
          {scenes.active === 1 && <BranchScene />}
          {scenes.active === 2 && <UnionScene />}
          {scenes.active === 3 && <HydeScene />}

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
