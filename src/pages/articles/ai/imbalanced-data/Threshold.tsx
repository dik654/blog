import ExplainedFormula from "@/components/ui/explained-formula";
import ThresholdViz from "./viz/ThresholdViz";

export default function Threshold() {
  return (
    <section id="threshold" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Threshold는 score를 행동으로 바꾸는 운영 정책입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Binary score를 0.5에서 자르는 것은 두 오류 비용과 class prior가 특정하게 맞고 probability가 calibrated되었을 때만 의미가 있습니다. 실제로는 놓치면 안 되는 recall, 하루 검토 가능한 alert 수, false positive와 false negative 비용 중 운영 조건을 먼저 정하고 validation 또는 out-of-fold prediction에서 threshold를 선택합니다.</p></div>
      <ExplainedFormula question="Calibrated probability가 있을 때 FP·FN 비용만으로 positive decision threshold를 어떻게 얻을까?" idea={<>Positive로 행동했을 때의 expected cost는 (1−p)CFP이고 negative로 행동했을 때는 pCFN입니다. 첫 비용이 더 작을 때 positive를 선택합니다.</>} formula={String.raw`\begin{aligned}
(1-p)C_{\mathrm{FP}}&<pC_{\mathrm{FN}} \\
p&>\frac{C_{\mathrm{FP}}}{C_{\mathrm{FP}}+C_{\mathrm{FN}}}=\tau^*
\end{aligned}`} terms={[{symbol:"p",name:"calibrated posterior probability",description:"현재 sample이 positive일 conditional probability입니다."},{symbol:"CFP",name:"false-positive cost",description:"실제 negative에 positive action을 했을 때의 비용입니다."},{symbol:"CFN",name:"false-negative cost",description:"실제 positive를 negative action으로 놓쳤을 때의 비용입니다."},{symbol:"τ*",name:"Bayes cost threshold",description:"두 action의 expected cost가 같아지는 probability입니다."}]} assumptions={["p가 deployment prevalence에서 calibrated되어 있습니다.","두 오류 비용이 sample과 시간에 대해 고정되고 correct action cost는 0으로 두었습니다."]} interpretation="FN 비용이 커질수록 threshold는 낮아집니다. Score가 calibration되지 않았거나 처리 용량 constraint가 있으면 이 식을 그대로 쓰지 않고 validation policy search가 필요합니다." />
      <div className="not-prose my-8"><ThresholdViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>F1 최대점은 precision과 recall의 harmonic mean을 최대로 만드는 한 선택일 뿐입니다. Test set은 threshold 선택에 쓰지 않고 마지막 평가에 남겨야 합니다. Production에서는 prevalence, alert volume, precision·recall과 calibration drift를 model version·threshold 변경 이력과 함께 추적합니다.</p></div>
    </section>
  );
}
