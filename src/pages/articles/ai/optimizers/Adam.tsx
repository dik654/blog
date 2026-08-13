import ExplainedFormula from "@/components/ui/explained-formula";
import AdamViz from "./viz/AdamViz";

export default function Adam() {
  return (
    <section id="adam" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Adam: 방향의 EMA와 squared-gradient EMA로 좌표별 scale 조절하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Adam의 m은 gradient의 exponentially weighted first raw moment estimate이고, v는 gradient 제곱의 second raw moment estimate입니다. v에서 m²을 빼지 않으므로 통계학의 variance와 같은 값이 아닙니다. 이 구분을 놓치면 √v를 “noise의 표준편차”라고 잘못 해석하게 됩니다.</p></div>
      <AdamViz />
      <ExplainedFormula question="Adam은 현재 gradient와 두 optimizer state로 update를 어떻게 만들까요?" idea={<>m은 부호가 지속되는 방향을, v는 coordinate별 최근 squared scale을 추적합니다. 0에서 시작한 EMA의 초기 편향을 보정한 뒤 m̂을 √v̂로 나눕니다.</>} formula={String.raw`m_t=\beta_1m_{t-1}+(1-\beta_1)g_t,\quad v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2,\quad \theta_{t+1}=\theta_t-\eta\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}`} terms={[{symbol:"m_t",name:"first raw-moment EMA",description:"최근 gradient의 signed direction을 coordinate별로 추적합니다."},{symbol:"v_t",name:"second raw-moment EMA",description:"최근 squared gradient scale을 추적하며 variance 자체는 아닙니다."},{symbol:"\\epsilon",name:"numerical stabilizer",description:"분모가 0에 가까울 때 update가 폭증하거나 0으로 나누는 것을 막습니다."}]} assumptions={["제곱과 나눗셈은 parameter coordinate별 element-wise 연산입니다.","m₀=v₀=0일 때 bias correction m̂=m/(1−β₁ᵗ), v̂=v/(1−β₂ᵗ)를 사용합니다.","Adam의 practical stability와 특정 convergence theorem은 별개이며 objective·variant·hyperparameter 전제를 확인해야 합니다."]} interpretation="Coordinate의 gradient scale이 지속적으로 크면 √v̂도 커져 normalized update가 줄어듭니다. 이는 full Hessian을 쓰는 Newton method가 아니라 diagonal history-based preconditioning입니다." />
      <div className="prose prose-neutral dark:prose-invert max-w-none"><h3>Bias correction이 필요한 이유</h3><p>Constant gradient g가 계속 들어온다고 두면 m₁=(1−β₁)g입니다. 실제 중심 g보다 0 쪽으로 작기 때문에 1−β₁로 나누면 첫 step부터 g를 복원합니다. t가 커지면 βᵗ가 0에 가까워져 보정 효과도 사라집니다.</p></div>
      <div id="paper-adam" className="prose prose-neutral dark:prose-invert max-w-none scroll-mt-20"><h3>Adam 논문은 무엇을 결합했나</h3><p>Kingma와 Ba의 Adam은 noisy objective를 대상으로 gradient의 first·second raw moment EMA와 bias correction을 결합해 coordinate-wise adaptive step을 구성했습니다. 논문의 convex regret analysis와 공개 실험은 해당 가정·model·dataset 범위의 근거이며, 모든 nonconvex architecture에서 기본 hyperparameter가 최선이거나 SGD보다 generalization이 항상 좋다는 주장은 아닙니다.</p></div>
    </section>
  );
}
