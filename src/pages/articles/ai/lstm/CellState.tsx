import ExplainedFormula from "@/components/ui/explained-formula";
import GradientRetentionViz from "./viz/GradientRetentionViz";

export default function CellState() {
  return (
    <section id="cell-state" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Direct gradient path는 forget gate의 누적으로 읽는다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cₜ update에서 Cₜ₋₁로 직접 이어지는 edge만 미분하면 local derivative는
          fₜ다. 여러 step을 지나면 이 direct contribution이 forget gate의 곱이
          되므로, 각 gate가 1에 가까운 구간에서는 vanilla nonlinear transition보다
          gradient를 오래 전달할 수 있다. 하지만 이것은 전체 derivative와 동일하지
          않다. Gate 자체도 h와 C의 함수이므로 computational graph에는 다른 경로가
          추가된다.
        </p>
      </div>

      <ExplainedFormula
        question="과거 cell Cₖ의 작은 변화가 t step의 cell Cₜ까지 direct path로 얼마나 남는가?"
        idea={<>한 step의 direct edge derivative fⱼ를 chain rule로 모두 곱합니다. Log domain에서는 곱이 합이 되므로 평균 log f가 effective memory horizon을 정합니다.</>}
        formula={String.raw`\begin{aligned}\left.\frac{\partial C_t}{\partial C_{t-1}}\right|_{\rm direct}&=f_t\\[3pt]\left.\frac{\partial C_t}{\partial C_k}\right|_{\rm direct}&=\prod_{j=k+1}^{t}f_j\\[3pt]\log R_{k\to t}&=\sum_{j=k+1}^{t}\log f_j\end{aligned}`}
        terms={[
          { symbol: "R_{k\to t}", name: "direct retention", description: "k에서 t까지 cell path에 남은 multiplicative contribution입니다." },
          { symbol: "f_j", name: "forget gate", description: "Step j에서 각 state channel을 유지하는 비율입니다." },
          { symbol: "\\prod_j", name: "temporal product", description: "Chain rule로 이어지는 direct edge derivative의 곱입니다." },
          { symbol: "\\sum\\log f_j", name: "log retention", description: "긴 horizon에서 수치적으로 분석하기 쉬운 합 형태입니다." },
        ]}
        assumptions={["Gate dependency를 통한 indirect derivative를 제외한 partial path contribution입니다.", "Vector state에서는 element-wise gate의 각 channel별 식이며 full Jacobian은 cross-channel terms를 포함합니다."]}
        interpretation="f=0.99도 100 step이면 약 0.366만 남는다. ‘거의 1’이라는 한 step 직관보다 horizon 전체의 product를 확인해야 합니다."
      />

      <GradientRetentionViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Additive path와 residual connection은 닮았지만 같지 않다</h3>
        <p>
          두 구조 모두 identity에 가까운 additive path를 만들어 optimization을 돕지만,
          LSTM은 recurrent state를 data-dependent gate로 보존·수정하고 residual block은
          layer transformation의 입력을 shortcut으로 더한다. 비슷한 derivative
          intuition을 공유한다고 architecture 목적과 state semantics까지 같아지는 것은
          아니다.
        </p>
        <h3>LSTM에서도 exploding과 학습 horizon 문제는 남는다</h3>
        <p>
          Gate network와 recurrent projection을 통과하는 다른 Jacobian 경로에서는
          exploding gradient가 생길 수 있어 gradient clipping을 함께 사용한다.
          Truncated BPTT를 적용하면 state는 더 오래 전달하더라도 gradient는 detach
          boundary를 넘어 학습되지 않는다. 따라서 inference memory horizon과 training
          credit-assignment horizon을 분리해 봐야 한다.
        </p>
      </div>
    </section>
  );
}
