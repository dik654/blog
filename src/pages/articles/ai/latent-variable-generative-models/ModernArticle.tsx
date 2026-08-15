import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { LatentInferenceViz } from "../generative-theory/viz/ModernGenerativeTheoryViz";

export default function LatentVariableGenerativeModelsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="latent-cause" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Latent variable은 관측하지 못한 생성 원인입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Latent variable z</strong>는 data x를 만들었다고 가정하지만
            dataset에는 직접 기록되지 않은 변수입니다. 먼저 prior에서 z를 뽑고
            decoder가 x의 조건부 distribution을 만듭니다.
          </p>
        </div>
        <TermBreakdown
          title="숨은 원인을 도입할 때 생기는 네 분포"
          items={[
            {
              term: "Prior p(z)",
              description:
                "Observation을 보기 전 latent의 기준 distribution입니다.",
              example: "Standard Gaussian을 자주 사용합니다.",
              boundary: "사람이 원하는 의미 축과 자동으로 일치하지 않습니다.",
            },
            {
              term: "Decoder p(x|z)",
              description:
                "주어진 latent가 observation을 만드는 조건부 distribution입니다.",
              example: "z가 pose와 조명을 정하고 image likelihood를 냅니다.",
              boundary:
                "출력 distribution 선택이 reconstruction 의미를 바꿉니다.",
            },
            {
              term: "Marginal p(x)",
              description:
                "가능한 모든 z의 설명을 합한 observation density입니다.",
              example: "두 latent branch의 weighted sum입니다.",
              boundary: "고차원 연속 z에서는 적분이 어려울 수 있습니다.",
            },
            {
              term: "Posterior p(z|x)",
              description:
                "이미 본 x를 어떤 z가 설명했을지 역으로 묻는 distribution입니다.",
              example: "Image에서 pose 후보를 추론합니다.",
              boundary:
                "Decoder가 쉬워도 posterior가 tractable하다는 보장은 없습니다.",
            },
          ]}
        />
        <LatentInferenceViz />
        <ContentBoundary article="latent-variable-generative-models" />
      </section>

      <section id="marginalization" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          z를 보지 못했으므로 가능한 설명을 모두 가중해 더합니다
        </h2>
        <ExplainedFormula
          question="왜 p(x)를 구할 때 latent별 conditional과 prior를 곱한 뒤 더하나요?"
          idea={
            <p>
              각 z branch가 선택될 prior probability와 그 branch에서 x가 나올
              conditional probability를 곱해 joint contribution을 만들고, 어느
              branch였는지 모르므로 모두 더합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}c_z&=p(z)p_\theta(x\mid z)\\p_\theta(x)&=\sum_z c_z\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}c_z&=\underbrace{p(z)p_\theta(x\mid z)}_{\text{branch 선택과 x 발생을 곱함}}\\p_\theta(x)&=\underbrace{\sum_z c_z}_{\text{숨은 branch를 모두 합함}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`p(z)p(x\mid z)`,
              annotation: [
                "branch prior와 conditional을 곱해",
                "그 branch의 joint contribution 계산",
              ],
            },
            {
              expression: String.raw`\sum_z`,
              annotation: [
                "어느 latent였는지 관측하지 못했으므로",
                "가능한 branch를 빠짐없이 합산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "z",
              name: "Latent cause",
              description: "Dataset에 직접 관측되지 않은 생성 원인입니다.",
            },
            {
              symbol: String.raw`p(z)`,
              name: "Prior weight",
              description: "각 latent branch가 선택될 기준 probability입니다.",
            },
            {
              symbol: String.raw`p_\theta(x\mid z)`,
              name: "Conditional evidence",
              description: "해당 branch가 x를 설명하는 정도입니다.",
            },
          ]}
          assumptions={[
            "Discrete z 예시이며 continuous z에서는 sum이 integral로 바뀝니다.",
            "각 conditional과 prior가 normalized distribution입니다.",
            "Latent label의 semantic identifiability는 별도 조건입니다.",
          ]}
          interpretation="p(z=0)=.75, p(x|0)=.2, p(z=1)=.25, p(x|1)=.8이면 contribution은 .15와 .20이고 p(x)=.35입니다."
        />
      </section>

      <section id="elbo" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Posterior가 어려우면 q(z|x)를 계산 가능한 발판으로 둡니다
        </h2>
        <ExplainedFormula
          question="ELBO는 왜 log evidence보다 작고, 그 차이는 무엇인가요?"
          idea={
            <p>
              Approximate posterior q로 reconstruction과 prior penalty를
              계산하고, true posterior와의 KL을 더하면 정확한 log evidence가
              됩니다.
            </p>
          }
          formula={String.raw`\begin{aligned}G(x)&=D_{\mathrm{KL}}(q_\phi\Vert p_\theta)\\\log p_\theta(x)&=\mathcal L_{\mathrm{ELBO}}(x)+G(x)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}q&=q_\phi(z\mid x)\\R(x)&=\underbrace{\mathbb E_q[\log p_\theta(x\mid z)]}_{\text{x 설명의 평균}}\\K(x)&=\underbrace{D_{\mathrm{KL}}(q\Vert p(z))}_{\text{prior 이탈 비용}}\\\mathcal L_{\mathrm{ELBO}}&=\underbrace{R(x)-K(x)}_{\text{설명 점수에서 비용을 뺌}}\\G(x)&=\underbrace{D_{\mathrm{KL}}(q\Vert p_\theta(z\mid x))}_{\text{posterior 근사 오차}}\\\log p_\theta(x)&=\underbrace{\mathcal L_{\mathrm{ELBO}}+G(x)}_{\text{gap을 더해 evidence 복원}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbb E_q[\log p(x\mid z)]`,
              annotation: [
                "q가 제안한 latent를 평균해",
                "observation 설명 점수 계산",
              ],
            },
            {
              expression: String.raw`-D_{\mathrm{KL}}(q\Vert p(z))`,
              annotation: [
                "posterior가 prior에서 벗어난 정도를 빼",
                "generation 가능한 latent 공간 유지",
              ],
            },
            {
              expression: String.raw`+D_{\mathrm{KL}}(q\Vert p(z\mid x))`,
              annotation: [
                "approximation gap을 다시 더해",
                "정확한 log evidence 복원",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`q_\phi(z\mid x)`,
              name: "Approximate posterior",
              description:
                "Encoder가 빠르게 계산하는 latent distribution입니다.",
            },
            {
              symbol: String.raw`\mathcal L_{\mathrm{ELBO}}`,
              name: "Evidence lower bound",
              description: "학습 가능한 likelihood lower bound입니다.",
            },
            {
              symbol: String.raw`D_{\mathrm{KL}}(q\Vert p_\theta)`,
              name: "Inference gap",
              description:
                "q와 true posterior가 달라 생기는 정확한 차이입니다.",
            },
          ]}
          assumptions={[
            "q의 support가 posterior의 relevant region을 덮습니다.",
            "Expectation gradient를 Monte Carlo로 계산할 수 있습니다.",
            "KL은 0 이상이므로 ELBO가 lower bound입니다.",
          ]}
          interpretation="q가 true posterior와 같으면 gap=0이라 ELBO=log p(x)입니다. q가 중요한 mode를 놓치면 reconstruction이 좋아 보여도 bound가 느슨할 수 있습니다."
        />
      </section>

      <section id="paper-aevb" className="scroll-mt-20">
        <CitationBlock
          source="Auto-Encoding Variational Bayes"
          citeKey={1}
          href="https://arxiv.org/abs/1312.6114"
        >
          <strong>문제:</strong> intractable posterior가 있는 latent model 학습.{" "}
          <strong>기여:</strong> amortized encoder와 reparameterization
          estimator. <strong>전제:</strong> 논문의 differentiable latent
          family와 estimator. <strong>근거 범위:</strong> ELBO 유도와 해당 실험.{" "}
          <strong>과장 금지:</strong> disentanglement·perceptual quality의 자동
          보장은 아닙니다.
        </CitationBlock>
      </section>
    </div>
  );
}
