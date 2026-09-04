import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { LossSignalViz } from "../imbalanced-data/viz/ModernImbalanceViz";

export default function ImbalanceLossWeightingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Loss weighting은 어떤 example이 gradient를 얼마나 움직이는지 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Class-weighted risk</strong>는 target class에 따라 고정
            coefficient를 곱합니다. <strong>Focal modulation</strong>은 현재
            model이 그 example을 얼마나 쉽게 맞히는지에 따라 coefficient를
            바꿉니다.
          </p>
          <p>
            둘은 minority 비율을 50:50으로 바꾸지 않습니다. 같은 training rows의
            loss contribution을 재배분합니다.
          </p>
        </div>
        <TermBreakdown
          title="Loss signal을 이루는 네 항"
          items={[
            {
              term: "Sample loss",
              description:
                "한 example의 target probability에서 계산한 NLL입니다.",
              example: "positive target에 p=.2면 −log .2입니다.",
              boundary: "Batch 평균 전의 per-example 값으로 비교합니다.",
            },
            {
              term: "Class weight",
              description: "Target class만 보고 정한 고정 multiplier입니다.",
              example: "positive 9, negative 1을 곱합니다.",
              boundary:
                "Inverse frequency는 실제 FP·FN cost나 label quality를 알지 못합니다.",
            },
            {
              term: "Focal factor",
              description:
                "Target probability pt에 따라 easy example을 줄이는 multiplier입니다.",
              example: "γ=2, pt=.9이면 .01입니다.",
              boundary: "Hard example이 informative하다는 가정이 필요합니다.",
            },
            {
              term: "Gradient contribution",
              description:
                "Weighted sample loss가 parameter update에 주는 방향과 크기입니다.",
              example:
                "Minority gradient norm·sign과 majority 합을 slice로 기록합니다.",
              boundary:
                "Loss 값 비율이 모든 parameter의 gradient 비율과 항상 같지는 않습니다.",
            },
          ]}
        />
        <LossSignalViz />
        <ContentBoundary article="imbalance-loss-weighting" />
      </section>
      <section id="class-weight" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Class weight는 class별 sample loss 합을 다시 배분합니다
        </h2>
        <ExplainedFormula
          question="Positive example에 weight 9를 주면 batch risk는 어떻게 바뀌나요?"
          idea={
            <p>
              각 sample loss에 target class의 weight를 곱하고 weight 합으로 나누어 scale을 안정화합니다.
            </p>
          }
          formula={String.raw`\hat R_w=\frac{\sum_i w_{y_i}\ell_i}{\sum_i w_{y_i}}`}
          annotatedFormula={String.raw`\begin{aligned}c_i&=\underbrace{w_{y_i}\ell_i}_{\text{class weight로 sample 기여 조정}}\\C&=\underbrace{\sum_i c_i}_{\text{batch의 weighted loss를 합산}}\\\hat R_w&=\underbrace{C/\sum_iw_{y_i}}_{\text{총 weight로 나눠 scale 정규화}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`w_{y_i}\ell_i`,
              annotation: [
                "sample loss에 target-class coefficient를 곱해",
                "minority·majority의 gradient 기여를 재배분",
              ],
            },
            {
              expression: String.raw`\sum_i c_i`,
              annotation: [
                "모든 weighted contributions를 더해",
                "batch가 줄 하나의 objective 생성",
              ],
            },
            {
              expression: String.raw`C/\sum_iw_{y_i}`,
              annotation: [
                "weighted sum을 total weight로 나눠",
                "batch composition 변화에 따른 scale 폭증 완화",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\ell_i`,
              name: "Sample loss",
              description: "i번째 example의 기본 cross-entropy입니다.",
            },
            {
              symbol: String.raw`w_{y_i}`,
              name: "Class weight",
              description: "Target class에 연결된 고정 multiplier입니다.",
            },
            {
              symbol: String.raw`\hat R_w`,
              name: "Weighted empirical risk",
              description: "Batch의 normalized weighted objective입니다.",
            },
          ]}
          assumptions={[
            "Weight convention과 reduction 방식이 명시되어 있습니다.",
            "Label quality를 class별로 audit했습니다.",
            "Resampling을 함께 쓰면 exposure와 weight의 곱을 별도 계산합니다.",
          ]}
          interpretation="Positive loss 1에 weight 9를 곱하면 contribution은 9가 됩니다. 마지막 나눗셈은 중요도를 없애는 것이 아니라 전체 objective scale을 비교 가능하게 유지합니다."
        />
      </section>
      <section id="focal-modulation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Focal loss는 target probability로 easy example의 배점을 줄입니다
        </h2>
        <ExplainedFormula
          question="γ=2에서 pt=.9와 pt=.2의 focal factor가 왜 .01과 .64인가요?"
          idea={
            <p>
              Target probability의 complement 1−pt를 구하고 γ제곱합니다. 이미
              맞힌 example일수록 complement가 작아 빠르게 줄어듭니다.
            </p>
          }
          formula={String.raw`\operatorname{FL}(p_t)=-\alpha_t(1-p_t)^\gamma\log p_t`}
          annotatedFormula={String.raw`\begin{aligned}e_t&=\underbrace{1-p_t}_{\text{정답 확신의 부족분 계산}}\\f_t&=\underbrace{e_t^\gamma}_{\text{부족분을 거듭제곱해 easy loss 억제}}\\\operatorname{FL}&=\underbrace{\alpha_t f_t(-\log p_t)}_{\text{class·난이도·NLL 기여를 결합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`1-p_t`,
              annotation: [
                "1에서 target probability를 빼",
                "model이 아직 어려워하는 정도 계산",
              ],
            },
            {
              expression: String.raw`e_t^\gamma`,
              annotation: [
                "부족분을 gamma제곱해",
                "easy example의 작은 값은 더 빠르게 축소",
              ],
            },
            {
              expression: String.raw`\alpha_t f_t(-\log p_t)`,
              annotation: [
                "class factor·난이도 factor·NLL을 곱해",
                "최종 per-example focal contribution 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`p_t`,
              name: "Target-class probability",
              description: "정답 class에 model이 준 probability입니다.",
            },
            {
              symbol: String.raw`\gamma`,
              name: "Focusing parameter",
              description: "Easy-example down-weighting 강도입니다.",
            },
            {
              symbol: String.raw`\alpha_t`,
              name: "Class factor",
              description: "선택적으로 target class balance를 조정합니다.",
            },
            {
              symbol: String.raw`-\log p_t`,
              name: "NLL",
              description:
                "정답 probability가 작을수록 커지는 기본 loss입니다.",
            },
          ]}
          assumptions={[
            "Probability와 target mapping이 맞습니다.",
            "Hard examples가 label noise에 지배되지 않습니다.",
            "γ=0 baseline과 calibration 변화를 함께 비교합니다.",
          ]}
          interpretation="pt=.9이면 1−pt=.1이고 제곱하면 .01입니다. pt=.2이면 .8²=.64입니다. complement는 난이도를 만들고 거듭제곱은 두 난이도의 차이를 확대합니다."
        />
        <div id="paper-focal-loss" className="scroll-mt-24">
          <CitationBlock
            source="Focal Loss for Dense Object Detection"
            citeKey={1}
            href="https://openaccess.thecvf.com/content_ICCV_2017/html/Lin_Focal_Loss_for_ICCV_2017_paper.html"
          >
            <strong>문제:</strong> Dense detector의 수많은 easy background가
            training signal을 지배함. <strong>기여:</strong> Well-classified
            example의 CE를 줄이는 focal factor와 RetinaNet 제안.{" "}
            <strong>전제:</strong> Dense detection·target mapping·α·γ·RetinaNet
            recipe. <strong>근거 범위:</strong> COCO detection 비교와 ablation.{" "}
            <strong>과장 금지:</strong> 모든 tabular·medical imbalance에서 focal
            loss가 weighted CE보다 우월하다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
      <section id="noise-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Hard label noise까지 키우지 않는지 별도 slice로 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Mislabeled minority example은 계속 낮은 pt를 유지해 focal weight가
            커질 수 있습니다. Cleaned subset·high-disagreement slice·per-class
            gradient norm을 보고 ordinary CE, class weight, focal을 한 축씩
            비교합니다. Resampling과 weight를 동시에 켜면 exposure×weight가 중복
            보정되는지도 계산합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
