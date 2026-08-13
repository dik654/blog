import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import OrderedBoostingViz from "./viz/OrderedBoostingViz";

export default function CatBoost() {
  return (
    <section id="catboost" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">CatBoost는 현재 row를 보지 않은 prediction으로 gradient를 계산하려 합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          일반 boosting은 같은 training sample로 이전 tree를 학습한 뒤 그 sample의
          gradient를 다시 계산합니다. Flexible learner에서는 training prediction과
          unseen prediction의 분포가 달라지는 prediction shift가 생길 수 있습니다.
          Ordered boosting은 permutation에서 row i보다 앞선 prefix로 만든 model만
          사용해 i의 prediction과 gradient를 계산하는 방식으로 이 경로를 줄입니다.
        </p>
        <p>
          Category별 target statistic도 같은 ordering 문제를 갖습니다. 그 계산과
          smoothing은 <Link to="/ai/feature-engineering#categorical">cross-fitted·ordered target encoding</Link>에서
          자세히 다뤘으므로 여기서는 반복하지 않습니다. 외부 group·time split과
          prediction 시점의 category availability가 ordered algorithm보다 먼저입니다.
        </p>
      </div>

      <ExplainedFormula
        question="Ordered boosting에서 row i의 pseudo-residual은 어떤 model prediction에서 계산할까?"
        idea={<>Random permutation σ에서 i보다 먼저 등장한 sample만 학습한 prefix model F⁽⁼i⁾를 만듭니다. Row i의 label은 이 model을 만드는 데 쓰지 않은 상태이므로, 그 prediction에서 loss derivative를 계산합니다.</>}
        formula={String.raw`\begin{aligned}
P_i&=\{j:\sigma(j)<\sigma(i)\},\\
F^{(<i)}&=\operatorname{fit}(P_i),\\
r_i^{\mathrm{ord}}
&=-\left.\frac{\partial\ell(y_i,z)}{\partial z}\right|_{z=F^{(<i)}(x_i)}.
\end{aligned}`}
        terms={[
          { symbol: "σ", name: "training permutation", description: "Row마다 과거 prefix를 정의하기 위한 random order입니다." },
          { symbol: "F^(<i)", name: "prefix model", description: "Permutation에서 row i보다 앞선 sample만 사용해 만든 prediction 함수입니다." },
          { symbol: "r_i^ord", name: "ordered pseudo-residual", description: "자기 row를 학습하지 않은 prefix prediction에서 구한 negative loss derivative입니다." },
          { symbol: "z", name: "model score", description: "Loss를 미분하는 regression value 또는 class logit입니다." },
          { symbol: "Pᵢ", name: "permutation prefix", description: "Permutation에서 row i보다 앞에 있어 prefix model을 fit하는 데 사용할 수 있는 row 집합입니다." },
        ]}
        assumptions={["실제 implementation은 계산량을 줄이기 위해 여러 permutation·prefix 상태를 효율적으로 관리합니다.", "Ordered mode가 외부 validation split을 대체하지 않습니다.", "논문의 prediction-shift 분석과 현재 library option을 version별로 확인합니다."]}
        interpretation="목표는 training row를 한 번도 쓰지 않는 것이 아니라, 그 row의 gradient target을 만들 때 자기 자신을 이미 fit한 prediction을 사용하지 않는 것입니다."
      />

      <div className="not-prose my-8"><OrderedBoostingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-catboost-boosting" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · Prediction shift와 ordering</p>
          <p className="mt-2 text-sm font-semibold">CatBoost: Unbiased Boosting with Categorical Features</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Prokhorenkova 등은 target statistic과 standard boosting에서 생기는 prediction shift를 분석하고 ordered variants를 제안했습니다. 논문 benchmark의 우위가 categorical column이 있는 모든 dataset에서 automatic winner를 뜻하지 않으며, category mapping·hardware·tuning budget을 맞춘 비교가 필요합니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.neurips.cc/paper/2018/hash/14491b756b3a51daac41c24863285549-Abstract.html" target="_blank" rel="noreferrer">원 논문의 ordered boosting과 실험 보기</a>
        </div>
        <h3>대칭 트리도 별도의 inductive bias입니다</h3>
        <p>
          Oblivious tree는 같은 depth의 모든 node에서 같은 split condition을
          사용합니다. 규칙적인 path는 inference와 regularization에 이점이 있지만,
          비대칭적인 data 관계를 같은 leaf budget으로 표현하는 방식은 leaf-wise
          tree와 다릅니다. Category가 많다는 이유만으로 선택하지 말고 quality,
          training time, batch·single-row latency와 artifact size를 함께 비교합니다.
        </p>
      </div>
    </section>
  );
}
