import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ResamplingGeometryViz } from "../imbalanced-data/viz/ModernImbalanceViz";

export default function ImbalanceResamplingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Resampling은 원래 population이 아니라 training fold의 노출 분포만
          바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Training-fold resampling</strong>은 split을 끝낸 뒤 training
            subset 안에서만 positive·negative row가 model에 보이는 횟수나
            synthetic distribution을 바꾸는 방법입니다.
          </p>
          <p>
            Validation·test는 원 prevalence를 유지합니다. 그렇지 않으면 model이
            실제 배포 population에서 어떻게 동작하는지 측정할 기준이 사라집니다.
          </p>
        </div>
        <TermBreakdown
          title="Sampling을 바꾸기 전 구분할 네 대상"
          items={[
            {
              term: "Original row",
              description: "Source dataset에서 관찰된 실제 record입니다.",
              example: "환자 visit ID와 label·timestamp를 함께 보존합니다.",
              boundary:
                "같은 환자의 여러 visit은 group split 없이 독립 row가 아닐 수 있습니다.",
            },
            {
              term: "Exposure",
              description:
                "한 training epoch에서 row가 loss에 참여하는 횟수입니다.",
              example:
                "Minority row를 세 번 sampling하면 관측은 하나지만 exposure는 3입니다.",
              boundary: "새 정보가 세 배 생긴 것은 아닙니다.",
            },
            {
              term: "Synthetic row",
              description:
                "Training originals와 정해진 generator로 만든 추가 feature vector입니다.",
              example: "두 minority points 사이 λ=.25 위치를 만듭니다.",
              boundary:
                "Source IDs·generator revision·seed가 없는 synthetic row는 lineage가 끊깁니다.",
            },
            {
              term: "Held-out population",
              description:
                "Sampler가 보지 못하고 원 prevalence를 유지한 validation·test입니다.",
              example: "각 group fold의 20%를 먼저 봉인합니다.",
              boundary:
                "Neighbor index나 scaler fit에도 들어가면 leakage입니다.",
            },
          ]}
        />
        <ResamplingGeometryViz />
        <ContentBoundary article="imbalance-resampling" />
      </section>
      <section id="fold-local" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Split을 먼저 만들고 각 fold의 train subset에서 sampler를 fit합니다
        </h2>
        <ExplainedFormula
          question="Cross-validation에서 sampling leakage가 없다는 조건을 어떻게 표현하나요?"
          idea={
            <p>
              Sampler가 읽는 source index 집합과 validation index 집합의
              교집합이 비어 있어야 합니다.
            </p>
          }
          formula={String.raw`I_{\rm source}\subseteq I_{\rm train},\quad I_{\rm source}\cap I_{\rm val}=\varnothing`}
          annotatedFormula={String.raw`\begin{aligned}q_s&=\underbrace{\mathbf1[I_{\rm source}\subseteq I_{\rm train}]}_{\text{sampler source를 train 안으로 제한}}\\q_v&=\underbrace{\mathbf1[I_{\rm source}\cap I_{\rm val}=\varnothing]}_{\text{validation row와 겹침이 없는지 검사}}\\Q&=\underbrace{q_s\land q_v}_{\text{두 split 조건을 함께 통과}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`I_{\rm source}\subseteq I_{\rm train}`,
              annotation: [
                "sampler가 읽은 IDs를 train IDs와 비교해",
                "모든 source가 train 내부인지 검사",
              ],
            },
            {
              expression: String.raw`I_{\rm source}\cap I_{\rm val}`,
              annotation: [
                "source와 validation IDs의 교집합을 구해",
                "held-out 정보가 neighbor·generator에 들어갔는지 탐지",
              ],
            },
            {
              expression: String.raw`q_s\land q_v`,
              annotation: [
                "포함 조건과 zero-overlap을 AND해",
                "fold-local sampling admission 판정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`I_{\rm source}`,
              name: "Sampler source IDs",
              description:
                "복제·neighbor search·generator fit에 사용된 원본 IDs입니다.",
            },
            {
              symbol: String.raw`I_{\rm train}`,
              name: "Training IDs",
              description: "현재 fold에서 model fitting에 허용된 IDs입니다.",
            },
            {
              symbol: String.raw`I_{\rm val}`,
              name: "Validation IDs",
              description:
                "Sampler와 model fitting에서 봉인한 held-out IDs입니다.",
            },
          ]}
          assumptions={[
            "Group·time boundary를 반영한 split입니다.",
            "Scaler·encoder·neighbor index도 train-only fit입니다.",
            "Synthetic descendants가 source IDs를 보존합니다.",
          ]}
          interpretation="Dataset 전체에서 SMOTE한 뒤 split하면 synthetic row가 validation point의 geometry를 이미 사용합니다. 교집합을 0으로 요구하는 이유가 이 정보 경로를 끊기 위해서입니다."
        />
      </section>
      <section id="smote-geometry" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          SMOTE는 같은 class 두 점을 잇는 방향에서 새 point를 만듭니다
        </h2>
        <ExplainedFormula
          question="xi=(2,4), xj=(6,8), λ=.25이면 synthetic point는 어디인가요?"
          idea={
            <p>
              Neighbor에서 seed를 뺀 방향을 구하고 λ만큼 축소한 뒤 seed에
              더합니다.
            </p>
          }
          formula={String.raw`\tilde x=x_i+\lambda(x_j-x_i)`}
          annotatedFormula={String.raw`\begin{aligned}d&=\underbrace{x_j-x_i}_{\text{seed에서 neighbor로 가는 방향}}\\m&=\underbrace{\lambda d}_{\text{선분 안의 이동량으로 축소}}\\\tilde x&=\underbrace{x_i+m}_{\text{seed에 이동량을 더해 새 point 생성}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`x_j-x_i`,
              annotation: [
                "neighbor에서 seed를 빼",
                "두 minority point를 잇는 방향 vector 계산",
              ],
            },
            {
              expression: String.raw`\lambda d`,
              annotation: [
                "방향에 0~1 coefficient를 곱해",
                "선분 밖으로 나가지 않는 이동량 생성",
              ],
            },
            {
              expression: String.raw`x_i+m`,
              annotation: [
                "이동량을 원 seed에 더해",
                "synthetic feature vector 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`x_i`,
              name: "Minority seed",
              description:
                "Training fold의 원래 minority feature vector입니다.",
            },
            {
              symbol: String.raw`x_j`,
              name: "Minority neighbor",
              description: "같은 class와 train fold에서 선택한 이웃입니다.",
            },
            {
              symbol: String.raw`\lambda`,
              name: "Interpolation position",
              description: "0과 1 사이의 선분 위치입니다.",
            },
            {
              symbol: String.raw`\tilde x`,
              name: "Synthetic point",
              description: "Training에만 추가되는 새 vector입니다.",
            },
          ]}
          assumptions={[
            "Distance metric이 feature 의미와 맞습니다.",
            "두 point 사이 선형 중간값이 유효한 record입니다.",
            "Category·time·entity constraints를 별도 검사합니다.",
          ]}
          interpretation="(6,8)−(2,4)=(4,4), 여기에 .25를 곱하면 (1,1), seed에 더하면 (3,5)입니다. 뺄셈은 방향을, 곱셈은 이동 비율을, 덧셈은 새 위치를 만듭니다."
        />
        <div id="paper-smote" className="scroll-mt-24">
          <CitationBlock
            source="SMOTE: Synthetic Minority Over-sampling Technique"
            citeKey={1}
            href="https://www.jair.org/index.php/jair/article/view/10302"
          >
            <strong>문제:</strong> Minority recognition을 높이면서 단순 복제
            oversampling의 한계를 줄임. <strong>기여:</strong> Minority
            nearest-neighbor 선분의 synthetic example과 sampling 조합 제안.{" "}
            <strong>전제:</strong> Feature metric·minority neighborhood·논문
            dataset와 classifier. <strong>근거 범위:</strong> 논문의 algorithm과
            ROC-space 실험. <strong>과장 금지:</strong> Category·sparse·temporal
            feature의 중간값이 현실적이라는 보장은 아닙니다.
          </CitationBlock>
        </div>
      </section>
      <section id="release-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Sampler를 release하려면 geometry와 lineage를 함께 검사합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Receipt에는 split digest, source IDs, sampling ratio, neighbor
            metric·k, feature encoder, seed와 synthetic constraint failures를
            남깁니다. Validation의 original prevalence에서
            ranking·calibration·threshold cost를 비교하고, 단순
            duplication·class weight baseline보다 낫지 않으면 되돌립니다.
          </p>
        </div>
      </section>
    </div>
  );
}
