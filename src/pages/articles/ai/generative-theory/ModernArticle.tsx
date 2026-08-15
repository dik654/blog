import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { GenerativeMapViz } from "./viz/ModernGenerativeTheoryViz";

export default function GenerativeTheoryArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          생성 모델은 먼저 “무엇이 나올 수 있는가”를 정의합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Generative model</strong>은 관측한 한 sample을 복사하는
            함수가 아니라, 가능한 observation 전체에 probability 또는 sampling
            rule을 두는 모델입니다. 그래서 model family보다 먼저 observation과
            condition의 형태를 고정해야 합니다.
          </p>
        </div>
        <TermBreakdown
          title="한 번에 하나씩 고정하는 생성 문제의 네 요소"
          items={[
            {
              term: "Observation x",
              description: "모델이 확률을 매기거나 새로 생성할 대상입니다.",
              example: "256×256 RGB image 또는 token sequence입니다.",
              boundary: "해상도·tokenization·값 범위까지 support에 포함합니다.",
            },
            {
              term: "Condition c",
              description: "생성 범위를 좁히는 추가 입력입니다.",
              example: "‘검은 고양이’ prompt나 class label입니다.",
              boundary: "Condition이 없으면 p(x), 있으면 p(x|c)를 구분합니다.",
            },
            {
              term: "Distribution",
              description:
                "가능한 x마다 probability mass 또는 density를 두는 규칙입니다.",
              example: "고양이처럼 보이는 여러 image 영역에 mass를 둡니다.",
              boundary: "Training sample 목록 자체와 distribution은 다릅니다.",
            },
            {
              term: "New sample",
              description:
                "학습 뒤 distribution에서 뽑은 새로운 observation입니다.",
              example: "Dataset에 없던 검은 고양이 image입니다.",
              boundary:
                "새롭다는 사실만으로 quality·안전·저작권을 보장하지 않습니다.",
            },
          ]}
        />
        <GenerativeMapViz />
        <ContentBoundary article="generative-theory" />
      </section>

      <section id="tractability" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          그다음 모델이 직접 계산할 수 있는 연산을 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Tractable</strong>은 수학적으로 존재한다는 뜻이 아니라,
            학습·평가·생성 중 필요한 양을 실제 시간과 메모리 안에서 계산할 수
            있다는 뜻입니다. Density 평가, latent inference, 새 sample 생성은
            서로 다른 기능입니다.
          </p>
          <ul>
            <li>
              <strong>Autoregressive:</strong> exact conditional likelihood를
              얻지만 순서대로 생성합니다.
            </li>
            <li>
              <strong>Latent variable:</strong> 숨은 원인을 적분하고 어려우면
              posterior를 근사합니다.
            </li>
            <li>
              <strong>Flow:</strong> exact density를 위해 가역 변환을
              사용합니다.
            </li>
            <li>
              <strong>GAN·score:</strong> normalized density 대신 비교 또는 방향
              신호를 배웁니다.
            </li>
          </ul>
        </div>
      </section>

      <section id="evaluation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Likelihood는 한 축이고, 생성 품질 전체가 아닙니다
        </h2>
        <ExplainedFormula
          question="여러 observation에 model이 준 probability를 어떻게 하나의 학습 점수로 모으나요?"
          idea={
            <p>
              독립 sample의 probability는 곱하고, 숫자가 너무 작아지는 것을
              피하려고 log를 취한 뒤 sample 수로 나눕니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\mathcal L&=\prod_{i=1}^{N}p_\theta(x_i)\\\ell&=\log\mathcal L\\\operatorname{NLL}&=-\ell/N\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\mathcal L&=\underbrace{\prod_{i=1}^{N}p_\theta(x_i)}_{\text{모든 sample event라 곱함}}\\\ell&=\underbrace{\sum_{i=1}^{N}\log p_\theta(x_i)}_{\text{확률 곱을 log 합으로}}\\\operatorname{NLL}&=\underbrace{-\ell/N}_{\text{부호 반전 후 sample 평균}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\prod_i p_\theta(x_i)`,
              annotation: [
                "독립 sample 확률을 곱해",
                "dataset 전체 likelihood 구성",
              ],
            },
            {
              expression: String.raw`\sum_i\log p_\theta(x_i)`,
              annotation: [
                "log로 product를 sum으로 바꿔",
                "underflow 없이 누적",
              ],
            },
            {
              expression: String.raw`-\ell/N`,
              annotation: [
                "부호를 뒤집고 sample 수로 나눠",
                "작을수록 좋은 평균 NLL 구성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`p_\theta(x_i)`,
              name: "Observation probability",
              description:
                "Parameter θ의 model이 i번째 data에 준 mass 또는 density입니다.",
            },
            {
              symbol: "N",
              name: "Dataset size",
              description: "같은 평가 계약으로 점수화한 observation 수입니다.",
            },
            {
              symbol: String.raw`\mathcal L`,
              name: "Likelihood",
              description:
                "관측 dataset을 model parameter의 함수로 읽은 값입니다.",
            },
          ]}
          assumptions={[
            "Sample을 같은 data contract에서 독립적으로 평가합니다.",
            "Continuous density 값은 probability mass와 단위가 다릅니다.",
            "NLL만으로 perceptual quality·coverage·condition fidelity를 결론내리지 않습니다.",
          ]}
          interpretation="Probability가 .8과 .25라면 likelihood=.2, log-likelihood≈−1.609, 평균 NLL≈.805입니다. 같은 숫자만으로 image가 더 자연스러운지는 알 수 없습니다."
        />
      </section>

      <section id="family-map" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          이제 필요한 연산을 소유한 글로 이동합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sequence likelihood는{" "}
            <a href="/ai/autoregressive-generative-models">자기회귀 글</a>, 숨은
            원인과 ELBO는{" "}
            <a href="/ai/latent-variable-generative-models">잠재변수 글</a>,
            가역 density는 <a href="/ai/normalizing-flows">flow 글</a>, GAN 비교
            신호와 score는 각각 별도 글에서 시작합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
