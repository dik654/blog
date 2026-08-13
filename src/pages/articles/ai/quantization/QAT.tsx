import ExplainedFormula from "@/components/ui/explained-formula";
import QATTrainViz from "./viz/QATTrainViz";

export default function QAT() {
  return <section id="qat" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">QAT는 forward에서 배포 오차를 보여 주되, backward에는 근사 gradient를 흘립니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>Quantization-aware training(QAT)은 float master weight를 유지하면서 forward에 fake quantize–dequantize를 넣습니다. Model은 rounding과 clipping이 포함된 출력을 보고 loss를 줄이도록 weight와 경우에 따라 scale을 조정할 수 있지만, round 함수의 진짜 derivative는 거의 모든 위치에서 0이므로 그대로 미분하면 학습 신호가 사라집니다.</p>
      <p>그래서 straight-through estimator(STE)는 representable range 안에서 fake quantizer를 identity처럼 미분하는 근사를 사용합니다. 이는 forward 계산의 수학적으로 정확한 gradient가 아니라 학습을 가능하게 하는 surrogate이며, observer freeze 시점·batch normalization 통계·loss·data budget까지 QAT recipe에 포함됩니다.</p>
    </div>
    <ExplainedFormula
      question="반올림 때문에 gradient가 끊기는 QAT에서 STE는 어떤 근사를 사용할까요?"
      idea={<>Forward에는 실제와 같은 clip·round·dequantize를 사용하고, backward에서는 range 안의 입력 변화가 출력에 그대로 전달된다고 가정합니다. Range 밖에서는 gradient를 0으로 두어 계속 포화되는 값을 구분할 수 있습니다.</>}
      formula={String.raw`\hat x=\operatorname{FQ}(x),\qquad \frac{\partial\hat x}{\partial x}\approx \mathbf 1[r_{\min}\le x\le r_{\max}]`}
      terms={[
        { symbol: "FQ", name: "fake quantization", description: "Low-bit code로 round·clip한 뒤 즉시 float로 dequantize하는 training operator입니다." },
        { symbol: "r_min,r_max", name: "representable range", description: "현재 scale·zero-point가 표현할 수 있는 float 구간입니다." },
        { symbol: "indicator", name: "STE gate", description: "Range 안에서는 upstream gradient를 통과시키고 밖에서는 막는 근사입니다." },
      ]}
      assumptions={["STE variant에 따라 clipping 밖 gradient와 scale gradient 정의가 달라질 수 있습니다.", "Float master weights와 optimizer state를 유지하는 일반적인 QAT를 가정합니다.", "Surrogate gradient의 수렴이 실제 discrete objective의 최적해나 배포 품질을 보장하지 않습니다."]}
      interpretation="Forward output은 계단 모양인데 backward만 직선처럼 취급합니다. 그러므로 fake-quant checkpoint score 외에 convert된 graph와 실제 low-bit kernel 결과를 반드시 비교해야 합니다."
    />
    <div className="not-prose my-8"><QATTrainViz /></div>
    <div id="paper-integer-qat" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">논문 읽기 · Integer-arithmetic-only inference와 QAT</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Jacob 등은 integer-only hardware에서 효율적인 inference를 목표로 affine quantization과 training procedure를 함께 설계했습니다. 결과는 당시 MobileNet·ImageNet·COCO와 CPU 구현 조건에 속하며, 같은 QAT recipe가 현대 LLM·FP8·모든 accelerator에서 같은 이득을 낸다는 뜻은 아닙니다.</p>
      <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1712.05877" target="_blank" rel="noreferrer">Affine scheme·training·integer inference 범위 보기</a>
    </div>
  </section>;
}
