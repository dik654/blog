import ExplainedFormula from "@/components/ui/explained-formula";
import FreezingViz from "./viz/FreezingViz";

export default function Freezing() {
  return (
    <section id="freezing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">“Backbone을 고정했다”는 세 가지 state가 모두 멈췄는지 확인하는 말입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          첫째, <code>requires_grad=False</code>로 parameter gradient를 만들지 않습니다.
          둘째, frozen parameter가 optimizer param group에 들어 있지 않은지 확인합니다.
          셋째, BatchNorm running mean·variance처럼 gradient가 아닌 module buffer가
          train mode에서 바뀌는지 결정합니다. 이 셋을 구분하지 않으면 weight는
          그대로인데 prediction이 달라지는 “부분 고정”이 생깁니다.
        </p>
      </div>
      <ExplainedFormula
        question="Layer별로 parameter update를 허용하거나 막는 규칙을 어떻게 표시할까?"
        idea={<>Layer ℓ의 trainable mask mℓ을 0 또는 1로 둡니다. 0이면 gradient가 있더라도 update는 0이고, 1이면 해당 param group의 learning rate로 움직입니다.</>}
        formula={String.raw`\begin{aligned}\theta_{\ell}^{(t+1)}&=\theta_{\ell}^{(t)}-m_{\ell}\eta_{\ell}g_{\ell}^{(t)},\\m_{\ell}&\in\{0,1\}.\end{aligned}`}
        terms={[
          { symbol: "θ_ℓ", name: "layer parameters", description: "Backbone block 또는 새 head가 소유한 학습 weight입니다." },
          { symbol: "m_ℓ", name: "trainable mask", description: "Frozen layer는 0, update를 허용한 layer는 1입니다." },
          { symbol: "η_ℓ", name: "group learning rate", description: "Layer group별 optimizer step 크기입니다." },
          { symbol: "g_ℓ", name: "optimizer direction", description: "SGD gradient 또는 optimizer state가 보정한 update direction입니다." },
        ]}
        assumptions={["Optimizer param groups가 mℓ=1인 parameter와 정확히 일치합니다.", "Weight decay 같은 optimizer update도 frozen parameter에 적용되지 않습니다.", "Unfreeze 시 optimizer state를 새로 만들지 이어 쓸지 stage contract에 기록합니다."]}
        interpretation="Freezing은 gradient를 작게 만드는 regularization이 아니라 해당 parameter update 경로를 닫는 구조적 선택입니다."
      />
      <div className="not-prose my-8"><FreezingViz /></div>
      <ExplainedFormula
        question="Weight가 frozen이어도 BatchNorm의 output이 달라질 수 있는 이유는 무엇일까?"
        idea={<>Train mode의 BatchNorm은 현재 batch mean을 running mean에 섞습니다. Affine weight γ·β의 gradient를 꺼도 running buffer μrun은 parameter가 아니어서 계속 바뀔 수 있습니다.</>}
        formula={String.raw`\mu_{\mathrm{run}}^{(t+1)}=(1-\alpha)\mu_{\mathrm{run}}^{(t)}+\alpha\mu_{\mathrm{batch}}^{(t)}`}
        terms={[
          { symbol: "μ_run", name: "running mean buffer", description: "Evaluation 때 normalization에 쓰는 이동 평균이며 일반 parameter gradient와 별도입니다." },
          { symbol: "μ_batch", name: "current batch mean", description: "Train mode에서 현재 micro-batch activation으로 계산한 평균입니다." },
          { symbol: "α", name: "BatchNorm update weight", description: "현재 batch statistic을 running state에 반영하는 비율입니다." },
        ]}
        assumptions={["해당 module이 BatchNorm 계열이고 train mode에서 running statistics를 추적합니다.", "Framework의 momentum 표기 방향을 확인합니다.", "작은 micro-batch에서는 batch statistic noise가 커질 수 있습니다."]}
        interpretation="Fixed feature extractor를 원한다면 parameter flag뿐 아니라 backbone module mode와 buffer 전후 checksum을 검사합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Gradual unfreezing은 검증할 후보이지 보편 규칙이 아닙니다</h3>
        <p>
          Head-only에서 upper block, full model 순으로 여는 방식은 추가 자유도가
          어디서 이득을 만드는지 추적하기 좋습니다. 하지만 각 stage에서 optimizer
          membership, state initialization, LR와 warmup이 바뀌므로 별도 stage receipt를
          남깁니다. Modern architecture와 충분한 target data에서는 처음부터 안정적인
          full fine-tuning이 더 단순할 수도 있습니다.
        </p>
      </div>
    </section>
  );
}
