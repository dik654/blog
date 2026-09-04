import ExperimentDistributionViz from "./viz/ExperimentDistributionViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">확률은 모르는 값을 꾸미는 숫자가 아니라 반복되는 불확실성의 규칙이다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">같은 학습 코드를 실행해도 어떤 sample이 mini-batch에 들어오느냐에 따라 gradient가 달라집니다. 이 변화를 이해하려면 가능한 결과, 각 결과의 확률, 결과에 붙인 숫자, 그 숫자의 중심과 흩어짐을 구분해야 합니다. 각각 sample space·probability distribution·random variable·expectation·variance입니다.</p>
        <p>
            이 글은 동전과 작은 dataset처럼 셀 수 있는 예제로 시작합니다. Outcome·event·sample space를 정한 뒤 probability와 conditional
            probability를 계산하고 random variable로 결과를 수치화해 expectation·variance·sample mean으로 내려갑니다. 마지막에는 같은 언어로
            mini-batch gradient를 전체 gradient의 추정치로 읽습니다.
          </p>
        <p>
            글을 다 읽고 나면 독립 표본 평균의 variance가 왜 batch size에 반비례하는지뿐 아니라 분모가 0인 조건부확률과 상관된 batch처럼 그 결론을 적용할 수 없는
            경우도 설명할 수 있어야 합니다.
          </p>
      </div>
      <ExperimentDistributionViz />
    </section>
  );
}
