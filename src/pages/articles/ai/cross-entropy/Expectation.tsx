import ExpectationViz from './viz/ExpectationViz';

export default function Expectation({ title }: { title?: string }) {
  return (
    <section id="expectation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '기대값: 확률을 곱한 예상치'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        E[X] = Σ x·P(x) — 값과 확률의 곱을 합산한 예상치.<br />
        확률 분포가 다르면 같은 능력치라도 기대값이 달라진다.
      </p>
      <ExpectationViz />
    </section>
  );
}
