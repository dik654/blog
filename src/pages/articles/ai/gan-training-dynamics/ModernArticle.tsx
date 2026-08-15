import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import AdversarialDynamicsViz from "./AdversarialDynamicsViz";

export default function GanTrainingDynamicsArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section id="alternating" className="space-y-6">
        <Header
          n="00"
          title="먼저 D만 update하고, 다음에는 D를 통과해 G만 update한다"
        />
        <p className="text-lg leading-8">
          GAN에는 optimizer가 두 개 있습니다. 한 mini-batch 안에서도 무엇을
          고정하고 어느 parameter만 바꾸는지가 step의 의미를 결정합니다.
        </p>
        <Term
          name="Alternating adversarial optimization"
          shape="D step → G step → repeat"
          meaning="두 player가 서로 다른 loss와 parameter snapshot에서 번갈아 update하는 training protocol입니다."
          example="Batch 64라면 z는 64×128, G(z)는 64×3×64×64, D logit은 64×1처럼 흐릅니다."
          boundary="두 loss를 더해 하나의 고정 scalar objective를 내리는 과정으로 취급하지 않습니다."
        />
        <AdversarialDynamicsViz />
      </section>
      <section id="gradient-path" className="space-y-6">
        <Header
          n="01"
          title="Detach는 tensor를 버리는 것이 아니라 이번 step의 parameter 경계를 정한다"
        />
        <Term
          name="Detach boundary"
          shape="D step: G(z).detach() · G step: through D"
          meaning="D step에서는 generated value만 쓰고 G graph를 끊으며, G step에서는 D weight를 고정해도 D의 input gradient는 유지합니다."
          example="D output 전체를 detach하면 G가 받을 ∂loss/∂x̃도 끊겨 update가 사라집니다."
          boundary="freeze parameter와 detach activation을 같은 연산으로 혼동하지 않습니다."
        />
        <ExplainedFormula
          question="Discriminator가 만든 data-space 방향은 어떻게 generator parameter까지 갈까요?"
          idea={
            <>
              먼저 loss가 generated sample을 어느 방향으로 옮길지 계산합니다.
              Generator Jacobian의 transpose가 그 vector를 parameter 공간으로
              당겨옵니다.
            </>
          }
          formula={String.raw`\nabla_\theta\mathcal L_G=\mathbb E_z[J_{G_\theta}(z)^\top\nabla_{\widetilde x}\ell_D(\widetilde x)]`}
          annotatedFormula={String.raw`\begin{aligned}
\underbrace{v_x=\nabla_{\widetilde x}\ell_D}_{\text{D가 만든 sample 이동 방향}}&\\
\underbrace{J=J_{G_\theta}(z)}_{\text{generator local map}}&\\
\underbrace{g_\theta=J^\top v_x}_{\text{parameter로 pull back}}&\\
\nabla_\theta\mathcal L_G&=\underbrace{\mathbb E_z[g_\theta]}_{\text{latent별 gradient 평균}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\nabla_{\widetilde x}\ell_D`,
              annotation: [
                "D loss를 generated input으로 미분해",
                "sample이 움직일 data-space 방향 생성",
              ],
            },
            {
              expression: String.raw`J_G^\top v`,
              annotation: [
                "그 방향을 generator Jacobian과 합성해",
                "generator parameter별 update contribution 계산",
              ],
            },
            {
              expression: String.raw`\mathbb E_z[\cdot]`,
              annotation: [
                "latent별 contribution을 평균해",
                "mini-batch gradient 구성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`J_{G_\theta}`,
              name: "Generator Jacobian",
              description:
                "Parameter 변화가 generated sample을 바꾸는 local linear map입니다.",
            },
          ]}
          assumptions={[
            "G와 D가 해당 path에서 differentiable합니다.",
            "G step에서 D parameter는 고정되지만 input path는 연결됩니다.",
          ]}
          interpretation="Detach 위치는 memory trick이 아니라 어느 player가 어떤 signal을 소유하는지 정하는 계산 그래프 계약입니다."
        />
      </section>
      <section id="game-dynamics" className="space-y-6">
        <Header
          n="02"
          title="움직이는 상대 때문에 loss 감소와 game convergence는 다른 주장이다"
        />
        <Term
          name="Two-time-scale update"
          shape="aₙ/bₙ→0"
          meaning="한 player가 상대적으로 빠르게 현재 반응점에 적응하고, 느린 player가 그 반응을 따라간다고 보는 stochastic-approximation 분석입니다."
          example="G의 step sequence aₙ이 D의 bₙ보다 점점 작아지는 local analysis를 생각합니다."
          boundary="고정 Adam learning rate의 finite run이 정리의 감소 step-size·boundedness·stability 전제를 자동 만족하지 않습니다."
        />
        <ExplainedFormula
          question="왜 가장 단순한 bilinear game도 원점으로 곧장 내려가지 않을까요?"
          idea={
            <>
              x는 xy를 줄이고 y는 같은 xy를 키웁니다. 두 update 방향이 서로
              직교하듯 엮여서 equilibrium 주위를 회전할 수 있습니다.
            </>
          }
          formula={String.raw`x_{t+1}=x_t-\eta y_t,\qquad y_{t+1}=y_t+\eta x_t`}
          annotatedFormula={String.raw`\begin{aligned}x_{t+1}&=\underbrace{x_t}_{\text{현재 minimizer}}-\underbrace{\eta y_t}_{\text{상대 y가 정한 하강 방향}}\\y_{t+1}&=\underbrace{y_t}_{\text{현재 maximizer}}+\underbrace{\eta x_t}_{\text{상대 x가 정한 상승 방향}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`-\eta y_t`,
              annotation: [
                "현재 y가 만든 gradient를 빼",
                "min player x를 이동",
              ],
            },
            {
              expression: String.raw`+\eta x_t`,
              annotation: [
                "현재 x가 만든 gradient를 더해",
                "max player y를 반대 방향으로 이동",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\eta`,
              name: "Step size",
              description: "두 player update의 크기입니다.",
            },
          ]}
          assumptions={[
            "Objective는 min_x max_y xy인 bilinear local model입니다.",
            "Simultaneous fixed-step update를 사용합니다.",
          ]}
          interpretation="각 player가 자기 방향으로 올바르게 움직여도 joint state는 회전·발산할 수 있습니다. TTUR 결론도 stated conditions 아래 local stationary Nash 범위입니다."
        />
        <div id="paper-ttur">
          <CitationBlock
            source="Heusel et al. · Two Time-Scale Update Rule"
            citeKey={1}
            href="https://arxiv.org/abs/1706.08500"
          >
            <Evidence
              problem="두 stochastic player의 다른 update time scale과 local convergence를 분석"
              contribution="TTUR 조건과 local stationary Nash 분석"
              assumptions="감소 step-size·noise·bounded iterate·limiting ODE stability"
              scope="논문 정리와 reported GAN experiments"
              notClaim="고정-rate deep GAN의 global Nash 수렴 보장이 아님"
            />
          </CitationBlock>
        </div>
      </section>
      <section id="mode-collapse" className="space-y-6">
        <Header
          n="03"
          title="Mode collapse는 선명함이 아니라 target 영역을 덜 덮는 failure다"
        />
        <Term
          name="GAN mode collapse"
          shape="많은 z → 소수 output mode"
          meaning="서로 다른 latent가 비슷한 output 영역에 몰려 sample fidelity와 distribution coverage가 갈라진 상태입니다."
          example="같은 크기 8개 mode 중 10,000 sample의 95%가 2개에 몰리면 coverage failure를 의심합니다."
          boundary="중복 sample 한 쌍이나 oscillating loss만으로 확정하지 않고 mode count·recall·latent sensitivity를 함께 봅니다."
        />
        <p className="leading-7">진단은 세 줄로 나눕니다.</p>
        <ul className="space-y-3 leading-7">
          <li>
            — <strong>Quality:</strong> 각 sample이 target 영역 안에 있는가
          </li>
          <li>
            — <strong>Coverage:</strong> target의 여러 mode가 나타나는가
          </li>
          <li>
            — <strong>Dynamics:</strong> mode 분포가 step마다 이동하거나
            반복되는가
          </li>
        </ul>
        <p>
          Critic signal 자체를 다른 거리로 바꾸는 접근은{" "}
          <a
            className="font-semibold text-primary underline"
            href="/ai/gan-wasserstein-critics"
          >
            Wasserstein critic
          </a>
          에서 이어집니다.
        </p>
        <div data-viz="gan-training-concept-ladder">
          <ConceptLadderViz
            title="Training dynamics는 update 경계에서 failure 진단까지 이어진다"
            description="두 optimizer의 소유권을 고정한 뒤 gradient path와 game dynamics를 읽고 마지막에 coverage를 검사합니다."
            steps={[
              { label: "Alternate", detail: "D step과 G step 분리" },
              { label: "Pull back", detail: "D signal을 θ로 전달" },
              { label: "Dynamics", detail: "회전과 time scale" },
              { label: "Diagnose", detail: "quality·coverage 분리" },
            ]}
          />
        </div>
        <ContentBoundary article="gan-training-dynamics" />
      </section>
    </article>
  );
}
function Header({ n, title }: { n: string; title: string }) {
  return (
    <header>
      <p className="text-sm font-semibold text-primary">{n} · 학습 동역학</p>
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
