import DieGrid from "./DieGrid";
import { CLUSTER_ORDER, SCATTER_ORDER } from "./dieOrder";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 평균이 같을 때 고르게 흩어진 경우와 뭉친 경우(α=1).
 * λ=0.1: 포아송 904.8, α=5 905.7, α=1 909.1. λ=0.4: 포아송 670.3, α=5 680.6, α=1 714.3.
 * 결함 합계 1000λ ÷ 탈락 다이 수 = 탈락 다이 하나의 평균 결함.
 */
const CASES = [
  { poisson: 904.8, alpha1: 909.1 },
  { poisson: 670.3, alpha1: 714.3 },
] as const;

const SCENES = [
  { label: "λ = 0.1 · 결함 100개", summary: "904.8칸 ↔ 909.1칸", note: "같은 결함 100개를 어떻게 뿌려도 평균은 같습니다. 뭉치면 이미 죽은 다이에 결함이 더 떨어져, 탈락 다이 하나에 든 결함이 평균 1.05개에서 1.10개로 늘고 살아남는 칸이 조금 많습니다. α=5는 905.7칸으로, 이 평균에서는 차이가 작습니다." },
  { label: "λ = 0.4 · 결함 400개", summary: "670.3칸 ↔ 714.3칸", note: "10절의 4 cm² 면적을 넣으면 차이가 약 4.4%p로 벌어집니다. 탈락 다이 하나의 결함은 평균 1.21개와 1.40개이고 α=5는 680.6칸입니다. 평균이 클수록 뭉침을 무시한 포아송 식이 수율을 더 낮게 추정합니다." },
] as const;

const marksFor = (order: readonly number[], clean: number): ReadonlyMap<number, 1 | 2> =>
  new Map(order.slice(0, 1000 - Math.round(clean)).map((cell): [number, 1 | 2] => [cell, 1]));

const MARKS = CASES.map((item) => ({
  scatter: marksFor(SCATTER_ORDER, item.poisson),
  cluster: marksFor(CLUSTER_ORDER, item.alpha1),
}));

export default function ClusteringGridViz() {
  return (
    <SceneShell
      eyebrow="뭉침과 결함 0개"
      title="평균이 같아도 결함이 뭉치면 살아남는 다이가 조금 더 많습니다"
      description="칸 하나가 다이, 주황 칸이 탈락 다이입니다. α는 작을수록 결함이 일부 다이에 몰리는 값으로 α=1·α=5는 비교용이고, 칸 수는 반올림한 기댓값, 칸 위치는 설명용입니다(가정)."
      ariaLabel="같은 평균 결함 수에서 고르게 흩어진 경우와 뭉친 경우의 다이 격자"
      scenes={SCENES}
      render={(active) => {
        const item = CASES[active];
        const marks = MARKS[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 340 318" className="mx-auto h-auto w-full max-w-[360px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={0} y={12} fontSize={11} fontWeight={700} fill="currentColor">{`고르게 흩어짐(포아송) · 0개 다이 ${item.poisson}칸`}</text>
              <DieGrid marks={marks.scatter} label="고르게 흩어진 격자" y={18} />
              <text x={0} y={174} fontSize={11} fontWeight={700} fill="currentColor">{`뭉침(α=1) · 0개 다이 ${item.alpha1}칸`}</text>
              <DieGrid marks={marks.cluster} label="뭉친 격자" y={180} />
            </svg>
          </div>
        );
      }}
    />
  );
}
