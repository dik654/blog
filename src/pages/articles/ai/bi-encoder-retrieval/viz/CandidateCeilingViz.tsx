import SceneShell from "./SceneShell";

/**
 * 본문 대응: #candidate — relevant {A,B,C}, candidate {A,D,E,F,G} → reranker의 relevant coverage 상한 1/3.
 * 문서 H, 첫 단계·rerank 순서, k=7 장면의 추가 문서(B, H)는 그림을 위한 가정입니다.
 */
const DOCS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
const RELEVANT = new Set<string>(["A", "B", "C"]);
const SLOTS = 7;

const SCENES = [
  {
    label: "정답 집합",
    summary: "relevant = {A, B, C}",
    list: [] as readonly string[],
    stage: "없음",
    note: "Label snapshot이 이 query의 정답으로 인정한 문서는 A, B, C입니다. 아직 첫 retriever는 아무것도 가져오지 않았습니다.",
  },
  {
    label: "첫 단계 candidate (k=5)",
    summary: "{A, D, E, F, G} · 정답 1/3",
    list: ["D", "E", "A", "G", "F"] as readonly string[],
    stage: "첫 단계 순서",
    note: "첫 retriever가 corpus에서 다섯 문서를 가져옵니다. 정답 중 A만 들어왔고 B와 C는 candidate 밖에 남았습니다. 칸 안의 순서는 가정입니다.",
  },
  {
    label: "Rerank 뒤",
    summary: "A가 위로 · 그래도 1/3",
    list: ["A", "E", "D", "G", "F"] as readonly string[],
    stage: "rerank 순서",
    note: "Reranker는 다섯 pair를 더 정교하게 읽어 순서만 바꿉니다. A를 맨 위로 올릴 수는 있어도 candidate 밖의 B와 C를 가져오지는 못하므로 relevant coverage 상한은 1/3입니다.",
  },
  {
    label: "교집합이 비면",
    summary: "{D, E, F, G, H} · 0/3",
    list: ["D", "E", "F", "G", "H"] as readonly string[],
    stage: "rerank 순서",
    note: "첫 단계가 정답을 하나도 넘기지 않으면(이 candidate는 가정) 순서를 어떻게 바꿔도 결과에 relevant 문서가 0개입니다. 입력 교집합이 비면 rerank 뒤 교집합도 비어 있습니다.",
  },
  {
    label: "k를 키우면 (가정 k=7)",
    summary: "B가 들어오면 2/3 · pair 7개",
    list: ["A", "B", "D", "E", "F", "G", "H"] as readonly string[],
    stage: "candidate",
    note: "앞의 k=5 candidate {A, D, E, F, G}에서 k를 7로 키웠을 때 B와 H가 더 들어왔다고 가정하면 candidate recall은 2/3으로 오를 수 있습니다. 대신 reranker가 읽을 pair가 5개에서 7개로 늘고 다음 model에 넘길 context도 커집니다.",
  },
] as const;

export default function CandidateCeilingViz() {
  return (
    <SceneShell
      eyebrow="두 단계 검색의 천장"
      title="Reranker는 candidate 칸 안의 순서만 바꿀 수 있습니다"
      description="위 줄은 corpus 문서이고, 테두리가 진한 칸이 정답(relevant)입니다. 채워진 칸은 candidate로 넘어간 문서입니다. 아래 줄은 reranker가 받은 칸입니다. H와 각 순서는 설명을 위한 가정입니다."
      ariaLabel="relevant 집합 A B C와 candidate 집합의 교집합이 reranker의 상한을 정하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const inCand = new Set(scene.list);
        const hits = scene.list.filter((d) => RELEVANT.has(d)).length;
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">corpus (일부)</p>
              <div className="grid grid-cols-8 gap-1.5">
                {DOCS.map((d) => {
                  const rel = RELEVANT.has(d);
                  const cand = inCand.has(d);
                  return (
                    <div
                      key={d}
                      className={`rounded-md py-2 text-center font-mono text-sm font-bold ${rel ? "border-2 border-emerald-600" : "border border-border"} ${cand ? "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100" : "bg-background"}`}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">진한 초록 테두리 = 정답 · 하늘색 = candidate로 넘어감</p>
            </div>
            <div>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-semibold text-muted-foreground">reranker가 받은 칸 · {scene.stage}</span>
                <span className="font-mono font-bold">{scene.list.length === 0 ? "정답 −" : `정답 ${hits}/3`}</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: SLOTS }, (_, i) => {
                  const d = scene.list[i];
                  const rel = d !== undefined && RELEVANT.has(d);
                  return (
                    <div
                      key={i}
                      className={`rounded-md py-2 text-center font-mono text-sm font-bold ${d === undefined ? "border border-dashed border-border/60 text-muted-foreground/50" : rel ? "border-2 border-emerald-600 bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100" : "border border-border bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100"}`}
                    >
                      {d ?? "·"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
