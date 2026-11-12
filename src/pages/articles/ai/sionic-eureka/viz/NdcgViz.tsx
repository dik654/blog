import SceneShell from "./SceneShell";

/**
 * 본문 대응: #evaluation — NDCG@10 = DCG@10 / IDCG@10.
 * 등급 [1,0,2,0,0,1,0,0,0,0]은 설명용 가정. gain 2^r − 1, 할인 log₂(i+1).
 * DCG = 1 + 3/2 + 1/log₂7 ≈ 2.856, IDCG = 3 + 1/log₂3 + 1/2 ≈ 4.131, NDCG ≈ 0.691.
 */
const GRADES: readonly number[] = [1, 0, 2, 0, 0, 1, 0, 0, 0, 0];
const IDEAL: readonly number[] = [...GRADES].sort((a, b) => b - a);

const gain = (r: number) => 2 ** r - 1;
const discount = (rank: number) => Math.log2(rank + 1);
const dcg = (grades: readonly number[]) =>
  grades.reduce<number>((sum, r, i) => sum + gain(r) / discount(i + 1), 0);

const DCG = dcg(GRADES);
const IDCG = dcg(IDEAL);
const NDCG = DCG / IDCG;
const MAX_GAIN = 3;

const SCENES = [
  {
    label: "상위 10개에 등급을 붙입니다",
    summary: "gain = 2^r − 1",
    note: "검색 결과 상위 10개에 평가 label의 relevance 등급 r을 붙입니다. 등급 2는 gain 3, 등급 1은 gain 1, 0은 0입니다. 막대 높이가 gain입니다.",
  },
  {
    label: "순위가 뒤일수록 할인합니다",
    summary: `DCG@10 ≈ ${DCG.toFixed(3)}`,
    note: "각 gain을 log₂(순위+1)로 나눕니다. 1위는 1로 나눠 그대로, 3위는 2로 나눠 절반, 6위는 log₂7 ≈ 2.81로 나눕니다. 할인된 값을 더한 것이 DCG입니다.",
  },
  {
    label: "같은 문서를 이상적으로 정렬하면",
    summary: `IDCG@10 ≈ ${IDCG.toFixed(3)}`,
    note: "같은 judged 문서를 등급 내림차순으로 다시 놓고 같은 계산을 하면 이 query에서 낼 수 있는 최대 DCG가 나옵니다. 이것이 IDCG입니다.",
  },
  {
    label: "둘을 나누면 NDCG",
    summary: `${DCG.toFixed(3)} ÷ ${IDCG.toFixed(3)} ≈ ${NDCG.toFixed(3)}`,
    note: "실제 DCG를 IDCG로 나누면 0~1 사이 값이 됩니다. 등급 2 문서가 1위가 아니라 3위에, 등급 1 문서 하나가 3위가 아니라 6위에 있어서 1에 못 미칩니다.",
  },
] as const;

function Row({ label, grades, discounted, dim, total }: { label: string; grades: readonly number[]; discounted: boolean; dim: boolean; total: string }) {
  return (
    <div className={`min-w-0 ${dim ? "opacity-25" : ""}`}>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="font-semibold">{label}</span>
        <span className="font-mono font-bold text-primary">{total}</span>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {grades.map((r, i) => {
          const g = gain(r);
          const shown = discounted ? g / discount(i + 1) : g;
          return (
            <div key={i} className="flex min-w-0 flex-col items-center">
              <div className="flex h-11 w-full items-end rounded-sm bg-muted/40">
                <div
                  className="w-full rounded-sm transition-[height] duration-300 motion-reduce:transition-none"
                  style={{ height: `${(shown / MAX_GAIN) * 100}%`, backgroundColor: r === 2 ? "#2563eb" : "#60a5fa" }}
                />
              </div>
              <span className="mt-0.5 font-mono text-[11px] leading-4">{shown === 0 ? "0" : shown.toFixed(discounted && i > 0 ? 2 : 0)}</span>
              <span className="font-mono text-[11px] leading-4 text-muted-foreground">r={r}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NdcgViz() {
  return (
    <SceneShell
      eyebrow="NDCG@10 계산"
      title="같은 문서를 이상적으로 놓았을 때와 비교합니다"
      description="칸 하나가 검색 결과 한 자리(1위~10위)입니다. 막대 아래 숫자는 장면에 따라 gain 또는 할인된 gain입니다."
      note="등급 배치는 계산을 보이려는 가정입니다(0·1·2 세 등급, 관련 문서는 세 개뿐이고 judgment가 없는 문서는 non-relevant로 취급)."
      ariaLabel="한 query의 상위 10개 결과로 DCG, IDCG, NDCG를 계산하는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-3">
          <div className="grid grid-cols-10 gap-1 text-center text-[11px] leading-4 text-muted-foreground">
            {GRADES.map((_, i) => (
              <span key={i}>{i + 1}위</span>
            ))}
          </div>
          <Row
            label="실제 순위"
            grades={GRADES}
            discounted={active >= 1}
            dim={false}
            total={active >= 1 ? `DCG ≈ ${DCG.toFixed(3)}` : "gain"}
          />
          <Row
            label="이상적 정렬"
            grades={IDEAL}
            discounted={active >= 1}
            dim={active < 2}
            total={active >= 2 ? `IDCG ≈ ${IDCG.toFixed(3)}` : "아직 계산 전"}
          />
          <p className={`text-center font-mono text-sm font-bold ${active === 3 ? "text-primary" : "invisible"}`}>
            NDCG@10 = {DCG.toFixed(3)} ÷ {IDCG.toFixed(3)} ≈ {NDCG.toFixed(3)}
          </p>
        </div>
      )}
    />
  );
}
