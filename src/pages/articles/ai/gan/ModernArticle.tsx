import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { ganTree } from "./fileTree";
import GanGameViz from "./GanGameViz";

const ORIGINAL = "https://arxiv.org/abs/1406.2661";

export default function GanFoundationsArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
    <article id="overview" className="space-y-16">
      <section id="distribution" className="space-y-6">
        <Header
          n="00"
          kicker="먼저 만드는 것"
          title="GAN generator는 probability 값을 출력하지 않고 sample distribution을 만든다"
        />
        <p className="text-lg leading-8">
          먼저 <strong>generator</strong> 하나만 봅니다. 쉽게 뽑는 latent vector{" "}
          <code>z</code>를 image·audio 같은 data sample <code>x̃</code>로 바꾸는
          함수입니다.
        </p>
        <Term
          name="Implicit generator pushforward"
          shape="z → Gθ(z)=x̃"
          meaning="Latent distribution의 점들을 generator가 data space로 옮겼을 때 생기는 output distribution입니다."
          example="Batch 32의 z∈ℝ²를 넣어 32×3×64×64 image tensor를 만듭니다."
          boundary="Sample은 만들지만 normalized density p_g(x), inverse encoder, likelihood를 자동으로 제공하지 않습니다."
        />
        <GanGameViz />
        <ExplainedFormula
          question="왜 generator output의 분포를 pushforward라고 부를까요?"
          idea={
            <>
              먼저 latent를 뽑고 같은 deterministic map을 적용합니다. Output
              probability는 각 data point의 식을 직접 계산한 값이 아니라 latent
              mass가 이동해 쌓인 결과입니다.
            </>
          }
          formula={String.raw`z\sim p_z,\qquad \widetilde x=G_\theta(z)\sim (G_\theta)_\#p_z`}
          annotatedFormula={String.raw`\begin{aligned}
\underbrace{z\sim p_z}_{\text{latent sampling}}&\\
\underbrace{\widetilde x=G_\theta(z)}_{\text{data sample로 변환}}&\\
\underbrace{\widetilde x\sim p_g}_{\text{output mass가 분포를 이룸}}&
\end{aligned}`}
          operations={[
            {
              expression: String.raw`z\sim p_z`,
              annotation: [
                "쉽게 sampling할 input mass를 정해",
                "생성 과정의 randomness 제공",
              ],
            },
            {
              expression: String.raw`G_\theta(z)`,
              annotation: [
                "latent point를 learned map에 넣어",
                "data-shaped sample로 변환",
              ],
            },
            {
              expression: String.raw`(G_\theta)_\#p_z`,
              annotation: [
                "latent mass 전체를 같은 map으로 옮겨",
                "implicit output distribution 정의",
              ],
            },
          ]}
          terms={[
            {
              symbol: "z",
              name: "Latent sample",
              description: "Simple prior에서 뽑은 generator input입니다.",
            },
            {
              symbol: String.raw`G_\theta`,
              name: "Generator",
              description: "Parameter θ를 가진 deterministic mapping입니다.",
            },
          ]}
          assumptions={[
            "Latent prior에서 sampling할 수 있습니다.",
            "Generator output shape가 data contract와 맞습니다.",
          ]}
          interpretation="GAN의 첫 계약은 density 평가가 아니라 z에서 x̃를 만드는 sampling path입니다."
        />
      </section>
      <section id="discriminator" className="space-y-6">
        <Header
          n="01"
          kicker="비교 함수를 붙이기"
          title="Discriminator는 real과 generated sample을 같은 입력 공간에서 비교한다"
        />
        <Term
          name="Discriminator"
          shape="Dφ(x)∈(0,1)"
          meaning="한 sample이 현재 real batch 쪽에서 왔다고 보는 score를 내는 differentiable classifier입니다."
          example="Real score 0.8, fake score 0.2라면 현재 D는 두 batch를 쉽게 나눕니다."
          boundary="Finite D score는 calibrated density ratio나 두 분포가 같다는 증명이 아닙니다."
        />
        <ExplainedFormula
          question="Ideal discriminator는 왜 real density를 두 density의 합으로 나눌까요?"
          idea={
            <>
              같은 x가 real mixture에서 왔을 상대 질량을 계산합니다. 분자는 real
              mass이고 분모는 real 또는 generated 중 하나에서 온 전체 후보
              mass입니다.
            </>
          }
          formula={String.raw`D^*(x)=\frac{p_{\rm data}(x)}{p_{\rm data}(x)+p_g(x)}`}
          annotatedFormula={String.raw`D^*(x)=\frac{\overbrace{p_{\rm data}(x)}^{\text{x의 real mass}}}{\underbrace{p_{\rm data}(x)+p_g(x)}_{\text{x를 만들 수 있는 두 출처의 전체 mass}}}`}
          operations={[
            {
              expression: String.raw`p_{\rm data}(x)+p_g(x)`,
              annotation: [
                "real·generated 출처 mass를 합쳐",
                "분류 시 비교할 전체 기준량 생성",
              ],
            },
            {
              expression: String.raw`p_{\rm data}(x)/(p_{\rm data}(x)+p_g(x))`,
              annotation: [
                "전체 후보 중 real 몫을 나눠",
                "ideal source probability 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`D^*(x)`,
              name: "Optimal discriminator",
              description:
                "고정 G와 충분한 function capacity에서의 pointwise optimum입니다.",
            },
          ]}
          assumptions={[
            "G가 고정되고 D가 objective를 충분히 최적화합니다.",
            "p_data와 p_g를 같은 dominating measure에서 비교합니다.",
          ]}
          interpretation="p_data=0.6, p_g=0.2면 D*=0.75입니다. 실제 network가 0.5를 냈다는 사실만으로 두 density가 같다고 결론 내리지는 않습니다."
        />
      </section>
      <section id="objective" className="space-y-6">
        <Header
          n="02"
          kicker="Generator의 방향"
          title="Non-saturating objective는 fake score가 낮을 때 더 강한 방향을 준다"
        />
        <Term
          name="Non-saturating generator objective"
          shape="−log D(G(z))"
          meaning="Generator가 만든 sample의 real score를 직접 높이도록 설계한 practical objective입니다."
          example="D=0.01이면 logit gradient magnitude가 약 0.99라 초기 signal이 강합니다."
          boundary="한 step의 gradient 개선이지 global convergence나 mode coverage 보장이 아닙니다."
        />
        <ExplainedFormula
          question="왜 D(G(z))에 negative log를 취할까요?"
          idea={
            <>
              낮은 real score에 큰 penalty를 주고, discriminator를 통과한 방향을
              generator까지 전달합니다. Log는 작은 probability 영역의 차이를
              강하게 드러냅니다.
            </>
          }
          formula={String.raw`\mathcal L_G^{\rm NS}=-\mathbb E_{z\sim p_z}\log D_\phi(G_\theta(z))`}
          annotatedFormula={String.raw`\begin{aligned}
\underbrace{s(z)=D_\phi(G_\theta(z))}_{\text{generated sample의 real score}}&\\
\underbrace{c(z)=-\log s(z)}_{\text{낮은 score를 큰 cost로 변환}}&\\
\mathcal L_G^{\rm NS}&=\underbrace{\mathbb E_z[c(z)]}_{\text{latent별 cost 평균}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`G_\theta(z)`,
              annotation: [
                "latent를 generated sample로 바꿔",
                "D가 평가할 data-space input 생성",
              ],
            },
            {
              expression: String.raw`-\log D_\phi(\cdot)`,
              annotation: [
                "낮은 real score를 큰 cost로 바꿔",
                "초기 generator signal 강화",
              ],
            },
            {
              expression: String.raw`\mathbb E_z[\cdot]`,
              annotation: [
                "latent sample별 cost를 평균해",
                "population objective 근사",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\phi`,
              name: "Discriminator parameters",
              description:
                "G step에서는 고정하지만 input gradient는 통과시킵니다.",
            },
          ]}
          assumptions={[
            "D와 G가 differentiable합니다.",
            "Mini-batch가 latent expectation을 근사합니다.",
          ]}
          interpretation="D=0.01에서 saturating magnitude는 약 0.01, non-saturating은 약 0.99입니다. 다음 글은 이 signal이 두 optimizer 사이에서 어떻게 이동하는지 다룹니다."
        />
        <AlgorithmBlock
          title="Minimax training — 한 iteration (수렴할 때까지 반복)"
          input={[
            "실제 데이터 분포에서 뽑을 수 있는 학습 데이터",
            "D의 parameter φ, G의 parameter θ (둘 다 무작위 초기화)",
          ]}
          steps={[
            {
              code: "for k steps:",
              note: "D를 G보다 더 자주 업데이트합니다 — D가 뒤처지면 G에게 줄 gradient 신호 자체가 부정확해집니다.",
            },
            {
              code: "  z_1..z_m ~ p(z), x_1..x_m ~ 학습 데이터",
              note: "각 m개씩 noise batch와 real batch를 독립적으로 샘플링합니다.",
            },
            {
              code: "  φ ← φ + η∇_φ (1/m)Σ[log D(x_i) + log(1−D(G(z_i)))]",
              note: "D를 real은 1에, fake는 0에 가깝게 만드는 방향으로 gradient ascent합니다.",
            },
            {
              code: "z_1..z_m ~ p(z)",
              note: "D 업데이트가 끝난 뒤 G 차례입니다 — 새 noise batch를 다시 샘플링합니다.",
            },
            {
              code: "θ ← θ + η∇_θ (1/m)Σ log D(G(z_i))",
              note: "Non-saturating 버전입니다 — log(1−D(G(z)))를 내리는 대신 log D(G(z))를 올리는 방향으로 gradient ascent해, D가 확신할 때(D≈0)도 G에게 강한 gradient가 남게 합니다.",
            },
          ]}
          output="학습된 G (data 분포를 근사하는 sampler)"
          repeatUntil="D와 G의 loss가 안정적인 균형에 도달하거나 sample quality metric(FID 등)이 더 개선되지 않을 때까지 반복합니다."
        />
        <CodeViewButton
          onClick={() =>
            sidebar.open(
              "minimax-training-loop",
              codeRefs["minimax-training-loop"],
            )
          }
        />
        <p className="leading-7">
          이제부터는 objective 하나가 아니라 update 순서를 봐야 합니다.{" "}
          <a
            className="font-semibold text-primary underline"
            href="/ai/gan-training-dynamics"
          >
            GAN training dynamics
          </a>
          에서 detach와 움직이는 상대를 이어갑니다.
        </p>
      </section>
      <section id="boundary" className="space-y-6">
        <Header
          n="03"
          kicker="여기서 아직 얻지 못한 것"
          title="Sampling contract와 density·inverse·convergence contract를 분리한다"
        />
        <ul className="space-y-3 leading-7">
          <li>
            — <strong>얻는 것:</strong> latent에서 data sample로 가는 fast
            forward path
          </li>
          <li>
            — <strong>얻지 못하는 것:</strong> exact likelihood와 arbitrary
            sample의 latent code
          </li>
          <li>
            — <strong>아직 판단하지 못하는 것:</strong> training convergence와
            target mode coverage
          </li>
        </ul>
        <div id="paper-original-gan">
          <CitationBlock
            source="Goodfellow et al. · Generative Adversarial Nets"
            citeKey={1}
            href={ORIGINAL}
          >
            <Evidence
              problem="Likelihood나 Markov chain 없이 generator distribution을 data distribution에 맞추는 문제"
              contribution="Generator·discriminator minimax game과 ideal optimal-discriminator 분석"
              assumptions="Arbitrary function capacity·fixed G·ideal D optimization"
              scope="원 논문의 proposition·algorithm·reported experiments"
              notClaim="Finite neural GAN의 global convergence나 calibrated density ratio를 보장하지 않음"
            />
          </CitationBlock>
        </div>
        <div data-viz="gan-foundation-concept-ladder">
          <ConceptLadderViz
            title="GAN 기초 개념은 이 순서로 조합된다"
            description="Sample path를 만든 뒤 source comparison과 generator signal을 붙이고, 아직 얻지 못한 contract를 분리합니다."
            steps={[
              { label: "Sample", detail: "z를 G로 보내 x̃ 생성" },
              { label: "Compare", detail: "real·fake source score" },
              { label: "Signal", detail: "−log score를 G로 전달" },
              { label: "Boundary", detail: "density·inverse·수렴은 별도" },
            ]}
          />
        </div>
        <ContentBoundary article="gan" />
      </section>
    </article>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "pytorch-examples": ganTree }}
        projectMetas={{
          "pytorch-examples": {
            id: "pytorch-examples",
            label: "PyTorch examples · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
function Header({
  n,
  kicker,
  title,
}: {
  n: string;
  kicker: string;
  title: string;
}) {
  return (
    <header>
      <p className="text-sm font-semibold text-primary">
        {n} · {kicker}
      </p>
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
