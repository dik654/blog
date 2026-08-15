import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import WassersteinConstraintViz from "./WassersteinConstraintViz";

export default function WassersteinCriticsArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section id="lipschitz" className="space-y-6">
        <Header
          n="00"
          title="Lipschitz 제약은 critic score가 입력 거리보다 너무 빨리 변하지 못하게 한다"
        />
        <p className="text-lg leading-8">
          Wasserstein critic을 이해하려면 먼저{" "}
          <strong>1-Lipschitz function</strong> 하나만 정의해야 합니다. Distance
          0.2인 두 입력의 score 차이는 0.2를 넘지 않아야 합니다.
        </p>
        <Term
          name="1-Lipschitz constraint"
          shape="|f(x)−f(y)|≤∥x−y∥₂"
          meaning="입력 변화량을 기준으로 output 변화의 최대 속도를 제한하는 function-level contract입니다."
          example="거리 0.2인데 score 차이가 0.3이면 constraint 위반입니다."
          boundary="몇 개 sampled point에서 gradient를 재는 것과 전체 domain의 부등식이 성립하는 것은 다릅니다."
        />
        <WassersteinConstraintViz />
        <ExplainedFormula
          question="왜 output difference를 input distance와 비교할까요?"
          idea={
            <>
              함수의 기울기를 직접 모든 곳에서 검사할 수 없으므로 두 점 사이
              변화율의 upper bound로 function이 만들 수 있는 score scale을
              고정합니다.
            </>
          }
          formula={String.raw`|f(x)-f(y)|\le L\lVert x-y\rVert_2`}
          annotatedFormula={String.raw`\begin{aligned}
\underbrace{d_f=|f(x)-f(y)|}_{\text{critic score 변화량}}&\\
\underbrace{b_x=L\lVert x-y\rVert_2}_{\text{input 거리로 만든 허용 budget}}&\\
d_f&\le b_x
\end{aligned}`}
          operations={[
            {
              expression: String.raw`f(x)-f(y)`,
              annotation: [
                "두 input의 critic score를 빼",
                "output 변화 magnitude 측정",
              ],
            },
            {
              expression: String.raw`L\lVert x-y\rVert_2`,
              annotation: [
                "input distance에 허용 slope를 곱해",
                "score 변화 upper budget 생성",
              ],
            },
            {
              expression: String.raw`|\Delta f|\le L\|\Delta x\|`,
              annotation: [
                "실제 score 변화를 budget과 비교해",
                "function smoothness 판정",
              ],
            },
          ]}
          terms={[
            {
              symbol: "L",
              name: "Lipschitz constant",
              description: "Output 변화율의 global upper bound입니다.",
            },
          ]}
          assumptions={[
            "x와 y는 같은 metric domain에 있습니다.",
            "L=1이면 1-Lipschitz입니다.",
          ]}
          interpretation="제약은 critic probability를 보정하는 것이 아니라 expectation gap을 의미 있는 거리 scale로 제한합니다."
        />
      </section>
      <section id="wasserstein-dual" className="space-y-6">
        <Header
          n="01"
          title="Wasserstein dual은 mass 이동 비용을 제한된 critic의 평균 차이로 바꾼다"
        />
        <Term
          name="Wasserstein-1 critic dual"
          shape="sup over 1-Lipschitz f"
          meaning="직접 transport plan을 모두 찾는 대신, 허용된 critic이 real과 generated distribution 사이에서 만들 수 있는 최대 expectation gap을 구합니다."
          example="Point mass δ₀와 δ₂에서는 f(x)=−x가 gap 2를 만들어 이동 거리 2에 도달합니다."
          boundary="Constraint가 없으면 cf로 scale을 키워 supremum이 발산합니다. Critic output은 sigmoid probability가 아닙니다."
        />
        <ExplainedFormula
          question="왜 expectation을 빼고 그중 supremum을 찾을까요?"
          idea={
            <>
              한 critic은 두 distribution을 한 scalar 방향으로 투영합니다.
              허용된 slope 안에서 가장 잘 벌리는 critic을 고르면 transport
              distance와 같은 값을 얻습니다.
            </>
          }
          formula={String.raw`W_1(p_r,p_g)=\sup_{\lVert f\rVert_L\le1}\left(\mathbb E_{p_r}f-\mathbb E_{p_g}f\right)`}
          annotatedFormula={String.raw`\begin{aligned}
\underbrace{r_f=\mathbb E_{p_r}f}_{\text{real 평균 score}}&\\
\underbrace{g_f=\mathbb E_{p_g}f}_{\text{generated 평균 score}}&\\
\Delta_f&=\underbrace{r_f-g_f}_{\text{두 distribution의 gap}}\\
W_1(p_r,p_g)&=\underbrace{\sup_{\lVert f\rVert_L\le1}\Delta_f}_{\text{slope 제한 안의 최대 gap}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbb E_{p_r}f-\mathbb E_{p_g}f`,
              annotation: [
                "같은 critic의 두 population 평균을 빼",
                "distribution separation 하나로 요약",
              ],
            },
            {
              expression: String.raw`\sup_{\|f\|_L\le1}`,
              annotation: [
                "허용 slope를 지키는 함수 중",
                "가장 큰 separation을 선택",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`W_1`,
              name: "Wasserstein-1 distance",
              description:
                "Unit mass를 옮기는 최소 transport cost와 연결됩니다.",
            },
          ]}
          assumptions={[
            "Kantorovich–Rubinstein dual 조건이 성립합니다.",
            "Neural critic은 ideal function supremum을 근사합니다.",
          ]}
          interpretation="δ₀와 δ₂에서 gap 2는 probability 차이가 아니라 mass를 거리 2만큼 옮기는 geometry를 반영합니다."
        />
        <div id="paper-wgan">
          <CitationBlock
            source="Arjovsky et al. · Wasserstein GAN"
            citeKey={1}
            href="https://arxiv.org/abs/1701.07875"
          >
            <Evidence
              problem="Support가 떨어진 distribution에서 유용한 generator signal을 만드는 문제"
              contribution="Wasserstein-1 topology와 1-Lipschitz critic objective 연결"
              assumptions="Metric·moment 조건과 constrained function family"
              scope="논문 정리·algorithm·reported experiments"
              notClaim="Weight clipping이 exact constraint이거나 collapse를 항상 제거하지 않음"
            />
          </CitationBlock>
        </div>
      </section>
      <section id="gradient-penalty" className="space-y-6">
        <Header
          n="02"
          title="Gradient penalty는 전체 공간이 아니라 sampled real–fake path의 slope를 잰다"
        />
        <Term
          name="WGAN gradient penalty"
          shape="λ(∥∇f(x̂)∥₂−1)²"
          meaning="Real과 fake 사이에서 뽑은 point x̂의 input-gradient norm이 1에서 벗어난 정도를 loss에 더합니다."
          example="Norm 1.5와 λ=10이면 penalty는 10×0.5²=2.5입니다."
          boundary="Sampled interpolation의 soft penalty이며 global 1-Lipschitz 증명이 아닙니다."
        />
        <ExplainedFormula
          question="왜 gradient norm에서 1을 빼고 square할까요?"
          idea={
            <>
              Target slope 1과의 signed deviation을 구한 뒤 square해 어느 방향의
              deviation도 양의 cost로 만들고 큰 위반을 더 세게 벌합니다.
            </>
          }
          formula={String.raw`\mathcal L_{\rm GP}=\lambda\,\mathbb E_{\widehat x}(\lVert\nabla_{\widehat x}f(\widehat x)\rVert_2-1)^2`}
          annotatedFormula={String.raw`\begin{aligned}
\underbrace{s(\widehat x)=\lVert\nabla_{\widehat x}f\rVert_2}_{\text{sampled 위치의 slope}}&\\
\underbrace{e(\widehat x)=(s(\widehat x)-1)^2}_{\text{target 1과의 square deviation}}&\\
\mathcal L_{\rm GP}&=\underbrace{\lambda\mathbb E_{\widehat x}[e(\widehat x)]}_{\text{평균 위반에 강도 적용}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\nabla_{\widehat x}f`,
              annotation: [
                "critic을 input으로 미분해",
                "sampled 위치의 local slope 계산",
              ],
            },
            {
              expression: String.raw`(\|\nabla f\|-1)^2`,
              annotation: [
                "target slope에서 벗어난 값을 square해",
                "양방향 위반을 positive penalty로 변환",
              ],
            },
            {
              expression: String.raw`\lambda\mathbb E[\cdot]`,
              annotation: [
                "sampled penalty를 평균·scale해",
                "adversarial loss에 더할 regularizer 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\widehat x`,
              name: "Interpolated sample",
              description: "Real과 fake를 이은 sampled point입니다.",
            },
          ]}
          assumptions={[
            "Interpolation distribution과 λ를 명시합니다.",
            "Input-gradient를 계산하는 추가 backward cost가 있습니다.",
          ]}
          interpretation="GP는 data-dependent local measurement입니다. 다음 spectral normalization은 weight operator에 직접 작용합니다."
        />
        <div id="paper-wgan-gp">
          <CitationBlock
            source="Gulrajani et al. · Improved Training of WGANs"
            citeKey={2}
            href="https://arxiv.org/abs/1704.00028"
          >
            <Evidence
              problem="Weight clipping의 capacity와 gradient pathology"
              contribution="Real–fake interpolation input-gradient penalty"
              assumptions="Sampled path·λ·critic update recipe"
              scope="논문 설정과 reported experiments"
              notClaim="전체 input space exact 1-Lipschitz 보장이 아님"
            />
          </CitationBlock>
        </div>
      </section>
      <section id="spectral-normalization" className="space-y-6">
        <Header
          n="03"
          title="Spectral normalization은 weight가 vector를 확대하는 최대 배율을 제한한다"
        />
        <Term
          name="Spectral normalization"
          shape="W̄=W/σmax(W)"
          meaning="Linear operator의 largest singular value로 weight를 나눠 layer-level L2 amplification을 1로 맞춥니다."
          example="diag(3,1)을 3으로 나누면 diag(1,1/3)이 됩니다."
          boundary="Power iteration은 근사이며 activation·residual·branch를 포함한 전체 network의 tight constant는 별도 회계가 필요합니다."
        />
        <ExplainedFormula
          question="왜 largest singular value로 weight 전체를 나눌까요?"
          idea={
            <>
              Largest singular value는 어떤 input direction을 가장 크게 늘리는
              비율입니다. 모든 direction에 같은 scale division을 적용하면 그
              최대 확대율이 1이 됩니다.
            </>
          }
          formula={String.raw`\overline W=\frac{W}{\sigma_{\max}(W)}`}
          annotatedFormula={String.raw`\overline W=\frac{\underbrace{W}_{\text{원래 linear map}}}{\underbrace{\sigma_{\max}(W)}_{\text{가장 큰 input 확대율}}}`}
          operations={[
            {
              expression: String.raw`\sigma_{\max}(W)`,
              annotation: [
                "모든 unit direction 중 최대 확대율을 찾아",
                "layer sensitivity scale 측정",
              ],
            },
            {
              expression: String.raw`W/\sigma_{\max}(W)`,
              annotation: [
                "weight의 모든 방향을 같은 값으로 줄여",
                "operator norm을 1로 정규화",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\overline W`,
              name: "Normalized weight",
              description: "Forward에 사용하는 rescaled operator입니다.",
            },
          ]}
          assumptions={[
            "Euclidean operator norm을 사용합니다.",
            "σmax estimate와 network composition을 별도로 검증합니다.",
          ]}
          interpretation="GP와 SN은 적용 위치·비용·보장이 다릅니다. 어느 쪽이든 generator 품질을 단독 보장하지 않습니다."
        />
        <div data-viz="gan-wasserstein-concept-ladder">
          <ConceptLadderViz
            title="Wasserstein critic은 function 제약을 두 구현으로 근사한다"
            description="먼저 허용할 함수의 형태를 고정하고 distance를 읽은 뒤, input path와 weight path의 제약을 비교합니다."
            steps={[
              { label: "Bound", detail: "1-Lipschitz function" },
              { label: "Measure", detail: "transport critic gap" },
              { label: "Input", detail: "sampled gradient penalty" },
              { label: "Weight", detail: "spectral normalization" },
            ]}
          />
        </div>
        <ContentBoundary article="gan-wasserstein-critics" />
      </section>
    </article>
  );
}
function Header({ n, title }: { n: string; title: string }) {
  return (
    <header>
      <p className="text-sm font-semibold text-primary">{n} · critic 제약</p>
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
