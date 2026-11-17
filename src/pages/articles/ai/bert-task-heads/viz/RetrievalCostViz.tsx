import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retrieval — cross-encoder는 document마다 query와 다시 forward, bi-encoder는 100만 document vector를 미리 index,
 * two-stage는 bi-encoder ANN 상위 100 후보를 cross-encoder로 rerank.
 * query 하나당 encoder forward 수: cross만(가정) 1,000,000 · bi 1 · two-stage 1 + 100 = 101. 막대는 로그 눈금.
 */
const DOCS = 1_000_000;
const CANDIDATES = 100;
const LOG_MAX = 6;

const ACCENT = "#2563eb";
const WARN = "#d97706";

const SCENES = [
  {
    label: "Cross-encoder만 쓴다면 (가정)",
    summary: `query당 forward ${DOCS.toLocaleString("en-US")}번`,
    forwards: DOCS,
    before: "미리 할 수 있는 일이 없습니다. Pair는 query가 와야 만들 수 있습니다.",
    perQuery: `Query와 document를 한 input으로 묶어 ${DOCS.toLocaleString("en-US")}개 pair를 하나씩 forward합니다.`,
    gain: "모든 token이 서로 상호작용한 pair score를 얻습니다.",
    note: "본문은 cross-encoder를 상위 100개 reranking에 씁니다. 이 장면은 같은 방식을 100만 document 전체에 쓴다고 가정해, document마다 다시 forward하는 비용이 query마다 그대로 쌓인다는 점을 보입니다.",
  },
  {
    label: "Bi-encoder",
    summary: "query당 forward 1번 + vector 검색",
    forwards: 1,
    before: `Document ${DOCS.toLocaleString("en-US")}개를 각각 vector로 만들어 index에 한 번 저장합니다.`,
    perQuery: "Query만 forward해 vector 하나를 만들고, 저장된 vector와 similarity로 후보를 찾습니다.",
    gain: "Query와 document의 token-level interaction은 retrieval 전에 볼 수 없습니다.",
    note: "Document 쪽 forward는 query가 오기 전에 끝나고 재사용됩니다. 대신 두 문장을 함께 읽지 않으므로 pair interaction을 포기합니다. Vanilla BERT CLS가 추가 학습 없이 강한 retrieval vector라는 뜻은 아닙니다.",
  },
  {
    label: "Two-stage retrieval",
    summary: `forward 1 + ${CANDIDATES} = ${1 + CANDIDATES}번`,
    forwards: 1 + CANDIDATES,
    before: "Bi-encoder로 document vector index를 미리 만듭니다.",
    perQuery: `ANN으로 상위 ${CANDIDATES}개 후보를 고르고, 그 ${CANDIDATES}개 pair만 cross-encoder로 forward해 rerank합니다.`,
    gain: "Recall@100, NDCG@10, p95를 단계별로 따로 측정합니다.",
    note: "ANN은 가장 비슷한 vector를 근사로 빠르게 찾는 검색입니다. Recall@100은 찾아야 할 문서가 1단계 100개 후보 안에 든 비율, NDCG@10은 최종 상위 10개에서 관련 문서가 위에 있을수록 높은 순위 점수, p95는 요청 지연의 95번째 백분위입니다.",
  },
] as const;

const TICKS = [
  { exp: 0, label: "1" },
  { exp: 2, label: "100" },
  { exp: 4, label: "10,000" },
  { exp: 6, label: "1,000,000" },
] as const;

function Slot({ title, body, color }: { title: string; body: string; color: string }) {
  return (
    <div className="min-w-0 rounded-lg border px-3 py-2" style={{ borderColor: `${color}66` }}>
      <p className="text-[11px] font-black tracking-[0.08em]" style={{ color }}>
        {title}
      </p>
      <p className="mt-1 text-sm leading-6">{body}</p>
    </div>
  );
}

export default function RetrievalCostViz() {
  return (
    <SceneShell
      eyebrow="Query 하나에 드는 forward"
      title="100만 document에서 cross와 bi-encoder가 일을 나누는 방식"
      description="본문의 100만 document와 상위 100개 후보를 씁니다. 아래 막대는 query 하나가 올 때마다 encoder를 몇 번 forward하는지를 로그 눈금으로 그립니다."
      ariaLabel="Cross-encoder, bi-encoder, two-stage retrieval의 query당 forward 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        const width = (Math.log10(scene.forwards) / LOG_MAX) * 100;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 gap-2 sm:grid-cols-3">
              <Slot title="Query가 오기 전" body={scene.before} color="#64748b" />
              <Slot title="Query마다" body={scene.perQuery} color={ACCENT} />
              <Slot title={active === 2 ? "측정" : active === 0 ? "얻는 것" : "포기하는 것"} body={scene.gain} color={WARN} />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-semibold">Query 하나당 forward 수</span>
                <span className="font-mono font-bold" style={{ color: ACCENT }}>
                  {scene.forwards.toLocaleString("en-US")}
                </span>
              </div>
              <div className="relative mt-2 h-4 rounded-sm bg-muted/50">
                <div
                  className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `max(3px, ${width}%)`, backgroundColor: ACCENT }}
                />
              </div>
              <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
                {TICKS.map((tick) => (
                  <span
                    key={tick.exp}
                    className="absolute top-0 font-mono"
                    style={
                      tick.exp === 0
                        ? { left: 0 }
                        : tick.exp === LOG_MAX
                          ? { right: 0 }
                          : { left: `${(tick.exp / LOG_MAX) * 100}%`, transform: "translateX(-50%)" }
                    }
                  >
                    {tick.label}
                  </span>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">로그 눈금: 한 칸 오를 때마다 100배입니다.</p>
            </div>
          </div>
        );
      }}
    />
  );
}
