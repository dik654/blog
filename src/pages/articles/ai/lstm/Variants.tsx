import VariantsViz from './viz/VariantsViz';

export default function Variants() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LSTM 변형과 GRU</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        LSTM 이후 다양한 변형이 등장. GRU는 게이트를 줄여 효율을 높였다.
      </p>
      <VariantsViz />
    </section>
  );
}
