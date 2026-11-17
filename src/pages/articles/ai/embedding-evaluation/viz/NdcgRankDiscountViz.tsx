import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #metrics interpretation — relevant 4개 중 top-10에 3개면 Recall@10=.75,
 * 같은 세 문서라도 grade 3 문서가 1위인지 10위인지에 따라 NDCG가 달라진다.
 * grade(3,2,1,1)와 grade 2·1 문서의 순위(2위·5위)는 가정.
 * gain = 2^r − 1 → 7, 3, 1 · discount = 1/log2(i+1)
 * IDCG = 7·1 + 3·.631 + 1·.5 + 1·.431 ≈ 9.82
 * grade 3이 1위: DCG ≈ 9.28 → NDCG ≈ .94 · 10위: DCG ≈ 4.30 → NDCG ≈ .44
 */
const K = 10;
const discount = (rank: number) => 1 / Math.log2(rank + 1);
const gain = (grade: number) => 2 ** grade - 1;

/** rank → grade. 비어 있는 rank는 relevant가 아닌 문서. */
type Ranking = Readonly<Record<number, number>>;

const IDEAL: Ranking = { 1: 3, 2: 2, 3: 1, 4: 1 };
const TOP_FIRST: Ranking = { 1: 3, 2: 2, 5: 1 };
const TOP_LAST: Ranking = { 10: 3, 2: 2, 5: 1 };

const dcg = (ranking: Ranking) =>
  Object.entries(ranking).reduce<number>((sum, [rank, grade]) => sum + gain(grade) * discount(Number(rank)), 0);

const IDCG = dcg(IDEAL);
const f2 = (v: number) => v.toFixed(2);
const fr = (v: number) => v.toFixed(2).replace(/^0/, "");

const GRADE_COLOR: Readonly<Record<number, string>> = { 3: "#1d4ed8", 2: "#3b82f6", 1: "#93c5fd" };

const SCENES = [
  {
    label: "Recall@10: 4개 중 3개",
    summary: "3 / 4 = .75",
    note: "Relevant 문서 4개 중 3개가 top-10 안에, 1개(grade 1)가 밖에 있습니다. Recall은 몇 위에 있든 들어왔는지만 세므로 .75입니다.",
  },
  {
    label: "IDCG: 같은 label의 최선 순서",
    summary: `IDCG ≈ ${f2(IDCG)}`,
    note: "Top-10 밖으로 빠진 문서까지 포함한 네 label을 grade 순으로 1~4위에 놓았을 때의 DCG입니다. 이 값이 NDCG의 분모입니다.",
  },
  {
    label: "Grade 3 문서가 1위",
    summary: `${f2(dcg(TOP_FIRST))} / ${f2(IDCG)} ≈ ${fr(dcg(TOP_FIRST) / IDCG)}`,
    note: "가장 중요한 문서의 gain 7이 할인 없이(×1) 들어갑니다. 놓친 grade 1 문서와 5위로 밀린 grade 1 문서 몫만 이상값보다 모자랍니다.",
  },
  {
    label: "Grade 3 문서가 10위",
    summary: `${f2(dcg(TOP_LAST))} / ${f2(IDCG)} ≈ ${fr(dcg(TOP_LAST) / IDCG)}`,
    note: `세 문서는 그대로라 Recall@10은 여전히 .75입니다. Gain 7에 10위 할인 ${fr(discount(10))}이 곱해져 ${f2(7 * discount(10))}만 남고, NDCG가 절반 아래로 내려갑니다.`,
  },
] as const;

function RankList({ ranking, showCalc, missed }: { ranking: Ranking; showCalc: boolean; missed: boolean }) {
  const ranks = Array.from({ length: K }, (_, i) => i + 1);
  const maxContribution = gain(3);
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[1.5rem_2.5rem_minmax(0,1fr)_2.75rem] sm:grid-cols-[2.25rem_3.25rem_minmax(0,1fr)_3.5rem] items-center gap-x-2 border-b border-border pb-1 text-[11px] text-muted-foreground">
        <span>순위</span>
        <span>할인</span>
        <span>문서 · gain × 할인</span>
        <span className="text-right">기여</span>
      </div>
      {ranks.map((rank) => {
        const grade = ranking[rank];
        const value = grade === undefined ? 0 : gain(grade) * discount(rank);
        return (
          <div key={rank} className="grid h-6 grid-cols-[1.5rem_2.5rem_minmax(0,1fr)_2.75rem] sm:grid-cols-[2.25rem_3.25rem_minmax(0,1fr)_3.5rem] items-center gap-x-2 text-xs">
            <span className="font-mono">{rank}</span>
            <span className="font-mono text-muted-foreground">{fr(discount(rank))}</span>
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="inline-flex h-5 w-14 shrink-0 items-center justify-center rounded border text-[11px] font-semibold"
                style={
                  grade === undefined
                    ? { borderColor: "#cbd5e1", color: "#94a3b8" }
                    : { borderColor: GRADE_COLOR[grade], backgroundColor: GRADE_COLOR[grade], color: grade === 1 ? "#0f172a" : "#ffffff" }
                }
              >
                {grade === undefined ? "무관" : `grade ${grade}`}
              </span>
              {showCalc && grade !== undefined && (
                <div className="h-3 min-w-0 flex-1 rounded-sm bg-muted/40">
                  <div className="h-full rounded-sm" style={{ width: `${(value / maxContribution) * 100}%`, backgroundColor: "#2563eb" }} />
                </div>
              )}
            </div>
            <span className="text-right font-mono">{showCalc && grade !== undefined ? f2(value) : ""}</span>
          </div>
        );
      })}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 text-xs">
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">top-10 밖:</span>
          <span
            className="inline-flex h-5 w-14 items-center justify-center rounded border text-[11px] font-semibold"
            style={missed ? { borderColor: GRADE_COLOR[1], backgroundColor: GRADE_COLOR[1], color: "#0f172a" } : { borderColor: "#cbd5e1", color: "#94a3b8" }}
          >
            {missed ? "grade 1" : "없음"}
          </span>
        </span>
        <span className="font-mono font-bold">{showCalc ? `합 ${f2(dcg(ranking))}` : "3 / 4 = .75"}</span>
      </div>
    </div>
  );
}

export default function NdcgRankDiscountViz() {
  return (
    <SceneShell
      eyebrow="Recall · NDCG"
      title="같은 세 문서를 찾아도 순서가 바뀌면 NDCG가 달라집니다"
      description="Grade는 문서가 얼마나 좋은 답인지 매긴 relevance 등급입니다. Gain은 2^grade − 1(grade 3→7, 2→3, 1→1), 할인은 1/log₂(순위+1)이고, 기여 = gain × 할인을 더한 값이 DCG입니다. 네 문서의 grade와 grade 2·1 문서의 순위는 가정입니다."
      ariaLabel="top-10 순위표에서 Recall@10, IDCG, grade 3 문서가 1위와 10위일 때의 NDCG 계산"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <RankList key="recall" ranking={TOP_FIRST} showCalc={false} missed />,
            <RankList key="ideal" ranking={IDEAL} showCalc missed={false} />,
            <RankList key="first" ranking={TOP_FIRST} showCalc missed />,
            <RankList key="last" ranking={TOP_LAST} showCalc missed />,
          ]}
        />
      )}
    />
  );
}
