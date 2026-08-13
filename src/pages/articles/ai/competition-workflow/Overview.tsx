import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import TimelineViz from "./viz/TimelineViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        대회의 첫 목표는 높은 점수가 아니라, 아직 보지 못한 정답에도 통할 검증 절차를 만드는 것입니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          예측 대회에서는 정답이 공개된 train data로 모델을 만들고, 정답을 볼 수 없는 test data의 예측을 제출합니다. 이때
          local validation과 public leaderboard는 모두 최종 정답을 완전히 대신하지 못하는 <strong>대리 측정값</strong>입니다.
          따라서 먼저 한 행이 뜻하는 대상, 예측해야 하는 시점, metric의 계산 단위와 더 좋은 방향을 한 장의 평가 계약으로
          고정해야 합니다.
        </p>
        <p>
          그다음 순서는 EDA에서 정보 경계를 찾고, 원본 입력부터 제출까지 재현되는 baseline을 만든 뒤, 같은 검증 조건에서
          한 가설씩 비교하는 것입니다. 마지막에는 가장 높은 숫자 하나가 아니라 평균·흔들림·오류 다양성·재현 비용을 함께
          보고 후보를 좁힙니다. 교차검증의 splitter 자체는 <a href="/ai/cross-validation">교차검증 글</a>, metric의 정의는{" "}
          <a href="/ai/evaluation-metrics">평가지표 글</a>이 자세히 다룹니다.
        </p>
      </div>

      <ExplainedFormula
        question="같은 validation score를 여러 번 보고 최고 후보를 고르면 왜 실제보다 좋아 보일 수 있을까요?"
        idea={
          <>
            후보마다 측정 오차가 섞여 있는데 최댓값을 고르면, 실력뿐 아니라 우연히 유리한 오차까지 함께 선택됩니다. 이를
            model-selection optimism이라고 하며, 후보 수와 적응적 반복이 늘수록 별도의 최종 평가가 중요해집니다.
          </>
        }
        formula={String.raw`\hat{j}=\arg\max_j(\mu_j+\varepsilon_j),\qquad \mathbb{E}\!\left[\max_j(\mu_j+\varepsilon_j)\right]\ge \max_j\mu_j`}
        terms={[
          { symbol: "j", name: "candidate", description: "Feature·model·seed·hyperparameter가 정해진 하나의 후보입니다." },
          { symbol: "mu_j", name: "true expected score", description: "같은 모집단에서 반복 평가했을 때 후보 j가 낼 평균 성능입니다." },
          { symbol: "epsilon_j", name: "measurement noise", description: "유한한 validation sample·fold·seed에서 생기는 측정 오차입니다." },
          { symbol: "j-hat", name: "selected candidate", description: "관측 validation score가 가장 높아 선택된 후보입니다." },
        ]}
        assumptions={[
          "각 후보의 측정 오차 평균이 0이라는 단순한 비교 모형입니다. 실제 adaptive search에서는 후보와 validation data가 의존할 수 있습니다.",
          "부등식은 평균적인 낙관 가능성을 말할 뿐, 모든 대회와 모든 한 번의 실행에서 gap이 반드시 양수라는 뜻은 아닙니다.",
          "후보를 고른 validation과 최종 성능을 보고할 test 또는 private 평가를 분리합니다.",
        ]}
        interpretation="진짜 점수가 같은 후보가 많아도 관측값 중 최대는 대체로 0보다 큽니다. 그래서 0.001 상승 하나보다 fold별 paired delta와 독립된 최종 평가를 더 신뢰해야 합니다."
      />

      <div className="not-prose my-8">
        <TimelineViz />
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          이 글을 따라가며 남길 핵심 산출물은 다섯 개입니다. 평가 계약, split manifest, baseline artifact, 실험 decision log,
          최종 submission manifest입니다. 이 파일들이 연결되면 점수가 오른 이유뿐 아니라 private score가 달라졌을 때 어디부터
          점검해야 하는지도 설명할 수 있습니다.
        </p>
      </div>

      <ContentBoundary article="competition-workflow" />
    </section>
  );
}
