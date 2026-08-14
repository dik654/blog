import DistributionViz from "./viz/DistributionViz";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Distribution() {
  return (
    <section id="distribution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">분포는 전처리보다 데이터 생성 과정을 먼저 보여 준다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          타깃과 주요 피처의 분포를 보는 목적은 정규분포로 만드는 데 있지 않습니다.
          값이 어느 범위에 몰려 있는지, 서로 다른 집단이 섞였는지, 측정 한계나
          반올림 흔적이 있는지를 확인해 데이터가 만들어진 과정을 이해하는 것이
          먼저입니다. 회귀라면 타깃의 긴 꼬리가 손실에 어떤 영향을 주는지 보고,
          분류라면 class 비율과 label이 시간·source별로 달라지는지 확인합니다.
        </p>
        <p>
          소득이나 대기 시간처럼 오른쪽 꼬리가 긴 값에는 <code>log1p</code>,
          Box–Cox, Yeo–Johnson 같은 변환을 후보로 둘 수 있습니다. 다만 왜도가
          크다는 이유만으로 변환하지는 않습니다. 같은 split과 metric에서
          원본·변환 모델을 비교하고, 변환 파라미터는 training fold에서만
          추정해야 합니다. 타깃을 변환했다면 예측을 원래 단위로 되돌린 뒤
          business metric도 함께 확인합니다.
        </p>
      </div>
      <div className="not-prose my-8"><DistributionViz /></div>
      <ExplainedFormula
        question="오른쪽 꼬리가 긴 값에서 IQR로 확인할 후보 경계는 어떻게 계산할까요?"
        idea={<>가운데 50%를 덮는 Q3−Q1을 scale로 삼고, 양끝에서 그 1.5배보다 멀리 있는 값을 review 후보로 표시합니다. 이는 삭제 명령이 아니라 원자료와 생성 과정을 다시 볼 우선순위입니다.</>}
        formula={String.raw`\begin{aligned}
\operatorname{IQR}&=Q_3-Q_1,\\
Q_1=10,\ Q_3=30&\Rightarrow \operatorname{IQR}=20,\\
\text{review range}&=[10-1.5(20),\ 30+1.5(20)]\\
&=[-20,60].
\end{aligned}`}
        terms={[
          { symbol: "Q₁", name: "first quartile", description: "정렬한 sample의 아래 25% 경계입니다." },
          { symbol: "Q₃", name: "third quartile", description: "정렬한 sample의 아래 75% 경계입니다." },
          { symbol: "IQR", name: "interquartile range", description: "가운데 50% 폭으로 극단값에 덜 민감한 scale 요약입니다." },
        ]}
        assumptions={[
          "Quartile 계산 convention과 reference population·slice를 함께 고정합니다.",
          "1.5×IQR은 보편적 오류 판정이나 삭제 규칙이 아닙니다.",
          "Time·group마다 distribution이 다르면 전체 quartile만으로 판정하지 않습니다.",
        ]}
        interpretation="60보다 큰 값은 먼저 확인할 후보지만 실제 대형 주문일 수 있습니다. Source row·unit·업무 상한을 확인한 뒤 수정·제외·유지 결정을 기록합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>이상값은 오류와 드문 정상 사례를 구분한다</h3>
        <p>
          IQR이나 z-score는 확인할 행을 좁히는 진단 도구이지 삭제 규칙이
          아닙니다. 단위 오류, 센서 고장, 중복 집계처럼 데이터 계약을 위반한
          값은 수정하거나 제외할 수 있지만, 실제로 발생한 큰 지연이나 고액
          거래는 예측해야 할 신호일 수 있습니다. 이상값을 처리한 실험은 어떤
          규칙으로 몇 행이 바뀌었는지 기록하고, 처리 전후 성능을 같은
          validation split에서 비교합니다.
        </p>
        <p>
          트리 모델도 극단값에 완전히 무관하지 않습니다. 순서 기반 split이라
          선형 모델보다 민감도가 낮을 수 있지만, 잘못된 값이 분할 후보와 leaf
          통계를 바꿀 수 있습니다. 모델 종류로 결론을 대신하지 말고 오류
          여부와 validation 결과로 판단해야 합니다.
        </p>
      </div>
    </section>
  );
}
