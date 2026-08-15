import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import GanEvaluationViz from "./GanEvaluationViz";

export default function GanConditionalEvaluationArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section id="conditioning" className="space-y-6">
        <Header
          n="00"
          title="Condition c는 generator의 주문이면서 discriminator가 검사할 pairing이다"
        />
        <p className="text-lg leading-8">
          먼저 <strong>conditional generation</strong> 하나만 봅니다. “고양이를
          만들어라”라는 condition을 G에만 주면 D는 결과가 고양이인지 검사하지
          못합니다. 같은 c를 양쪽에 연결해야 <code>p(x|c)</code>를 겨냥합니다.
        </p>
        <Term
          name="Conditional adversarial generation"
          shape="G(z,c) · D(x,c)"
          meaning="Condition c를 생성 path와 real/fake comparison path 모두에 넣어 condition별 distribution을 맞추는 방법입니다."
          example="Class-balanced batch에서 c=cat인 real과 generated image를 같은 condition score로 비교합니다."
          boundary="Condition injection만으로 adherence·unseen composition·condition별 diversity를 보장하지 않습니다."
        />
        <GanEvaluationViz />
        <ExplainedFormula
          question="왜 objective의 real과 generated 항 모두에 c가 들어갈까요?"
          idea={
            <>
              Discriminator가 sample realism뿐 아니라 sample-condition
              pairing까지 비교해야 generator가 conditional distribution을 학습할
              수 있습니다.
            </>
          }
          formula={String.raw`\max_D\ \mathbb E_{x,c}\log D(x,c)+\mathbb E_{z,c}\log(1-D(G(z,c),c))`}
          annotatedFormula={String.raw`\begin{aligned}
\underbrace{r(x,c)=\log D(x,c)}_{\text{real pairing reward}}&\\
\underbrace{q=G(z,c)}_{\text{conditioned sample 생성}}&\\
\underbrace{s=D(q,c)}_{\text{generated pairing score}}&\\
\underbrace{f(z,c)=\log(1-s)}_{\text{fake pairing reward}}&\\
\max_D\;&\underbrace{\mathbb E[r]+\mathbb E[f]}_{\text{두 pairing 평균 결합}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`G(z,c)`,
              annotation: [
                "latent와 condition을 함께 넣어",
                "condition-specific sample 생성",
              ],
            },
            {
              expression: String.raw`D(x,c)`,
              annotation: [
                "sample과 condition을 함께 비교해",
                "pairing consistency까지 score에 반영",
              ],
            },
            {
              expression: String.raw`\mathbb E_{x,c}+\mathbb E_{z,c}`,
              annotation: [
                "real·generated pairing objective를 합쳐",
                "conditional discriminator update 구성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "c",
              name: "Condition",
              description: "Class·text·attribute 같은 requested context입니다.",
            },
          ]}
          assumptions={[
            "Training batch의 condition distribution과 weighting을 명시합니다.",
            "D와 G가 c를 실제로 사용할 architecture path를 가집니다.",
          ]}
          interpretation="Marginal image quality가 좋아도 label별 correctness와 diversity가 낮을 수 있으므로 이후 평가를 condition별로 나눕니다."
        />
        <div id="paper-conditional-gan">
          <CitationBlock
            source="Mirza & Osindero · Conditional GANs"
            citeKey={1}
            href="https://arxiv.org/abs/1411.1784"
          >
            <Evidence
              problem="Adversarial model을 label·context별 생성으로 확장"
              contribution="Condition을 G와 D 모두에 제공하는 objective"
              assumptions="논문의 concatenation architecture와 datasets"
              scope="Class-conditioned generation experiments"
              notClaim="Condition injection만으로 adherence와 balanced coverage를 보장하지 않음"
            />
          </CitationBlock>
        </div>
      </section>
      <section id="fid" className="space-y-6">
        <Header
          n="01"
          title="FID는 raw pixel이 아니라 고정 feature의 중심과 퍼짐을 비교한다"
        />
        <Term
          name="Fréchet Inception Distance"
          shape="mean gap + covariance gap"
          meaning="Real·generated sample을 같은 feature extractor에 넣고 두 feature set을 Gaussian moment로 요약해 비교하는 scalar metric입니다."
          example="1D N(0,1)과 N(2,1)은 covariance가 같고 mean gap square가 4라 FID=4입니다."
          boundary="Encoder·resize·sample count·reference split에 의존하며 memorization과 condition correctness를 단독 증명하지 않습니다."
        />
        <ExplainedFormula
          question="FID는 왜 mean 차이와 covariance 차이를 함께 더할까요?"
          idea={
            <>
              Mean은 feature cloud의 중심 이동을, covariance는 방향별 퍼짐의
              차이를 잡습니다. 둘 중 하나만 보면 중심은 같지만 다양성이 다른
              경우를 놓칩니다.
            </>
          }
          formula={String.raw`\operatorname{FID}=\lVert\mu_r-\mu_g\rVert_2^2+\operatorname{Tr}(\Sigma_r+\Sigma_g-2(\Sigma_r\Sigma_g)^{1/2})`}
          annotatedFormula={String.raw`\begin{aligned}
\underbrace{d_\mu=\lVert\mu_r-\mu_g\rVert_2^2}_{\text{feature cloud 중심 차이}}&\\
\underbrace{A=\Sigma_r+\Sigma_g}_{\text{두 cloud의 spread 합}}&\\
\underbrace{B=2(\Sigma_r\Sigma_g)^{1/2}}_{\text{공유 covariance geometry}}&\\
\underbrace{d_\Sigma=\operatorname{Tr}(A-B)}_{\text{퍼짐·방향 차이}}&\\
\operatorname{FID}&=\underbrace{d_\mu+d_\Sigma}_{\text{두 geometry 차이 결합}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mu_r-\mu_g`,
              annotation: [
                "두 feature center를 빼고 square norm을 취해",
                "global location mismatch 측정",
              ],
            },
            {
              expression: String.raw`\Sigma_r+\Sigma_g-2(\Sigma_r\Sigma_g)^{1/2}`,
              annotation: [
                "두 covariance geometry를 결합해",
                "spread·orientation mismatch 측정",
              ],
            },
            {
              expression: String.raw`\text{mean term}+\text{covariance term}`,
              annotation: [
                "location과 spread 차이를 더해",
                "scalar comparison metric 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\mu_r,\mu_g`,
              name: "Feature means",
              description: "Real·generated feature set의 sample mean입니다.",
            },
            {
              symbol: String.raw`\Sigma_r,\Sigma_g`,
              name: "Feature covariances",
              description: "같은 extractor space의 covariance estimates입니다.",
            },
          ]}
          assumptions={[
            "같은 feature extractor·preprocessing·sample count protocol을 사용합니다.",
            "Finite feature distributions를 Gaussian moments로 요약합니다.",
          ]}
          interpretation="낮은 FID는 protocol 안의 moment similarity입니다. 한 모델이 모든 semantic·coverage·latency 축에서 낫다는 뜻은 아닙니다."
        />
      </section>
      <section id="precision-recall" className="space-y-6">
        <Header
          n="02"
          title="Generative precision은 품질을, recall은 target coverage를 묻는다"
        />
        <Term
          name="Generative precision · recall"
          shape="fake in target · target covered by fake"
          meaning="Generated sample이 target feature 영역 안에 있는 비율과 target 영역이 generated set에 의해 덮이는 정도를 분리한 평가 관점입니다."
          example="8개 target mode 중 2개에서만 선명한 sample을 만들면 precision은 높고 recall은 낮을 수 있습니다."
          boundary="Classifier confusion-matrix precision/recall과 같은 정의가 아니며 manifold approximation에 의존합니다."
        />
        <ExplainedFormula
          question="왜 quality와 coverage를 한 scalar로 합치기 전에 따로 기록할까요?"
          idea={
            <>
              같은 FID라도 target 밖의 artifact가 많은 모델과 소수 mode만
              복제하는 모델은 실패 원인이 다릅니다. 두 비율은 수정해야 할 축을
              나눠 줍니다.
            </>
          }
          formula={String.raw`P_{\rm gen}=\frac{|G\cap R|}{|G|},\qquad R_{\rm gen}=\frac{|R\cap \operatorname{cover}(G)|}{|R|}`}
          annotatedFormula={String.raw`\begin{aligned}
P_{\rm gen}&=\underbrace{\frac{|G\cap R|}{|G|}}_{\text{generated 중 target 안의 비율}}\\
R_{\rm gen}&=\underbrace{\frac{|R\cap \operatorname{cover}(G)|}{|R|}}_{\text{target 중 generated가 덮은 비율}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`G\cap R`,
              annotation: [
                "generated와 target 영역의 겹침을 골라",
                "plausible generated subset 생성",
              ],
            },
            {
              expression: String.raw`|G\cap R|/|G|`,
              annotation: [
                "겹친 generated 수를 전체 generated로 나눠",
                "sample quality 비율 계산",
              ],
            },
            {
              expression: String.raw`|R\cap\operatorname{cover}(G)|/|R|`,
              annotation: [
                "generated가 닿은 target mass를 전체 target으로 나눠",
                "coverage 비율 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "G",
              name: "Generated feature set",
              description: "Fixed encoder로 표현한 generated samples입니다.",
            },
            {
              symbol: "R",
              name: "Reference feature set",
              description: "같은 encoder로 표현한 target samples입니다.",
            },
          ]}
          assumptions={[
            "Feature-space neighborhood 또는 manifold estimator를 고정합니다.",
            "동일 sample budget에서 비교합니다.",
          ]}
          interpretation="높은 precision·낮은 recall은 mode collapse와 호환됩니다. Condition별로 다시 나누면 특정 class만 놓치는 failure도 보입니다."
        />
        <div id="paper-generative-pr">
          <CitationBlock
            source="Sajjadi et al. · Precision and Recall for Generative Models"
            citeKey={2}
            href="https://arxiv.org/abs/1806.00035"
          >
            <Evidence
              problem="Scalar metric이 quality와 coverage failure를 섞는 문제"
              contribution="Distribution precision·recall 분해와 finite-sample procedure"
              assumptions="Fixed representation·manifold approximation·sample count"
              scope="논문의 synthetic·image evaluation"
              notClaim="모든 semantic quality를 완전히 측정하지 않음"
            />
          </CitationBlock>
        </div>
      </section>
      <section id="evaluation-protocol" className="space-y-6">
        <Header
          n="03"
          title="평가 계약은 metric 이름보다 입력·기준·비용을 먼저 고정한다"
        />
        <ul className="space-y-3 leading-7">
          <li>
            — <strong>Input:</strong> sample count, condition distribution,
            seed와 truncation
          </li>
          <li>
            — <strong>Representation:</strong> feature extractor, resize,
            preprocessing와 version
          </li>
          <li>
            — <strong>Reference:</strong> train/test split과
            duplicate·memorization 검사
          </li>
          <li>
            — <strong>Outputs:</strong> FID, precision, recall, condition
            accuracy와 diversity
          </li>
          <li>
            — <strong>Cost:</strong> latency, throughput, memory와 hardware
          </li>
        </ul>
        <p className="leading-7">
          평가표는 모델을 멋진 이미지 한 장으로 고르는 장치가 아니라 실패 원인을
          분리하는 실험 계약입니다.
        </p>
        <div data-viz="gan-evaluation-concept-ladder">
          <ConceptLadderViz
            title="Conditional evaluation은 주문에서 release table까지 이어진다"
            description="Condition pairing을 먼저 고정하고 feature comparison, quality·coverage 분리, 재현 가능한 protocol 순서로 조합합니다."
            steps={[
              { label: "Condition", detail: "G와 D에 같은 c" },
              { label: "Embed", detail: "fixed feature space" },
              { label: "Separate", detail: "quality와 coverage" },
              { label: "Protocol", detail: "split·seed·cost 고정" },
            ]}
          />
        </div>
        <ContentBoundary article="gan-conditional-evaluation" />
      </section>
    </article>
  );
}
function Header({ n, title }: { n: string; title: string }) {
  return (
    <header>
      <p className="text-sm font-semibold text-primary">{n} · 조건과 평가</p>
      <h2 className="mt-2 text-2xl font-bold">{title}</h2>
    </header>
  );
}
function Term({
  name,
  shape,
  meaning,
  example,
  boundary,
}: {
  name: string;
  shape: string;
  meaning: string;
  example: string;
  boundary: string;
}) {
  return (
    <div className="border-l border-primary/70 pl-5">
      <p className="text-xs font-bold text-primary">용어 하나</p>
      <h3 className="mt-1 text-lg font-bold">{name}</h3>
      <p className="mt-2 font-mono text-sm font-black">{shape}</p>
      <p className="mt-3 leading-7">{meaning}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        <strong className="text-foreground">작은 예:</strong> {example}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        <strong className="text-foreground">경계:</strong> {boundary}
      </p>
    </div>
  );
}
function Evidence({
  problem,
  contribution,
  assumptions,
  scope,
  notClaim,
}: {
  problem: string;
  contribution: string;
  assumptions: string;
  scope: string;
  notClaim: string;
}) {
  return (
    <div className="space-y-2">
      <p>
        <strong>문제:</strong> {problem}
      </p>
      <p>
        <strong>핵심 아이디어:</strong> {contribution}
      </p>
      <p>
        <strong>중요 가정:</strong> {assumptions}
      </p>
      <p>
        <strong>근거 범위:</strong> {scope}
      </p>
      <p>
        <strong>일반화 금지:</strong> {notClaim}
      </p>
    </div>
  );
}
