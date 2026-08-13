import ExplainedFormula from "@/components/ui/explained-formula";
import SGDViz from "./viz/SGDViz";

export default function SGD() {
  return (
    <section id="sgd" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">SGD: noisy gradient estimate로 descent step 만들기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>현대 딥러닝에서 SGD는 보통 example 하나가 아니라 mini-batch gradient를 사용합니다. Sampling 때문에 같은 parameter에서도 방향이 달라질 수 있지만, 균등 sampling 아래 expectation에서는 full empirical gradient와 일치합니다.</p></div>
      <ExplainedFormula question="Mini-batch gradient를 받았을 때 다음 parameter를 어떻게 정할까요?" idea={<>현재 parameter에서 estimate한 gradient의 반대 방향에 learning rate를 곱해 이동합니다. η는 방향을 만들지 않고 보폭만 정합니다.</>} formula={String.raw`g_t=\frac1B\sum_{i\in\mathcal B_t}\nabla_\theta\ell_i(\theta_t),\qquad \theta_{t+1}=\theta_t-\eta_t g_t`} terms={[{symbol:"g_t",name:"mini-batch gradient",description:"현재 batch가 추정한 loss의 parameter별 local sensitivity입니다."},{symbol:"\\eta_t",name:"learning rate",description:"Step t에서 gradient direction을 실제 이동량으로 바꾸는 scale입니다."},{symbol:"\\theta_{t+1}",name:"next parameter",description:"Update가 끝난 뒤 다음 forward pass에 사용할 parameter입니다."}]} assumptions={["Batch sampling과 reduction이 목표 empirical objective에 맞습니다.","Gradient는 finite하며 mixed-precision scaling·clipping을 했다면 optimizer가 받는 실제 값을 확인합니다.","Convergence에는 objective structure와 step-size schedule에 대한 추가 전제가 필요합니다."]} interpretation="η가 너무 작으면 progress가 느리고, 너무 크면 negative gradient라는 방향이 맞아도 local approximation 범위를 넘어 진동하거나 발산할 수 있습니다." />
      <SGDViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Schedule은 후반의 step을 줄여 noisy estimate 주변의 진동 폭을 낮추는 역할을 합니다. Warmup·cosine decay가 흔하더라도 보편 정답은 아니며, batch size와 total update 수를 바꾸면 함께 다시 검증해야 합니다.</p></div>
    </section>
  );
}
