import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 문서가 term 으로 분해되어 inverted index 로 바뀌고, query 가
 * posting list 를 타고 candidate 를 좁힌 뒤 BM25 score 로 정렬되는 과정.
 * 장면 = 색인·조회 파이프라인의 한 단계. 3문서 toy corpus 는 본문과 동일합니다.
 * stage 높이는 고정, control row 는 아래 고정 row. SVG viewBox 고정.
 */
const SCENES = [
  "문서 3개 · term 으로 분해",
  "Inverted index · term → posting list",
  "Query {banana, durian} · candidate 좁히기",
  "BM25 score 로 정렬",
] as const;

const NOTES = [
  "D1=apple apple banana, D2=apple cherry cherry, D3=apple banana durian. 색인은 각 문서를 bag of words 로 먼저 분해합니다.",
  "Term 마다 그 term 이 나오는 문서 id 목록(posting list)을 만듭니다. Apple 은 세 문서 전부, banana 는 D1·D3, cherry 는 D2, durian 은 D3 에만 있습니다.",
  "Query term banana·durian 의 posting list 를 모으면(union) candidate 는 D1·D3 이고, D2 는 후보에서 빠집니다. 전체 3문서가 아니라 candidate 2개만 봅니다.",
  "Candidate 마다 실제 포함된 term 의 BM25 기여를 더합니다. D3 은 banana·durian 둘 다 있어 D1(banana 만)보다 점수가 높아 먼저 반환됩니다.",
] as const;

const DOCS = [
  { id: "D1", x: 70, cy: 44, terms: ["apple×2", "banana×1"] },
  { id: "D2", x: 220, cy: 44, terms: ["apple×1", "cherry×2"] },
  { id: "D3", x: 370, cy: 44, terms: ["apple×1", "banana×1", "durian×1"] },
] as const;

const TERMS = [
  { id: "apple", x: 60, cy: 150, docs: ["D1", "D2", "D3"] },
  { id: "banana", x: 170, cy: 150, docs: ["D1", "D3"] },
  { id: "cherry", x: 280, cy: 150, docs: ["D2"] },
  { id: "durian", x: 380, cy: 150, docs: ["D3"] },
] as const;

const QUERY_TERMS = ["banana", "durian"];
const CANDIDATES = ["D1", "D3"];

function docX(id: string) {
  return DOCS.find((d) => d.id === id)?.x ?? 0;
}

const HIT_LABEL = [
  "색인 대상 3문서",
  "term 4개 · posting list 4개",
  "candidate 2 / 전체 3",
  "D3 ≈ 3.6 > D1 ≈ 2.3",
] as const;

const SUB_LABEL = [
  "bag of words 추출",
  "apple:[D1,D2,D3] 등",
  "union(banana, durian)",
  "BM25 score 내림차순",
] as const;

export default function LexicalRetrievalBm25InvertedIndexViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const scene = scenes.active;

  return (
    <VizFrame
      eyebrow="Inverted Index · BM25"
      title="문서는 term 으로, term 은 posting list 로, query 는 candidate 로 좁혀집니다"
      description="위쪽 3개 상자는 문서, 아래쪽 4개 상자는 term 입니다. 노란 선은 이번 장면에서 살아있는 연결, 회색은 있지만 이번엔 쓰지 않는 연결입니다."
      note="3문서 toy corpus 는 본문과 동일한 예시이며 실제 코퍼스 규모의 측정이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="문서 색인부터 BM25 정렬까지 posting list 를 타고 좁혀지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(33rem,calc(100dvh-15rem))] min-h-[26rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
            <div className="min-w-0 overflow-x-auto border border-border">
              <svg viewBox="0 0 460 210" className="h-[15.5rem] w-full min-w-[26rem]" role="img" aria-label="inverted index diagram">
                {scene < 3 && (
                  <>
                    {scene >= 1 &&
                      TERMS.map((t) =>
                        t.docs.map((docId) => {
                          const active =
                            scene === 2
                              ? QUERY_TERMS.includes(t.id) && CANDIDATES.includes(docId)
                              : true;
                          return (
                            <line
                              key={`${t.id}-${docId}`}
                              x1={t.x}
                              y1={t.cy - 14}
                              x2={docX(docId)}
                              y2={44 + 14}
                              className={active ? "stroke-amber-600/60" : "stroke-border"}
                              strokeWidth={1}
                            />
                          );
                        }),
                      )}

                    {DOCS.map((d) => {
                      const dim = scene === 2 && !CANDIDATES.includes(d.id);
                      return (
                        <g key={d.id}>
                          <rect
                            x={d.x - 44}
                            y={44 - 20}
                            width={88}
                            height={40}
                            className={dim ? "fill-muted/30 stroke-border" : "fill-muted stroke-border"}
                            strokeWidth={1}
                          />
                          <text x={d.x} y={44 - 22} textAnchor="middle" className="fill-foreground text-[9px] font-bold">
                            {d.id}
                          </text>
                          {d.terms.map((term, i) => (
                            <text
                              key={term}
                              x={d.x}
                              y={44 - 6 + i * 9}
                              textAnchor="middle"
                              className={dim ? "fill-muted-foreground text-[7px]" : "fill-muted-foreground text-[7px]"}
                            >
                              {term}
                            </text>
                          ))}
                        </g>
                      );
                    })}

                    {scene >= 1 &&
                      TERMS.map((t) => {
                        const isQueryTerm = QUERY_TERMS.includes(t.id);
                        const highlight = scene === 2 && isQueryTerm;
                        const dim = scene === 2 && !isQueryTerm;
                        return (
                          <g key={t.id}>
                            <rect
                              x={t.x - 34}
                              y={t.cy - 14}
                              width={68}
                              height={28}
                              className={
                                highlight
                                  ? "fill-primary/25 stroke-primary"
                                  : dim
                                    ? "fill-muted/30 stroke-border"
                                    : "fill-amber-500/15 stroke-amber-600"
                              }
                              strokeWidth={1}
                            />
                            <text x={t.x} y={t.cy + 4} textAnchor="middle" className="fill-foreground text-[9px] font-bold">
                              {t.id}
                            </text>
                          </g>
                        );
                      })}
                  </>
                )}

                {scene === 3 && (
                  <>
                    <text x={20} y={30} className="fill-muted-foreground text-[9px] font-bold">
                      Candidate 를 BM25 score 로 정렬
                    </text>
                    {[
                      { id: "D3", score: 3.6, terms: "banana + durian" },
                      { id: "D1", score: 2.3, terms: "banana 만" },
                    ].map((row, i) => (
                      <g key={row.id}>
                        <text x={20} y={70 + i * 50} className="fill-foreground text-[10px] font-bold">
                          {row.id}
                        </text>
                        <rect
                          x={60}
                          y={58 + i * 50}
                          width={row.score * 60}
                          height={20}
                          className={i === 0 ? "fill-primary/25 stroke-primary" : "fill-muted stroke-border"}
                          strokeWidth={1}
                        />
                        <text x={60 + row.score * 60 + 8} y={72 + i * 50} className="fill-foreground text-[9px]">
                          {row.score.toFixed(2)}
                        </text>
                        <text x={60} y={92 + i * 50} className="fill-muted-foreground text-[8px]">
                          {row.terms}
                        </text>
                      </g>
                    ))}
                  </>
                )}
              </svg>
            </div>

            <div className="flex min-h-[9rem] flex-col justify-between border border-border p-3 font-mono text-[11px]">
              <div>
                <p className="font-bold text-muted-foreground">candidate/score</p>
                <p className="mt-1 text-primary">{HIT_LABEL[scene]}</p>
              </div>
              <div>
                <p className="font-bold text-muted-foreground">연산</p>
                <p className="mt-1">{SUB_LABEL[scene]}</p>
              </div>
              <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-amber-600 bg-amber-500/15" /> posting 연결</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-primary bg-primary/25" /> query term/candidate</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-border bg-muted/30" /> 후보 아님</span>
              </div>
            </div>
          </div>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
