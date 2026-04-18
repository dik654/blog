import AdamWViz from './viz/AdamWViz';
import AdamWDetailViz from './viz/AdamWDetailViz';

export default function AdamW() {
  return (
    <section id="adamw" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AdamW (Decoupled Weight Decay)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        L2 + Adam → 적응 스케일링이 decay를 약화시키는 문제.<br />
        AdamW — weight decay를 Adam 밖으로 분리. 현대 Transformer 학습의 표준.
      </p>
      <AdamWViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">AdamW 상세</h3>
        <AdamWDetailViz />
        <p className="leading-7">
          AdamW: <strong>decoupled weight decay (outside Adam update)</strong>.<br />
          Transformers/BERT/GPT의 표준 옵티마이저.<br />
          lr=1e-3, weight_decay=0.01-0.1, warmup+cosine.
        </p>
      </div>
    </section>
  );
}
