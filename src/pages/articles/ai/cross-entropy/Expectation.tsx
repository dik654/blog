import ExpectationViz from './viz/ExpectationViz';
import ExpectDetailViz from './viz/ExpectDetailViz';

export default function Expectation({ title }: { title?: string }) {
  return (
    <section id="expectation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '기대값: 확률을 곱한 예상치'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        E[X] = Σ x·P(x) — 값과 확률의 곱을 합산한 예상치.<br />
        확률 분포가 다르면 같은 능력치라도 기대값이 달라진다.
      </p>
      <ExpectationViz />

      <h3 className="text-xl font-semibold mt-8 mb-3">기대값 심화: 정의 → 속성 → ML 활용</h3>
      <ExpectDetailViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Expectation이 확률의 핵심인 이유</p>
          <p>
            <strong>통계적 결정 이론</strong>:<br />
            - 최적 결정 = expected utility 최대화<br />
            - 불확실성 하의 reasoning = expectation<br />
            - Risk-neutral decision maker의 기준
          </p>
          <p className="mt-2">
            <strong>ML에서의 역할</strong>:<br />
            - 모든 loss function은 expectation<br />
            - Training = empirical expectation 최적화<br />
            - Generalization = true expectation 추정<br />
            - Gradient descent = expected gradient 추적
          </p>
          <p className="mt-2">
            <strong>직관 vs 수식</strong>:<br />
            - E[X]는 "장기 평균값" 직관<br />
            - 개별 관찰값은 E[X]와 다를 수 있음<br />
            - 표본 크기 증가 → 평균이 E[X]로 수렴 (LLN)<br />
            - 모델 훈련 = 대수의 법칙 활용
          </p>
        </div>
      </div>
    </section>
  );
}
