import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import PostprocessViz from "./viz/PostprocessViz";

export default function Postprocess() {
  return (
    <section id="postprocess" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">후처리는 logit을 확률로 보정하고, 확률을 운영 decision으로 바꾸는 별도 단계입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Multi-class argmax만 필요할 때도 confidence를 사용자에게 보여주거나 reject
          option을 두면 probability의 의미가 중요해집니다. Accuracy가 높다는 사실은
          “confidence 0.8인 예측 중 약 80%가 맞는다”는 calibration을 보장하지
          않습니다. Calibration set에서 temperature를 선택하고, threshold와
          ensemble weight는 같은 data를 끝없이 재사용하지 않도록 선택 단계를 남깁니다.
        </p>
      </div>
      <ExplainedFormula
        question="Temperature scaling은 class 순서를 바꾸지 않고 confidence를 어떻게 조절할까?"
        idea={<>모델의 logit vector를 양수 T로 나눈 뒤 softmax를 적용합니다. T가 1보다 크면 분포가 평평해지고, 1보다 작으면 더 뾰족해집니다. 모든 logit에 같은 양의 scale을 쓰므로 argmax class는 유지됩니다.</>}
        formula={String.raw`\begin{aligned}
p_T(c\mid x)&=\operatorname{softmax}(z(x)/T)_c,\\
T^*&=\arg\min_{T>0}\mathcal L_{\mathrm{cal}}(T),\\
\mathcal L_{\mathrm{cal}}(T)&=-\sum_{i\in\mathrm{cal}}\log p_T(y_i\mid x_i).
\end{aligned}`}
        terms={[
          { symbol: "z_c", name: "class logit", description: "Softmax 전에 모델이 class c에 부여한 실수 score입니다." },
          { symbol: "T", name: "temperature", description: "Calibration split의 NLL로 맞추는 하나의 양수 scale parameter입니다." },
          { symbol: "K", name: "class count", description: "서로 배타적인 multi-class output의 class 개수입니다." },
          { symbol: "cal", name: "calibration split", description: "Model weight 학습과 최종 test에서 분리해 post-processing parameter만 고르는 examples입니다." },
        ]}
        assumptions={["Temperature는 모든 class와 examples에 공통인 scalar이며 base logits는 고정합니다.", "Calibration split이 deployment confidence distribution을 대표한다고 가정합니다.", "Distribution shift 뒤에는 이전 T의 calibration이 유지된다고 보장할 수 없습니다."]}
        interpretation="Temperature scaling은 argmax accuracy를 고치는 방법이 아니라 confidence scale을 맞추는 post-hoc calibration입니다. Class별 구조적 오류나 ranking 실패는 그대로 남습니다."
      />
      <ExplainedFormula
        question="TTA와 ensemble은 여러 prediction을 어떤 단위에서 합쳐야 할까?"
        idea={<>Label을 보존하는 transform과 model 후보의 probability를 가중 평균합니다. Class order가 같고 각 output이 같은 의미의 probability여야 하며, 합친 뒤 업무 비용으로 threshold를 적용합니다.</>}
        formula={String.raw`\begin{aligned}
\bar p_c(x)&=\sum_{m=1}^{M}w_m\frac1A\sum_{a=1}^{A}p_{m,c}(t_a(x)),\\
w_m&\ge0,\qquad \sum_{m=1}^{M}w_m=1,\\
\widehat y_c&=\mathbf1[\bar p_c(x)\ge\tau_c].
\end{aligned}`}
        terms={[
          { symbol: "t_a", name: "TTA transform", description: "Serving 때 추가로 적용하며 label 의미를 보존한다고 검증한 A개 변환입니다." },
          { symbol: "w_m", name: "ensemble weight", description: "M개 model prediction에 주는 비음수 가중치이며 합은 1입니다." },
          { symbol: "τ_c", name: "class decision threshold", description: "Binary·multi-label에서 class별 비용·용량·precision/recall 목표로 선택한 경계입니다." },
        ]}
        assumptions={["모든 model의 class index와 probability semantics가 같습니다.", "TTA operation이 target label을 보존하며 추가 latency를 budget에 포함합니다.", "Multi-class argmax task에서는 마지막 indicator 대신 argmax를 쓰고 threshold/reject policy를 별도로 정의합니다."]}
        interpretation="Model 수나 TTA 횟수를 늘리는 것이 목적이 아닙니다. Out-of-fold prediction의 error diversity와 marginal gain이 추가 latency·memory·운영 복잡도를 넘을 때만 채택합니다."
      />
      <div className="not-prose my-8"><PostprocessViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Threshold·precision·recall·업무 비용은 <Link to="/ai/imbalanced-data">불균형 데이터 정본</Link>,
          error diversity와 out-of-fold 결합은 <Link to="/ai/ensemble-methods">ensemble 정본</Link>이
          담당합니다. 최종 artifact에는 class mapping, preprocessing, calibration
          temperature, TTA list, ensemble weights, threshold와 이 값을 고른 split
          digest를 함께 넣습니다. Untouched test에는 이 결정을 고친 뒤 한 번만 접근합니다.
        </p>
      </div>
      <div id="paper-calibration" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Temperature scaling</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Guo 등은 당시 modern neural networks의 confidence calibration을 분석하고 여러 post-hoc 방법 중 scalar temperature scaling이 다수의 image·document classification dataset에서 효과적임을 보였습니다. 이 결과는 모든 shift·class·metric에서 scalar T가 충분하다는 보장이 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.mlr.press/v70/guo17a.html" target="_blank" rel="noreferrer">Calibration 정의와 비교 실험 보기</a>
      </div>
    </section>
  );
}
