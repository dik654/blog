import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 1,000-token 문서(0)를 chunk size 500·overlap 50 으로 자르면
 * 세 chunk 가 겹치는 경계를 남기고(1), 480~530 문장은 그 겹침 덕에 두 번째 chunk 에
 * 통째로 남지만 overlap 이 없었다면 어느 chunk 에도 온전히 남지 않았을 것이며(2),
 * contextual retrieval 은 각 chunk 앞에 짧은 문맥을 붙여 그 손실을 한 번 더 메운다(3).
 * Stage 높이는 4 장면 중 가장 큰 scene 1(chunk 3개 + 문서 막대) 기준으로 고정한다.
 */
const SCENES = ["원본 문서", "Chunk size·overlap", "경계에 걸친 문장", "Contextual prefix"] as const;

const NOTES = [
  "1,000-token 문서 하나입니다. Parsing 을 거쳐 순서가 있는 텍스트와 원문 offset 을 갖췄습니다.",
  "Chunk size 500·overlap 50 으로 자르면 시작 위치는 0, 450, 900 이 되어 chunk 세 개가 나오고, 마지막 chunk 는 100 token 짜리 짧은 조각입니다.",
  "480~530 번째 token 에 걸친 문장은 overlap 덕에 두 번째 chunk [450,950) 안에 통째로 남습니다. Overlap 이 없었다면 [0,500) 과 [500,1,000) 어디에도 온전히 남지 않았을 것입니다.",
  "Contextual retrieval 은 이 chunk 앞에 LLM 이 만든 짧은 설명을 붙여, chunk 만 봐서는 알 수 없는 '어느 회사·어느 분기' 같은 문맥을 검색 신호에 더합니다.",
] as const;

const DOC_LEN = 1000;
const CHUNKS = [
  { label: "chunk 1", start: 0, end: 500 },
  { label: "chunk 2", start: 450, end: 950 },
  { label: "chunk 3", start: 900, end: 1000 },
] as const;
const SENTENCE = { start: 480, end: 530 };

function Bar({ children }: { children: React.ReactNode }) {
  return <div className="relative h-8 w-full border border-border bg-muted/30">{children}</div>;
}

function pct(v: number) {
  return `${(v / DOC_LEN) * 100}%`;
}

function DocScene() {
  return (
    <div className="mt-6">
      <Bar>
        <div className="absolute inset-y-0 left-0 flex w-full items-center justify-center text-[11px] font-bold text-muted-foreground">
          문서 (0 ~ 1,000 token)
        </div>
      </Bar>
      <p className="mt-3 text-[11px] font-bold text-muted-foreground">
        Parsing 이 제목·문단·표 구조와 원문 offset 을 보존한 상태입니다.
      </p>
    </div>
  );
}

function ChunkScene() {
  return (
    <div className="mt-6 space-y-2">
      {CHUNKS.map((c) => (
        <div key={c.label} className="flex items-center gap-3 text-xs">
          <span className="w-16 shrink-0 font-bold text-muted-foreground">{c.label}</span>
          <div className="relative h-6 flex-1 border border-border bg-muted/30">
            <div
              className="absolute inset-y-0 bg-primary/25"
              style={{ left: pct(c.start), width: pct(c.end - c.start) }}
            />
          </div>
          <span className="w-28 shrink-0 text-right font-mono text-[11px] text-foreground">
            [{c.start},{c.end})
          </span>
        </div>
      ))}
      <p className="pt-1 text-[11px] font-bold text-muted-foreground">
        stride = size − overlap = 450 → 시작 위치 0, 450, 900. N = ⌈(1,000−50)/450⌉ = 3
      </p>
    </div>
  );
}

function BoundaryScene() {
  return (
    <div className="mt-6 space-y-3">
      <div>
        <p className="mb-1 text-[11px] font-bold text-muted-foreground">Overlap 있음 (chunk 2 가 문장을 통째로 담음)</p>
        <div className="flex items-center gap-3 text-xs">
          <span className="w-16 shrink-0 font-bold text-muted-foreground">chunk 2</span>
          <div className="relative h-6 flex-1 border border-border bg-muted/30">
            <div className="absolute inset-y-0 bg-primary/25" style={{ left: pct(450), width: pct(500) }} />
            <div
              className="absolute inset-y-0 border-x border-foreground/60 bg-foreground/25"
              style={{ left: pct(SENTENCE.start), width: pct(SENTENCE.end - SENTENCE.start) }}
            />
          </div>
          <span className="w-28 shrink-0 text-right font-mono text-[11px] text-foreground">문장 480~530</span>
        </div>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-bold text-muted-foreground">Overlap 없음(가상) — chunk 1·2 모두 절반만 담음</p>
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-16 shrink-0 font-bold text-muted-foreground">chunk 1</span>
            <div className="relative h-6 flex-1 border border-border bg-muted/30">
              <div className="absolute inset-y-0 bg-primary/15" style={{ left: pct(0), width: pct(500) }} />
              <div
                className="absolute inset-y-0 border-x border-foreground/60 bg-foreground/25"
                style={{ left: pct(SENTENCE.start), width: pct(500 - SENTENCE.start) }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="w-16 shrink-0 font-bold text-muted-foreground">chunk 2</span>
            <div className="relative h-6 flex-1 border border-border bg-muted/30">
              <div className="absolute inset-y-0 bg-primary/15" style={{ left: pct(500), width: pct(500) }} />
              <div
                className="absolute inset-y-0 border-x border-foreground/60 bg-foreground/25"
                style={{ left: pct(500), width: pct(SENTENCE.end - 500) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContextualScene() {
  return (
    <div className="mt-6 space-y-3">
      <div className="border border-border p-3 text-xs">
        <p className="text-[11px] font-black text-primary">Prefix 없이 embedding</p>
        <p className="mt-2 leading-6 text-muted-foreground">
          "그 회사의 매출은 지난 분기보다 3 % 늘었다" — 어느 회사, 어느 분기인지 chunk 만으로는
          알 수 없습니다.
        </p>
      </div>
      <div className="border border-primary/55 bg-primary/5 p-3 text-xs">
        <p className="text-[11px] font-black text-primary">Contextual prefix 를 붙여 embedding</p>
        <p className="mt-2 font-mono text-[11px] text-foreground">
          [ACME 2024 Q2 실적 보고서 매출 항목] 그 회사의 매출은 지난 분기보다 3 % 늘었다
        </p>
        <p className="mt-2 leading-6 text-muted-foreground">
          top-20 검색 실패율 5.7 % → contextual embedding 3.7 % → +BM25 2.9 % → +rerank 1.9 %
        </p>
      </div>
    </div>
  );
}

export default function RagIngestionAndChunkingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  return (
    <VizFrame
      eyebrow="RAG ingestion"
      title="문서는 chunk 로 잘리고, overlap 과 contextual prefix 가 그 경계의 손실을 메웁니다"
      description="1,000-token 문서를 chunk size 500·overlap 50 으로 잘라 경계가 어떻게 겹치고, 문장이 잘리는 손실을 무엇이 메우는지 보여 줍니다."
      note="Chunk 개수·경계 위치는 계산된 값이고, 문장 예와 contextual prefix 문구는 설명용 예시입니다. 실패율 수치(5.7→1.9%)는 Anthropic 공식 발표 기준입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="RAG ingestion: 문서 파싱·chunking·overlap·contextual retrieval"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          {scenes.active === 0 && <DocScene />}
          {scenes.active === 1 && <ChunkScene />}
          {scenes.active === 2 && <BoundaryScene />}
          {scenes.active === 3 && <ContextualScene />}

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
