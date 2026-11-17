import SceneShell from "./SceneShell";

/**
 * 본문 대응: #evaluation의 Recall@k 식 — 정답 4개, top-10 안에 3개 → 3/4 = 0.75.
 * 정답이 놓인 순위는 설명용 가정: 위에 몰린 배치(1·2·3위)와 아래에 몰린 배치(8·9·10위).
 * 두 배치의 Recall@10은 같고, 순서는 NDCG@k가 따로 본다.
 */
const K = 10;
const RELEVANT = ["R1", "R2", "R3", "R4"] as const;

type Placement = { rank: number; doc: string }[];
const TOP: Placement = [
  { rank: 1, doc: "R1" },
  { rank: 2, doc: "R2" },
  { rank: 3, doc: "R3" },
];
const BOTTOM: Placement = [
  { rank: 8, doc: "R1" },
  { rank: 9, doc: "R2" },
  { rank: 10, doc: "R3" },
];

const SCENES = [
  { label: "정답 문서 4개", summary: `|R_q| = ${RELEVANT.length}`, note: "한 질문을 뒷받침하는 정답 문서 R1~R4를 모두 표시합니다. gold 하나만 두면 다른 정답 문서를 찾아와도 false negative(정답인데 오답으로 센 것)로 잘못 셀 수 있습니다.", placement: [] as Placement },
  { label: "정답이 위에 몰린 배치", summary: `${TOP.length} / ${RELEVANT.length} = ${TOP.length / RELEVANT.length}`, note: "Recall@10은 검색기가 돌려준 상위 10개 안에 정답이 몇 개 들어왔는지를 전체 정답 수로 나눈 값입니다. 1·2·3위에 정답 셋이 있고 R4는 10위 밖이므로 3/4 = 0.75입니다(순위는 가정).", placement: TOP },
  { label: "정답이 아래에 몰린 배치", summary: `${BOTTOM.length} / ${RELEVANT.length} = ${BOTTOM.length / RELEVANT.length}`, note: "같은 정답 셋이 8·9·10위로 내려가도 상위 10개 안에 든 개수는 3이므로 Recall@10은 그대로 0.75입니다. 높은 순위에 정답을 놓았는지는 NDCG@k로 따로 봅니다.", placement: BOTTOM },
] as const;

export default function RecallOrderViz() {
  return (
    <SceneShell
      eyebrow="Recall@k"
      title="정답이 위에 있든 아래에 있든 Recall@10은 같습니다"
      description="칸 하나가 검색 결과의 한 순위입니다. 색칠된 칸이 정답 문서이고, 오른쪽 칸은 10위 밖입니다. 정답 4개·top-10 안 3개는 본문의 예이고 순위 배치는 설명용입니다(가정)."
      ariaLabel="정답 문서 네 개가 top-10 안 다른 순위에 놓여도 Recall@10이 0.75로 같은 세 장면"
      scenes={SCENES}
      render={(active) => {
        const placement = SCENES[active].placement;
        const byRank = new Map(placement.map((item) => [item.rank, item.doc]));
        const found = new Set(placement.map((item) => item.doc));
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground">검색 순위</p>
              <div className="grid grid-cols-[repeat(10,minmax(0,1fr))_minmax(0,1.3fr)] gap-1">
                {Array.from({ length: K }, (_, index) => {
                  const rank = index + 1;
                  const doc = byRank.get(rank);
                  return (
                    <div
                      key={rank}
                      className={`flex min-w-0 flex-col items-center justify-center rounded-md border py-1.5 text-center ${
                        doc ? "border-[#2563eb] bg-[#2563eb]/15" : "border-border bg-background"
                      }`}
                    >
                      <span className="font-mono text-[9px] text-muted-foreground">{rank}</span>
                      <span className={`font-mono text-[10px] font-bold sm:text-xs ${doc ? "text-[#1d4ed8] dark:text-[#93c5fd]" : "text-muted-foreground/60"}`}>{doc ?? (active === 0 ? "?" : "·")}</span>
                    </div>
                  );
                })}
                <div className={`flex min-w-0 flex-col items-center justify-center rounded-md border border-dashed py-1.5 text-center ${active === 0 ? "border-border" : "border-[#dc2626]"}`}>
                  <span className="text-[9px] text-muted-foreground">밖</span>
                  <span className={`font-mono text-[10px] font-bold sm:text-xs ${active === 0 ? "text-muted-foreground/60" : "text-[#b91c1c] dark:text-[#fca5a5]"}`}>{active === 0 ? "?" : "R4"}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border pt-3">
              <div className="flex flex-wrap gap-1.5">
                {RELEVANT.map((doc) => (
                  <span
                    key={doc}
                    className={`rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${
                      found.has(doc) ? "border-[#2563eb] bg-[#2563eb]/15 text-[#1d4ed8] dark:text-[#93c5fd]" : "border-border text-muted-foreground"
                    }`}
                  >
                    {doc}
                  </span>
                ))}
              </div>
              <p className="text-right font-mono text-sm font-bold">
                {active === 0 ? "정답 4개" : `회수 ${found.size} / ${RELEVANT.length}`}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
