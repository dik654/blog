import ChainRuleViz from './viz/ChainRuleViz';

export default function ChainRule() {
  return (
    <section id="chain-rule" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">연쇄 법칙: 층별로 미분</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        전체 식을 한번에 미분하면 복잡 → 층별로 쪼개서 미분한 뒤 곱한다.<br />
        dL/dm = dL/dh × dh/dm — 역전파의 본질.
      </p>
      <ChainRuleViz />
    </section>
  );
}
