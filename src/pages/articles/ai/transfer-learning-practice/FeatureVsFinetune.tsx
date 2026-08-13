import ExplainedFormula from "@/components/ui/explained-formula";
import FeatureVsFinetuneViz from "./viz/FeatureVsFinetuneViz";

export default function FeatureVsFinetune() {
  return (
    <section id="feature-vs-finetune" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Fixed·partial·full은 같은 validation 질문과 budget에서 비교합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Fixed feature는 새 head만 학습하므로 가장 싼 data·metric smoke test입니다.
          Partial은 target에 가까운 upper blocks까지, full은 전체 backbone까지
          representation을 바꿉니다. Trainable parameter가 늘어날수록 target에
          적응할 자유도와 optimizer state·activation memory·overfitting 위험이 함께
          늘어납니다.
        </p>
        <p>
          세 실험은 같은 pretrained checkpoint·preprocessing·entity/time split,
          augmentation family와 metric을 사용합니다. Search trial 수 또는 wall-clock
          budget, seed 수도 맞추고, validation mean뿐 아니라 seed variance·worst
          group·calibration·peak memory·training time을 보고 선택합니다.
        </p>
      </div>
      <div className="not-prose my-8"><FeatureVsFinetuneViz /></div>
      <ExplainedFormula
        question="더 큰 fine-tuning scope가 실제로 baseline보다 나아졌는지 seed 불확실성과 함께 어떻게 표시할까?"
        idea={<>같은 split에서 candidate와 fixed baseline의 metric 차이를 seed마다 계산하고, 그 paired differences의 평균과 표준오차를 봅니다. 독립 평균 두 개보다 공통 seed·data 조건의 차이를 직접 비교합니다.</>}
        formula={String.raw`\begin{aligned}d_s&=M_s^{\mathrm{candidate}}-M_s^{\mathrm{fixed}},\\\bar d&=\frac1S\sum_{s=1}^{S}d_s,\\\operatorname{SE}(\bar d)&=\frac{\operatorname{sd}(d_1,\ldots,d_S)}{\sqrt S}.\end{aligned}`}
        terms={[
          { symbol: "d_s", name: "paired gain", description: "Seed s의 같은 split·budget에서 candidate가 fixed baseline보다 얻은 metric 차이입니다." },
          { symbol: "S", name: "replicate count", description: "독립 초기화·sampling seed로 반복한 실험 수입니다." },
          { symbol: "SE", name: "standard error", description: "관측한 mean gain의 seed-to-seed 불확실성을 요약합니다." },
        ]}
        assumptions={["각 pair는 같은 data split·preprocessing·search budget에서 비교합니다.", "Seed 표본이 매우 작으면 normal approximation보다 개별 점과 bootstrap interval을 함께 봅니다.", "Metric gain과 memory·latency·training cost를 별도 축으로 보존합니다."]}
        interpretation="Mean gain이 작고 SE와 같은 크기인데 full fine-tuning 비용만 크게 늘면 fixed 또는 partial이 더 나은 운영 선택일 수 있습니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Head-only가 training data에도 fit하지 못하면 representation 부족을 바로
          결론내리지 않습니다. Label·head shape·normalization·optimizer와 metric을
          먼저 확인합니다. 반대로 partial의 이득이 특정 deployment slice에서만
          생기면 전체 평균과 함께 그 slice의 sample 수와 confidence interval을
          남깁니다.
        </p>
      </div>
    </section>
  );
}
