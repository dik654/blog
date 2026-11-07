import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cache-taxonomy — 다섯 종류가 무엇을 저장하고 어느 작업을 건너뛰는지.
 * Exact-match·semantic hit은 절차의 execute(LLM 호출·검색·도구 실행 중 해당 작업) 앞에서 끝나므로 도구 실행까지 건너뛴다.
 * 이 글이 정하지 않은 작업은 "별개"로 두어 실행 여부를 단정하지 않는다. Embedding hit 뒤에는 semantic hit도 miss도 올 수 있어 LLM 호출은 별개다.
 */
type NodeState = "skip" | "run" | "other";

const NODES = ["embedding 계산", "검색 조회", "LLM 호출", "외부 API·함수"] as const;

const SCENES = [
  { label: "Exact-match", summary: "문자열이 완전히 같으면", note: "요청 문자열이 완전히 같을 때 저장된 응답을 돌려줍니다. Exact-match를 먼저 보므로 hit이면 embedding도 만들지 않고, 실제 실행 단계가 통째로 빠져 그 요청에 딸린 검색·LLM 호출·도구 실행도 건너뜁니다.", stores: "요청과 응답", states: ["skip", "skip", "skip", "skip"] },
  { label: "Semantic", summary: "문자열이 달라도 뜻이 비슷하면", note: "비교하려면 요청의 embedding이 필요합니다. 유사도가 기준선 이상이면 실제 실행 단계가 통째로 빠져 그 요청에 딸린 검색·LLM 호출·도구 실행을 건너뜁니다. Exact-match와 같은 층이지만 판정 기준이 다릅니다.", stores: "요청의 embedding과 응답", states: ["run", "skip", "skip", "skip"] },
  { label: "Retrieval", summary: "같은 조회의 문서 목록", note: "vector DB나 검색 엔진이 돌려준 문서 목록을 저장합니다. LLM 호출 이전 단계만 건너뛰며, LLM 호출 자체를 대신하지는 않습니다.", stores: "조회 결과 문서 목록", states: ["other", "skip", "run", "other"] },
  { label: "Embedding", summary: "같은 텍스트의 vector", note: "텍스트를 embedding vector로 바꾼 결과를 저장합니다. 이것도 LLM 호출 이전 단계이며 그 계산만 건너뜁니다.", stores: "텍스트의 embedding vector", states: ["skip", "other", "other", "other"] },
  { label: "Tool result", summary: "같은 인자의 호출 결과", note: "외부 API·함수 호출 결과를 저장합니다. 같은 좌표로 날씨를 다시 물으면 API를 부르지 않습니다. 부수 효과가 있는지 함께 확인해야 하는 유일한 종류입니다.", stores: "API·함수 호출 결과", states: ["other", "other", "other", "skip"] },
] as const satisfies readonly { label: string; summary: string; note: string; stores: string; states: readonly NodeState[] }[];

const STATE_TEXT: Record<NodeState, string> = { skip: "건너뜀", run: "실행", other: "별개" };

function Node({ name, state }: { name: string; state: NodeState }) {
  const style = state === "skip" ? "border-primary bg-primary/15" : state === "run" ? "border-border bg-background" : "border-dashed border-border/60 text-muted-foreground";
  return (
    <div className={`rounded-lg border px-2 py-2 text-center ${style}`}>
      <span className="block text-xs font-semibold leading-5">{name}</span>
      <span className={`block text-xs font-bold leading-5 ${state === "skip" ? "text-primary" : ""}`}>{STATE_TEXT[state]}</span>
    </div>
  );
}

function MapPanel({ states, stores }: { states: readonly NodeState[]; stores: string }) {
  return (
    <div className="min-w-0">
      <p className="text-sm"><span className="font-semibold text-muted-foreground">저장 대상 </span><span className="font-bold">{stores}</span></p>
      <div className="mt-3 grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-2">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold text-muted-foreground">LLM 호출 이전</p>
          <div className="grid grid-cols-2 gap-1.5">
            <Node name={NODES[0]} state={states[0]} />
            <Node name={NODES[1]} state={states[1]} />
          </div>
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold text-muted-foreground">생성</p>
          <Node name={NODES[2]} state={states[2]} />
        </div>
      </div>
      <div className="mt-3">
        <p className="mb-1 text-xs font-semibold text-muted-foreground">LLM 바깥</p>
        <Node name={NODES[3]} state={states[3]} />
      </div>
    </div>
  );
}

export default function CacheSkipMapViz() {
  return (
    <SceneShell
      eyebrow="다섯 종류의 자리"
      title="다섯 cache는 서로 다른 작업을 건너뜁니다"
      description="LLM 애플리케이션에서 cache가 대신할 수 있는 작업을 칸으로 놓았습니다. ‘별개’는 이 cache의 hit이 그 작업의 실행 여부를 정하지 않는다는 표시입니다."
      ariaLabel="다섯 cache 종류별로 저장 대상과 건너뛰는 작업을 표시한 지도"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={SCENES.map((scene) => <MapPanel key={scene.label} states={scene.states} stores={scene.stores} />)} />}
    />
  );
}
