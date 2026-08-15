import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ImageDecisionViz } from "../image-classification-pipeline/viz/ModernImageClassificationViz";

export default function ImageProbabilityDecisionsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Logit, probability와 action은 서로 다른 세 상태입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Logit</strong>은 model head가 내놓는 raw score입니다.
            Softmax를 적용하면 합이 1인{" "}
            <strong>class probability vector</strong>가 되지만, 그 수치가 실제
            correctness frequency와 맞는지는 별도 calibration 문제입니다. 마지막{" "}
            <strong>decision</strong>은 probability를 argmax, threshold 또는
            reject policy로 업무 action에 연결한 결과입니다.
          </p>
          <p>
            Accuracy가 높아도 confidence .8인 예측 중 80%가 맞는다는 보장은
            없습니다. 반대로 probability가 잘 맞아도 업무 비용에 맞는
            threshold가 자동으로 정해지지 않습니다. 세 변환을 한 함수처럼 숨기지
            않고 각각의 selection split과 parameter를 남깁니다.
          </p>
        </div>
        <TermBreakdown
          title="Score에서 action까지"
          items={[
            {
              term: "Logit",
              description:
                "Softmax 전 class별 실수 score이며 차이와 순서가 prediction을 만듭니다.",
            },
            {
              term: "Calibrated probability",
              description:
                "비슷한 confidence를 보고한 집단의 empirical correctness와 맞도록 조정한 수치입니다.",
            },
            {
              term: "Aggregation",
              description:
                "검증된 TTA views나 여러 models의 같은 의미 outputs를 정해진 순서로 결합하는 단계입니다.",
            },
            {
              term: "Decision policy",
              description:
                "Argmax·class threshold·reject와 업무 비용·용량을 연결한 serving rule입니다.",
            },
          ]}
        />
        <ImageDecisionViz />
        <ContentBoundary article="image-probability-decisions" />
      </section>

      <section id="temperature" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Temperature scaling은 class 순서를 유지하고 confidence의 뾰족함만
          바꿉니다
        </h2>
        <ExplainedFormula
          question="하나의 양수 temperature로 argmax를 유지하면서 probability scale을 어떻게 맞추나요?"
          idea={
            <p>
              고정된 logits를 T로 나눈 뒤 softmax합니다. Calibration split의
              NLL이 가장 작은 T를 고르며 model weights는 바꾸지 않습니다.
            </p>
          }
          formula={String.raw`p_T(c\mid x)=\operatorname{softmax}(z(x)/T)_c`}
          annotatedFormula={String.raw`\begin{aligned}\widetilde z_c&=\underbrace{z_c/T}_{\substack{\text{같은 양수로 나눠}\\\text{score 간격 조절}}}\\[4pt]u_c&=\underbrace{e^{\widetilde z_c}}_{\text{양의 class 질량 생성}}\\[4pt]Z&=\underbrace{\sum_j u_j}_{\text{모든 class 질량 합산}}\\[4pt]p_T(c\mid x)&=\underbrace{u_c/Z}_{\substack{\text{전체 질량으로 나눠}\\\text{합이 1인 probability 생성}}}\\[4pt]T^*&=\underbrace{\arg\min_{T>0}\mathcal L_{\rm cal}(T)}_{\substack{\text{calibration NLL이 가장 작은}\\\text{temperature 선택}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`z_c/T`,
              annotation: [
                "모든 logits를 같은 양수로 나눠",
                "argmax를 보존하고 간격을 조절",
              ],
            },
            {
              expression: String.raw`e^{\widetilde z_c}`,
              annotation: [
                "scaled score를 양의 질량으로 바꿔",
                "class별 상대 크기를 보존",
              ],
            },
            {
              expression: String.raw`\sum_j e^{\widetilde z_j}`,
              annotation: [
                "모든 class 질량을 분모로 더해",
                "probabilities 합을 1로 정규화",
              ],
            },
            {
              expression: String.raw`\arg\min_{T>0}\mathcal L_{\rm cal}`,
              annotation: [
                "양수 temperatures의 calibration loss를 비교해",
                "하나의 scale을 선택",
              ],
            },
          ]}
          terms={[
            {
              symbol: "z_c",
              name: "Class logit",
              description: "Model이 class c에 부여한 raw score입니다.",
            },
            {
              symbol: "T",
              name: "Temperature",
              description: "모든 logits에 공통으로 적용하는 양수 scale입니다.",
            },
            {
              symbol: String.raw`p_T`,
              name: "Calibrated output",
              description:
                "Temperature 적용 뒤의 class probability vector입니다.",
            },
            {
              symbol: String.raw`\mathrm{cal}`,
              name: "Calibration split",
              description:
                "Model fitting과 final test에서 분리해 post-processing만 선택하는 examples입니다.",
            },
          ]}
          assumptions={[
            "Base logits와 model weights는 고정합니다.",
            "하나의 scalar T를 모든 classes와 examples에 공유합니다.",
            "Deployment shift가 생기면 기존 T의 calibration을 다시 검사합니다.",
          ]}
          interpretation="Logits (4,2,0)에 T=2를 적용하면 (2,1,0)이 됩니다. Top class는 같지만 softmax maximum은 낮아져 과도한 confidence를 완화합니다."
        />
      </section>

      <section id="decision-contract" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          TTA·ensemble·threshold는 적용 순서까지 포함한 serving contract입니다
        </h2>
        <ExplainedFormula
          question="여러 views와 models를 어떤 probability 단위로 합치고 언제 threshold를 적용하나요?"
          idea={
            <p>
              각 model의 valid TTA probabilities를 먼저 평균하고, model
              weights로 다시 합친 뒤 마지막에 class threshold를 적용합니다.
            </p>
          }
          formula={String.raw`\bar p_c=\sum_mw_mA^{-1}\sum_ap_{m,c}(t_a(x))`}
          annotatedFormula={String.raw`\begin{aligned}v_{m,c}&=\underbrace{\frac1A\sum_{a=1}^{A}p_{m,c}(t_a(x))}_{\substack{\text{한 model의 valid TTA probabilities를}\\\text{같은 class index에서 평균}}}\\[4pt]\bar p_c&=\underbrace{\sum_{m=1}^{M}w_mv_{m,c}}_{\substack{\text{models의 calibrated probabilities를}\\\text{검증된 weights로 결합}}}\\[4pt]\widehat y_c&=\underbrace{\mathbf1[\bar p_c\ge\tau_c]}_{\substack{\text{결합 probability를 class 기준과 비교해}\\\text{운영 action 생성}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`A^{-1}\sum_ap_{m,c}(t_a(x))`,
              annotation: [
                "label-preserving views의 probabilities를 평균해",
                "model별 TTA output을 만듦",
              ],
            },
            {
              expression: String.raw`\sum_mw_mv_{m,c}`,
              annotation: [
                "model outputs에 weights를 곱해 더해",
                "ensemble probability를 만듦",
              ],
            },
            {
              expression: String.raw`\mathbf1[\bar p_c\ge\tau_c]`,
              annotation: [
                "결합 probability를 class threshold와 비교해",
                "hard action을 결정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`t_a`,
              name: "TTA transform",
              description:
                "Serving에서도 label 의미를 보존한다고 검증한 a번째 view입니다.",
            },
            {
              symbol: String.raw`w_m`,
              name: "Model weight",
              description:
                "m번째 calibrated model output에 주는 비음수 weight입니다.",
            },
            {
              symbol: String.raw`\bar p_c`,
              name: "Combined probability",
              description: "TTA와 ensemble을 적용한 class c probability입니다.",
            },
            {
              symbol: String.raw`\tau_c`,
              name: "Decision threshold",
              description:
                "Class c의 비용·precision·recall·capacity로 선택한 action 경계입니다.",
            },
          ]}
          assumptions={[
            "모든 models의 class mapping과 probability semantics가 같습니다.",
            "Weights는 비음수이며 합이 1이고 selection split에서만 고릅니다.",
            "TTA와 ensemble의 추가 latency·memory를 serving budget에 포함합니다.",
          ]}
          interpretation="Logit average와 probability average는 일반적으로 같지 않습니다. Artifact는 calibration→TTA→ensemble→threshold의 정확한 순서를 고정해야 합니다."
        />
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Threshold의 precision·recall·업무 비용은{" "}
          <Link to="/ai/imbalanced-data">불균형 데이터 정본</Link>, model error
          diversity와 out-of-fold selection은{" "}
          <Link to="/ai/ensemble-methods">ensemble 정본</Link>에서 이어집니다.
        </p>
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Decision artifact를 고정한 뒤 untouched test를 한 번 엽니다
        </h2>
        <TermBreakdown
          title="Release artifact의 독립 필드"
          items={[
            {
              term: "Model generation",
              description:
                "Weight revision, class mapping과 preprocessing generation입니다.",
            },
            {
              term: "Calibration generation",
              description:
                "Calibration split digest, temperature와 reliability report입니다.",
            },
            {
              term: "Aggregation generation",
              description:
                "TTA list, model revisions, weights와 missing-output policy입니다.",
            },
            {
              term: "Action generation",
              description:
                "Threshold·reject·capacity·rollback과 monitoring owner입니다.",
            },
          ]}
        />
        <div id="paper-calibration" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Guo et al. — On Calibration of Modern Neural Networks"
            href="https://proceedings.mlr.press/v70/guo17a.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Classifier confidence가 실제 correctness
                likelihood와 일치하지 않는 문제를 분석합니다.
              </p>
              <p>
                <strong>기여.</strong> Architecture·training factors와 여러
                post-hoc methods를 비교하고 scalar temperature scaling을
                평가합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 image·document datasets, base
                models와 held-out validation setting입니다.
              </p>
              <p>
                <strong>근거 범위.</strong> In-distribution calibration metric과
                method comparison 범위입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 하나의 scalar temperature가 모든
                class·shift·decision cost를 해결한다는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
