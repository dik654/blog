import ExplainedFormula from "@/components/ui/explained-formula";
import AdamWViz from "./viz/AdamWViz";

export default function AdamW() {
  return (
    <section id="adamw" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">AdamW: adaptive gradient와 weight shrinkage를 분리하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Plain SGD에서는 loss에 λ||θ||²/2를 더한 L2 penalty와 매 step weight를 직접 줄이는 weight decay가 적절한 convention에서 같은 update를 만들 수 있습니다. Adam에서는 λθ도 m·v에 들어가 coordinate-wise scaling을 받기 때문에 두 방식이 같지 않습니다.</p></div>
      <AdamWViz />
      <ExplainedFormula question="AdamW는 task gradient update와 weight decay를 어떻게 분리할까요?" idea={<>Adam이 만든 adaptive direction은 그대로 적용하고, 현재 weight에 비례한 shrinkage를 별도 항으로 뺍니다. 그래서 decay가 v̂의 coordinate scale에 흡수되지 않습니다.</>} formula={String.raw`\theta_{t+1}=\theta_t-\eta_t\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}-\eta_t\lambda\theta_t=(1-\eta_t\lambda)\theta_t-\eta_t\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}`} terms={[{symbol:"\\lambda",name:"weight-decay coefficient",description:"현재 weight를 직접 줄이는 shrinkage 강도입니다."},{symbol:"1-\\eta_t\\lambda",name:"multiplicative shrink",description:"Task gradient와 별도로 weight에 적용되는 step별 감소 비율입니다."},{symbol:"\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)",name:"adaptive task update",description:"Task loss gradient history가 만든 Adam direction입니다."}]} assumptions={["Decoupled weight decay convention이며 library마다 lr과 λ의 결합 표기를 확인해야 합니다.","Bias·normalization parameter를 decay에서 제외할지는 architecture와 parameter-group policy의 선택입니다.","Weight norm을 줄이는 것과 generalization 개선은 같은 명제가 아니므로 validation이 필요합니다."]} interpretation="Task gradient가 0이어도 AdamW는 θ를 (1−ηλ)배로 줄입니다. L2 penalty를 Adam gradient 안에 넣으면 coordinate별 v̂에 따라 실제 shrinkage가 달라집니다." />
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>예를 들어 task gradient가 0이고 θ=10, η=0.01, λ=0.1이면 shrink factor는 1−ηλ=0.999이고 다음 값은 9.99입니다. 이 계산은 moment state와 독립적인 direct decay이며, λθ를 gradient에 넣어 m·v까지 바꾸는 Adam의 L2 penalty와 다릅니다.</p></div>
      <div id="paper-adamw" className="prose prose-neutral dark:prose-invert max-w-none scroll-mt-20"><h3>Decoupled Weight Decay 논문의 핵심</h3><p>Loshchilov와 Hutter는 adaptive gradient method에서 L2 regularization과 weight decay의 equivalence가 깨짐을 분리하고, shrinkage를 gradient adaptation 밖에서 적용했습니다. 논문의 image classification·language modeling 실험은 제안한 조건에서의 evidence이며 AdamW가 모든 architecture와 budget에서 우월하다는 보장은 아닙니다.</p></div>
    </section>
  );
}
