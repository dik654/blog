import ExplainedFormula from "@/components/ui/explained-formula";
import XGBoostSplitViz from "./viz/XGBoostSplitViz";

export default function XGBoost() {
  return (
    <section id="xgboost" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">XGBoost는 한 round의 loss를 2차로 근사해 split과 leaf 값을 함께 평가합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          새 tree가 기존 score에 조금 더해진다고 보고 sample별 loss를 Taylor
          expansion으로 2차까지 근사하면, raw row의 target 대신 gradient gᵢ와
          Hessian hᵢ의 합으로 leaf 품질을 계산할 수 있습니다. 여기에 leaf 수와
          leaf weight penalty를 더해 작은 loss 개선을 위해 지나치게 복잡한 tree를
          만드는 일을 억제합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Candidate split이 부모 leaf를 왼쪽·오른쪽으로 나눌 가치가 있는지 어떻게 계산할까?"
        idea={<>각 영역의 gradient 합 G와 Hessian 합 H로 최적인 leaf weight를 먼저 제거해 얻은 objective 개선량을 비교합니다. 두 child의 개선 합에서 부모의 개선과 새 leaf를 만드는 비용 γ를 빼면 split gain이 됩니다.</>}
        formula={String.raw`\begin{aligned}
Q(G,H)&=\frac{G^2}{H+\lambda},\\
G_P&=G_L+G_R,\\
H_P&=H_L+H_R,\\
Q_C&=Q(G_L,H_L)+Q(G_R,H_R),\\
\operatorname{Gain}&=\frac12\!\bigl[Q_C-Q(G_P,H_P)\bigr]-\gamma.
\end{aligned}`}
        terms={[
          { symbol: "G_L, G_R", name: "gradient sums", description: "왼쪽·오른쪽 후보 영역 sample의 first derivative를 각각 더한 값입니다." },
          { symbol: "H_L, H_R", name: "Hessian sums", description: "각 영역의 second derivative를 더해 local curvature와 effective weight를 나타냅니다." },
          { symbol: "λ", name: "L2 leaf penalty", description: "Leaf weight가 너무 커지는 것을 줄이고 분모를 안정화합니다." },
          { symbol: "γ", name: "split penalty", description: "새 terminal leaf를 추가하기 위해 넘어야 하는 최소 objective 개선 비용입니다." },
          { symbol: "Q(G,H)", name: "regularized leaf improvement", description: "한 영역의 gradient·Hessian 합으로 계산한 local objective 개선 항입니다." },
          { symbol: "Q_C", name: "children improvement", description: "왼쪽과 오른쪽 child가 각각 얻는 local improvement를 합한 값입니다." },
        ]}
        assumptions={["Loss가 score에 대해 두 번 미분 가능하고 Hessian 합이 유효합니다.", "이 식은 L2 leaf penalty 중심의 standard derivation이며 L1·constraint가 있으면 해가 달라집니다.", "Histogram·approximate builder에서는 후보 threshold 자체가 bin으로 근사될 수 있습니다."]}
        interpretation="Gain이 양수여도 validation 성능 향상을 보장하지 않습니다. 이 값은 현재 round의 training objective를 local quadratic approximation 아래 개선하는 정도입니다."
      />

      <div className="not-prose my-8"><XGBoostSplitViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-xgboost" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · Objective와 scalable system</p>
          <p className="mt-2 text-sm font-semibold">XGBoost: A Scalable Tree Boosting System</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Chen과 Guestrin은 regularized objective뿐 아니라 sparsity-aware split, weighted quantile sketch, cache access, compression과 sharding을 결합한 end-to-end system을 제시했습니다. 논문의 대규모 benchmark가 모든 작은 dataset과 최신 hardware에서 항상 가장 빠르다는 결론은 아닙니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1603.02754" target="_blank" rel="noreferrer">원 논문의 objective와 system 설계 보기</a>
        </div>
        <h3>Model capacity와 system option을 분리합니다</h3>
        <p>
          Depth·minimum child weight·subsample·column sampling은 함수의 capacity와
          variance를 바꾸고, tree method·max bin·device는 후보 탐색의 근사와
          실행 비용을 바꿉니다. Histogram은 연속값을 bin으로 묶어 bin별 G·H를
          누적하므로 빠르지만 threshold 해상도를 바꿉니다. Version·sparsity·data
          size에 따라 CPU와 GPU 결과·속도가 달라질 수 있어 실제 조건으로
          benchmark해야 합니다.
        </p>
      </div>
    </section>
  );
}
