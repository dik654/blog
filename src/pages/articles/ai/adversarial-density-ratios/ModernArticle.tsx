import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { AdversarialRatioViz } from "../generative-theory/viz/ModernGenerativeTheoryViz";

export default function AdversarialDensityRatiosArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="two-sources" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          GAN은 두 sample source를 구별하는 문제부터 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Adversarial density-ratio signal</strong>은 generator의
            normalized density를 직접 계산하는 대신, real sample과 generated
            sample이 같은 위치 x에 얼마나 모이는지 discriminator로 비교하는
            신호입니다.
          </p>
        </div>
        <TermBreakdown
          title="두 source와 하나의 판별 함수"
          items={[
            {
              term: "Real distribution p_data",
              description: "Dataset sample이 온 source입니다.",
              example: "실제 얼굴 image 분포입니다.",
              boundary:
                "유한 dataset histogram과 population distribution을 구분합니다.",
            },
            {
              term: "Generated distribution p_g",
              description: "z를 generator G에 넣어 만든 sample source입니다.",
              example: "x=G(z), z∼p(z)입니다.",
              boundary: "Normalized p_g(x)를 직접 계산할 필요는 없습니다.",
            },
            {
              term: "Discriminator D(x)",
              description: "입력 x가 real source에서 왔을 확률을 추정합니다.",
              example: "D=.75는 local real 비율 신호입니다.",
              boundary: "모델 capacity와 optimization 상태에 의존합니다.",
            },
          ]}
        />
        <AdversarialRatioViz />
        <ContentBoundary article="adversarial-density-ratios" />
      </section>

      <section id="optimal-ratio" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          두 density의 합으로 나누는 이유는 source 확률로 정규화하기
          위해서입니다
        </h2>
        <ExplainedFormula
          question="왜 optimal discriminator는 p_data를 p_data+p_g로 나누나요?"
          idea={
            <p>
              같은 x가 real 또는 generated 두 source 중 하나에서 왔다고 보고,
              real contribution을 가능한 두 contribution의 합으로 나누면
              posterior source probability가 됩니다.
            </p>
          }
          formula={String.raw`\begin{aligned}m(x)&=p_{\mathrm{data}}(x)+p_g(x)\\D^*(x)&=p_{\mathrm{data}}(x)/m(x)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}m(x)&=\underbrace{p_{\mathrm{data}}(x)+p_g(x)}_{\text{두 source contribution의 합}}\\D^*(x)&=\underbrace{p_{\mathrm{data}}(x)/m(x)}_{\text{전체 중 real 몫으로 정규화}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`p_{\mathrm{data}}(x)+p_g(x)`,
              annotation: [
                "두 source의 local density를 더해",
                "x가 나올 전체 contribution 계산",
              ],
            },
            {
              expression: String.raw`p_{\mathrm{data}}(x)/m(x)`,
              annotation: [
                "real contribution을 전체로 나눠",
                "real source posterior로 정규화",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`p_{\mathrm{data}}(x)`,
              name: "Real density",
              description: "x 부근의 real source density입니다.",
            },
            {
              symbol: String.raw`p_g(x)`,
              name: "Generated density",
              description: "x 부근의 generator source density입니다.",
            },
            {
              symbol: String.raw`D^*(x)`,
              name: "Pointwise optimal discriminator",
              description:
                "고정 generator에서 얻는 이상적 source probability입니다.",
            },
          ]}
          assumptions={[
            "Real과 generated source를 같은 prior weight로 sampling합니다.",
            "Discriminator가 임의의 pointwise function을 표현할 수 있습니다.",
            "Generator를 고정하고 discriminator optimum을 계산합니다.",
          ]}
          interpretation="Local density 비가 3:1이면 D*=3/(3+1)=.75입니다. 두 density가 같으면 .5지만, 미학습 또는 상수 discriminator의 .5는 equality 증거가 아닙니다."
        />
      </section>

      <section id="training-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          이상적 ratio와 실제 alternating training을 분리합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pointwise optimum을 original minimax value에 대입하면 Jensen–Shannon
            divergence와 연결됩니다. 그러나 finite network·mini-batch·두
            optimizer가 움직이는 실제 game에서는 non-convergence와 mode
            collapse가 생길 수 있습니다.
          </p>
          <p>
            Generator loss, detach, Lipschitz critic과 stabilization은{" "}
            <a href="/ai/gan">GAN 기초</a>와 후속 글이 소유합니다. 이 글은
            density-ratio 신호가 생기는 이유까지만 맡습니다.
          </p>
        </div>
      </section>

      <section id="paper-gan" className="scroll-mt-20">
        <CitationBlock
          source="Generative Adversarial Nets"
          citeKey={1}
          href="https://arxiv.org/abs/1406.2661"
        >
          <strong>문제:</strong> normalized generator likelihood 없이 분포 학습.{" "}
          <strong>기여:</strong> minimax game과 optimal discriminator 분석.{" "}
          <strong>전제:</strong> 충분한 capacity와 pointwise optimum.{" "}
          <strong>근거 범위:</strong> 원 정리와 논문 실험.{" "}
          <strong>과장 금지:</strong> finite alternating training의 수렴 보장은
          아닙니다.
        </CitationBlock>
      </section>
    </div>
  );
}
