import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { TuningContractViz } from "./viz/ModernHpoViz";

export default function HyperparameterTuningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          튜닝은 숫자 찾기가 아니라 학습 절차를 공정하게 비교하는 실험입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>하이퍼파라미터</strong>는 training이 시작되기 전에 학습
            절차의 형태를 정하는 값입니다. Learning rate·depth·batch size가
            여기에 속합니다. 반면 <strong>parameter</strong>는 고정된 절차
            안에서 training data를 보고 바뀌는 weight입니다.
          </p>
          <p>
            튜닝에서는 configuration만 바뀌어야 합니다. Candidate마다
            split·metric·최대 update·seed 수가 다르면 어떤 조건이 성능 차이를
            만들었는지 분리할 수 없습니다. 따라서 search algorithm보다 먼저{" "}
            <em>trial 한 건</em>의 입력과 종료 조건을 고정합니다.
          </p>
        </div>
        <TermBreakdown
          title="튜닝 실험을 이루는 네 단위"
          items={[
            {
              term: "Configuration",
              description:
                "한 번의 학습 절차를 정하는 hyperparameter 묶음입니다.",
              example:
                "learning rate 3e-4, depth 12, optimizer AdamW를 한 묶음으로 봅니다.",
              boundary: "학습 뒤 얻는 model weight와 구분합니다.",
            },
            {
              term: "Trial",
              description:
                "Configuration 하나를 정해진 split·resource·seed policy로 평가한 실행입니다.",
              example:
                "20k updates 뒤 macro recall과 peak memory를 기록합니다.",
              boundary:
                "Retry는 같은 row를 덮어쓰지 않고 별도 attempt로 남깁니다.",
            },
            {
              term: "Study",
              description:
                "같은 목적과 search-space revision 아래 모인 trials와 제안 history입니다.",
              example:
                "40 trials, 6-hour budget, minimize validation loss를 하나의 study로 묶습니다.",
              boundary: "중간에 metric이나 범위를 바꾸면 새 revision입니다.",
            },
            {
              term: "Outer evaluation",
              description:
                "Configuration 선택에 사용하지 않은 data에서 고정된 최종 절차를 평가합니다.",
              example:
                "Validation에서 고른 설정을 untouched outer fold에서 세 seed로 재학습합니다.",
              boundary:
                "결과를 보고 다시 고치면 그 data도 selection data가 됩니다.",
            },
          ]}
        />
        <TuningContractViz />
        <ContentBoundary article="hyperparameter-tuning" />
      </section>

      <section id="selection-contract" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Validation은 후보를 고르고, outer data는 선택이 끝난 절차를 평가합니다
        </h2>
        <ExplainedFormula
          question="여러 configurations 중 무엇을 고르고 최종 위험은 어디에서 계산하나요?"
          idea={
            <p>
              같은 계약으로 실행한 후보 중 validation risk가 가장 작은 설정을
              선택합니다. 그 설정으로 고정한 procedure는 선택에 쓰지 않은 outer
              data에서 다시 평가합니다.
            </p>
          }
          formula={String.raw`\widehat\lambda=\arg\min_{\lambda\in\mathcal S_T}\widehat R_{\rm val}(A_\lambda),\quad \widehat R_{\rm final}=\widehat R_{\rm outer}(A_{\widehat\lambda})`}
          annotatedFormula={String.raw`\begin{aligned}c_\lambda&=\underbrace{\operatorname{cost}(\lambda)}_{\text{후보의 자원 사용량}}\\q_\lambda&=\underbrace{\mathbf1[c_\lambda\le T]}_{\text{전체 예산 통과 여부}}\\v_\lambda&=\underbrace{\widehat R_{\rm val}(A_\lambda)}_{\text{같은 validation risk}}\\\widehat\lambda&=\underbrace{\arg\min_{\lambda:q_\lambda=1}v_\lambda}_{\text{통과 후보 중 최소값 선택}}\\\widehat R_{\rm final}&=\underbrace{\widehat R_{\rm outer}(A_{\widehat\lambda})}_{\text{독립 data에서 최종 평가}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{cost}(\lambda)\le T`,
              annotation: [
                "trial 자원 사용량을 전체 예산과 비교해",
                "실제로 평가할 후보 집합을 제한",
              ],
            },
            {
              expression: String.raw`\arg\min_{\lambda\in\mathcal S_T}\widehat R_{\rm val}(A_\lambda)`,
              annotation: [
                "같은 validation risk들을 비교해",
                "선택할 configuration을 반환",
              ],
            },
            {
              expression: String.raw`\widehat R_{\rm outer}(A_{\widehat\lambda})`,
              annotation: [
                "선택된 설정을 고정하고",
                "사용하지 않은 data에서 final risk 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\lambda`,
              name: "Configuration",
              description: "한 trial을 규정하는 hyperparameter 묶음입니다.",
            },
            {
              symbol: String.raw`\mathcal S_T`,
              name: "Evaluated set",
              description: "예산 T 안에서 실제 관측한 후보 집합입니다.",
            },
            {
              symbol: String.raw`A_\lambda`,
              name: "Configured procedure",
              description:
                "설정만 다르고 split·metric·resource는 같은 학습 절차입니다.",
            },
            {
              symbol: String.raw`\widehat R_{\rm outer}`,
              name: "Outer risk",
              description: "선택에 사용하지 않은 evaluation data의 risk입니다.",
            },
          ]}
          assumptions={[
            "모든 trial이 같은 fold manifest·metric code·resource 단위를 사용합니다.",
            "Candidate 수가 늘면 best validation score의 우연한 낙관도 커질 수 있습니다.",
            "Outer score를 본 뒤 변경하면 새 독립 평가가 필요합니다.",
          ]}
          interpretation="Validation 0.183만 남기는 대신, 선택된 설정·총 40 trials·실패 내역·outer score 0.197을 한 receipt로 보존합니다."
        />
      </section>

      <section id="trial-budget" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Trial budget은 좋은 영역을 만날 가능성과 한 번의 비용을 함께 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Random search는 단순하지만 중요한 기준선입니다. 어떤 축만 결과에
            크게 영향을 준다면 grid처럼 중요하지 않은 축의 좌표를 반복하지 않고
            중요한 축에서 더 다양한 값을 봅니다. 다만 공간을 넓히면서 trial 수를
            그대로 두면 유망 영역의 확률 질량이 작아집니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 trial이 좋은 영역을 만날 확률이 p일 때 N회 중 한 번 이상 성공할 확률은 얼마인가요?"
          idea={
            <p>
              한 번 놓칠 확률을 먼저 구하고, 독립적인 N회가 모두 놓칠 확률을
              만든 뒤 전체 확률 1에서 뺍니다.
            </p>
          }
          formula={String.raw`P(\text{hit})=1-(1-p)^N`}
          annotatedFormula={String.raw`\begin{aligned}q&=\underbrace{1-p}_{\text{한 번의 miss 확률}}\\q_N&=\underbrace{q^N}_{\text{N회 모두 miss}}\\P_{\rm hit}&=\underbrace{1-q_N}_{\text{전부 실패한 경우 제거}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`1-p`,
              annotation: [
                "전체 probability mass에서 유망 영역을 빼",
                "한 번의 miss probability 계산",
              ],
            },
            {
              expression: String.raw`q^N`,
              annotation: [
                "독립 miss probability를 N번 곱해",
                "모든 trial이 실패할 확률 계산",
              ],
            },
            {
              expression: String.raw`1-q_N`,
              annotation: [
                "전체 경우에서 모두 놓친 경우를 빼",
                "적어도 한 번 hit할 확률 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "p",
              name: "Promising-region mass",
              description:
                "Sampling distribution에서 목표 이상 영역이 차지하는 확률입니다.",
            },
            {
              symbol: "N",
              name: "Independent trials",
              description:
                "같은 distribution에서 독립적으로 뽑은 후보 수입니다.",
            },
            {
              symbol: String.raw`q_N`,
              name: "All-miss probability",
              description: "N회가 모두 유망 영역 밖에 놓일 확률입니다.",
            },
          ]}
          assumptions={[
            "Trial draws가 독립이고 p가 고정된 단순 모델입니다.",
            "실제 p를 안다는 뜻이 아니라 budget 감각을 위한 계산입니다.",
            "Invalid configuration은 feasible space에서 제거하거나 별도 failure probability로 기록합니다.",
          ]}
          interpretation="p=.05라면 N=20의 hit probability는 약 64%, N=60은 약 95%입니다. Search algorithm 이름만 바꿔서는 작은 p를 보상할 수 없습니다."
        />
      </section>

      <section id="outer-evaluation" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          끝낼 조건까지 미리 써야 outer data가 마지막 시험으로 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            시작 전에 최대 trials·wall-clock·candidate families와 metric
            improvement tolerance를 적습니다. 종료 뒤에는 선택된 configuration을
            full budget·여러 seed로 재학습하고 outer report를 만듭니다. Outer
            결과가 마음에 들지 않아 search space를 바꾸면 새 study와 새 outer
            data를 열어야 합니다.
          </p>
          <p>
            다음 수업에서는 이 고정된 계약 안에서 과거 trial history를 이용해
            다음 후보를 제안하는{" "}
            <Link to="/ai/adaptive-hyperparameter-search">적응형 탐색</Link>을
            다룹니다.
          </p>
        </div>
        <div id="paper-random-search" className="scroll-mt-24">
          <CitationBlock
            source="Random Search for Hyper-Parameter Optimization"
            citeKey={1}
            href="https://www.jmlr.org/papers/v13/bergstra12a.html"
          >
            <strong>문제:</strong> grid가 중요하지 않은 축을 반복하는 낭비.{" "}
            <strong>기여:</strong> random search가 중요한 축에서 더 다양한 값을
            본다는 분석과 실험. <strong>전제:</strong> 논문의 search domains와
            tasks. <strong>근거 범위:</strong> JMLR 2012의 실험·GP 분석.{" "}
            <strong>과장 금지:</strong> 모든 objective에서 random이 최적이라는
            뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
