import DistributionViz from "./viz/DistributionViz";

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
