import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { MultiFidelityViz } from "../hyperparameter-tuning/viz/ModernHpoViz";

export default function MultiFidelityPruningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Pruning은 나쁜 trial 삭제가 아니라 자원을 단계적으로 재배분하는
          정책입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Fidelity</strong>는 한 configuration을 얼마나 깊게
            평가했는지를 나타내는 자원 좌표입니다. Multi-fidelity search는 많은
            후보를 낮은 fidelity에서 시작하고, 같은 좌표의 evidence로 일부만
            다음 단계에 보냅니다.
          </p>
          <p>
            핵심은 “epoch 1” 같은 이름이 아니라 비교 가능한 실제 자원입니다. 같은 epoch이라도 batch 32와 128은 update 수가 다릅니다. 고정해야 할 것은
            trial 사이에서 같은 진척을 뜻하는 좌표, 그러니까 processed tokens나 optimizer updates, data fraction 같은 값입니다.
          </p>
        </div>
        <TermBreakdown
          title="Pruning 전에 분리할 네 용어"
          items={[
            {
              term: "Resource coordinate",
              description:
                "Intermediate score를 관측하는 공통 진척 단위입니다.",
              example: "2k optimizer updates 또는 10M processed tokens입니다.",
              boundary:
                "같은 epoch라는 이름만으로 동일한 fidelity가 되지 않습니다.",
            },
            {
              term: "Rung",
              description:
                "모든 살아 있는 후보를 비교하는 사전 정의 resource checkpoint입니다.",
              example: "r, 3r, 9r updates에서 validation fixture를 실행합니다.",
              boundary: "서로 다른 step의 score를 한 순위표에 섞지 않습니다.",
            },
            {
              term: "Survivor",
              description:
                "현재 rung의 정책을 통과해 다음 resource를 받는 configuration입니다.",
              example: "27개 중 상위 9개가 3r로 이동합니다.",
              boundary:
                "중단은 configuration이 영원히 나쁘다는 증명이 아닙니다.",
            },
            {
              term: "False prune",
              description:
                "초기에는 뒤처졌지만 full budget에서는 채택 가능했을 후보를 일찍 중단한 사건입니다.",
              example:
                "Warmup이 긴 schedule이 r에서 탈락하지만 9r에서 최고가 됩니다.",
              boundary: "절약한 자원과 함께 측정해야 합니다.",
            },
          ]}
        />
        <MultiFidelityViz />
        <ContentBoundary article="multi-fidelity-pruning" />
      </section>

      <section id="successive-halving" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Successive halving은 후보 수를 η로 줄이고 자원을 η배 늘립니다
        </h2>
        <ExplainedFormula
          question="Rung가 올라갈 때 후보 수와 후보당 resource는 어떻게 변하나요?"
          idea={
            <p>
              각 단계에서 상위 1/η만 남기고 살아남은 configuration에 이전 단계의 η배 resource를 줍니다.
            </p>
          }
          formula={String.raw`n_j=\lfloor n_0\eta^{-j}\rfloor,\quad r_j=r_0\eta^j`}
          annotatedFormula={String.raw`\begin{aligned}n_j&=\underbrace{\left\lfloor\frac{n_0}{\eta^j}\right\rfloor}_{\substack{\text{rung마다 후보 수를}\eta\text{ 비율로 축소}}}\\r_j&=\underbrace{r_0\eta^j}_{\substack{\text{살아남은 후보의 resource를}\eta\text{ 배씩 확대}}}\\B_j&=\underbrace{n_jr_j}_{\text{각 rung의 전체 자원량 확인}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`n_0/\eta^j`,
              annotation: [
                "초기 후보 수를 rung별 감소율로 나눠",
                "현재 비교할 후보 수 계산",
              ],
            },
            {
              expression: String.raw`r_0\eta^j`,
              annotation: [
                "초기 resource에 rung별 배율을 곱해",
                "survivor 한 개의 평가 깊이 계산",
              ],
            },
            {
              expression: String.raw`n_jr_j`,
              annotation: [
                "후보 수와 후보당 resource를 곱해",
                "해당 rung의 총 budget 확인",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`n_0`,
              name: "Initial candidates",
              description: "첫 rung에서 시작하는 configurations 수입니다.",
            },
            {
              symbol: String.raw`r_0`,
              name: "Initial resource",
              description: "첫 intermediate evaluation까지의 자원입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "Reduction factor",
              description:
                "후보 축소와 resource 확대에 쓰는 1보다 큰 비율입니다.",
            },
            {
              symbol: "j",
              name: "Rung index",
              description: "0부터 시작하는 resource 단계입니다.",
            },
          ]}
          assumptions={[
            "같은 rung의 scores가 같은 validation fixture에서 비교 가능합니다.",
            "Early rank가 final rank와 어느 정도 연결됩니다.",
            "Checkpoint resume가 training semantics를 바꾸지 않습니다.",
          ]}
          interpretation="n0=27, r0=r, η=3이면 27@r → 9@3r → 3@9r입니다. Finalist는 이후 pruning 없이 full budget으로 다시 실행합니다."
        />
      </section>

      <section id="false-prune-audit" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          중단 정책도 model처럼 false negative를 측정해야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Completed pilot curves에 pruning policy를 사후 적용해 어떤 후보가 중단됐을지 계산합니다. 그중 final budget에서 채택 기준을 통과한
            후보가 false prune입니다. 실제로 pruned된 후보 일부도 shadow cohort로 끝까지 보내 정책의 blind spot을 확인합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Pruner가 놓친 late bloomer 비율은 어떻게 계산하나요?"
          idea={
            <p>
              정책이 중단했을 후보 중 full-budget 결과가 최종 채택 기준을 통과한 수를 세어 정책이 중단할 후보 수로 나눕니다.
            </p>
          }
          formula={String.raw`\widehat{\mathrm{FPR}}_{\rm prune}=\frac{\sum_i\mathbf1[P_i=1,F_i=1]}{\sum_i\mathbf1[P_i=1]}`}
          annotatedFormula={String.raw`\begin{aligned}P_i&=\underbrace{\mathbf1[\widehat y_i(r)<\tau_r]}_{\text{rung에서 중단 결정}}\\F_i&=\underbrace{\mathbf1[y_i(R)\ge\tau_F]}_{\text{full budget finalist}}\\N_m&=\underbrace{\sum_iP_iF_i}_{\text{놓친 finalist 수}}\\N_p&=\underbrace{\sum_iP_i}_{\text{전체 중단 수}}\\\widehat q_m&=\underbrace{\frac{N_m}{N_p}}_{\text{중단 중 miss 비율}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[\text{policy prunes }i]`,
              annotation: [
                "중간 score와 rule을 비교해",
                "중단 결정의 binary indicator 생성",
              ],
            },
            {
              expression: String.raw`P_iF_i`,
              annotation: [
                "중단 결정과 final feasibility를 함께 요구해",
                "false prune 사건만 표시",
              ],
            },
            {
              expression: String.raw`N_{\rm missed}/\sum_iP_i`,
              annotation: [
                "놓친 finalist 수를 전체 중단 수로 나눠",
                "pruning miss rate 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`P_i`,
              name: "Prune decision",
              description: "Policy가 trial i를 중단할지 나타냅니다.",
            },
            {
              symbol: String.raw`F_i`,
              name: "Finalist outcome",
              description:
                "Full budget 결과가 hard constraints와 quality 기준을 통과했는지 나타냅니다.",
            },
            {
              symbol: String.raw`N_{\rm missed}`,
              name: "Missed finalists",
              description: "중단 때문에 잃었을 채택 가능 후보 수입니다.",
            },
          ]}
          assumptions={[
            "Audit cohort 일부는 full budget까지 실행해 counterfactual outcome을 관측합니다.",
            "Finalist criterion은 pruning 결과를 보기 전에 고정합니다.",
            "Model family·schedule별 miss rate도 함께 확인합니다.",
          ]}
          interpretation="100개를 중단하고 그중 shadow-run 20개를 조사해 4개가 finalist였다면 관측 miss rate는 20%입니다. 표본 크기와 uncertainty도 함께 보고합니다."
        />
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          절약한 GPU 시간만큼 어떤 후보를 잃었는지도 report합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Release receipt에는 rung schedule·resource coordinate·pruner
            revision·grace period, COMPLETE/PRUNED/FAIL counts, 절약한
            updates·wall time, false-prune audit를 넣습니다. Finalists는 full
            budget·여러 seed·outer data에서 다시 확인합니다.
          </p>
        </div>
        <div id="paper-hyperband" className="scroll-mt-24">
          <CitationBlock
            source="Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization"
            citeKey={1}
            href="https://www.jmlr.org/papers/v18/16-558.html"
          >
            <strong>문제:</strong> configurations에 유한 resource를 어떻게
            나눌지의 문제. <strong>기여:</strong> 여러 bracket과 successive
            halving으로 폭과 깊이를 교환. <strong>전제:</strong> resource 증가가
            더 충실한 평가를 준다는 구조. <strong>근거 범위:</strong> 논문의
            tasks와 experiments. <strong>과장 금지:</strong> early rank가 final
            rank와 무관한 workload의 가속을 보장하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
