import ExplainedFormula from "@/components/ui/explained-formula";
import LeafWiseViz from "./viz/LeafWiseViz";

export default function LightGBM() {
  return (
    <section id="lightgbm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">LightGBM은 split 통계의 행·열 비용과 leaf budget 배분을 줄입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Histogram tree builder는 연속값을 bin으로 묶어 candidate threshold마다
          모든 raw row를 다시 훑는 비용을 줄입니다. LightGBM 논문의 GOSS는
          gradient가 큰 sample을 유지하고 작은 sample 일부만 뽑되, 작은-gradient
          집단의 통계에 보정 weight를 곱합니다. EFB는 동시에 non-zero가 되는
          경우가 드문 sparse features를 충돌이 적게 한 축으로 묶어 feature 수를
          줄입니다.
        </p>
      </div>

      <ExplainedFormula
        question="GOSS는 작은 gradient sample을 버리면서 split 통계의 규모를 어떻게 보정할까?"
        idea={<>큰 gradient 집합 A는 전부 남기고, 나머지 Aᶜ에서는 비율 b만 random sample B로 선택합니다. B의 gradient contribution에 (1−a)/b를 곱해 빠진 작은-gradient 집단의 전체 규모를 근사합니다.</>}
        formula={String.raw`\widetilde G(S)=\sum_{i\in A\cap S}g_i+\frac{1-a}{b}\sum_{i\in B\cap S}g_i`}
        terms={[
          { symbol: "A", name: "large-gradient set", description: "Gradient 절댓값 상위 비율 a에 속해 모두 유지하는 sample 집합입니다." },
          { symbol: "B", name: "sampled small-gradient set", description: "나머지 sample에서 비율 b만 random하게 고른 부분집합입니다." },
          { symbol: "S", name: "candidate node side", description: "특정 split 후보의 왼쪽 또는 오른쪽에 들어가는 sample 집합입니다." },
          { symbol: "(1−a)/b", name: "sampling correction", description: "작은-gradient 집단을 subsample한 만큼 통계 규모를 되돌리는 weight입니다." },
        ]}
        assumptions={["현재 boosting mode가 실제로 GOSS를 사용하도록 설정돼 있습니다.", "작은-gradient 집단의 random sample이 그 집단을 충분히 대표합니다.", "논문의 gain approximation과 구현 version의 세부 정의를 구분합니다."]}
        interpretation="GOSS는 단순히 hard example만 학습하는 loss가 아니라 split gain을 더 적은 row로 추정하는 sampling 방법입니다. Sampling variance와 data 크기에 따라 이득이 달라집니다."
      />

      <div className="not-prose my-8"><LeafWiseViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-lightgbm" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · GOSS와 EFB</p>
          <p className="mt-2 text-sm font-semibold">LightGBM: A Highly Efficient Gradient Boosting Decision Tree</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Ke 등은 high-dimensional·large-data GBDT의 split scan 비용을 문제로 두고 GOSS와 EFB를 제안했습니다. 논문에서 보고한 최대 20배 이상의 속도 향상은 해당 public dataset·baseline·hardware 조건이며, 모든 current configuration의 leaf-wise growth나 native category 기능 전체에 대한 근거는 아닙니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html" target="_blank" rel="noreferrer">원 논문의 GOSS·EFB와 실험 범위 보기</a>
        </div>
        <h3>Leaf-wise growth는 가장 큰 현재 gain에 budget을 집중합니다</h3>
        <p>
          Level-wise가 같은 depth의 node를 함께 확장한다면 leaf-wise는 현재 gain이
          가장 큰 terminal leaf 하나를 고릅니다. 같은 leaf 수로 training loss를
          빠르게 줄일 수 있지만 작은 data에서는 한 branch가 깊어질 수 있으므로
          <code>num_leaves</code>, <code>min_data_in_leaf</code>, max depth를
          함께 제한합니다. 속도는 row 수뿐 아니라 feature 수·sparsity·bin·thread·
          device에 달려 있습니다.
        </p>
      </div>
    </section>
  );
}
