import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { AdaptiveSearchViz } from "../hyperparameter-tuning/viz/ModernHpoViz";

export default function AdaptiveHyperparameterSearchArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          적응형 탐색은 과거 trial을 다음 제안의 입력으로 쓰는 방법입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>적응형 탐색</strong>은 아직 실행하지 않은 configuration을
            무작위로만 고르지 않고, 이미 관측한 configuration·score·상태를
            이용해 다음 후보를 제안합니다. 그래서 먼저 “history 한 행에 무엇이
            있는가”를 이해해야 합니다.
          </p>
          <p>
            좋은 sampler도 비교 불가능한 score에서는 배울 수 없습니다. 각
            trial의 split·metric·resource가 다르면 history는 configuration의
            효과가 아니라 실험 조건의 차이를 섞어 놓은 표가 됩니다.
          </p>
        </div>
        <TermBreakdown
          title="제안 loop의 네 구성요소"
          items={[
            {
              term: "History",
              description:
                "Configuration·score·resource step·COMPLETE/PRUNED/FAIL/PENDING 상태를 시간 순서로 보존한 관측입니다.",
              example:
                "Trial 17은 4k updates에서 PRUNED, trial 18은 OOM으로 FAIL입니다.",
              boundary:
                "Score가 없는 이유를 임의의 나쁜 숫자로 바꾸지 않습니다.",
            },
            {
              term: "Surrogate",
              description:
                "관측된 configuration과 score 관계를 근사하는 내부 모델입니다.",
              example:
                "TPE는 score를 직접 회귀하기보다 good/other configuration densities를 만듭니다.",
              boundary: "실제 objective를 대신하는 정확한 법칙이 아닙니다.",
            },
            {
              term: "Acquisition",
              description:
                "현재 좋은 영역 활용과 불확실한 영역 탐색을 합쳐 다음 후보의 우선순위를 정합니다.",
              example:
                "Good density가 높고 other density가 낮은 후보를 우선합니다.",
              boundary: "Sampler마다 정의가 다릅니다.",
            },
            {
              term: "Proposal",
              description:
                "Search-space constraint를 통과해 실제 worker에 할당할 다음 configuration입니다.",
              example: "Study revision 3에서 trial 41을 worker 7에 배정합니다.",
              boundary:
                "동시에 제안된 pending trials는 서로의 결과를 아직 모릅니다.",
            },
          ]}
        />
        <AdaptiveSearchViz />
        <ContentBoundary article="adaptive-hyperparameter-search" />
      </section>

      <section id="proposal-loop" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          History를 읽고 acquisition이 가장 큰 후보를 고릅니다
        </h2>
        <ExplainedFormula
          question="과거 관측이 다음 configuration으로 어떻게 이어지나요?"
          idea={
            <p>
              비교 가능한 trial rows를 history로 묶고, 현재 surrogate가 계산한
              acquisition이 큰 feasible configuration을 선택합니다.
            </p>
          }
          formula={String.raw`\mathcal H_t=\{(\lambda_i,y_i,s_i)\}_{i=1}^t,\quad \lambda_{t+1}=\arg\max_{\lambda\in\Lambda_{\rm feasible}}a_t(\lambda\mid\mathcal H_t)`}
          annotatedFormula={String.raw`\begin{aligned}h_i&=\underbrace{(\lambda_i,y_i,s_i)}_{\text{trial 한 행}}\\\mathcal H_t&=\underbrace{\{h_1,\ldots,h_t\}}_{\text{제안 시점 history}}\\a_\lambda&=\underbrace{\operatorname{value}(\lambda\mid\mathcal H_t)}_{\text{다음 실행 가치}}\\\lambda_{t+1}&=\underbrace{\arg\max_{\lambda\in\Lambda_F}a_\lambda}_{\text{feasible 최고 후보 선택}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\{(\lambda_i,y_i,s_i)\}_{i=1}^{t}`,
              annotation: [
                "각 trial의 설정·관측·상태를 모아",
                "제안 시점의 evidence table 생성",
              ],
            },
            {
              expression: String.raw`\operatorname{value}(\lambda\mid\mathcal H_t)`,
              annotation: [
                "후보와 지금까지의 history를 결합해",
                "다음 실행의 활용·탐색 가치 계산",
              ],
            },
            {
              expression: String.raw`\arg\max_{\lambda\in\Lambda_{\rm feasible}}a_t(\lambda)`,
              annotation: [
                "constraint를 통과한 후보만 비교해",
                "다음 configuration 반환",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\mathcal H_t`,
              name: "Observed history",
              description: "t번째 제안 전까지 보이는 trials입니다.",
            },
            {
              symbol: String.raw`s_i`,
              name: "Trial state",
              description: "완료·중단·실패·실행 중 상태입니다.",
            },
            {
              symbol: String.raw`a_t`,
              name: "Acquisition",
              description: "다음 실행의 가치를 매기는 sampler 규칙입니다.",
            },
            {
              symbol: String.raw`\Lambda_{\rm feasible}`,
              name: "Feasible space",
              description:
                "Type·branch·resource constraint를 통과한 후보입니다.",
            },
          ]}
          assumptions={[
            "각 score가 같은 validation fixture와 resource에서 비교 가능합니다.",
            "Parallel workers는 pending 결과를 보지 못한 채 여러 후보를 제안할 수 있습니다.",
            "Retry는 새 attempt로 남겨 failure history를 보존합니다.",
          ]}
          interpretation="Sampler는 모델을 대신 학습하는 도구가 아니라, 같은 objective를 다음에 어떤 configuration으로 실행할지 결정하는 controller입니다."
        />
      </section>

      <section id="tpe" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          TPE는 좋은 결과에서 흔하고 나머지에서 드문 설정을 찾습니다
        </h2>
        <ExplainedFormula
          question="TPE의 density ratio는 왜 다음 후보를 고르는 데 쓰이나요?"
          idea={
            <p>
              관측 score를 quantile로 나눈 뒤 good trials의 configuration
              density와 나머지 density를 따로 추정합니다. Good에서 흔하면서
              other에서 드문 위치가 더 큰 비율을 얻습니다.
            </p>
          }
          formula={String.raw`\ell(\lambda)=p(\lambda\mid y<y^*),\quad g(\lambda)=p(\lambda\mid y\ge y^*),\quad \rho(\lambda)=\ell(\lambda)/g(\lambda)`}
          annotatedFormula={String.raw`\begin{aligned}G_i&=\underbrace{\mathbf1[y_i<y^*]}_{\text{good 관측 표시}}\\\ell_\lambda&=\underbrace{p(\lambda\mid G_i=1)}_{\text{good의 후보 밀도}}\\g_\lambda&=\underbrace{p(\lambda\mid G_i=0)}_{\text{other의 후보 밀도}}\\\rho_\lambda&=\underbrace{\frac{\ell_\lambda}{g_\lambda}}_{\text{good 대 other 비율}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\{i:y_i<y^*\}`,
              annotation: [
                "score threshold로 관측을 나눠",
                "good cohort의 index를 생성",
              ],
            },
            {
              expression: String.raw`p(\lambda\mid i\in\mathcal G)`,
              annotation: [
                "good cohort만 조건으로 걸어",
                "후보 configuration의 local density 추정",
              ],
            },
            {
              expression: String.raw`\ell(\lambda)/g(\lambda)`,
              annotation: [
                "good density를 other density로 나눠",
                "양쪽에서 모두 흔한 영역의 점수를 낮춤",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`y^*`,
              name: "Quantile threshold",
              description:
                "Good과 other observations를 나누는 score 경계입니다.",
            },
            {
              symbol: String.raw`\ell`,
              name: "Good density",
              description: "좋은 cohort에서 configuration이 나타날 밀도입니다.",
            },
            {
              symbol: "g",
              name: "Other density",
              description:
                "나머지 cohort에서 configuration이 나타날 밀도입니다.",
            },
            {
              symbol: String.raw`\rho`,
              name: "Density ratio",
              description: "두 밀도를 비교한 proposal preference입니다.",
            },
          ]}
          assumptions={[
            "Minimization 표기이며 maximization에서는 good 부등호가 바뀝니다.",
            "초기 관측이 적거나 noisy하면 density가 불안정합니다.",
            "실제 구현에는 prior·candidate count·multivariate option이 더 있습니다.",
          ]}
          interpretation="l=.30, g=.05라면 ratio는 6입니다. 이는 다음에 볼 가치가 높다는 뜻이지, 그 configuration이 인과적으로 최적이라는 증명은 아닙니다."
        />
      </section>

      <section id="parallel-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          도구 이름보다 제안 시점과 실패 상태를 재현해야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Optuna에서 Study는 optimization task와 history를 소유하고, Trial은
            실행 한 건입니다. Sampler는 proposal을 만들고 Pruner는 intermediate
            value로 중단을 제안하며 Storage는 여러 worker가 같은 history를 보게
            합니다. Version·sampler seed·parallelism·pending count가 달라지면
            같은 이름의 sampler도 다른 proposal sequence를 만들 수 있습니다.
          </p>
        </div>
        <div id="paper-optuna" className="scroll-mt-24">
          <CitationBlock
            source="Optuna: A Next-generation Hyperparameter Optimization Framework"
            citeKey={1}
            href="https://arxiv.org/abs/1907.10902"
          >
            <strong>문제:</strong> conditional space와 pruning을 유연하게
            구성하기 어려움. <strong>기여:</strong> define-by-run API와 study
            architecture. <strong>전제:</strong> 논문의 당시 tasks·versions.{" "}
            <strong>근거 범위:</strong> 시스템 설계와 보고된 experiments.{" "}
            <strong>과장 금지:</strong> 현재 모든 default 또는 sampler 우월성을
            보장하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-tpe" className="scroll-mt-24">
          <CitationBlock
            source="Algorithms for Hyper-Parameter Optimization"
            citeKey={2}
            href="https://papers.nips.cc/paper/4443-algorithms-for-hyper-parameter-optimization"
          >
            <strong>문제:</strong> tree-shaped conditional space의 sequential
            optimization. <strong>기여:</strong> p(configuration | score)를
            good/other로 나누는 TPE. <strong>전제:</strong> 논문의 density
            estimator와 domains. <strong>근거 범위:</strong> derivation과
            experiments. <strong>과장 금지:</strong> density ratio가 실제 causal
            importance를 뜻하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
