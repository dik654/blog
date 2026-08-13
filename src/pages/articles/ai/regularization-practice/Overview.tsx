import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverfittingDiagnosisViz from "./viz/OverfittingDiagnosisViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Regularization은 validation gap을 줄이는 모든 변경이 아니라 학습 자유도를 의도적으로 제한하는 선택입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          Training loss는 계속 낮아지는데 처음 보는 validation data의 loss가 다시
          높아질 때 overfitting을 의심합니다. 그러나 이 모양은 split leakage,
          작은 validation sample의 noise, train–validation preprocessing 차이,
          label 오류와 distribution shift에서도 나타납니다. 따라서 기법부터
          추가하지 않고 <strong>어떤 오차가 어느 시점부터 벌어졌는지</strong>를
          먼저 확인합니다.
        </p>
        <p>
          원인이 실제 overfitting이라면 서로 다른 경계에 제약을 줄 수 있습니다.
          Dropout은 train-time activation 경로를 sampling하고, weight decay는
          parameter update에 축소 경로를 더하며, label smoothing은 classification
          target distribution을 바꿉니다. Early stopping은 objective를 바꾸지 않고
          이미 지나온 trajectory에서 checkpoint를 선택합니다. 네 방법은 같은
          문제를 푸는 한 계보가 아니므로 조합 전에 역할을 분리해야 합니다.
        </p>
        <p>
          <Link to="/ai/deep-learning-overview#learning-loop">Train·validation·test 정본</Link>과
          <Link to="/ai/data-augmentation">data augmentation 정본</Link>,
          <Link to="/ai/lr-scheduling">scheduler 정본</Link>은 이 글에서 다시 정의하지
          않습니다. 여기서는 gap 진단 뒤 regularizer 하나를 고르고, 같은 seed·budget의
          ablation으로 이득과 underfitting을 판정하는 흐름에 집중합니다.
        </p>
      </div>
      <ContentBoundary article="regularization-practice" />
      <ExplainedFormula
        question="Training과 validation의 차이를 어떤 값으로 추적해야 overfitting 후보를 찾을 수 있을까?"
        idea={<>같은 loss 정의를 train과 validation에 적용하고 두 평균의 차이를 봅니다. Gap 하나만으로 원인을 확정하지 않고 각 평균의 절대 수준과 slice별 값, 시간에 따른 변화까지 함께 확인합니다.</>}
        formula={String.raw`\begin{aligned}
\widehat R_{\mathrm{tr}}(t)&=\frac1{n_{\mathrm{tr}}}\sum_{i\in\mathrm{tr}}\ell_i(\theta_t),\\
\widehat R_{\mathrm{val}}(t)&=\frac1{n_{\mathrm{val}}}\sum_{i\in\mathrm{val}}\ell_i(\theta_t),\\
G_t&=\widehat R_{\mathrm{val}}(t)-\widehat R_{\mathrm{tr}}(t).
\end{aligned}`}
        terms={[
          { symbol: "θ_t", name: "checkpoint at update t", description: "t번째 optimizer update 뒤 평가한 동일 model state입니다." },
          { symbol: "ℓ_i", name: "sample loss", description: "Train과 validation에서 같은 target 의미·reduction으로 계산한 sample별 오차입니다." },
          { symbol: "R̂_tr,R̂_val", name: "empirical risks", description: "서로 겹치지 않는 train·validation examples에서 계산한 평균 loss입니다." },
          { symbol: "G_t", name: "observed generalization gap", description: "현재 split에서 validation loss가 training loss보다 얼마나 큰지 나타내는 진단값입니다." },
        ]}
        assumptions={["Train과 validation의 loss definition·preprocessing·valid denominator가 일치합니다.", "Validation examples는 parameter update와 augmentation fit에 사용되지 않습니다.", "Finite validation의 Gt는 population generalization error 자체가 아니며 sampling uncertainty를 가집니다."]}
        interpretation="Training loss도 높은 작은 gap은 underfitting일 수 있고, validation만 갑자기 악화한 큰 gap은 data boundary 오류일 수 있습니다. Regularization은 원인 검사 뒤의 후보입니다."
      />
      <div className="not-prose my-8"><OverfittingDiagnosisViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          먼저 leakage·pipeline mismatch·label audit을 통과한 no-change baseline을
          저장합니다. 그다음 regularizer 하나만 바꾸고 같은 seeds·optimizer
          updates·tuning budget에서 train fit, validation mean과 uncertainty,
          calibration, worst slice, wall time을 비교합니다. Validation gain이 있어도
          training fit이 과도하게 무너지거나 중요한 slice가 악화되면 강도를 낮추고,
          선택이 끝난 뒤 untouched test는 한 번만 사용합니다.
        </p>
      </div>
    </section>
  );
}
