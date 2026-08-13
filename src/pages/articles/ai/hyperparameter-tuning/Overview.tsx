import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import SearchEvolutionViz from "./viz/SearchEvolutionViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        튜닝은 좋은 숫자를 찾는 일이 아니라, 제한된 예산으로 학습 절차를 비교하는 실험입니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          모델이 학습하면서 바꾸는 weight를 <strong>parameter</strong>라고 하고, 사람이 학습 전에 정하는 learning rate·depth·batch
          size 같은 설정을 <strong>hyperparameter</strong>라고 합니다. 튜닝은 여러 설정을 학습시켜 validation score를 비교하는
          과정입니다. 따라서 같은 split·metric·training budget·seed policy를 사용하지 않으면 설정의 차이와 실험 조건의 차이가
          섞입니다.
        </p>
        <p>
          먼저 baseline 한 개를 끝까지 실행해 data pipeline과 metric을 검증합니다. 그다음 탐색할 parameter, 허용 범위, trial 수나
          wall-clock, 실패·재시도 규칙을 고정합니다. Validation에서 가장 좋은 trial을 고른 뒤에는 그 선택에 사용하지 않은 outer
          fold나 holdout에서 다시 평가해야 합니다. 같은 validation을 반복해서 보고 범위까지 바꾸었다면 그 데이터는 이미 탐색의
          일부가 되었기 때문입니다.
        </p>
      </div>

      <ExplainedFormula
        question="여러 trial 가운데 무엇을 고르고, 최종 성능은 어느 데이터에서 확인해야 할까요?"
        idea={<>각 설정을 같은 training procedure로 학습해 validation risk가 가장 작은 설정을 고릅니다. 선택 결과의 성능은 별도의 evaluation data에서 계산합니다.</>}
        formula={String.raw`\begin{aligned}
          \widehat\lambda
          &=\arg\min_{\lambda\in\mathcal S_T}
            \widehat R_{\mathrm{val}}(A_\lambda) \\
          \widehat R_{\mathrm{final}}
          &=\widehat R_{\mathrm{outer}}(A_{\widehat\lambda})
        \end{aligned}`}
        terms={[
          { symbol: "lambda", name: "hyperparameter configuration", description: "Learning rate·depth·optimizer처럼 한 trial을 규정하는 설정 묶음입니다." },
          { symbol: "S_T", name: "evaluated configurations", description: "정해진 예산 T 안에서 실제로 끝까지 또는 일부 평가한 설정 집합입니다." },
          { symbol: "A_lambda", name: "configured procedure", description: "설정 lambda를 사용하되 split·preprocessing·metric 계약은 동일한 학습 절차입니다." },
          { symbol: "outer", name: "independent evaluation", description: "Trial 선택과 search-space 수정에 사용하지 않은 outer fold 또는 holdout입니다." },
        ]}
        assumptions={[
          "모든 trial은 같은 fold manifest·metric implementation·최대 resource와 comparable seed policy를 사용합니다.",
          "Validation score의 최소값은 후보 수가 늘수록 우연히 좋아 보일 수 있으므로 final score로 보고하지 않습니다.",
          "Outer evaluation 뒤 다시 설정을 바꾸면 그 outer data도 선택에 사용된 것이므로 새 독립 평가가 필요합니다.",
        ]}
        interpretation="튜닝 결과는 ‘validation 0.183’ 하나가 아니라 선택된 설정, 탐색 예산, trial history, 독립 평가 0.197을 함께 가진 artifact입니다."
      />

      <ExplainedFormula
        question="좋은 영역이 전체 공간의 p만큼일 때 random search N회가 그 영역을 한 번 이상 만날 확률은 얼마일까요?"
        idea={<>한 trial이 좋은 영역을 놓칠 확률은 1−p이고, 독립적으로 N번 모두 놓칠 확률을 1에서 뺍니다. 탐색 예산과 성공 가능성을 직접 연결하는 가장 단순한 기준선입니다.</>}
        formula={String.raw`P(\text{at least one hit})=1-(1-p)^N`}
        terms={[
          { symbol: "p", name: "promising-region mass", description: "정의한 sampling distribution에서 목표 이상 성능을 내는 영역이 차지하는 확률 질량입니다." },
          { symbol: "N", name: "independent trials", description: "같은 분포에서 독립적으로 뽑은 random configurations 수입니다." },
          { symbol: "1-p", name: "miss probability", description: "한 번의 trial이 좋은 영역 밖에 놓일 확률입니다." },
        ]}
        assumptions={[
          "Trial sampling이 독립이고 p가 탐색 동안 변하지 않는 단순 모델입니다.",
          "좋은 영역의 p를 실제로 안다는 뜻이 아니라 budget 감각을 얻기 위한 계산입니다.",
          "Trial failure·conditional invalid configuration은 별도 확률로 기록하거나 feasible distribution에서 다시 계산합니다.",
        ]}
        interpretation="p=.05라면 20회 성공 확률은 약 64%, 60회는 약 95%입니다. Search algorithm 이름보다 범위와 trial budget이 먼저인 이유입니다."
      />

      <div className="not-prose my-8"><SearchEvolutionViz /></div>

      <div id="paper-random-search" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Random Search for Hyper-Parameter Optimization</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          핵심 아이디어는 여러 parameter 중 일부만 성능에 큰 영향을 준다면 grid가 중요하지 않은 축의 좌표를 반복하는 동안 random
          search는 중요한 축에서 더 많은 서로 다른 값을 시험한다는 것입니다. 논문은 신경망·DBN 실험과 Gaussian-process 분석으로
          이 현상을 보였으며, random search를 adaptive search의 기본 비교군으로 제안했습니다. 모든 함수에서 random search가 항상
          최적이라는 theorem으로 확대해서는 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.jmlr.org/papers/v13/bergstra12a.html" target="_blank" rel="noreferrer">논문의 실험 조건과 분석 보기</a>
      </div>

      <ContentBoundary article="hyperparameter-tuning" />
    </section>
  );
}
