import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { AutoregressiveFactorViz } from "../generative-theory/viz/ModernGenerativeTheoryViz";

export default function AutoregressiveGenerativeModelsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="sequence" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          자기회귀 모델은 sequence를 왼쪽부터 한 칸씩 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Autoregressive generative model</strong>은 다음 위치의
            distribution을 이미 본 prefix에 조건화합니다. 전체 문장 확률을 한
            번에 새로 정의하는 대신 probability chain rule로 쪼갭니다.
          </p>
        </div>
        <TermBreakdown
          title="순서를 따라 생기는 세 물체"
          items={[
            {
              term: "Token xₜ",
              description: "Sequence의 t번째 observation입니다.",
              example: "‘나는 학교에’ 다음의 token입니다.",
              boundary:
                "Image라면 pixel 또는 patch ordering이 될 수도 있습니다.",
            },
            {
              term: "Prefix x₍<t₎",
              description: "현재 위치보다 앞에서 이미 알려진 token 묶음입니다.",
              example: "t=4이면 x₁,x₂,x₃입니다.",
              boundary:
                "Generation 때는 model이 직전에 뽑은 token도 포함됩니다.",
            },
            {
              term: "Conditional p(xₜ|x₍<t₎)",
              description:
                "Prefix가 주어졌을 때 다음 token의 normalized distribution입니다.",
              example: "Vocabulary 전체 probability의 합은 1입니다.",
              boundary: "Ordering과 model capacity가 결과에 영향을 줍니다.",
            },
          ]}
        />
        <AutoregressiveFactorViz />
        <ContentBoundary article="autoregressive-generative-models" />
      </section>

      <section id="factorization" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          곱하는 이유는 conditional을 이어 joint probability를 만들기
          위해서입니다
        </h2>
        <ExplainedFormula
          question="왜 sequence probability가 prefix conditional의 곱이 되나요?"
          idea={
            <p>
              첫 token이 나올 확률과 그 결과를 조건으로 둘째 token이 나올 확률을 같은 event path에서 연속으로 곱합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}q_t&=p_\theta(x_t\mid x_{<t})\\p_\theta(x_{1:T})&=\prod_{t=1}^{T}q_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}q_1&=\underbrace{p_\theta(x_1)}_{\text{첫 event 확률}}\\q_t&=\underbrace{p_\theta(x_t\mid x_{<t})}_{\text{prefix 뒤 다음 event}}\\p_\theta(x_{1:T})&=\underbrace{\prod_{t=1}^{T}q_t}_{\text{같은 sequence 경로라 곱함}}\\\log p_\theta(x_{1:T})&=\underbrace{\sum_{t=1}^{T}\log q_t}_{\text{확률 곱을 log 합으로}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`p(x_1)p(x_2\mid x_1)`,
              annotation: [
                "연속 event 확률을 곱해",
                "두 token의 joint probability 구성",
              ],
            },
            {
              expression: String.raw`\prod_{t=1}^{T}`,
              annotation: [
                "같은 conditional 연결을 T번 반복해",
                "전체 sequence 확률 구성",
              ],
            },
            {
              expression: String.raw`\log\prod_t`,
              annotation: [
                "log로 product를 sum으로 바꿔",
                "token별 loss를 안정적으로 누적",
              ],
            },
          ]}
          terms={[
            {
              symbol: "T",
              name: "Sequence length",
              description: "평가하거나 생성할 token 수입니다.",
            },
            {
              symbol: String.raw`x_{<t}`,
              name: "Prefix",
              description: "t보다 앞선 token 전체입니다.",
            },
            {
              symbol: String.raw`p_\theta(x_t\mid x_{<t})`,
              name: "Next-token distribution",
              description: "현재 prefix가 정한 다음 token 확률입니다.",
            },
          ]}
          assumptions={[
            "고정된 token ordering과 vocabulary를 사용합니다.",
            "각 conditional은 vocabulary에서 normalized됩니다.",
            "Factorization은 exact하지만 learned conditional의 정확도는 보장하지 않습니다.",
          ]}
          interpretation="p(x₁=1)=.6, p(x₂=0|x₁=1)=.5이면 sequence (1,0)의 joint probability는 .3입니다. 두 event가 같은 경로에서 모두 일어나야 하므로 더합니다가 아니라 곱합니다."
        />
      </section>

      <section id="train-sample" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Training은 정답 prefix를 알고, sampling은 앞 결과를 기다립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Teacher forcing</strong>에서는 dataset의 모든 target token이
            이미 있으므로 각 위치 score를 GPU에서 함께 계산할 수 있습니다.
            생성할 때는 x₁을 뽑아야 x₂의 조건이 생기므로 T개의 sampling
            decision이 순서대로 이어집니다.
          </p>
          <p>
            따라서 exact likelihood가 있다는 사실과 low-latency sampling은 서로 다른 장점입니다. KV cache는 이전 hidden projection의
            재계산을 줄이지만 token dependency 자체를 없애지는 않습니다.
          </p>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Ordering·exposure·latency를 함께 기록합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ul>
            <li>
              같은 joint도 ordering이 다르면 conditional task가 달라집니다.
            </li>
            <li>
              Training의 true prefix와 generation의 sampled prefix 사이에
              exposure gap이 생길 수 있습니다.
            </li>
            <li>
              NLL·tokens/s·time-to-first-token·memory를 별도 열로 평가합니다.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
