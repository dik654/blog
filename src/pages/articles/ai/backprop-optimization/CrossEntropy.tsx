import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import CrossEntropyViz from "./viz/CrossEntropyViz";

export default function CrossEntropy() {
  return (
    <section id="cross-entropy" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Cross-entropy에서 backward를 시작한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          one-hot label의 cross-entropy는 정답 class 확률의 negative log다. 정답에
          높은 확률을 주면 0에 가까워지고, 낮은 확률을 주면 빠르게 커진다. batch에서는
          sample별 loss를 평균하거나 합한 scalar에서 backward를 시작한다.
        </p>
      </div>
      <ExplainedFormula
        question="정답 class에 준 probability를 optimization용 scalar penalty로 어떻게 바꿀까요?"
        idea={<>정답 probability가 1에 가까우면 0, 0에 가까우면 큰 값이 되도록 negative log를 취합니다. Batch reduction 뒤 scalar 하나가 backward seed가 됩니다.</>}
        formula={String.raw`L=-\sum_c y_c\log p_c=-\log p_y`}
        terms={[
          { symbol: "y_c", name: "target distribution", description: "One-hot label이면 정답 class에서만 1이고 나머지는 0입니다." },
          { symbol: "p_c", name: "predicted probability", description: "Softmax가 만든 categorical probability입니다." },
          { symbol: String.raw`-\log p_y`, name: "sample NLL", description: "정답 probability가 작을수록 빠르게 커지는 scalar penalty입니다." },
        ]}
        assumptions={["One-hot categorical target을 단순화한 식입니다.", "Batch mean reduction이면 sample loss 합을 batch size로 나눕니다."]}
        interpretation="정답 probability 0.9의 loss는 약 0.105, 0.1의 loss는 약 2.303입니다. 낮은 정답 확률을 훨씬 강하게 벌점합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          class weighting, focal loss, label smoothing은 서로 다른 문제를 다룬다. imbalance·easy example
          집중·overconfidence를 구분해 validation 기준으로 적용해야 하며 label noise에 label smoothing을 쓰면 언제나 해결된다고 볼 수는 없다.
        </p>
      </div>
      <CrossEntropyViz />
      <div className="not-prose mt-6 rounded-2xl border border-sky-200 bg-sky-50/60 p-5 dark:border-sky-900 dark:bg-sky-950/20">
        <p className="text-sm font-semibold">정보이론·KL·MLE 유도는 Cross-entropy 기준 글에서 확인할 수 있습니다</p>
        <Link to="/ai/cross-entropy" className="mt-3 inline-flex text-sm font-semibold text-sky-700 hover:underline dark:text-sky-300">정의와 유도 바로 보기 →</Link>
      </div>
    </section>
  );
}
