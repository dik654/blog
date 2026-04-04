import BottleneckViz from './viz/BottleneckViz';

export default function Limitations() {
  return (
    <section id="limitations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">한계와 발전</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        긴 문장을 같은 크기 벡터에 압축 → 정보 병목.<br />
        해결: Attention(Bahdanau 2015) → Self-Attention → Transformer → GPT/BERT.
      </p>
      <BottleneckViz />
    </section>
  );
}
