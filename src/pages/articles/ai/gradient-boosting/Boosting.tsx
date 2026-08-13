import ExplainedFormula from "@/components/ui/explained-formula";
import ResidualLearningViz from "./viz/ResidualLearningViz";

export default function Boosting() {
  return (
    <section id="boosting" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">각 round는 현재 prediction에서 loss가 줄어드는 방향을 tree로 근사합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          첫 prediction F₀는 regression이라면 target 평균처럼 단순한 상수에서
          시작할 수 있습니다. M번째 round에서는 각 training sample의 현재
          score Fₘ₋₁(xᵢ)에 대해 loss를 미분하고, 그 반대 방향을 새 target rᵢₘ으로
          만듭니다. Tree hₘ은 이 숫자들을 feature 구간별로 근사한 뒤 learning
          rate만큼 기존 score에 더해집니다.
        </p>
      </div>

      <ExplainedFormula
        question="왜 squared-error에서는 residual을 맞히지만 다른 loss에서는 pseudo-residual이라고 부를까?"
        idea={<>매 round의 target은 y−prediction이라고 외워 정하는 값이 아니라 현재 score에서 loss의 음의 derivative로 정의합니다. Squared loss를 미분할 때만 그 값이 정확히 y−F와 같아집니다.</>}
        formula={String.raw`\begin{aligned}
r_{im}&=-\left.\frac{\partial\ell(y_i,z)}{\partial z}\right|_{z=F_{m-1}(x_i)},\\
F_m(x)&=F_{m-1}(x)+\eta\,h_m(x).
\end{aligned}`}
        terms={[
          { symbol: "r_im", name: "pseudo-residual", description: "Round m에서 sample i의 score를 어느 방향으로 고쳐야 loss가 줄어드는지 나타냅니다." },
          { symbol: "h_m", name: "weak tree", description: "Feature로 pseudo-residual을 구간별 근사하는 새 decision tree입니다." },
          { symbol: "η", name: "learning rate · shrinkage", description: "새 tree의 기여를 0과 1 사이의 작은 배율로 줄이는 step size입니다." },
          { symbol: "F_m", name: "additive score", description: "M번째 tree까지 더한 현재 prediction 함수입니다." },
        ]}
        assumptions={["Loss가 현재 score에 대해 미분 가능하거나 적절한 subgradient를 갖습니다.", "Tree는 negative-gradient target을 완벽히 맞히지 않고 제한된 depth·leaf로 근사합니다.", "Classification score를 probability로 바꾸는 link function은 objective와 일치해야 합니다."]}
        interpretation="Gradient descent가 parameter vector를 움직인다면 gradient boosting은 허용된 tree 함수 하나를 골라 prediction 함수 자체를 움직입니다. η를 줄이면 보통 더 많은 round가 필요하므로 tree 수와 함께 비교합니다."
      />

      <div className="not-prose my-8"><ResidualLearningViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-gradient-boosting" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · 함수 공간의 steepest descent</p>
          <p className="mt-2 text-sm font-semibold">Greedy Function Approximation: A Gradient Boosting Machine</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Friedman은 stagewise additive model을 함수 공간의 수치 최적화 관점으로 정리하고, 일반 loss의 negative gradient를 base learner가 근사하는 절차를 제시했습니다. 이 결과가 finite-depth tree·finite sample에서 global optimum이나 automatic calibration을 보장한다는 뜻은 아닙니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1214/aos/1013203451" target="_blank" rel="noreferrer">원 논문의 function approximation과 algorithm 보기</a>
        </div>
        <h3>Early stopping은 tree 수를 고르는 model selection입니다</h3>
        <p>
          Depth·leaf 수는 한 tree가 표현할 interaction을, round 수와 learning rate는
          그 규칙을 몇 번 어느 크기로 더할지를 정합니다. Training loss는 tree를
          추가할수록 계속 줄 수 있으므로 독립 validation curve의 best iteration을
          fold마다 기록합니다. Subsampling과 leaf regularization은 또 다른 variance
          축이며 작은 η 하나가 과적합을 자동으로 막지는 않습니다.
        </p>
      </div>
    </section>
  );
}
