import AdamWViz from './viz/AdamWViz';

export default function AdamW() {
  return (
    <section id="adamw" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AdamW (Decoupled Weight Decay)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        L2 + Adam → 적응 스케일링이 decay를 약화시키는 문제.<br />
        AdamW — weight decay를 Adam 밖으로 분리. 현대 Transformer 학습의 표준.
      </p>
      <AdamWViz />
    </section>
  );
}
