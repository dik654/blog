import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import CVOverviewViz from "./viz/CVOverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        교차검증은 데이터를 여러 조각으로 나누는 기술이 아니라, 앞으로 만날 예측 상황을 과거 데이터에서 재연하는 실험입니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          모델을 배포하면 학습에 없던 입력을 만납니다. 그런데 “새 입력”의 뜻은 문제마다 다릅니다. 같은 사용자의 다음 클릭일
          수도 있고, 처음 보는 환자일 수도 있으며, 다음 달의 수요일일 수도 있습니다. 이 질문을 먼저 정하지 않고 random split을
          적용하면 현실보다 쉬운 문제를 평가할 수 있습니다.
        </p>
        <p>
          따라서 첫 문장에는 <strong>평가 단위</strong>, <strong>독립 단위</strong>, <strong>시간 방향</strong>,{" "}
          <strong>학습 절차</strong>를 적습니다. 예를 들어 “기존 병원의 과거 환자 기록으로 학습한 절차가 새 병원의 미래 환자
          한 명에게 내는 loss”를 추정하려면 patient와 hospital을 어떻게 분리할지, 어느 시점까지의 label이 학습에 사용 가능한지
          함께 정해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Validation score가 대신 추정해야 하는 실제 배포 성능을 어떻게 적을까요?"
        idea={
          <>
            학습 절차 A가 과거 데이터 D로 모델을 만들고, 배포 분포에서 새 단위 Z가 왔을 때 내는 loss의 평균을 목표로 둡니다.
            Split은 이 Z가 현실에서 무엇인지 모사하도록 설계합니다.
          </>
        }
        formula={String.raw`R_{\mathrm{deploy}}(A)=\mathbb{E}_{D\sim P_{\mathrm{train}},\,Z\sim P_{\mathrm{deploy}}}\!\left[\ell\!\left(A(D),Z\right)\right]`}
        terms={[
          { symbol: "A", name: "learning procedure", description: "전처리·feature fit·model fit·threshold 선택까지 포함한 학습 절차입니다." },
          { symbol: "D", name: "training data", description: "학습 시점에 실제로 이용 가능한 데이터입니다." },
          { symbol: "Z", name: "deployment unit", description: "배포 후 성능을 알고 싶은 새 환자·entity·시점 같은 평가 단위입니다." },
          { symbol: "ell", name: "loss", description: "예측 하나의 오류를 수치로 바꾸는 함수이며 작을수록 좋게 둡니다." },
        ]}
        assumptions={[
          "P_train과 P_deploy가 무엇인지 문제 문장과 timestamp/group metadata로 구체화해야 합니다.",
          "실제 배포 분포가 계속 변하면 한 번의 CV가 영구적인 성능을 보장하지 않으므로 monitoring과 재검증이 필요합니다.",
          "Accuracy처럼 클수록 좋은 metric은 loss=1−accuracy처럼 방향을 맞추거나 metric 방향을 명시합니다.",
        ]}
        interpretation="새 행을 예측하는 배포라면 K-fold가 후보일 수 있지만, 새 환자라면 patient group split, 미래라면 walk-forward가 목표 Z를 더 가깝게 재연합니다."
      />

      <div className="not-prose my-8">
        <CVOverviewViz />
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Fold assignment는 seed만 남기는 대신 row ID·group ID·time range가 들어 있는 manifest로 저장합니다. Scaler, vocabulary,
          imputer, feature selector와 target encoding도 각 fold의 train 부분에서만 fit해야 합니다. Test label을 보지 않았더라도
          validation 전체로 transform을 미리 학습했다면 validation 정보가 train 계산에 들어간 것입니다.
        </p>
      </div>

      <ContentBoundary article="cross-validation" />
    </section>
  );
}
